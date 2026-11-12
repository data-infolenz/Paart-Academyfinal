import crypto from "node:crypto"
import { db as defaultDb, type PaartDb } from "~/app/initializers/database"
import { SEED_MATERIALS, type SeedMaterialItem } from "~/config/courses"
import {
  batches,
  courses,
  enrollments,
  type MaterialRow,
  type MaterialVisibility,
  materials
} from "~/database/schema"

export interface MaterialItem {
  id: string
  title: string
  category: string
  description: string
  fileUrl: string
  externalUrl: string
  courseId: string | null
  courseTitle: string | null
  visibility: MaterialVisibility
  uploadedBy: string | null
  published: boolean
  displayOrder: number
}

function mapMaterialRow(
  row: MaterialRow,
  courseTitleMap?: ReadonlyMap<string, string>
): MaterialItem {
  const courseId = row.course_id ?? null
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    fileUrl: row.file_url,
    externalUrl: row.external_url,
    courseId,
    courseTitle: courseId ? (courseTitleMap?.get(courseId) ?? courseId) : null,
    visibility: row.visibility ?? "public",
    uploadedBy: row.uploaded_by ?? null,
    published: Boolean(row.published),
    displayOrder: row.display_order ?? 0
  }
}

function mapSeedMaterial(m: SeedMaterialItem): MaterialItem {
  return {
    ...m,
    courseId: null,
    courseTitle: null,
    visibility: "public",
    uploadedBy: null
  }
}

export async function listPublishedMaterials(
  category?: string | null,
  targetDb: PaartDb = defaultDb
): Promise<MaterialItem[]> {
  try {
    const rows = await targetDb.findMany(materials, {
      where: { published: true, visibility: "public" },
      orderBy: ["display_order", "asc"]
    })
    const allCount = await targetDb.count(materials)
    const items =
      allCount > 0
        ? rows.map((r) => mapMaterialRow(r))
        : SEED_MATERIALS.filter((m) => m.published).map(mapSeedMaterial)
    return category && category !== "ALL" ? items.filter((m) => m.category === category) : items
  } catch {
    const items = SEED_MATERIALS.filter((m) => m.published).map(mapSeedMaterial)
    return category && category !== "ALL" ? items.filter((m) => m.category === category) : items
  }
}

export async function listAllMaterials(targetDb: PaartDb = defaultDb): Promise<MaterialItem[]> {
  try {
    const [rows, courseRows] = await Promise.all([
      targetDb.findMany(materials, {
        orderBy: ["display_order", "asc"]
      }),
      targetDb.findMany(courses)
    ])
    const courseMap = new Map(courseRows.map((c) => [c.id, c.title]))
    return rows.length > 0
      ? rows.map((r) => mapMaterialRow(r, courseMap))
      : SEED_MATERIALS.map(mapSeedMaterial)
  } catch {
    return SEED_MATERIALS.map(mapSeedMaterial)
  }
}

export async function listMaterialsForAspirant(
  aspirantId: string,
  targetDb: PaartDb = defaultDb
): Promise<MaterialItem[]> {
  const [materialRows, enrollmentRows, batchRows, courseRows] = await Promise.all([
    targetDb.findMany(materials, {
      where: { published: true },
      orderBy: ["display_order", "asc"]
    }),
    targetDb.findMany(enrollments, {
      where: { aspirant_id: aspirantId, status: "active" }
    }),
    targetDb.findMany(batches),
    targetDb.findMany(courses)
  ])

  const batchMap = new Map(batchRows.map((b) => [b.id, b]))
  const courseMap = new Map(courseRows.map((c) => [c.id, c.title]))
  const enrolledCourseIds = new Set<string>()
  for (const enr of enrollmentRows) {
    const batch = batchMap.get(enr.batch_id)
    if (batch) {
      enrolledCourseIds.add(batch.course_id)
    }
  }

  return materialRows
    .filter((row) => {
      if (row.visibility === "public") return true
      if (row.visibility === "enrolled") {
        return row.course_id ? enrolledCourseIds.has(row.course_id) : enrolledCourseIds.size > 0
      }
      return false
    })
    .map((row) => mapMaterialRow(row, courseMap))
}

export async function createMaterial(
  input: {
    title: string
    category: string
    description: string
    fileUrl: string
    externalUrl: string
    courseId?: string | null
    visibility?: MaterialVisibility
    uploadedBy?: string | null
  },
  targetDb: PaartDb = defaultDb
): Promise<MaterialItem> {
  const now = new Date()
  const id = `mat-${crypto.randomUUID().slice(0, 8)}`
  const cleanCourseId =
    input.courseId && input.courseId.trim().length > 0 ? input.courseId.trim() : null
  const visibility: MaterialVisibility = input.visibility === "enrolled" ? "enrolled" : "public"

  await targetDb.create(materials, {
    id,
    title: input.title.trim(),
    category: input.category.trim(),
    description: input.description.trim(),
    file_url: input.fileUrl.trim(),
    external_url: input.externalUrl.trim(),
    course_id: cleanCourseId,
    visibility,
    uploaded_by: input.uploadedBy ?? null,
    published: true,
    display_order: 50,
    created_at: now,
    updated_at: now
  })

  const row = await targetDb.find(materials, id)
  return mapMaterialRow(row!)
}

export async function deleteMaterial(id: string, targetDb: PaartDb = defaultDb): Promise<void> {
  await targetDb.delete(materials, id)
}
