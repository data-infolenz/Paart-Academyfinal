import { parse as parseCsv, stringify as stringifyCsv } from "@sdxc/csv"
import { isFailure, unwrap } from "@sdxc/result"
import { generateUUID } from "@sdxc/uuid/v7"
import { normalizeUserEmail } from "~/app/initializers/auth"
import { db as defaultDb, type PaartDb } from "~/app/initializers/database"
import {
  type AttendanceStatus,
  ATTENDANCE_STATUSES,
  type BatchRow,
  batches,
  courses,
  enrollments,
  EXAM_TYPES,
  type ExamResultRow,
  examResults,
  type ExamRow,
  type ExamStatus,
  type ExamType,
  exams,
  NOTIFICATION_CATEGORIES,
  type NotificationCategory,
  type NotificationRow,
  type NotificationScope,
  NOTIFICATION_SCOPES,
  notifications,
  SYLLABUS_TOPIC_STATUSES,
  type SyllabusTopicRow,
  type SyllabusTopicStatus,
  syllabusTopics,
  users
} from "~/database/schema"

export class LmsValidationError extends Error {
  readonly statusCode: number

  constructor(message: string, statusCode = 422) {
    super(message)
    this.name = "LmsValidationError"
    this.statusCode = statusCode
  }
}

export interface BatchSummaryItem {
  id: string
  courseId: string
  courseTitle: string
  facultyId: string | null
  facultyName: string | null
  name: string
  code: string
  scheduleLabel: string
  startsOn: string
  endsOn: string
  isActive: boolean
  enrolledCount: number
  totalTopics: number
  completedTopics: number
  syllabusProgressPct: number
}

export interface SyllabusTopicItem {
  id: string
  batchId: string
  unitLabel: string
  title: string
  sortOrder: number
  status: SyllabusTopicStatus
  completedAt: string | null
}

export interface ExamItem {
  id: string
  batchId: string
  batchName: string
  batchCode: string
  courseId: string
  courseTitle: string
  title: string
  examType: ExamType
  examDate: string
  syllabusNotes: string
  maxMarks: number
  qualifyingMarks: number
  status: ExamStatus
  publishedAt: string | null
  recordedCount: number
  enrolledCount: number
}

export interface MarksSheetEntry {
  aspirantId: string
  fullName: string
  email: string
  rollNumber: string
  attendance: AttendanceStatus
  marksObtained: number
  hasSavedResult: boolean
  rank: number | null
  remarks: string
}

export interface NotificationItem {
  id: string
  title: string
  body: string
  category: NotificationCategory
  targetScope: NotificationScope
  targetCourseId: string | null
  targetCourseTitle: string | null
  targetBatchId: string | null
  targetBatchName: string | null
  publishedAt: string
}

export interface AspirantPublishedScorecard {
  examId: string
  examTitle: string
  examType: ExamType
  examDate: string
  batchName: string
  batchCode: string
  courseTitle: string
  attendance: AttendanceStatus
  marksObtained: number
  maxMarks: number
  qualifyingMarks: number
  percentage: number
  qualified: boolean
  rank: number | null
  remarks: string
}

export interface AspirantBatchProgress {
  enrollmentId: string
  rollNumber: string
  batchId: string
  batchName: string
  batchCode: string
  scheduleLabel: string
  courseId: string
  courseTitle: string
  facultyName: string | null
  totalTopics: number
  completedTopics: number
  inProgressTopics: number
  syllabusProgressPct: number
  topics: SyllabusTopicItem[]
}

export interface AspirantPortalSnapshot {
  batches: AspirantBatchProgress[]
  overallSyllabusPct: number
  upcomingAndPastExams: ExamItem[]
  scorecards: AspirantPublishedScorecard[]
  completedExamsCount: number
  averagePercentage: number
  bestRank: number | null
  notifications: NotificationItem[]
}

function toIso(val: Date | string | null | undefined): string | null {
  if (!val) return null
  return val instanceof Date ? val.toISOString() : String(val)
}

export function computeSyllabusProgressPct(completedTopics: number, totalTopics: number): number {
  if (totalTopics <= 0) return 0
  return Math.round((completedTopics / totalTopics) * 100)
}

function sanitizeFormulaText(raw: string): string {
  return raw.trim().replace(/^[=+\-@\t\r]+/, "")
}

