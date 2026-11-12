import type { Handle } from "remix/component"
import {
  ArrowRightIcon,
  AwardIcon,
  BookOpenIcon,
  ChevronDownIcon,
  ClockIcon,
  DownloadIcon,
  FileTextIcon,
  GraduationCapIcon,
  MapPinIcon,
  ShieldCheckIcon
} from "@sdxc/icons"
import * as u from "@sdxc/u"
import { Accordion, Badge, LinkButton, Text } from "@sdxc/ui"
import type { AdminUser } from "~/app/initializers/auth"
import type { BlogItem } from "~/app/models/blogs"
import type { CourseItem } from "~/app/models/courses"
import type { MaterialItem } from "~/app/models/materials"
import type { SiteSettings } from "~/app/models/settings"
import { PAART_FAQ_CATEGORIES } from "~/config/faqs"
import { IMPACT_METRICS, STATE_RANK_HIGHLIGHTS, TRUST_PILLARS, TRUST_PROFILE } from "~/config/trust"
import {
  acadCampusCaption,
  acadCampusFrame,
  acadCard,
  acadContainer,
  acadHonourBand,
  AcademicCalloutBand,
  AcademicSection,
  AcademicSectionHeader,
  acadPlaque,
  acadPlaqueGrid,
  acadRubric,
  acadSectionTitle,
  acadSerif,
  acadStatBox,
  acadStatDetail,
  acadStatGrid,
  acadStatLabel,
  acadStatNumber
} from "~/resources/components/academic-ui"
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

const EXAM_STREAMS = [
  "TNPSC Group I · II · IIA · IV & VAO",
  "TNUSRB Sub-Inspector & Police Constable",
  "TET / TRB Teaching Exams",
  "SSC · Banking · RRB Railway",
  "NMMS · Typewriting · Steno · Computer"
] as const

