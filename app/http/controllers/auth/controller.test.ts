import { generateUUID } from "@sdxc/uuid/v7"
import { afterAll, describe, expect, it } from "vitest"
import { hashUserPassword, resolveSession } from "~/app/initializers/auth"
import { db } from "~/app/initializers/database"
import router from "~/app/initializers/router"
import { type UserRole, users } from "~/database/schema"

const createdUserIds: string[] = []

afterAll(async () => {
  for (const id of createdUserIds) {
    await db.delete(users, id).catch(() => {})
  }
})

async function seedRoleUser(
  role: UserRole,
  plainPassword: string,
  options: { mustChangePassword?: boolean; status?: "active" | "suspended" } = {}
) {
  const id = generateUUID()
  createdUserIds.push(id)
  const email = `route-${role}-${id.slice(-8)}@paart.in`
  const now = new Date()

  await db.create(users, {
    id,
    email,
    full_name: `Dr. ${role.toUpperCase()} Tester`,
    phone: "+91 9842100999",
    department: "Civil Services",
    role,
    password_hash: await hashUserPassword(plainPassword),
    must_change_password: options.mustChangePassword ?? false,
    status: options.status ?? "active",
    last_login_at: null,
    credentials_sent_at: now,
    credentials_delivery_error: null,
    created_at: now,
    updated_at: now
  })

  return { id, email }
}

function formRequest(path: string, fields: Record<string, string>, cookie?: string) {
  const body = new URLSearchParams(fields)
  const headers: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded"
  }
  if (cookie) headers.Cookie = cookie
  return new Request(`http://localhost:5173${path}`, {
    method: "POST",
    headers,
    body
  })
}

function cookiePair(res: Response): string {
  return res.headers.get("Set-Cookie")?.split(";")[0] ?? ""
}