export async function listBatches(targetDb: PaartDb = defaultDb): Promise<BatchSummaryItem[]> {
  const [batchRows, courseRows, facultyRows, enrollmentRows, topicRows] = await Promise.all([
    targetDb.findMany(batches, { orderBy: ["created_at", "desc"] }),
    targetDb.findMany(courses),
    targetDb.findMany(users, { where: { role: "faculty" } }),
    targetDb.findMany(enrollments, { where: { status: "active" } }),
    targetDb.findMany(syllabusTopics)
  ])

  const courseMap = new Map(courseRows.map((c) => [c.id, c.title]))
  const facultyMap = new Map(facultyRows.map((f) => [f.id, f.full_name]))
  const enrolledCountByBatch = new Map<string, number>()
  for (const enr of enrollmentRows) {
    enrolledCountByBatch.set(enr.batch_id, (enrolledCountByBatch.get(enr.batch_id) ?? 0) + 1)
  }

  const topicsByBatch = new Map<string, { total: number; completed: number }>()
  for (const t of topicRows) {
    const agg = topicsByBatch.get(t.batch_id) ?? { total: 0, completed: 0 }
    agg.total += 1
    if (t.status === "completed") agg.completed += 1
    topicsByBatch.set(t.batch_id, agg)
  }

  return batchRows.map((row: BatchRow) => {
    const topicStats = topicsByBatch.get(row.id) ?? { total: 0, completed: 0 }
    return {
      id: row.id,
      courseId: row.course_id,
      courseTitle: courseMap.get(row.course_id) ?? row.course_id,
      facultyId: row.faculty_id ?? null,
      facultyName: row.faculty_id ? (facultyMap.get(row.faculty_id) ?? null) : null,
      name: row.name,
      code: row.code,
      scheduleLabel: row.schedule_label,
      startsOn: row.starts_on,
      endsOn: row.ends_on,
      isActive: Boolean(row.is_active),
      enrolledCount: enrolledCountByBatch.get(row.id) ?? 0,
      totalTopics: topicStats.total,
      completedTopics: topicStats.completed,
      syllabusProgressPct: computeSyllabusProgressPct(topicStats.completed, topicStats.total)
    }
  })
}

export async function createBatch(
  input: {
    courseId: string
    facultyId?: string | null
    name: string
    code: string
    scheduleLabel?: string
    startsOn?: string
    endsOn?: string
  },
  targetDb: PaartDb = defaultDb
): Promise<BatchSummaryItem> {
  const name = input.name.trim()
  const code = input.code
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, "-")
  if (name.length < 3) {
    throw new LmsValidationError("Batch name must be at least 3 characters.")
  }
  if (code.length < 3) {
    throw new LmsValidationError("Batch code must be at least 3 characters.")
  }

  const course = await targetDb.find(courses, input.courseId.trim())
  if (!course) {
    throw new LmsValidationError("Please select a valid coaching course.")
  }

  const duplicateCode = await targetDb.findOne(batches, { where: { code } })
  if (duplicateCode) {
    throw new LmsValidationError(`Batch code "${code}" is already in use.`)
  }

  const cleanFacultyId =
    input.facultyId && input.facultyId.trim().length > 0 ? input.facultyId.trim() : null
  const id = generateUUID()
  const now = new Date()

  await targetDb.create(batches, {
    id,
    course_id: course.id,
    faculty_id: cleanFacultyId,
    name,
    code,
    schedule_label: (input.scheduleLabel ?? "").trim(),
    starts_on: (input.startsOn ?? "").trim(),
    ends_on: (input.endsOn ?? "").trim(),
    is_active: true,
    created_at: now,
    updated_at: now
  })

  const all = await listBatches(targetDb)
  return all.find((b) => b.id === id)!
}

export async function toggleBatchActive(
  batchId: string,
  targetDb: PaartDb = defaultDb
): Promise<void> {
  const row = await targetDb.find(batches, batchId)
  if (!row) {
    throw new LmsValidationError("Batch not found.", 404)
  }
  await targetDb.update(batches, batchId, {
    is_active: !row.is_active,
    updated_at: new Date()
  })
}

export async function getBatchSyllabusView(
  batchId: string,
  targetDb: PaartDb = defaultDb
): Promise<{
  batch: BatchSummaryItem
  topics: SyllabusTopicItem[]
}> {
  const allBatches = await listBatches(targetDb)
  const batch = allBatches.find((b) => b.id === batchId)
  if (!batch) {
    throw new LmsValidationError("Batch not found.", 404)
  }

  const rows = await targetDb.findMany(syllabusTopics, {
    where: { batch_id: batchId },
    orderBy: ["sort_order", "asc"]
  })

  const topics: SyllabusTopicItem[] = rows.map((r: SyllabusTopicRow) => ({
    id: r.id,
    batchId: r.batch_id,
    unitLabel: r.unit_label,
    title: r.title,
    sortOrder: r.sort_order,
    status: r.status,
    completedAt: toIso(r.completed_at)
  }))

  return { batch, topics }
}

