import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { createSession } from "~/app/initializers/auth"
import { resetCmsCache } from "~/app/initializers/cms-cache"
import { db } from "~/app/initializers/database"
import router from "~/app/initializers/router"
import { listPublishedBlogs } from "~/app/models/blogs"
import { createCampaignPage, publishPage } from "~/app/models/cms"
import { listActiveCourses } from "~/app/models/courses"
import { pages, users } from "~/database/schema"

describe("Server-driven public routes, entity templates, sitemap & llms", () => {
  const createdPageIds: string[] = []
  let adminId = "019a0000-0000-7000-8000-000000000001"
  let adminCookie = ""
  let aspirantCookie = ""

  beforeEach(async () => {
    resetCmsCache()
    const admin = await db.findOne(users, { where: { role: "admin" } })
    if (admin) {
      adminId = admin.id
      const sess = await createSession(admin.id)
      adminCookie = sess.cookieHeader.split(";")[0] ?? ""
    }
    const aspirant = await db.findOne(users, { where: { role: "aspirant" } })
    if (aspirant) {
      const sess = await createSession(aspirant.id)
      aspirantCookie = sess.cookieHeader.split(";")[0] ?? ""
    }
  })

  afterEach(async () => {
    for (const id of createdPageIds.splice(0)) {
      await db.delete(pages, id).catch(() => {})
    }
    resetCmsCache()
  })

  it("renders all 9 core institutional pages from database manifests with JSON-LD", async () => {
    for (const path of [
      "/",
      "/about",
      "/courses",
      "/materials",
      "/gallery",
      "/blogs",
      "/faq",
      "/contact",
      "/admissions"
    ]) {
      const res = await router.fetch(new Request(`http://localhost:3000${path}`))
      expect(res.status, `Expected 200 on ${path}`).toBe(200)
      const html = await res.text()
      expect(html).toContain("PAART Academy")
      if (path === "/" || path === "/faq") {
        expect(html).toContain('"@type":"FAQPage"')
      }
      if (path === "/") {
        expect(html).toContain("323+")
        expect(html).toContain('"@type":"EducationalOrganization"')
      }
    }
  })

  it("renders course and blog detail pages through collection templates and returns 404 on unknown items", async () => {
    const [courses, blogs] = await Promise.all([listActiveCourses(), listPublishedBlogs()])
    expect(courses.length).toBeGreaterThan(0)
    expect(blogs.length).toBeGreaterThan(0)

    const courseRes = await router.fetch(
      new Request(`http://localhost:3000/courses/${courses[0]!.slug}`)
    )
    expect(courseRes.status).toBe(200)
    const courseHtml = await courseRes.text()
    expect(courseHtml).toContain(courses[0]!.title)
    expect(courseHtml).toContain('"@type":"Course"')

    const blogRes = await router.fetch(new Request(`http://localhost:3000/blogs/${blogs[0]!.slug}`))
    expect(blogRes.status).toBe(200)
    const blogHtml = await blogRes.text()
    expect(blogHtml).toContain(blogs[0]!.title)
    expect(blogHtml).toContain('"@type":"Article"')

    const missingCourse = await router.fetch(
      new Request("http://localhost:3000/courses/nonexistent-course-999")
    )
    expect(missingCourse.status).toBe(404)
  })

  it("serves 404 for unpublished campaign slugs, allows Admin ?preview=draft with noindex, and exposes published slugs in sitemap.xml and llms.txt", async () => {
    const unknownRes = await router.fetch(
      new Request("http://localhost:3000/nonexistent-campaign-page")
    )
    expect(unknownRes.status).toBe(404)

    const slugInput = `tet-special-batch-${Date.now()}`
    const created = await createCampaignPage(
      {
        title: "TET Paper II Intensive Batch 2027",
        slug: slugInput
      },
      adminId
    )
    expect(created.status).toBe("ok")
    if (created.status !== "ok") return
    createdPageIds.push(created.pageId)

    // Guest gets 404 on draft, even with ?preview=draft
    const guestDraft = await router.fetch(
      new Request(`http://localhost:3000${created.slug}?preview=draft`)
    )
    expect(guestDraft.status).toBe(404)

    // Non-admin (aspirant) ALSO gets 404 on ?preview=draft
    if (aspirantCookie) {
      const aspirantDraft = await router.fetch(
        new Request(`http://localhost:3000${created.slug}?preview=draft`, {
          headers: { Cookie: aspirantCookie }
        })
      )
      expect(aspirantDraft.status).toBe(404)
    }

    // Admin gets 200 with noindex, nofollow and private, no-store on ?preview=draft
    const adminPreview = await router.fetch(
      new Request(`http://localhost:3000${created.slug}?preview=draft`, {
        headers: { Cookie: adminCookie }
      })
    )
    expect(adminPreview.status).toBe(200)
    expect(adminPreview.headers.get("Cache-Control")).toBe("private, no-store")
    const previewHtml = await adminPreview.text()
    expect(previewHtml).toContain("noindex, nofollow")
    expect(previewHtml).toContain("TET Paper II Intensive Batch 2027")
    expect(previewHtml).toContain("Draft Preview")

    // Publish the campaign page
    const pub = await publishPage(created.pageId, adminId, "Publish TET campaign")
    expect(pub.status).toBe("ok")

    // Public guest now gets 200
    const liveRes = await router.fetch(new Request(`http://localhost:3000${created.slug}`))
    expect(liveRes.status).toBe(200)
    const liveHtml = await liveRes.text()
    expect(liveHtml).toContain("TET Paper II Intensive Batch 2027")
    expect(liveHtml).not.toContain("Draft Preview")

    // Both /sitemap.xml and /llms.txt automatically include the published campaign slug
    const sitemapRes = await router.fetch(new Request("http://localhost:3000/sitemap.xml"))
    expect(sitemapRes.status).toBe(200)
    expect(await sitemapRes.text()).toContain(created.slug)

    const llmsRes = await router.fetch(new Request("http://localhost:3000/llms.txt"))
    expect(llmsRes.status).toBe(200)
    expect(await llmsRes.text()).toContain(created.slug)
  })
})
