import fs from "node:fs"
import { registerHooks } from "node:module"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

function resolveCandidate(basePath) {
  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    `${basePath}.js`,
    path.join(basePath, "index.ts"),
    path.join(basePath, "index.tsx"),
    path.join(basePath, "index.js")
  ]
  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return pathToFileURL(candidate).href
    }
  }
  return null
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.endsWith(".css")) {
      return {
        url: "data:text/javascript,export default {}",
        shortCircuit: true
      }
    }

    if (specifier === "~/routes") {
      const resolved = resolveCandidate(path.join(rootDir, "routes", "index.ts"))
      if (resolved) return { url: resolved, shortCircuit: true }
    }

    if (specifier.startsWith("~/")) {
      const subPath = specifier.slice(2)
      const resolved = resolveCandidate(path.join(rootDir, subPath))
      if (resolved) return { url: resolved, shortCircuit: true }
    }

    if (
      (specifier.startsWith("./") || specifier.startsWith("../")) &&
      context.parentURL?.startsWith("file:") &&
      !path.extname(specifier)
    ) {
      const parentDir = path.dirname(fileURLToPath(context.parentURL))
      const resolved = resolveCandidate(path.resolve(parentDir, specifier))
      if (resolved) return { url: resolved, shortCircuit: true }
    }

    return nextResolve(specifier, context)
  }
})
