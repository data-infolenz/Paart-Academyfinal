import { currentLog } from "@sdxc/logger"
import type { SessionUser } from "~/app/initializers/auth"
import { evaluateBlockVisibility } from "~/app/initializers/cms-render"
import { issueHoneypotFields } from "~/app/initializers/honeypot"
import type { FaqItem } from "~/config/faqs"
import { type BlogItem, listPublishedBlogs } from "./blogs"
import { type PageBlock, parsePageBlocksSafe } from "./cms-schemas"
import { type CourseItem, listActiveCourses } from "./courses"
import { type GalleryItem, listGalleryItems } from "./gallery"
import { listPublishedMaterials, type MaterialItem } from "./materials"

export interface HydratedCollections {
  courses: CourseItem[]
  materials: MaterialItem[]
  blogs: BlogItem[]
  gallery: GalleryItem[]
  honeypotFields?: Record<string, string>
}

export interface HydratorLoaders {
  loadCourses?: () => Promise<CourseItem[]>
  loadMaterials?: () => Promise<MaterialItem[]>
  loadBlogs?: () => Promise<BlogItem[]>
  loadGallery?: () => Promise<GalleryItem[]>
  loadHoneypot?: () => Promise<Record<string, string>>
}

export interface HydrateBlocksOptions {
  pageSlug?: string
  user?: SessionUser | null
  now?: Date
  activeCategoryQuery?: string
  selectedCourseQuery?: string
  formSubmitted?: boolean
  formError?: string | null
  formValues?: Record<string, string>
  boundCourse?: CourseItem | null
  boundBlog?: BlogItem | null
  loaders?: HydratorLoaders
}

export interface HydratedPageResult {
  activeBlocks: PageBlock[]
  skippedCount: number
  collections: HydratedCollections
  faqItems: FaqItem[]
  requestState: {
    activeCategory: string
    selectedCourse: string
    formSubmitted: boolean
    formError: string | null
    formValues: Record<string, string>
    boundCourse: CourseItem | null
    boundBlog: BlogItem | null
  }
}

export async function hydratePageBlocks(
  rawBlocks: unknown,
  options: HydrateBlocksOptions = {}
): Promise<HydratedPageResult> {
  const summary = parsePageBlocksSafe(rawBlocks)
  if (summary.skippedCount > 0) {
    currentLog()?.warn("cms.block_skipped", {
      pageSlug: options.pageSlug ?? "unknown",
      skippedCount: summary.skippedCount,
      firstBlockId: summary.issues[0]?.blockId ?? "unknown"
    })
  }

  const activeBlocks = summary.validBlocks.filter(
    (block) =>
      block.enabled &&
      evaluateBlockVisibility(block.visibilityRule, {
        user: options.user,
        now: options.now
      })
  )

  let needsCourses = false
  let needsMaterials = false
  let needsBlogs = false
  let needsGallery = false
  let needsHoneypot = false
  const faqItems: FaqItem[] = []

  for (const block of activeBlocks) {
    switch (block.type) {
      case "course_catalog":
        needsCourses = true
        break
      case "materials_catalog":
        needsMaterials = true
        if (block.data.layout === "split_with_blogs") {
          needsBlogs = true
        }
        break
      case "blog_feed":
        needsBlogs = true
        break
      case "gallery_showcase":
        needsGallery = true
        break
      case "contact_hub":
      case "admission_form":
        needsCourses = true
        needsHoneypot = true
        break
      case "faq_accordion":
        for (const cat of block.data.categories) {
          for (const item of cat.items) {
            faqItems.push({ question: item.question, answer: item.answer })
          }
        }
        break
      default:
        break
    }
  }

  const loadCourses = options.loaders?.loadCourses ?? (() => listActiveCourses())
  const loadMaterials = options.loaders?.loadMaterials ?? (() => listPublishedMaterials())
  const loadBlogs = options.loaders?.loadBlogs ?? (() => listPublishedBlogs())
  const loadGallery = options.loaders?.loadGallery ?? (() => listGalleryItems())
  const loadHoneypot = options.loaders?.loadHoneypot ?? (() => issueHoneypotFields())

  const [courses, materials, blogs, gallery, honeypotFields] = await Promise.all([
    needsCourses ? loadCourses() : Promise.resolve([]),
    needsMaterials ? loadMaterials() : Promise.resolve([]),
    needsBlogs ? loadBlogs() : Promise.resolve([]),
    needsGallery ? loadGallery() : Promise.resolve([]),
    needsHoneypot ? loadHoneypot() : Promise.resolve(undefined)
  ])

  // Extra defense-in-depth: never expose enrolled-only materials on public block pages
  const safePublicMaterials = materials.filter((m) => m.visibility === "public" && m.published)

  return {
    activeBlocks,
    skippedCount: summary.skippedCount,
    collections: {
      courses,
      materials: safePublicMaterials,
      blogs,
      gallery,
      honeypotFields
    },
    faqItems,
    requestState: {
      activeCategory: options.activeCategoryQuery || "ALL",
      selectedCourse: options.selectedCourseQuery || "",
      formSubmitted: Boolean(options.formSubmitted),
      formError: options.formError ?? null,
      formValues: options.formValues ?? {},
      boundCourse: options.boundCourse ?? null,
      boundBlog: options.boundBlog ?? null
    }
  }
}
