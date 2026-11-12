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
