import { generateUUID } from "@sdxc/uuid/v7"
import { afterAll, describe, expect, it } from "vitest"
import { createSession, hashUserPassword } from "~/app/initializers/auth"
import { resetCmsCache } from "~/app/initializers/cms-cache"
import { db } from "~/app/initializers/database"
import router from "~/app/initializers/router"
import { findPageById, listPageRevisions } from "~/app/models/cms"
import { pages, users } from "~/database/schema"

const createdUserIds: string[] = []
const createdPageIds: string[] = []

afterAll(async () => {
  for (const pid of createdPageIds) {
    await db.delete(pages, pid).catch(() => {})
  }
  for (const uid of createdUserIds) {
    await db.delete(users, uid).catch(() => {})
  }
  resetCmsCache()
})

describe("end-to-end server-driven CMS publishing lifecycle", () => {
  it("runs campaign creation -> draft block add/reorder -> 404 vs Admin ?preview=draft -> publish + sitemap/llms + FAQPage JSON-LD -> v2 edit -> rollback to v1", async () => {
    const adminId = `e2e-cms-adm-${generateUUID()}`
    createdUserIds.push(adminId)
    const now = new Date()
    await db.create(users, {
      id: adminId,
      email: `e2e-cms-${adminId.slice(-8)}@paart.in`,
      full_name: "PAART Academic Trustee",
      phone: "9894480565",
      department: "Administration",
      role: "admin",
      password_hash: await hashUserPassword("TrusteePublish!2026"),
      must_change_password: false,
      status: "active",
      last_login_at: now,
      credentials_sent_at: now,
      credentials_delivery_error: null,
      created_at: now,
      updated_at: now
    })
    const sess = await createSession(adminId)
    const adminCookie = sess.cookieHeader.split(";")[0] ?? ""

    // Step 1: Admin creates a custom campaign page
    const suffix = generateUUID().slice(-6)
    const slug = `/tnpsc-group-ii-2027-${suffix}`
    const createForm = new FormData()
    createForm.set("title", `TNPSC Group II Prelims ${suffix}`)
    createForm.set("slug", slug)
    createForm.set("seoTitle", `TNPSC Group II 2027 Coaching (${suffix}) | PAART Academy`)
    createForm.set(
      "seoDescription",
      "Bilingual Group II & IIA classroom batch with OMR mock tests in Puliyangudi."
    )

    const createRes = await router.fetch(
      new Request("http://localhost:5173/admin/pages", {
        method: "POST",
        headers: { Cookie: adminCookie },
        body: createForm
      })
    )
    expect(createRes.status).toBe(303)
    const pageId = createRes.headers.get("Location")!.split("?")[0]!.replace("/admin/pages/", "")
    createdPageIds.push(pageId)

    // Step 2: Admin adds faq_accordion and notice_bar blocks and reorders in draft
    let detail = (await findPageById(pageId))!
    const addFaqForm = new FormData()
    addFaqForm.set("expectedVersion", String(detail.version))
    addFaqForm.set("blockType", "faq_accordion")
    addFaqForm.set("position", "end")
    const addFaqRes = await router.fetch(
      new Request(`http://localhost:5173/admin/pages/${pageId}/blocks/add`, {
        method: "POST",
        headers: { Cookie: adminCookie },
        body: addFaqForm
      })
    )
    expect(addFaqRes.status).toBe(303)

    detail = (await findPageById(pageId))!
    const addNoticeForm = new FormData()
    addNoticeForm.set("expectedVersion", String(detail.version))
    addNoticeForm.set("blockType", "notice_bar")
    addNoticeForm.set("position", "end")
    const addNoticeRes = await router.fetch(
      new Request(`http://localhost:5173/admin/pages/${pageId}/blocks/add`, {
        method: "POST",
        headers: { Cookie: adminCookie },
        body: addNoticeForm
      })
    )
    expect(addNoticeRes.status).toBe(303)

    // Reorder notice_bar from end to index 0 using RFC 6902 JSON Patch
    detail = (await findPageById(pageId))!
    const noticeIdx = detail.draftBlocks.findIndex((b) => b.type === "notice_bar")
    expect(noticeIdx).toBeGreaterThan(0)

    const patchForm = new FormData()
    patchForm.set("expectedVersion", String(detail.version))
    patchForm.set(
      "operations",
      JSON.stringify([{ op: "move", from: `/blocks/${noticeIdx}`, path: "/blocks/0" }])
    )
    const patchRes = await router.fetch(
      new Request(`http://localhost:5173/admin/pages/${pageId}/blocks/patch`, {
        method: "POST",
        headers: { Cookie: adminCookie },
        body: patchForm
      })
    )
    expect(patchRes.status).toBe(303)

    // Save custom v1 copy via @sdxc/bracket-params form
    detail = (await findPageById(pageId))!
    expect(detail.draftBlocks[0]?.type).toBe("notice_bar")
    const faqBlock = detail.draftBlocks.find((b) => b.type === "faq_accordion")!
    const bannerBlock = detail.draftBlocks.find((b) => b.type === "page_banner")!

    const draftV1Form = new FormData()
    draftV1Form.set("title", `TNPSC Group II Prelims ${suffix}`)
    draftV1Form.set("expectedVersion", String(detail.version))
    draftV1Form.set("seo[title]", `TNPSC Group II 2027 Coaching (${suffix}) | PAART Academy`)
    draftV1Form.set("seo[description]", "Official Group II batch schedule.")
    draftV1Form.set("seo[canonicalPath]", slug)
    draftV1Form.set("seo[ogImage]", "")
    draftV1Form.set("seo[noindex]", "false")

    draftV1Form.set("blocks[0][id]", detail.draftBlocks[0]!.id)
    draftV1Form.set("blocks[0][type]", "notice_bar")
    draftV1Form.set("blocks[0][enabled]", "true")
    draftV1Form.set("blocks[0][visibilityRule]", "")
    draftV1Form.set("blocks[0][data][badge]", "REVISION ONE LIVE")
    draftV1Form.set("blocks[0][data][message]", "Morning & Weekend Group II Batches Open")
    draftV1Form.set("blocks[0][data][ctaLabel]", "Apply Online")
    draftV1Form.set("blocks[0][data][ctaHref]", "/admissions")

    draftV1Form.set("blocks[1][id]", bannerBlock.id)
    draftV1Form.set("blocks[1][type]", "page_banner")
    draftV1Form.set("blocks[1][enabled]", "true")
    draftV1Form.set("blocks[1][visibilityRule]", "")
    draftV1Form.set("blocks[1][data][rubric]", "State Civil Services")
    draftV1Form.set("blocks[1][data][title]", `Group II Prelims ${suffix} V1 Masthead`)
    draftV1Form.set("blocks[1][data][description]", "Structured General Tamil & GS mentoring.")

    draftV1Form.set("blocks[2][id]", faqBlock.id)
    draftV1Form.set("blocks[2][type]", "faq_accordion")
    draftV1Form.set("blocks[2][enabled]", "true")
    draftV1Form.set("blocks[2][visibilityRule]", "")
    draftV1Form.set("blocks[2][data][rubric]", "Admissions FAQ")
    draftV1Form.set("blocks[2][data][title]", "Group II Batch Questions")
    draftV1Form.set("blocks[2][data][tone]", "paper")
    draftV1Form.set("blocks[2][data][showHeader]", "true")
    draftV1Form.set("blocks[2][data][categories][0][id]", "syllabus")
    draftV1Form.set("blocks[2][data][categories][0][title]", "Syllabus & Tests")
    draftV1Form.set(
      "blocks[2][data][categories][0][items][0][question]",
      "How many full-length OMR mock exams are included?"
    )
    draftV1Form.set(
      "blocks[2][data][categories][0][items][0][answer]",
      "24 weekly unit tests plus 10 full-length 200-question OMR state-level mock exams."
    )

    const saveV1Res = await router.fetch(
      new Request(`http://localhost:5173/admin/pages/${pageId}/draft`, {
        method: "POST",
        headers: { Cookie: adminCookie },
        body: draftV1Form
      })
    )
    expect(saveV1Res.status).toBe(303)

    // Step 3: Verify public visitor gets 404 & sitemap/llms omit unpublished slug, while Admin ?preview=draft gets 200 noindex
    const publicUnpublished = await router.fetch(new Request(`http://localhost:5173${slug}`))
    expect(publicUnpublished.status).toBe(404)

    const sitemapBefore = await (
      await router.fetch(new Request("http://localhost:5173/sitemap.xml"))
    ).text()
    expect(sitemapBefore).not.toContain(slug)

    const adminDraftPreview = await router.fetch(
      new Request(`http://localhost:5173${slug}?preview=draft`, {
        headers: { Cookie: adminCookie }
      })
    )
    expect(adminDraftPreview.status).toBe(200)
    expect(adminDraftPreview.headers.get("Cache-Control")).toBe("private, no-store")
    const previewHtml = await adminDraftPreview.text()
    expect(previewHtml).toContain("noindex, nofollow")
    expect(previewHtml).toContain("Draft Preview Mode")
    expect(previewHtml).toContain("Morning &amp; Weekend Group II Batches Open")
    expect(previewHtml.indexOf("REVISION ONE LIVE")).toBeLessThan(
      previewHtml.indexOf(`Group II Prelims ${suffix} V1 Masthead`)
    )

    // Step 4: Admin publishes Revision v1 -> public gets 200 + FAQPage JSON-LD + /sitemap.xml + /llms.txt
    detail = (await findPageById(pageId))!
    const pubV1Form = new FormData()
    pubV1Form.set("expectedVersion", String(detail.version))
    pubV1Form.set("note", "Initial Group II 2027 campaign launch")
    const pubV1Res = await router.fetch(
      new Request(`http://localhost:5173/admin/pages/${pageId}/publish`, {
        method: "POST",
        headers: { Cookie: adminCookie },
        body: pubV1Form
      })
    )
    expect(pubV1Res.status).toBe(303)

    const publicLiveV1 = await router.fetch(new Request(`http://localhost:5173${slug}`))
    expect(publicLiveV1.status).toBe(200)
    const liveV1Html = await publicLiveV1.text()
    expect(liveV1Html).not.toContain("noindex, nofollow")
    expect(liveV1Html).toContain("REVISION ONE LIVE")
    expect(liveV1Html).toContain('"@type":"FAQPage"')
    expect(liveV1Html).toContain("How many full-length OMR mock exams are included?")

    const sitemapAfter = await (
      await router.fetch(new Request("http://localhost:5173/sitemap.xml"))
    ).text()
    expect(sitemapAfter).toContain(slug)

    const llmsAfter = await (
      await router.fetch(new Request("http://localhost:5173/llms.txt"))
    ).text()
    expect(llmsAfter).toContain(slug)

    // Step 5: Admin edits & publishes Revision v2, then rolls back to Revision v1
    detail = (await findPageById(pageId))!
    const draftV2Form = new FormData()
    draftV2Form.set("title", `TNPSC Group II Prelims ${suffix}`)
    draftV2Form.set("expectedVersion", String(detail.version))
    draftV2Form.set("seo[title]", `TNPSC Group II 2027 Coaching (${suffix}) | PAART Academy`)
    draftV2Form.set("seo[description]", "Updated V2 batch schedule.")
    draftV2Form.set("seo[canonicalPath]", slug)
    draftV2Form.set("seo[ogImage]", "")
    draftV2Form.set("seo[noindex]", "false")

    draftV2Form.set("blocks[0][id]", detail.draftBlocks[0]!.id)
    draftV2Form.set("blocks[0][type]", "notice_bar")
    draftV2Form.set("blocks[0][enabled]", "true")
    draftV2Form.set("blocks[0][visibilityRule]", "")
    draftV2Form.set("blocks[0][data][badge]", "REVISION TWO UPDATED")
    draftV2Form.set("blocks[0][data][message]", "Final 15 Seats Remaining for V2 Batch")
    draftV2Form.set("blocks[0][data][ctaLabel]", "Apply Now")
    draftV2Form.set("blocks[0][data][ctaHref]", "/admissions")

    draftV2Form.set("blocks[1][id]", bannerBlock.id)
    draftV2Form.set("blocks[1][type]", "page_banner")
    draftV2Form.set("blocks[1][enabled]", "true")
    draftV2Form.set("blocks[1][visibilityRule]", "")
    draftV2Form.set("blocks[1][data][rubric]", "State Civil Services")
    draftV2Form.set("blocks[1][data][title]", `Group II Prelims ${suffix} V2 Masthead`)
    draftV2Form.set("blocks[1][data][description]", "Updated V2 description.")

    const saveV2Res = await router.fetch(
      new Request(`http://localhost:5173/admin/pages/${pageId}/draft`, {
        method: "POST",
        headers: { Cookie: adminCookie },
        body: draftV2Form
      })
    )
    expect(saveV2Res.status).toBe(303)

    detail = (await findPageById(pageId))!
    const pubV2Form = new FormData()
    pubV2Form.set("expectedVersion", String(detail.version))
    pubV2Form.set("note", "Updated seat count for V2")
    const pubV2Res = await router.fetch(
      new Request(`http://localhost:5173/admin/pages/${pageId}/publish`, {
        method: "POST",
        headers: { Cookie: adminCookie },
        body: pubV2Form
      })
    )
    expect(pubV2Res.status).toBe(303)

    const liveV2Html = await (
      await router.fetch(new Request(`http://localhost:5173${slug}`))
    ).text()
    expect(liveV2Html).toContain("REVISION TWO UPDATED")
    expect(liveV2Html).not.toContain("REVISION ONE LIVE")

    // Roll back to Revision v1!
    const revisions = await listPageRevisions(pageId)
    const rev1 = revisions.find((r) => r.version === 1)!
    expect(rev1.createdBy).toBe(adminId)

    const rollbackRes = await router.fetch(
      new Request(`http://localhost:5173/admin/pages/${pageId}/revisions/${rev1.id}/restore`, {
        method: "POST",
        headers: { Cookie: adminCookie }
      })
    )
    expect(rollbackRes.status).toBe(303)

    const rolledBackHtml = await (
      await router.fetch(new Request(`http://localhost:5173${slug}`))
    ).text()
    expect(rolledBackHtml).toContain("REVISION ONE LIVE")
    expect(rolledBackHtml).not.toContain("REVISION TWO UPDATED")
    expect(rolledBackHtml).toContain('"@type":"FAQPage"')
  })
})
