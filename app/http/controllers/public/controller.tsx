import * as s from "remix/data-schema"
import { redirect } from "remix/response/redirect"
import { createController } from "remix/router"
import { enquirySchema, formDataToObject } from "~/app/http/validators"
import { createHealthCheck } from "~/app/initializers/health"
import { honeypot, issueHoneypotFields } from "~/app/initializers/honeypot"
import { buildEducationalOrganizationSchema, buildFaqSchema } from "~/app/initializers/seo"
import { listPublishedBlogs } from "~/app/models/blogs"
import { listActiveCourses } from "~/app/models/courses"
import { createEnquiry } from "~/app/models/enquiries"
import { listGalleryItems } from "~/app/models/gallery"
import { listPublishedMaterials } from "~/app/models/materials"
import { getSiteSettings } from "~/app/models/settings"
import { PAART_FAQ_CATEGORIES } from "~/config/faqs"
import { Document } from "~/resources/layouts/document"
import { GalleryIndexPage } from "~/resources/views/gallery/index-page"
import { MaterialsIndexPage } from "~/resources/views/materials/index-page"
import { AboutPage } from "~/resources/views/public/about-page"
import { ContactPage } from "~/resources/views/public/contact-page"
import { FaqPage } from "~/resources/views/public/faq-page"
import { HomePage } from "~/resources/views/public/home"
import { routes } from "~/routes"
import { llmsAction } from "./llms"
import { sitemapAction } from "./sitemap"

export default createController(routes, {
  actions: {
    async healthz() {
      const probe = createHealthCheck({ checkDatabase: false })
      return probe.respond()
    },

    async readyz() {
      const probe = createHealthCheck({ checkDatabase: true })
      return probe.respond()
    },

    sitemap: sitemapAction,

    llms: llmsAction,

    async home(ctx) {
      const [settings, courses, materials, blogs] = await Promise.all([
        getSiteSettings(),
        listActiveCourses(),
        listPublishedMaterials(),
        listPublishedBlogs()
      ])

      return ctx.render(
        <Document
          title={settings.seoTitle}
          description={settings.seoDescription}
          schema={buildEducationalOrganizationSchema()}
          assets={ctx.assets}
        >
          <HomePage
            user={ctx.user}
            settings={settings}
            courses={courses}
            materials={materials}
            blogs={blogs}
          />
        </Document>
      )
    },

    async about(ctx) {
      const settings = await getSiteSettings()
      return ctx.render(
        <Document
          title="About PAART Trust & Selection Track Record | PAART Academy"
          description="Established on 22 December 2018 in Puliyangudi, PAART Trust empowers rural and semi-urban aspirants with disciplined competitive exam coaching."
          schema={buildEducationalOrganizationSchema()}
          assets={ctx.assets}
        >
          <AboutPage user={ctx.user} settings={settings} />
        </Document>
      )
    },

    async materials(ctx) {
      const url = new URL(ctx.request.url)
      const category = url.searchParams.get("category") || "ALL"
      const [settings, materials] = await Promise.all([
        getSiteSettings(),
        listPublishedMaterials(category)
      ])

      return ctx.render(
        <Document
          title="Free TNPSC, TNUSRB & TET Study Materials | PAART Academy"
          description="Download bilingual Samacheer syllabus notes, OMR practice booklets, and current affairs digests curated by PAART Academy."
          assets={ctx.assets}
        >
          <MaterialsIndexPage
            user={ctx.user}
            settings={settings}
            materials={materials}
            activeCategory={category}
          />
        </Document>
      )
    },

    async gallery(ctx) {
      const url = new URL(ctx.request.url)
      const category = url.searchParams.get("category") || "ALL"
      const [settings, items] = await Promise.all([getSiteSettings(), listGalleryItems(category)])

      return ctx.render(
        <Document
          title="Campus Classrooms, Mock Exams & Achievements Gallery | PAART Academy"
          description="Explore verified photographs and videos of classroom coaching, OMR mock tests, physical endurance training, and state rank holders at PAART Academy."
          assets={ctx.assets}
        >
          <GalleryIndexPage
            user={ctx.user}
            settings={settings}
            items={items}
            activeCategory={category}
          />
        </Document>
      )
    },

    async faq(ctx) {
      const settings = await getSiteSettings()
      const faqItems = PAART_FAQ_CATEGORIES.flatMap((cat) =>
        cat.items.map((item) => ({
          question: item.question,
          answer: item.answer
        }))
      )

      return ctx.render(
        <Document
          title="Frequently Asked Questions | PAART Academy Puliyangudi"
          description="Clear answers on PAART Academy batch timings, bilingual study materials, physical training, scholarship eligibility, and admission steps."
          schema={buildFaqSchema(faqItems)}
          assets={ctx.assets}
        >
          <FaqPage user={ctx.user} settings={settings} />
        </Document>
      )
    },

    async contact(ctx) {
      const url = new URL(ctx.request.url)
      const submitted = url.searchParams.get("submitted") === "1"
      const error = url.searchParams.get("error")
      const [settings, courses, honeypotFields] = await Promise.all([
        getSiteSettings(),
        listActiveCourses(),
        issueHoneypotFields()
      ])

      return ctx.render(
        <Document
          title="Contact PAART Academy & Campus Directions | Puliyangudi"
          description={`Reach PAART Academy at ${settings.phone} or visit our Puliyangudi campus (${settings.addressPrimary}) for batch timings and free counselling.`}
          schema={buildEducationalOrganizationSchema()}
          assets={ctx.assets}
        >
          <ContactPage
            user={ctx.user}
            settings={settings}
            courses={courses}
            honeypotFields={honeypotFields}
            submitted={submitted}
            error={error}
          />
        </Document>
      )
    },

    async enquirySubmit(ctx) {
      const form = ctx.formData ?? (await ctx.request.formData())

      const hpCheck = await honeypot.verify(form)
      if (hpCheck.status === "failure" && hpCheck.error.code === "trap-filled") {
        return redirect("/contact?submitted=1")
      }

      const raw = formDataToObject(form)
      const parsed = s.parseSafe(enquirySchema, raw)
      if (!parsed.success) {
        const msg = encodeURIComponent(parsed.issues[0]?.message || "Please check your details.")
        return redirect(`/contact?error=${msg}`)
      }

      try {
        await createEnquiry(parsed.value)
        return redirect("/contact?submitted=1")
      } catch {
        const msg = encodeURIComponent(
          "Database is currently offline. Please call or WhatsApp +91 6382450070 directly."
        )
        return redirect(`/contact?error=${msg}`)
      }
    }
  }
})
