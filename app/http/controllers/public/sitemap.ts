import { fromRoutes, type Decisions } from "@sdxc/sitemap/remix"
import type { AppContext } from "~/app/initializers/router"
import { listPublishedBlogs } from "~/app/models/blogs"
import { listPublishedIndexablePages } from "~/app/models/cms"
import { RESERVED_EXACT_SLUGS } from "~/app/models/cms-schemas"
import { listActiveCourses } from "~/app/models/courses"
import { routes, type Routes } from "~/routes"

export async function sitemapAction(ctx: AppContext): Promise<Response> {
  const origin = new URL(ctx.request.url).origin
  const [courses, blogs, indexablePages] = await Promise.all([
    listActiveCourses(),
    listPublishedBlogs(),
    listPublishedIndexablePages()
  ])

  const indexableSlugs = new Set(indexablePages.map((p) => p.slug))
  const customCampaignPages = indexablePages.filter((p) => !RESERVED_EXACT_SLUGS.has(p.slug))

  const decisions: Decisions<Routes> = {
    home: indexableSlugs.has("/") ? { priority: 1.0, frequency: "daily" } : false,
    about: indexableSlugs.has("/about") ? { priority: 0.9, frequency: "monthly" } : false,
    materials: indexableSlugs.has("/materials") ? { priority: 0.8, frequency: "weekly" } : false,
    gallery: indexableSlugs.has("/gallery") ? { priority: 0.7, frequency: "weekly" } : false,
    faq: indexableSlugs.has("/faq") ? { priority: 0.8, frequency: "monthly" } : false,
    contact: indexableSlugs.has("/contact") ? { priority: 0.8, frequency: "monthly" } : false,
    sitemap: false,
    llms: false,
    healthz: false,
    readyz: false,
    courses: {
      index: indexableSlugs.has("/courses") ? { priority: 0.9, frequency: "weekly" } : false,
      show: courses.map((c) => ({
        params: { slug: c.slug },
        priority: 0.8,
        frequency: "weekly"
      }))
    },
    blogs: {
      index: indexableSlugs.has("/blogs") ? { priority: 0.8, frequency: "weekly" } : false,
      show: blogs.map((b) => ({
        params: { slug: b.slug },
        priority: 0.7,
        frequency: "monthly"
      }))
    },
    admissions: {
      apply: indexableSlugs.has("/admissions") ? { priority: 0.9, frequency: "monthly" } : false,
      success: false
    },
    auth: false,
    admin: false,
    faculty: false,
    portal: false,
    campaign: {
      show: customCampaignPages.map((p) => ({
        params: { slug: p.slug.replace(/^\/+/, "") },
        priority: 0.75,
        frequency: "weekly"
      }))
    }
  }

  const sitemap = fromRoutes(routes, origin, decisions)
  return new Response(sitemap.toString(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400"
    }
  })
}

export default sitemapAction
