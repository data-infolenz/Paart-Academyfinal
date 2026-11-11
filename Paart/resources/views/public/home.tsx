import type { Handle } from "remix/component"
import {
  ArrowRightIcon,
  AwardIcon,
  BookOpenIcon,
  ChevronDownIcon,
  DownloadIcon,
  GraduationCapIcon,
  MapPinIcon,
  PhoneIcon,
  ShieldCheckIcon
} from "@sdxc/icons"
import * as u from "@sdxc/u"
import { Accordion, Badge, Heading, HeadingScope, Link, LinkButton, Text } from "@sdxc/ui"
import {
  AccentText,
  ClosingCta,
  FaqBand,
  LandingHeader,
  LandingHero,
  LandingSection,
  ProductFrame,
  StatStrip
} from "@sdxc/ui/landing"
import { landingCtaChrome } from "@sdxc/ui/styles"
import type { AdminUser } from "~/app/initializers/auth"
import type { BlogItem } from "~/app/models/blogs"
import type { CourseItem } from "~/app/models/courses"
import type { MaterialItem } from "~/app/models/materials"
import type { SiteSettings } from "~/app/models/settings"
import { PAART_FAQ_CATEGORIES } from "~/config/faqs"
import { IMPACT_METRICS, STATE_RANK_HIGHLIGHTS, TRUST_PILLARS, TRUST_PROFILE } from "~/config/trust"
import { CourseCard } from "~/resources/components/course-card"
import { LandingLayout } from "~/resources/layouts/landing"
import { routes } from "~/routes"

export interface HomePageProps {
  user?: AdminUser | null
  settings: SiteSettings
  courses: CourseItem[]
  materials: MaterialItem[]
  blogs: BlogItem[]
}

