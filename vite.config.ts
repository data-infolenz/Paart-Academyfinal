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
    isVercel
      ? nitro({
          compatibilityDate: "2026-11-12"
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
