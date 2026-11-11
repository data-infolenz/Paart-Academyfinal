import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"
import { closeDatabase, getDatabase } from "~/app/initializers/database"
import { appConfig } from "~/config/app"
import { SEED_BLOGS, SEED_COURSES, SEED_GALLERY, SEED_MATERIALS } from "~/config/courses"
import { TRUST_PROFILE } from "~/config/trust"
import { blogs, courses, galleryItems, materials, siteSettings } from "./schema"

export async function seedDatabase(): Promise<void> {
  const db = getDatabase()
  const now = new Date()

  for (const c of SEED_COURSES) {
    const existing = await db.find(courses, c.id)
    if (!existing) {
      await db.create(courses, {
        id: c.id,
        slug: c.slug,
        title: c.title,
        category: c.category,
        short_description: c.shortDescription,
        duration: c.duration,
        eligibility: c.eligibility,
        image: c.image,
        features: c.features,
        exam_stages: c.examStages,
        details: c.details,
        enabled: c.enabled,
        display_order: c.displayOrder,
        created_at: now,
        updated_at: now
      })
    }
  }

  for (const m of SEED_MATERIALS) {
    const existing = await db.find(materials, m.id)
    if (!existing) {
      await db.create(materials, {
        id: m.id,
        title: m.title,
        category: m.category,
        description: m.description,
        file_url: m.fileUrl,
        external_url: m.externalUrl,
        published: m.published,
        display_order: m.displayOrder,
        created_at: now,
        updated_at: now
      })
    }
  }

  for (const b of SEED_BLOGS) {
    const existing = await db.find(blogs, b.id)
    if (!existing) {
      await db.create(blogs, {
        id: b.id,
        slug: b.slug,
        title: b.title,
        short_description: b.shortDescription,
        content: b.content,
        author: b.author,
        published_date: b.publishedDate,
        category: b.category,
        featured_image: b.featuredImage,
        seo_title: b.seoTitle,
        meta_description: b.metaDescription,
        published: b.published,
        created_at: now,
        updated_at: now
      })
    }
  }

  for (const g of SEED_GALLERY) {
    const existing = await db.find(galleryItems, g.id)
    if (!existing) {
      await db.create(galleryItems, {
        id: g.id,
        title: g.title,
        description: g.description,
        category: g.category,
        image: g.image,
        video_url: null,
        display_order: g.displayOrder,
        created_at: now
      })
    }
  }

  const existingSettings = await db.find(siteSettings, "default")
  if (!existingSettings) {
    await db.create(siteSettings, {
      id: "default",
      site_name: TRUST_PROFILE.shortName,
      phone: TRUST_PROFILE.phone,
      whatsapp: TRUST_PROFILE.whatsapp,
      email: TRUST_PROFILE.email,
      address_primary: TRUST_PROFILE.addressPrimary,
      address_secondary: TRUST_PROFILE.addressSecondary,
      hours: TRUST_PROFILE.hours,
      seo_title: "PAART Academy | TNPSC, TNUSRB & Competitive Exam Coaching in Puliyangudi",
      seo_description: TRUST_PROFILE.summary,
      canonical_url: appConfig.PAART_PUBLIC_URL,
      updated_at: now
    })
  }
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMain) {
  let exitCode = 0
  try {
    console.log("[PAART DB] Seeding PostgreSQL database...")
    await seedDatabase()
    console.log("[PAART DB] Seed completed successfully.")
  } catch (error) {
    console.error("[PAART DB] Seed failed:", error)
    exitCode = 1
  } finally {
    await closeDatabase().catch(() => {})
  }
  if (exitCode !== 0) {
    process.exit(exitCode)
  }
}
