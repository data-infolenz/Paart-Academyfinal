import { createLanguage } from "@sdxc/expression"
import { isSuccess } from "@sdxc/result"
import { slugify } from "@sdxc/strings"
import { generateUUID } from "@sdxc/uuid/v7"
import * as s from "remix/data-schema"

export const visibilityLanguage = createLanguage()

const str = (fallback = "") => s.defaulted(s.string(), fallback).transform((v) => v.trim())

const requiredStr = (minLen = 1, message = "Required field") =>
  str("").refine((v) => v.length >= minLen, message)

function parseSingleBool(v: boolean | string | number): boolean {
  if (typeof v === "boolean") return v
  if (typeof v === "number") return v !== 0
  return ["true", "1", "on", "yes"].includes(v.trim().toLowerCase())
}

export const boolField = (fallback = true) =>
  s.defaulted(
    s
      .union([
        s.boolean(),
        s.string(),
        s.number(),
        s.array(s.union([s.boolean(), s.string(), s.number()]))
      ])
      .transform((v) => {
        if (Array.isArray(v)) {
          const last = v[v.length - 1]
          return last === undefined ? fallback : parseSingleBool(last)
        }
        return parseSingleBool(v)
      }),
    fallback
  )

export const intField = (fallback = 0, min = 0, max = 500) =>
  s.defaulted(
    s
      .union([s.number(), s.string()])
      .transform((v) => (typeof v === "number" ? Math.trunc(v) : Number.parseInt(v.trim(), 10)))
      .refine(
        (n) => Number.isFinite(n) && n >= min && n <= max,
        `Must be between ${min} and ${max}`
      ),
    fallback
  )

export const safeHrefSchema = requiredStr(1, "Link URL is required").refine(
  (href) =>
    href.startsWith("/") ||
    href.startsWith("#") ||
    href.startsWith("https://") ||
    href.startsWith("http://") ||
    href.startsWith("tel:") ||
    href.startsWith("mailto:"),
  "URL must be a relative path (/...) or safe http(s)/tel/mailto link"
)

const optionalSafeHrefSchema = str("").refine(
  (href) =>
    href === "" ||
    href.startsWith("/") ||
    href.startsWith("#") ||
    href.startsWith("https://") ||
    href.startsWith("http://") ||
    href.startsWith("tel:") ||
    href.startsWith("mailto:"),
  "URL must be empty, a relative path (/...), or a safe http(s)/tel/mailto link"
)

function parseIsoBoundMs(dateLiteral: string, op: string): number | null {
  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(dateLiteral)
  const iso = isDateOnly
    ? op === "<=" || op === ">"
      ? `${dateLiteral}T23:59:59.999Z`
      : `${dateLiteral}T00:00:00.000Z`
    : dateLiteral
  const ms = Date.parse(iso)
  return Number.isFinite(ms) ? ms : null
}

export function normalizeVisibilityExpression(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed || trimmed.startsWith("{")) return trimmed

  // Rewrite date-window string comparisons like `now >= "2026-01-01"` or `ctx.now <= "2027-12-31"` to numeric epoch ms
  const withDates = trimmed.replace(
    /\b(?:ctx\.)?(?:now|date)\s*(<=|>=|<|>)\s*["'](\d{4}-\d{2}-\d{2}(?:T[^"']*)?)["']/g,
    (full, op: string, dateStr: string) => {
      const ms = parseIsoBoundMs(dateStr, op)
      if (ms === null) return full
      return `ctx.nowMs ${op} ${ms}`
    }
  )

  // Prefix bare context identifiers (role, now, nowMs, date, authenticated) outside string literals
  return withDates.replace(
    /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(?<![.\w])(role|nowMs|now|date|authenticated)\b/g,
    (match, quoted: string | undefined, bareKey: string | undefined) => {
      if (quoted !== undefined) return quoted
      return `ctx.${bareKey}`
    }
  )
}

export const visibilityRuleSchema = str("").refine((rule) => {
  if (!rule) return true
  if (rule.startsWith("{")) {
    try {
      const parsedJson: unknown = JSON.parse(rule)
      return isSuccess(visibilityLanguage.compile(parsedJson))
    } catch {
      return false
    }
  }
  const normalized = normalizeVisibilityExpression(rule)
  const parsed = visibilityLanguage.parse(normalized)
  if (!isSuccess(parsed)) return false
  return isSuccess(visibilityLanguage.compile(parsed.data))
}, "Invalid visibility expression")

