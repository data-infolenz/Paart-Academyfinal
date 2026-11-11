import { createAssetResolver } from "@pitlane/assets"
import manifest from "@pitlane/assets/manifest"

function createFallbackTestResolver(): ReturnType<typeof createAssetResolver> {
  return {
    async getScriptEntry(entryPath: string) {
      return {
        href: entryPath.startsWith("file:") ? "/bootstrap/browser.ts" : entryPath,
        preloads: [],
        importMap: { imports: {} }
      }
    },
    async getHref(assetPath: string) {
      return `/${assetPath.replace(/^\/+/, "")}`
    },
    async getPreloads() {
      return []
    },
    async getStylesheets() {
      return ["/resources/css/theme.css"]
    },
    async getImportMap() {
      return { imports: {} }
    }
  }
}

export const assetResolver =
  manifest.mode === "unavailable" ? createFallbackTestResolver() : createAssetResolver(manifest)