describe("auth routes (/login, /logout, /admin/sign-in, /account/change-password)", () => {
  it("redirects legacy GET /admin/sign-in to /login and renders unified sign-in page", async () => {
    const legacy = await router.fetch(new Request("http://localhost:5173/admin/sign-in"))
    expect(legacy.status).toBe(302)
    expect(legacy.headers.get("Location")).toBe("/login")

    const loginPage = await router.fetch(new Request("http://localhost:5173/login"))
    expect(loginPage.status).toBe(200)
    const html = await loginPage.text()
    expect(html).toContain("PAART Academy Portal Sign In")
  })

  it("signs in admin, faculty, and aspirant to their respective workspaces and renders role-aware header links", async () => {
    const secret = "ValidWorkspacePass!2026"
    const [admin, faculty, aspirant] = await Promise.all([
      seedRoleUser("admin", secret),
      seedRoleUser("faculty", secret),
      seedRoleUser("aspirant", secret)
    ])

    const adminLogin = await router.fetch(
      formRequest("/login", { email: admin.email, password: secret })
    )
    expect(adminLogin.status).toBe(303)
    expect(adminLogin.headers.get("Location")).toBe("/admin")

    const facultyLogin = await router.fetch(
      formRequest("/login", { email: faculty.email, password: secret })
    )
    expect(facultyLogin.status).toBe(303)
    expect(facultyLogin.headers.get("Location")).toBe("/faculty")

    const aspirantLogin = await router.fetch(
      formRequest("/login", { email: aspirant.email, password: secret })
    )
    expect(aspirantLogin.status).toBe(303)
    expect(aspirantLogin.headers.get("Location")).toBe("/portal")

    // Verify public landing page reflects role workspace link
    const aspirantCookie = cookiePair(aspirantLogin)
    const homeAsAspirant = await router.fetch(
      new Request("http://localhost:5173/about", {
        headers: { Cookie: aspirantCookie }
      })
    )
    const aboutHtml = await homeAsAspirant.text()
    expect(aboutHtml).toContain("Aspirant Portal")
    expect(aboutHtml).toContain('href="/portal"')
  })

  it("rejects invalid credentials and suspended accounts with generic 422 error and revokes session on logout", async () => {
    const suspended = await seedRoleUser("faculty", "ValidSuspendedSecret!26", {
      status: "suspended"
    })

    const badLogin = await router.fetch(
      formRequest("/login", { email: "nobody@paart.in", password: "WrongPassword!26" })
    )
    expect(badLogin.status).toBe(422)
    expect(badLogin.headers.get("Set-Cookie")).toBeNull()
    expect(await badLogin.text()).toContain("Invalid email address or password.")

    const suspendedLogin = await router.fetch(
      formRequest("/login", { email: suspended.email, password: "ValidSuspendedSecret!26" })
    )
    expect(suspendedLogin.status).toBe(422)
    expect(await suspendedLogin.text()).toContain("Invalid email address or password.")

    // Sign in and sign out
    const active = await seedRoleUser("aspirant", "ActiveLogoutSecret!26")
    const loginRes = await router.fetch(
      formRequest("/login", { email: active.email, password: "ActiveLogoutSecret!26" })
    )
    const cookie = cookiePair(loginRes)
    expect(
      await resolveSession(
        new Request("http://localhost:5173/portal", { headers: { Cookie: cookie } })
      )
    ).not.toBeNull()

    const logoutRes = await router.fetch(formRequest("/logout", {}, cookie))
    expect(logoutRes.status).toBe(303)
    expect(logoutRes.headers.get("Location")).toBe("/login")
    expect(logoutRes.headers.get("Set-Cookie")).toContain("Max-Age=0")

    // Server-side session is revoked
    expect(
      await resolveSession(
        new Request("http://localhost:5173/portal", { headers: { Cookie: cookie } })
      )
    ).toBeNull()
  })

  it("enforces first-login password rotation with @sdxc/password-policy and rotates session", async () => {
    const tempPass = "Tmp#92kLmXz74QpR"
    const provisioned = await seedRoleUser("aspirant", tempPass, { mustChangePassword: true })

    // First login redirects to /account/change-password
    const loginRes = await router.fetch(
      formRequest("/login", { email: provisioned.email, password: tempPass })
    )
    expect(loginRes.status).toBe(303)
    expect(loginRes.headers.get("Location")).toBe("/account/change-password")
    const initialCookie = cookiePair(loginRes)

    // Rejects short password
    const shortRes = await router.fetch(
      formRequest(
        "/account/change-password",
        {
          currentPassword: tempPass,
          newPassword: "short",
          confirmPassword: "short"
        },
        initialCookie
      )
    )
    expect(shortRes.status).toBe(422)
    expect(await shortRes.text()).toContain("at least 12 characters")

    // Rejects identifier-containing password
    const identRes = await router.fetch(
      formRequest(
        "/account/change-password",
        {
          currentPassword: tempPass,
          newPassword: `${provisioned.email}-extra`,
          confirmPassword: `${provisioned.email}-extra`
        },
        initialCookie
      )
    )
    expect(identRes.status).toBe(422)

    // Rejects reuse of temporary password
    const reuseRes = await router.fetch(
      formRequest(
        "/account/change-password",
        {
          currentPassword: tempPass,
          newPassword: tempPass,
          confirmPassword: tempPass
        },
        initialCookie
      )
    )
    expect(reuseRes.status).toBe(422)
    expect(await reuseRes.text()).toContain("different from your current")

    // Accepts strong compliant password, clears must_change_password, rotates session, and redirects to /portal
    const newPermPass = "BanyanRiverMorningStudy!84"
    const okRes = await router.fetch(
      formRequest(
        "/account/change-password",
        {
          currentPassword: tempPass,
          newPassword: newPermPass,
          confirmPassword: newPermPass
        },
        initialCookie
      )
    )
    expect(okRes.status).toBe(303)
    expect(okRes.headers.get("Location")).toBe("/portal")
    const rotatedCookie = cookiePair(okRes)
    expect(rotatedCookie).not.toBe(initialCookie)

    // Old session cookie is invalidated
    expect(
      await resolveSession(
        new Request("http://localhost:5173/portal", { headers: { Cookie: initialCookie } })
      )
    ).toBeNull()

    // New session cookie resolves with mustChangePassword = false
    const resolvedAfter = await resolveSession(
      new Request("http://localhost:5173/portal", { headers: { Cookie: rotatedCookie } })
    )
    expect(resolvedAfter?.user.mustChangePassword).toBe(false)
  })
})