export async function createSyllabusTopic(
  input: {
    batchId: string
    unitLabel: string
    title: string
    sortOrder?: number
    status?: SyllabusTopicStatus
    actorUserId: string
  },
  targetDb: PaartDb = defaultDb
): Promise<SyllabusTopicItem> {
  const batch = await targetDb.find(batches, input.batchId)
  if (!batch) {
    throw new LmsValidationError("Batch not found.", 404)
  }
  const title = input.title.trim()
  if (title.length < 3) {
    throw new LmsValidationError("Syllabus topic title is required.")
  }
  const unitLabel = input.unitLabel.trim() || "Unit 1"
  const status: SyllabusTopicStatus =
    input.status && SYLLABUS_TOPIC_STATUSES.includes(input.status) ? input.status : "pending"

  const existingTopics = await targetDb.findMany(syllabusTopics, {
    where: { batch_id: batch.id }
  })
  const nextOrder =
    typeof input.sortOrder === "number" && Number.isFinite(input.sortOrder)
      ? input.sortOrder
      : existingTopics.length + 1

  const id = generateUUID()
  const now = new Date()

  await targetDb.create(syllabusTopics, {
    id,
    batch_id: batch.id,
    unit_label: unitLabel,
    title,
    sort_order: nextOrder,
    status,
    completed_at: status === "completed" ? now : null,
    updated_by: input.actorUserId,
    created_at: now,
    updated_at: now
  })

  const created = await targetDb.find(syllabusTopics, id)
  return {
    id: created!.id,
    batchId: created!.batch_id,
    unitLabel: created!.unit_label,
    title: created!.title,
    sortOrder: created!.sort_order,
    status: created!.status,
    completedAt: toIso(created!.completed_at)
  }
}

export async function updateSyllabusTopicStatus(
  input: {
    batchId: string
    topicId: string
    status: SyllabusTopicStatus
    actorUserId: string
  },
  targetDb: PaartDb = defaultDb
): Promise<void> {
  if (!SYLLABUS_TOPIC_STATUSES.includes(input.status)) {
    throw new LmsValidationError("Invalid syllabus topic status.")
  }
  const topic = await targetDb.find(syllabusTopics, input.topicId)
  if (!topic || topic.batch_id !== input.batchId) {
    throw new LmsValidationError("Syllabus topic not found for this batch.", 404)
  }

  const now = new Date()
  await targetDb.update(syllabusTopics, topic.id, {
    status: input.status,
    completed_at: input.status === "completed" ? (topic.completed_at ?? now) : null,
    updated_by: input.actorUserId,
    updated_at: now
  })
}

export async function listExams(targetDb: PaartDb = defaultDb): Promise<ExamItem[]> {
  const [examRows, batchRows, courseRows, enrollmentRows, resultRows] = await Promise.all([
    targetDb.findMany(exams, { orderBy: ["exam_date", "desc"] }),
    targetDb.findMany(batches),
    targetDb.findMany(courses),
    targetDb.findMany(enrollments, { where: { status: "active" } }),
    targetDb.findMany(examResults)
  ])

  const batchMap = new Map(batchRows.map((b) => [b.id, b]))
  const courseMap = new Map(courseRows.map((c) => [c.id, c.title]))
  const enrolledByBatch = new Map<string, number>()
  for (const enr of enrollmentRows) {
    enrolledByBatch.set(enr.batch_id, (enrolledByBatch.get(enr.batch_id) ?? 0) + 1)
  }
  const resultsByExam = new Map<string, number>()
  for (const res of resultRows) {
    resultsByExam.set(res.exam_id, (resultsByExam.get(res.exam_id) ?? 0) + 1)
  }

  return examRows.map((row: ExamRow) => {
    const batch = batchMap.get(row.batch_id)
    const courseId = batch?.course_id ?? ""
    return {
      id: row.id,
      batchId: row.batch_id,
      batchName: batch?.name ?? row.batch_id,
      batchCode: batch?.code ?? row.batch_id,
      courseId,
      courseTitle: courseMap.get(courseId) ?? courseId,
      title: row.title,
      examType: row.exam_type,
      examDate: row.exam_date,
      syllabusNotes: row.syllabus_notes,
      maxMarks: Number(row.max_marks),
      qualifyingMarks: Number(row.qualifying_marks),
      status: row.status,
      publishedAt: toIso(row.published_at),
      recordedCount: resultsByExam.get(row.id) ?? 0,
      enrolledCount: enrolledByBatch.get(row.batch_id) ?? 0
    }
  })
}

