import * as s from "remix/data-schema"
import { redirect } from "remix/response/redirect"
import { createController } from "remix/router"
import { formDataToObject, signInSchema } from "~/app/http/validators"
import {
  clearSessionCookieHeader,
  createSessionCookieHeader,
  getSessionUser,
  verifyAdminCredentials
} from "~/app/initializers/auth"
import { getSiteSettings } from "~/app/models/settings"
import { Document } from "~/resources/layouts/document"
import { SignInPage } from "~/resources/views/auth/sign-in"
import { routes } from "~/routes"

export default createController(routes.auth, {
  actions: {
    async signIn(ctx) {
      const existing = getSessionUser(ctx.request)
      if (existing) {
        return redirect(routes.admin.index.href(), 303)
      }

      const settings = await getSiteSettings()
      return ctx.render(
        <Document
          title="Admin Sign In | PAART Academy"
          robots="noindex, nofollow"
          assets={ctx.assets}
        >
          <SignInPage settings={settings} />
        </Document>
      )
    },

    async login(ctx) {
      const form = ctx.formData ?? (await ctx.request.formData())
      const raw = formDataToObject(form)
      const parsed = s.parseSafe(signInSchema, raw)

      if (!parsed.success) {
        const settings = await getSiteSettings()
        return ctx.render(
          <Document
            title="Admin Sign In | PAART Academy"
            robots="noindex, nofollow"
            assets={ctx.assets}
          >
            <SignInPage
              settings={settings}
              error={parsed.issues[0]?.message || "Enter email and password."}
              defaultEmail={raw.email ?? ""}
            />
          </Document>,
          { status: 422 }
        )
      }

      const adminUser = verifyAdminCredentials(parsed.value.email, parsed.value.password)
      if (!adminUser) {
        const settings = await getSiteSettings()
        return ctx.render(
          <Document
            title="Admin Sign In | PAART Academy"
            robots="noindex, nofollow"
            assets={ctx.assets}
          >
            <SignInPage
              settings={settings}
              error="Invalid administrator email or password."
              defaultEmail={parsed.value.email}
            />
          </Document>,
          { status: 401 }
        )
      }

      return redirect(routes.admin.index.href(), {
        status: 303,
        headers: {
          "Set-Cookie": createSessionCookieHeader(adminUser)
        }
      })
    },

    async logout() {
      return redirect(routes.auth.signIn.href(), {
        status: 303,
        headers: {
          "Set-Cookie": clearSessionCookieHeader()
        }
      })
    }
  }
})
