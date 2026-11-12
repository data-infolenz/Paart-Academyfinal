import { isComposedEmail } from "@sdxc/mail"
import { MemoryTransport } from "@sdxc/mail/memory"
import { generateUUID } from "@sdxc/uuid/v7"
import { afterAll, beforeEach, describe, expect, it } from "vitest"
import { createSession, hashUserPassword, resolveSession } from "~/app/initializers/auth"
import { db } from "~/app/initializers/database"
import { createPaartMailer, paartEmails, setMailerOverrideForTests } from "~/app/initializers/mail"
import router from "~/app/initializers/router"
import { createAdmission } from "~/app/models/admissions"
import { admissions, batches, courses, enrollments, users } from "~/database/schema"

const createdUserIds: string[] = []
const createdBatchIds: string[] = []
const createdAdmissionIds: string[] = []
const memoryOutbox = new MemoryTransport({ mime: true })

beforeEach(() => {
  memoryOutbox.clear()
  setMailerOverrideForTests(
    createPaartMailer(memoryOutbox, "PAART Academy <no-reply@paartacademy.com>")
  )
})

afterAll(async () => {
  setMailerOverrideForTests(null)
  for (const id of createdAdmissionIds) {
    await db.delete(admissions, id).catch(() => {})
  }
  for (const id of createdBatchIds) {
    await db.delete(batches, id).catch(() => {})
  }
  for (const id of createdUserIds) {
    await db.delete(users, id).catch(() => {})
  }
})

async function seedAdminSession() {
  const id = generateUUID()
  createdUserIds.push(id)
  const email = `admin-prov-${id.slice(-8)}@paart.in`
  const now = new Date()

  await db.create(users, {
    id,
    email,
    full_name: "Provisioning Admin",
    phone: "+91 9840011223",
    department: "Administration",
    role: "admin",
    password_hash: await hashUserPassword("AdminStrong#Pass2026!"),
    must_change_password: false,
    status: "active",
    last_login_at: now,
    credentials_sent_at: now,
    credentials_delivery_error: null,
    created_at: now,
    updated_at: now
  })

  const session = await createSession(id)
  const cookie = session.cookieHeader.split(";")[0]!
  return { id, email, cookie }
}

