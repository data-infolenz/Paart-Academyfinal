import crypto from "node:crypto"
import { db } from "~/app/initializers/database"
import { SEED_BLOGS, type SeedBlogItem } from "~/config/courses"
import { type BlogRow, blogs } from "~/database/schema"

export interface BlogItem {
  id: string
  slug: string
  title: string
  shortDescription: string
  content: string
  author: string
  publishedDate: string
  category: string
  featuredImage: string
  seoTitle: string
  metaDescription: string
  published: boolean
}

function mapBlogRow(row: BlogRow): BlogItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.short_description,
    content: row.content,
    author: row.author,
    publishedDate: row.published_date,
    category: row.category,
    featuredImage: row.featured_image || "/images/classroom-1.jpg",
    seoTitle: row.seo_title || row.title,
    metaDescription: row.meta_description || row.short_description,
    published: Boolean(row.published)
  }
}

function mapSeedBlog(b: SeedBlogItem): BlogItem {
  return { ...b }
}

export async function listPublishedBlogs(): Promise<BlogItem[]> {
  try {
    const rows = await db.findMany(blogs, {
      where: { published: true },
      orderBy: ["published_date", "desc"]
    })
    return rows.length > 0 ? rows.map(mapBlogRow) : SEED_BLOGS.map(mapSeedBlog)
  } catch {
    return SEED_BLOGS.filter((b) => b.published).map(mapSeedBlog)
  }
}

export async function listAllBlogs(): Promise<BlogItem[]> {
  try {
    const rows = await db.findMany(blogs, {
      orderBy: ["published_date", "desc"]
    })
    return rows.length > 0 ? rows.map(mapBlogRow) : SEED_BLOGS.map(mapSeedBlog)
  } catch {
    return SEED_BLOGS.map(mapSeedBlog)
  }
}

export async function findBlogBySlug(slug: string): Promise<BlogItem | null> {
  try {
    const row = await db.findOne(blogs, { where: { slug } })
    if (row) return row.published ? mapBlogRow(row) : null
  } catch {
    // fallback to seed blogs
  }
  const fallback = SEED_BLOGS.find((b) => b.slug === slug && b.published)
  return fallback ? mapSeedBlog(fallback) : null
}

export async function createBlog(input: {
  slug: string
  title: string
  category: string
  shortDescription: string
  content: string
  featuredImage: string
}): Promise<void> {
  const now = new Date()
  await db.create(blogs, {
    id: `blog-${crypto.randomUUID().slice(0, 8)}`,
    slug: input.slug,
    title: input.title,
    category: input.category,
    short_description: input.shortDescription,
    content: input.content,
    author: "PAART Academic Team",
    published_date: now.toISOString().slice(0, 10),
    featured_image: input.featuredImage || "/images/classroom-1.jpg",
    seo_title: `${input.title} | PAART Academy`,
    meta_description: input.shortDescription,
    published: true,
    created_at: now,
    updated_at: now
  })
}

export async function toggleBlogPublished(id: string): Promise<void> {
  const existing = await db.find(blogs, id)
  if (!existing) return
  await db.update(blogs, id, {
    published: !existing.published,
    updated_at: new Date()
  })
}

export async function deleteBlog(id: string): Promise<void> {
  await db.delete(blogs, id)
}
