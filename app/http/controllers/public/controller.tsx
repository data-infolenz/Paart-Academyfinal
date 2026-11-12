import * as s from "remix/data-schema"
import { redirect } from "remix/response/redirect"
import { createController } from "remix/router"
import { enquirySchema, formDataToObject } from "~/app/http/validators"
import { createHealthCheck } from "~/app/initializers/health"
import { honeypot } from "~/app/initializers/honeypot"
import { createEnquiry } from "~/app/models/enquiries"
import { routes } from "~/routes"
import { renderStaticCmsSlug } from "./cms-responder"
import { llmsAction } from "./llms"
import { sitemapAction } from "./sitemap"

function safeReturnTo(raw: string | undefined): string {
  if (raw && raw.startsWith("/") && !raw.startsWith("//")) {
    return raw.split("?")[0] || "/contact"
  }
  return "/contact"
}

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
      return renderStaticCmsSlug(ctx, "/")
    },

    async about(ctx) {
      return renderStaticCmsSlug(ctx, "/about")
    },

    async materials(ctx) {
      return renderStaticCmsSlug(ctx, "/materials", { includeOrgSchema: false })
    },

    async gallery(ctx) {
      return renderStaticCmsSlug(ctx, "/gallery", { includeOrgSchema: false })
    },

    async faq(ctx) {
      return renderStaticCmsSlug(ctx, "/faq", { includeOrgSchema: false })
    },

    async contact(ctx) {
      return renderStaticCmsSlug(ctx, "/contact")
    },

    async enquirySubmit(ctx) {
      const form = ctx.formData ?? (await ctx.request.formData())
      const raw = formDataToObject(form)
      const target = safeReturnTo(raw.returnTo)

      const hpCheck = await honeypot.verify(form)
      if (hpCheck.status === "failure" && hpCheck.error.code === "trap-filled") {
        return redirect(`${target}?submitted=1`)
      }

      const parsed = s.parseSafe(enquirySchema, raw)
      if (!parsed.success) {
        const msg = encodeURIComponent(parsed.issues[0]?.message || "Please check your details.")
        return redirect(`${target}?error=${msg}`)
      }

      try {
        await createEnquiry(parsed.value)
        return redirect(`${target}?submitted=1`)
      } catch {
        const msg = encodeURIComponent(
          "Database is currently offline. Please call or WhatsApp +91 6382450070 directly."
        )
        return redirect(`${target}?error=${msg}`)
      }
    }
  }
})
