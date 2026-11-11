import type { Handle } from "remix/component"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CircleCheckIcon,
  ClockIcon,
  GraduationCapIcon,
  PhoneIcon
} from "@sdxc/icons"
import * as u from "@sdxc/u"
import { Badge, Heading, HeadingScope, Link, LinkButton, Text } from "@sdxc/ui"
import { LandingSection } from "@sdxc/ui/landing"
import { landingCtaChrome } from "@sdxc/ui/styles"
import type { AdminUser } from "~/app/initializers/auth"
import type { CourseItem } from "~/app/models/courses"
import type { SiteSettings } from "~/app/models/settings"
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
        <LandingSection variant="frame" ruled>
          <HeadingScope level={1}>
            <div mix={[u.vstack({ gap: 6 })]}>
              <Link
                href={routes.courses.index.href()}
                mix={[
                  u.hstack({ gap: 1.5, align: "center" }),
                  u.fontSize("sm"),
                  u.weight("medium"),
                  u.fg("neutral.muted"),
                  u.textDecoration("none")
                ]}
              >
                <ArrowLeftIcon size={15} />
                <span>Back to All Courses</span>
              </Link>

              <div
                mix={[
                  u.grid(),
                  u.gap(8),
                  u.items("center"),
                  u.media("(min-width: 56rem)", u.raw({ gridTemplateColumns: "1.2fr 0.8fr" }))
                ]}
              >
                <div mix={[u.vstack({ gap: 4 })]}>
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

                  <Heading level={1} mix={[u.fontSize("3xl"), u.weight("bold"), u.m(0)]}>
                    {course.title}
                  </Heading>

                  <Text mix={[u.fontSize("base"), u.fg("neutral.muted"), u.m(0)]}>
                    {details?.overview ?? course.shortDescription}
                  </Text>

                  <div
                    mix={[
                      u.grid(),
                      u.gap(3),
                      u.media(
                        "(min-width: 36rem)",
                        u.raw({ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" })
                      ),
                      u.pbs(2)
                    ]}
                  >
                    <div
                      mix={[
                        u.hstack({ gap: 2.5, align: "start" }),
                        u.p(3.5),
                        u.rounded("lg"),
                        u.border({ width: 1, color: "neutral" }),
                        u.bg("surface.raised")
                      ]}
                    >
                      <ClockIcon size={17} mix={[u.fg("brand"), u.shrink(0), u.mbs(0.5)]} />
                      <div mix={[u.vstack({ gap: 0.5 })]}>
                        <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                          Batch Duration
                        </Text>
                        <Text mix={[u.fontSize("sm"), u.weight("semibold"), u.m(0)]}>
                          {course.duration}
                        </Text>
                      </div>
                    </div>

                    <div
                      mix={[
                        u.hstack({ gap: 2.5, align: "start" }),
                        u.p(3.5),
                        u.rounded("lg"),
                        u.border({ width: 1, color: "neutral" }),
                        u.bg("surface.raised")
                      ]}
                    >
                      <GraduationCapIcon size={17} mix={[u.fg("brand"), u.shrink(0), u.mbs(0.5)]} />
                      <div mix={[u.vstack({ gap: 0.5 })]}>
                        <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                          Eligibility
                        </Text>
                        <Text mix={[u.fontSize("sm"), u.weight("semibold"), u.m(0)]}>
                          {course.eligibility}
                        </Text>
                      </div>
                    </div>
                  </div>

                  <div mix={[u.hstack({ gap: 3 }), u.flexWrap("wrap"), u.pbs(2)]}>
                    <LinkButton
                      href={`${routes.admissions.apply.href()}?course=${encodeURIComponent(course.title)}`}
                      color="brand"
                      variant="solid"
                      mix={[landingCtaChrome()]}
                    >
                      <span>Apply for {course.title}</span>
                      <ArrowRightIcon size={16} />
                    </LinkButton>
                    <LinkButton
                      href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                      color="neutral"
                      variant="outline"
                      mix={[landingCtaChrome()]}
                    >
                      <PhoneIcon size={15} />
                      <span>Call Coordinator</span>
                    </LinkButton>
                  </div>
                </div>

                <div
                  mix={[
                    u.rounded("xl"),
                    u.overflow("hidden"),
                    u.border({ width: 1, color: "neutral" }),
                    u.bg("var(--ui-surface, var(--ui-bg))")
                  ]}
                >
                  <img
                    src={course.image}
                    alt={course.title}
                    mix={[u.width("full"), u.height(72), u.fit("cover"), u.block()]}
                  />
                </div>
              </div>
            </div>
          </HeadingScope>
        </LandingSection>

        {/* Detailed Curriculum & Support Breakdown */}
        {details && (
          <LandingSection variant="frame" tone="tinted" ruled>
            <HeadingScope level={2}>
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
                  <div
                    key={sec.title}
                    mix={[
                      u.vstack({ gap: 2.5 }),
                      u.p(6),
                      u.rounded("xl"),
                      u.border({ width: 1, color: "neutral" }),
                      u.bg("var(--ui-surface, var(--ui-bg))")
                    ]}
                  >
                    <div mix={[u.hstack({ gap: 2, align: "center" })]}>
                      <CircleCheckIcon size={18} mix={[u.fg("brand")]} />
                      <Heading level={2} mix={[u.fontSize("lg"), u.weight("semibold"), u.m(0)]}>
                        {sec.title}
                      </Heading>
                    </div>
                    <Text mix={[u.fontSize("sm"), u.fg("neutral.muted"), u.m(0)]}>{sec.body}</Text>
                  </div>
                ))}
              </div>
            </HeadingScope>
          </LandingSection>
        )}
      </LandingLayout>
    )
  }
}
