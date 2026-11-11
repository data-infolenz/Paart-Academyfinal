import crypto from "node:crypto"
import { db } from "~/app/initializers/database"
import {
  type CourseCategory,
  type CourseDetailSpec,
  SEED_COURSES,
  type SeedCourseItem
} from "~/config/courses"
import { type CourseRow, courses } from "~/database/schema"

export interface CourseItem {
  id: string
  slug: string
  title: string
  category: CourseCategory
  shortDescription: string
  duration: string
  eligibility: string
  image: string
  features: string[]
  examStages: string[]
  details: CourseDetailSpec | null
  enabled: boolean
  displayOrder: number
}

function mapCourseRow(row: CourseRow): CourseItem {
  const seedMatch = SEED_COURSES.find((s) => s.id === row.id || s.slug === row.slug)
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    shortDescription: row.short_description,
    duration: row.duration,
    eligibility: row.eligibility,
    image: row.image || "/images/course-exam-1.jpg",
    features: Array.isArray(row.features) ? row.features : [],
    examStages: Array.isArray(row.exam_stages) ? row.exam_stages : [],
    details: row.details ?? seedMatch?.details ?? null,
    enabled: Boolean(row.enabled),
    displayOrder: row.display_order ?? 0
  }
}

function mapSeedCourse(s: SeedCourseItem): CourseItem {
  return {
    id: s.id,
    slug: s.slug,
    title: s.title,
    category: s.category,
    shortDescription: s.shortDescription,
    duration: s.duration,
    eligibility: s.eligibility,
    image: s.image,
    features: s.features,
    examStages: s.examStages,
    details: s.details,
    enabled: s.enabled,
    displayOrder: s.displayOrder
  }
}

export async function listActiveCourses(category?: string | null): Promise<CourseItem[]> {
  try {
    const rows = await db.findMany(courses, {
      where: { enabled: true },
      orderBy: ["display_order", "asc"]
    })
    const items = rows.length > 0 ? rows.map(mapCourseRow) : SEED_COURSES.map(mapSeedCourse)
    return category && category !== "ALL" ? items.filter((c) => c.category === category) : items
  } catch {
    const items = SEED_COURSES.filter((c) => c.enabled).map(mapSeedCourse)
    return category && category !== "ALL" ? items.filter((c) => c.category === category) : items
  }
}

export async function listAllCourses(): Promise<CourseItem[]> {
  try {
    const rows = await db.findMany(courses, {
      orderBy: ["display_order", "asc"]
    })
    return rows.length > 0 ? rows.map(mapCourseRow) : SEED_COURSES.map(mapSeedCourse)
  } catch {
    return SEED_COURSES.map(mapSeedCourse)
  }
}

export async function findCourseBySlug(slug: string): Promise<CourseItem | null> {
  try {
    const row = await db.findOne(courses, { where: { slug } })
    if (row) return row.enabled ? mapCourseRow(row) : null
  } catch {
    // fallback to seed catalog if DB is offline
  }
  const fallback = SEED_COURSES.find((c) => c.slug === slug && c.enabled)
  return fallback ? mapSeedCourse(fallback) : null
}

export async function createCourse(input: {
  slug: string
  title: string
  category: CourseCategory
  shortDescription: string
  duration: string
  eligibility: string
  image: string
  features: string[]
  examStages: string[]
}): Promise<void> {
  const now = new Date()
  await db.create(courses, {
    id: `course-${crypto.randomUUID().slice(0, 8)}`,
    slug: input.slug,
    title: input.title,
    category: input.category,
    short_description: input.shortDescription,
    duration: input.duration,
    eligibility: input.eligibility,
    image: input.image || "/images/course-exam-1.jpg",
    features: input.features,
    exam_stages: input.examStages,
    details: null,
    enabled: true,
    display_order: 99,
    created_at: now,
    updated_at: now
  })
}

export async function toggleCourseEnabled(id: string): Promise<void> {
  const existing = await db.find(courses, id)
  if (!existing) return
  await db.update(courses, id, {
    enabled: !existing.enabled,
    updated_at: new Date()
  })
}

export async function deleteCourse(id: string): Promise<void> {
  await db.delete(courses, id)
}
