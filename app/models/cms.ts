import {
  apply as applyJsonPatch,
  diff as diffJsonPatch,
  type JSONValue,
  type Operation
} from "@sdxc/json-patch"
import { isSuccess } from "@sdxc/result"
import { generateUUID } from "@sdxc/uuid/v7"
import * as s from "remix/data-schema"
import {
  CMS_CHROME_KEY,
  cmsPageKey,
  getCmsCache,
  purgeChromeCache,
  purgePageCache
} from "~/app/initializers/cms-cache"
import { db as defaultDb, type PaartDb } from "~/app/initializers/database"
import { appConfig } from "~/config/app"
import {
  DEFAULT_PAGES,
  DEFAULT_SITE_CHROME,
  type DefaultPageSeed,
  findDefaultPageBySlug
} from "~/config/default-pages"
import {
  type PageKind,
  type PageRevisionRow,
  pageRevisions,
  type PageRow,
  pages,
  type PageStatus,
  siteChrome,
  type SiteChromeRow,
  siteSettings,
  users
} from "~/database/schema"
import {
  createDefaultBlock,
  type PageBlock,
  pageSeoSchema,
  type PageSeo,
  parsePageBlocksSafe,
  siteChromeSchema,
  type SiteChromeConfig,
  validateCampaignSlug
} from "./cms-schemas"
import type { SiteSettings } from "./settings"

export interface ResolvedCmsPage {
  id: string
  slug: string
  title: string
  kind: PageKind
  status: PageStatus
  isSystem: boolean
  isDraftPreview: boolean
  version: number
  publishedVersion: number
  seo: PageSeo
  rawBlocks: unknown[]
  updatedAt: string
  publishedAt: string | null
}

export interface AdminPageSummary {
  id: string
  slug: string
  title: string
  kind: PageKind
  status: PageStatus
  isSystem: boolean
  version: number
  publishedVersion: number
  hasUnpublishedChanges: boolean
  seo: PageSeo
  draftBlockCount: number
  publishedBlockCount: number
  updatedAt: Date
  publishedAt: Date | null
}

export interface AdminPageDetail extends AdminPageSummary {
  draftBlocks: PageBlock[]
  publishedBlocks: PageBlock[]
  skippedDraftBlocks: number
}

export interface PageRevisionSummary {
  id: string
  pageId: string
  version: number
  blocks: PageBlock[]
  seo: PageSeo
  diffOpsCount: number
  note: string
  createdBy: string | null
  authorName: string
  authorEmail: string
  createdAt: Date
}

function normalizeSeo(rawSeo: unknown, fallbackTitle: string, fallbackSlug: string): PageSeo {
  const parsed = s.parseSafe(pageSeoSchema, rawSeo)
  if (parsed.success) return parsed.value
  return {
    title: fallbackTitle || "PAART Academy",
    description: "",
    canonicalPath: fallbackSlug.startsWith("/") ? fallbackSlug : "",
    ogImage: "",
    noindex: false
  }
}

function mapSeedToResolvedPage(seed: DefaultPageSeed): ResolvedCmsPage {
  return {
    id: seed.id,
    slug: seed.slug,
    title: seed.title,
    kind: seed.pageKind,
    status: "published",
    isSystem: seed.isSystem,
    isDraftPreview: false,
    version: 1,
    publishedVersion: 1,
    seo: seed.seo,
    rawBlocks: seed.blocks,
    updatedAt: new Date(0).toISOString(),
    publishedAt: new Date(0).toISOString()
  }
}

function mapPageRowToResolved(row: PageRow, useDraft: boolean): ResolvedCmsPage {
  const seo = normalizeSeo(row.seo, row.title, row.slug)
  const rawBlocks = useDraft
    ? Array.isArray(row.draft_blocks)
      ? row.draft_blocks
      : []
    : Array.isArray(row.published_blocks)
      ? row.published_blocks
      : []

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    kind: row.kind,
    status: row.status,
    isSystem: Boolean(row.is_system),
    isDraftPreview: useDraft,
    version: row.version ?? 1,
    publishedVersion: row.published_version ?? 0,
    seo,
    rawBlocks,
    updatedAt:
      row.updated_at instanceof Date ? row.updated_at.toISOString() : String(row.updated_at),
    publishedAt:
      row.published_at instanceof Date
        ? row.published_at.toISOString()
        : row.published_at
          ? String(row.published_at)
          : null
  }
}

