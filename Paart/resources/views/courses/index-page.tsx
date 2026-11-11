import type { Handle } from "remix/component"
import * as u from "@sdxc/u"
import { LinkButton, Text } from "@sdxc/ui"
import type { AdminUser } from "~/app/initializers/auth"
import type { CourseItem } from "~/app/models/courses"
import type { SiteSettings } from "~/app/models/settings"
import { COURSE_CATEGORIES } from "~/config/courses"
import {
  acadCard,
  AcademicCalloutBand,
  AcademicPageBanner,
  AcademicSection
} from "~/resources/components/academic-ui"
import { CourseCard } from "~/resources/components/course-card"
import { LandingLayout } from "~/resources/layouts/landing"
import { routes } from "~/routes"

export interface CoursesIndexPageProps {
  user?: AdminUser | null
  settings: SiteSettings
  courses: CourseItem[]
  activeCategory: string
}

export function CoursesIndexPage(handle: Handle<CoursesIndexPageProps>) {
  return () => {
    const { user, settings, courses, activeCategory } = handle.props
    const categories = ["ALL", ...COURSE_CATEGORIES]

    return (
      <LandingLayout user={user} settings={settings}>
        <AcademicPageBanner
          rubric="Academic Prospectus"
          title="Competitive Examination Courses"
          description="Structured classroom coaching, bilingual Tamil & English study materials, daily topic drills, and full-length mock examinations."
          breadcrumbs={[{ label: "Courses" }]}
        />

        <AcademicSection>
          <div mix={[u.hstack({ gap: 2 }), u.flexWrap("wrap"), u.mbe(6)]}>
            {categories.map((cat) => {
              const isSelected = activeCategory === cat
              const href =
                cat === "ALL"
                  ? routes.courses.index.href()
                  : `${routes.courses.index.href()}?category=${encodeURIComponent(cat)}`
              return (
                <LinkButton
                  key={cat}
                  href={href}
                  size="sm"
                  color={isSelected ? "brand" : "neutral"}
                  variant={isSelected ? "solid" : "outline"}
                >
                  {cat === "ALL" ? "All Programmes" : cat}
                </LinkButton>
              )
            })}
          </div>

          {courses.length === 0 ? (
            <div mix={[acadCard(), u.p(8), u.textAlign("center")]}>
              <Text mix={[u.fg("var(--acad-muted)"), u.m(0)]}>
                No active courses found in this category.
              </Text>
            </div>
          ) : (
            <div
              mix={[
                u.grid(),
                u.gap(5),
                u.media(
                  "(min-width: 44rem)",
                  u.raw({ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" })
                ),
                u.media(
                  "(min-width: 68rem)",
                  u.raw({ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" })
                )
              ]}
            >
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </AcademicSection>

        <AcademicCalloutBand
          title="Need Help Choosing the Right Examination Batch?"
          description="Speak with our Puliyangudi faculty coordinators to match your educational qualification with upcoming notifications."
          settings={settings}
        />
      </LandingLayout>
    )
  }
}
