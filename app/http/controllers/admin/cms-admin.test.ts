import { generateUUID } from "@sdxc/uuid/v7"
import { afterAll, describe, expect, it } from "vitest"
import { createSession, hashUserPassword } from "~/app/initializers/auth"
import { resetCmsCache } from "~/app/initializers/cms-cache"
import { db } from "~/app/initializers/database"
import router from "~/app/initializers/router"
import { findPageById, getSiteChrome, listPageRevisions, updateSiteChrome } from "~/app/models/cms"
import { DEFAULT_SITE_CHROME } from "~/config/default-pages"
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

async function createAdminSession() {
  const id = `cms-adm-${generateUUID()}`
  createdUserIds.push(id)
  const now = new Date()
  await db.create(users, {
    id,
    email: `cms-admin-${id.slice(-8)}@paart.in`,
    full_name: "CMS Chief Administrator",
    phone: "9894480565",
    department: "Administration",
    role: "admin",
    password_hash: await hashUserPassword("AdminStudioPass!2026"),
    must_change_password: false,
    status: "active",
    last_login_at: now,
    credentials_sent_at: now,
    credentials_delivery_error: null,
    created_at: now,
    updated_at: now
  })
  const sess = await createSession(id)
  const cookie = sess.cookieHeader.split(";")[0] ?? ""
  return { id, cookie }
}

