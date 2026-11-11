import type { Handle } from "remix/component"
import {
  ArrowRightIcon,
  CircleCheckIcon,
  ClockIcon,
  GraduationCapIcon,
  PhoneIcon
} from "@sdxc/icons"
import * as u from "@sdxc/u"
import { Badge, LinkButton, Text } from "@sdxc/ui"
import type { AdminUser } from "~/app/initializers/auth"
import type { CourseItem } from "~/app/models/courses"
import type { SiteSettings } from "~/app/models/settings"
import {
  acadCampusCaption,
  acadCampusFrame,
  acadCard,
  AcademicCalloutBand,
  AcademicPageBanner,
  AcademicSection,
  AcademicSectionHeader,
  acadSerif
} from "~/resources/components/academic-ui"
import { LandingLayout } from "~/resources/layouts/landing"
import { routes } from "~/routes"

export interface CourseShowPageProps {
  user?: AdminUser | null
  settings: SiteSettings
  course: CourseItem
}

export function CourseShowPage(handle: Handle<CourseShowPageProps>) {
  return () => {
    const { user, settings, course } = handle.props
    const details = course.details

    return (
      <LandingLayout user={user} settings={settings}>
        <AcademicPageBanner
          rubric={`${course.category} Coaching Programme`}
          title={course.title}
          description={details?.overview ?? course.shortDescription}
          breadcrumbs={[
            { label: "Courses", href: routes.courses.index.href() },
            { label: course.title }
          ]}
        />

        <AcademicSection>
          <div
            mix={[
              u.grid(),
              u.gap(8),
              u.items("start"),
              u.media("(min-width: 56rem)", u.raw({ gridTemplateColumns: "1.18fr 0.82fr" }))
            ]}
          >
            <div mix={[u.vstack({ gap: 4.5 })]}>
              <div mix={[u.hstack({ gap: 2, align: "center" }), u.flexWrap("wrap")]}>
                <Badge color="brand" variant="default">
                  {course.category}
                </Badge>
                {course.examStages.map((stage) => (
                  <Badge key={stage} color="neutral" variant="outline">
                    Stage: {stage}
                  </Badge>
                ))}
              </div>

              <div
                mix={[
                  u.grid(),
                  u.gap(3.5),
                  u.media(
                    "(min-width: 36rem)",
                    u.raw({ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" })
                  )
                ]}
              >
                <div mix={[acadCard(), u.hstack({ gap: 3, align: "start" }), u.p(4)]}>
                  <ClockIcon
                    size={18}
                    mix={[u.fg("var(--acad-primary)"), u.shrink(0), u.mbs(0.5)]}
                  />
                  <div mix={[u.vstack({ gap: 0.5 })]}>
                    <span mix={[u.fontSize("xs"), u.fg("var(--acad-muted)")]}>
                      Batch Duration &amp; Schedule
                    </span>
                    <span mix={[u.fontSize("sm"), u.weight("bold"), u.fg("var(--acad-ink)")]}>
                      {course.duration}
                    </span>
                  </div>
                </div>

                <div mix={[acadCard(), u.hstack({ gap: 3, align: "start" }), u.p(4)]}>
                  <GraduationCapIcon
                    size={18}
                    mix={[u.fg("var(--acad-primary)"), u.shrink(0), u.mbs(0.5)]}
                  />
                  <div mix={[u.vstack({ gap: 0.5 })]}>
                    <span mix={[u.fontSize("xs"), u.fg("var(--acad-muted)")]}>
                      Educational Eligibility
                    </span>
                    <span mix={[u.fontSize("sm"), u.weight("bold"), u.fg("var(--acad-ink)")]}>
                      {course.eligibility}
                    </span>
                  </div>
                </div>
              </div>

              {course.features.length > 0 && (
                <div mix={[acadCard(), u.p(5), u.vstack({ gap: 3 })]}>
                  <h2 mix={[acadSerif(), u.fontSize("lg"), u.weight("bold"), u.m(0)]}>
                    Programme Highlights
                  </h2>
                  <div
                    mix={[
                      u.grid(),
                      u.gap(2.5),
                      u.media(
                        "(min-width: 36rem)",
                        u.raw({ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" })
                      )
                    ]}
                  >
                    {course.features.map((feat) => (
                      <div key={feat} mix={[u.hstack({ gap: 2, align: "center" })]}>
                        <CircleCheckIcon
                          size={15}
                          mix={[u.fg("var(--acad-primary)"), u.shrink(0)]}
                        />
                        <span mix={[u.fontSize("sm"), u.weight("medium")]}>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div mix={[u.hstack({ gap: 3 }), u.flexWrap("wrap"), u.pbs(1)]}>
                <LinkButton
                  href={`${routes.admissions.apply.href()}?course=${encodeURIComponent(course.title)}`}
                  color="brand"
                  variant="solid"
                >
                  <span>Apply for {course.title}</span>
                  <ArrowRightIcon size={16} />
                </LinkButton>
                <LinkButton
                  href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                  color="neutral"
                  variant="outline"
                >
                  <PhoneIcon size={15} />
                  <span>Call Coordinator: {settings.phone}</span>
                </LinkButton>
              </div>
            </div>

            <div mix={[acadCampusFrame()]}>
              <img
                src={course.image}
                alt={course.title}
                mix={[u.width("full"), u.height(68), u.fit("cover"), u.block()]}
              />
              <div mix={[acadCampusCaption()]}>
                <p mix={[u.fontSize("xs"), u.weight("bold"), u.m(0)]}>
                  Classroom &amp; Test Series Batch — Puliyangudi Campus
                </p>
                <p mix={[u.fontSize("xs"), u.fg("var(--acad-muted)"), u.m(0), u.mbs(1)]}>
                  Bilingual Tamil &amp; English study materials, OMR practice, and individual score
                  mentoring included.
                </p>
              </div>
            </div>
          </div>
        </AcademicSection>

        {/* Detailed Curriculum & Support Breakdown */}
        {details && (
          <AcademicSection tone="paper">
            <AcademicSectionHeader
              rubric="Syllabus & Teaching Plan"
              title="Curriculum Structure &amp; Student Support"
            />

            <div
              mix={[
                u.grid(),
                u.gap(5),
                u.media(
                  "(min-width: 52rem)",
                  u.raw({ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" })
                )
              ]}
            >
              {[
                { title: "Syllabus & Key Subject Areas", body: details.keyAreas },
                { title: "Preparation Focus", body: details.preparationFocus },
                { title: "Academic Support & Test Series", body: details.support },
                {
                  title: "Who Should Join & Learning Outcome",
                  body: `${details.whoCanJoin} ${details.outcome}`
                }
              ].map((sec) => (
                <div key={sec.title} mix={[acadCard(), u.vstack({ gap: 2.5 }), u.p(6)]}>
                  <div mix={[u.hstack({ gap: 2, align: "center" })]}>
                    <CircleCheckIcon size={18} mix={[u.fg("var(--acad-primary)")]} />
                    <h3 mix={[acadSerif(), u.fontSize("lg"), u.weight("bold"), u.m(0)]}>
                      {sec.title}
                    </h3>
                  </div>
                  <Text
                    mix={[
                      u.fontSize("sm"),
                      u.leading("relaxed"),
                      u.fg("var(--acad-muted)"),
                      u.m(0)
                    ]}
                  >
                    {sec.body}
                  </Text>
                </div>
              ))}
            </div>
          </AcademicSection>
        )}

        <AcademicCalloutBand
          title={`Register for ${course.title}`}
          description="Submit your admission registration online or visit our Puliyangudi office for batch counselling."
          settings={settings}
        />
      </LandingLayout>
    )
  }
}
