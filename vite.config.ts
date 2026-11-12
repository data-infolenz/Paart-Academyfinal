import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import { remix } from "@pitlane/vite-plugin-remix"
import { nitro } from "nitro/vite"
import { defineConfig } from "vite-plus"

const isVercel = process.env.VERCEL === "1"

function copyDirectorySync(src: string, dest: string) {
  if (!fs.existsSync(src)) return
  fs.mkdirSync(dest, { recursive: true })
  const entries = fs.readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDirectorySync(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

export default defineConfig({
  plugins: [
    remix({
      clientEntry: "bootstrap/browser.ts",
      serverEntry: "app/initializers/router.ts",
      ...(isVercel ? { serverHandler: false } : {})
    }),
    isVercel
      ? nitro({
          compatibilityDate: "2026-11-12",
          hooks: {
            compiled(nitroInstance) {
              const serverFuncDir = path.resolve(
                nitroInstance.options.output.dir,
                "functions/__server.func"
              )
              const targetNodeModules = path.join(serverFuncDir, "node_modules")

              const pgPackages = [
                "pg",
                "pg-connection-string",
                "pg-pool",
                "pg-protocol",
                "pg-types",
                "pgpass",
                "postgres-array",
                "postgres-bytea",
                "postgres-date",
                "postgres-interval"
              ]

              for (const pkg of pgPackages) {
                const src = path.resolve("node_modules", pkg)
                const dest = path.join(targetNodeModules, pkg)
                copyDirectorySync(src, dest)
              }
            }
          }
        })
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
  build: {
    rolldownOptions: {
      external: ["pg", /^node:/],
      onwarn(warning, defaultHandler) {
        if (warning.code === "INEFFECTIVE_DYNAMIC_IMPORT") return
        defaultHandler(warning)
      },
      output: {
        manualChunks(id) {
          const normalizedId = id.replace(/\\/g, "/")

          if (
            normalizedId.includes("@sdxc/ui") ||
            normalizedId.includes("@sdxc/u") ||
            normalizedId.includes("@sdxc/icons") ||
            normalizedId.includes("@sdxc/seo") ||
            normalizedId.includes("@sdxc/lazy-frame")
          ) {
            return "paart-ui"
          }

          if (
            normalizedId.includes("node_modules/remix/") ||
            normalizedId.includes("@remix-run/") ||
            normalizedId.includes("@pitlane/vite-plugin-remix")
          ) {
            return "paart-remix"
          }

          if (normalizedId.includes("data-table")) {
            return "paart-db"
          }
        }
      }
    }
  },
  ssr: {
    external: ["pg"],
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