export async function createExam(
  input: {
    batchId: string
    title: string
    examType?: string
    examDate: string
    syllabusNotes?: string
    maxMarks: number
    qualifyingMarks: number
    actorUserId: string
  },
  targetDb: PaartDb = defaultDb
): Promise<ExamItem> {
  const batch = await targetDb.find(batches, input.batchId.trim())
  if (!batch) {
    throw new LmsValidationError("Please select a valid batch.")
  }

  const title = input.title.trim()
  if (title.length < 3) {
    throw new LmsValidationError("Exam title must be at least 3 characters.")
  }

  const examDate = input.examDate.trim()
  if (examDate.length < 6) {
    throw new LmsValidationError("Exam date is required.")
  }

  if (!Number.isFinite(input.maxMarks) || input.maxMarks <= 0) {
    throw new LmsValidationError("Maximum marks must be greater than zero.")
  }

  if (
    !Number.isFinite(input.qualifyingMarks) ||
    input.qualifyingMarks < 0 ||
    input.qualifyingMarks > input.maxMarks
  ) {
    throw new LmsValidationError(
      `Qualifying marks must be between 0 and maximum marks (${input.maxMarks}).`
    )
  }

  const examType: ExamType = EXAM_TYPES.includes(input.examType as ExamType)
    ? (input.examType as ExamType)
    : "weekly_mock"

  const id = generateUUID()
  const now = new Date()

  await targetDb.create(exams, {
    id,
    batch_id: batch.id,
    title,
    exam_type: examType,
    exam_date: examDate,
    syllabus_notes: (input.syllabusNotes ?? "").trim(),
    max_marks: input.maxMarks,
    qualifying_marks: input.qualifyingMarks,
    status: "scheduled",
    published_at: null,
    created_by: input.actorUserId,
    created_at: now,
    updated_at: now
  })

  const all = await listExams(targetDb)
  return all.find((e) => e.id === id)!
}

export async function getExamMarksSheet(
  examId: string,
  targetDb: PaartDb = defaultDb
): Promise<{
  exam: ExamItem
  entries: MarksSheetEntry[]
}> {
  const allExams = await listExams(targetDb)
  const exam = allExams.find((e) => e.id === examId)
  if (!exam) {
    throw new LmsValidationError("Exam not found.", 404)
  }

  const [batchEnrollments, userRows, existingResults] = await Promise.all([
    targetDb.findMany(enrollments, {
      where: { batch_id: exam.batchId, status: "active" },
      orderBy: ["roll_number", "asc"]
    }),
    targetDb.findMany(users, { where: { role: "aspirant" } }),
    targetDb.findMany(examResults, { where: { exam_id: exam.id } })
  ])

  const userMap = new Map(userRows.map((u) => [u.id, u]))
  const resultMap = new Map<string, ExamResultRow>(existingResults.map((r) => [r.aspirant_id, r]))

  const entries: MarksSheetEntry[] = []
  for (const enr of batchEnrollments) {
    const asp = userMap.get(enr.aspirant_id)
    if (!asp) continue
    const saved = resultMap.get(asp.id)
    entries.push({
      aspirantId: asp.id,
      fullName: asp.full_name,
      email: asp.email,
      rollNumber: enr.roll_number,
      attendance: saved?.attendance ?? "present",
      marksObtained: saved ? Number(saved.marks_obtained) : 0,
      hasSavedResult: Boolean(saved),
      rank: saved?.rank ?? null,
      remarks: saved?.remarks ?? ""
    })
  }

  return { exam, entries }
}

export interface MarksEntryInputRow {
  aspirantId: string
  attendance: AttendanceStatus
  marksObtained: number
  remarks: string
}

