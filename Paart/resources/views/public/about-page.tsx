import type { Handle } from "remix/component"
import { AwardIcon, CircleCheckIcon, ShieldCheckIcon } from "@sdxc/icons"
import * as u from "@sdxc/u"
import { Badge, Text } from "@sdxc/ui"
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
import {
  acadCard,
  acadContainer,
  acadHonourBand,
  AcademicCalloutBand,
  AcademicPageBanner,
  AcademicSection,
  AcademicSectionHeader,
  acadSerif,
  acadStatBox,
  acadStatDetail,
  acadStatGrid,
  acadStatLabel,
  acadStatNumber
} from "~/resources/components/academic-ui"
import { LandingLayout } from "~/resources/layouts/landing"

export interface AboutPageProps {
  user?: AdminUser | null
  settings: SiteSettings
}

export function AboutPage(handle: Handle<AboutPageProps>) {
  return () => {
    const { user, settings } = handle.props

    return (
      <LandingLayout user={user} settings={settings}>
        <AcademicPageBanner
          rubric={`Public Educational Trust · Est. ${TRUST_PROFILE.establishedLabel}`}
          title={`${TRUST_PROFILE.legalName} (PAART)`}
          description={TRUST_PROFILE.summary}
          breadcrumbs={[{ label: "About & Results" }]}
        />

        {/* Roll of Honour Metrics */}
        <section mix={[acadHonourBand()]}>
          <div mix={[acadContainer()]}>
            <div mix={[acadStatGrid()]}>
              {IMPACT_METRICS.map((m) => (
                <div key={m.label} mix={[acadStatBox()]}>
                  <p mix={[acadStatNumber()]}>{m.count}</p>
                  <p mix={[acadStatLabel()]}>{m.label}</p>
                  <p mix={[acadStatDetail()]}>{m.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Vision, Mission & Values */}
        <AcademicSection>
          <AcademicSectionHeader
            rubric="Institutional Mandate"
            title="Vision, Mission &amp; Core Values"
            description="Serving students across Puliyangudi and Tenkasi District with disciplined, accessible public-service coaching."
          />

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
            <div mix={[acadCard("primary"), u.vstack({ gap: 3 }), u.p(6)]}>
              <Badge color="brand" variant="outline">
                Our Vision
              </Badge>
              <h3 mix={[acadSerif(), u.fontSize("xl"), u.weight("bold"), u.m(0)]}>
                Empowering Every Student in Our Community
              </h3>
              {TRUST_VISION_MISSION.vision.map((p) => (
                <Text
                  key={p}
                  mix={[u.fontSize("sm"), u.leading("relaxed"), u.fg("var(--acad-muted)"), u.m(0)]}
                >
                  {p}
                </Text>
              ))}
            </div>

            <div mix={[acadCard("gold"), u.vstack({ gap: 3 }), u.p(6)]}>
              <Badge color="brand" variant="outline">
                Our Mission
              </Badge>
              <h3 mix={[acadSerif(), u.fontSize("xl"), u.weight("bold"), u.m(0)]}>
                Accessible Coaching &amp; Career Guidance
              </h3>
              <Text
                mix={[u.fontSize("sm"), u.leading("relaxed"), u.fg("var(--acad-muted)"), u.m(0)]}
              >
                {TRUST_VISION_MISSION.mission}
              </Text>
              <div mix={[u.grid(), u.gap(2.5), u.pbs(2)]}>
                {TRUST_VISION_MISSION.values.map((v) => (
                  <div key={v.title} mix={[u.hstack({ gap: 2.5, align: "start" })]}>
                    <CircleCheckIcon
                      size={16}
                      mix={[u.fg("var(--acad-primary)"), u.shrink(0), u.mbs(0.5)]}
                    />
                    <Text mix={[u.fontSize("xs"), u.m(0)]}>
                      <strong>{v.title}:</strong> {v.description}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AcademicSection>

        {/* Verified Track Record & Department Breakdown */}
        <AcademicSection id="results" tone="paper">
          <AcademicSectionHeader
            rubric="Verified Selection Register"
            title="Student Achievements &amp; State Rank Milestones"
            description="Selections and certifications earned by PAART Academy students across Tamil Nadu state, central, and skill examinations."
          />

          <div
            mix={[
              u.grid(),
              u.gap(6),
              u.media("(min-width: 56rem)", u.raw({ gridTemplateColumns: "1.1fr 0.9fr" }))
            ]}
          >
            <div mix={[u.vstack({ gap: 3.5 })]}>
              {STATE_RANK_HIGHLIGHTS.map((item) => (
                <div key={item.title} mix={[acadCard(), u.vstack({ gap: 2 }), u.p(5)]}>
                  <div mix={[u.hstack({ gap: 2, align: "center", justify: "between" })]}>
                    <div mix={[u.hstack({ gap: 2, align: "center" })]}>
                      <AwardIcon size={18} mix={[u.fg("var(--acad-gold)")]} />
                      <h3 mix={[acadSerif(), u.fontSize("base"), u.weight("bold"), u.m(0)]}>
                        {item.title}
                      </h3>
                    </div>
                    <Badge color="brand" variant="default">
                      {item.badge}
                    </Badge>
                  </div>
                  <Text
                    mix={[
                      u.fontSize("sm"),
                      u.leading("relaxed"),
                      u.fg("var(--acad-muted)"),
                      u.m(0)
                    ]}
                  >
                    {item.description}
                  </Text>
                </div>
              ))}
            </div>

            <div mix={[acadCard("primary"), u.vstack({ gap: 0 }), u.overflow("hidden")]}>
              <div
                mix={[
                  u.hstack({ align: "center", justify: "between" }),
                  u.p(4),
                  u.bg("var(--acad-paper)"),
                  u.borderEdge("bottom", { width: 1, color: "var(--acad-border)" })
                ]}
              >
                <span mix={[acadSerif(), u.fontSize("sm"), u.weight("bold")]}>
                  Department / Examination
                </span>
                <span mix={[acadSerif(), u.fontSize("sm"), u.weight("bold")]}>Selections</span>
              </div>
              {DEPARTMENT_SELECTIONS.map((row) => (
                <div
                  key={row.department}
                  mix={[
                    u.hstack({ align: "center", justify: "between" }),
                    u.pi(4),
                    u.pb(3),
                    u.pbs(3),
                    u.borderEdge("bottom", { width: 1, color: "var(--acad-border)" })
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
        </AcademicSection>

        {/* Community Initiatives & Roadmap */}
        <AcademicSection>
          <AcademicSectionHeader
            rubric="Community Welfare & Skill Development"
            title="Trust Initiatives &amp; Future Roadmap"
            description="Educational guidance, scholarships, skill certification, and upcoming academic facilities operated by PAART Trust."
          />

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
              <div key={item.title} mix={[acadCard(), u.vstack({ gap: 2 }), u.p(5)]}>
                <ShieldCheckIcon size={18} mix={[u.fg("var(--acad-primary)")]} />
                <h3 mix={[acadSerif(), u.fontSize("base"), u.weight("bold"), u.m(0)]}>
                  {item.title}
                </h3>
                <Text
                  mix={[u.fontSize("sm"), u.leading("relaxed"), u.fg("var(--acad-muted)"), u.m(0)]}
                >
                  {item.description}
                </Text>
              </div>
            ))}
          </div>
        </AcademicSection>

        <AcademicCalloutBand
          title="Join PAART Academy's Upcoming Coaching Batch"
          description="Explore our competitive examination programmes or visit our Puliyangudi campus for free academic counselling."
          settings={settings}
        />
      </LandingLayout>
    )
  }
}