export const BLOCK_TYPES = [
  "notice_bar",
  "academic_hero",
  "page_banner",
  "honour_roll_stats",
  "department_table",
  "pillars_grid",
  "rich_prose",
  "course_catalog",
  "materials_catalog",
  "gallery_showcase",
  "blog_feed",
  "faq_accordion",
  "contact_hub",
  "admission_form",
  "callout_band",
  "entity_detail_main"
] as const

export type BlockType = (typeof BLOCK_TYPES)[number]

export const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
  notice_bar: "Admissions / Exam Notice Bar",
  academic_hero: "Institutional Campus Hero",
  page_banner: "Academic Page Masthead Banner",
  honour_roll_stats: "Roll of Honour Metrics & Rank Plaques",
  department_table: "Verified Department Selection Register",
  pillars_grid: "Institutional Pillars / Vision / Initiatives Grid",
  rich_prose: "Markdown Academic Prose Section",
  course_catalog: "Live Courses Prospectus Grid",
  materials_catalog: "Public Study Materials Library",
  gallery_showcase: "Campus Photo & Video Gallery",
  blog_feed: "Exam Strategy & Gazette Articles",
  faq_accordion: "Categorized FAQ Help-Desk Accordion",
  contact_hub: "Campus Offices, Map & Enquiry Desk",
  admission_form: "Online Student Admission Application Form",
  callout_band: "Walk-In Counselling & Admission Callout Band",
  entity_detail_main: "Bound Course / Blog Detail Content"
}

const sectionToneSchema = s.defaulted(s.enum_(["default", "paper"] as const), "default")

const baseEnvelope = {
  id: requiredStr(1, "Block ID is required"),
  enabled: boolField(true),
  visibilityRule: visibilityRuleSchema
}

export const noticeBarBlockSchema = s.object({
  ...baseEnvelope,
  type: s.literal("notice_bar"),
  data: s.object({
    badge: requiredStr(1, "Notice badge is required"),
    message: requiredStr(2, "Notice message is required"),
    ctaLabel: str(""),
    ctaHref: optionalSafeHrefSchema
  })
})

export const academicHeroBlockSchema = s.object({
  ...baseEnvelope,
  type: s.literal("academic_hero"),
  data: s.object({
    rubric: requiredStr(2, "Hero rubric is required"),
    heading: requiredStr(3, "Hero heading is required"),
    description: requiredStr(5, "Hero description is required"),
    streams: s.defaulted(s.array(requiredStr(1)), []),
    primaryCtaLabel: requiredStr(1, "Primary CTA label is required"),
    primaryCtaHref: safeHrefSchema,
    secondaryCtaLabel: str(""),
    secondaryCtaHref: optionalSafeHrefSchema,
    mainImage: str("/images/paart-training-hall-front.png"),
    mainImageAlt: str("PAART Coaching Centre Building in Puliyangudi"),
    subImageLeft: str("/images/classroom-1.jpg"),
    subImageLeftAlt: str("PAART Academy classroom mentoring session"),
    subImageRight: str("/images/course-exam-1.jpg"),
    subImageRightAlt: str("Students writing weekly OMR model examination"),
    campusLabel: str("PAART Coaching Centre · Puliyangudi Campus"),
    campusBadge: str("Est. Dec 2018"),
    campusSubtext: str("Lebbaisaburam Street & Jamaliya Masjid Complex (Jinnah Nagar 3rd St)")
  })
})

export const pageBannerBlockSchema = s.object({
  ...baseEnvelope,
  type: s.literal("page_banner"),
  data: s.object({
    rubric: requiredStr(2, "Banner rubric is required"),
    title: requiredStr(2, "Banner title is required"),
    description: str(""),
    breadcrumbs: s.defaulted(
      s.array(
        s.object({
          label: requiredStr(1, "Breadcrumb label is required"),
          href: optionalSafeHrefSchema
        })
      ),
      []
    )
  })
})

export const honourRollStatsBlockSchema = s.object({
  ...baseEnvelope,
  type: s.literal("honour_roll_stats"),
  data: s.object({
    rubric: str(""),
    heading: str(""),
    actionLabel: str(""),
    actionHref: optionalSafeHrefSchema,
    metrics: s.defaulted(
      s.array(
        s.object({
          label: requiredStr(1, "Metric label is required"),
          count: requiredStr(1, "Metric count is required"),
          detail: str("")
        })
      ),
      []
    ),
    highlights: s.defaulted(
      s.array(
        s.object({
          title: requiredStr(1, "Highlight title is required"),
          badge: str(""),
          description: str("")
        })
      ),
      []
    )
  })
})

