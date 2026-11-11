import { fromRoutes, type Decisions } from "@sdxc/sitemap/remix"
import type { AppContext } from "~/app/initializers/router"
import { listPublishedBlogs } from "~/app/models/blogs"
import { listActiveCourses } from "~/app/models/courses"
import { routes, type Routes } from "~/routes"

export async function sitemapAction(ctx: AppContext): Promise<Response> {
  const origin = new URL(ctx.request.url).origin
  const [courses, blogs] = await Promise.all([listActiveCourses(), listPublishedBlogs()])

  const decisions: Decisions<Routes> = {
    home: { priority: 1.0, frequency: "daily" },
    about: { priority: 0.9, frequency: "monthly" },
    materials: { priority: 0.8, frequency: "weekly" },
    gallery: { priority: 0.7, frequency: "weekly" },
    faq: { priority: 0.8, frequency: "monthly" },
    contact: { priority: 0.8, frequency: "monthly" },
    sitemap: false,
    llms: false,
    healthz: false,
    readyz: false,
    courses: {
      index: { priority: 0.9, frequency: "weekly" },
      show: courses.map((c) => ({
        params: { slug: c.slug },
        priority: 0.8,
        frequency: "weekly"
      }))
    },
    blogs: {
      index: { priority: 0.8, frequency: "weekly" },
      show: blogs.map((b) => ({
        params: { slug: b.slug },
        priority: 0.7,
        frequency: "monthly"
      }))
    },
    admissions: {
      apply: { priority: 0.9, frequency: "monthly" },
      success: false
    },
    auth: false,
    admin: false
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
