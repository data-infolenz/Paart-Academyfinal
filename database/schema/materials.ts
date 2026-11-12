import { table } from "remix/data-table"
import { col, type InferInsert, type InferSelect } from "./helpers"

export const MATERIAL_VISIBILITIES = ["public", "enrolled"] as const
export type MaterialVisibility = (typeof MATERIAL_VISIBILITIES)[number]

export const materials = table({
  name: "materials",
  columns: {
    id: col.text().primaryKey(),
    title: col.text().notNull(),
    category: col.text().notNull().default("Study Material"),
    description: col.text().notNull().default(""),
    file_url: col.text().notNull().default(""),
    external_url: col.text().notNull().default(""),
    course_id: col.text().nullable(),
    visibility: col.text<MaterialVisibility>().notNull().default("public"),
    uploaded_by: col.text().nullable(),
    published: col.boolean().notNull().default(true),
    display_order: col.integer().notNull().default(0),
    created_at: col.timestamp().notNull().defaultNow(),
    updated_at: col.timestamp().notNull().defaultNow()
  },
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
})

export type MaterialRow = InferSelect<typeof materials>
export type NewMaterialRow = InferInsert<typeof materials>
