import { revalidate } from "@pitlane/vite-plugin-remix/hmr"
import { run, type RunInit } from "remix/component"
import {
  detectMultipleImportMapSupport,
  importModule,
  preloadShim
} from "remix/multiple-import-maps-polyfill"
import { PACKAGE_MODULES } from "./ui-modules"

const PREFETCH_LIFETIME_MS = 30_000
const PREFETCHED = new Map<string, { response: Promise<Response>; at: number }>()

type FrameOptions = Parameters<NonNullable<RunInit["resolveFrame"]>>[1]

const app = run({
  async loadModule(moduleUrl, exportName) {
    const load = PACKAGE_MODULES[moduleUrl]
    const mod: unknown = load ? await load() : await importModule(moduleUrl)

    if (!mod || typeof mod !== "object") {
      throw new Error(`Invalid client entry module: ${moduleUrl}`)
    }

    const entry: unknown = Reflect.get(mod, exportName)

    if (typeof entry !== "function") {
      throw new Error(`Missing client entry export ${exportName} in ${moduleUrl}`)
    }

    return entry
  },

  async processClientEntryPreloads(preloads) {
    if (await detectMultipleImportMapSupport()) return preloads
    await preloadShim(preloads)
    return []
  },

  prefetch(src, options) {
    const response = fetchFrame(src, { target: options?.target }, "low")
    response.catch(() => PREFETCHED.delete(prefetchKey(src, options?.target)))
    PREFETCHED.set(prefetchKey(src, options?.target), { response, at: Date.now() })
  },

  async resolveFrame(src, options) {
    const prefetched = takePrefetched(src, options)
    if (prefetched !== undefined) {
      try {
        return await prefetched
      } catch {
        return await fetchFrame(src, options)
      }
    }
    return await fetchFrame(src, options)
  }
})

app.addEventListener("error", (event) => {
  console.error("Component error:", event.error)
})

if (import.meta.hot) {
  import.meta.hot.on("server:update", () => revalidate(app))
}

function prefetchKey(src: string, target?: string): string {
  const url = new URL(src, globalThis.document?.baseURI)
  url.hash = ""
  return JSON.stringify([url.href, target ?? null])
}

function takePrefetched(src: string, options?: FrameOptions): Promise<Response> | undefined {
  if ((options?.method ?? "GET").toUpperCase() !== "GET") {
    PREFETCHED.clear()
    return undefined
  }
  const key = prefetchKey(src, options?.target)
  const entry = PREFETCHED.get(key)
  PREFETCHED.delete(key)
  if (entry === undefined || Date.now() - entry.at > PREFETCH_LIFETIME_MS) return undefined
  return entry.response
}

async function fetchFrame(
  src: string,
  options: FrameOptions,
  priority: RequestPriority = "auto"
): Promise<Response> {
  const { target, signal, method, formData, encType } = options ?? {}

  const headers = new Headers({ accept: "text/html", "x-remix-frame": "true" })
  if (target) headers.set("x-remix-target", target)

  const body =
    formData && encType === "application/x-www-form-urlencoded"
      ? new URLSearchParams(
          Array.from(formData, ([key, value]) => [key, value instanceof File ? value.name : value])
        )
      : formData

  return await fetch(src, {
    credentials: "same-origin",
    cache: "no-cache",
    headers,
    signal,
    method,
    body,
    priority
  })
}