export async function saveExamMarks(
  input: {
    examId: string
    rows: MarksEntryInputRow[]
    actorUserId: string
  },
  targetDb: PaartDb = defaultDb
): Promise<void> {
  const examRow = await targetDb.find(exams, input.examId)
  if (!examRow) {
    throw new LmsValidationError("Exam not found.", 404)
  }

  const maxMarks = Number(examRow.max_marks)
  const batchEnrollments = await targetDb.findMany(enrollments, {
    where: { batch_id: examRow.batch_id, status: "active" }
  })
  const enrolledAspirantIds = new Set(batchEnrollments.map((e) => e.aspirant_id))

  for (const row of input.rows) {
    if (!enrolledAspirantIds.has(row.aspirantId)) {
      throw new LmsValidationError(
        `Aspirant "${row.aspirantId}" is not actively enrolled in this exam's batch.`
      )
    }
    if (!ATTENDANCE_STATUSES.includes(row.attendance)) {
      throw new LmsValidationError("Attendance must be 'present' or 'absent'.")
    }
    if (row.attendance === "present") {
      if (
        !Number.isFinite(row.marksObtained) ||
        row.marksObtained < 0 ||
        row.marksObtained > maxMarks
      ) {
        throw new LmsValidationError(
          `Marks obtained (${row.marksObtained}) must be between 0 and ${maxMarks}.`
        )
      }
    }
  }

  const existing = await targetDb.findMany(examResults, { where: { exam_id: examRow.id } })
  const existingByAspirant = new Map(existing.map((r) => [r.aspirant_id, r]))
  const now = new Date()

  for (const row of input.rows) {
    const cleanMarks = row.attendance === "absent" ? 0 : Math.round(row.marksObtained * 100) / 100
    const cleanRemarks = sanitizeFormulaText(row.remarks)
    const prev = existingByAspirant.get(row.aspirantId)

    if (prev) {
      await targetDb.update(examResults, prev.id, {
        attendance: row.attendance,
        marks_obtained: cleanMarks,
        remarks: cleanRemarks,
        updated_by: input.actorUserId,
        updated_at: now
      })
    } else {
      await targetDb.create(examResults, {
        id: generateUUID(),
        exam_id: examRow.id,
        aspirant_id: row.aspirantId,
        attendance: row.attendance,
        marks_obtained: cleanMarks,
        rank: null,
        remarks: cleanRemarks,
        updated_by: input.actorUserId,
        updated_at: now
      })
    }
  }

  // If the exam was already published, immediately recompute ranks so published ranks stay consistent.
  if (examRow.status === "published") {
    await recomputeExamRanks(examRow.id, targetDb)
  }
}

export async function exportExamMarksTemplateCsv(
  examId: string,
  targetDb: PaartDb = defaultDb
): Promise<{ filename: string; csv: string }> {
  const { exam, entries } = await getExamMarksSheet(examId, targetDb)

  const rows = entries.map((e) => ({
    roll_number: e.rollNumber,
    email: e.email,
    student_name: e.fullName,
    attendance: e.attendance,
    marks_obtained: e.hasSavedResult ? e.marksObtained : 0,
    remarks: e.remarks
  }))

  const csv = unwrap(
    stringifyCsv(rows, {
      escapeFormulas: true,
      columns: [
        { key: "roll_number", header: "roll_number" },
        { key: "email", header: "email" },
        { key: "student_name", header: "student_name" },
        { key: "attendance", header: "attendance" },
        { key: "marks_obtained", header: "marks_obtained" },
        { key: "remarks", header: "remarks" }
      ]
    })
  )

  const safeSlug = exam.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  return {
    filename: `${exam.batchCode.toLowerCase()}-${safeSlug || "exam"}-marks.csv`,
    csv
  }
}

