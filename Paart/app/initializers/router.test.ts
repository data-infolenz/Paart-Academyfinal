import assert from "node:assert/strict"
import * as s from "remix/data-schema"
import { afterAll, describe, it } from "vite-plus/test"
import { admissionSchema, enquirySchema } from "~/app/http/validators"
import { ADMIN_SESSION_COOKIE } from "~/app/initializers/auth"
import { closeDatabase } from "~/app/initializers/database"
import router from "~/app/initializers/router"
import { appConfig } from "~/config/app"

describe("PAART Academy Remix 3 Router & HTTP Endpoints", () => {
  afterAll(async () => {
    await closeDatabase().catch(() => {})
  })

  it("renders public pages with HTTP 200 and clean HTML", async () => {
    const publicPaths = [
      "/",
      "/about",
      "/courses",
      "/courses/tnpsc-group-4",
      "/materials",
      "/gallery",
      "/blogs",
      "/blogs/how-to-prepare-for-tnpsc-group-4",
      "/faq",
      "/contact",
      "/admissions"
    ]

    for (const pathname of publicPaths) {
      const response = await router.fetch(new Request(`http://localhost:4100${pathname}`))
      assert.equal(response.status, 200, `Expected 200 for ${pathname}, got ${response.status}`)
      assert.match(response.headers.get("content-type") ?? "", /text\/html/i)
      const html = await response.text()
      assert.match(html, /PAART Academy/i, `Expected PAART Academy branding on ${pathname}`)
      assert.ok(
        response.headers.has("content-security-policy"),
        `Expected CSP header on ${pathname}`
      )
    }
  })

  it("returns 404 for unknown course or blog slugs", async () => {
    const courseRes = await router.fetch(
      new Request("http://localhost:4100/courses/non-existent-course")
    )
    assert.equal(courseRes.status, 404)

    const blogRes = await router.fetch(
      new Request("http://localhost:4100/blogs/non-existent-article")
    )
    assert.equal(blogRes.status, 404)
  })

  it("preserves legacy WordPress URLs from paart.in with HTTP 301 redirects", async () => {
    const legacyCases: Array<[string, string]> = [
      ["/?page_id=32", "/courses"],
      ["/?page_id=33", "/contact"],
      ["/?page_id=322", "/about"],
      ["/?post_type=tribe_events", "/gallery"]
    ]

    for (const [legacyQuery, targetPath] of legacyCases) {
      const res = await router.fetch(new Request(`http://localhost:4100${legacyQuery}`))
      assert.equal(res.status, 301, `Expected 301 for ${legacyQuery}`)
      assert.equal(res.headers.get("location"), targetPath)
    }
  })

  it("serves machine & observability endpoints (/healthz, /sitemap.xml, /llms.txt)", async () => {
    const healthRes = await router.fetch(new Request("http://localhost:4100/healthz"))
    assert.equal(healthRes.status, 200)

    const sitemapRes = await router.fetch(new Request("http://localhost:4100/sitemap.xml"))
    assert.equal(sitemapRes.status, 200)
    assert.match(sitemapRes.headers.get("content-type") ?? "", /xml/i)
    const xml = await sitemapRes.text()
    assert.match(xml, /<urlset/i)
    assert.match(xml, /\/courses\/tnpsc-group-4/)

    const llmsRes = await router.fetch(new Request("http://localhost:4100/llms.txt"))
    assert.equal(llmsRes.status, 200)
    assert.match(llmsRes.headers.get("content-type") ?? "", /text\/markdown/i)
    const md = await llmsRes.text()
    assert.match(md, /Puliyangudi Academic & Achievements Resource Trust/)
    assert.match(md, /\+91 6382450070/)
  })

  it("enforces admin session authentication and allows valid login", async () => {
    const unauthRes = await router.fetch(new Request("http://localhost:4100/admin"))
    assert.equal(unauthRes.status, 302)
    assert.equal(unauthRes.headers.get("location"), "/admin/sign-in")

    const badForm = new FormData()
    badForm.set("email", appConfig.PAART_ADMIN_EMAIL)
    badForm.set("password", "wrong-password-123")
    const badLoginRes = await router.fetch(
      new Request("http://localhost:4100/admin/sign-in", {
        method: "POST",
        body: badForm
      })
    )
    assert.equal(badLoginRes.status, 401)

    const goodForm = new FormData()
    goodForm.set("email", appConfig.PAART_ADMIN_EMAIL)
    goodForm.set("password", appConfig.PAART_ADMIN_PASSWORD)
    const goodLoginRes = await router.fetch(
      new Request("http://localhost:4100/admin/sign-in", {
        method: "POST",
        body: goodForm
      })
    )
    assert.equal(goodLoginRes.status, 303)
    assert.equal(goodLoginRes.headers.get("location"), "/admin")
    const setCookie = goodLoginRes.headers.get("set-cookie") ?? ""
    assert.match(setCookie, new RegExp(`${ADMIN_SESSION_COOKIE}=`))

    const cookiePair = setCookie.split(";")[0]
    const adminPaths = [
      "/admin",
      "/admin/admissions",
      "/admin/enquiries",
      "/admin/courses",
      "/admin/materials",
      "/admin/blogs",
      "/admin/gallery",
      "/admin/settings"
    ]

    for (const adminPath of adminPaths) {
      const adminRes = await router.fetch(
        new Request(`http://localhost:4100${adminPath}`, {
          headers: { Cookie: cookiePair }
        })
      )
      assert.equal(
        adminRes.status,
        200,
        `Expected 200 for authenticated ${adminPath}, got ${adminRes.status}`
      )
      const adminHtml = await adminRes.text()
      assert.match(adminHtml, /PAART Academy/i)
    }

    const logoutRes = await router.fetch(
      new Request("http://localhost:4100/admin/logout", {
        method: "POST",
        headers: { Cookie: cookiePair }
      })
    )
    assert.equal(logoutRes.status, 303)
    assert.equal(logoutRes.headers.get("location"), "/admin/sign-in")
  })

  it("renders admission success page and handles enquiry/admission POST validation", async () => {
    const successRes = await router.fetch(
      new Request("http://localhost:4100/admissions/success?ref=PAART-2026-TEST01")
    )
    assert.equal(successRes.status, 200)
    const successHtml = await successRes.text()
    assert.match(successHtml, /PAART-2026-TEST01/)

    const badEnquiryForm = new FormData()
    badEnquiryForm.set("name", "A")
    badEnquiryForm.set("phone", "123")
    const enqRes = await router.fetch(
      new Request("http://localhost:4100/enquiries", {
        method: "POST",
        body: badEnquiryForm
      })
    )
    assert.equal(enqRes.status, 302)
    assert.match(enqRes.headers.get("location") ?? "", /^\/contact\?error=/)

    const badAdmissionForm = new FormData()
    badAdmissionForm.set("studentName", "A")
    const admRes = await router.fetch(
      new Request("http://localhost:4100/admissions", {
        method: "POST",
        body: badAdmissionForm
      })
    )
    assert.equal(admRes.status, 422)
  })

  it("validates enquiry and admission schemas via remix/data-schema", () => {
    const validEnquiry = s.parseSafe(enquirySchema, {
      name: "Mohamed Riyaz",
      phone: "+91 9876543210",
      email: "riyaz@example.com",
      district: "Tenkasi",
      courseInterested: "TNPSC Group 4 & VAO",
      message: "Need weekend batch details"
    })
    assert.equal(validEnquiry.success, true)

    const invalidEnquiry = s.parseSafe(enquirySchema, {
      name: "A",
      phone: "123",
      courseInterested: ""
    })
    assert.equal(invalidEnquiry.success, false)

    const validAdmission = s.parseSafe(admissionSchema, {
      studentName: "Fathima Nasreen",
      parentName: "Abdul Rahman",
      dateOfBirth: "2003-05-14",
      gender: "Female",
      mobile: "9876543210",
      whatsapp: "9876543210",
      email: "fathima@example.com",
      address: "12 Main Road",
      city: "Puliyangudi",
      district: "Tenkasi",
      state: "Tamil Nadu",
      pincode: "627855",
      courseInterested: "TNPSC Group 4 & VAO",
      previousQualification: "Undergraduate Degree",
      schoolCollegeName: "Government Arts College",
      yearOfPassing: "2024",
      marksPercentage: "82%",
      preferredBatch: "Regular Weekday",
      message: "Tamil medium"
    })
    assert.equal(validAdmission.success, true)
  })
})
