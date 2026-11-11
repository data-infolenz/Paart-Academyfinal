import { redirect } from "remix/response/redirect"
import { createContextKey, type Middleware } from "remix/router"
import { type AdminUser, getSessionUser } from "~/app/initializers/auth"
import { routes } from "~/routes"

export const sessionUserContext = createContextKey<AdminUser | null>(null)

export function authMiddleware(): Middleware<{
  key: typeof sessionUserContext
  value: AdminUser | null
  property: "user"
}> {
  return (ctx, next) => {
    const user = getSessionUser(ctx.request)
    ctx.set(sessionUserContext, user, { property: "user" })
    return next()
  }
}

export function requireAdmin(request: Request): AdminUser {
  const user = getSessionUser(request)
  if (!user) {
    throw redirect(routes.auth.signIn.href())
  }
  return user
}