describe("Admin Page Studio (/admin/pages & /admin/pages/:id)", () => {
  it("rejects reserved slugs with 422 and creates custom campaign pages in draft status", async () => {
    const admin = await createAdminSession()

    const indexRes = await router.fetch(
      new Request("http://localhost:5173/admin/pages", {
        headers: { Cookie: admin.cookie }
      })
    )
    expect(indexRes.status).toBe(200)
    const indexHtml = await indexRes.text()
    expect(indexHtml).toContain("Server-Driven Page Studio")
    expect(indexHtml).toContain("create-campaign-dialog")

    // Attempt reserved slug /portal -> 422
    const reservedForm = new FormData()
    reservedForm.set("title", "Portal Collision Attempt")
    reservedForm.set("slug", "/portal")
    const reservedRes = await router.fetch(
      new Request("http://localhost:5173/admin/pages", {
        method: "POST",
        headers: { Cookie: admin.cookie },
        body: reservedForm
      })
    )
    expect(reservedRes.status).toBe(422)
    expect(await reservedRes.text()).toContain("reserved")

    // Valid custom campaign creation -> 303 redirect to /admin/pages/:id
    const uniqueSuffix = generateUUID().slice(-6)
    const createForm = new FormData()
    createForm.set("title", `TNPSC Group IV ${uniqueSuffix} Batch`)
    createForm.set("slug", `/tnpsc-group-iv-${uniqueSuffix}`)
    createForm.set("seoTitle", `Group IV ${uniqueSuffix} Coaching | PAART Academy`)

    const createRes = await router.fetch(
      new Request("http://localhost:5173/admin/pages", {
        method: "POST",
        headers: { Cookie: admin.cookie },
        body: createForm
      })
    )
    expect(createRes.status).toBe(303)
    const location = createRes.headers.get("Location") ?? ""
    expect(location).toMatch(/^\/admin\/pages\/page-/)

    const pageId = location.split("?")[0]!.replace("/admin/pages/", "")
    createdPageIds.push(pageId)

    // Public visitor still sees 404 before publish
    const guestBeforePub = await router.fetch(
      new Request(`http://localhost:5173/tnpsc-group-iv-${uniqueSuffix}`)
    )
    expect(guestBeforePub.status).toBe(404)

    // Editor renders LazyFrame preview dialog and Revision drawer
    const editRes = await router.fetch(
      new Request(`http://localhost:5173/admin/pages/${pageId}`, {
        headers: { Cookie: admin.cookie }
      })
    )
    expect(editRes.status).toBe(200)
    const editHtml = await editRes.text()
    expect(editHtml).toContain("live-preview-dialog")
    expect(editHtml).toContain("revision-history-drawer")
    expect(editHtml).toContain(`?preview=draft`)
  })

  it("supports bracket-params draft edits, json-patch block actions, 409 conflict guard, publish authorship, and 1-click rollback", async () => {
    const admin = await createAdminSession()
    const suffix = generateUUID().slice(-6)
    const slug = `/nmms-scholarship-${suffix}`

    const createForm = new FormData()
    createForm.set("title", `NMMS Scholarship ${suffix}`)
    createForm.set("slug", slug)
    const createRes = await router.fetch(
      new Request("http://localhost:5173/admin/pages", {
        method: "POST",
        headers: { Cookie: admin.cookie },
        body: createForm
      })
    )
    const pageId = createRes.headers.get("Location")!.split("?")[0]!.replace("/admin/pages/", "")
    createdPageIds.push(pageId)

    // 1. Publish initial v1 so live site serves v1
    const pub1Form = new FormData()
    pub1Form.set("expectedVersion", "1")
    pub1Form.set("note", "Initial NMMS v1 launch")
    const pub1Res = await router.fetch(
      new Request(`http://localhost:5173/admin/pages/${pageId}/publish`, {
        method: "POST",
        headers: { Cookie: admin.cookie },
        body: pub1Form
      })
    )
    expect(pub1Res.status).toBe(303)

    const liveV1 = await router.fetch(new Request(`http://localhost:5173${slug}`))
    expect(liveV1.status).toBe(200)
    expect(await liveV1.text()).toContain(`NMMS Scholarship ${suffix}`)

    const afterPub1 = await findPageById(pageId)
    expect(afterPub1?.publishedVersion).toBe(1)
    const currentVerAfterPub1 = afterPub1!.version

    // 2. Add a notice_bar block at top via POST /blocks/add (@sdxc/json-patch)
    const addBlockForm = new FormData()
    addBlockForm.set("expectedVersion", String(currentVerAfterPub1))
    addBlockForm.set("blockType", "notice_bar")
    addBlockForm.set("position", "start")
    const addRes = await router.fetch(
      new Request(`http://localhost:5173/admin/pages/${pageId}/blocks/add`, {
        method: "POST",
        headers: { Cookie: admin.cookie },
        body: addBlockForm
      })
    )
    expect(addRes.status).toBe(303)

    // 3. Edit draft blocks via @sdxc/bracket-params nested form (leaving live page unchanged!)
    const detailAfterAdd = await findPageById(pageId)
    expect(detailAfterAdd!.draftBlocks[0]?.type).toBe("notice_bar")

    const draftForm = new FormData()
    draftForm.set("title", `NMMS Scholarship ${suffix}`)
    draftForm.set("expectedVersion", String(detailAfterAdd!.version))
    draftForm.set("seo[title]", `NMMS ${suffix} | PAART Academy`)
    draftForm.set("seo[description]", "NMMS coaching details")
    draftForm.set("seo[canonicalPath]", slug)
    draftForm.set("seo[ogImage]", "")
    draftForm.set("seo[noindex]", "false")

    // Block 0: notice_bar with custom draft-only message
    draftForm.set("blocks[0][id]", detailAfterAdd!.draftBlocks[0]!.id)
    draftForm.set("blocks[0][type]", "notice_bar")
    draftForm.set("blocks[0][enabled]", "true")
    draftForm.set("blocks[0][visibilityRule]", "")
    draftForm.set("blocks[0][data][badge]", "DRAFT V2 BADGE")
    draftForm.set("blocks[0][data][message]", "Unpublished Draft V2 Seat Alert")
    draftForm.set("blocks[0][data][ctaLabel]", "Register")
    draftForm.set("blocks[0][data][ctaHref]", "/admissions")

    // Block 1: page_banner
    draftForm.set("blocks[1][id]", detailAfterAdd!.draftBlocks[1]!.id)
    draftForm.set("blocks[1][type]", "page_banner")
    draftForm.set("blocks[1][enabled]", "true")
    draftForm.set("blocks[1][visibilityRule]", "")
    draftForm.set("blocks[1][data][rubric]", "Scholarship Coaching")
    draftForm.set("blocks[1][data][title]", `NMMS Scholarship ${suffix} Updated V2`)
    draftForm.set("blocks[1][data][description]", "Updated v2 subtitle")

    const saveDraftRes = await router.fetch(
      new Request(`http://localhost:5173/admin/pages/${pageId}/draft`, {
        method: "POST",
        headers: { Cookie: admin.cookie },
        body: draftForm
      })
    )
    expect(saveDraftRes.status).toBe(303)

    // Verify public live page STILL does NOT show "Unpublished Draft V2 Seat Alert"!
    const liveStillV1 = await router.fetch(new Request(`http://localhost:5173${slug}`))
    const liveStillV1Html = await liveStillV1.text()
    expect(liveStillV1Html).not.toContain("Unpublished Draft V2 Seat Alert")

    // Verify Admin ?preview=draft DOES show "Unpublished Draft V2 Seat Alert"!
    const adminPreviewRes = await router.fetch(
      new Request(`http://localhost:5173${slug}?preview=draft`, {
        headers: { Cookie: admin.cookie }
      })
    )
    expect(adminPreviewRes.status).toBe(200)
    expect(await adminPreviewRes.text()).toContain("Unpublished Draft V2 Seat Alert")

    // 4. Stale expectedVersion -> 409 Conflict without overwriting newer edits
    const staleForm = new FormData()
    staleForm.set("expectedVersion", "1")
    staleForm.set("patchAction", "remove")
    staleForm.set("blockIndex", "0")
    const staleRes = await router.fetch(
      new Request(`http://localhost:5173/admin/pages/${pageId}/blocks/patch`, {
        method: "POST",
        headers: { Cookie: admin.cookie },
        body: staleForm
      })
    )
    expect(staleRes.status).toBe(409)
    expect(await staleRes.text()).toContain("Version conflict")

    // 5. Reorder block 0 down via POST /blocks/patch
    const beforeMove = await findPageById(pageId)
    const moveForm = new FormData()
    moveForm.set("expectedVersion", String(beforeMove!.version))
    moveForm.set("patchAction", "move_down")
    moveForm.set("blockIndex", "0")
    const moveRes = await router.fetch(
      new Request(`http://localhost:5173/admin/pages/${pageId}/blocks/patch`, {
        method: "POST",
        headers: { Cookie: admin.cookie },
        body: moveForm
      })
    )
    expect(moveRes.status).toBe(303)

    const afterMove = await findPageById(pageId)
    expect(afterMove!.draftBlocks[0]?.type).toBe("page_banner")
    expect(afterMove!.draftBlocks[1]?.type).toBe("notice_bar")

    // 6. Publish v2 and verify users.id authorship + immediate cache invalidation
    const pub2Form = new FormData()
    pub2Form.set("expectedVersion", String(afterMove!.version))
    pub2Form.set("note", "Published V2 with seat alert")
    const pub2Res = await router.fetch(
      new Request(`http://localhost:5173/admin/pages/${pageId}/publish`, {
        method: "POST",
        headers: { Cookie: admin.cookie },
        body: pub2Form
      })
    )
    expect(pub2Res.status).toBe(303)

    const liveV2 = await router.fetch(new Request(`http://localhost:5173${slug}`))
    expect(await liveV2.text()).toContain("Unpublished Draft V2 Seat Alert")

    const revisions = await listPageRevisions(pageId)
    expect(revisions.length).toBe(2)
    expect(revisions[0]?.createdBy).toBe(admin.id)
    expect(revisions[0]?.authorName).toBe("CMS Chief Administrator")

    // 7. 1-Click Rollback to Revision v1 -> live site immediately reverts!
    const rev1 = revisions.find((r) => r.version === 1)!
    const restoreRes = await router.fetch(
      new Request(`http://localhost:5173/admin/pages/${pageId}/revisions/${rev1.id}/restore`, {
        method: "POST",
        headers: { Cookie: admin.cookie }
      })
    )
    expect(restoreRes.status).toBe(303)

    const liveAfterRollback = await router.fetch(new Request(`http://localhost:5173${slug}`))
    const rollbackHtml = await liveAfterRollback.text()
    expect(rollbackHtml).not.toContain("Unpublished Draft V2 Seat Alert")
    expect(rollbackHtml).toContain(`NMMS Scholarship ${suffix}`)
  })

  it("edits global site chrome via @sdxc/bracket-params and immediately updates public pages", async () => {
    const admin = await createAdminSession()

    // Warm public cache first
    await router.fetch(new Request("http://localhost:5173/"))
    await router.fetch(new Request("http://localhost:5173/about"))

    const getChromeRes = await router.fetch(
      new Request("http://localhost:5173/admin/chrome", {
        headers: { Cookie: admin.cookie }
      })
    )
    expect(getChromeRes.status).toBe(200)
    expect(await getChromeRes.text()).toContain("Site Chrome &amp; Trust Identity Studio")

    const initial = await getSiteChrome({ bypassCache: true })

    // Reject unsafe javascript: URL in headerNav with 422
    const badForm = new FormData()
    badForm.set("expectedVersion", String(initial.version))
    badForm.set("headerNav[0][label]", "Unsafe")
    badForm.set("headerNav[0][href]", "javascript:alert(1)")
    badForm.set("headerCtas[primaryLabel]", "Apply")
    badForm.set("headerCtas[primaryHref]", "/admissions")
    badForm.set("headerCtas[loginLabel]", "Login")
    badForm.set("trustProfile[shortName]", DEFAULT_SITE_CHROME.trustProfile.shortName)
    badForm.set("trustProfile[legalName]", DEFAULT_SITE_CHROME.trustProfile.legalName)
    badForm.set("trustProfile[establishedLabel]", DEFAULT_SITE_CHROME.trustProfile.establishedLabel)
    badForm.set("trustProfile[phone]", DEFAULT_SITE_CHROME.trustProfile.phone)
    badForm.set("trustProfile[email]", DEFAULT_SITE_CHROME.trustProfile.email)
    badForm.set("trustProfile[addressPrimary]", DEFAULT_SITE_CHROME.trustProfile.addressPrimary)
    badForm.set("trustProfile[hours]", DEFAULT_SITE_CHROME.trustProfile.hours)

    const badRes = await router.fetch(
      new Request("http://localhost:5173/admin/chrome", {
        method: "POST",
        headers: { Cookie: admin.cookie },
        body: badForm
      })
    )
    expect(badRes.status).toBe(422)

    try {
      const form = new FormData()
      form.set("expectedVersion", String(initial.version))
      form.set("utilityBar[badgeText]", "CHROME LIVE ANNOUNCEMENT 2027")
      form.set("utilityBar[showHours]", "true")
      form.set("utilityBar[showPhone]", "true")
      form.set("utilityBar[resourceLabel]", "Model OMR PDFs")
      form.set("utilityBar[resourceHref]", "/materials")

      DEFAULT_SITE_CHROME.headerNav.forEach((item, idx) => {
        form.set(`headerNav[${idx}][label]`, item.label)
        form.set(`headerNav[${idx}][href]`, item.href)
      })
      const extraIdx = DEFAULT_SITE_CHROME.headerNav.length
      form.set(`headerNav[${extraIdx}][label]`, "Special Test Series")
      form.set(`headerNav[${extraIdx}][href]`, "/courses")

      form.set("headerCtas[primaryLabel]", DEFAULT_SITE_CHROME.headerCtas.primaryLabel)
      form.set("headerCtas[primaryHref]", DEFAULT_SITE_CHROME.headerCtas.primaryHref)
      form.set("headerCtas[loginLabel]", DEFAULT_SITE_CHROME.headerCtas.loginLabel)

      form.set("trustProfile[shortName]", DEFAULT_SITE_CHROME.trustProfile.shortName)
      form.set("trustProfile[legalName]", DEFAULT_SITE_CHROME.trustProfile.legalName)
      form.set("trustProfile[establishedDate]", DEFAULT_SITE_CHROME.trustProfile.establishedDate)
      form.set("trustProfile[establishedLabel]", DEFAULT_SITE_CHROME.trustProfile.establishedLabel)
      form.set("trustProfile[tagline]", DEFAULT_SITE_CHROME.trustProfile.tagline)
      form.set("trustProfile[summary]", DEFAULT_SITE_CHROME.trustProfile.summary)
      form.set("trustProfile[phone]", DEFAULT_SITE_CHROME.trustProfile.phone)
      form.set("trustProfile[whatsapp]", DEFAULT_SITE_CHROME.trustProfile.whatsapp)
      form.set("trustProfile[email]", DEFAULT_SITE_CHROME.trustProfile.email)
      form.set("trustProfile[addressPrimary]", DEFAULT_SITE_CHROME.trustProfile.addressPrimary)
      form.set("trustProfile[addressSecondary]", DEFAULT_SITE_CHROME.trustProfile.addressSecondary)
      form.set("trustProfile[hours]", "Mon–Sun: 6:00 AM – 9:30 PM Extended")

      DEFAULT_SITE_CHROME.footerColumns.forEach((col, cIdx) => {
        form.set(`footerColumns[${cIdx}][heading]`, col.heading)
        col.links.forEach((lnk, lIdx) => {
          form.set(`footerColumns[${cIdx}][links][${lIdx}][label]`, lnk.label)
          form.set(`footerColumns[${cIdx}][links][${lIdx}][href]`, lnk.href)
        })
      })
      const extraColIdx = DEFAULT_SITE_CHROME.footerColumns.length
      form.set(`footerColumns[${extraColIdx}][heading]`, "Scholarship Portals")
      form.set(`footerColumns[${extraColIdx}][links][0][label]`, "NMMS Mentoring")
      form.set(`footerColumns[${extraColIdx}][links][0][href]`, "/admissions")

      const updateRes = await router.fetch(
        new Request("http://localhost:5173/admin/chrome", {
          method: "POST",
          headers: { Cookie: admin.cookie },
          body: form
        })
      )
      expect(updateRes.status).toBe(303)
      expect(updateRes.headers.get("Location")).toBe("/admin/chrome?saved=1")

      // Public / and /about immediately reflect the updated chrome (cache invalidated!)
      const homeHtml = await (await router.fetch(new Request("http://localhost:5173/"))).text()
      expect(homeHtml).toContain("CHROME LIVE ANNOUNCEMENT 2027")
      expect(homeHtml).toContain("Special Test Series")
      expect(homeHtml).toContain("Scholarship Portals")
      expect(homeHtml).toContain("6:00 AM – 9:30 PM Extended")

      const aboutHtml = await (
        await router.fetch(new Request("http://localhost:5173/about"))
      ).text()
      expect(aboutHtml).toContain("Special Test Series")
      expect(aboutHtml).toContain("NMMS Mentoring")
    } finally {
      await updateSiteChrome(DEFAULT_SITE_CHROME, admin.id)
    }
  })
})
