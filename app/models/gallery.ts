import crypto from "node:crypto"
import { db } from "~/app/initializers/database"
import { SEED_GALLERY, type SeedGalleryItem } from "~/config/courses"
import { galleryItems, type GalleryRow } from "~/database/schema"

export interface GalleryItem {
  id: string
  title: string
  description: string
  category: string
  image: string
  videoUrl: string | null
  displayOrder: number
}

function mapGalleryRow(row: GalleryRow): GalleryItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    image: row.image,
    videoUrl: row.video_url ?? null,
    displayOrder: row.display_order ?? 0
  }
}

function mapSeedGallery(g: SeedGalleryItem): GalleryItem {
  return {
    id: g.id,
    title: g.title,
    description: g.description,
    category: g.category,
    image: g.image,
    videoUrl: null,
    displayOrder: g.displayOrder
  }
}

export async function listGalleryItems(category?: string | null): Promise<GalleryItem[]> {
  try {
    const rows = await db.findMany(galleryItems, {
      orderBy: ["display_order", "asc"]
    })
    const items = rows.length > 0 ? rows.map(mapGalleryRow) : SEED_GALLERY.map(mapSeedGallery)
    return category && category !== "ALL" ? items.filter((g) => g.category === category) : items
  } catch {
    const items = SEED_GALLERY.map(mapSeedGallery)
    return category && category !== "ALL" ? items.filter((g) => g.category === category) : items
  }
}

export async function createGalleryItem(input: {
  title: string
  category: string
  description: string
  image: string
}): Promise<void> {
  await db.create(galleryItems, {
    id: `gal-${crypto.randomUUID().slice(0, 8)}`,
    title: input.title,
    category: input.category,
    description: input.description,
    image: input.image,
    video_url: null,
    display_order: 50,
    created_at: new Date()
  })
}

export async function deleteGalleryItem(id: string): Promise<void> {
  await db.delete(galleryItems, id)
}