export async function importExamMarksCsv(
  input: {
    examId: string
    csvText: string
    actorUserId: string
  },
  targetDb: PaartDb = defaultDb
): Promise<{ importedCount: number }> {
  const parsed = parseCsv(input.csvText)
  if (isFailure(parsed)) {
    throw new LmsValidationError(`Invalid CSV file format: ${parsed.error.message}`)
  }

  if (parsed.data.rows.length === 0) {
    throw new LmsValidationError("Uploaded CSV contains no data rows.")
  }

  const { exam, entries } = await getExamMarksSheet(input.examId, targetDb)
  const byEmail = new Map(entries.map((e) => [e.email.toLowerCase(), e]))
  const byRoll = new Map(entries.map((e) => [e.rollNumber.toUpperCase(), e]))

  const validatedRows: MarksEntryInputRow[] = []
  const errors: string[] = []

  parsed.data.rows.forEach((rawRow, idx) => {
    const rowNumber = idx + 2
    const rawEmail = (rawRow.email ?? "").trim()
    const rawRoll = (rawRow.roll_number ?? "").trim().toUpperCase()
    const normalizedEmail = rawEmail ? normalizeUserEmail(rawEmail)?.canonical : undefined

    const matched =
      (normalizedEmail ? byEmail.get(normalizedEmail) : undefined) ??
      (rawRoll ? byRoll.get(rawRoll) : undefined)

    if (!matched) {
      errors.push(
        `Row ${rowNumber}: aspirant "${rawEmail || rawRoll || "(blank)"}" is not enrolled in ${exam.batchCode}.`
      )
      return
    }

    const rawAttendance = ((rawRow.attendance ?? "present").trim().toLowerCase() ||
      "present") as AttendanceStatus
    if (!ATTENDANCE_STATUSES.includes(rawAttendance)) {
      errors.push(
        `Row ${rowNumber} (${matched.email}): attendance "${rawRow.attendance}" must be 'present' or 'absent'.`
      )
      return
    }

    const rawMarksStr = (rawRow.marks_obtained ?? "0").trim()
    const parsedMarks = rawAttendance === "absent" ? 0 : Number(rawMarksStr)
    if (!Number.isFinite(parsedMarks) || parsedMarks < 0 || parsedMarks > exam.maxMarks) {
      errors.push(
        `Row ${rowNumber} (${matched.email}): marks "${rawMarksStr}" must be between 0 and ${exam.maxMarks}.`
      )
      return
    }

    validatedRows.push({
      aspirantId: matched.aspirantId,
      attendance: rawAttendance,
      marksObtained: parsedMarks,
      remarks: sanitizeFormulaText(rawRow.remarks ?? "")
    })
  })

  if (errors.length > 0) {
    throw new LmsValidationError(errors.slice(0, 4).join(" · "))
  }

  await saveExamMarks(
    {
      examId: input.examId,
      rows: validatedRows,
      actorUserId: input.actorUserId
    },
    targetDb
  )

  return { importedCount: validatedRows.length }
}

async function recomputeExamRanks(examId: string, targetDb: PaartDb): Promise<void> {
  const results = await targetDb.findMany(examResults, { where: { exam_id: examId } })
  const presentSorted = results
    .filter((r) => r.attendance === "present")
    .sort((a, b) => {
      const diff = Number(b.marks_obtained) - Number(a.marks_obtained)
      if (diff !== 0) return diff
      return a.aspirant_id.localeCompare(b.aspirant_id)
    })

  // Dense rank: equal marks share the same rank (1, 1, 2, 3...)
  let currentRank = 0
  let previousMarks: number | null = null

  for (const row of presentSorted) {
    const score = Number(row.marks_obtained)
    if (previousMarks === null || score < previousMarks) {
      currentRank += 1
      previousMarks = score
    }
    await targetDb.update(examResults, row.id, {
      rank: currentRank
    })
  }

  for (const row of results.filter((r) => r.attendance === "absent")) {
    if (row.rank !== null) {
      await targetDb.update(examResults, row.id, {
        rank: null
      })
    }
  }
}

export async function publishExamResults(
  input: {
    examId: string
    actorUserId: string
  },
  targetDb: PaartDb = defaultDb
): Promise<void> {
  const examRow = await targetDb.find(exams, input.examId)
  if (!examRow) {
    throw new LmsValidationError("Exam not found.", 404)
  }

  // Ensure every active enrolled aspirant without an explicit row defaults to absent or ensure existing rows are ranked
  await recomputeExamRanks(examRow.id, targetDb)

  const now = new Date()
  await targetDb.update(exams, examRow.id, {
    status: "published",
    published_at: examRow.published_at ?? now,
    updated_at: now
  })
}

export async function listAllNotifications(
  targetDb: PaartDb = defaultDb
): Promise<NotificationItem[]> {
  const [rows, courseRows, batchRows] = await Promise.all([
    targetDb.findMany(notifications, { orderBy: ["published_at", "desc"], limit: 200 }),
    targetDb.findMany(courses),
    targetDb.findMany(batches)
  ])

  const courseMap = new Map(courseRows.map((c) => [c.id, c.title]))
  const batchMap = new Map(batchRows.map((b) => [b.id, `${b.name} (${b.code})`]))

  return rows.map((r: NotificationRow) => ({
    id: r.id,
    title: r.title,
    body: r.body,
    category: r.category,
    targetScope: r.target_scope,
    targetCourseId: r.target_course_id ?? null,
    targetCourseTitle: r.target_course_id
      ? (courseMap.get(r.target_course_id) ?? r.target_course_id)
      : null,
    targetBatchId: r.target_batch_id ?? null,
    targetBatchName: r.target_batch_id
      ? (batchMap.get(r.target_batch_id) ?? r.target_batch_id)
      : null,
    publishedAt: toIso(r.published_at) ?? new Date().toISOString()
  }))
}

