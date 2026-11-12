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

const booleanFlag = s
  .union([s.boolean(), s.string()])
  .transform((val): boolean => val === true || val === "true" || val === "1")

export const appConfigSchema = s
  .object({
    NODE_ENV: s.defaulted(s.string(), "development"),
    PORT: s.defaulted(positiveInt, 4100),
    PAART_PUBLIC_URL: s.defaulted(s.string(), "https://paart.in"),
    DATABASE_URL: s.defaulted(
      s.string(),
      "postgresql://postgres:postgres@127.0.0.1:5432/paart_academy"
    ),
    SHOULD_SEED: s.defaulted(booleanFlag, false),
    PAART_AUTH_SECRET: s.defaulted(s.string(), "paart-dev-only-32-byte-session-secret-key-2026"),
    PAART_SESSION_TTL_HOURS: s.defaulted(positiveInt, 12),
    PAART_ADMIN_EMAIL: s.defaulted(s.string(), "admin@paart.in"),
    PAART_ADMIN_PASSWORD: s.defaulted(s.string(), "Paart@2026Admin"),
    PAART_HONEYPOT_SECRET: s.defaulted(s.string(), "paart-dev-only-honeypot-secret-2026"),
    SMTP_HOST: s.defaulted(s.string(), "").transform((val) => val.trim()),
    SMTP_PORT: s.defaulted(positiveInt, 587),
    SMTP_SECURE: s.defaulted(booleanFlag, false),
    SMTP_USER: s.defaulted(s.string(), "").transform((val) => val.trim()),
    SMTP_PASS: s.defaulted(s.string(), ""),
    SMTP_FROM: s
      .defaulted(s.string(), "PAART Academy <no-reply@paart.in>")
      .transform((val) => val.trim() || "PAART Academy <no-reply@paart.in>")
  })
  .refine(
    (cfg) =>
      cfg.NODE_ENV !== "production" ||
      (cfg.PAART_AUTH_SECRET.length >= 24 &&
        !cfg.PAART_AUTH_SECRET.includes("dev-only") &&
        cfg.PAART_ADMIN_PASSWORD !== "Paart@2026Admin"),
    "Production requires secure PAART_AUTH_SECRET (>=24 chars) and non-default PAART_ADMIN_PASSWORD."
  )

export function parseAppConfig(env: Record<string, unknown>) {
  // Normalize empty-string numeric env vars so defaults apply cleanly when blank in .env
  const normalized: Record<string, unknown> = { ...env }
  if (!normalized.DATABASE_URL && normalized.PAART_DATABASE_URL) {
    normalized.DATABASE_URL = normalized.PAART_DATABASE_URL
  }
  for (const key of ["PORT", "SMTP_PORT", "PAART_SESSION_TTL_HOURS"]) {
    if (normalized[key] === "") {
      delete normalized[key]
    }
  }
  try {
    return s.parse(appConfigSchema, normalized)
  } catch (err: unknown) {
    const errorWithIssues = err as { issues?: Array<{ message?: string }> }
    if (errorWithIssues?.issues?.length) {
      console.error(
        "[AppConfig] Validation failed:\n" +
          errorWithIssues.issues.map((i) => `  - ${i.message}`).join("\n")
      )
    }
    throw err
  }
}

export type AppConfig = ReturnType<typeof parseAppConfig>

export const appConfig = parseAppConfig({
  ...process.env
})