export const departmentTableBlockSchema = s.object({
  ...baseEnvelope,
  type: s.literal("department_table"),
  data: s.object({
    rubric: requiredStr(2, "Rubric is required"),
    title: requiredStr(2, "Title is required"),
    description: str(""),
    sectionId: str("results"),
    tone: sectionToneSchema,
    highlights: s.defaulted(
      s.array(
        s.object({
          title: requiredStr(1, "Highlight title is required"),
          badge: str(""),
          description: str("")
        })
      ),
      []
    ),
    rows: s.defaulted(
      s.array(
        s.object({
          department: requiredStr(1, "Department name is required"),
          count: intField(0, 0, 100000)
        })
      ),
      []
    )
  })
})

export const pillarsGridBlockSchema = s.object({
  ...baseEnvelope,
  type: s.literal("pillars_grid"),
  data: s.object({
    rubric: requiredStr(2, "Rubric is required"),
    title: requiredStr(2, "Title is required"),
    description: str(""),
    sectionId: str(""),
    tone: sectionToneSchema,
    layout: s.defaulted(
      s.enum_(["two_col", "three_col", "numbered_with_schedule", "vision_mission"] as const),
      "three_col"
    ),
    actionLabel: str(""),
    actionHref: optionalSafeHrefSchema,
    cards: s.defaulted(
      s.array(
        s.object({
          badge: str(""),
          accent: s.defaulted(s.enum_(["none", "primary", "gold"] as const), "none"),
          title: requiredStr(1, "Card title is required"),
          description: str(""),
          paragraphs: s.defaulted(s.array(str("")), []),
          values: s.defaulted(
            s.array(
              s.object({
                title: requiredStr(1),
                description: str("")
              })
            ),
            []
          )
        })
      ),
      []
    ),
    scheduleTitle: str(""),
    scheduleItems: s.defaulted(
      s.array(
        s.object({
          batch: requiredStr(1),
          detail: str("")
        })
      ),
      []
    ),
    sideImage: str(""),
    sideImageAlt: str(""),
    sideCaption: str("")
  })
})

export const richProseBlockSchema = s.object({
  ...baseEnvelope,
  type: s.literal("rich_prose"),
  data: s.object({
    rubric: str(""),
    title: str(""),
    description: str(""),
    tone: sectionToneSchema,
    markdown: requiredStr(1, "Markdown content is required")
  })
})

export const courseCatalogBlockSchema = s.object({
  ...baseEnvelope,
  type: s.literal("course_catalog"),
  data: s.object({
    rubric: str("Academic Prospectus"),
    title: str("Competitive Examination Programmes"),
    description: str(""),
    sectionId: str("courses"),
    tone: sectionToneSchema,
    categoryFilter: str("ALL"),
    limit: intField(0, 0, 100),
    showCategoryTabs: boolField(false),
    showHeader: boolField(true),
    viewAllLabel: str(""),
    viewAllHref: optionalSafeHrefSchema
  })
})

export const materialsCatalogBlockSchema = s.object({
  ...baseEnvelope,
  type: s.literal("materials_catalog"),
  data: s.object({
    rubric: str("Open Student Library"),
    title: str("Free Study Materials & Notes"),
    description: str(""),
    tone: sectionToneSchema,
    layout: s.defaulted(s.enum_(["grid", "split_with_blogs"] as const), "grid"),
    categoryFilter: str("ALL"),
    limit: intField(0, 0, 100),
    showCategoryTabs: boolField(true),
    blogRubric: str("Academic Gazette"),
    blogTitle: str("Exam Strategy & Guidance"),
    blogLimit: intField(3, 1, 20)
  })
})

export const galleryShowcaseBlockSchema = s.object({
  ...baseEnvelope,
  type: s.literal("gallery_showcase"),
  data: s.object({
    rubric: str("Campus & Student Life"),
    title: str("Gallery & Activity Showcase"),
    description: str(""),
    tone: sectionToneSchema,
    categoryFilter: str("ALL"),
    showCategoryTabs: boolField(true),
    videosRubric: str("Campus Recordings"),
    videosTitle: str("Classroom & Event Videos"),
    videosDescription: str(""),
    videos: s.defaulted(
      s.array(
        s.object({
          src: safeHrefSchema,
          title: requiredStr(1)
        })
      ),
      []
    )
  })
})

export const blogFeedBlockSchema = s.object({
  ...baseEnvelope,
  type: s.literal("blog_feed"),
  data: s.object({
    rubric: str("Academic Gazette & Guidance"),
    title: str("Exam Strategy & Preparation Articles"),
    description: str(""),
    tone: sectionToneSchema,
    showHeader: boolField(false),
    limit: intField(0, 0, 100)
  })
})

