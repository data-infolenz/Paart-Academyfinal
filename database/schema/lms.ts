import { table } from "remix/data-table"
import { col, type InferInsert, type InferSelect } from "./helpers"

export const ENROLLMENT_STATUSES = ["active", "completed", "dropped"] as const
export type EnrollmentStatus = (typeof ENROLLMENT_STATUSES)[number]

export const SYLLABUS_TOPIC_STATUSES = ["pending", "in_progress", "completed"] as const
export type SyllabusTopicStatus = (typeof SYLLABUS_TOPIC_STATUSES)[number]

export const EXAM_TYPES = ["weekly_mock", "omr_revision", "full_test"] as const
export type ExamType = (typeof EXAM_TYPES)[number]

export const EXAM_STATUSES = ["scheduled", "published"] as const
export type ExamStatus = (typeof EXAM_STATUSES)[number]

export const ATTENDANCE_STATUSES = ["present", "absent"] as const
export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number]

export const NOTIFICATION_CATEGORIES = ["exam", "material", "schedule", "general"] as const
export type NotificationCategory = (typeof NOTIFICATION_CATEGORIES)[number]

export const NOTIFICATION_SCOPES = ["all", "course", "batch"] as const
export type NotificationScope = (typeof NOTIFICATION_SCOPES)[number]

export const batches = table({
  name: "batches",
  columns: {
    id: col.text().primaryKey(),
    course_id: col.text().notNull(),
    faculty_id: col.text().nullable(),
    name: col.text().notNull(),
    code: col.text().notNull().unique(),
    schedule_label: col.text().notNull().default(""),
    starts_on: col.text().notNull().default(""),
    ends_on: col.text().notNull().default(""),
    is_active: col.boolean().notNull().default(true),
    created_at: col.timestamp().notNull().defaultNow(),
    updated_at: col.timestamp().notNull().defaultNow()
  },
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
})

export const enrollments = table({
  name: "enrollments",
  columns: {
    id: col.text().primaryKey(),
    batch_id: col.text().notNull(),
    aspirant_id: col.text().notNull(),
    admission_id: col.text().nullable(),
    roll_number: col.text().notNull(),
    status: col.text<EnrollmentStatus>().notNull().default("active"),
    enrolled_at: col.timestamp().notNull().defaultNow()
  }
})

export const syllabusTopics = table({
  name: "syllabus_topics",
  columns: {
    id: col.text().primaryKey(),
    batch_id: col.text().notNull(),
    unit_label: col.text().notNull().default("Unit 1"),
    title: col.text().notNull(),
    sort_order: col.integer().notNull().default(0),
    status: col.text<SyllabusTopicStatus>().notNull().default("pending"),
    completed_at: col.timestamp().nullable(),
    updated_by: col.text().nullable(),
    created_at: col.timestamp().notNull().defaultNow(),
    updated_at: col.timestamp().notNull().defaultNow()
  },
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
})

export const exams = table({
  name: "exams",
  columns: {
    id: col.text().primaryKey(),
    batch_id: col.text().notNull(),
    title: col.text().notNull(),
    exam_type: col.text<ExamType>().notNull().default("weekly_mock"),
    exam_date: col.text().notNull(),
    syllabus_notes: col.text().notNull().default(""),
    max_marks: col.decimal(6, 2).notNull(),
    qualifying_marks: col.decimal(6, 2).notNull(),
    status: col.text<ExamStatus>().notNull().default("scheduled"),
    published_at: col.timestamp().nullable(),
    created_by: col.text().nullable(),
    created_at: col.timestamp().notNull().defaultNow(),
    updated_at: col.timestamp().notNull().defaultNow()
  },
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
})

export const examResults = table({
  name: "exam_results",
  columns: {
    id: col.text().primaryKey(),
    exam_id: col.text().notNull(),
    aspirant_id: col.text().notNull(),
    attendance: col.text<AttendanceStatus>().notNull().default("present"),
    marks_obtained: col.decimal(6, 2).notNull().default(0),
    rank: col.integer().nullable(),
    remarks: col.text().notNull().default(""),
    updated_by: col.text().nullable(),
    updated_at: col.timestamp().notNull().defaultNow()
  }
})

export const notifications = table({
  name: "notifications",
  columns: {
    id: col.text().primaryKey(),
    title: col.text().notNull(),
    body: col.text().notNull(),
    category: col.text<NotificationCategory>().notNull().default("general"),
    target_scope: col.text<NotificationScope>().notNull().default("all"),
    target_course_id: col.text().nullable(),
    target_batch_id: col.text().nullable(),
    published_by: col.text().nullable(),
    published_at: col.timestamp().notNull().defaultNow()
  }
})

export type BatchRow = InferSelect<typeof batches>
export type NewBatchRow = InferInsert<typeof batches>
export type EnrollmentRow = InferSelect<typeof enrollments>
export type NewEnrollmentRow = InferInsert<typeof enrollments>
export type SyllabusTopicRow = InferSelect<typeof syllabusTopics>
export type NewSyllabusTopicRow = InferInsert<typeof syllabusTopics>
export type ExamRow = InferSelect<typeof exams>
export type NewExamRow = InferInsert<typeof exams>
export type ExamResultRow = InferSelect<typeof examResults>
export type NewExamResultRow = InferInsert<typeof examResults>
export type NotificationRow = InferSelect<typeof notifications>
export type NewNotificationRow = InferInsert<typeof notifications>
