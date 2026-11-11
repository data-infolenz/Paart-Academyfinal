import * as u from "@sdxc/u"
import { Heading, LinkButton, Text } from "@sdxc/ui"
import { LandingSection } from "@sdxc/ui/landing"
import { createController } from "remix/router"
import { buildCourseSchema } from "~/app/initializers/seo"
import { findCourseBySlug, listActiveCourses } from "~/app/models/courses"
import { getSiteSettings } from "~/app/models/settings"
import { Document } from "~/resources/layouts/document"
import { LandingLayout } from "~/resources/layouts/landing"
import { CoursesIndexPage } from "~/resources/views/courses/index-page"
import { CourseShowPage } from "~/resources/views/courses/show-page"
import { routes } from "~/routes"

export default createController(routes.courses, {
  actions: {
    async index(ctx) {
      const url = new URL(ctx.request.url)
      const category = url.searchParams.get("category") || "ALL"
      const [settings, courses] = await Promise.all([
        getSiteSettings(),
        listActiveCourses(category)
      ])

      return ctx.render(
        <Document
          title="Competitive Exam Coaching Courses (TNPSC, TNUSRB, TET, SSC, RRB) | PAART Academy"
          description="Explore structured classroom coaching programmes at PAART Academy Puliyangudi for TNPSC Group 1/2/4, TNUSRB Police SI/PC, TET/TRB, SSC, Banking, and Railways."
          assets={ctx.assets}
        >
          <CoursesIndexPage
            user={ctx.user}
            settings={settings}
            courses={courses}
            activeCategory={category}
          />
        </Document>
      )
    },

    async show(ctx) {
      const slug = ctx.params.slug
      const [settings, course] = await Promise.all([getSiteSettings(), findCourseBySlug(slug)])

      if (!course) {
        return ctx.render(
          <Document title="Course Not Found | PAART Academy" assets={ctx.assets}>
            <LandingLayout user={ctx.user} settings={settings}>
              <LandingSection variant="frame" ruled>
                <div mix={[u.vstack({ gap: 4, align: "center" }), u.pb(12), u.textAlign("center")]}>
                  <Heading level={1} mix={[u.fontSize("2xl"), u.weight("bold"), u.m(0)]}>
                    Programme Not Found
                  </Heading>
                  <Text mix={[u.fontSize("sm"), u.fg("neutral.muted"), u.m(0)]}>
                    The requested coaching programme could not be found or is currently inactive.
                  </Text>
                  <LinkButton href={routes.courses.index.href()} color="brand" variant="solid">
                    Browse All Courses
                  </LinkButton>
                </div>
              </LandingSection>
            </LandingLayout>
          </Document>,
          { status: 404 }
        )
      }

      return ctx.render(
        <Document
          title={`${course.title} Coaching in Puliyangudi | PAART Academy`}
          description={course.shortDescription}
          schema={buildCourseSchema(course)}
          assets={ctx.assets}
        >
          <CourseShowPage user={ctx.user} settings={settings} course={course} />
        </Document>
      )
    }
  }
})
