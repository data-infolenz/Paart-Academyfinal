import { table } from "remix/data-table"
import { col, type InferInsert, type InferSelect } from "./helpers"

export const blogs = table({
  name: "blogs",
  columns: {
    id: col.text().primaryKey(),
    slug: col.text().notNull().unique(),
    title: col.text().notNull(),
    short_description: col.text().notNull().default(""),
    content: col.text().notNull().default(""),
    author: col.text().notNull().default("PAART Academic Team"),
    published_date: col.text().notNull(),
    category: col.text().notNull().default("TNPSC"),
    featured_image: col.text().notNull().default("/images/classroom-1.jpg"),
    seo_title: col.text().notNull().default(""),
    meta_description: col.text().notNull().default(""),
    published: col.boolean().notNull().default(true),
    created_at: col.timestamp().notNull().defaultNow(),
    updated_at: col.timestamp().notNull().defaultNow()
  },
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
})

export type BlogRow = InferSelect<typeof blogs>
export type NewBlogRow = InferInsert<typeof blogs>