export async function createNotification(
  input: {
    title: string
    body: string
    category?: string
    targetScope: string
    targetCourseId?: string | null
    targetBatchId?: string | null
    actorUserId: string
  },
  targetDb: PaartDb = defaultDb
): Promise<NotificationItem> {
  const title = input.title.trim()
  const body = input.body.trim()
  if (title.length < 3) {
    throw new LmsValidationError("Notification title must be at least 3 characters.")
  }
  if (body.length < 5) {
    throw new LmsValidationError("Notification message body is required.")
  }

  const category: NotificationCategory = NOTIFICATION_CATEGORIES.includes(
    input.category as NotificationCategory
  )
    ? (input.category as NotificationCategory)
    : "general"

  const targetScope: NotificationScope = NOTIFICATION_SCOPES.includes(
    input.targetScope as NotificationScope
  )
    ? (input.targetScope as NotificationScope)
    : "all"

  let targetCourseId: string | null = null
  let targetBatchId: string | null = null

  if (targetScope === "course") {
    const cleanCourse = input.targetCourseId?.trim() || ""
    const course = cleanCourse ? await targetDb.find(courses, cleanCourse) : null
    if (!course) {
      throw new LmsValidationError("Please select a target course for course-scoped notifications.")
    }
    targetCourseId = course.id
  } else if (targetScope === "batch") {
    const cleanBatch = input.targetBatchId?.trim() || ""
    const batch = cleanBatch ? await targetDb.find(batches, cleanBatch) : null
    if (!batch) {
      throw new LmsValidationError("Please select a target batch for batch-scoped notifications.")
    }
    targetBatchId = batch.id
    targetCourseId = batch.course_id
  }

  const id = generateUUID()
  const now = new Date()

  await targetDb.create(notifications, {
    id,
    title,
    body,
    category,
    target_scope: targetScope,
    target_course_id: targetCourseId,
    target_batch_id: targetBatchId,
    published_by: input.actorUserId,
    published_at: now
  })

  const all = await listAllNotifications(targetDb)
  return all.find((n) => n.id === id)!
}

export async function listNotificationsForAspirant(
  aspirantId: string,
  targetDb: PaartDb = defaultDb
): Promise<NotificationItem[]> {
  const [allItems, enrollmentRows, batchRows] = await Promise.all([
    listAllNotifications(targetDb),
    targetDb.findMany(enrollments, {
      where: { aspirant_id: aspirantId, status: "active" }
    }),
    targetDb.findMany(batches)
  ])

  const batchMap = new Map(batchRows.map((b) => [b.id, b]))
  const enrolledBatchIds = new Set<string>()
  const enrolledCourseIds = new Set<string>()

  for (const enr of enrollmentRows) {
    enrolledBatchIds.add(enr.batch_id)
    const batch = batchMap.get(enr.batch_id)
    if (batch) {
      enrolledCourseIds.add(batch.course_id)
    }
  }

  return allItems.filter((item) => {
    if (item.targetScope === "all") return true
    if (item.targetScope === "batch") {
      return item.targetBatchId ? enrolledBatchIds.has(item.targetBatchId) : false
    }
    if (item.targetScope === "course") {
      return item.targetCourseId ? enrolledCourseIds.has(item.targetCourseId) : false
    }
    return false
  })
}

