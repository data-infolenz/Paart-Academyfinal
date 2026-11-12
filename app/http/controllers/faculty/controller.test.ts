import { generateUUID } from "@sdxc/uuid/v7"
import { afterAll, describe, expect, it } from "vitest"
import { createSession, hashUserPassword } from "~/app/initializers/auth"
import { db } from "~/app/initializers/database"
import router from "~/app/initializers/router"
import {
  getAspirantPortalSnapshot,
  getBatchSyllabusView,
  getExamMarksSheet
} from "~/app/models/lms"
import {
  batches,
  courses,
  enrollments,
  exams,
  materials,
  notifications,
  users
} from "~/database/schema"

const createdUserIds: string[] = []
const createdBatchIds: string[] = []
const createdMaterialIds: string[] = []
const createdNotificationIds: string[] = []

afterAll(async () => {
  for (const id of createdMaterialIds) {
    await db.delete(materials, id).catch(() => {})
  }
  for (const id of createdNotificationIds) {
    await db.delete(notifications, id).catch(() => {})
  }
  for (const id of createdBatchIds) {
    await db.delete(batches, id).catch(() => {})
  }
  for (const id of createdUserIds) {
    await db.delete(users, id).catch(() => {})
  }
})

async function createTestUser(role: "faculty" | "aspirant", name: string) {
  const id = generateUUID()
  createdUserIds.push(id)
  const email = `fac-spec-${role}-${id.slice(-7)}@paart.in`
  const now = new Date()

  await db.create(users, {
    id,
    email,
    full_name: name,
    phone: "+91 9840099111",
    department: "Polity & Governance",
    role,
    password_hash: await hashUserPassword("Faculty#Pass2026!"),
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

describe("faculty workspace (/faculty/*: syllabus, exams, CSV marks, materials, notifications)", () => {
  it("tracks batch syllabus topics and recalculates completion percentage accurately", async () => {
    const faculty = await createTestUser("faculty", "Prof. Senthil Kumar")
    const course = (await db.findMany(courses, { limit: 1 }))[0]!
    const batchId = generateUUID()
    createdBatchIds.push(batchId)
    const batchCode = `SYL-${batchId.slice(-6).toUpperCase()}`

    await db.create(batches, {
      id: batchId,
      course_id: course.id,
      faculty_id: faculty.id,
      name: "Syllabus Verification Cohort",
      code: batchCode,
      schedule_label: "Mon-Sat 10:00 AM",
      starts_on: "2026-06-01",
      ends_on: "2026-12-01",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    })

    const dashRes = await router.fetch(
      new Request("http://localhost:5173/faculty", { headers: { Cookie: faculty.cookie } })
    )
    expect(dashRes.status).toBe(200)
    expect(await dashRes.text()).toContain("Syllabus Verification Cohort")

    // Add 2 topics (both pending initially -> 0%)
    await router.fetch(
      postForm(
        `/faculty/batches/${batchId}/syllabus`,
        { unitLabel: "Unit 1", title: "Constitutional Framework", status: "pending" },
        faculty.cookie
      )
    )
    await router.fetch(
      postForm(
        `/faculty/batches/${batchId}/syllabus`,
        { unitLabel: "Unit 2", title: "Parliament & State Legislature", status: "in_progress" },
        faculty.cookie
      )
    )

    const initialView = await getBatchSyllabusView(batchId)
    expect(initialView.topics.length).toBe(2)
    expect(initialView.batch.syllabusProgressPct).toBe(0)

    // Complete first topic -> 50%
    const completeFirst = await router.fetch(
      postForm(
        `/faculty/batches/${batchId}/syllabus/${initialView.topics[0]!.id}/status`,
        { status: "completed" },
        faculty.cookie
      )
    )
    expect(completeFirst.status).toBe(303)

    const midView = await getBatchSyllabusView(batchId)
    expect(midView.batch.syllabusProgressPct).toBe(50)
    expect(midView.topics[0]!.completedAt).not.toBeNull()

    // Complete second topic -> 100%
    await router.fetch(
      postForm(
        `/faculty/batches/${batchId}/syllabus/${initialView.topics[1]!.id}/status`,
        { status: "completed" },
        faculty.cookie
      )
    )
    const finalView = await getBatchSyllabusView(batchId)
    expect(finalView.batch.syllabusProgressPct).toBe(100)
  })

  it("validates exam bounds, saves hidden draft marks, exports/imports CSV safely, and computes dense ranks on publish", async () => {
    const faculty = await createTestUser("faculty", "Prof. Lakshmi")
    const asp1 = await createTestUser("aspirant", "Anitha R")
    const asp2 = await createTestUser("aspirant", "Bala M")
    const asp3 = await createTestUser("aspirant", "Chitra K")

    const course = (await db.findMany(courses, { limit: 1 }))[0]!
    const batchId = generateUUID()
    createdBatchIds.push(batchId)
    const batchCode = `EXM-${batchId.slice(-6).toUpperCase()}`

    await db.create(batches, {
      id: batchId,
      course_id: course.id,
      faculty_id: faculty.id,
      name: "OMR Rank Verification Batch",
      code: batchCode,
      schedule_label: "Weekend Batch",
      starts_on: "2026-06-01",
      ends_on: "2026-12-31",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    })

    for (const [idx, asp] of [asp1, asp2, asp3].entries()) {
      await db.create(enrollments, {
        id: generateUUID(),
        batch_id: batchId,
        aspirant_id: asp.id,
        admission_id: null,
        roll_number: `${batchCode}-00${idx + 1}`,
        status: "active",
        enrolled_at: new Date()
      })
    }

    // Reject qualifyingMarks > maxMarks with 422
    const invalidExamRes = await router.fetch(
      postForm(
        "/faculty/exams",
        {
          batchId,
          title: "Invalid Bounds Test",
          examType: "weekly_mock",
          examDate: "2026-08-10",
          maxMarks: "100",
          qualifyingMarks: "120"
        },
        faculty.cookie
      )
    )
    expect(invalidExamRes.status).toBe(422)

    // Schedule valid exam
    const validExamRes = await router.fetch(
      postForm(
        "/faculty/exams",
        {
          batchId,
          title: "GS Paper 1 OMR Mock Test",
          examType: "omr_revision",
          examDate: "2026-08-15",
          syllabusNotes: "Units 1 to 4",
          maxMarks: "200",
          qualifyingMarks: "80"
        },
        faculty.cookie
      )
    )
    expect(validExamRes.status).toBe(303)

    const examRow = await db.findOne(exams, { where: { batch_id: batchId } })
    expect(examRow).not.toBeNull()

    // Reject out-of-range manual marks (> 200)
    const outOfRangeRes = await router.fetch(
      postForm(
        `/faculty/exams/${examRow!.id}/marks`,
        {
          rowCount: "1",
          aspirantId_0: asp1.id,
          attendance_0: "present",
          marks_0: "250",
          remarks_0: "Too high"
        },
        faculty.cookie
      )
    )
    expect(outOfRangeRes.status).toBe(422)

    // Save valid draft marks; verify hidden from aspirant portal while scheduled
    const draftSaveRes = await router.fetch(
      postForm(
        `/faculty/exams/${examRow!.id}/marks`,
        {
          rowCount: "1",
          aspirantId_0: asp1.id,
          attendance_0: "present",
          marks_0: "150",
          remarks_0: "=SUM(1,2) Strong polity accuracy"
        },
        faculty.cookie
      )
    )
    expect(draftSaveRes.status).toBe(303)

    const draftSnapshot = await getAspirantPortalSnapshot(asp1.id)
    expect(draftSnapshot.scorecards.length).toBe(0)

    // Export CSV template
    const csvExportRes = await router.fetch(
      new Request(`http://localhost:5173/faculty/exams/${examRow!.id}/marks/template.csv`, {
        headers: { Cookie: faculty.cookie }
      })
    )
    expect(csvExportRes.status).toBe(200)
    const exportedCsv = await csvExportRes.text()
    expect(exportedCsv).toContain(
      "roll_number,email,student_name,attendance,marks_obtained,remarks"
    )
    expect(exportedCsv).toContain(asp1.email)

    // Atomic CSV validation: reject entire CSV if any row is unmatched or out of bounds
    const badCsv = [
      "email,attendance,marks_obtained,remarks",
      `${asp1.email},present,175,Updated score`,
      "stranger@unknown.org,present,120,Not enrolled"
    ].join("\r\n")

    const badImportRes = await router.fetch(
      postForm(`/faculty/exams/${examRow!.id}/marks/import`, { csvText: badCsv }, faculty.cookie)
    )
    expect(badImportRes.status).toBe(422)
    // Confirm asp1's score stayed 150 (no partial corruption!)
    const afterBadImport = await getExamMarksSheet(examRow!.id)
    expect(afterBadImport.entries.find((e) => e.aspirantId === asp1.id)?.marksObtained).toBe(150)

    // Valid CSV import for all 3 aspirants (with formula prefix in remarks sanitized)
    const goodCsv = [
      "email,attendance,marks_obtained,remarks",
      `${asp1.email},present,172,=CMD|' /C calc'!A0 Excellent revision`,
      `${asp2.email},present,184,Top scorer in Economy`,
      `${asp3.email},absent,0,Medical leave`
    ].join("\r\n")

    const goodImportRes = await router.fetch(
      postForm(`/faculty/exams/${examRow!.id}/marks/import`, { csvText: goodCsv }, faculty.cookie)
    )
    expect(goodImportRes.status).toBe(303)

    // Publish results -> compute deterministic ranks
    const publishRes = await router.fetch(
      postForm(`/faculty/exams/${examRow!.id}/publish`, {}, faculty.cookie)
    )
    expect(publishRes.status).toBe(303)

    const publishedSheet = await getExamMarksSheet(examRow!.id)
    expect(publishedSheet.exam.status).toBe("published")

    const r1 = publishedSheet.entries.find((e) => e.aspirantId === asp2.id)!
    const r2 = publishedSheet.entries.find((e) => e.aspirantId === asp1.id)!
    const rAbs = publishedSheet.entries.find((e) => e.aspirantId === asp3.id)!

    expect(r1.rank).toBe(1)
    expect(r2.rank).toBe(2)
    expect(r2.remarks.startsWith("=")).toBe(false)
    expect(rAbs.rank).toBeNull()
  })

  it("publishes enrolled-only materials and batch notifications without leaking onto public /materials", async () => {
    const faculty = await createTestUser("faculty", "Prof. Kavitha")
    const course = (await db.findMany(courses, { limit: 1 }))[0]!
    const batch = (await db.findMany(batches, { where: { is_active: true }, limit: 1 }))[0]!

    const secretTitle = `Restricted Mains Booklet ${generateUUID().slice(-6)}`
    const matRes = await router.fetch(
      postForm(
        "/faculty/materials",
        {
          title: secretTitle,
          category: "Notes",
          visibility: "enrolled",
          courseId: course.id,
          fileUrl: "/study-materials/restricted-mains.pdf",
          externalUrl: "",
          description: "Exclusive enrolled-cohort answer writing booklet"
        },
        faculty.cookie
      )
    )
    expect(matRes.status).toBe(303)

    const createdMat = await db.findOne(materials, { where: { title: secretTitle } })
    expect(createdMat).not.toBeNull()
    createdMaterialIds.push(createdMat!.id)

    // Unauthenticated public /materials page MUST NOT leak enrolled-only material
    const publicMaterialsRes = await router.fetch(new Request("http://localhost:5173/materials"))
    expect(publicMaterialsRes.status).toBe(200)
    const publicHtml = await publicMaterialsRes.text()
    expect(publicHtml).not.toContain(secretTitle)

    // Post batch-scoped notification
    const alertTitle = `Batch Venue Notice ${generateUUID().slice(-6)}`
    const notifRes = await router.fetch(
      postForm(
        "/faculty/notifications",
        {
          title: alertTitle,
          category: "exam",
          targetScope: "batch",
          targetBatchId: batch.id,
          body: "Report to Hall B by 9:15 AM with black ballpoint pen."
        },
        faculty.cookie
      )
    )
    expect(notifRes.status).toBe(303)

    const createdNotif = await db.findOne(notifications, { where: { title: alertTitle } })
    expect(createdNotif).not.toBeNull()
    createdNotificationIds.push(createdNotif!.id)
  })
})
