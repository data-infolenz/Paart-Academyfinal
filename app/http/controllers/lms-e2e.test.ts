import { isComposedEmail } from "@sdxc/mail"
import { MemoryTransport } from "@sdxc/mail/memory"
import { generateUUID } from "@sdxc/uuid/v7"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { hashUserPassword } from "~/app/initializers/auth"
import { db } from "~/app/initializers/database"
import { createPaartMailer, paartEmails, setMailerOverrideForTests } from "~/app/initializers/mail"
import router from "~/app/initializers/router"
import { batches, courses, users } from "~/database/schema"

const createdUserIds: string[] = []
const createdBatchIds: string[] = []
const outbox = new MemoryTransport({ mime: true })

beforeAll(() => {
  outbox.clear()
  setMailerOverrideForTests(createPaartMailer(outbox, "PAART Academy <no-reply@paartacademy.com>"))
})

afterAll(async () => {
  setMailerOverrideForTests(null)
  for (const id of createdBatchIds) {
    await db.delete(batches, id).catch(() => {})
  }
  for (const id of createdUserIds) {
    await db.delete(users, id).catch(() => {})
  }
})

function extractCookie(res: Response): string {
  return res.headers.get("Set-Cookie")?.split(";")[0] ?? ""
}

function postForm(path: string, fields: Record<string, string>, cookie?: string): Request {
  const headers: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded"
  }
  if (cookie) headers.Cookie = cookie
  return new Request(`http://localhost:5173${path}`, {
    method: "POST",
    headers,
    body: new URLSearchParams(fields)
  })
}