function mapChromeRow(row: SiteChromeRow): { chrome: SiteChromeConfig; version: number } {
  const candidate = {
    utilityBar: row.utility_bar,
    headerNav: row.header_nav,
    headerCtas: row.header_ctas,
    footerColumns: row.footer_columns,
    trustProfile: row.trust_profile
  }
  const parsed = s.parseSafe(siteChromeSchema, candidate)
  if (parsed.success) {
    return { chrome: parsed.value, version: row.version ?? 1 }
  }
  return { chrome: DEFAULT_SITE_CHROME, version: row.version ?? 1 }
}

export function chromeToSiteSettings(chrome: SiteChromeConfig): SiteSettings {
  return {
    siteName: chrome.trustProfile.shortName,
    phone: chrome.trustProfile.phone,
    whatsapp: chrome.trustProfile.whatsapp,
    email: chrome.trustProfile.email,
    addressPrimary: chrome.trustProfile.addressPrimary,
    addressSecondary: chrome.trustProfile.addressSecondary,
    hours: chrome.trustProfile.hours,
    seoTitle: `${chrome.trustProfile.shortName} | TNPSC, TNUSRB & Competitive Exam Coaching in Puliyangudi`,
    seoDescription: chrome.trustProfile.summary,
    canonicalUrl: appConfig.PAART_PUBLIC_URL
  }
}

export async function getSiteChrome(options?: {
  bypassCache?: boolean
  targetDb?: PaartDb
}): Promise<{ chrome: SiteChromeConfig; version: number }> {
  const targetDb = options?.targetDb ?? defaultDb
  const loadFromDb = async (): Promise<{ chrome: SiteChromeConfig; version: number }> => {
    try {
      const row = await targetDb.find(siteChrome, "default")
      if (!row) {
        return { chrome: DEFAULT_SITE_CHROME, version: 1 }
      }
      return mapChromeRow(row)
    } catch {
      return { chrome: DEFAULT_SITE_CHROME, version: 1 }
    }
  }

  if (options?.bypassCache) {
    return loadFromDb()
  }

  const cached = await getCmsCache().fetch(CMS_CHROME_KEY, loadFromDb, { ttl: "10m" })
  if (isSuccess(cached)) {
    return cached.data as { chrome: SiteChromeConfig; version: number }
  }
  return { chrome: DEFAULT_SITE_CHROME, version: 1 }
}

export async function updateSiteChrome(
  input: unknown,
  actorUserId: string,
  options?: { expectedVersion?: number; targetDb?: PaartDb }
): Promise<
  | { status: "ok"; chrome: SiteChromeConfig; version: number }
  | { status: "invalid"; message: string }
  | { status: "conflict"; currentVersion: number }
> {
  const parsed = s.parseSafe(siteChromeSchema, input)
  if (!parsed.success) {
    return {
      status: "invalid",
      message: parsed.issues[0]?.message ?? "Invalid site navigation or footer configuration."
    }
  }

  const targetDb = options?.targetDb ?? defaultDb
  const now = new Date()
  const existing = await targetDb.find(siteChrome, "default")

  if (
    existing &&
    options?.expectedVersion !== undefined &&
    existing.version !== options.expectedVersion
  ) {
    return { status: "conflict", currentVersion: existing.version }
  }

  const nextVersion = existing ? existing.version + 1 : 1
  if (existing) {
    await targetDb.update(siteChrome, "default", {
      utility_bar: parsed.value.utilityBar,
      header_nav: parsed.value.headerNav,
      header_ctas: parsed.value.headerCtas,
      footer_columns: parsed.value.footerColumns,
      trust_profile: parsed.value.trustProfile,
      version: nextVersion,
      updated_by: actorUserId,
      updated_at: now
    })
  } else {
    await targetDb.create(siteChrome, {
      id: "default",
      utility_bar: parsed.value.utilityBar,
      header_nav: parsed.value.headerNav,
      header_ctas: parsed.value.headerCtas,
      footer_columns: parsed.value.footerColumns,
      trust_profile: parsed.value.trustProfile,
      version: nextVersion,
      updated_by: actorUserId,
      updated_at: now
    })
  }

  // Keep legacy site_settings row synchronized for helpers reading getSiteSettings()
  try {
    const existingSettings = await targetDb.find(siteSettings, "default")
    if (existingSettings) {
      await targetDb.update(siteSettings, "default", {
        site_name: parsed.value.trustProfile.shortName,
        phone: parsed.value.trustProfile.phone,
        whatsapp: parsed.value.trustProfile.whatsapp,
        email: parsed.value.trustProfile.email,
        address_primary: parsed.value.trustProfile.addressPrimary,
        address_secondary: parsed.value.trustProfile.addressSecondary,
        hours: parsed.value.trustProfile.hours,
        updated_at: now
      })
    }
  } catch {
    // Non-fatal if site_settings sync fails
  }

  await purgeChromeCache()
  return { status: "ok", chrome: parsed.value, version: nextVersion }
}

