import type { Handle } from "remix/component"
import * as u from "@sdxc/u"
import { HeadingScope, LinkButton, Text } from "@sdxc/ui"
import { LandingHeader, LandingSection } from "@sdxc/ui/landing"
import type { AdminUser } from "~/app/initializers/auth"
import type { CourseItem } from "~/app/models/courses"
import type { SiteSettings } from "~/app/models/settings"
import { COURSE_CATEGORIES } from "~/config/courses"
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
        <LandingSection variant="frame" ruled>
          <HeadingScope level={1}>
            <LandingHeader
              eyebrow="Academic Programmes"
              eyebrowVariant="pill"
              description="Structured classroom coaching, bilingual study materials, daily topic drills, and full-length mock examinations."
            >
              Competitive Examination Courses
            </LandingHeader>

            {/* Clean Category Filter Strip */}
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
              <div
                mix={[
                  u.p(8),
                  u.rounded("xl"),
                  u.border({ width: 1, color: "neutral" }),
                  u.bg("var(--ui-surface, var(--ui-bg))"),
                  u.textAlign("center")
                ]}
              >
                <Text mix={[u.fg("neutral.muted"), u.m(0)]}>
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
          </HeadingScope>
        </LandingSection>
      </LandingLayout>
    )
  }
}