export function HomePage(handle: Handle<HomePageProps>) {
  return () => {
    const { user, settings, courses, materials, blogs } = handle.props
    const featuredCourses = courses.slice(0, 6)
    const featuredMaterials = materials.slice(0, 4)
    const recentBlogs = blogs.slice(0, 3)

    return (
      <LandingLayout user={user} settings={settings}>
        {/* 1. Official Batch & Admissions Notice Bar */}
        <div
          role="region"
          aria-label="Academic Announcements"
          mix={[
            u.bg("var(--acad-gold-soft)"),
            u.borderEdge("bottom", { width: 1, color: "var(--acad-gold-border)" }),
            u.pbs(2.5),
            u.pbe(2.5)
          ]}
        >
          <div
            mix={[
              acadContainer(),
              u.hstack({ gap: 3, align: "center", justify: "between" }),
              u.flexWrap("wrap"),
              u.fontSize("sm")
            ]}
          >
            <div mix={[u.hstack({ gap: 2.5, align: "center" }), u.flexWrap("wrap")]}>
              <span
                mix={[
                  u.inlineFlex(),
                  u.items("center"),
                  u.pbs(0.5),
                  u.pbe(0.5),
                  u.pi(2),
                  u.rounded("sm"),
                  u.bg("var(--acad-gold-bright)"),
                  u.fg("#ffffff"),
                  u.fontSize("xs"),
                  u.weight("bold"),
                  u.textTransform("uppercase"),
                  u.raw({ letterSpacing: "0.05em" }),
                  u.shrink(0)
                ]}
              >
                Admissions Notice
              </span>
              <span mix={[u.fg("var(--acad-ink)"), u.weight("medium")]}>
                Registrations open for <strong>Regular Weekday, Weekend &amp; Morning Track</strong>{" "}
                batches in Puliyangudi (Tamil &amp; English Medium).
              </span>
            </div>
            <a
              href={routes.admissions.apply.href()}
              mix={[
                u.hstack({ gap: 1, align: "center" }),
                u.weight("bold"),
                u.fontSize("xs"),
                u.fg("var(--acad-primary)"),
                u.textDecoration("none")
              ]}
            >
              <span>Submit Application</span>
              <ArrowRightIcon size={14} aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* 2. Institutional Campus Hero */}
        <section
          mix={[
            u.bg({
              image: "linear-gradient(180deg, var(--acad-paper) 0%, var(--acad-bg) 100%)"
            }),
            u.borderEdge("bottom", { width: 1, color: "var(--acad-border)" }),
            u.pbs(10),
            u.pbe(13),
            u.media("(min-width: 60rem)", [u.pbs(14), u.pbe(16)])
          ]}
        >
          <div
            mix={[
              acadContainer(),
              u.grid(),
              u.gap(9),
              u.items("center"),
              u.media(
                "(min-width: 60rem)",
                u.raw({ gridTemplateColumns: "1.12fr 0.88fr", gap: "3rem" })
              )
            ]}
          >
            {/* Left: Institutional Mission & Actions */}
            <div mix={[u.vstack({ gap: 4.5, align: "start" })]}>
              <div
                mix={[
                  u.inlineFlex(),
                  u.items("center"),
                  u.gap(2),
                  u.pbs(1.5),
                  u.pbe(1.5),
                  u.pi(3),
                  u.bg("var(--acad-surface)"),
                  u.border({ width: 1, color: "var(--acad-border)" }),
                  u.borderEdge("left", { width: 3, color: "var(--acad-gold-bright)" }),
                  u.fontSize("xs"),
                  u.weight("bold"),
                  u.textTransform("uppercase"),
                  u.raw({ letterSpacing: "0.05em" }),
                  u.fg("var(--acad-primary)")
                ]}
              >
                <GraduationCapIcon size={15} aria-hidden="true" />
                <span>Puliyangudi, Tenkasi District · Public Educational Trust</span>
              </div>

              <h1
                mix={[
                  acadSerif(),
                  u.raw({ fontSize: "clamp(2.2rem, 3.8vw, 3.25rem)", lineHeight: "1.12" }),
                  u.weight("bold"),
                  u.fg("var(--acad-ink)"),
                  u.m(0)
                ]}
              >
                Disciplined Coaching for Government Service &amp; Academic Excellence
              </h1>

              <p
                mix={[
                  u.fontSize("base"),
                  u.leading("relaxed"),
                  u.fg("var(--acad-muted)"),
                  u.m(0),
                  u.maxWidth("40rem")
                ]}
              >
                Established on <strong>{TRUST_PROFILE.establishedLabel}</strong>,{" "}
                <strong>{TRUST_PROFILE.legalName} (PAART Academy)</strong> guides students and
                aspirants across Tenkasi District with bilingual Tamil &amp; English classes,
                Samacheer syllabus coverage, daily OMR/CBT test series, and personal mentoring.
              </p>

              <div
                aria-label="Coaching Streams"
                mix={[u.hstack({ gap: 2 }), u.flexWrap("wrap"), u.pbs(1)]}
              >
                {EXAM_STREAMS.map((stream) => (
                  <span
                    key={stream}
                    mix={[
                      u.inlineFlex(),
                      u.items("center"),
                      u.pbs(1),
                      u.pbe(1),
                      u.pi(2.5),
                      u.rounded("sm"),
                      u.bg("var(--acad-surface)"),
                      u.border({ width: 1, color: "var(--acad-border)" }),
                      u.fontSize("xs"),
                      u.weight("semibold"),
                      u.fg("var(--acad-ink)")
                    ]}
                  >
                    {stream}
                  </span>
                ))}
              </div>

              <div mix={[u.hstack({ gap: 3 }), u.flexWrap("wrap"), u.pbs(1)]}>
                <LinkButton
                  href={routes.admissions.apply.href()}
                  color="brand"
                  variant="solid"
                  size="lg"
                >
                  <span>Online Admission Form</span>
                  <ArrowRightIcon size={16} aria-hidden="true" />
                </LinkButton>

                <LinkButton
                  href={routes.courses.index.href()}
                  color="neutral"
                  variant="outline"
                  size="lg"
                >
                  <BookOpenIcon size={16} aria-hidden="true" />
                  <span>View Courses &amp; Syllabus</span>
                </LinkButton>
              </div>
            </div>

            {/* Right: Authentic Campus Building & Classroom Photograph Frame */}
            <div mix={[acadCampusFrame()]}>
              <img
                src="/images/paart-training-hall-front.png"
                alt="PAART Coaching Centre Building in Puliyangudi, Tenkasi District"
                width={640}
                height={380}
                mix={[u.width("full"), u.height(60), u.fit("cover"), u.block()]}
              />

              <div
                mix={[
                  u.grid(),
                  u.gap(0),
                  u.raw({ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }),
                  u.borderEdge("top", { width: 1, color: "var(--acad-border)" })
                ]}
              >
                <img
                  src="/images/classroom-1.jpg"
                  alt="PAART Academy classroom mentoring session"
                  width={320}
                  height={160}
                  loading="lazy"
                  decoding="async"
                  mix={[
                    u.width("full"),
                    u.height(28),
                    u.fit("cover"),
                    u.block(),
                    u.borderEdge("right", { width: 1, color: "var(--acad-border)" })
                  ]}
                />
                <img
                  src="/images/course-exam-1.jpg"
                  alt="Students writing weekly OMR model examination at PAART Academy"
                  width={320}
                  height={160}
                  loading="lazy"
                  decoding="async"
                  mix={[u.width("full"), u.height(28), u.fit("cover"), u.block()]}
                />
              </div>

              <div mix={[acadCampusCaption()]}>
                <div
                  mix={[
                    u.hstack({ gap: 2, align: "center", justify: "between" }),
                    u.flexWrap("wrap")
                  ]}
                >
                  <div mix={[u.hstack({ gap: 2, align: "center" })]}>
                    <MapPinIcon size={15} mix={[u.fg("var(--acad-primary)"), u.shrink(0)]} />
                    <span mix={[u.fontSize("xs"), u.weight("bold"), u.fg("var(--acad-ink)")]}>
                      PAART Coaching Centre · Puliyangudi Campus
                    </span>
                  </div>
                  <Badge color="brand" variant="outline">
                    Est. Dec 2018
                  </Badge>
                </div>
                <p mix={[u.fontSize("xs"), u.fg("var(--acad-muted)"), u.m(0), u.mbs(1.5)]}>
                  Lebbaisaburam Street &amp; Jamaliya Masjid Complex (Jinnah Nagar 3rd St) ·{" "}
                  {settings.hours}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Academy Roll of Honour & Verified Selection Record */}
        <section aria-labelledby="honour-roll-heading" mix={[acadHonourBand()]}>
          <div mix={[acadContainer()]}>
            <div
              mix={[
                u.hstack({ gap: 3, align: "end", justify: "between" }),
                u.flexWrap("wrap"),
                u.mbe(5)
              ]}
            >
              <div>
                <p
                  mix={[
                    u.fontSize("xs"),
                    u.weight("bold"),
                    u.textTransform("uppercase"),
                    u.raw({ letterSpacing: "0.08em" }),
                    u.fg("#f5c669"),
                    u.m(0),
                    u.mbe(1)
                  ]}
                >
                  Academy Roll of Honour
                </p>
                <h2
                  id="honour-roll-heading"
                  mix={[acadSerif(), u.fontSize("2xl"), u.weight("bold"), u.fg("#ffffff"), u.m(0)]}
                >
                  Verified Selections &amp; State-Rank Achievements
                </h2>
              </div>

              <a
                href={routes.about.href()}
                mix={[
                  u.hstack({ gap: 1, align: "center" }),
                  u.fontSize("sm"),
                  u.weight("semibold"),
                  u.fg("#f5c669"),
                  u.textDecoration("none")
                ]}
              >
                <span>Department-wise selection list</span>
                <ArrowRightIcon size={15} aria-hidden="true" />
              </a>
            </div>

            <div mix={[acadStatGrid()]}>
              {IMPACT_METRICS.map((m) => (
                <div key={m.label} mix={[acadStatBox()]}>
                  <p mix={[acadStatNumber()]}>{m.count}</p>
                  <p mix={[acadStatLabel()]}>{m.label}</p>
                  <p mix={[acadStatDetail()]}>{m.detail}</p>
                </div>
              ))}
            </div>

            <div mix={[acadPlaqueGrid()]}>
              {STATE_RANK_HIGHLIGHTS.map((item) => (
                <div key={item.title} mix={[acadPlaque()]}>
                  <div
                    mix={[u.hstack({ gap: 2, align: "center", justify: "between" }), u.mbe(1.5)]}
                  >
                    <div mix={[u.hstack({ gap: 1.5, align: "center" })]}>
                      <AwardIcon size={16} mix={[u.fg("#f5c669"), u.shrink(0)]} />
                      <span
                        mix={[
                          u.fontSize("xs"),
                          u.weight("bold"),
                          u.textTransform("uppercase"),
                          u.raw({ letterSpacing: "0.05em" }),
                          u.fg("#f5c669")
                        ]}
                      >
                        {item.badge}
                      </span>
                    </div>
                  </div>
                  <h3
                    mix={[
                      acadSerif(),
                      u.fontSize("base"),
                      u.weight("bold"),
                      u.fg("#ffffff"),
                      u.m(0),
                      u.mbe(1.5)
                    ]}
                  >
                    {item.title}
                  </h3>
                  <p mix={[u.fontSize("xs"), u.leading("normal"), u.fg("#cbe0d5"), u.m(0)]}>
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Academic Programmes & Competitive Exam Courses */}
        <AcademicSection id="courses">
          <AcademicSectionHeader
            rubric="Academic Prospectus"
            title="Competitive Examination Programmes"
            description="Structured classroom coaching for Tamil Nadu state civil services, uniformed services, teacher eligibility, and central government recruitments."
            action={
              <LinkButton
                href={routes.courses.index.href()}
                color="neutral"
                variant="outline"
                size="sm"
              >
                <span>View All {courses.length} Programmes</span>
                <ArrowRightIcon size={14} aria-hidden="true" />
              </LinkButton>
            }
          />

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
        </AcademicSection>

        {/* 5. Campus Life, Study Discipline & Teaching Methodology */}
        <AcademicSection tone="paper">
          <AcademicSectionHeader
            rubric="Campus Pedagogy & Study Hall"
            title="How Students Prepare at PAART Academy"
            description="Consistent daily teaching, bilingual study notes, weekly OMR/CBT mock tests, and community welfare support."
            action={
              <LinkButton href={routes.gallery.href()} color="neutral" variant="outline" size="sm">
                <span>View Classroom Gallery</span>
                <ArrowRightIcon size={14} aria-hidden="true" />
              </LinkButton>
            }
          />

          <div
            mix={[
              u.grid(),
              u.gap(6),
              u.items("start"),
              u.media("(min-width: 58rem)", u.raw({ gridTemplateColumns: "1.08fr 0.92fr" }))
            ]}
          >
            {/* Left: 4 Pillars of Academic Discipline */}
            <div mix={[u.vstack({ gap: 3.5 })]}>
              {TRUST_PILLARS.map((pillar, idx) => (
                <div
                  key={pillar.title}
                  mix={[acadCard(), u.hstack({ gap: 4, align: "start" }), u.p(5)]}
                >
                  <div
                    mix={[
                      acadSerif(),
                      u.width(9),
                      u.height(9),
                      u.rounded("md"),
                      u.bg("var(--acad-primary-soft)"),
                      u.fg("var(--acad-primary)"),
                      u.center(),
                      u.weight("bold"),
                      u.fontSize("base"),
                      u.shrink(0)
                    ]}
                  >
                    {idx + 1}
                  </div>
                  <div mix={[u.vstack({ gap: 1 })]}>
                    <h3
                      mix={[
                        acadSerif(),
                        u.fontSize("base"),
                        u.weight("bold"),
                        u.fg("var(--acad-ink)"),
                        u.m(0)
                      ]}
                    >
                      {pillar.title}
                    </h3>
                    <Text
                      mix={[
                        u.fontSize("sm"),
                        u.leading("relaxed"),
                        u.fg("var(--acad-muted)"),
                        u.m(0)
                      ]}
                    >
                      {pillar.description}
                    </Text>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Campus Batch Schedule & Real Student Activity Card */}
            <div mix={[u.vstack({ gap: 4 })]}>
              <div mix={[acadCard("primary"), u.p(5), u.vstack({ gap: 3.5 })]}>
                <div mix={[u.hstack({ gap: 2, align: "center" })]}>
                  <ClockIcon size={18} mix={[u.fg("var(--acad-primary)")]} />
                  <h3
                    mix={[
                      acadSerif(),
                      u.fontSize("lg"),
                      u.weight("bold"),
                      u.fg("var(--acad-ink)"),
                      u.m(0)
                    ]}
                  >
                    Campus Batch Timings &amp; Study Hall
                  </h3>
                </div>

                <div mix={[u.vstack({ gap: 2.5 })]}>
                  {[
                    {
                      batch: "Morning Physical & Track Session",
                      detail: "6:00 AM – 8:00 AM · Endurance & rope/jump drills for TNUSRB SI & PC"
                    },
                    {
                      batch: "Regular Weekday Classroom Batch",
                      detail:
                        "9:30 AM – 4:30 PM · Subject lectures, Samacheer revision & daily test"
                    },
                    {
                      batch: "Weekend Batch (College & Working Aspirants)",
                      detail: "Saturday & Sunday · Intensive syllabus coverage & OMR mock series"
                    },
                    {
                      batch: "Supervised Library & Study Hall",
                      detail: "Open Monday – Saturday, 9:00 AM – 7:00 PM with reference books"
                    }
                  ].map((slot) => (
                    <div
                      key={slot.batch}
                      mix={[
                        u.pbs(2.5),
                        u.borderEdge("top", { width: 1, color: "var(--acad-border)" })
                      ]}
                    >
                      <p
                        mix={[u.fontSize("sm"), u.weight("bold"), u.fg("var(--acad-ink)"), u.m(0)]}
                      >
                        {slot.batch}
                      </p>
                      <p mix={[u.fontSize("xs"), u.fg("var(--acad-muted)"), u.m(0), u.mbs(0.5)]}>
                        {slot.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <figure mix={[acadCard(), u.m(0), u.overflow("hidden")]}>
                <img
                  src="/images/achievement-1.jpg"
                  alt="Students attending foundation and scholarship coaching at PAART Academy"
                  loading="lazy"
                  decoding="async"
                  mix={[u.width("full"), u.height(44), u.fit("cover"), u.block()]}
                />
                <figcaption mix={[u.p(3.5)]}>
                  <div mix={[u.hstack({ gap: 2, align: "center" })]}>
                    <ShieldCheckIcon size={15} mix={[u.fg("var(--acad-primary)")]} />
                    <span mix={[u.fontSize("xs"), u.weight("semibold"), u.fg("var(--acad-ink)")]}>
                      NMMS School Scholarship, Typewriting &amp; Career Guidance Camps
                    </span>
                  </div>
                </figcaption>
              </figure>
            </div>
          </div>
        </AcademicSection>

        {/* 6. Open Student Library (Study Materials) & Exam Preparation Articles */}
        <AcademicSection>
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
            {/* Left: Free Study Materials Ledger */}
            <div mix={[u.vstack({ gap: 4 })]}>
              <div
                mix={[
                  u.hstack({ align: "end", justify: "between" }),
                  u.pbe(3),
                  u.borderEdge("bottom", { width: 1, color: "var(--acad-border)" })
                ]}
              >
                <div>
                  <p mix={[acadRubric()]}>Open Student Library</p>
                  <h2 mix={[acadSectionTitle(), u.fontSize("2xl")]}>
                    Free Study Materials &amp; Notes
                  </h2>
                </div>
                <a
                  href={routes.materials.href()}
                  mix={[
                    u.fontSize("sm"),
                    u.weight("bold"),
                    u.fg("var(--acad-primary)"),
                    u.textDecoration("none")
                  ]}
                >
                  All PDFs →
                </a>
              </div>

              <div mix={[u.vstack({ gap: 3 })]}>
                {featuredMaterials.map((mat) => (
                  <a
                    key={mat.id}
                    href={mat.externalUrl || mat.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    mix={[
                      acadCard(),
                      u.hstack({ gap: 3.5, align: "center", justify: "between" }),
                      u.p(4),
                      u.textDecoration("none"),
                      u.fg("inherit"),
                      u.hover(u.border({ color: "var(--acad-primary)" }))
                    ]}
                  >
                    <div mix={[u.hstack({ gap: 3, align: "start" }), u.minWidth(0)]}>
                      <div
                        mix={[
                          u.p(2.5),
                          u.rounded("md"),
                          u.bg("var(--acad-primary-soft)"),
                          u.fg("var(--acad-primary)"),
                          u.shrink(0)
                        ]}
                      >
                        <FileTextIcon size={18} />
                      </div>
                      <div mix={[u.vstack({ gap: 1, align: "start" }), u.minWidth(0)]}>
                        <Badge color="neutral" variant="outline" mix={[u.self("start")]}>
                          {mat.category}
                        </Badge>
                        <p
                          mix={[
                            u.fontSize("sm"),
                            u.weight("bold"),
                            u.fg("var(--acad-ink)"),
                            u.m(0)
                          ]}
                        >
                          {mat.title}
                        </p>
                        <p mix={[u.fontSize("xs"), u.fg("var(--acad-muted)"), u.m(0)]}>
                          {mat.description}
                        </p>
                      </div>
                    </div>
                    <DownloadIcon size={18} mix={[u.fg("var(--acad-primary)"), u.shrink(0)]} />
                  </a>
                ))}
              </div>
            </div>

            {/* Right: Preparation Articles & Exam Strategy */}
            <div mix={[u.vstack({ gap: 4 })]}>
              <div
                mix={[
                  u.hstack({ align: "end", justify: "between" }),
                  u.pbe(3),
                  u.borderEdge("bottom", { width: 1, color: "var(--acad-border)" })
                ]}
              >
                <div>
                  <p mix={[acadRubric()]}>Academic Gazette</p>
                  <h2 mix={[acadSectionTitle(), u.fontSize("2xl")]}>
                    Exam Strategy &amp; Guidance
                  </h2>
                </div>
                <a
                  href={routes.blogs.index.href()}
                  mix={[
                    u.fontSize("sm"),
                    u.weight("bold"),
                    u.fg("var(--acad-primary)"),
                    u.textDecoration("none")
                  ]}
                >
                  All Articles →
                </a>
              </div>

              <div mix={[u.vstack({ gap: 3 })]}>
                {recentBlogs.map((blog) => (
                  <a
                    key={blog.id}
                    href={routes.blogs.show.href({ slug: blog.slug })}
                    mix={[
                      acadCard(),
                      u.vstack({ gap: 1.5 }),
                      u.p(4),
                      u.textDecoration("none"),
                      u.fg("inherit"),
                      u.hover(u.border({ color: "var(--acad-primary)" }))
                    ]}
                  >
                    <div mix={[u.hstack({ gap: 2, align: "center" })]}>
                      <Badge color="brand" variant="outline">
                        {blog.category}
                      </Badge>
                      <span mix={[u.fontSize("xs"), u.fg("var(--acad-muted)")]}>
                        {blog.publishedDate}
                      </span>
                    </div>
                    <h3
                      mix={[
                        acadSerif(),
                        u.fontSize("base"),
                        u.weight("bold"),
                        u.fg("var(--acad-ink)"),
                        u.m(0)
                      ]}
                    >
                      {blog.title}
                    </h3>
                    <p
                      mix={[
                        u.fontSize("xs"),
                        u.leading("relaxed"),
                        u.fg("var(--acad-muted)"),
                        u.m(0)
                      ]}
                    >
                      {blog.shortDescription}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </AcademicSection>

        {/* 7. Student & Parent Help Desk (FAQ) */}
        <AcademicSection tone="paper">
          <AcademicSectionHeader
            rubric="Student & Parent Help Desk"
            title="Frequently Asked Questions"
            description="Clear answers regarding batch timings, Tamil & English medium instruction, mock exams, and fee scholarships."
            action={
              <LinkButton href={routes.faq.href()} color="neutral" variant="outline" size="sm">
                <span>Full FAQ Page</span>
                <ArrowRightIcon size={14} aria-hidden="true" />
              </LinkButton>
            }
          />

          <div
            mix={[
              u.grid(),
              u.gap(5),
              u.media(
                "(min-width: 56rem)",
                u.raw({ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" })
              )
            ]}
          >
            {PAART_FAQ_CATEGORIES.map((cat) => (
              <div key={cat.id} mix={[acadCard(), u.p(5), u.vstack({ gap: 3 })]}>
                <h3
                  mix={[
                    acadSerif(),
                    u.fontSize("base"),
                    u.weight("bold"),
                    u.fg("var(--acad-primary)"),
                    u.m(0)
                  ]}
                >
                  {cat.title}
                </h3>
                <Accordion>
                  {cat.items.map((item, idx) => (
                    <Accordion.Item
                      key={item.question}
                      name={`home-faq-${cat.id}`}
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
              </div>
            ))}
          </div>
        </AcademicSection>

        {/* 8. Walk-In Counselling & Admission Registration Band */}
        <AcademicCalloutBand
          rubric="Walk-In Counselling & Registration"
          title="Visit PAART Academy in Puliyangudi or Register Online"
          description="Meet our faculty coordinators in person for syllabus counselling, batch selection, and scholarship guidance, or submit your admission form online."
          settings={settings}
        />
      </LandingLayout>
    )
  }
}