export async function resolvePublicPage(
  slug: string,
  options?: { previewDraft?: boolean; isAdmin?: boolean; targetDb?: PaartDb }
): Promise<ResolvedCmsPage | null> {
  const targetDb = options?.targetDb ?? defaultDb
  const allowDraftPreview = Boolean(options?.previewDraft && options?.isAdmin)

  if (allowDraftPreview) {
    try {
      const row = await targetDb.findOne(pages, { where: { slug } })
      if (row) {
        return mapPageRowToResolved(row, true)
      }
      const fallback = findDefaultPageBySlug(slug)
      return fallback ? { ...mapSeedToResolvedPage(fallback), isDraftPreview: true } : null
    } catch {
      const fallback = findDefaultPageBySlug(slug)
      return fallback ? { ...mapSeedToResolvedPage(fallback), isDraftPreview: true } : null
    }
  }

  const loadPublished = async (): Promise<ResolvedCmsPage | null> => {
    try {
      const row = await targetDb.findOne(pages, { where: { slug } })
      if (!row) {
        const fallback = findDefaultPageBySlug(slug)
        return fallback && fallback.pageKind === "static_page"
          ? mapSeedToResolvedPage(fallback)
          : null
      }
      if (row.status !== "published" || row.kind !== "static_page") {
        return null
      }
      return mapPageRowToResolved(row, false)
    } catch {
      const fallback = findDefaultPageBySlug(slug)
      return fallback && fallback.pageKind === "static_page"
        ? mapSeedToResolvedPage(fallback)
        : null
    }
  }

  const cached = await getCmsCache().fetch(cmsPageKey(slug), loadPublished, { ttl: "10m" })
  if (isSuccess(cached)) {
    return cached.data as ResolvedCmsPage | null
  }
  return null
}

export async function resolveCollectionTemplate(
  templateSlug: "template:course-detail" | "template:blog-detail",
  options?: { previewDraft?: boolean; isAdmin?: boolean; targetDb?: PaartDb }
): Promise<ResolvedCmsPage> {
  const targetDb = options?.targetDb ?? defaultDb
  const allowDraftPreview = Boolean(options?.previewDraft && options?.isAdmin)
  const defaultTemplate = findDefaultPageBySlug(templateSlug)!

  if (allowDraftPreview) {
    try {
      const row = await targetDb.findOne(pages, { where: { slug: templateSlug } })
      if (row) return mapPageRowToResolved(row, true)
    } catch {
      // Fallback below
    }
    return { ...mapSeedToResolvedPage(defaultTemplate), isDraftPreview: true }
  }

  const loadTemplate = async (): Promise<ResolvedCmsPage> => {
    try {
      const row = await targetDb.findOne(pages, { where: { slug: templateSlug } })
      if (row && row.status === "published") {
        return mapPageRowToResolved(row, false)
      }
    } catch {
      // Fallback below
    }
    return mapSeedToResolvedPage(defaultTemplate)
  }

  const cached = await getCmsCache().fetch(cmsPageKey(templateSlug), loadTemplate, { ttl: "10m" })
  if (isSuccess(cached)) {
    return cached.data as ResolvedCmsPage
  }
  return mapSeedToResolvedPage(defaultTemplate)
}