export const faqAccordionBlockSchema = s.object({
  ...baseEnvelope,
  type: s.literal("faq_accordion"),
  data: s.object({
    rubric: str("Student & Parent Help Desk"),
    title: str("Frequently Asked Questions"),
    description: str(""),
    tone: sectionToneSchema,
    showHeader: boolField(true),
    actionLabel: str(""),
    actionHref: optionalSafeHrefSchema,
    categories: s.defaulted(
      s.array(
        s.object({
          id: requiredStr(1, "Category ID is required"),
          title: requiredStr(1, "Category title is required"),
          items: s.defaulted(
            s.array(
              s.object({
                question: requiredStr(2, "Question is required"),
                answer: requiredStr(2, "Answer is required")
              })
            ),
            []
          )
        })
      ),
      []
    )
  })
})

export const contactHubBlockSchema = s.object({
  ...baseEnvelope,
  type: s.literal("contact_hub"),
  data: s.object({
    heading: str("Puliyangudi Campus Offices"),
    primaryOfficeLabel: str("Primary Office & Classroom"),
    secondaryOfficeLabel: str("Training Hall"),
    phoneLabel: str("Admissions & WhatsApp Helpline"),
    emailLabel: str("Official Email"),
    hoursLabel: str("Campus & Study Hall Hours"),
    showMap: boolField(true),
    returnTo: safeHrefSchema
  })
})

export const admissionFormBlockSchema = s.object({
  ...baseEnvelope,
  type: s.literal("admission_form"),
  data: s.object({
    tone: sectionToneSchema
  })
})

export const calloutBandBlockSchema = s.object({
  ...baseEnvelope,
  type: s.literal("callout_band"),
  data: s.object({
    rubric: str("Admissions & Academic Counselling"),
    title: requiredStr(3, "Callout title is required"),
    description: str(""),
    primaryCtaLabel: str("Online Admission Form"),
    primaryCtaHref: optionalSafeHrefSchema,
    secondaryCtaLabel: str(""),
    secondaryCtaHref: optionalSafeHrefSchema
  })
})

export const entityDetailMainBlockSchema = s.object({
  ...baseEnvelope,
  type: s.literal("entity_detail_main"),
  data: s.object({
    entityKind: s.enum_(["course", "blog"] as const),
    ctaHeading: str("Preparing for an upcoming government examination?"),
    ctaSubtext: str("Join structured classroom batches and daily test series at PAART Academy."),
    ctaLabel: str("Online Admission Form"),
    ctaHref: str("/admissions")
  })
})

export const pageBlockSchema = s.variant("type", {
  notice_bar: noticeBarBlockSchema,
  academic_hero: academicHeroBlockSchema,
  page_banner: pageBannerBlockSchema,
  honour_roll_stats: honourRollStatsBlockSchema,
  department_table: departmentTableBlockSchema,
  pillars_grid: pillarsGridBlockSchema,
  rich_prose: richProseBlockSchema,
  course_catalog: courseCatalogBlockSchema,
  materials_catalog: materialsCatalogBlockSchema,
  gallery_showcase: galleryShowcaseBlockSchema,
  blog_feed: blogFeedBlockSchema,
  faq_accordion: faqAccordionBlockSchema,
  contact_hub: contactHubBlockSchema,
  admission_form: admissionFormBlockSchema,
  callout_band: calloutBandBlockSchema,
  entity_detail_main: entityDetailMainBlockSchema
})

export type PageBlock = s.InferOutput<typeof pageBlockSchema>

export const pageSeoSchema = s.object({
  title: requiredStr(2, "SEO title is required"),
  description: str(""),
  canonicalPath: str(""),
  ogImage: str(""),
  noindex: boolField(false)
})

export type PageSeo = s.InferOutput<typeof pageSeoSchema>

export const navLinkSchema = s.object({
  label: requiredStr(1, "Link label is required"),
  href: safeHrefSchema
})

export type NavLinkItem = s.InferOutput<typeof navLinkSchema>

