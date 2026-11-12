import { generateUUID } from "@sdxc/uuid/v7"
import { catchResponse } from "@sdxc/catch-response-middleware"
import { createRouter } from "remix/router"
import { get, post, route } from "remix/routes"
import { afterAll, describe, expect, it } from "vitest"
import {
  enforcePasswordChange,
  loadSessionUser,
  requireAdmin,
  requireAspirant,
  requireFacultyOrAdmin,
  requireRole
} from "~/app/http/middleware/auth"
import { createSession, hashUserPassword, PAART_SESSION_COOKIE } from "~/app/initializers/auth"
import { canRoleAccessWorkspace } from "~/app/initializers/authz"
import { db } from "~/app/initializers/database"
import { type UserRole, users } from "~/database/schema"

const createdUserIds: string[] = []

afterAll(async () => {
  for (const id of createdUserIds) {
    await db.delete(users, id).catch(() => {})
  }
})

async function createTestUser(role: UserRole, mustChangePassword = false) {
  const id = generateUUID()
  createdUserIds.push(id)
  const now = new Date()
  await db.create(users, {
    id,
    email: `mw-${role}-${id.slice(-8)}@paart.in`,
    full_name: `Test ${role}`,
    phone: "",
    department: "",
    role,
    password_hash: await hashUserPassword("ValidTestPassword!2026"),
    must_change_password: mustChangePassword,
    status: "active",
    last_login_at: null,
    credentials_sent_at: now,
    credentials_delivery_error: null,
    created_at: now,
    updated_at: now
  })
  const sess = await createSession(id)
  const cookie = sess.cookieHeader.split(";")[0] ?? ""
  return { id, cookie }
}

const testRoutes = route({
  adminHome: get("/admin"),
  facultyHome: get("/faculty"),
  facultyAction: post("/faculty/exams"),
  portalHome: get("/portal"),
  changePassword: get("/account/change-password")
})

function buildTestRouter() {
  const r = createRouter({
    middleware: [catchResponse(), loadSessionUser(), enforcePasswordChange()]
  })

  r.map(testRoutes.adminHome, {
    middleware: [requireRole(["admin"])],
    handler(ctx) {
      const u = requireAdmin(ctx.request)
      return new Response(`admin:${u.role}`)
    }
  })
  r.map(testRoutes.facultyHome, {
    middleware: [requireRole(["faculty", "admin"])],
    handler(ctx) {
      const u = requireFacultyOrAdmin(ctx.request)
      return new Response(`faculty:${u.role}`)
    }
  })
  r.map(testRoutes.facultyAction, {
    middleware: [requireRole(["faculty", "admin"])],
    handler() {
      return new Response("exam-created")
    }
  })
  r.map(testRoutes.portalHome, {
    middleware: [requireRole(["aspirant"])],
    handler(ctx) {
      const u = requireAspirant(ctx.request)
      return new Response(`portal:${u.role}`)
    }
  })
  r.map(testRoutes.changePassword, {
    handler() {
      return new Response("change-password-form")
    }
  })

  return r
}

describe("authz policies & auth middleware (RBAC + must_change_password)", () => {
  it("redirects unauthenticated visitors to /login and clears stale session cookies", async () => {
    const router = buildTestRouter()

    const unauthRes = await router.fetch(new Request("http://localhost:5173/portal"))
    expect(unauthRes.status).toBe(303)
    expect(unauthRes.headers.get("Location")).toBe("/login")

    const staleRes = await router.fetch(
      new Request("http://localhost:5173/admin", {
        headers: { Cookie: `${PAART_SESSION_COOKIE}=stale.invalid` }
      })
    )
    expect(staleRes.status).toBe(303)
    expect(staleRes.headers.get("Location")).toBe("/login")
    expect(staleRes.headers.get("Set-Cookie")).toContain("Max-Age=0")
  })

  it("enforces cross-role 403 Forbidden isolation across /admin, /faculty, and /portal", async () => {
    const router = buildTestRouter()
    const [admin, faculty, aspirant] = await Promise.all([
      createTestUser("admin"),
      createTestUser("faculty"),
      createTestUser("aspirant")
    ])

    // Aspirant -> /portal allowed, /faculty & /admin denied with 403
    const aspPortal = await router.fetch(
      new Request("http://localhost:5173/portal", { headers: { Cookie: aspirant.cookie } })
    )
    expect(aspPortal.status).toBe(200)
    expect(await aspPortal.text()).toBe("portal:aspirant")

    const aspFaculty = await router.fetch(
      new Request("http://localhost:5173/faculty/exams", {
        method: "POST",
        headers: { Cookie: aspirant.cookie }
      })
    )
    expect(aspFaculty.status).toBe(403)

    const aspAdmin = await router.fetch(
      new Request("http://localhost:5173/admin", { headers: { Cookie: aspirant.cookie } })
    )
    expect(aspAdmin.status).toBe(403)

    // Faculty -> /faculty allowed, /admin & /portal denied with 403
    const facHome = await router.fetch(
      new Request("http://localhost:5173/faculty", { headers: { Cookie: faculty.cookie } })
    )
    expect(facHome.status).toBe(200)
    expect(await facHome.text()).toBe("faculty:faculty")

    const facAdmin = await router.fetch(
      new Request("http://localhost:5173/admin", { headers: { Cookie: faculty.cookie } })
    )
    expect(facAdmin.status).toBe(403)

    // Admin -> /admin and /faculty allowed
    const admHome = await router.fetch(
      new Request("http://localhost:5173/admin", { headers: { Cookie: admin.cookie } })
    )
    expect(admHome.status).toBe(200)
    const admFaculty = await router.fetch(
      new Request("http://localhost:5173/faculty", { headers: { Cookie: admin.cookie } })
    )
    expect(admFaculty.status).toBe(200)

    expect(
      await canRoleAccessWorkspace(
        {
          id: "1",
          name: "A",
          fullName: "A",
          email: "a@paart.in",
          phone: "",
          department: "",
          role: "faculty",
          status: "active",
          mustChangePassword: false
        },
        "admin"
      )
    ).toBe(false)
  })

  it("gates accounts with must_change_password = true to /account/change-password", async () => {
    const router = buildTestRouter()
    const newAspirant = await createTestUser("aspirant", true)

    const blockedPortal = await router.fetch(
      new Request("http://localhost:5173/portal", { headers: { Cookie: newAspirant.cookie } })
    )
    expect(blockedPortal.status).toBe(303)
    expect(blockedPortal.headers.get("Location")).toBe("/account/change-password")

    const allowedChangePage = await router.fetch(
      new Request("http://localhost:5173/account/change-password", {
        headers: { Cookie: newAspirant.cookie }
      })
    )
    expect(allowedChangePage.status).toBe(200)
    expect(await allowedChangePage.text()).toBe("change-password-form")
  })
})