describe("end-to-end multi-role LMS lifecycle", () => {
  it("runs Admin provisioning -> SMTP capture -> first-login password rotation -> Faculty exam publish -> Aspirant scorecard inspection", async () => {
    // 1. Seed bootstrap Admin and sign in via /login
    const adminId = generateUUID()
    createdUserIds.push(adminId)
    const adminEmail = `e2e-admin-${adminId.slice(-7)}@paart.in`
    const adminPass = "AdminBootstrap#2026!"
    const now = new Date()

    await db.create(users, {
      id: adminId,
      email: adminEmail,
      full_name: "E2E Chief Administrator",
      phone: "+91 9840000001",
      department: "Directorate",
      role: "admin",
      password_hash: await hashUserPassword(adminPass),
      must_change_password: false,
      status: "active",
      last_login_at: null,
      credentials_sent_at: now,
      credentials_delivery_error: null,
      created_at: now,
      updated_at: now
    })

    const adminLoginRes = await router.fetch(
      postForm("/login", { email: adminEmail, password: adminPass })
    )
    expect(adminLoginRes.status).toBe(303)
    expect(adminLoginRes.headers.get("Location")).toBe("/admin")
    const adminCookie = extractCookie(adminLoginRes)

    // 2. Admin creates a Batch cohort
    const firstCourse = (await db.findMany(courses, { limit: 1 }))[0]!
    const batchCode = `E2E-${generateUUID().slice(-6).toUpperCase()}`
    const createBatchRes = await router.fetch(
      postForm(
        "/admin/batches",
        {
          courseId: firstCourse.id,
          name: "E2E Integrated Cohort",
          code: batchCode,
          scheduleLabel: "Mon-Sat 9:00 AM"
        },
        adminCookie
      )
    )
    expect(createBatchRes.status).toBe(303)
    const batchRow = await db.findOne(batches, { where: { code: batchCode } })
    expect(batchRow).not.toBeNull()
    createdBatchIds.push(batchRow!.id)

    // 3. Admin provisions Faculty and Aspirant accounts; capture temporary passwords from outbox
    const facultyEmail = `e2e-faculty-${generateUUID().slice(-7)}@paart.in`
    await router.fetch(
      postForm(
        "/admin/users",
        {
          role: "faculty",
          fullName: "Prof. E2E Mentor",
          email: facultyEmail,
          department: "General Studies"
        },
        adminCookie
      )
    )
    const facRow = await db.findOne(users, { where: { email: facultyEmail } })
    expect(facRow).not.toBeNull()
    createdUserIds.push(facRow!.id)

    const facMail = outbox.find(
      (m) =>
        isComposedEmail(m.email, paartEmails.welcomeCredentials) &&
        m.email.props.email === facultyEmail
    )
    expect(facMail).toBeDefined()
    const facultyTempPassword = isComposedEmail(facMail?.email, paartEmails.welcomeCredentials)
      ? facMail.email.props.temporaryPassword
      : ""
    expect(facultyTempPassword.length).toBeGreaterThanOrEqual(15)

    const aspirantEmail = `e2e-aspirant-${generateUUID().slice(-7)}@paart.in`
    await router.fetch(
      postForm(
        "/admin/users",
        {
          role: "aspirant",
          fullName: "Selvi E2E Aspirant",
          email: aspirantEmail,
          batchId: batchRow!.id
        },
        adminCookie
      )
    )
    const aspRow = await db.findOne(users, { where: { email: aspirantEmail } })
    expect(aspRow).not.toBeNull()
    createdUserIds.push(aspRow!.id)

    const aspMail = outbox.find(
      (m) =>
        isComposedEmail(m.email, paartEmails.welcomeCredentials) &&
        m.email.props.email === aspirantEmail
    )
    expect(aspMail).toBeDefined()
    const aspirantTempPassword = isComposedEmail(aspMail?.email, paartEmails.welcomeCredentials)
      ? aspMail.email.props.temporaryPassword
      : ""
    expect(aspirantTempPassword.length).toBeGreaterThanOrEqual(15)

    // 4. Aspirant first-login -> gated to /account/change-password -> rotates password -> enters /portal
    const aspFirstLogin = await router.fetch(
      postForm("/login", { email: aspirantEmail, password: aspirantTempPassword })
    )
    expect(aspFirstLogin.status).toBe(303)
    expect(aspFirstLogin.headers.get("Location")).toBe("/account/change-password")
    const aspTempCookie = extractCookie(aspFirstLogin)

    // Direct access to /portal before rotation must redirect to /account/change-password
    const blockedPortal = await router.fetch(
      new Request("http://localhost:5173/portal", { headers: { Cookie: aspTempCookie } })
    )
    expect(blockedPortal.status).toBe(303)
    expect(blockedPortal.headers.get("Location")).toBe("/account/change-password")

    const aspNewPass = "AspirantPermanent#9876!"
    const aspRotateRes = await router.fetch(
      postForm(
        "/account/change-password",
        {
          currentPassword: aspirantTempPassword,
          newPassword: aspNewPass,
          confirmPassword: aspNewPass
        },
        aspTempCookie
      )
    )
    expect(aspRotateRes.status).toBe(303)
    expect(aspRotateRes.headers.get("Location")).toBe("/portal")
    const aspCookie = extractCookie(aspRotateRes)

    // 5. Faculty first-login -> rotates password -> schedules exam, enters marks, and publishes
    const facFirstLogin = await router.fetch(
      postForm("/login", { email: facultyEmail, password: facultyTempPassword })
    )
    expect(facFirstLogin.status).toBe(303)
    expect(facFirstLogin.headers.get("Location")).toBe("/account/change-password")
    const facTempCookie = extractCookie(facFirstLogin)

    const facNewPass = "FacultyPermanent#9876!"
    const facRotateRes = await router.fetch(
      postForm(
        "/account/change-password",
        {
          currentPassword: facultyTempPassword,
          newPassword: facNewPass,
          confirmPassword: facNewPass
        },
        facTempCookie
      )
    )
    expect(facRotateRes.status).toBe(303)
    expect(facRotateRes.headers.get("Location")).toBe("/faculty")
    const facCookie = extractCookie(facRotateRes)

    // Faculty adds a completed syllabus topic
    await router.fetch(
      postForm(
        `/faculty/batches/${batchRow!.id}/syllabus`,
        {
          unitLabel: "Unit 1",
          title: "Modern South Indian History",
          status: "completed"
        },
        facCookie
      )
    )

    // Faculty schedules exam
    await router.fetch(
      postForm(
        "/faculty/exams",
        {
          batchId: batchRow!.id,
          title: "E2E Prelims Grand Mock 01",
          examType: "full_test",
          examDate: "2026-09-01",
          syllabusNotes: "Full Unit 1",
          maxMarks: "100",
          qualifyingMarks: "45"
        },
        facCookie
      )
    )

    const examsPageHtml = await (
      await router.fetch(
        new Request("http://localhost:5173/faculty/exams", { headers: { Cookie: facCookie } })
      )
    ).text()
    const examLinkMatch = /\/faculty\/exams\/([a-f0-9-]+)\/marks/.exec(examsPageHtml)
    expect(examLinkMatch).not.toBeNull()
    const examId = examLinkMatch![1]!

    // Faculty saves marks (88 / 100) and publishes
    const saveMarksRes = await router.fetch(
      postForm(
        `/faculty/exams/${examId}/marks`,
        {
          rowCount: "1",
          aspirantId_0: aspRow!.id,
          attendance_0: "present",
          marks_0: "88",
          remarks_0: "Outstanding conceptual clarity in Unit 1"
        },
        facCookie
      )
    )
    expect(saveMarksRes.status).toBe(303)

    const publishRes = await router.fetch(
      postForm(`/faculty/exams/${examId}/publish`, {}, facCookie)
    )
    expect(publishRes.status).toBe(303)

    // 6. Aspirant inspects published scorecard & rank on /portal and /portal/marks
    const portalHomeRes = await router.fetch(
      new Request("http://localhost:5173/portal", { headers: { Cookie: aspCookie } })
    )
    expect(portalHomeRes.status).toBe(200)
    const portalHomeHtml = await portalHomeRes.text()
    expect(portalHomeHtml).toContain("100%")
    expect(portalHomeHtml).toContain("88%")
    expect(portalHomeHtml).toContain("#1")

    const portalMarksRes = await router.fetch(
      new Request("http://localhost:5173/portal/marks", { headers: { Cookie: aspCookie } })
    )
    expect(portalMarksRes.status).toBe(200)
    const portalMarksHtml = await portalMarksRes.text()
    expect(portalMarksHtml).toContain("E2E Prelims Grand Mock 01")
    expect(portalMarksHtml).toContain("88 / 100")
    expect(portalMarksHtml).toContain("Qualified")
    expect(portalMarksHtml).toContain("#1")
    expect(portalMarksHtml).toContain("Outstanding conceptual clarity in Unit 1")

    // Cross-role RBAC isolation verified
    const forbiddenAdmin = await router.fetch(
      new Request("http://localhost:5173/admin", { headers: { Cookie: aspCookie } })
    )
    expect(forbiddenAdmin.status).toBe(403)

    const forbiddenFaculty = await router.fetch(
      new Request("http://localhost:5173/faculty", { headers: { Cookie: aspCookie } })
    )
    expect(forbiddenFaculty.status).toBe(403)
  })
})
