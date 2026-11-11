import crypto from "node:crypto"
import { appConfig } from "~/config/app"

export const ADMIN_SESSION_COOKIE = "paart_admin_session"
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8 // 8 hours

export interface AdminUser {
  id: string
  name: string
  email: string
  role: "admin"
}

interface SessionPayload {
  email: string
  name: string
  exp: number
}

function hashPassword(password: string): Buffer {
  return crypto.pbkdf2Sync(password, "paart-academy-pbkdf2-v1", 100_000, 32, "sha256")
}

function signPayload(encodedPayload: string): string {
  return crypto
    .createHmac("sha256", appConfig.PAART_AUTH_SECRET)
    .update(encodedPayload)
    .digest("base64url")
}

export function verifyAdminCredentials(email: string, password: string): AdminUser | null {
  const expectedEmail = appConfig.PAART_ADMIN_EMAIL.trim().toLowerCase()
  const incomingEmail = email.trim().toLowerCase()
  if (!incomingEmail || incomingEmail !== expectedEmail) {
    return null
  }

  const expectedHash = hashPassword(appConfig.PAART_ADMIN_PASSWORD)
  const incomingHash = hashPassword(password)
  if (!crypto.timingSafeEqual(expectedHash, incomingHash)) {
    return null
  }

  return {
    id: "admin-1",
    name: "PAART Administrator",
    email: expectedEmail,
    role: "admin"
  }
}

export function createSessionCookieHeader(user: AdminUser): string {
  const payload: SessionPayload = {
    email: user.email,
    name: user.name,
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000
  }
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url")
  const signature = signPayload(encoded)
  const secureFlag = appConfig.NODE_ENV === "production" ? "; Secure" : ""

  return `${ADMIN_SESSION_COOKIE}=${encoded}.${signature}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_SECONDS}${secureFlag}`
}

export function clearSessionCookieHeader(): string {
  const secureFlag = appConfig.NODE_ENV === "production" ? "; Secure" : ""
  return `${ADMIN_SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secureFlag}`
}

export function getSessionUser(request: Request): AdminUser | null {
  const cookieHeader = request.headers.get("Cookie")
  if (!cookieHeader) return null

  let rawToken: string | null = null
  for (const part of cookieHeader.split(";")) {
    const idx = part.indexOf("=")
    if (idx === -1) continue
    const name = part.slice(0, idx).trim()
    if (name === ADMIN_SESSION_COOKIE) {
      rawToken = part.slice(idx + 1).trim()
      break
    }
  }

  if (!rawToken) return null
  const dotIdx = rawToken.indexOf(".")
  if (dotIdx === -1) return null

  const encoded = rawToken.slice(0, dotIdx)
  const signature = rawToken.slice(dotIdx + 1)
  const expectedSignature = signPayload(encoded)

  const sigBuf = Buffer.from(signature)
  const expBuf = Buffer.from(expectedSignature)
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null
  }

  try {
    const parsed = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionPayload
    if (!parsed.exp || parsed.exp < Date.now()) return null
    return {
      id: "admin-1",
      name: parsed.name || "PAART Administrator",
      email: parsed.email,
      role: "admin"
    }
  } catch {
    return null
  }
}