export const siteChromeSchema = s.object({
  utilityBar: s.object({
    badgeText: str(""),
    showHours: boolField(true),
    showPhone: boolField(true),
    resourceLabel: str("Free PDF Notes"),
    resourceHref: optionalSafeHrefSchema
  }),
  headerNav: s
    .array(navLinkSchema)
    .refine((items) => items.length >= 1, "At least one nav link is required"),
  headerCtas: s.object({
    primaryLabel: requiredStr(1, "Primary CTA label is required"),
    primaryHref: safeHrefSchema,
    loginLabel: requiredStr(1, "Portal login label is required")
  }),
  footerColumns: s.array(
    s.object({
      heading: requiredStr(1, "Column heading is required"),
      links: s.array(navLinkSchema)
    })
  ),
  trustProfile: s.object({
    shortName: requiredStr(2, "Short name is required"),
    legalName: requiredStr(3, "Legal trust name is required"),
    establishedDate: str("2018-12-22"),
    establishedLabel: requiredStr(2, "Established label is required"),
    tagline: str(""),
    summary: str(""),
    phone: requiredStr(6, "Phone number is required"),
    whatsapp: str(""),
    email: requiredStr(3, "Email is required"),
    addressPrimary: requiredStr(4, "Primary address is required"),
    addressSecondary: str(""),
    hours: requiredStr(3, "Operating hours are required")
  })
})

export type SiteChromeConfig = s.InferOutput<typeof siteChromeSchema>

export const RESERVED_EXACT_SLUGS = new Set([
  "/",
  "/about",
  "/courses",
  "/materials",
  "/gallery",
  "/blogs",
  "/faq",
  "/contact",
  "/admissions",
  "/enquiries",
  "/login",
  "/logout",
  "/healthz",
  "/readyz",
  "/sitemap.xml",
  "/llms.txt",
  "/robots.txt",
  "/favicon.ico"
])

export const RESERVED_SLUG_PREFIXES = [
  "/admin",
  "/faculty",
  "/portal",
  "/account",
  "/courses/",
  "/blogs/",
  "/admissions/",
  "/assets",
  "/images",
  "/videos",
  "/uploads",
  "/template:"
] as const

export function normalizeCampaignSlug(rawInput: string): string {
  const cleaned = rawInput.trim().replace(/^\/+|\/+$/g, "")
  if (!cleaned) return ""
  const slug = slugify(cleaned)
  if (!slug) return ""
  return `/${slug}`
}

function matchesReservedRoute(pathCandidate: string): boolean {
  if (RESERVED_EXACT_SLUGS.has(pathCandidate)) return true
  for (const prefix of RESERVED_SLUG_PREFIXES) {
    if (prefix.endsWith(":")) {
      if (pathCandidate.startsWith(prefix)) return true
      continue
    }
    const base = prefix.replace(/\/$/, "")
    if (pathCandidate === base || pathCandidate.startsWith(`${base}/`)) {
      return true
    }
  }
  return false
}

export function validateCampaignSlug(rawInput: string):
  | {
      ok: true
      slug: string
    }
  | {
      ok: false
      error: string
    } {
  const trimmed = rawInput.trim()
  if (!trimmed) {
    return { ok: false, error: "Campaign URL slug is required." }
  }

  const candidateLower = trimmed.startsWith("/")
    ? trimmed.toLowerCase()
    : `/${trimmed.toLowerCase()}`
  if (matchesReservedRoute(candidateLower)) {
    return {
      ok: false,
      error: `Slug "${candidateLower}" is reserved by an application route.`
    }
  }

  const normalized = normalizeCampaignSlug(trimmed)
  if (!normalized || normalized.length < 3) {
    return { ok: false, error: "Enter a valid URL slug (at least 2 characters)." }
  }

  if (matchesReservedRoute(normalized) || normalized.startsWith("/template-")) {
    return {
      ok: false,
      error: `Slug "${normalized}" collides with a reserved system route.`
    }
  }

  return { ok: true, slug: normalized }
}

export const createCampaignPageSchema = s.object({
  title: requiredStr(3, "Page title must be at least 3 characters"),
  slug: str(""),
  seoTitle: str(""),
  seoDescription: str("")
})

export interface BlockValidationSummary {
  validBlocks: PageBlock[]
  skippedCount: number
  issues: Array<{ index: number; blockId: string; message: string }>
}

export function parsePageBlocksSafe(rawBlocks: unknown): BlockValidationSummary {
  if (!Array.isArray(rawBlocks)) {
    return {
      validBlocks: [],
      skippedCount: rawBlocks ? 1 : 0,
      issues: rawBlocks ? [{ index: 0, blockId: "unknown", message: "Expected blocks array" }] : []
    }
  }

  const validBlocks: PageBlock[] = []
  const issues: Array<{ index: number; blockId: string; message: string }> = []

  rawBlocks.forEach((entry, index) => {
    const parsed = s.parseSafe(pageBlockSchema, entry)
    if (parsed.success) {
      validBlocks.push(parsed.value)
    } else {
      const candidateId =
        entry && typeof entry === "object" && "id" in entry && typeof entry.id === "string"
          ? entry.id
          : `index-${index}`
      issues.push({
        index,
        blockId: candidateId,
        message: parsed.issues[0]?.message ?? "Invalid block schema"
      })
    }
  })

  return {
    validBlocks,
    skippedCount: issues.length,
    issues
  }
}