function postForm(path: string, fields: Record<string, string>, cookie: string): Request {
  return new Request(`http://localhost:5173${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: cookie
    },
    body: new URLSearchParams(fields)
  })
}

describe("admin user & batch provisioning + admissions conversion", () => {
  it("creates a batch, provisions faculty & aspirant accounts with welcome emails, and rejects duplicate emails", async () => {
    const admin = await seedAdminSession()
    const firstCourse = (await db.findMany(courses, { limit: 1 }))[0]
    expect(firstCourse).toBeDefined()

    const batchCode = `TEST-B-${generateUUID().slice(-6).toUpperCase()}`
    const batchRes = await router.fetch(
      postForm(
        "/admin/batches",
        {
          courseId: firstCourse!.id,
          name: "Test Morning Cohort",
          code: batchCode,
          scheduleLabel: "Mon-Fri 9:30 AM"
        },
        admin.cookie
      )
    )
    expect(batchRes.status).toBe(303)

    const batchRow = await db.findOne(batches, { where: { code: batchCode } })
    expect(batchRow).not.toBeNull()
    createdBatchIds.push(batchRow!.id)

    const facultyEmail = `fac-${generateUUID().slice(-7)}@paart.in`
    const facRes = await router.fetch(
      postForm(
        "/admin/users",
        {
          role: "faculty",
          fullName: "Prof. Aravind Kumar",
          email: `  ${facultyEmail.toUpperCase()}  `,
          department: "Indian Economy"
        },
        admin.cookie
      )
    )
    expect(facRes.status).toBe(303)

    const facRow = await db.findOne(users, { where: { email: facultyEmail } })
    expect(facRow).not.toBeNull()
    createdUserIds.push(facRow!.id)
    expect(facRow?.must_change_password).toBe(true)
    expect(facRow?.credentials_sent_at).not.toBeNull()
    expect(memoryOutbox.messages.length).toBe(1)
    expect(isComposedEmail(memoryOutbox.last?.email, paartEmails.welcomeCredentials)).toBe(true)

    // Provision aspirant with batch enrollment
    const aspirantEmail = `asp-${generateUUID().slice(-7)}@paart.in`
    const aspRes = await router.fetch(
      postForm(
        "/admin/users",
        {
          role: "aspirant",
          fullName: "Nithya Sri",
          email: aspirantEmail,
          phone: "+91 9842211100",
          batchId: batchRow!.id
        },
        admin.cookie
      )
    )
    expect(aspRes.status).toBe(303)

    const aspRow = await db.findOne(users, { where: { email: aspirantEmail } })
    expect(aspRow).not.toBeNull()
    createdUserIds.push(aspRow!.id)

    const enrollment = await db.findOne(enrollments, {
      where: { batch_id: batchRow!.id, aspirant_id: aspRow!.id }
    })
    expect(enrollment).not.toBeNull()
    expect(enrollment?.status).toBe("active")
    expect(memoryOutbox.messages.length).toBe(2)

    // Duplicate email rejected with 422 and zero extra email dispatched
    const dupRes = await router.fetch(
      postForm(
        "/admin/users",
        {
          role: "aspirant",
          fullName: "Duplicate Attempt",
          email: `  ${aspirantEmail.toUpperCase()} `
        },
        admin.cookie
      )
    )
    expect(dupRes.status).toBe(422)
    const dupHtml = await dupRes.text()
    expect(dupHtml).toContain("already exists")
    expect(memoryOutbox.messages.length).toBe(2)
  })

  it("resets & resends credentials, revokes sessions on suspend, and blocks self-suspension with 422", async () => {
    const admin = await seedAdminSession()
    const targetEmail = `target-${generateUUID().slice(-7)}@paart.in`

    await router.fetch(
      postForm(
        "/admin/users",
        {
          role: "faculty",
          fullName: "Prof. Revathi",
          email: targetEmail
        },
        admin.cookie
      )
    )
    const targetUser = await db.findOne(users, { where: { email: targetEmail } })
    expect(targetUser).not.toBeNull()
    createdUserIds.push(targetUser!.id)
    const firstHash = targetUser!.password_hash

    // Open an active session for targetUser
    const userSess = await createSession(targetUser!.id)
    const userCookie = userSess.cookieHeader.split(";")[0]!
    expect(
      await resolveSession(
        new Request("http://localhost:5173/faculty", { headers: { Cookie: userCookie } })
      )
    ).not.toBeNull()

    memoryOutbox.clear()

    // Reset & resend credentials
    const resendRes = await router.fetch(
      postForm(`/admin/users/${targetUser!.id}/resend-credentials`, {}, admin.cookie)
    )
    expect(resendRes.status).toBe(303)

    const rotatedUser = await db.find(users, targetUser!.id)
    expect(rotatedUser?.password_hash).not.toBe(firstHash)
    expect(rotatedUser?.must_change_password).toBe(true)
    expect(isComposedEmail(memoryOutbox.last?.email, paartEmails.resetCredentials)).toBe(true)

    // Previous session must be revoked immediately
    expect(
      await resolveSession(
        new Request("http://localhost:5173/faculty", { headers: { Cookie: userCookie } })
      )
    ).toBeNull()

    // Create a new session and suspend targetUser -> session immediately invalidated
    const secondSess = await createSession(targetUser!.id)
    const secondCookie = secondSess.cookieHeader.split(";")[0]!

    const suspendRes = await router.fetch(
      postForm(`/admin/users/${targetUser!.id}/status`, { status: "suspended" }, admin.cookie)
    )
    expect(suspendRes.status).toBe(303)
    expect(
      await resolveSession(
        new Request("http://localhost:5173/faculty", { headers: { Cookie: secondCookie } })
      )
    ).toBeNull()

    // Self-suspension by admin must be rejected with HTTP 422
    const selfSuspend = await router.fetch(
      postForm(`/admin/users/${admin.id}/status`, { status: "suspended" }, admin.cookie)
    )
    expect(selfSuspend.status).toBe(422)
    const adminRow = await db.find(users, admin.id)
    expect(adminRow?.status).toBe("active")
  })

  it("converts an admission inquiry into an enrolled aspirant account in 1 click", async () => {
    const admin = await seedAdminSession()
    const firstBatch = (await db.findMany(batches, { where: { is_active: true }, limit: 1 }))[0]
    expect(firstBatch).toBeDefined()

    const applicantEmail = `admit-${generateUUID().slice(-7)}@paart.in`
    const createdAdm = await createAdmission({
      studentName: "Divya Bharathi",
      parentName: "Senthilnathan",
      dateOfBirth: "2002-05-14",
      gender: "Female",
      mobile: "9842100777",
      whatsapp: "9842100777",
      email: applicantEmail,
      address: "12 Gandhi Nagar",
      city: "Chennai",
      district: "Chennai",
      state: "Tamil Nadu",
      pincode: "600040",
      courseInterested: "TNPSC Group 1",
      previousQualification: "B.Sc Mathematics",
      schoolCollegeName: "Presidency College",
      yearOfPassing: "2023",
      marksPercentage: "86%",
      preferredBatch: "Regular Weekday",
      message: "Looking for Tamil + English bilingual mentoring"
    })
    createdAdmissionIds.push(createdAdm.id)

    memoryOutbox.clear()

    const provRes = await router.fetch(
      postForm(
        `/admin/admissions/${createdAdm.id}/provision`,
        {
          email: applicantEmail,
          batchId: firstBatch!.id
        },
        admin.cookie
      )
    )
    expect(provRes.status).toBe(303)

    const updatedAdmission = await db.find(admissions, createdAdm.id)
    expect(updatedAdmission?.status).toBe("enrolled")
    expect(updatedAdmission?.provisioned_user_id).toBeTruthy()
    createdUserIds.push(updatedAdmission!.provisioned_user_id!)

    const provisionedUser = await db.find(users, updatedAdmission!.provisioned_user_id!)
    expect(provisionedUser?.role).toBe("aspirant")
    expect(provisionedUser?.must_change_password).toBe(true)

    const linkedEnrollment = await db.findOne(enrollments, {
      where: {
        batch_id: firstBatch!.id,
        aspirant_id: provisionedUser!.id
      }
    })
    expect(linkedEnrollment).not.toBeNull()
    expect(linkedEnrollment?.admission_id).toBe(createdAdm.id)
    expect(memoryOutbox.messages.length).toBe(1)
    expect(isComposedEmail(memoryOutbox.last?.email, paartEmails.welcomeCredentials)).toBe(true)
  })
})
