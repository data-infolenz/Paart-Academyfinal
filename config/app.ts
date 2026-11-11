import fs from "node:fs"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"
import * as s from "remix/data-schema"
import * as checks from "remix/data-schema/checks"
import * as coerce from "remix/data-schema/coerce"

const configDir = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.resolve(configDir, "../.env")
if (fs.existsSync(envPath) && typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(envPath)
  } catch {
    // ignore if already loaded or optional
  }
}

const positiveInt = coerce
  .number()
  .pipe(checks.min(1))
  .refine((n) => Number.isInteger(n), "Expected positive integer")

export const appConfigSchema = s
  .object({
    NODE_ENV: s.defaulted(s.string(), "development"),
    PORT: s.defaulted(positiveInt, 4100),
    PAART_PUBLIC_URL: s.defaulted(s.string(), "https://paart.in"),
    DATABASE_URL: s.defaulted(
      s.string(),
      "postgresql://postgres:postgres@127.0.0.1:5432/paart_academy"
    ),
    SHOULD_SEED: s.defaulted(
      s
        .union([s.boolean(), s.string()])
        .transform((val) => val === true || val === "true" || val === "1"),
      false
    ),
    PAART_AUTH_SECRET: s.defaulted(s.string(), "paart-dev-only-32-byte-session-secret-key-2026"),
    PAART_ADMIN_EMAIL: s.defaulted(s.string(), "admin@paart.in"),
    PAART_ADMIN_PASSWORD: s.defaulted(s.string(), "Paart@2026Admin"),
    PAART_HONEYPOT_SECRET: s.defaulted(s.string(), "paart-dev-only-honeypot-secret-2026")
  })
  .refine(
    (cfg) =>
      cfg.NODE_ENV !== "production" ||
      (cfg.PAART_AUTH_SECRET.length >= 24 &&
        !cfg.PAART_AUTH_SECRET.includes("dev-only") &&
        cfg.PAART_ADMIN_PASSWORD !== "Paart@2026Admin"),
    "Production requires secure PAART_AUTH_SECRET (>=24 chars) and non-default PAART_ADMIN_PASSWORD."
  )

export const appConfig = s.parse(appConfigSchema, {
  ...process.env
} as Record<string, unknown>)
