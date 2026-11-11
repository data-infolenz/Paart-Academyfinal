import * as s from "remix/data-schema"
import { redirect } from "remix/response/redirect"
import { createController } from "remix/router"
import { admissionSchema, formDataToObject } from "~/app/http/validators"
import { honeypot, issueHoneypotFields } from "~/app/initializers/honeypot"
import { saveUploadedFile } from "~/app/initializers/storage"
import { createAdmission } from "~/app/models/admissions"
import { listActiveCourses } from "~/app/models/courses"
import { getSiteSettings } from "~/app/models/settings"
import { Document } from "~/resources/layouts/document"
import { AdmissionApplyPage } from "~/resources/views/admissions/apply-page"
import { AdmissionSuccessPage } from "~/resources/views/admissions/success-page"
import { routes } from "~/routes"

export default createController(routes.admissions, {
  actions: {
    async apply(ctx) {
      const url = new URL(ctx.request.url)
      const selectedCourse = url.searchParams.get("course") || ""
      const [settings, courses, honeypotFields] = await Promise.all([
        getSiteSettings(),
        listActiveCourses(),
        issueHoneypotFields()
      ])

      return ctx.render(
        <Document
          title="Online Student Admission Application | PAART Academy Puliyangudi"
          description="Apply online for TNPSC, TNUSRB Police, TET/TRB, SSC, Banking, Railways, NMMS, and Skill certification coaching batches at PAART Academy."
          assets={ctx.assets}
        >
          <AdmissionApplyPage
            user={ctx.user}
            settings={settings}
            courses={courses}
            selectedCourse={selectedCourse}
            honeypotFields={honeypotFields}
          />
        </Document>
      )
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
        const [settings, courses, honeypotFields] = await Promise.all([
          getSiteSettings(),
          listActiveCourses(),
          issueHoneypotFields()
        ])

        return ctx.render(
          <Document
            title="Online Student Admission Application | PAART Academy"
            assets={ctx.assets}
          >
            <AdmissionApplyPage
              user={ctx.user}
              settings={settings}
              courses={courses}
              honeypotFields={honeypotFields}
              error={parsed.issues[0]?.message || "Please review the highlighted fields."}
              values={raw}
            />
          </Document>,
          { status: 422 }
        )
      }

      let photoUrl: string | null = null
      let documentUrl: string | null = null

      try {
        photoUrl = await saveUploadedFile(form.get("studentPhoto"), "photos")
        documentUrl = await saveUploadedFile(form.get("supportingDocument"), "documents")
      } catch (err) {
        const [settings, courses, honeypotFields] = await Promise.all([
          getSiteSettings(),
          listActiveCourses(),
          issueHoneypotFields()
        ])

        return ctx.render(
          <Document
            title="Online Student Admission Application | PAART Academy"
            assets={ctx.assets}
          >
            <AdmissionApplyPage
              user={ctx.user}
              settings={settings}
              courses={courses}
              honeypotFields={honeypotFields}
              error={err instanceof Error ? err.message : "File upload failed."}
              values={raw}
            />
          </Document>,
          { status: 422 }
        )
      }

      try {
        const { applicationId } = await createAdmission({
          ...parsed.value,
          photoUrl,
          documentUrl
        })
        return redirect(`/admissions/success?ref=${encodeURIComponent(applicationId)}`, 303)
      } catch {
        const [settings, courses, honeypotFields] = await Promise.all([
          getSiteSettings(),
          listActiveCourses(),
          issueHoneypotFields()
        ])

        return ctx.render(
          <Document
            title="Online Student Admission Application | PAART Academy"
            assets={ctx.assets}
          >
            <AdmissionApplyPage
              user={ctx.user}
              settings={settings}
              courses={courses}
              honeypotFields={honeypotFields}
              error="Database connection is currently unavailable. Please call or WhatsApp +91 6382450070 directly to register."
              values={raw}
            />
          </Document>,
          { status: 503 }
        )
      }
    },

    async success(ctx) {
      const url = new URL(ctx.request.url)
      const applicationId = url.searchParams.get("ref") || "PAART-PENDING"
      const settings = await getSiteSettings()

      return ctx.render(
        <Document
          title="Admission Application Submitted | PAART Academy"
          robots="noindex, nofollow"
          assets={ctx.assets}
        >
          <AdmissionSuccessPage user={ctx.user} settings={settings} applicationId={applicationId} />
        </Document>
      )
    }
  }
})
