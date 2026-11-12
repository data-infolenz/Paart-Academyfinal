import { table } from "remix/data-table"
import { col, type InferInsert, type InferSelect } from "./helpers"

export const PAGE_KINDS = ["static_page", "collection_template"] as const
export type PageKind = (typeof PAGE_KINDS)[number]

export const PAGE_STATUSES = ["draft", "published"] as const
export type PageStatus = (typeof PAGE_STATUSES)[number]

function serializeJsonField(val: unknown): unknown {
  if (val !== undefined && val !== null && typeof val !== "string") {
    return JSON.stringify(val)
  }
  return val
}

export const pages = table({
  name: "pages",
  columns: {
    id: col.text().primaryKey(),
    slug: col.text().notNull().unique(),
    title: col.text().notNull(),
    kind: col.text<PageKind>().notNull().default("static_page"),
    status: col.text<PageStatus>().notNull().default("draft"),
    is_system: col.boolean().notNull().default(false),
    draft_blocks: col.json<unknown[]>().notNull().default([]),
    published_blocks: col.json<unknown[]>().notNull().default([]),
    seo: col.json<Record<string, unknown>>().notNull().default({}),
    version: col.integer().notNull().default(1),
    published_version: col.integer().notNull().default(0),
    updated_by: col.text().nullable(),
    published_by: col.text().nullable(),
    published_at: col.timestamp().nullable(),
    created_at: col.timestamp().notNull().defaultNow(),
    updated_at: col.timestamp().notNull().defaultNow()
  },
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  beforeWrite({ value }) {
    const next: Record<string, unknown> = { ...value }
    if ("draft_blocks" in next) next.draft_blocks = serializeJsonField(next.draft_blocks)
    if ("published_blocks" in next) {
      next.published_blocks = serializeJsonField(next.published_blocks)
    }
    if ("seo" in next) next.seo = serializeJsonField(next.seo)
    return { value: next as typeof value }
  }
})

export const pageRevisions = table({
  name: "page_revisions",
  columns: {
    id: col.text().primaryKey(),
    page_id: col.text().notNull(),
    version: col.integer().notNull(),
    blocks: col.json<unknown[]>().notNull().default([]),
    seo: col.json<Record<string, unknown>>().notNull().default({}),
    diff_patch: col.json<unknown[]>().notNull().default([]),
    note: col.text().notNull().default(""),
    created_by: col.text().nullable(),
    created_at: col.timestamp().notNull().defaultNow()
  },
  beforeWrite({ value }) {
    const next: Record<string, unknown> = { ...value }
    if ("blocks" in next) next.blocks = serializeJsonField(next.blocks)
    if ("seo" in next) next.seo = serializeJsonField(next.seo)
    if ("diff_patch" in next) next.diff_patch = serializeJsonField(next.diff_patch)
    return { value: next as typeof value }
  }
})

export const siteChrome = table({
  name: "site_chrome",
  columns: {
    id: col.text().primaryKey(),
    utility_bar: col.json<Record<string, unknown>>().notNull().default({}),
    header_nav: col.json<unknown[]>().notNull().default([]),
    header_ctas: col.json<Record<string, unknown>>().notNull().default({}),
    footer_columns: col.json<unknown[]>().notNull().default([]),
    trust_profile: col.json<Record<string, unknown>>().notNull().default({}),
    version: col.integer().notNull().default(1),
    updated_by: col.text().nullable(),
    updated_at: col.timestamp().notNull().defaultNow()
  },
  beforeWrite({ value }) {
    const next: Record<string, unknown> = { ...value }
    if ("utility_bar" in next) next.utility_bar = serializeJsonField(next.utility_bar)
    if ("header_nav" in next) next.header_nav = serializeJsonField(next.header_nav)
    if ("header_ctas" in next) next.header_ctas = serializeJsonField(next.header_ctas)
    if ("footer_columns" in next) next.footer_columns = serializeJsonField(next.footer_columns)
    if ("trust_profile" in next) next.trust_profile = serializeJsonField(next.trust_profile)
    return { value: next as typeof value }
  }
})

export type PageRow = InferSelect<typeof pages>
export type NewPageRow = InferInsert<typeof pages>
export type PageRevisionRow = InferSelect<typeof pageRevisions>
export type NewPageRevisionRow = InferInsert<typeof pageRevisions>
export type SiteChromeRow = InferSelect<typeof siteChrome>
export type NewSiteChromeRow = InferInsert<typeof siteChrome>