export async function listPublishedIndexablePages(options?: {
  targetDb?: PaartDb
}): Promise<Array<{ slug: string; title: string; seo: PageSeo; updatedAt: string }>> {
  const targetDb = options?.targetDb ?? defaultDb
  try {
    const rows = await targetDb.findMany(pages, {
      where: { kind: "static_page", status: "published" },
      orderBy: [["slug", "asc"]]
    })
    if (rows.length === 0) {
      return DEFAULT_PAGES.filter((p) => p.pageKind === "static_page" && !p.seo.noindex).map(
        (p) => ({
          slug: p.slug,
          title: p.title,
          seo: p.seo,
          updatedAt: new Date().toISOString().slice(0, 10)
        })
      )
    }
    return rows
      .map((row) => {
        const seo = normalizeSeo(row.seo, row.title, row.slug)
        return {
          slug: row.slug,
          title: row.title,
          seo,
          updatedAt:
            row.updated_at instanceof Date
              ? row.updated_at.toISOString().slice(0, 10)
              : String(row.updated_at).slice(0, 10)
        }
      })
      .filter((item) => !item.seo.noindex)
  } catch {
    return DEFAULT_PAGES.filter((p) => p.pageKind === "static_page" && !p.seo.noindex).map((p) => ({
      slug: p.slug,
      title: p.title,
      seo: p.seo,
      updatedAt: new Date().toISOString().slice(0, 10)
    }))
  }
}

function hasDraftDiff(row: PageRow): boolean {
  if (row.status === "draft") return true
  try {
    return (
      diffJsonPatch(
        (row.published_blocks ?? []) as JSONValue,
        (row.draft_blocks ?? []) as JSONValue
      ).length > 0
    )
  } catch {
    return JSON.stringify(row.published_blocks) !== JSON.stringify(row.draft_blocks)
  }
}

export async function listAllPagesForAdmin(options?: {
  targetDb?: PaartDb
}): Promise<AdminPageSummary[]> {
  const targetDb = options?.targetDb ?? defaultDb
  const rows = await targetDb.findMany(pages, {
    orderBy: [
      ["is_system", "desc"],
      ["slug", "asc"]
    ]
  })
  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    kind: row.kind,
    status: row.status,
    isSystem: Boolean(row.is_system),
    version: row.version ?? 1,
    publishedVersion: row.published_version ?? 0,
    hasUnpublishedChanges: hasDraftDiff(row),
    seo: normalizeSeo(row.seo, row.title, row.slug),
    draftBlockCount: Array.isArray(row.draft_blocks) ? row.draft_blocks.length : 0,
    publishedBlockCount: Array.isArray(row.published_blocks) ? row.published_blocks.length : 0,
    updatedAt: row.updated_at instanceof Date ? row.updated_at : new Date(String(row.updated_at)),
    publishedAt: row.published_at
      ? row.published_at instanceof Date
        ? row.published_at
        : new Date(String(row.published_at))
      : null
  }))
}

export async function findPageById(
  pageId: string,
  options?: { targetDb?: PaartDb }
): Promise<AdminPageDetail | null> {
  const targetDb = options?.targetDb ?? defaultDb
  const row = await targetDb.find(pages, pageId)
  if (!row) return null

  const draftSummary = parsePageBlocksSafe(row.draft_blocks)
  const pubSummary = parsePageBlocksSafe(row.published_blocks)

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    kind: row.kind,
    status: row.status,
    isSystem: Boolean(row.is_system),
    version: row.version ?? 1,
    publishedVersion: row.published_version ?? 0,
    hasUnpublishedChanges: hasDraftDiff(row),
    seo: normalizeSeo(row.seo, row.title, row.slug),
    draftBlockCount: draftSummary.validBlocks.length,
    publishedBlockCount: pubSummary.validBlocks.length,
    draftBlocks: draftSummary.validBlocks,
    publishedBlocks: pubSummary.validBlocks,
    skippedDraftBlocks: draftSummary.skippedCount,
    updatedAt: row.updated_at instanceof Date ? row.updated_at : new Date(String(row.updated_at)),
    publishedAt: row.published_at
      ? row.published_at instanceof Date
        ? row.published_at
        : new Date(String(row.published_at))
      : null
  }
}

