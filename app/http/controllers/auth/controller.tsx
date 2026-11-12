import { checkPassword, type PasswordPolicyError } from "@sdxc/password-policy"
import { checkPasswordHistory } from "@sdxc/password-policy/history"
import { isFailure } from "@sdxc/result"
import * as s from "remix/data-schema"
import { redirect } from "remix/response/redirect"
import { createController } from "remix/router"
import { requireAuthenticatedUser, sessionUserContext } from "~/app/http/middleware/auth"
import { changePasswordSchema, formDataToObject, signInSchema } from "~/app/http/validators"
import {
  authenticateCredentials,
  clearSessionCookieHeader,
  createSession,
  hashUserPassword,
  revokeSession,
  revokeUserSessions,
  verifyUserPassword,
  workspaceHrefForRole
} from "~/app/initializers/auth"
import { db } from "~/app/initializers/database"
import { getSiteSettings } from "~/app/models/settings"
import { users } from "~/database/schema"
import { Document } from "~/resources/layouts/document"
import { ChangePasswordPage } from "~/resources/views/auth/change-password"
import { SignInPage } from "~/resources/views/auth/sign-in"
import { routes } from "~/routes"

const PASSWORD_MIN_LENGTH = 12

function formatPasswordPolicyIssue(issue: PasswordPolicyError.Issue): string {
  switch (issue.reason) {
    case "too-short":
      return `Password must be at least ${issue.minLength} characters long.`
    case "too-long":
      return `Password must be at most ${issue.maxLength} characters long.`
    case "common":
    case "breached":
      return "That password is too common or easy to guess. Please choose a stronger passphrase."
    case "similar-to-identifier":
      return "Password cannot contain parts of your email address or name."
    case "denied-term":
      return `Password cannot contain "${issue.term}".`
    case "reused":
      return "New password must be different from your current / temporary password."
    case "breach-check-unavailable":
    case "history-check-unavailable":
      return "Could not verify password policy right now. Please try again."
  }
}

function getClientMeta(request: Request) {
  return {
    ipAddress:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "",
    userAgent: request.headers.get("user-agent") || ""
  }
}

export default createController(routes.auth, {
  actions: {
    async signIn() {
      return redirect(routes.auth.loginPage.href(), 302)
    },

    async loginPage(ctx) {
      const existing = ctx.get(sessionUserContext)
      if (existing) {
        if (existing.mustChangePassword) {
          return redirect(routes.auth.changePasswordPage.href(), 303)
        }
        return redirect(workspaceHrefForRole(existing.role), 303)
      }

      const settings = await getSiteSettings()
      return ctx.render(
        <Document
          title="Portal Sign In | PAART Academy"
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
            title="Portal Sign In | PAART Academy"
            robots="noindex, nofollow"
            assets={ctx.assets}
          >
            <SignInPage
              settings={settings}
              error={parsed.issues[0]?.message || "Enter your email address and password."}
              defaultEmail={raw.email ?? ""}
            />
          </Document>,
          { status: 422 }
        )
      }

      const sessionUser = await authenticateCredentials(parsed.value.email, parsed.value.password)
      if (!sessionUser) {
        const settings = await getSiteSettings()
        return ctx.render(
          <Document
            title="Portal Sign In | PAART Academy"
            robots="noindex, nofollow"
            assets={ctx.assets}
          >
            <SignInPage
              settings={settings}
              error="Invalid email address or password."
              defaultEmail={parsed.value.email}
            />
          </Document>,
          { status: 422 }
        )
      }

      const created = await createSession(sessionUser.id, getClientMeta(ctx.request))
      const destination = sessionUser.mustChangePassword
        ? routes.auth.changePasswordPage.href()
        : workspaceHrefForRole(sessionUser.role)

      return redirect(destination, {
        status: 303,
        headers: {
          "Set-Cookie": created.cookieHeader
        }
      })
    },

    async logout(ctx) {
      await revokeSession(ctx.request)
      return redirect(routes.auth.loginPage.href(), {
        status: 303,
        headers: {
          "Set-Cookie": clearSessionCookieHeader()
        }
      })
    },

    async legacyLogout(ctx) {
      await revokeSession(ctx.request)
      return redirect(routes.auth.loginPage.href(), {
        status: 303,
        headers: {
          "Set-Cookie": clearSessionCookieHeader()
        }
      })
    },

    async changePasswordPage(ctx) {
      const user = requireAuthenticatedUser(ctx.request, { allowMustChangePassword: true })
      const settings = await getSiteSettings()

      return ctx.render(
        <Document
          title="Change Password | PAART Academy"
          robots="noindex, nofollow"
          assets={ctx.assets}
        >
          <ChangePasswordPage user={user} settings={settings} />
        </Document>
      )
    },

    async changePassword(ctx) {
      const user = requireAuthenticatedUser(ctx.request, { allowMustChangePassword: true })
      const form = ctx.formData ?? (await ctx.request.formData())
      const raw = formDataToObject(form)
      const parsed = s.parseSafe(changePasswordSchema, raw)

      const renderError = async (message: string) => {
        const settings = await getSiteSettings()
        return ctx.render(
          <Document
            title="Change Password | PAART Academy"
            robots="noindex, nofollow"
            assets={ctx.assets}
          >
            <ChangePasswordPage user={user} settings={settings} error={message} />
          </Document>,
          { status: 422 }
        )
      }

      if (!parsed.success) {
        return renderError(parsed.issues[0]?.message || "Please complete all password fields.")
      }

      const { currentPassword, newPassword, confirmPassword } = parsed.value
      if (newPassword !== confirmPassword) {
        return renderError("New password and confirmation do not match.")
      }

      const userRow = await db.find(users, user.id)
      if (!userRow || userRow.status !== "active") {
        await revokeSession(ctx.request)
        return redirect(routes.auth.loginPage.href(), {
          status: 303,
          headers: { "Set-Cookie": clearSessionCookieHeader() }
        })
      }

      const currentMatches = await verifyUserPassword(userRow.password_hash, currentPassword)
      if (!currentMatches) {
        return renderError("Current password is incorrect.")
      }

      const policyCheck = await checkPassword(newPassword, {
        minLength: PASSWORD_MIN_LENGTH,
        identifiers: [userRow.email, userRow.full_name],
        deniedTerms: ["paart", "puliyangudi"]
      })
      if (isFailure(policyCheck)) {
        return renderError(formatPasswordPolicyIssue(policyCheck.error.issue))
      }

      const historyCheck = await checkPasswordHistory(newPassword, [userRow.password_hash])
      if (isFailure(historyCheck)) {
        return renderError(formatPasswordPolicyIssue(historyCheck.error.issue))
      }

      const nextHash = await hashUserPassword(newPassword)
      await db.update(users, userRow.id, {
        password_hash: nextHash,
        must_change_password: false,
        updated_at: new Date()
      })

      await revokeUserSessions(userRow.id)
      const rotated = await createSession(userRow.id, getClientMeta(ctx.request))

      return redirect(workspaceHrefForRole(userRow.role), {
        status: 303,
        headers: {
          "Set-Cookie": rotated.cookieHeader
        }
      })
    }
  }
})
