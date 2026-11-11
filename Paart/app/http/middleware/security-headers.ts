import type { Middleware } from "remix/router"
import { apply } from "@sdxc/security-headers"
import { stringify, type CSP } from "@sdxc/security-headers/csp"

const DEFAULT_CSP_DIRECTIVES: CSP.Directives = {
  defaultSrc: ["self"],
  scriptSrc: ["self", "unsafe-inline", "unsafe-eval", "blob:"],
  styleSrc: ["self", "unsafe-inline", "https://fonts.googleapis.com"],
  imgSrc: ["self", "data:", "blob:", "https:"],
  fontSrc: ["self", "data:", "https://fonts.gstatic.com", "https:"],
  mediaSrc: ["self", "blob:"],
  frameSrc: ["self", "https://www.google.com", "https://maps.google.com"],
  connectSrc: ["self", "ws:", "wss:"],
  frameAncestors: ["none"]
}

export function securityHeadersMiddleware(): Middleware {
  return async (ctx, next) => {
    const response = await next()
    const url = new URL(ctx.request.url)
    const headers = new Headers(response.headers)

    apply(
      headers,
      {
        strictTransportSecurity: {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: true
        },
        noSniff: true,
        referrerPolicy: "strict-origin-when-cross-origin",
        crossOriginOpenerPolicy: "same-origin-allow-popups",
        crossOriginResourcePolicy: "same-origin"
      },
      { url }
    )

    if (!headers.has("Content-Security-Policy")) {
      headers.set("Content-Security-Policy", stringify(DEFAULT_CSP_DIRECTIVES))
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    })
  }
}
