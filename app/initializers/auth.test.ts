import { generateUUID } from "@sdxc/uuid/v7"
import { afterAll, describe, expect, it } from "vitest"
import {
  authenticateCredentials,
  clearSessionCookieHeader,
  createSession,
  generateTemporaryPassword,
  hashSessionToken,
  hashUserPassword,
  normalizeUserEmail,
  PAART_SESSION_COOKIE,
  resolveSession,
  revokeSession,
  revokeUserSessions,
  verifyUserPassword,
  workspaceHrefForRole
} from "~/app/initializers/auth"
import { db } from "~/app/initializers/database"
import { sessions, users } from "~/database/schema"

const createdUserIds: string[] = []

afterAll(async () => {
  for (const id of createdUserIds) {
    await db.delete(users, id).catch(() => {})
  }
})

function cookieFromSetCookieHeader(setCookie: string): string {
  return setCookie.split(";")[0] ?? ""
}

describe("auth initializer (scrypt, email normalization & revocable DB sessions)", () => {
  it("normalizes email addresses and generates high-entropy temporary passwords", () => {
    const parsed = normalizeUserEmail("  Faculty.Member@PAART.in ")
    expect(parsed).toEqual({
      address: "Faculty.Member@paart.in",
      canonical: "faculty.member@paart.in"
    })
    expect(normalizeUserEmail("not-an-email")).toBeNull()

    const temp1 = generateTemporaryPassword()
    const temp2 = generateTemporaryPassword()
    expect(temp1.length).toBeGreaterThanOrEqual(15)
    expect(temp1).not.toBe(temp2)
  })

  it("hashes and verifies passwords with @sdxc/crypto scrypt", async () => {
    const hash = await hashUserPassword("CorrectHorseBatteryStaple!26")
    expect(hash.startsWith("$scrypt$")).toBe(true)
    expect(await verifyUserPassword(hash, "CorrectHorseBatteryStaple!26")).toBe(true)
    expect(await verifyUserPassword(hash, "WrongPassword!26")).toBe(false)
  })

  it("authenticates active users, rejects suspended users, and manages revocable sessions", async () => {
    const userId = generateUUID()
    createdUserIds.push(userId)
    const email = `auth-test-${userId.slice(-8)}@paart.in`
    const secret = "TempAuthSecret!2026Strong"
    const now = new Date()

    await db.create(users, {
      id: userId,
      email,
      full_name: "Test Faculty User",
      phone: "+91 9000011111",
      department: "Polity",
      role: "faculty",
      password_hash: await hashUserPassword(secret),
      must_change_password: true,
      status: "active",
      last_login_at: null,
      credentials_sent_at: now,
      credentials_delivery_error: null,
      created_at: now,
      updated_at: now
    })

    // Valid credentials
    const authed = await authenticateCredentials(`  ${email.toUpperCase()} `, secret)
    expect(authed).not.toBeNull()
    expect(authed?.id).toBe(userId)
    expect(authed?.role).toBe("faculty")
    expect(authed?.mustChangePassword).toBe(true)
    expect(workspaceHrefForRole("faculty")).toBe("/faculty")
    expect(workspaceHrefForRole("aspirant")).toBe("/portal")
    expect(workspaceHrefForRole("admin")).toBe("/admin")

    // Wrong password rejected
    expect(await authenticateCredentials(email, "IncorrectSecret!2026")).toBeNull()

    // Create DB session and verify token is hashed in DB
    const sess1 = await createSession(userId, { ipAddress: "127.0.0.1", userAgent: "Vitest" })
    expect(sess1.cookieHeader).toContain(`${PAART_SESSION_COOKIE}=`)
    expect(sess1.cookieHeader).toContain("HttpOnly")

    const storedRow = await db.find(sessions, sess1.sessionId)
    expect(storedRow?.token_hash).toBe(await hashSessionToken(sess1.rawToken))
    expect(storedRow?.token_hash).not.toBe(sess1.rawToken)

    // Resolve session from request Cookie header
    const req1 = new Request("http://localhost:5173/faculty", {
      headers: { Cookie: cookieFromSetCookieHeader(sess1.cookieHeader) }
    })
    const resolved1 = await resolveSession(req1)
    expect(resolved1?.user.id).toBe(userId)
    expect(resolved1?.sessionId).toBe(sess1.sessionId)

    // Tampered cookie signature rejected
    const tamperedReq = new Request("http://localhost:5173/faculty", {
      headers: { Cookie: `${PAART_SESSION_COOKIE}=${sess1.rawToken}.deadbeef` }
    })
    expect(await resolveSession(tamperedReq)).toBeNull()

    // Create a second session, then revoke all except sess2
    const sess2 = await createSession(userId)
    await revokeUserSessions(userId, sess2.sessionId)
    expect(await resolveSession(req1)).toBeNull()

    const req2 = new Request("http://localhost:5173/faculty", {
      headers: { Cookie: cookieFromSetCookieHeader(sess2.cookieHeader) }
    })
    expect((await resolveSession(req2))?.sessionId).toBe(sess2.sessionId)

    // Suspending the account immediately invalidates active session resolution and sign-in
    await db.update(users, userId, { status: "suspended", updated_at: new Date() })
    expect(await authenticateCredentials(email, secret)).toBeNull()
    expect(await resolveSession(req2)).toBeNull()

    // Explicit logout revocation & cookie clear header
    await revokeSession(sess2.rawToken)
    expect(clearSessionCookieHeader()).toContain("Max-Age=0")
  })
})
