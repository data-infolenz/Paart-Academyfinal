import {
  Hex,
  hmac,
  password as cryptoPassword,
  randomString,
  randomToken,
  sha256
} from "@sdxc/crypto"
import { parseEmailAddress } from "@sdxc/email-address"
import { isSuccess, unwrap } from "@sdxc/result"
import { generateUUID } from "@sdxc/uuid/v7"
import { db as defaultDb, type PaartDb } from "~/app/initializers/database"
import { appConfig } from "~/config/app"
import { sessions, type UserRole, type UserRow, type UserStatus, users } from "~/database/schema"

export const PAART_SESSION_COOKIE = "paart_session"
export const LEGACY_ADMIN_SESSION_COOKIE = "paart_admin_session"

const TEMP_PASSWORD_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*"

let cachedDummyPasswordHashPromise: Promise<string> | null = null

function getDummyPasswordHash(): Promise<string> {
  if (!cachedDummyPasswordHashPromise) {
    cachedDummyPasswordHashPromise = cryptoPassword
      .hash("paart-timing-equalizer-dummy-secret-2026!")
      .then((res) => unwrap(res))
  }
  return cachedDummyPasswordHashPromise
}

export interface SessionUser {
  id: string
  name: string
  fullName: string
  email: string
  phone: string
  department: string
  role: UserRole
  status: UserStatus
  mustChangePassword: boolean
}

export type AdminUser = SessionUser

export interface ResolvedAuthSession {
  user: SessionUser
  sessionId: string
  rawToken: string
}

export function mapUserToSessionUser(row: UserRow): SessionUser {
  return {
    id: row.id,
    name: row.full_name,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    department: row.department,
    role: row.role,
    status: row.status,
    mustChangePassword: Boolean(row.must_change_password)
  }
}

export function workspaceHrefForRole(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin"
    case "faculty":
      return "/faculty"
    case "aspirant":
      return "/portal"
  }
}

export function normalizeUserEmail(raw: string): { address: string; canonical: string } | null {
  const parsed = parseEmailAddress(raw)
  if (!isSuccess(parsed)) {
    return null
  }
  return {
    address: parsed.data.address,
    canonical: parsed.data.canonical
  }
}

export async function hashUserPassword(plainPassword: string): Promise<string> {
  return unwrap(await cryptoPassword.hash(plainPassword))
}

export async function verifyUserPassword(
  storedHash: string,
  plainPassword: string
): Promise<boolean> {
  if (!cryptoPassword.recognizes(storedHash)) {
    return false
  }
  const verified = await cryptoPassword.verify(storedHash, plainPassword)
  return isSuccess(verified) && verified.data
}

export function generateTemporaryPassword(length = 16): string {
  const safeLen = Math.max(15, length)
  return randomString({
    length: safeLen,
    alphabet: TEMP_PASSWORD_ALPHABET
  })
}

export async function hashSessionToken(rawToken: string): Promise<string> {
  return Hex.encode(unwrap(await sha256(rawToken)))
}

export async function signSessionToken(rawToken: string): Promise<string> {
  const sig = Hex.encode(unwrap(await hmac.sign(appConfig.PAART_AUTH_SECRET, rawToken)))
  return `${rawToken}.${sig}`
}

export async function verifySignedSessionCookie(cookieValue: string): Promise<string | null> {
  const dotIdx = cookieValue.lastIndexOf(".")
  if (dotIdx <= 0) return null
  const rawToken = cookieValue.slice(0, dotIdx)
  const signatureHex = cookieValue.slice(dotIdx + 1)
  const decodedSig = Hex.decode(signatureHex)
  if (!isSuccess(decodedSig)) return null

  const valid = await hmac.verify(appConfig.PAART_AUTH_SECRET, rawToken, decodedSig.data)
  if (!isSuccess(valid) || !valid.data) return null
  return rawToken
}

export function extractCookieValue(
  request: Request,
  cookieName = PAART_SESSION_COOKIE
): string | null {
  const cookieHeader = request.headers.get("Cookie")
  if (!cookieHeader) return null

  for (const part of cookieHeader.split(";")) {
    const idx = part.indexOf("=")
    if (idx === -1) continue
    const name = part.slice(0, idx).trim()
    if (name === cookieName) {
      return part.slice(idx + 1).trim() || null
    }
  }
  return null
}

export function formatSessionCookieHeader(signedValue: string, maxAgeSeconds?: number): string {
  const ttlSeconds = maxAgeSeconds ?? appConfig.PAART_SESSION_TTL_HOURS * 60 * 60
  const secureFlag = appConfig.NODE_ENV === "production" ? "; Secure" : ""
  return `${PAART_SESSION_COOKIE}=${signedValue}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${ttlSeconds}${secureFlag}`
}

