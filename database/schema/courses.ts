import { table } from "remix/data-table"
import type { CourseCategory, CourseDetailSpec } from "~/config/courses"
import { col, type InferInsert, type InferSelect } from "./helpers"

export const courses = table({
  name: "courses",
  columns: {
    id: col.text().primaryKey(),
    slug: col.text().notNull().unique(),
    title: col.text().notNull(),
    category: col.text<CourseCategory>().notNull(),
    short_description: col.text().notNull(),
    duration: col.text().notNull().default("Flexible weekday & weekend batches"),
    eligibility: col.text().notNull().default("As per official recruitment notification"),
    image: col.text().notNull().default("/images/course-exam-1.jpg"),
    features: col.json<string[]>().notNull().default([]),
    exam_stages: col.json<string[]>().notNull().default([]),
    details: col.json<CourseDetailSpec | null>().nullable(),
    enabled: col.boolean().notNull().default(true),
    display_order: col.integer().notNull().default(0),
    created_at: col.timestamp().notNull().defaultNow(),
    updated_at: col.timestamp().notNull().defaultNow()
  },
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  beforeWrite({ value }) {
    const next: Record<string, unknown> = { ...value }
    if (Array.isArray(next.features)) next.features = JSON.stringify(next.features)
    if (Array.isArray(next.exam_stages)) next.exam_stages = JSON.stringify(next.exam_stages)
    return { value: next as typeof value }
  }
})

export type CourseRow = InferSelect<typeof courses>
export type NewCourseRow = InferInsert<typeof courses>
