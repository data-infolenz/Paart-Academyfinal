import crypto from "node:crypto"
import { db } from "~/app/initializers/database"
import { SEED_MATERIALS, type SeedMaterialItem } from "~/config/courses"
import { type MaterialRow, materials } from "~/database/schema"

export interface MaterialItem {
  id: string
  title: string
  category: string
  description: string
  fileUrl: string
  externalUrl: string
  published: boolean
  displayOrder: number
}

function mapMaterialRow(row: MaterialRow): MaterialItem {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    fileUrl: row.file_url,
    externalUrl: row.external_url,
    published: Boolean(row.published),
    displayOrder: row.display_order ?? 0
  }
}

function mapSeedMaterial(m: SeedMaterialItem): MaterialItem {
  return { ...m }
}

export async function listPublishedMaterials(category?: string | null): Promise<MaterialItem[]> {
  try {
    const rows = await db.findMany(materials, {
      where: { published: true },
      orderBy: ["display_order", "asc"]
    })
    const items = rows.length > 0 ? rows.map(mapMaterialRow) : SEED_MATERIALS.map(mapSeedMaterial)
    return category && category !== "ALL" ? items.filter((m) => m.category === category) : items
  } catch {
    const items = SEED_MATERIALS.filter((m) => m.published).map(mapSeedMaterial)
    return category && category !== "ALL" ? items.filter((m) => m.category === category) : items
  }
}

export async function listAllMaterials(): Promise<MaterialItem[]> {
  try {
    const rows = await db.findMany(materials, {
      orderBy: ["display_order", "asc"]
    })
    return rows.length > 0 ? rows.map(mapMaterialRow) : SEED_MATERIALS.map(mapSeedMaterial)
  } catch {
    return SEED_MATERIALS.map(mapSeedMaterial)
  }
}

export async function createMaterial(input: {
  title: string
  category: string
  description: string
  fileUrl: string
  externalUrl: string
}): Promise<void> {
  const now = new Date()
  await db.create(materials, {
    id: `mat-${crypto.randomUUID().slice(0, 8)}`,
    title: input.title,
    category: input.category,
    description: input.description,
    file_url: input.fileUrl,
    external_url: input.externalUrl,
    published: true,
    display_order: 50,
    created_at: now,
    updated_at: now
  })
}

export async function deleteMaterial(id: string): Promise<void> {
  await db.delete(materials, id)
}