export async function listPageRevisions(
  pageId: string,
  options?: { targetDb?: PaartDb }
): Promise<PageRevisionSummary[]> {
  const targetDb = options?.targetDb ?? defaultDb
  const rows: PageRevisionRow[] = await targetDb.findMany(pageRevisions, {
    where: { page_id: pageId },
    orderBy: [["version", "desc"]]
  })
  if (rows.length === 0) return []

  const authorIds = Array.from(
    new Set(rows.map((r) => r.created_by).filter((id): id is string => Boolean(id)))
  )
  const authorMap = new Map<string, { fullName: string; email: string }>()
  for (const uid of authorIds) {
    const userRow = await targetDb.find(users, uid)
    if (userRow) {
      authorMap.set(uid, { fullName: userRow.full_name, email: userRow.email })
    }
  }

  return rows.map((r) => {
    const author = r.created_by ? authorMap.get(r.created_by) : undefined
    const parsedBlocks = parsePageBlocksSafe(r.blocks)
    return {
      id: r.id,
      pageId: r.page_id,
      version: r.version,
      blocks: parsedBlocks.validBlocks,
      seo: normalizeSeo(r.seo, "Revision", ""),
      diffOpsCount: Array.isArray(r.diff_patch) ? r.diff_patch.length : 0,
      note: r.note,
      createdBy: r.created_by,
      authorName: author?.fullName ?? "Administrator",
      authorEmail: author?.email ?? "",
      createdAt: r.created_at instanceof Date ? r.created_at : new Date(String(r.created_at))
    }
  })
}

export async function createCampaignPage(
  input: {
    title: string
    slug?: string
    seoTitle?: string
    seoDescription?: string
  },
  actorUserId: string,
  options?: { targetDb?: PaartDb }
): Promise<
  { status: "ok"; pageId: string; slug: string } | { status: "invalid"; message: string }
> {
  const title = input.title.trim()
  if (title.length < 3) {
    return { status: "invalid", message: "Page title must be at least 3 characters." }
  }

  const rawSlug = input.slug?.trim() || title
  const slugValidation = validateCampaignSlug(rawSlug)
  if (!slugValidation.ok) {
    return { status: "invalid", message: slugValidation.error }
  }

  const targetDb = options?.targetDb ?? defaultDb
  const existing = await targetDb.findOne(pages, { where: { slug: slugValidation.slug } })
  if (existing) {
    return {
      status: "invalid",
      message: `A page with slug "${slugValidation.slug}" already exists.`
    }
  }

  const now = new Date()
  const pageId = `page-${generateUUID()}`
  const starterBanner = createDefaultBlock("page_banner", "blk-banner")
  if (starterBanner.type === "page_banner") {
    starterBanner.data.title = title
    starterBanner.data.breadcrumbs = [{ label: title, href: "" }]
  }
  const starterProse = createDefaultBlock("rich_prose", "blk-overview")
  const starterCallout = createDefaultBlock("callout_band", "blk-cta")
  const starterBlocks: PageBlock[] = [starterBanner, starterProse, starterCallout]

  const seo: PageSeo = {
    title: input.seoTitle?.trim() || `${title} | PAART Academy`,
    description:
      input.seoDescription?.trim() ||
      `Official ${title} announcement, batch details, and registration information from PAART Academy, Puliyangudi.`,
    canonicalPath: slugValidation.slug,
    ogImage: "",
    noindex: false
  }

  await targetDb.create(pages, {
    id: pageId,
    slug: slugValidation.slug,
    title,
    kind: "static_page",
    status: "draft",
    is_system: false,
    draft_blocks: starterBlocks,
    published_blocks: [],
    seo,
    version: 1,
    published_version: 0,
    updated_by: actorUserId,
    published_by: null,
    published_at: null,
    created_at: now,
    updated_at: now
  })

  return { status: "ok", pageId, slug: slugValidation.slug }
}

