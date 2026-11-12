import * as s from "remix/data-schema"
import { describe, expect, it } from "vitest"
import { DEFAULT_PAGES, DEFAULT_SITE_CHROME } from "~/config/default-pages"
import {
  BLOCK_TYPES,
  createDefaultBlock,
  normalizeCampaignSlug,
  normalizeVisibilityExpression,
  pageBlockSchema,
  pageSeoSchema,
  parsePageBlocksSafe,
  siteChromeSchema,
  validateCampaignSlug
} from "./cms-schemas"

describe("cms-schemas", () => {
  it("validates default blocks across all 16 institutional block types", () => {
    for (const type of BLOCK_TYPES) {
      const block = createDefaultBlock(type, `test-${type}`)
      const parsed = s.parseSafe(pageBlockSchema, block)
      expect(parsed.success, `Expected default block for ${type} to parse cleanly`).toBe(true)
      if (parsed.success) {
        expect(parsed.value.type).toBe(type)
        expect(parsed.value.id).toBe(`test-${type}`)
      }
    }
  })

  it("isolates malformed blocks without dropping valid sibling blocks", () => {
    const raw = [
      createDefaultBlock("notice_bar", "blk-valid-1"),
      {
        id: "blk-bad-type",
        type: "unknown_widget",
        enabled: true,
        data: {}
      },
      {
        id: "blk-bad-href",
        type: "callout_band",
        enabled: true,
        data: {
          title: "Unsafe Callout",
          primaryCtaLabel: "Click",
          primaryCtaHref: "javascript:alert(1)"
        }
      },
      createDefaultBlock("rich_prose", "blk-valid-2")
    ]

    const summary = parsePageBlocksSafe(raw)
    expect(summary.validBlocks.map((b) => b.id)).toEqual(["blk-valid-1", "blk-valid-2"])
    expect(summary.skippedCount).toBe(2)
    expect(summary.issues).toHaveLength(2)
  })

  it("validates both ctx-prefixed and shorthand visibility expressions", () => {
    expect(normalizeVisibilityExpression('role == "aspirant" and now <= "2027-12-31"')).toBe(
      `ctx.role == "aspirant" and ctx.nowMs <= ${Date.parse("2027-12-31T23:59:59.999Z")}`
    )

    const validWithCtx = {
      ...createDefaultBlock("notice_bar", "vis-1"),
      visibilityRule: 'ctx.role == "aspirant" or ctx.role == "admin"'
    }
    expect(s.parseSafe(pageBlockSchema, validWithCtx).success).toBe(true)

    const validShorthand = {
      ...createDefaultBlock("notice_bar", "vis-2"),
      visibilityRule: 'role == "aspirant" and now >= "2026-01-01"'
    }
    expect(s.parseSafe(pageBlockSchema, validShorthand).success).toBe(true)

    const invalidRule = {
      ...createDefaultBlock("notice_bar", "vis-bad"),
      visibilityRule: "role === ??? broken"
    }
    expect(s.parseSafe(pageBlockSchema, invalidRule).success).toBe(false)
  })

  it("normalizes campaign slugs and rejects reserved application routes", () => {
    expect(normalizeCampaignSlug("TNPSC Group IV 2027 Batch")).toBe("/tnpsc-group-iv-2027-batch")
    expect(validateCampaignSlug("TNPSC Group IV 2027 Batch")).toEqual({
      ok: true,
      slug: "/tnpsc-group-iv-2027-batch"
    })
    expect(validateCampaignSlug("/free-tet-workshop-2027/")).toEqual({
      ok: true,
      slug: "/free-tet-workshop-2027"
    })

    for (const reserved of [
      "/",
      "/about",
      "/courses",
      "/courses/tnpsc-group-4",
      "/admin",
      "/admin/pages",
      "/portal",
      "/portal/exams",
      "/faculty",
      "/login",
      "/sitemap.xml",
      "/llms.txt",
      "/template:course-detail"
    ]) {
      const check = validateCampaignSlug(reserved)
      expect(check.ok, `Expected ${reserved} to be rejected`).toBe(false)
    }
  })

  it("validates site_chrome configuration and rejects unsafe navigation links", () => {
    const validChrome = {
      utilityBar: {
        badgeText: "Public Educational Trust · Est. 22 Dec 2018",
        showHours: true,
        showPhone: true,
        resourceLabel: "Free PDF Notes",
        resourceHref: "/materials"
      },
      headerNav: [
        { label: "Home", href: "/" },
        { label: "Courses", href: "/courses" }
      ],
      headerCtas: {
        primaryLabel: "Apply Online",
        primaryHref: "/admissions",
        loginLabel: "Portal Login"
      },
      footerColumns: [
        {
          heading: "Academics & Admissions",
          links: [{ label: "Courses & Batches", href: "/courses" }]
        }
      ],
      trustProfile: {
        shortName: "PAART Academy",
        legalName: "Puliyangudi Academy for Academic Research and Training",
        establishedDate: "2018-12-22",
        establishedLabel: "22 December 2018",
        tagline: "Guiding Aspirants Towards Academic & Career Excellence",
        summary: "Community-rooted public educational trust in Puliyangudi.",
        phone: "+91 87542 15058",
        whatsapp: "918754215058",
        email: "paartpuliyangudi@gmail.com",
        addressPrimary: "Lebbaisaburam Street, Puliyangudi – 627855",
        addressSecondary: "Jamaliya Masjid Complex, Puliyangudi – 627855",
        hours: "Mon – Sun · 6:00 AM – 9:00 PM"
      }
    }

    expect(s.parseSafe(siteChromeSchema, validChrome).success).toBe(true)

    const unsafeChrome = {
      ...validChrome,
      headerNav: [{ label: "Evil", href: "javascript:void(0)" }]
    }
    expect(s.parseSafe(siteChromeSchema, unsafeChrome).success).toBe(false)
  })

  it("validates all 11 DEFAULT_PAGES manifests and DEFAULT_SITE_CHROME without issues", () => {
    expect(DEFAULT_PAGES).toHaveLength(11)
    expect(s.parseSafe(siteChromeSchema, DEFAULT_SITE_CHROME).success).toBe(true)

    for (const page of DEFAULT_PAGES) {
      const seoParsed = s.parseSafe(pageSeoSchema, page.seo)
      expect(seoParsed.success, `SEO failed for ${page.slug}`).toBe(true)

      const summary = parsePageBlocksSafe(page.blocks)
      expect(
        summary.skippedCount,
        `Blocks failed for ${page.slug}: ${JSON.stringify(summary.issues)}`
      ).toBe(0)
      expect(summary.validBlocks.length).toBeGreaterThan(0)
    }
  })
})