export async function getAspirantPortalSnapshot(
  aspirantId: string,
  targetDb: PaartDb = defaultDb
): Promise<AspirantPortalSnapshot> {
  const [
    enrollmentRows,
    batchRows,
    courseRows,
    facultyRows,
    allTopics,
    allExams,
    ownResults,
    targetedNotifications
  ] = await Promise.all([
    targetDb.findMany(enrollments, {
      where: { aspirant_id: aspirantId, status: "active" }
    }),
    targetDb.findMany(batches),
    targetDb.findMany(courses),
    targetDb.findMany(users, { where: { role: "faculty" } }),
    targetDb.findMany(syllabusTopics, { orderBy: ["sort_order", "asc"] }),
    listExams(targetDb),
    targetDb.findMany(examResults, { where: { aspirant_id: aspirantId } }),
    listNotificationsForAspirant(aspirantId, targetDb)
  ])

  const batchMap = new Map(batchRows.map((b) => [b.id, b]))
  const courseMap = new Map(courseRows.map((c) => [c.id, c.title]))
  const facultyMap = new Map(facultyRows.map((f) => [f.id, f.full_name]))
  const enrolledBatchIds = new Set(enrollmentRows.map((e) => e.batch_id))

  let grandTotalTopics = 0
  let grandCompletedTopics = 0

  const batchProgressList: AspirantBatchProgress[] = []
  for (const enr of enrollmentRows) {
    const batch = batchMap.get(enr.batch_id)
    if (!batch) continue
    const batchTopics = allTopics
      .filter((t) => t.batch_id === batch.id)
      .map((t) => ({
        id: t.id,
        batchId: t.batch_id,
        unitLabel: t.unit_label,
        title: t.title,
        sortOrder: t.sort_order,
        status: t.status,
        completedAt: toIso(t.completed_at)
      }))

    const totalTopics = batchTopics.length
    const completedTopics = batchTopics.filter((t) => t.status === "completed").length
    const inProgressTopics = batchTopics.filter((t) => t.status === "in_progress").length
    grandTotalTopics += totalTopics
    grandCompletedTopics += completedTopics

    batchProgressList.push({
      enrollmentId: enr.id,
      rollNumber: enr.roll_number,
      batchId: batch.id,
      batchName: batch.name,
      batchCode: batch.code,
      scheduleLabel: batch.schedule_label,
      courseId: batch.course_id,
      courseTitle: courseMap.get(batch.course_id) ?? batch.course_id,
      facultyName: batch.faculty_id ? (facultyMap.get(batch.faculty_id) ?? null) : null,
      totalTopics,
      completedTopics,
      inProgressTopics,
      syllabusProgressPct: computeSyllabusProgressPct(completedTopics, totalTopics),
      topics: batchTopics
    })
  }

  const upcomingAndPastExams = allExams
    .filter((e) => enrolledBatchIds.has(e.batchId))
    .sort((a, b) => a.examDate.localeCompare(b.examDate))

  const examMap = new Map(allExams.map((e) => [e.id, e]))
  const scorecards: AspirantPublishedScorecard[] = []

  for (const res of ownResults) {
    const exam = examMap.get(res.exam_id)
    // Strictly omit any non-published exams or exams outside enrolled batches
    if (!exam || exam.status !== "published") continue

    const marksObtained = Number(res.marks_obtained)
    const maxMarks = exam.maxMarks
    const percentage =
      maxMarks > 0 && res.attendance === "present"
        ? Math.round((marksObtained / maxMarks) * 1000) / 10
        : 0
    const qualified = res.attendance === "present" && marksObtained >= exam.qualifyingMarks

    scorecards.push({
      examId: exam.id,
      examTitle: exam.title,
      examType: exam.examType,
      examDate: exam.examDate,
      batchName: exam.batchName,
      batchCode: exam.batchCode,
      courseTitle: exam.courseTitle,
      attendance: res.attendance,
      marksObtained,
      maxMarks,
      qualifyingMarks: exam.qualifyingMarks,
      percentage,
      qualified,
      rank: res.rank ?? null,
      remarks: res.remarks
    })
  }

  // Sort chronological ascending for trend chart (views can reverse for newest-first tables)
  scorecards.sort((a, b) => a.examDate.localeCompare(b.examDate))

  const presentScorecards = scorecards.filter((s) => s.attendance === "present")
  const averagePercentage =
    presentScorecards.length > 0
      ? Math.round(
          (presentScorecards.reduce((sum, s) => sum + s.percentage, 0) / presentScorecards.length) *
            10
        ) / 10
      : 0

  const ranked = presentScorecards
    .map((s) => s.rank)
    .filter((r): r is number => typeof r === "number" && r > 0)
  const bestRank = ranked.length > 0 ? Math.min(...ranked) : null

  return {
    batches: batchProgressList,
    overallSyllabusPct: computeSyllabusProgressPct(grandCompletedTopics, grandTotalTopics),
    upcomingAndPastExams,
    scorecards,
    completedExamsCount: scorecards.length,
    averagePercentage,
    bestRank,
    notifications: targetedNotifications
  }
}
