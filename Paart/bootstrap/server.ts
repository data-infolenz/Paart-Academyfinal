import fs from "node:fs"
import fsp from "node:fs/promises"
import http from "node:http"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { detectContentType } from "remix/mime"
import { createRequestListener } from "remix/node-fetch-server"
import { closeDatabase } from "~/app/initializers/database"
import { appConfig } from "~/config/app"

interface RouterLike {
  fetch(req: Request): Response | Promise<Response>
}

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const clientDir = path.join(rootDir, "dist", "client")
const uploadsDir = path.join(rootDir, "uploads")
const ssrEntryPath = path.join(rootDir, "dist", "ssr", "index.js")

if (!fs.existsSync(ssrEntryPath)) {
  throw new Error(
    `[paart-server] Production SSR bundle not found at "${ssrEntryPath}". Run "npm run build" first.`
  )
}

const ssrModule = (await import(pathToFileURL(ssrEntryPath).href)) as {
  default?: RouterLike
  router?: RouterLike
}
const router = ssrModule.default ?? ssrModule.router

if (!router || typeof router.fetch !== "function") {
  throw new Error("[paart-server] Invalid SSR router export.")
}

async function tryServeStaticFile(
  baseDir: string,
  relPathname: string,
  method: string,
  immutable: boolean
): Promise<Response | null> {
  const safeRel = path.normalize(relPathname).replace(/^(\.\.[/\\])+/, "")
  const resolved = path.resolve(baseDir, `.${path.sep}${safeRel}`)
  if (!resolved.startsWith(baseDir)) return null

  try {
    const stat = await fsp.stat(resolved)
    if (!stat.isFile()) return null

    const contentType = detectContentType(resolved) ?? "application/octet-stream"
    const headers = new Headers({
      "Content-Type": contentType,
      "Content-Length": String(stat.size),
      "Cache-Control": immutable ? "public, max-age=31536000, immutable" : "public, max-age=3600"
    })

    if (method === "HEAD") {
      return new Response(null, { status: 200, headers })
    }

    const buffer = await fsp.readFile(resolved)
    return new Response(buffer, { status: 200, headers })
  } catch {
    return null
  }
}

const server = http.createServer(
  createRequestListener(async (request) => {
    if (request.method === "GET" || request.method === "HEAD") {
      const url = new URL(request.url)
      const pathname = decodeURIComponent(url.pathname)

      if (pathname.startsWith("/uploads/")) {
        const uploaded = await tryServeStaticFile(
          uploadsDir,
          pathname.slice("/uploads/".length),
          request.method,
          false
        )
        if (uploaded) return uploaded
      }

      const staticResponse = await tryServeStaticFile(
        clientDir,
        pathname,
        request.method,
        pathname.startsWith("/assets/")
      )
      if (staticResponse) return staticResponse
    }

    return await router.fetch(request)
  })
)

const port = appConfig.PORT
const host = process.env.HOST ?? "0.0.0.0"

server.listen(port, host, () => {
  console.log(`[PAART Academy] Production server running at http://localhost:${port}`)
})

let shuttingDown = false
const shutdown = async () => {
  if (shuttingDown) return
  shuttingDown = true
  console.log("[PAART Academy] Gracefully shutting down...")
  await new Promise<void>((resolve) => server.close(() => resolve()))
  await closeDatabase().catch(() => {})
  process.exit(0)
}

process.on("SIGINT", () => void shutdown())
process.on("SIGTERM", () => void shutdown())
