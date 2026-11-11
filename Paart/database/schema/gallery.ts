import { table } from "remix/data-table"
import { col, type InferInsert, type InferSelect } from "./helpers"

export const galleryItems = table({
  name: "gallery_items",
  columns: {
    id: col.text().primaryKey(),
    title: col.text().notNull(),
    description: col.text().notNull().default(""),
    category: col.text().notNull().default("Classroom"),
    image: col.text().notNull(),
    video_url: col.text().nullable(),
    display_order: col.integer().notNull().default(0),
    created_at: col.timestamp().notNull().defaultNow()
  }
})

export type GalleryRow = InferSelect<typeof galleryItems>
export type NewGalleryRow = InferInsert<typeof galleryItems>