export async function savePageDraft(
  pageId: string,
  input: {
    title: string
    seo: unknown
    blocks: unknown
    expectedVersion: number
  },
  actorUserId: string,
  options?: { targetDb?: PaartDb }
): Promise<
  | { status: "ok"; version: number }
  | { status: "not_found" }
  | { status: "conflict"; currentVersion: number }
  | { status: "invalid"; message: string }
> {
  const targetDb = options?.targetDb ?? defaultDb
  const row = await targetDb.find(pages, pageId)
  if (!row) return { status: "not_found" }

  if (row.version !== input.expectedVersion) {
    return { status: "conflict", currentVersion: row.version }
  }

  const title = input.title.trim()
  if (title.length < 2) {
    return { status: "invalid", message: "Page title must be at least 2 characters." }
  }

  const parsedSeo = s.parseSafe(pageSeoSchema, input.seo)
  if (!parsedSeo.success) {
    return {
      status: "invalid",
      message: parsedSeo.issues[0]?.message ?? "Invalid SEO configuration."
    }
  }

  const blockCheck = parsePageBlocksSafe(input.blocks)
  if (blockCheck.skippedCount > 0) {
    const firstIssue = blockCheck.issues[0]
    return {
      status: "invalid",
      message: `Block #${(firstIssue?.index ?? 0) + 1} (${firstIssue?.blockId}): ${firstIssue?.message}`
    }
  }

  const nextVersion = row.version + 1
  await targetDb.update(pages, pageId, {
    title,
    seo: parsedSeo.value,
    draft_blocks: blockCheck.validBlocks,
    version: nextVersion,
    updated_by: actorUserId,
    updated_at: new Date()
  })

  return { status: "ok", version: nextVersion }
}

export async function patchPageDraftBlocks(
  pageId: string,
  operations: readonly Operation[],
  expectedVersion: number,
  actorUserId: string,
  options?: { targetDb?: PaartDb }
): Promise<
  | { status: "ok"; version: number; blocks: PageBlock[] }
  | { status: "not_found" }
  | { status: "conflict"; currentVersion: number }
  | { status: "invalid"; message: string }
> {
  const targetDb = options?.targetDb ?? defaultDb
  const row = await targetDb.find(pages, pageId)
  if (!row) return { status: "not_found" }

  const currentSummary = parsePageBlocksSafe(row.draft_blocks)
  const envelope: JSONValue = {
    version: row.version,
    blocks: currentSummary.validBlocks as unknown as JSONValue
  }

  const patchWithGuard: Operation[] = [
    { op: "test", path: "/version", value: expectedVersion },
    ...operations
  ]

  const applied = applyJsonPatch(envelope, patchWithGuard)
  if (!isSuccess(applied)) {
    if (row.version !== expectedVersion) {
      return { status: "conflict", currentVersion: row.version }
    }
    return { status: "invalid", message: applied.error.message }
  }

  const patchedEnvelope = applied.data as { version: number; blocks: unknown }
  const validated = parsePageBlocksSafe(patchedEnvelope.blocks)
  if (validated.skippedCount > 0) {
    return {
      status: "invalid",
      message: validated.issues[0]?.message ?? "Patched block configuration is invalid."
    }
  }

  const nextVersion = row.version + 1
  await targetDb.update(pages, pageId, {
    draft_blocks: validated.validBlocks,
    version: nextVersion,
    updated_by: actorUserId,
    updated_at: new Date()
  })

  return { status: "ok", version: nextVersion, blocks: validated.validBlocks }
}

export async function publishPage(
  pageId: string,
  actorUserId: string,
  note = "",
  options?: { expectedVersion?: number; targetDb?: PaartDb }
): Promise<
  | { status: "ok"; publishedVersion: number; revisionId: string }
  | { status: "not_found" }
  | { status: "conflict"; currentVersion: number }
  | { status: "invalid"; message: string }
