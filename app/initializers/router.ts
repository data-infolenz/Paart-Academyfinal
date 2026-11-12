import { assets } from "@sdxc/assets-middleware"
import { catchResponse } from "@sdxc/catch-response-middleware"
import { lazy } from "@sdxc/lazy-route"
import { log } from "@sdxc/logger/middleware"
import { asyncContext } from "remix/middleware/async-context"
import { compression } from "remix/middleware/compression"
import { formData } from "remix/middleware/form-data"
import { render } from "remix/middleware/render"
import { createRouter, type RouterContext } from "remix/router"
import publicController from "~/app/http/controllers/public/controller"
import { enforcePasswordChange, loadSessionUser, requireRole } from "~/app/http/middleware/auth"
import { legacyRedirectsMiddleware } from "~/app/http/middleware/legacy-redirects"
import { rateLimitMiddleware } from "~/app/http/middleware/rate-limit"
import { securityHeadersMiddleware } from "~/app/http/middleware/security-headers"
import { routes } from "~/routes"
import { assetResolver } from "./assets"
import { databaseMiddleware } from "./database"
import { paartLogger } from "./logger"

export type AppContext = RouterContext<typeof router>

declare module "remix/router" {
  interface RouterTypes {
    context: AppContext
  }
}

export const router = createRouter({
  middleware: [
    asyncContext(),
    log(paartLogger),
    legacyRedirectsMiddleware(),
    databaseMiddleware(),
    compression(),
    securityHeadersMiddleware(),
    catchResponse(),
    rateLimitMiddleware(),
    formData({ suppressErrors: true }),
    assets(assetResolver, {
      stylesheets: "resources/layouts/document.tsx",
      script: "bootstrap/browser.ts"
    }),
    render({ assets: assetResolver }),
    loadSessionUser(),
    enforcePasswordChange()
  ]
})

router.map(routes, publicController)
router.map(
  routes.courses,
  lazy(() => import("~/app/http/controllers/courses/controller"))
)
router.map(
  routes.blogs,
  lazy(() => import("~/app/http/controllers/blogs/controller"))
)
router.map(
  routes.admissions,
  lazy(() => import("~/app/http/controllers/admissions/controller"))
)
router.map(
  routes.auth,
  lazy(() => import("~/app/http/controllers/auth/controller"))
)
router.map(
  routes.admin,
  lazy(() => import("~/app/http/controllers/admin/controller"), [requireRole(["admin"])])
)
router.map(
  routes.faculty,
  lazy(
    () => import("~/app/http/controllers/faculty/controller"),
    [requireRole(["faculty", "admin"])]
  )
)
router.map(
  routes.portal,
  lazy(() => import("~/app/http/controllers/portal/controller"), [requireRole(["aspirant"])])
)

export default router