export function clearSessionCookieHeader(): string {
  const secureFlag = appConfig.NODE_ENV === "production" ? "; Secure" : ""
  return `${PAART_SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secureFlag}`
}

export async function authenticateCredentials(
  email: string,
  plainPassword: string,
  targetDb: PaartDb = defaultDb
): Promise<SessionUser | null> {
  const normalized = normalizeUserEmail(email)
  if (!normalized) {
    const dummy = await getDummyPasswordHash()
    await verifyUserPassword(dummy, plainPassword)
    return null
  }

  const row = await targetDb.findOne(users, { where: { email: normalized.canonical } })
  if (!row || row.status !== "active") {
    const dummy = row?.password_hash ?? (await getDummyPasswordHash())
    await verifyUserPassword(dummy, plainPassword)
    return null
  }

  const isValid = await verifyUserPassword(row.password_hash, plainPassword)
  if (!isValid) {
    return null
  }

  const now = new Date()
  if (cryptoPassword.needsRehash(row.password_hash)) {
    const upgradedHash = await hashUserPassword(plainPassword)
    await targetDb.update(users, row.id, {
      password_hash: upgradedHash,
      last_login_at: now,
      updated_at: now
    })
  } else {
    await targetDb.update(users, row.id, {
      last_login_at: now,
      updated_at: now
    })
  }

  return mapUserToSessionUser(row)
}

export async function createSession(
  userId: string,
  meta: { ipAddress?: string; userAgent?: string } = {},
  targetDb: PaartDb = defaultDb
): Promise<{
  sessionId: string
  rawToken: string
  cookieHeader: string
  expiresAt: Date
}> {
  const sessionId = generateUUID()
  const rawToken = randomToken({ bytes: 32, prefix: "psess" })
  const tokenHash = await hashSessionToken(rawToken)
  const ttlSeconds = appConfig.PAART_SESSION_TTL_HOURS * 60 * 60
  const now = new Date()
  const expiresAt = new Date(now.getTime() + ttlSeconds * 1000)

  await targetDb.create(sessions, {
    id: sessionId,
    user_id: userId,
    token_hash: tokenHash,
    ip_address: (meta.ipAddress ?? "").slice(0, 120),
    user_agent: (meta.userAgent ?? "").slice(0, 500),
    expires_at: expiresAt,
    created_at: now
  })

  const signed = await signSessionToken(rawToken)
  const cookieHeader = formatSessionCookieHeader(signed, ttlSeconds)

  return {
    sessionId,
    rawToken,
    cookieHeader,
    expiresAt
  }
}

export async function resolveSession(
  request: Request,
  targetDb: PaartDb = defaultDb
): Promise<ResolvedAuthSession | null> {
  const cookieVal = extractCookieValue(request, PAART_SESSION_COOKIE)
  if (!cookieVal) return null

  const rawToken = await verifySignedSessionCookie(cookieVal)
  if (!rawToken) return null

  try {
    const tokenHash = await hashSessionToken(rawToken)
    const sessionRow = await targetDb.findOne(sessions, { where: { token_hash: tokenHash } })
    if (!sessionRow) return null

    const expiresAt =
      sessionRow.expires_at instanceof Date
        ? sessionRow.expires_at
        : new Date(String(sessionRow.expires_at))

    if (Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() <= Date.now()) {
      await targetDb.delete(sessions, sessionRow.id).catch(() => {})
      return null
    }

    const userRow = await targetDb.find(users, sessionRow.user_id)
    if (!userRow || userRow.status !== "active") {
      await targetDb.delete(sessions, sessionRow.id).catch(() => {})
      return null
    }

    return {
      user: mapUserToSessionUser(userRow),
      sessionId: sessionRow.id,
      rawToken
    }
  } catch {
    return null
  }
}

export async function revokeSession(
  requestOrRawToken: Request | string,
  targetDb: PaartDb = defaultDb
): Promise<void> {
  let rawToken: string | null = null
  if (typeof requestOrRawToken === "string") {
    rawToken = requestOrRawToken
  } else {
    const cookieVal = extractCookieValue(requestOrRawToken, PAART_SESSION_COOKIE)
    if (cookieVal) {
      rawToken = await verifySignedSessionCookie(cookieVal)
    }
  }
  if (!rawToken) return

  try {
    const tokenHash = await hashSessionToken(rawToken)
    await targetDb.deleteMany(sessions, { where: { token_hash: tokenHash } })
  } catch {
    // ignore if session already deleted or DB unavailable
  }
}

export async function revokeUserSessions(
  userId: string,
  exceptSessionId?: string,
  targetDb: PaartDb = defaultDb
): Promise<void> {
  const userSessions = await targetDb.findMany(sessions, { where: { user_id: userId } })
  for (const s of userSessions) {
    if (exceptSessionId && s.id === exceptSessionId) continue
    await targetDb.delete(sessions, s.id)
  }
}