> {
  const targetDb = options?.targetDb ?? defaultDb
  const row = await targetDb.find(pages, pageId)
  if (!row) return { status: "not_found" }

  if (options?.expectedVersion !== undefined && row.version !== options.expectedVersion) {
    return { status: "conflict", currentVersion: row.version }
  }

  const draftCheck = parsePageBlocksSafe(row.draft_blocks)
  if (draftCheck.skippedCount > 0) {
    return {
      status: "invalid",
      message: `Cannot publish malformed draft block: ${draftCheck.issues[0]?.message}`
    }
  }
  if (draftCheck.validBlocks.length === 0) {
    return {
      status: "invalid",
      message: "Add at least one block before publishing this page."
    }
  }

  const seo = normalizeSeo(row.seo, row.title, row.slug)
  const prevPublished = Array.isArray(row.published_blocks) ? row.published_blocks : []
  const diffOps = diffJsonPatch(
    prevPublished as JSONValue,
    draftCheck.validBlocks as unknown as JSONValue
  )

  const now = new Date()
  const nextPublishedVersion = (row.published_version ?? 0) + 1
  const nextVersion = row.version + 1
  const revisionId = `rev-${generateUUID()}`

  await targetDb.update(pages, pageId, {
    status: "published",
    published_blocks: draftCheck.validBlocks,
    seo,
    version: nextVersion,
    published_version: nextPublishedVersion,
    updated_by: actorUserId,
    published_by: actorUserId,
    published_at: now,
    updated_at: now
  })

  await targetDb.create(pageRevisions, {
    id: revisionId,
    page_id: pageId,
    version: nextPublishedVersion,
    blocks: draftCheck.validBlocks,
    seo,
    diff_patch: diffOps,
    note: note.trim() || `Published revision v${nextPublishedVersion}`,
    created_by: actorUserId,
    created_at: now
  })

  await purgePageCache(row.slug)
  return { status: "ok", publishedVersion: nextPublishedVersion, revisionId }
}

export async function restorePageRevision(
  pageId: string,
  revisionId: string,
  actorUserId: string,
  options?: { targetDb?: PaartDb }
): Promise<
  { status: "ok"; publishedVersion: number; restoredFromVersion: number } | { status: "not_found" }
> {
  const targetDb = options?.targetDb ?? defaultDb
  const row = await targetDb.find(pages, pageId)
  if (!row) return { status: "not_found" }

  const rev = await targetDb.find(pageRevisions, revisionId)
  if (!rev || rev.page_id !== pageId) {
    return { status: "not_found" }
  }

  const restoredBlocks = parsePageBlocksSafe(rev.blocks).validBlocks
  const restoredSeo = normalizeSeo(rev.seo, row.title, row.slug)
  const prevPublished = Array.isArray(row.published_blocks) ? row.published_blocks : []
  const diffOps = diffJsonPatch(prevPublished as JSONValue, restoredBlocks as unknown as JSONValue)

  const now = new Date()
  const nextPublishedVersion = (row.published_version ?? 0) + 1
  const nextVersion = row.version + 1

  await targetDb.update(pages, pageId, {
    status: "published",
    draft_blocks: restoredBlocks,
    published_blocks: restoredBlocks,
    seo: restoredSeo,
    version: nextVersion,
    published_version: nextPublishedVersion,
    updated_by: actorUserId,
    published_by: actorUserId,
    published_at: now,
    updated_at: now
  })

  await targetDb.create(pageRevisions, {
    id: `rev-${generateUUID()}`,
    page_id: pageId,
    version: nextPublishedVersion,
    blocks: restoredBlocks,
    seo: restoredSeo,
    diff_patch: diffOps,
    note: `Restored from revision v${rev.version}`,
    created_by: actorUserId,
    created_at: now
  })

  await purgePageCache(row.slug)
  return {
    status: "ok",
    publishedVersion: nextPublishedVersion,
    restoredFromVersion: rev.version
  }
}

export async function deleteCampaignPage(
  pageId: string,
  options?: { targetDb?: PaartDb }
): Promise<
  | { status: "ok"; deletedSlug: string }
  | { status: "not_found" }
  | { status: "forbidden_system_page" }
> {
  const targetDb = options?.targetDb ?? defaultDb
  const row = await targetDb.find(pages, pageId)
  if (!row) return { status: "not_found" }
  if (row.is_system) return { status: "forbidden_system_page" }

  await targetDb.delete(pages, pageId)
  await purgePageCache(row.slug)
  return { status: "ok", deletedSlug: row.slug }
}
