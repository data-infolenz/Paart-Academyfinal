import type { Handle } from "remix/component"
import { ArrowRightIcon, AwardIcon, CircleCheckIcon, ShieldCheckIcon } from "@sdxc/icons"
import * as u from "@sdxc/u"
import { Badge, Heading, HeadingScope, LinkButton, Text } from "@sdxc/ui"
import { ClosingCta, LandingHeader, LandingSection, StatStrip } from "@sdxc/ui/landing"
import { landingCtaChrome } from "@sdxc/ui/styles"
import type { AdminUser } from "~/app/initializers/auth"
import type { SiteSettings } from "~/app/models/settings"
import {
  DEPARTMENT_SELECTIONS,
  IMPACT_METRICS,
  STATE_RANK_HIGHLIGHTS,
  TRUST_INITIATIVES,
  TRUST_PROFILE,
  TRUST_VISION_MISSION
} from "~/config/trust"
import { LandingLayout } from "~/resources/layouts/landing"
import { routes } from "~/routes"

export interface AboutPageProps {
  user?: AdminUser | null
  settings: SiteSettings
}

export function AboutPage(handle: Handle<AboutPageProps>) {
  return () => {
    const { user, settings } = handle.props

    return (
      <LandingLayout user={user} settings={settings}>
        <LandingSection variant="frame" ruled>
          <HeadingScope level={1}>
            <LandingHeader
              eyebrow={`Established ${TRUST_PROFILE.establishedLabel}`}
              eyebrowVariant="pill"
              description={TRUST_PROFILE.summary}
            >
              {TRUST_PROFILE.legalName} (PAART)
            </LandingHeader>

            <div mix={[u.vstack({ gap: 6 })]}>
              <StatStrip variant="ruled">
                {IMPACT_METRICS.map((m) => (
                  <StatStrip.Item key={m.label} label={m.label}>
                    {m.count}
                  </StatStrip.Item>
                ))}
              </StatStrip>
            </div>
          </HeadingScope>
        </LandingSection>

        {/* Vision, Mission & Values */}
        <LandingSection variant="frame" tone="tinted" ruled>
          <HeadingScope level={2}>
            <div
              mix={[
                u.grid(),
                u.gap(6),
                u.media(
                  "(min-width: 56rem)",
                  u.raw({ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" })
                )
              ]}
            >
              <div
                mix={[
                  u.vstack({ gap: 3 }),
                  u.p(6),
                  u.rounded("xl"),
                  u.border({ width: 1, color: "neutral" }),
                  u.bg("var(--ui-surface, var(--ui-bg))")
                ]}
              >
                <Badge color="brand" variant="outline">
                  Our Vision
                </Badge>
                <Heading level={2} mix={[u.fontSize("xl"), u.weight("bold"), u.m(0)]}>
                  Empowering Every Student in Our Community
                </Heading>
                {TRUST_VISION_MISSION.vision.map((p) => (
                  <Text key={p} mix={[u.fontSize("sm"), u.fg("neutral.muted"), u.m(0)]}>
                    {p}
                  </Text>
                ))}
              </div>

              <div
                mix={[
                  u.vstack({ gap: 3 }),
                  u.p(6),
                  u.rounded("xl"),
                  u.border({ width: 1, color: "neutral" }),
                  u.bg("var(--ui-surface, var(--ui-bg))")
                ]}
              >
                <Badge color="brand" variant="outline">
                  Our Mission
                </Badge>
                <Heading level={2} mix={[u.fontSize("xl"), u.weight("bold"), u.m(0)]}>
                  Accessible Coaching &amp; Career Guidance
                </Heading>
                <Text mix={[u.fontSize("sm"), u.fg("neutral.muted"), u.m(0)]}>
                  {TRUST_VISION_MISSION.mission}
                </Text>
                <div mix={[u.grid(), u.gap(2.5), u.pbs(2)]}>
                  {TRUST_VISION_MISSION.values.map((v) => (
                    <div key={v.title} mix={[u.hstack({ gap: 2.5, align: "start" })]}>
                      <CircleCheckIcon size={16} mix={[u.fg("brand"), u.shrink(0), u.mbs(0.5)]} />
                      <Text mix={[u.fontSize("xs"), u.m(0)]}>
                        <strong>{v.title}:</strong> {v.description}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </HeadingScope>
        </LandingSection>

        {/* Verified Track Record & Department Breakdown */}
        <LandingSection variant="frame" ruled>
          <HeadingScope level={2}>
            <LandingHeader
              eyebrow="Verified Results"
              description="Selections and certifications earned by PAART Academy students across Tamil Nadu state, central, and skill examinations."
            >
              Student Achievements &amp; State Rank Milestones
            </LandingHeader>

            <div
              mix={[
                u.grid(),
                u.gap(6),
                u.media("(min-width: 56rem)", u.raw({ gridTemplateColumns: "1.1fr 0.9fr" }))
              ]}
            >
              <div mix={[u.vstack({ gap: 3.5 })]}>
                {STATE_RANK_HIGHLIGHTS.map((item) => (
                  <div
                    key={item.title}
                    mix={[
                      u.vstack({ gap: 2 }),
                      u.p(5),
                      u.rounded("xl"),
                      u.border({ width: 1, color: "neutral" }),
                      u.bg("var(--ui-surface, var(--ui-bg))")
                    ]}
                  >
                    <div mix={[u.hstack({ gap: 2, align: "center", justify: "between" })]}>
                      <div mix={[u.hstack({ gap: 2, align: "center" })]}>
                        <AwardIcon size={18} mix={[u.fg("brand")]} />
                        <Heading level={3} mix={[u.fontSize("base"), u.weight("semibold"), u.m(0)]}>
                          {item.title}
                        </Heading>
                      </div>
                      <Badge color="brand" variant="default">
                        {item.badge}
                      </Badge>
                    </div>
                    <Text mix={[u.fontSize("sm"), u.fg("neutral.muted"), u.m(0)]}>
                      {item.description}
                    </Text>
                  </div>
                ))}
              </div>

              <div
                mix={[
                  u.vstack({ gap: 0 }),
                  u.rounded("xl"),
                  u.border({ width: 1, color: "neutral" }),
                  u.bg("var(--ui-surface, var(--ui-bg))"),
                  u.overflow("hidden")
                ]}
              >
                <div
                  mix={[
                    u.hstack({ align: "center", justify: "between" }),
                    u.p(4),
                    u.bg("surface.raised"),
                    u.borderEdge("bottom", { width: 1 }),
                    u.border({ color: "neutral" })
                  ]}
                >
                  <Text mix={[u.fontSize("sm"), u.weight("semibold"), u.m(0)]}>
                    Department / Programme
                  </Text>
                  <Text mix={[u.fontSize("sm"), u.weight("semibold"), u.m(0)]}>Selections</Text>
                </div>
                {DEPARTMENT_SELECTIONS.map((row) => (
                  <div
                    key={row.department}
                    mix={[
                      u.hstack({ align: "center", justify: "between" }),
                      u.pi(4),
                      u.pb(3),
                      u.pbs(3),
                      u.borderEdge("bottom", { width: 1 }),
                      u.border({ color: "neutral" })
                    ]}
                  >
                    <Text mix={[u.fontSize("sm"), u.m(0)]}>{row.department}</Text>
                    <Badge color="neutral" variant="outline" mix={[u.tabularNums()]}>
                      {row.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </HeadingScope>
        </LandingSection>

        {/* Community Initiatives & Roadmap */}
        <LandingSection variant="frame" tone="tinted" ruled>
          <HeadingScope level={2}>
            <LandingHeader
              eyebrow="Beyond Classroom Coaching"
              description="Educational guidance, scholarships, skill training, and future initiatives operated by PAART Trust."
            >
              Trust Initiatives &amp; Future Roadmap
            </LandingHeader>

            <div
              mix={[
                u.grid(),
                u.gap(4),
                u.media(
                  "(min-width: 48rem)",
                  u.raw({ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" })
                ),
                u.media(
                  "(min-width: 68rem)",
                  u.raw({ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" })
                )
              ]}
            >
              {TRUST_INITIATIVES.map((item) => (
                <div
                  key={item.title}
                  mix={[
                    u.vstack({ gap: 2 }),
                    u.p(5),
                    u.rounded("xl"),
                    u.border({ width: 1, color: "neutral" }),
                    u.bg("var(--ui-surface, var(--ui-bg))")
                  ]}
                >
                  <ShieldCheckIcon size={18} mix={[u.fg("brand")]} />
                  <Heading level={3} mix={[u.fontSize("base"), u.weight("semibold"), u.m(0)]}>
                    {item.title}
                  </Heading>
                  <Text mix={[u.fontSize("sm"), u.fg("neutral.muted"), u.m(0)]}>
                    {item.description}
                  </Text>
                </div>
              ))}
            </div>
          </HeadingScope>
        </LandingSection>

        <ClosingCta
          variant="frame"
          title="Join PAART Academy's Upcoming Batch"
          description="Explore our competitive examination programmes or visit our Puliyangudi campus."
          actions={
            <>
              <LinkButton
                href={routes.courses.index.href()}
                color="brand"
                variant="solid"
                mix={[landingCtaChrome()]}
              >
                <span>Explore All Courses</span>
                <ArrowRightIcon size={16} />
              </LinkButton>
              <LinkButton
                href={routes.admissions.apply.href()}
                color="neutral"
                variant="outline"
                mix={[landingCtaChrome()]}
              >
                <span>Apply Online</span>
              </LinkButton>
            </>
          }
        />
      </LandingLayout>
    )
  }
}
