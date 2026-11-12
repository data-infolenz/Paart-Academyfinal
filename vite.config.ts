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
