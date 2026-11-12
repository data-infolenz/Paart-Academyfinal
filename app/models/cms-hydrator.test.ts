import { describe, expect, it, vi } from "vitest"
import { hydratePageBlocks } from "./cms-hydrator"
import { createDefaultBlock } from "./cms-schemas"
import type { MaterialItem } from "./materials"

describe("cms-hydrator", () => {
  it("runs zero collection loaders when active blocks only contain static banners and FAQs", async () => {
    const loadCourses = vi.fn(async () => [])
    const loadMaterials = vi.fn(async () => [])
    const loadBlogs = vi.fn(async () => [])
    const loadGallery = vi.fn(async () => [])
    const loadHoneypot = vi.fn(async () => ({ _hp: "tok" }))

    const blocks = [
      createDefaultBlock("page_banner", "b1"),
      createDefaultBlock("faq_accordion", "b2"),
      // Disabled course catalog must NOT trigger loadCourses
      { ...createDefaultBlock("course_catalog", "b3"), enabled: false },
      // Expired gallery block must NOT trigger loadGallery
      {
        ...createDefaultBlock("gallery_showcase", "b4"),
        visibilityRule: 'now <= "2020-01-01"'
      }
    ]

    const result = await hydratePageBlocks(blocks, {
      now: new Date("2026-11-12T10:00:00Z"),
      loaders: {
        loadCourses,
        loadMaterials,
        loadBlogs,
        loadGallery,
        loadHoneypot
      }
    })

    expect(result.activeBlocks.map((b) => b.id)).toEqual(["b1", "b2"])
    expect(result.faqItems.length).toBeGreaterThan(0)
    expect(loadCourses).not.toHaveBeenCalled()
    expect(loadMaterials).not.toHaveBeenCalled()
    expect(loadBlogs).not.toHaveBeenCalled()
    expect(loadGallery).not.toHaveBeenCalled()
    expect(loadHoneypot).not.toHaveBeenCalled()
  })

  it("excludes enrolled-only materials from public materials_catalog hydration", async () => {
    const sampleMaterials: MaterialItem[] = [
      {
        id: "m-public",
        title: "Public Samacheer Notes",
        category: "Notes",
        description: "Open PDF",
        fileUrl: "/notes.pdf",
        externalUrl: "",
        courseId: null,
        courseTitle: null,
        visibility: "public",
        uploadedBy: null,
        published: true,
        displayOrder: 1
      },
      {
        id: "m-enrolled",
        title: "Batch Exclusive OMR Workbook",
        category: "Question Bank",
        description: "Restricted PDF",
        fileUrl: "/secret.pdf",
        externalUrl: "",
        courseId: "group-4",
        courseTitle: "TNPSC Group IV",
        visibility: "enrolled",
        uploadedBy: "fac-1",
        published: true,
        displayOrder: 2
      }
    ]

    const result = await hydratePageBlocks([createDefaultBlock("materials_catalog", "mat-blk")], {
      loaders: {
        loadMaterials: async () => sampleMaterials
      }
    })

    expect(result.collections.materials.map((m) => m.id)).toEqual(["m-public"])

    // Also verify against real PostgreSQL listPublishedMaterials (which seeds mat-enrolled-g4-omr)
    const liveResult = await hydratePageBlocks([
      createDefaultBlock("materials_catalog", "mat-live")
    ])
    expect(liveResult.collections.materials.every((m) => m.visibility === "public")).toBe(true)
    expect(liveResult.collections.materials.some((m) => m.id === "mat-enrolled-g4-omr")).toBe(false)
  })

  it("issues fresh @sdxc/honeypot tokens on every hydration of admission_form or contact_hub", async () => {
    const formBlocks = [createDefaultBlock("admission_form", "adm-blk")]

    const first = await hydratePageBlocks(formBlocks)
    await new Promise((r) => setTimeout(r, 5))
    const second = await hydratePageBlocks(formBlocks)

    expect(first.collections.honeypotFields).toBeDefined()
    expect(second.collections.honeypotFields).toBeDefined()
    expect(JSON.stringify(first.collections.honeypotFields)).not.toBe(
      JSON.stringify(second.collections.honeypotFields)
    )
  })
})
