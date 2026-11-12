import { redirect } from "remix/response/redirect"
import { createContextKey, type Middleware } from "remix/router"
import {
  type AdminUser,
  clearSessionCookieHeader,
  extractCookieValue,
  PAART_SESSION_COOKIE,
  type ResolvedAuthSession,
  resolveSession,
  type SessionUser
} from "~/app/initializers/auth"
import { bindUserAccess, canManageCms, paartAbilities } from "~/app/initializers/authz"
import type { PaartDb } from "~/app/initializers/database"
import type { UserRole } from "~/database/schema"

export const sessionUserContext = createContextKey<SessionUser | null>(null)
export const authSessionContext = createContextKey<ResolvedAuthSession | null>(null)

const requestSessionMap = new WeakMap<Request, ResolvedAuthSession | null>()

const PASSWORD_CHANGE_EXEMPT_PATHS = new Set([
  "/login",
  "/logout",
  "/admin/sign-in",
  "/admin/logout",
  "/account/change-password"
])

function isPasswordChangeExempt(pathname: string): boolean {
  return PASSWORD_CHANGE_EXEMPT_PATHS.has(pathname)
}

function redirectToLogin(hadStaleCookie: boolean): Response {
  return redirect("/login", {
    status: 303,
    headers: hadStaleCookie ? { "Set-Cookie": clearSessionCookieHeader() } : undefined
  })
}

function forbiddenResponse(
  message = "Forbidden — you do not have permission to access this workspace."
): Response {
  return new Response(message, {
    status: 403,
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  })
}

export function loadSessionUser(targetDb?: PaartDb): Middleware<{
  key: typeof sessionUserContext
  value: SessionUser | null
  property: "user"
}> {
  return async (ctx, next) => {
    const incomingCookie = extractCookieValue(ctx.request, PAART_SESSION_COOKIE)
    const resolved = await resolveSession(ctx.request, targetDb)
    requestSessionMap.set(ctx.request, resolved)

    ctx.set(sessionUserContext, resolved?.user ?? null, { property: "user" })
    ctx.set(authSessionContext, resolved)

    const response = await next()
    if (incomingCookie && !resolved && !response.headers.has("Set-Cookie")) {
      const headers = new Headers(response.headers)
      headers.append("Set-Cookie", clearSessionCookieHeader())
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers
      })
    }
    return response
  }
}

export const authMiddleware = loadSessionUser

export function enforcePasswordChange(): Middleware {
  return async (ctx, next) => {
    const user = ctx.get(sessionUserContext) ?? requestSessionMap.get(ctx.request)?.user ?? null
    if (user?.mustChangePassword) {
      const pathname = new URL(ctx.request.url).pathname
      if (!isPasswordChangeExempt(pathname)) {
        return redirect("/account/change-password", 303)
      }
    }
    return next()
  }
}

export function requireRole(allowedRoles: readonly UserRole[]): Middleware {
  return async (ctx, next) => {
    const incomingCookie = extractCookieValue(ctx.request, PAART_SESSION_COOKIE)
    const user = ctx.get(sessionUserContext) ?? requestSessionMap.get(ctx.request)?.user ?? null
    if (!user) {
      return redirectToLogin(Boolean(incomingCookie))
    }

    const pathname = new URL(ctx.request.url).pathname
    if (user.mustChangePassword && !isPasswordChangeExempt(pathname)) {
      return redirect("/account/change-password", 303)
    }

    const access = bindUserAccess(user)
    await access.load(paartAbilities)

    if (!allowedRoles.includes(user.role)) {
      return forbiddenResponse()
    }

    if (
      allowedRoles.length === 1 &&
      allowedRoles[0] === "admin" &&
      !access.can(paartAbilities.admin.access)
    ) {
      return forbiddenResponse()
    }
    if (
      (pathname.startsWith("/admin/pages") || pathname.startsWith("/admin/chrome")) &&
      !access.can(paartAbilities.cms.manage)
    ) {
      return forbiddenResponse()
    }
    if (
      allowedRoles.includes("faculty") &&
      !allowedRoles.includes("aspirant") &&
      !access.can(paartAbilities.lms.teach)
    ) {
      return forbiddenResponse()
    }
    if (
      allowedRoles.length === 1 &&
      allowedRoles[0] === "aspirant" &&
      !access.can(paartAbilities.lms.portal)
    ) {
      return forbiddenResponse()
    }

    return next()
  }
}

export function requireAuthenticatedUser(
  request: Request,
  options: { allowMustChangePassword?: boolean; roles?: readonly UserRole[] } = {}
): SessionUser {
  const incomingCookie = extractCookieValue(request, PAART_SESSION_COOKIE)
  const resolved = requestSessionMap.get(request)
  const user = resolved?.user ?? null
  if (!user) {
    throw redirectToLogin(Boolean(incomingCookie))
  }

  if (user.mustChangePassword && !options.allowMustChangePassword) {
    throw redirect("/account/change-password", 303)
  }

  if (options.roles && !options.roles.includes(user.role)) {
    throw forbiddenResponse()
  }

  return user
}

export function requireAdmin(request: Request): AdminUser {
  return requireAuthenticatedUser(request, { roles: ["admin"] })
}

export async function requireCmsAdmin(request: Request): Promise<AdminUser> {
  const user = requireAdmin(request)
  if (!(await canManageCms(user))) {
    throw forbiddenResponse()
  }
  return user
}

export function requireFacultyOrAdmin(request: Request): SessionUser {
  return requireAuthenticatedUser(request, { roles: ["faculty", "admin"] })
}

export function requireAspirant(request: Request): SessionUser {
  return requireAuthenticatedUser(request, { roles: ["aspirant"] })
}
