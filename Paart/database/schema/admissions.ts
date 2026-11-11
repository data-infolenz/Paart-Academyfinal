import { table } from "remix/data-table"
import { col, type InferInsert, type InferSelect } from "./helpers"

export const ADMISSION_STATUSES = [
  "New",
  "Contacted",
  "Pending",
  "Approved",
  "Rejected",
  "Joined"
] as const

export type AdmissionStatus = (typeof ADMISSION_STATUSES)[number]

export const admissions = table({
  name: "admissions",
  columns: {
    id: col.text().primaryKey(),
    application_id: col.text().notNull().unique(),
    student_name: col.text().notNull(),
    parent_name: col.text().notNull().default(""),
    date_of_birth: col.text().notNull().default(""),
    gender: col.text().notNull().default(""),
    mobile: col.text().notNull(),
    whatsapp: col.text().notNull().default(""),
    email: col.text().notNull().default(""),
    address: col.text().notNull().default(""),
    city: col.text().notNull().default(""),
    district: col.text().notNull().default("Tenkasi"),
    state: col.text().notNull().default("Tamil Nadu"),
    pincode: col.text().notNull().default(""),
    course_interested: col.text().notNull(),
    previous_qualification: col.text().notNull().default(""),
    school_college_name: col.text().notNull().default(""),
    year_of_passing: col.text().notNull().default(""),
    marks_percentage: col.text().notNull().default(""),
    preferred_batch: col.text().notNull().default("Regular Weekday"),
    message: col.text().notNull().default(""),
    photo_url: col.text().nullable(),
    document_url: col.text().nullable(),
    status: col.text<AdmissionStatus>().notNull().default("New"),
    created_at: col.timestamp().notNull().defaultNow(),
    updated_at: col.timestamp().notNull().defaultNow()
  },
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
})

export type AdmissionRow = InferSelect<typeof admissions>
export type NewAdmissionRow = InferInsert<typeof admissions>
