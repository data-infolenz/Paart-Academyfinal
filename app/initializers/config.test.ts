import { describe, expect, it } from "vitest"
import { parseAppConfig } from "~/config/app"

describe("parseAppConfig", () => {
  it("applies local MemoryTransport fallback defaults when SMTP_HOST is omitted or blank", () => {
    const cfg = parseAppConfig({
      NODE_ENV: "development",
      SMTP_HOST: "   ",
      SMTP_PORT: ""
    })

    expect(cfg.SMTP_HOST).toBe("")
    expect(cfg.SMTP_PORT).toBe(587)
    expect(cfg.SMTP_SECURE).toBe(false)
    expect(cfg.SMTP_USER).toBe("")
    expect(cfg.SMTP_PASS).toBe("")
    expect(cfg.SMTP_FROM).toBe("PAART Academy <no-reply@paart.in>")
    expect(cfg.PAART_SESSION_TTL_HOURS).toBe(12)
  })

  it("parses explicit SMTP relay and session settings accurately", () => {
    const cfg = parseAppConfig({
      NODE_ENV: "production",
      PAART_AUTH_SECRET: "a-very-strong-production-session-secret-key-2026",
      PAART_ADMIN_PASSWORD: "UniqueProdBootstrapPassword!99",
      PAART_SESSION_TTL_HOURS: "24",
      SMTP_HOST: " smtp.paart.in ",
      SMTP_PORT: "465",
      SMTP_SECURE: "true",
      SMTP_USER: " mailer@paart.in ",
      SMTP_PASS: "smtp-secret-token",
      SMTP_FROM: "PAART Admissions <admissions@paart.in>"
    })

    expect(cfg.SMTP_HOST).toBe("smtp.paart.in")
    expect(cfg.SMTP_PORT).toBe(465)
    expect(cfg.SMTP_SECURE).toBe(true)
    expect(cfg.SMTP_USER).toBe("mailer@paart.in")
    expect(cfg.SMTP_PASS).toBe("smtp-secret-token")
    expect(cfg.SMTP_FROM).toBe("PAART Admissions <admissions@paart.in>")
    expect(cfg.PAART_SESSION_TTL_HOURS).toBe(24)
  })

  it("normalizes PAART_PUBLIC_URL and auto-prefixes https:// when missing protocol", () => {
    const cfg = parseAppConfig({
      NODE_ENV: "development",
      PAART_PUBLIC_URL: "paart-academyfinal-theta.vercel.app"
    })
    expect(cfg.PAART_PUBLIC_URL).toBe("https://paart-academyfinal-theta.vercel.app")

    const cfgVercel = parseAppConfig({
      NODE_ENV: "development",
      VERCEL_URL: "paart-preview.vercel.app"
    })
    expect(cfgVercel.PAART_PUBLIC_URL).toBe("https://paart-preview.vercel.app")
  })

  it("rejects insecure default secrets in production mode", () => {
    let caught: unknown
    try {
      parseAppConfig({
        NODE_ENV: "production"
      })
    } catch (err) {
      caught = err
    }

    expect(caught).toBeInstanceOf(Error)
    const issues = (caught as { issues?: Array<{ message: string }> }).issues ?? []
    expect(
      issues.some((i) => i.message.includes("Production requires secure PAART_AUTH_SECRET"))
    ).toBe(true)
  })
})
