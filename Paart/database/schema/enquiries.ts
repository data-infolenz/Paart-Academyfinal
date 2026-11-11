import { table } from "remix/data-table"
import { col, type InferInsert, type InferSelect } from "./helpers"

export const ENQUIRY_STATUSES = ["New", "Contacted", "Closed"] as const

export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number]

export const enquiries = table({
  name: "enquiries",
  columns: {
    id: col.text().primaryKey(),
    name: col.text().notNull(),
    phone: col.text().notNull(),
    email: col.text().nullable(),
    district: col.text().nullable(),
    course_interested: col.text().notNull(),
    message: col.text().notNull().default(""),
    status: col.text<EnquiryStatus>().notNull().default("New"),
    created_at: col.timestamp().notNull().defaultNow(),
    updated_at: col.timestamp().notNull().defaultNow()
  },
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
})

export type EnquiryRow = InferSelect<typeof enquiries>
export type NewEnquiryRow = InferInsert<typeof enquiries>
