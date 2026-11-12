import process from "node:process"
import { remix } from "@pitlane/vite-plugin-remix"
import { nitro } from "nitro/vite"
import { defineConfig } from "vite-plus"

const isVercel = process.env.VERCEL === "1"

export default defineConfig({
  plugins: [
    remix({
      clientEntry: "bootstrap/browser.ts",
      serverEntry: "app/initializers/router.ts",
      ...(isVercel ? { serverHandler: false } : {})
    }),
    isVercel ? nitro() : null,
    isVercel
      ? {
          name: "preserve-vercel-client-assets",
          enforce: "post" as const,
          closeBundle() {
            const fs = require("node:fs") as typeof import("node:fs")
            const path = require("node:path") as typeof import("node:path")
            const ctx = this as { environment?: { name?: string } }
            const envName = ctx.environment?.name
            const staticDir = path.resolve(".vercel/output/static")
            const backupDir = path.resolve(".vercel/.client-backup")

            if (envName === "client") {
              // Backup assets and importmap right after client build finishes
              const assetsSrc = path.join(staticDir, "assets")
              const importmapSrc = path.join(staticDir, "importmap.json")

              if (fs.existsSync(assetsSrc)) {
                fs.cpSync(assetsSrc, path.join(backupDir, "assets"), { recursive: true })
              }
              if (fs.existsSync(importmapSrc)) {
                fs.mkdirSync(backupDir, { recursive: true })
                fs.copyFileSync(importmapSrc, path.join(backupDir, "importmap.json"))
              }
            } else if (envName === "nitro") {
              // Restore assets and importmap after nitro has wiped and rebuilt static/
              if (fs.existsSync(backupDir)) {
                fs.cpSync(backupDir, staticDir, { recursive: true })
                fs.rmSync(backupDir, { recursive: true, force: true })
              }
            }
          }
        }
      : null
  ].filter(Boolean),
  resolve: {
    tsconfigPaths: true
  },
  css: {
    postcss: {
      plugins: []
    }
  },
  server: {
    port: 5173
  },
  ssr: {
    noExternal: [
      "@sdxc/ui",
      "@sdxc/u",
      "@sdxc/icons",
      "@sdxc/seo",
      "@sdxc/sitemap",
      "@sdxc/mail",
      "@sdxc/markdown",
      "@sdxc/lazy-frame"
    ]
  },
  lint: {
    ignorePatterns: ["dist/**", "graphify-out/**", ".agents/**"],
    options: {
      typeAware: true,
      typeCheck: true
    }
  },
  fmt: {
    ignorePatterns: ["dist/**", "package-lock.json", "graphify-out/**", ".agents/**"],
    singleQuote: false,
    semi: false,
    trailingComma: "none"
  },
  test: {
    include: ["app/**/*.test.{ts,tsx}"],
    testTimeout: 60000
  }
})