function asRecord(val: unknown): Record<string, unknown> | null {
  return val && typeof val === "object" && !Array.isArray(val)
    ? (val as Record<string, unknown>)
    : null
}

function trimStr(val: unknown): string {
  return typeof val === "string" ? val.trim() : ""
}

/**
 * Strips empty optional "add-row" slots from bracket-params form submissions
 * before running strict `pageBlockSchema` validation.
 */
export function cleanSubmittedBlockArrays(rawBlocks: unknown): unknown {
  if (!Array.isArray(rawBlocks)) return rawBlocks
  return rawBlocks.map((rawBlock) => {
    const block = asRecord(rawBlock)
    if (!block) return rawBlock
    const data = asRecord(block.data)
    if (!data) return rawBlock

    const nextData: Record<string, unknown> = { ...data }

    if (Array.isArray(nextData.streams)) {
      nextData.streams = nextData.streams.map((x) => trimStr(x)).filter((x) => x.length > 0)
    }
    if (typeof nextData.streamsCsv === "string" && !Array.isArray(data.streams)) {
      nextData.streams = nextData.streamsCsv
        .split(",")
        .map((x) => x.trim())
        .filter((x) => x.length > 0)
      delete nextData.streamsCsv
    }
    if (Array.isArray(nextData.breadcrumbs)) {
      nextData.breadcrumbs = nextData.breadcrumbs.filter((item) => {
        const rec = asRecord(item)
        return rec ? trimStr(rec.label).length > 0 : false
      })
    }
    if (Array.isArray(nextData.metrics)) {
      nextData.metrics = nextData.metrics.filter((item) => {
        const rec = asRecord(item)
        return rec ? trimStr(rec.label).length > 0 || trimStr(rec.count).length > 0 : false
      })
    }
    if (Array.isArray(nextData.highlights)) {
      nextData.highlights = nextData.highlights.filter((item) => {
        const rec = asRecord(item)
        return rec ? trimStr(rec.title).length > 0 : false
      })
    }
    if (Array.isArray(nextData.rows)) {
      nextData.rows = nextData.rows.filter((item) => {
        const rec = asRecord(item)
        return rec ? trimStr(rec.department).length > 0 : false
      })
    }
    if (Array.isArray(nextData.cards)) {
      nextData.cards = nextData.cards
        .filter((item) => {
          const rec = asRecord(item)
          return rec ? trimStr(rec.title).length > 0 : false
        })
        .map((item) => {
          const rec: Record<string, unknown> = { ...asRecord(item) }
          if (typeof rec.paragraphsText === "string" && !Array.isArray(rec.paragraphs)) {
            rec.paragraphs = rec.paragraphsText
              .split(/\r?\n\r?\n/)
              .map((p) => p.trim())
              .filter((p) => p.length > 0)
            delete rec.paragraphsText
          } else if (Array.isArray(rec.paragraphs)) {
            rec.paragraphs = rec.paragraphs.map((p) => trimStr(p)).filter((p) => p.length > 0)
          }
          if (Array.isArray(rec.values)) {
            rec.values = rec.values.filter((v) => {
              const vr = asRecord(v)
              return vr ? trimStr(vr.title).length > 0 : false
            })
          }
          return rec
        })
    }
    if (Array.isArray(nextData.scheduleItems)) {
      nextData.scheduleItems = nextData.scheduleItems.filter((item) => {
        const rec = asRecord(item)
        return rec ? trimStr(rec.batch).length > 0 : false
      })
    }
    if (Array.isArray(nextData.videos)) {
      nextData.videos = nextData.videos.filter((item) => {
        const rec = asRecord(item)
        return rec ? trimStr(rec.title).length > 0 && trimStr(rec.src).length > 0 : false
      })
    }
    if (Array.isArray(nextData.categories)) {
      nextData.categories = nextData.categories
        .filter((cat) => {
          const rec = asRecord(cat)
          return rec ? trimStr(rec.title).length > 0 : false
        })
        .map((cat, idx) => {
          const rec: Record<string, unknown> = { ...asRecord(cat) }
          if (!trimStr(rec.id)) {
            rec.id = slugify(trimStr(rec.title)) || `cat-${idx + 1}`
          }
          if (Array.isArray(rec.items)) {
            rec.items = rec.items.filter((qa) => {
              const qr = asRecord(qa)
              return qr ? trimStr(qr.question).length > 0 && trimStr(qr.answer).length > 0 : false
            })
          }
          return rec
        })
    }

    return {
      ...block,
      data: nextData
    }
  })
}

