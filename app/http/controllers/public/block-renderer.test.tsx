import { renderToString } from "remix/component/server"
import { describe, expect, it } from "vitest"
import { BLOCK_TYPES, createDefaultBlock } from "~/app/models/cms-schemas"
import { DEFAULT_SITE_CHROME } from "~/config/default-pages"
import { BlockRenderer } from "~/resources/blocks"
import { LandingLayout } from "~/resources/layouts/landing"

describe("BlockRenderer & LandingLayout chrome", () => {
  it("renders all 16 institutional block types cleanly via SSR", async () => {
    const allBlocks = BLOCK_TYPES.map((type) => createDefaultBlock(type, `ssr-${type}`))
    const html = await renderToString(<BlockRenderer pageSlug="/" blocks={allBlocks} />)

    expect(html).toContain("Admissions Open")
    expect(html).toContain("Disciplined Coaching for Government Service")
    expect(html).toContain("323+")
    expect(html).toContain("TNPSC Civil &amp; Group Services")
    expect(html).toContain("Frequently Asked Questions")
    expect(html).toContain("Submit Admission Application")
    expect(html).toContain("Course Detail Template Slot")
  })

  it("skips a malformed single block without crashing valid sibling blocks", async () => {
    const rawBlocks = [
      createDefaultBlock("notice_bar", "valid-first"),
      {
        id: "corrupt-middle",
        type: "honour_roll_stats",
        enabled: true,
        // Missing required fields / corrupt shape
        data: { metrics: [{ label: "", count: "" }] }
      },
      {
        id: "unknown-block",
        type: "nonexistent_block_type",
        enabled: true,
        data: {}
      },
      createDefaultBlock("callout_band", "valid-last")
    ]

    const html = await renderToString(<BlockRenderer pageSlug="/about" rawBlocks={rawBlocks} />)
    expect(html).toContain("Admissions Open")
    expect(html).toContain("Visit PAART Academy in Puliyangudi or Register Online")
  })

  it("renders database-driven site_chrome navigation, footer columns, and Admin draft preview banner", async () => {
    const customChrome = {
      ...DEFAULT_SITE_CHROME,
      utilityBar: {
        ...DEFAULT_SITE_CHROME.utilityBar,
        badgeText: "Special TNPSC Group II Weekend Admissions Open"
      },
      headerNav: [
        { label: "Home", href: "/" },
        { label: "Group II Campaign", href: "/group-2-campaign" }
      ],
      footerColumns: [
        {
          heading: "Special Tracks",
          links: [{ label: "Weekend Intensive", href: "/group-2-campaign" }]
        }
      ]
    }

    const html = await renderToString(
      <LandingLayout
        chrome={customChrome}
        previewBanner={{
          pageId: "page-custom-1",
          slug: "/group-2-campaign",
          version: 4,
          status: "draft"
        }}
      >
        <p>Body Content</p>
      </LandingLayout>
    )

    expect(html).toContain("Special TNPSC Group II Weekend Admissions Open")
    expect(html).toContain("Group II Campaign")
    expect(html).toContain("Special Tracks")
    expect(html).toContain("Draft Preview (v4)")
    expect(html).toContain("/admin/pages/page-custom-1")
  })
})
