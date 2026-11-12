import { createController } from "remix/router"
import {
  renderEntityTemplatePage,
  renderPublicNotFound,
  renderStaticCmsSlug
} from "~/app/http/controllers/public/cms-responder"
import { buildCourseSchema } from "~/app/initializers/seo"
import { findCourseBySlug } from "~/app/models/courses"
import { routes } from "~/routes"

export default createController(routes.courses, {
  actions: {
    async index(ctx) {
      return renderStaticCmsSlug(ctx, "/courses", { includeOrgSchema: false })
    },

    async show(ctx) {
      const slug = ctx.params.slug
      const course = await findCourseBySlug(slug)

      if (!course) {
        return renderPublicNotFound(ctx, {
          title: "Course Not Found | PAART Academy",
          heading: "Programme Not Found",
          message: "The requested coaching programme could not be found or is currently inactive.",
          ctaLabel: "Browse All Courses",
          ctaHref: routes.courses.index.href()
        })
      }

      return renderEntityTemplatePage(ctx, "template:course-detail", {
        titleOverride: `${course.title} Coaching in Puliyangudi | PAART Academy`,
        descriptionOverride: course.shortDescription,
        canonicalPathOverride: `/courses/${course.slug}`,
        includeOrgSchema: false,
        extraSchemas: [buildCourseSchema(course)],
        boundCourse: course
      })
    }
  }
})
