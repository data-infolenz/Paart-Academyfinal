import { redirect } from "remix/response/redirect"
import type { Middleware } from "remix/router"

const LEGACY_WP_PAGE_MAP: Record<string, string> = {
  "32": "/courses",
  "33": "/contact",
  "322": "/about"
}

/**
 * Preserves search engine equity from the legacy WordPress site on https://paart.in/
 * by redirecting old `?page_id=*` and `?post_type=tribe_events` URLs with HTTP 301.
 */
export function legacyRedirectsMiddleware(): Middleware {
  return (ctx, next) => {
    if (ctx.request.method !== "GET" && ctx.request.method !== "HEAD") {
      return next()
    }

    const url = new URL(ctx.request.url)
    if (url.pathname === "/") {
      const pageId = url.searchParams.get("page_id")
      if (pageId && LEGACY_WP_PAGE_MAP[pageId]) {
        return redirect(LEGACY_WP_PAGE_MAP[pageId], 301)
      }

      if (url.searchParams.get("post_type") === "tribe_events") {
        return redirect("/gallery", 301)
      }
    }

    return next()
  }
}
