import type { Middleware } from "remix/router"
import { MemoryAdapter, type MemoryAdapterOptions } from "@sdxc/rate-limit"
import { rateLimit } from "@sdxc/rate-limit/middleware"
import { appConfig } from "~/config/app"

export function rateLimitMiddleware(
  options: {
    limit?: number
    window?: MemoryAdapterOptions["window"]
    prefix?: string
  } = {}
): Middleware {
  const adapter = new MemoryAdapter({
    limit: options.limit ?? 20,
    window: options.window ?? "1 minute"
  })

  return rateLimit({
    adapter,
    prefix: options.prefix ?? "paart:forms",
    key: (ctx) =>
      ctx.request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      ctx.request.headers.get("x-real-ip") ||
      "127.0.0.1",
    skip: (ctx) => appConfig.NODE_ENV === "test" || ctx.request.method.toUpperCase() === "GET",
    onLimit: () =>
      new Response("Too many submissions. Please wait a minute and try again.", {
        status: 429,
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      })
  })
}