export function cleanSubmittedSiteChrome(rawChrome: unknown): unknown {
  const root = asRecord(rawChrome)
  if (!root) return rawChrome

  const next: Record<string, unknown> = { ...root }

  if (Array.isArray(next.headerNav)) {
    next.headerNav = next.headerNav.filter((entry) => {
      const rec = asRecord(entry)
      if (!rec) return false
      return trimStr(rec.label).length > 0 || trimStr(rec.href).length > 0
    })
  }

  if (Array.isArray(next.footerColumns)) {
    next.footerColumns = next.footerColumns
      .map((col) => {
        const colRec = asRecord(col)
        if (!colRec) return null
        const links = Array.isArray(colRec.links)
          ? colRec.links.filter((lnk) => {
              const lr = asRecord(lnk)
              if (!lr) return false
              return trimStr(lr.label).length > 0 || trimStr(lr.href).length > 0
            })
          : []
        if (trimStr(colRec.heading).length === 0 && links.length === 0) {
          return null
        }
        return {
          ...colRec,
          links
        }
      })
      .filter((col): col is NonNullable<typeof col> => col !== null)
  }

  return next
}

export function createDefaultBlock(type: BlockType, customId?: string): PageBlock {
  const id = customId ?? `blk-${generateUUID()}`
  switch (type) {
    case "notice_bar":
      return {
        id,
        type: "notice_bar",
        enabled: true,
        visibilityRule: "",
        data: {
          badge: "Admissions Open",
          message: "Registrations open for upcoming Tamil & English medium classroom batches.",
          ctaLabel: "Apply Now",
          ctaHref: "/admissions"
        }
      }
    case "academic_hero":
      return {
        id,
        type: "academic_hero",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Puliyangudi, Tenkasi District · Public Educational Trust",
          heading: "Disciplined Coaching for Government Service & Academic Excellence",
          description:
            "Structured Samacheer syllabus coaching, bilingual mentoring, and weekly OMR test series.",
          streams: ["TNPSC Group I · II · IV", "TNUSRB SI & PC", "TET / TRB"],
          primaryCtaLabel: "Online Admission Form",
          primaryCtaHref: "/admissions",
          secondaryCtaLabel: "View Courses",
          secondaryCtaHref: "/courses",
          mainImage: "/images/paart-training-hall-front.png",
          mainImageAlt: "PAART Coaching Centre Building in Puliyangudi",
          subImageLeft: "/images/classroom-1.jpg",
          subImageLeftAlt: "PAART Academy classroom mentoring session",
          subImageRight: "/images/course-exam-1.jpg",
          subImageRightAlt: "Students writing weekly OMR model examination",
          campusLabel: "PAART Coaching Centre · Puliyangudi Campus",
          campusBadge: "Est. Dec 2018",
          campusSubtext: "Lebbaisaburam Street & Jamaliya Masjid Complex"
        }
      }
    case "page_banner":
      return {
        id,
        type: "page_banner",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Academic Notification",
          title: "Programme Overview",
          description: "Structured preparation schedule and eligibility details.",
          breadcrumbs: [{ label: "Overview", href: "" }]
        }
      }
    case "honour_roll_stats":
      return {
        id,
        type: "honour_roll_stats",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Academy Roll of Honour",
          heading: "Verified Selections & State-Rank Achievements",
          actionLabel: "View Full Track Record",
          actionHref: "/about",
          metrics: [
            {
              label: "Total Selections",
              count: "323+",
              detail: "Across state, central & skill exams"
            }
          ],
          highlights: []
        }
      }
    case "department_table":
      return {
        id,
        type: "department_table",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Verified Selection Register",
          title: "Department-Wise Selections",
          description: "Verified qualifiers across competitive examinations.",
          sectionId: "results",
          tone: "paper",
          highlights: [],
          rows: [{ department: "TNPSC Civil & Group Services", count: 53 }]
        }
      }
    case "pillars_grid":
      return {
        id,
        type: "pillars_grid",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Academic Pillars",
          title: "Structured Classroom Methodology",
          description: "Consistent daily revision and weekly OMR mock evaluations.",
          sectionId: "",
          tone: "default",
          layout: "three_col",
          actionLabel: "",
          actionHref: "",
          cards: [
            {
              badge: "",
              accent: "none",
              title: "Daily Syllabus Drills",
              description: "Topic-by-topic bilingual teaching aligned with official exam syllabi.",
              paragraphs: [],
              values: []
            }
          ],
          scheduleTitle: "",
          scheduleItems: [],
          sideImage: "",
          sideImageAlt: "",
          sideCaption: ""
        }
      }
    case "rich_prose":
      return {
        id,
        type: "rich_prose",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Official Notice",
          title: "Batch Instructions & Syllabus Notes",
          description: "",
          tone: "default",
          markdown:
            "Classes run **Monday to Saturday** with bilingual study booklets and weekly OMR tests."
        }
      }
    case "course_catalog":
      return {
        id,
        type: "course_catalog",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Academic Prospectus",
          title: "Competitive Examination Programmes",
          description: "Explore classroom and weekend coaching tracks.",
          sectionId: "courses",
          tone: "default",
          categoryFilter: "ALL",
          limit: 6,
          showCategoryTabs: false,
          showHeader: true,
          viewAllLabel: "View All Programmes",
          viewAllHref: "/courses"
        }
      }
    case "materials_catalog":
      return {
        id,
        type: "materials_catalog",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Open Student Library",
          title: "Free Study Materials & Notes",
          description: "Download public syllabus notes and model question banks.",
          tone: "default",
          layout: "grid",
          categoryFilter: "ALL",
          limit: 0,
          showCategoryTabs: true,
          blogRubric: "Academic Gazette",
          blogTitle: "Exam Strategy & Guidance",
          blogLimit: 3
        }
      }
    case "gallery_showcase":
      return {
        id,
        type: "gallery_showcase",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Campus & Student Life",
          title: "Gallery & Activity Showcase",
          description: "",
          tone: "default",
          categoryFilter: "ALL",
          showCategoryTabs: true,
          videosRubric: "Campus Recordings",
          videosTitle: "Classroom & Event Videos",
          videosDescription: "",
          videos: []
        }
      }
    case "blog_feed":
      return {
        id,
        type: "blog_feed",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Academic Gazette & Guidance",
          title: "Exam Strategy & Preparation Articles",
          description: "",
          tone: "default",
          showHeader: true,
          limit: 6
        }
      }
    case "faq_accordion":
      return {
        id,
        type: "faq_accordion",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Student & Parent Help Desk",
          title: "Frequently Asked Questions",
          description: "Clear answers on batch timings, medium of instruction, and scholarships.",
          tone: "paper",
          showHeader: true,
          actionLabel: "",
          actionHref: "",
          categories: [
            {
              id: "general",
              title: "General Admissions",
              items: [
                {
                  question: "Are classes conducted in both Tamil and English?",
                  answer: "Yes, all core batches support both Tamil and English medium aspirants."
                }
              ]
            }
          ]
        }
      }
    case "contact_hub":
      return {
        id,
        type: "contact_hub",
        enabled: true,
        visibilityRule: "",
        data: {
          heading: "Puliyangudi Campus Offices",
          primaryOfficeLabel: "Primary Office & Classroom",
          secondaryOfficeLabel: "Training Hall",
          phoneLabel: "Admissions & WhatsApp Helpline",
          emailLabel: "Official Email",
          hoursLabel: "Campus & Study Hall Hours",
          showMap: true,
          returnTo: "/contact"
        }
      }
    case "admission_form":
      return {
        id,
        type: "admission_form",
        enabled: true,
        visibilityRule: "",
        data: {
          tone: "default"
        }
      }
    case "callout_band":
      return {
        id,
        type: "callout_band",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Walk-In Counselling & Registration",
          title: "Visit PAART Academy in Puliyangudi or Register Online",
          description:
            "Meet our faculty coordinators in person for syllabus counselling and batch selection.",
          primaryCtaLabel: "Online Admission Form",
          primaryCtaHref: "/admissions",
          secondaryCtaLabel: "",
          secondaryCtaHref: ""
        }
      }
    case "entity_detail_main":
      return {
        id,
        type: "entity_detail_main",
        enabled: true,
        visibilityRule: "",
        data: {
          entityKind: "course",
          ctaHeading: "Preparing for an upcoming government examination?",
          ctaSubtext: "Join structured classroom batches and daily test series at PAART Academy.",
          ctaLabel: "Online Admission Form",
          ctaHref: "/admissions"
        }
      }
  }
}
