import { generateUUID } from "@sdxc/uuid/v7"
import { afterAll, describe, expect, it } from "vitest"
import { createSession, hashUserPassword } from "~/app/initializers/auth"
import { db } from "~/app/initializers/database"
import router from "~/app/initializers/router"
import {
  createExam,
  createNotification,
  createSyllabusTopic,
  publishExamResults,
  saveExamMarks
} from "~/app/models/lms"
import { createMaterial } from "~/app/models/materials"
import { batches, courses, enrollments, materials, notifications, users } from "~/database/schema"

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

async function createPortalUser(role: "faculty" | "aspirant", name: string) {
  const id = generateUUID()
  createdUserIds.push(id)
  const email = `portal-${role}-${id.slice(-7)}@paart.in`
  const now = new Date()

  await db.create(users, {
    id,
    email,
    full_name: name,
    phone: "+91 9842100555",
    department: "",
    role,
    password_hash: await hashUserPassword("Portal#User2026!"),
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

describe("aspirant portal (/portal/*: progress, chart, exams, marks isolation, materials, notifications)", () => {
  it("renders zero-exam empty state cleanly without NaN and renders SVG score-trend chart once published", async () => {
    const faculty = await createPortalUser("faculty", "Prof. Natarajan")
    const aspirant = await createPortalUser("aspirant", "Harini V")
    const allCourses = await db.findMany(courses, { limit: 2 })
    const courseA = allCourses[0]!

    const batchAId = generateUUID()
    createdBatchIds.push(batchAId)
    const batchACode = `PA-${batchAId.slice(-6).toUpperCase()}`

    await db.create(batches, {
      id: batchAId,
      course_id: courseA.id,
      faculty_id: faculty.id,
      name: "Portal Progress Cohort A",
      code: batchACode,
      schedule_label: "Morning 9:30 AM",
      starts_on: "2026-06-01",
      ends_on: "2026-12-01",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    })

    await db.create(enrollments, {
      id: generateUUID(),
      batch_id: batchAId,
      aspirant_id: aspirant.id,
      admission_id: null,
      roll_number: `${batchACode}-001`,
      status: "active",
      enrolled_at: new Date()
    })

    await createSyllabusTopic({
      batchId: batchAId,
      unitLabel: "Unit 1",
      title: "Indian National Movement",
      status: "completed",
      actorUserId: faculty.id
    })
    await createSyllabusTopic({
      batchId: batchAId,
      unitLabel: "Unit 2",
      title: "Geography of Tamil Nadu",
      status: "in_progress",
      actorUserId: faculty.id
    })

    // Zero-exam state on /portal
    const zeroRes = await router.fetch(
      new Request("http://localhost:5173/portal", { headers: { Cookie: aspirant.cookie } })
    )
    expect(zeroRes.status).toBe(200)
    const zeroHtml = await zeroRes.text()
    expect(zeroHtml).toContain("Portal Progress Cohort A")
    expect(zeroHtml).toContain("50%")
    expect(zeroHtml).toContain("No published exam scores recorded yet")
    expect(zeroHtml).not.toContain("NaN")

    // Publish 2 exams and verify SVG chart + KPI stats render on /portal and /portal/progress
    const ex1 = await createExam({
      batchId: batchAId,
      title: "Mock Test 01 — History",
      examType: "weekly_mock",
      examDate: "2026-07-05",
      maxMarks: 100,
      qualifyingMarks: 40,
      actorUserId: faculty.id
    })
    await saveExamMarks({
      examId: ex1.id,
      rows: [
        {
          aspirantId: aspirant.id,
          attendance: "present",
          marksObtained: 76,
          remarks: "Solid start"
        }
      ],
      actorUserId: faculty.id
    })
    await publishExamResults({ examId: ex1.id, actorUserId: faculty.id })

    const ex2 = await createExam({
      batchId: batchAId,
      title: "Mock Test 02 — Geography",
      examType: "omr_revision",
      examDate: "2026-07-19",
      maxMarks: 100,
      qualifyingMarks: 40,
      actorUserId: faculty.id
    })
    await saveExamMarks({
      examId: ex2.id,
      rows: [
        {
          aspirantId: aspirant.id,
          attendance: "present",
          marksObtained: 84,
          remarks: "Great accuracy improvement"
        }
      ],
      actorUserId: faculty.id
    })
    await publishExamResults({ examId: ex2.id, actorUserId: faculty.id })

    const chartRes = await router.fetch(
      new Request("http://localhost:5173/portal", { headers: { Cookie: aspirant.cookie } })
    )
    expect(chartRes.status).toBe(200)
    const chartHtml = await chartRes.text()
    expect(chartHtml).toContain("80%") // average of 76% and 84%
    expect(chartHtml).toContain("#1")
    expect(chartHtml).toContain("Chronological mock exam score percentage progression")

    const progRes = await router.fetch(
      new Request("http://localhost:5173/portal/progress", { headers: { Cookie: aspirant.cookie } })
    )
    expect(progRes.status).toBe(200)
    const progHtml = await progRes.text()
    expect(progHtml).toContain("Indian National Movement")
    expect(progHtml).toContain("Geography of Tamil Nadu")
  })

  it("isolates scorecards & exam schedules strictly to session aspirant and hides draft results", async () => {
    const faculty = await createPortalUser("faculty", "Prof. Ganesh")
    const aspirantA = await createPortalUser("aspirant", "Aspirant Alpha")
    const aspirantB = await createPortalUser("aspirant", "Aspirant Bravo")
    const courseList = await db.findMany(courses, { limit: 2 })

    const batchSharedId = generateUUID()
    const batchOtherId = generateUUID()
    createdBatchIds.push(batchSharedId, batchOtherId)

    await db.create(batches, {
      id: batchSharedId,
      course_id: courseList[0]!.id,
      faculty_id: faculty.id,
      name: "Shared Batch X",
      code: `SHX-${batchSharedId.slice(-5).toUpperCase()}`,
      schedule_label: "Weekday",
      starts_on: "2026-06-01",
      ends_on: "2026-12-01",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    })

    await db.create(batches, {
      id: batchOtherId,
      course_id: (courseList[1] ?? courseList[0])!.id,
      faculty_id: faculty.id,
      name: "Unrelated Batch Z",
      code: `UBZ-${batchOtherId.slice(-5).toUpperCase()}`,
      schedule_label: "Evening",
      starts_on: "2026-06-01",
      ends_on: "2026-12-01",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    })

    await db.create(enrollments, {
      id: generateUUID(),
      batch_id: batchSharedId,
      aspirant_id: aspirantA.id,
      admission_id: null,
      roll_number: "SHX-001",
      status: "active",
      enrolled_at: new Date()
    })
    await db.create(enrollments, {
      id: generateUUID(),
      batch_id: batchSharedId,
      aspirant_id: aspirantB.id,
      admission_id: null,
      roll_number: "SHX-002",
      status: "active",
      enrolled_at: new Date()
    })

    const publishedExam = await createExam({
      batchId: batchSharedId,
      title: "Published Isolation Exam",
      examDate: "2026-08-01",
      maxMarks: 100,
      qualifyingMarks: 40,
      actorUserId: faculty.id
    })
    await saveExamMarks({
      examId: publishedExam.id,
      rows: [
        {
          aspirantId: aspirantA.id,
          attendance: "present",
          marksObtained: 68,
          remarks: "ALPHA_PRIVATE_REMARK_68"
        },
        {
          aspirantId: aspirantB.id,
          attendance: "present",
          marksObtained: 93,
          remarks: "BRAVO_SECRET_REMARK_93"
        }
      ],
      actorUserId: faculty.id
    })
    await publishExamResults({ examId: publishedExam.id, actorUserId: faculty.id })

    // Draft exam in same batch — must stay hidden from /portal/marks!
    const draftExam = await createExam({
      batchId: batchSharedId,
      title: "Draft Unreleased Exam",
      examDate: "2026-08-20",
      maxMarks: 100,
      qualifyingMarks: 40,
      actorUserId: faculty.id
    })
    await saveExamMarks({
      examId: draftExam.id,
      rows: [
        {
          aspirantId: aspirantA.id,
          attendance: "present",
          marksObtained: 99,
          remarks: "UNRELEASED_DRAFT_SCORE_99"
        }
      ],
      actorUserId: faculty.id
    })

    // Exam in unrelated Batch Z — must NOT appear in Aspirant A's /portal/exams!
    await createExam({
      batchId: batchOtherId,
      title: "Secret Unrelated Batch Z Exam",
      examDate: "2026-08-25",
      maxMarks: 100,
      qualifyingMarks: 40,
      actorUserId: faculty.id
    })

    const examsRes = await router.fetch(
      new Request("http://localhost:5173/portal/exams", { headers: { Cookie: aspirantA.cookie } })
    )
    const examsHtml = await examsRes.text()
    expect(examsHtml).toContain("Published Isolation Exam")
    expect(examsHtml).toContain("Draft Unreleased Exam")
    expect(examsHtml).not.toContain("Secret Unrelated Batch Z Exam")

    // Aspirant A tries query parameter tampering (?aspirantId=aspirantB.id) on /portal/marks
    const marksRes = await router.fetch(
      new Request(`http://localhost:5173/portal/marks?aspirantId=${aspirantB.id}`, {
        headers: { Cookie: aspirantA.cookie }
      })
    )
    expect(marksRes.status).toBe(200)
    const marksHtml = await marksRes.text()
    expect(marksHtml).toContain("ALPHA_PRIVATE_REMARK_68")
    expect(marksHtml).toContain("#2")
    expect(marksHtml).not.toContain("BRAVO_SECRET_REMARK_93")
    expect(marksHtml).not.toContain("UNRELEASED_DRAFT_SCORE_99")
  })

  it("scopes /portal/materials and /portal/notifications strictly to enrolled courses and batches", async () => {
    const faculty = await createPortalUser("faculty", "Prof. Deepa")
    const aspirant = await createPortalUser("aspirant", "Scoped Aspirant")
    const twoCourses = await db.findMany(courses, { limit: 2 })
    expect(twoCourses.length).toBeGreaterThanOrEqual(2)
    const [courseA, courseB] = twoCourses

    const batchAId = generateUUID()
    const batchBId = generateUUID()
    createdBatchIds.push(batchAId, batchBId)

    await db.create(batches, {
      id: batchAId,
      course_id: courseA!.id,
      faculty_id: faculty.id,
      name: "Course A Batch",
      code: `CA-${batchAId.slice(-5).toUpperCase()}`,
      schedule_label: "Morning",
      starts_on: "2026-06-01",
      ends_on: "2026-12-01",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    })

    await db.create(batches, {
      id: batchBId,
      course_id: courseB!.id,
      faculty_id: faculty.id,
      name: "Course B Batch",
      code: `CB-${batchBId.slice(-5).toUpperCase()}`,
      schedule_label: "Evening",
      starts_on: "2026-06-01",
      ends_on: "2026-12-01",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    })

    // Enroll aspirant ONLY in batchA (courseA)
    await db.create(enrollments, {
      id: generateUUID(),
      batch_id: batchAId,
      aspirant_id: aspirant.id,
      admission_id: null,
      roll_number: "CA-001",
      status: "active",
      enrolled_at: new Date()
    })

    const matPublic = await createMaterial({
      title: `Public Current Affairs ${generateUUID().slice(-5)}`,
      category: "Current Affairs",
      description: "Public digest",
      fileUrl: "/study-materials/public.pdf",
      externalUrl: "",
      visibility: "public",
      uploadedBy: faculty.id
    })
    const matCourseA = await createMaterial({
      title: `Enrolled Course A Workbook ${generateUUID().slice(-5)}`,
      category: "Notes",
      description: "Course A exclusive",
      fileUrl: "/study-materials/course-a.pdf",
      externalUrl: "",
      courseId: courseA!.id,
      visibility: "enrolled",
      uploadedBy: faculty.id
    })
    const matCourseB = await createMaterial({
      title: `Restricted Course B Vault ${generateUUID().slice(-5)}`,
      category: "Notes",
      description: "Course B exclusive",
      fileUrl: "/study-materials/course-b.pdf",
      externalUrl: "",
      courseId: courseB!.id,
      visibility: "enrolled",
      uploadedBy: faculty.id
    })
    createdMaterialIds.push(matPublic.id, matCourseA.id, matCourseB.id)

    const portalMatRes = await router.fetch(
      new Request("http://localhost:5173/portal/materials", {
        headers: { Cookie: aspirant.cookie }
      })
    )
    expect(portalMatRes.status).toBe(200)
    const portalMatHtml = await portalMatRes.text()
    expect(portalMatHtml).toContain(matPublic.title)
    expect(portalMatHtml).toContain(matCourseA.title)
    expect(portalMatHtml).not.toContain(matCourseB.title)

    // Notifications: all + courseA + batchA included; courseB + batchB excluded
    const nAll = await createNotification({
      title: `Global Holiday Notice ${generateUUID().slice(-5)}`,
      body: "Library open till 8 PM.",
      targetScope: "all",
      actorUserId: faculty.id
    })
    const nBatchA = await createNotification({
      title: `Batch A Test Hall ${generateUUID().slice(-5)}`,
      body: "Hall 2 assigned.",
      targetScope: "batch",
      targetBatchId: batchAId,
      actorUserId: faculty.id
    })
    const nBatchB = await createNotification({
      title: `Secret Batch B Notice ${generateUUID().slice(-5)}`,
      body: "Batch B evening extra class.",
      targetScope: "batch",
      targetBatchId: batchBId,
      actorUserId: faculty.id
    })
    const nCourseB = await createNotification({
      title: `Secret Course B Seminar ${generateUUID().slice(-5)}`,
      body: "Course B seminar only.",
      targetScope: "course",
      targetCourseId: courseB!.id,
      actorUserId: faculty.id
    })
    createdNotificationIds.push(nAll.id, nBatchA.id, nBatchB.id, nCourseB.id)

    const notifRes = await router.fetch(
      new Request("http://localhost:5173/portal/notifications", {
        headers: { Cookie: aspirant.cookie }
      })
    )
    expect(notifRes.status).toBe(200)
    const notifHtml = await notifRes.text()
    expect(notifHtml).toContain(nAll.title)
    expect(notifHtml).toContain(nBatchA.title)
    expect(notifHtml).not.toContain(nBatchB.title)
    expect(notifHtml).not.toContain(nCourseB.title)
  })
})