export function HomePage(handle: Handle<HomePageProps>) {
  return () => {
    const { user, settings, courses, materials, blogs } = handle.props
    const featuredCourses = courses.slice(0, 6)
    const featuredMaterials = materials.slice(0, 4)
    const recentBlogs = blogs.slice(0, 3)

    return (
      <LandingLayout user={user} settings={settings}>
        {/* 1. Clean Hero Band */}
        <LandingHero
          variant="frame"
          tone="grid"
          align="start"
          entrance
          mediaPlacement="end"
          eyebrowVariant="pill"
          eyebrow={
            <>
              <GraduationCapIcon size={14} aria-hidden="true" mix={[u.mie(1.5)]} />
              <span>Admissions Open · Puliyangudi, Tenkasi District</span>
            </>
          }
          title={
            <>
              Structured Coaching for{" "}
              <AccentText variant="sheen">Government &amp; Public Service</AccentText> Careers
            </>
          }
          description={
            <>
              <strong>{TRUST_PROFILE.legalName}</strong> prepares aspirants across{" "}
              <strong>TNPSC, TNUSRB, TET, SSC, Banking, and Railway</strong> exams through bilingual
              Tamil &amp; English classes, daily OMR/CBT test series, and personal mentoring.
            </>
          }
          actions={
            <>
              <LinkButton
                href={routes.admissions.apply.href()}
                color="brand"
                variant="solid"
                mix={[landingCtaChrome()]}
              >
                <span>Apply for Admission</span>
                <ArrowRightIcon size={16} aria-hidden="true" />
              </LinkButton>
              <LinkButton
                href={routes.courses.index.href()}
                color="neutral"
                variant="outline"
                mix={[landingCtaChrome()]}
              >
                <BookOpenIcon size={16} aria-hidden="true" />
                <span>Explore Courses</span>
              </LinkButton>
            </>
          }
          media={
            <ProductFrame
              lights
              shadow="tinted"
              title="PAART Academy — Campus & New Training Hall"
              url="paart.in/campus-puliyangudi"
              footer="Mon–Sat 9:00 AM – 7:00 PM · Tamil & English Medium Support"
            >
              <div mix={[u.vstack({ gap: 0 })]}>
                <img
                  src="/images/paart-training-hall-front.png"
                  alt="PAART Academy Training Hall in Puliyangudi"
                  width={640}
                  height={400}
                  mix={[u.width("full"), u.height(64), u.fit("cover"), u.block()]}
                />
                <div
                  mix={[
                    u.hstack({ gap: 3, align: "center", justify: "between" }),
                    u.flexWrap("wrap"),
                    u.p(3.5),
                    u.bg("var(--ui-surface, var(--ui-bg))")
                  ]}
                >
                  <div mix={[u.hstack({ gap: 2, align: "center" })]}>
                    <ShieldCheckIcon size={16} mix={[u.fg("brand")]} />
                    <Text mix={[u.fontSize("xs"), u.weight("medium"), u.m(0)]}>
                      Public Educational Trust · Est. Dec 2018
                    </Text>
                  </div>
                  <Badge color="brand" variant="outline">
                    323+ Selections
                  </Badge>
                </div>
              </div>
            </ProductFrame>
          }
        />

        {/* 2. Verified Impact Metrics & State Rank Highlights */}
        <LandingSection variant="frame" ruled spacing="compact">
          <HeadingScope level={2}>
            <div mix={[u.vstack({ gap: 6 })]}>
              <StatStrip variant="ruled" size="base">
                {IMPACT_METRICS.map((m) => (
                  <StatStrip.Item key={m.label} label={`${m.label} — ${m.detail}`}>
                    {m.count}
                  </StatStrip.Item>
                ))}
              </StatStrip>

              <div
                mix={[
                  u.grid(),
                  u.gap(4),
                  u.media(
                    "(min-width: 56rem)",
                    u.raw({ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" })
                  )
                ]}
              >
                {STATE_RANK_HIGHLIGHTS.map((item) => (
                  <div
                    key={item.title}
                    mix={[
                      u.vstack({ gap: 2 }),
                      u.p(4),
                      u.rounded("lg"),
                      u.border({ width: 1, color: "neutral" }),
                      u.bg("surface.raised")
                    ]}
                  >
                    <div mix={[u.hstack({ gap: 2, align: "center", justify: "between" })]}>
                      <AwardIcon size={16} mix={[u.fg("brand")]} />
                      <Badge color="brand" variant="outline">
                        {item.badge}
                      </Badge>
                    </div>
                    <Heading level={3} mix={[u.fontSize("sm"), u.weight("semibold"), u.m(0)]}>
                      {item.title}
                    </Heading>
                    <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                      {item.description}
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          </HeadingScope>
        </LandingSection>

        {/* 3. Featured Courses Catalog */}
        <LandingSection id="courses" variant="frame" ruled>
          <HeadingScope level={2}>
            <LandingHeader
              eyebrow="Exam Programmes"
              layout="split"
              description="Structured batches for Tamil Nadu state civil services, uniformed services, teaching eligibility, and central government recruitments."
              action={
                <Link
                  href={routes.courses.index.href()}
                  mix={[
                    u.hstack({ gap: 1, align: "center" }),
                    u.fontSize("sm"),
                    u.weight("semibold"),
                    u.fg("brand"),
                    u.textDecoration("none")
                  ]}
                >
                  <span>View all {courses.length} programmes</span>
                  <ArrowRightIcon size={15} />
                </Link>
              }
            >
              Choose Your Target Examination
            </LandingHeader>

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
              {featuredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </HeadingScope>
        </LandingSection>

        {/* 4. Academic Methodology & Trust Pillars */}
        <LandingSection variant="frame" tone="tinted" ruled>
          <HeadingScope level={2}>
            <LandingHeader
              eyebrow="Why PAART Academy"
              description="Built on academic discipline, accessible mentorship, and community service rather than commercial hype."
              action={
                <Link
                  href={routes.about.href()}
                  mix={[
                    u.hstack({ gap: 1, align: "center" }),
                    u.fontSize("sm"),
                    u.weight("semibold"),
                    u.fg("brand"),
                    u.textDecoration("none")
                  ]}
                >
                  <span>About our Trust</span>
                  <ArrowRightIcon size={15} />
                </Link>
              }
            >
              Designed for Clarity, Discipline &amp; Consistent Progress
            </LandingHeader>

            <div
              mix={[
                u.grid(),
                u.gap(4),
                u.media(
                  "(min-width: 48rem)",
                  u.raw({ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" })
                )
              ]}
            >
              {TRUST_PILLARS.map((pillar, idx) => (
                <div
                  key={pillar.title}
                  mix={[
                    u.vstack({ gap: 2.5 }),
                    u.p(6),
                    u.rounded("xl"),
                    u.border({ width: 1, color: "neutral" }),
                    u.bg("var(--ui-surface, var(--ui-bg))")
                  ]}
                >
                  <Badge color="neutral" variant="outline">
                    0{idx + 1}
                  </Badge>
                  <Heading level={3} mix={[u.fontSize("lg"), u.weight("semibold"), u.m(0)]}>
                    {pillar.title}
                  </Heading>
                  <Text mix={[u.fontSize("sm"), u.fg("neutral.muted"), u.m(0)]}>
                    {pillar.description}
                  </Text>
                </div>
              ))}
            </div>
          </HeadingScope>
        </LandingSection>

        {/* 5. Study Materials & Exam Insights */}
        <LandingSection variant="frame" ruled>
          <HeadingScope level={2}>
            <div
              mix={[
                u.grid(),
                u.gap(8),
                u.media(
                  "(min-width: 60rem)",
                  u.raw({ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" })
                )
              ]}
            >
              {/* Left: Free Study Materials */}
              <div mix={[u.vstack({ gap: 4 })]}>
                <div mix={[u.hstack({ align: "center", justify: "between" })]}>
                  <div mix={[u.vstack({ gap: 1 })]}>
                    <Text
                      mix={[
                        u.fontSize("xs"),
                        u.weight("semibold"),
                        u.fg("brand"),
                        u.textTransform("uppercase"),
                        u.m(0)
                      ]}
                    >
                      Open Revision Library
                    </Text>
                    <Heading level={2} mix={[u.fontSize("2xl"), u.weight("bold"), u.m(0)]}>
                      Free Study Materials &amp; Notes
                    </Heading>
                  </div>
                  <Link
                    href={routes.materials.href()}
                    mix={[
                      u.fontSize("sm"),
                      u.weight("semibold"),
                      u.fg("brand"),
                      u.textDecoration("none")
                    ]}
                  >
                    All PDFs →
                  </Link>
                </div>

                <div mix={[u.vstack({ gap: 3 })]}>
                  {featuredMaterials.map((mat) => (
                    <a
                      key={mat.id}
                      href={mat.externalUrl || mat.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      mix={[
                        u.hstack({ gap: 3.5, align: "center", justify: "between" }),
                        u.p(4),
                        u.rounded("lg"),
                        u.border({ width: 1, color: "neutral" }),
                        u.bg("var(--ui-surface, var(--ui-bg))"),
                        u.textDecoration("none"),
                        u.fg("inherit"),
                        u.hover([u.border({ color: "brand" })])
                      ]}
                    >
                      <div mix={[u.vstack({ gap: 1 }), u.minWidth(0)]}>
                        <Badge color="neutral" variant="outline">
                          {mat.category}
                        </Badge>
                        <Text mix={[u.fontSize("sm"), u.weight("semibold"), u.m(0)]}>
                          {mat.title}
                        </Text>
                        <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                          {mat.description}
                        </Text>
                      </div>
                      <DownloadIcon size={18} mix={[u.fg("brand"), u.shrink(0)]} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Right: Preparation Articles */}
              <div mix={[u.vstack({ gap: 4 })]}>
                <div mix={[u.hstack({ align: "center", justify: "between" })]}>
                  <div mix={[u.vstack({ gap: 1 })]}>
                    <Text
                      mix={[
                        u.fontSize("xs"),
                        u.weight("semibold"),
                        u.fg("brand"),
                        u.textTransform("uppercase"),
                        u.m(0)
                      ]}
                    >
                      Preparation Guides
                    </Text>
                    <Heading level={2} mix={[u.fontSize("2xl"), u.weight("bold"), u.m(0)]}>
                      Latest Strategy &amp; Updates
                    </Heading>
                  </div>
                  <Link
                    href={routes.blogs.index.href()}
                    mix={[
                      u.fontSize("sm"),
                      u.weight("semibold"),
                      u.fg("brand"),
                      u.textDecoration("none")
                    ]}
                  >
                    All Articles →
                  </Link>
                </div>

                <div mix={[u.vstack({ gap: 3 })]}>
                  {recentBlogs.map((blog) => (
                    <Link
                      key={blog.id}
                      href={routes.blogs.show.href({ slug: blog.slug })}
                      mix={[
                        u.vstack({ gap: 1.5 }),
                        u.p(4),
                        u.rounded("lg"),
                        u.border({ width: 1, color: "neutral" }),
                        u.bg("var(--ui-surface, var(--ui-bg))"),
                        u.textDecoration("none"),
                        u.fg("inherit"),
                        u.hover([u.border({ color: "brand" })])
                      ]}
                    >
                      <div mix={[u.hstack({ gap: 2, align: "center" })]}>
                        <Badge color="brand" variant="outline">
                          {blog.category}
                        </Badge>
                        <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                          {blog.publishedDate}
                        </Text>
                      </div>
                      <Heading level={3} mix={[u.fontSize("base"), u.weight("semibold"), u.m(0)]}>
                        {blog.title}
                      </Heading>
                      <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                        {blog.shortDescription}
                      </Text>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </HeadingScope>
        </LandingSection>

        {/* 6. Clean Two-Column Accordion FAQ */}
        <FaqBand
          variant="frame"
          ruled
          columns={2}
          eyebrow="Common Questions"
          title="Frequently Asked Questions"
          description="Clear answers on batch timings, medium of instruction, mock tests, and scholarship support."
        >
          {PAART_FAQ_CATEGORIES.map((cat) => (
            <Accordion key={cat.id}>
              {cat.items.map((item, idx) => (
                <Accordion.Item
                  key={item.question}
                  name="home-faq"
                  open={cat.id === "admissions" && idx === 0}
                >
                  <Accordion.Trigger>
                    {item.question}
                    <ChevronDownIcon data-slot="icon" aria-hidden="true" />
                  </Accordion.Trigger>
                  <Accordion.Content>
                    <p>{item.answer}</p>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion>
          ))}
        </FaqBand>

        {/* 7. Closing Admission & Campus Callout */}
        <ClosingCta
          variant="frame"
          tone="tinted"
          eyebrow="Start Your Preparation"
          title="Ready to Begin Your Government Service Journey?"
          description={`Visit us at ${settings.addressPrimary} or submit your online admission application in minutes.`}
          actions={
            <>
              <LinkButton
                href={routes.admissions.apply.href()}
                color="brand"
                variant="solid"
                mix={[landingCtaChrome()]}
              >
                <span>Apply Online Now</span>
                <ArrowRightIcon size={16} aria-hidden="true" />
              </LinkButton>
              <LinkButton
                href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                color="neutral"
                variant="outline"
                mix={[landingCtaChrome()]}
              >
                <PhoneIcon size={15} aria-hidden="true" />
                <span>Call {settings.phone}</span>
              </LinkButton>
              <LinkButton
                href={routes.contact.href()}
                color="neutral"
                variant="ghost"
                mix={[landingCtaChrome()]}
              >
                <MapPinIcon size={15} aria-hidden="true" />
                <span>Campus Directions</span>
              </LinkButton>
            </>
          }
        />
      </LandingLayout>
    )
  }
}
