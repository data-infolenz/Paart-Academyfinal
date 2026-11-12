import * as s from "remix/data-schema"
import { redirect } from "remix/response/redirect"
import { createController } from "remix/router"
import { renderStaticCmsSlug } from "~/app/http/controllers/public/cms-responder"
import { admissionSchema, formDataToObject } from "~/app/http/validators"
import { honeypot } from "~/app/initializers/honeypot"
import { saveUploadedFile } from "~/app/initializers/storage"
import { createAdmission } from "~/app/models/admissions"
import { chromeToSiteSettings, getSiteChrome } from "~/app/models/cms"
import { Document } from "~/resources/layouts/document"
import { AdmissionSuccessPage } from "~/resources/views/admissions/success-page"
import { routes } from "~/routes"

export default createController(routes.admissions, {
  actions: {
    async apply(ctx) {
      return renderStaticCmsSlug(ctx, "/admissions", { includeOrgSchema: false })
    },

    async submit(ctx) {
      const form = ctx.formData ?? (await ctx.request.formData())

      const hpCheck = await honeypot.verify(form)
      if (hpCheck.status === "failure" && hpCheck.error.code === "trap-filled") {
        return redirect("/admissions/success?ref=PAART-VERIFIED", 303)
      }

      const raw = formDataToObject(form)
      const parsed = s.parseSafe(admissionSchema, raw)

      if (!parsed.success) {
        return renderStaticCmsSlug(ctx, "/admissions", {
          includeOrgSchema: false,
          formError: parsed.issues[0]?.message || "Please review the highlighted fields.",
          formValues: raw,
          statusCode: 422
        })
      }

      let photoUrl: string | null = null
      let documentUrl: string | null = null

      try {
        photoUrl = await saveUploadedFile(form.get("studentPhoto"), "photos")
        documentUrl = await saveUploadedFile(form.get("supportingDocument"), "documents")
      } catch (err) {
        return renderStaticCmsSlug(ctx, "/admissions", {
          includeOrgSchema: false,
          formError: err instanceof Error ? err.message : "File upload failed.",
          formValues: raw,
          statusCode: 422
        })
      }

      try {
        const { applicationId } = await createAdmission({
          ...parsed.value,
          photoUrl,
          documentUrl
        })
        return redirect(`/admissions/success?ref=${encodeURIComponent(applicationId)}`, 303)
      } catch {
        return renderStaticCmsSlug(ctx, "/admissions", {
          includeOrgSchema: false,
          formError:
            "Database connection is currently unavailable. Please call or WhatsApp +91 6382450070 directly to register.",
          formValues: raw,
          statusCode: 503
        })
      }
    },

    async success(ctx) {
      const url = new URL(ctx.request.url)
      const applicationId = url.searchParams.get("ref") || "PAART-PENDING"
      const { chrome } = await getSiteChrome()
      const settings = chromeToSiteSettings(chrome)

      return ctx.render(
        <Document
          title="Admission Application Submitted | PAART Academy"
          robots="noindex, nofollow"
          assets={ctx.assets}
        >
          <AdmissionSuccessPage
            user={ctx.user}
            settings={settings}
            chrome={chrome}
            applicationId={applicationId}
          />
        </Document>
      )
    }
  }
})
