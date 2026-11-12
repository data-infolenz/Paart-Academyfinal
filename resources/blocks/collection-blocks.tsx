import type { Handle } from "remix/component"
import {
  ArrowRightIcon,
  ChevronDownIcon,
  CircleCheckIcon,
  ClockIcon,
  DownloadIcon,
  FileTextIcon,
  GraduationCapIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  SendIcon,
  ShieldCheckIcon
} from "@sdxc/icons"
import * as u from "@sdxc/u"
import { Accordion, Badge, Button, Input, LinkButton, Select, Text, TextArea } from "@sdxc/ui"
import { renderSafeMarkdown } from "~/app/initializers/cms-render"
import type { HydratedCollections, HydratedPageResult } from "~/app/models/cms-hydrator"
import type { PageBlock } from "~/app/models/cms-schemas"
import type { SiteSettings } from "~/app/models/settings"
import { COURSE_CATEGORIES } from "~/config/courses"
import {
  acadCampusCaption,
  acadCampusFrame,
  acadCard,
  AcademicCalloutBand,
  AcademicPageBanner,
  AcademicSection,
  AcademicSectionHeader,
  acadProspectusCard,
  acadRubric,
  acadSectionTitle,
  acadSerif
} from "~/resources/components/academic-ui"
import { CourseCard } from "~/resources/components/course-card"
import { EnquiryFormCard } from "~/resources/components/enquiry-form"
import { routes } from "~/routes"

type BlockOf<K extends PageBlock["type"]> = Extract<PageBlock, { type: K }>

const MATERIAL_CATEGORIES = ["ALL", "Study Material", "Notes", "Current Affairs", "Question Bank"]
const GALLERY_CATEGORIES = [
  "ALL",
  "Classroom",
  "Model Exams",
  "Physical Coaching",
  "Achievements",
  "Community"
]

export function CourseCatalogBlock(
  handle: Handle<{
    block: BlockOf<"course_catalog">
    collections: HydratedCollections
    requestState: HydratedPageResult["requestState"]
    pageSlug: string
  }>
) {
  return () => {
    const { block, collections, requestState, pageSlug } = handle.props
    const { data } = block
    const activeCat = data.showCategoryTabs
      ? requestState.activeCategory || data.categoryFilter || "ALL"
      : data.categoryFilter || "ALL"

    const filtered =
      activeCat !== "ALL"
        ? collections.courses.filter((c) => c.category === activeCat)
        : collections.courses
    const visibleCourses = data.limit > 0 ? filtered.slice(0, data.limit) : filtered
    const categories = ["ALL", ...COURSE_CATEGORIES]
    const baseHref = pageSlug.startsWith("/") ? pageSlug : routes.courses.index.href()

    const headerAction =
      data.viewAllLabel && data.viewAllHref ? (
        <LinkButton href={data.viewAllHref} color="neutral" variant="outline" size="sm">
          <span>
            {data.viewAllLabel === "View All Programmes" && collections.courses.length > 0
              ? `View All ${collections.courses.length} Programmes`
              : data.viewAllLabel}
          </span>
          <ArrowRightIcon size={14} aria-hidden="true" />
        </LinkButton>
      ) : undefined

    return (
      <AcademicSection id={data.sectionId || undefined} tone={data.tone}>
        {data.showHeader && (
          <AcademicSectionHeader
            rubric={data.rubric || "Academic Prospectus"}
            title={data.title || "Competitive Examination Programmes"}
            description={data.description || undefined}
            action={headerAction}
          />
        )}

        {data.showCategoryTabs && (
          <div mix={[u.hstack({ gap: 2 }), u.flexWrap("wrap"), u.mbe(6)]}>
            {categories.map((cat) => {
              const isSelected = activeCat === cat
              const href =
                cat === "ALL" ? baseHref : `${baseHref}?category=${encodeURIComponent(cat)}`
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
        )}

        {visibleCourses.length === 0 ? (
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
            {visibleCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </AcademicSection>
    )
  }
}

export function MaterialsCatalogBlock(
  handle: Handle<{
    block: BlockOf<"materials_catalog">
    collections: HydratedCollections
    requestState: HydratedPageResult["requestState"]
    pageSlug: string
  }>
) {
  return () => {
    const { block, collections, requestState, pageSlug } = handle.props
    const { data } = block

    if (data.layout === "split_with_blogs") {
      const featuredMaterials =
        data.limit > 0 ? collections.materials.slice(0, data.limit) : collections.materials
      const recentBlogs = collections.blogs.slice(0, data.blogLimit || 3)

      return (
        <AcademicSection tone={data.tone}>
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
                  <p mix={[acadRubric()]}>{data.rubric || "Open Student Library"}</p>
                  <h2 mix={[acadSectionTitle(), u.fontSize("2xl")]}>
                    {data.title || "Free Study Materials & Notes"}
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
                  <p mix={[acadRubric()]}>{data.blogRubric || "Academic Gazette"}</p>
                  <h2 mix={[acadSectionTitle(), u.fontSize("2xl")]}>
                    {data.blogTitle || "Exam Strategy & Guidance"}
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
      )
    }

    const activeCat = data.showCategoryTabs
      ? requestState.activeCategory || data.categoryFilter || "ALL"
      : data.categoryFilter || "ALL"
    const filtered =
      activeCat !== "ALL"
        ? collections.materials.filter((m) => m.category === activeCat)
        : collections.materials
    const visibleMaterials = data.limit > 0 ? filtered.slice(0, data.limit) : filtered
    const baseHref = pageSlug.startsWith("/") ? pageSlug : routes.materials.href()

    return (
      <AcademicSection tone={data.tone}>
        {data.showCategoryTabs && (
          <div mix={[u.hstack({ gap: 2 }), u.flexWrap("wrap"), u.mbe(6)]}>
            {MATERIAL_CATEGORIES.map((cat) => {
              const isSelected = activeCat === cat
              const href =
                cat === "ALL" ? baseHref : `${baseHref}?category=${encodeURIComponent(cat)}`
              return (
                <LinkButton
                  key={cat}
                  href={href}
                  size="sm"
                  color={isSelected ? "brand" : "neutral"}
                  variant={isSelected ? "solid" : "outline"}
                >
                  {cat === "ALL" ? "All Resources" : cat}
                </LinkButton>
              )
            })}
          </div>
        )}

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
          {visibleMaterials.map((mat) => (
            <a
              key={mat.id}
              href={mat.externalUrl || mat.fileUrl}
              target="_blank"
              rel="noreferrer"
              mix={[
                acadCard(),
                u.hstack({ gap: 4, align: "start", justify: "between" }),
                u.p(5),
                u.textDecoration("none"),
                u.fg("inherit"),
                u.hover(u.border({ color: "var(--acad-primary)" }))
              ]}
            >
              <div mix={[u.hstack({ gap: 3.5, align: "start" }), u.minWidth(0)]}>
                <div
                  mix={[
                    u.p(2.5),
                    u.rounded("md"),
                    u.bg("var(--acad-primary-soft)"),
                    u.fg("var(--acad-primary)"),
                    u.shrink(0)
                  ]}
                >
                  <FileTextIcon size={20} />
                </div>
                <div mix={[u.vstack({ gap: 1.5, align: "start" }), u.minWidth(0)]}>
                  <Badge color="neutral" variant="outline" mix={[u.self("start")]}>
                    {mat.category}
                  </Badge>
                  <h2 mix={[acadSerif(), u.fontSize("base"), u.weight("bold"), u.m(0)]}>
                    {mat.title}
                  </h2>
                  <Text
                    mix={[u.fontSize("xs"), u.leading("normal"), u.fg("var(--acad-muted)"), u.m(0)]}
                  >
                    {mat.description}
                  </Text>
                </div>
              </div>
              <div mix={[u.fg("var(--acad-primary)"), u.shrink(0)]}>
                <DownloadIcon size={18} />
              </div>
            </a>
          ))}
        </div>
      </AcademicSection>
    )
  }
}

export function GalleryShowcaseBlock(
  handle: Handle<{
    block: BlockOf<"gallery_showcase">
    collections: HydratedCollections
    requestState: HydratedPageResult["requestState"]
    pageSlug: string
  }>
) {
  return () => {
    const { block, collections, requestState, pageSlug } = handle.props
    const { data } = block
    const activeCat = data.showCategoryTabs
      ? requestState.activeCategory || data.categoryFilter || "ALL"
      : data.categoryFilter || "ALL"

    const items =
      activeCat !== "ALL"
        ? collections.gallery.filter((g) => g.category === activeCat)
        : collections.gallery
    const baseHref = pageSlug.startsWith("/") ? pageSlug : routes.gallery.href()

    return (
      <>
        <AcademicSection tone={data.tone}>
          {data.showCategoryTabs && (
            <div mix={[u.hstack({ gap: 2 }), u.flexWrap("wrap"), u.mbe(6)]}>
              {GALLERY_CATEGORIES.map((cat) => {
                const isSelected = activeCat === cat
                const href =
                  cat === "ALL" ? baseHref : `${baseHref}?category=${encodeURIComponent(cat)}`
                return (
                  <LinkButton
                    key={cat}
                    href={href}
                    size="sm"
                    color={isSelected ? "brand" : "neutral"}
                    variant={isSelected ? "solid" : "outline"}
                  >
                    {cat === "ALL" ? "All Photographs" : cat}
                  </LinkButton>
                )
              })}
            </div>
          )}

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
            {items.map((item) => (
              <figure
                key={item.id}
                mix={[acadCard(), u.vstack({ gap: 0 }), u.m(0), u.overflow("hidden")]}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  mix={[u.width("full"), u.height(52), u.fit("cover"), u.block()]}
                />
                <figcaption mix={[u.vstack({ gap: 1.5, align: "start" }), u.p(4)]}>
                  <Badge color="neutral" variant="outline" mix={[u.self("start")]}>
                    {item.category}
                  </Badge>
                  <h2 mix={[acadSerif(), u.fontSize("sm"), u.weight("bold"), u.m(0)]}>
                    {item.title}
                  </h2>
                  {item.description && (
                    <Text
                      mix={[
                        u.fontSize("xs"),
                        u.leading("normal"),
                        u.fg("var(--acad-muted)"),
                        u.m(0)
                      ]}
                    >
                      {item.description}
                    </Text>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        </AcademicSection>

        {data.videos.length > 0 && (
          <AcademicSection tone="paper">
            <AcademicSectionHeader
              rubric={data.videosRubric || "Campus Recordings"}
              title={data.videosTitle || "Classroom & Event Videos"}
              description={data.videosDescription || undefined}
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
              {data.videos.map((vid) => (
                <div key={vid.src} mix={[acadCard(), u.vstack({ gap: 0 }), u.overflow("hidden")]}>
                  <video
                    controls
                    preload="metadata"
                    src={vid.src}
                    mix={[u.width("full"), u.height(64), u.fit("cover"), u.bg("neutral.solid")]}
                  />
                  <div mix={[u.p(4)]}>
                    <h3 mix={[acadSerif(), u.fontSize("sm"), u.weight("bold"), u.m(0)]}>
                      {vid.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </AcademicSection>
        )}
      </>
    )
  }
}

export function BlogFeedBlock(
  handle: Handle<{
    block: BlockOf<"blog_feed">
    collections: HydratedCollections
  }>
) {
  return () => {
    const { block, collections } = handle.props
    const { data } = block
    const visibleBlogs = data.limit > 0 ? collections.blogs.slice(0, data.limit) : collections.blogs

    return (
      <AcademicSection tone={data.tone}>
        {data.showHeader && (
          <AcademicSectionHeader
            rubric={data.rubric || "Academic Gazette & Guidance"}
            title={data.title || "Exam Strategy & Preparation Articles"}
            description={data.description || undefined}
          />
        )}

        <div
          mix={[
            u.grid(),
            u.gap(5),
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
          {visibleBlogs.map((blog) => (
            <a
              key={blog.id}
              href={routes.blogs.show.href({ slug: blog.slug })}
              mix={[acadProspectusCard()]}
            >
              <img
                src={blog.featuredImage}
                alt={blog.title}
                loading="lazy"
                decoding="async"
                mix={[u.width("full"), u.height(44), u.fit("cover"), u.block()]}
              />
              <div mix={[u.vstack({ gap: 2.5 }), u.p(5), u.grow(1)]}>
                <div mix={[u.hstack({ gap: 2, align: "center" })]}>
                  <Badge color="brand" variant="outline">
                    {blog.category}
                  </Badge>
                  <span mix={[u.fontSize("xs"), u.fg("var(--acad-muted)")]}>
                    {blog.publishedDate}
                  </span>
                </div>
                <h2
                  mix={[acadSerif(), u.fontSize("lg"), u.weight("bold"), u.leading("snug"), u.m(0)]}
                >
                  {blog.title}
                </h2>
                <Text
                  mix={[
                    u.fontSize("sm"),
                    u.leading("relaxed"),
                    u.fg("var(--acad-muted)"),
                    u.m(0),
                    u.grow(1)
                  ]}
                >
                  {blog.shortDescription}
                </Text>
                <span
                  mix={[
                    u.hstack({ gap: 1, align: "center" }),
                    u.fontSize("xs"),
                    u.weight("bold"),
                    u.pbs(2),
                    u.fg("var(--acad-primary)")
                  ]}
                >
                  <span>Read Full Guide</span>
                  <ArrowRightIcon size={14} />
                </span>
              </div>
            </a>
          ))}
        </div>
      </AcademicSection>
    )
  }
}

export function FaqAccordionBlock(handle: Handle<{ block: BlockOf<"faq_accordion"> }>) {
  return () => {
    const { id, data } = handle.props.block

    const headerAction =
      data.actionLabel && data.actionHref ? (
        <LinkButton href={data.actionHref} color="neutral" variant="outline" size="sm">
          <span>{data.actionLabel}</span>
          <ArrowRightIcon size={14} aria-hidden="true" />
        </LinkButton>
      ) : undefined

    return (
      <AcademicSection tone={data.tone}>
        {data.showHeader && (
          <AcademicSectionHeader
            rubric={data.rubric || "Student & Parent Help Desk"}
            title={data.title || "Frequently Asked Questions"}
            description={data.description || undefined}
            action={headerAction}
          />
        )}

        <div
          mix={[
            u.grid(),
            u.gap(5),
            data.categories.length > 1 &&
              u.media(
                "(min-width: 56rem)",
                u.raw({ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" })
              )
          ]}
        >
          {data.categories.map((cat, catIdx) => (
            <div key={cat.id} mix={[acadCard(), u.p(5), u.vstack({ gap: 3 })]}>
              <h3
                mix={[
                  acadSerif(),
                  u.fontSize("lg"),
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
                    name={`faq-${id}-${cat.id}`}
                    open={(catIdx === 0 || !data.showHeader) && idx === 0}
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
    )
  }
}

export function ContactHubBlock(
  handle: Handle<{
    block: BlockOf<"contact_hub">
    settings: SiteSettings
    collections: HydratedCollections
    requestState: HydratedPageResult["requestState"]
  }>
) {
  return () => {
    const { block, settings, collections, requestState } = handle.props
    const { data } = block
    const mapQuery = encodeURIComponent(settings.addressPrimary)
    const mapSrc = `https://www.google.com/maps?q=${mapQuery}&output=embed`

    return (
      <AcademicSection>
        <div
          mix={[
            u.grid(),
            u.gap(6),
            u.items("start"),
            u.media("(min-width: 58rem)", u.raw({ gridTemplateColumns: "0.95fr 1.05fr" }))
          ]}
        >
          <div mix={[u.vstack({ gap: 4 })]}>
            <div mix={[acadCard("primary"), u.vstack({ gap: 4 }), u.p(6)]}>
              <h2 mix={[acadSerif(), u.fontSize("lg"), u.weight("bold"), u.m(0)]}>
                {data.heading}
              </h2>

              <div mix={[u.hstack({ gap: 3, align: "start" })]}>
                <MapPinIcon
                  size={18}
                  mix={[u.fg("var(--acad-primary)"), u.shrink(0), u.mbs(0.5)]}
                />
                <div mix={[u.vstack({ gap: 1 })]}>
                  <span mix={[u.fontSize("xs"), u.weight("bold"), u.fg("var(--acad-muted)")]}>
                    {data.primaryOfficeLabel}
                  </span>
                  <Text mix={[u.fontSize("sm"), u.m(0)]}>{settings.addressPrimary}</Text>
                  {settings.addressSecondary && (
                    <>
                      <span
                        mix={[
                          u.fontSize("xs"),
                          u.weight("bold"),
                          u.fg("var(--acad-muted)"),
                          u.pbs(1)
                        ]}
                      >
                        {data.secondaryOfficeLabel}
                      </span>
                      <Text mix={[u.fontSize("sm"), u.m(0)]}>{settings.addressSecondary}</Text>
                    </>
                  )}
                </div>
              </div>

              <div mix={[u.hstack({ gap: 3, align: "center" })]}>
                <PhoneIcon size={18} mix={[u.fg("var(--acad-primary)"), u.shrink(0)]} />
                <div mix={[u.vstack({ gap: 0.5 })]}>
                  <span mix={[u.fontSize("xs"), u.fg("var(--acad-muted)")]}>{data.phoneLabel}</span>
                  <a
                    href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                    mix={[
                      u.fontSize("sm"),
                      u.weight("bold"),
                      u.fg("var(--acad-primary)"),
                      u.textDecoration("none")
                    ]}
                  >
                    {settings.phone}
                  </a>
                </div>
              </div>

              <div mix={[u.hstack({ gap: 3, align: "center" })]}>
                <MailIcon size={18} mix={[u.fg("var(--acad-primary)"), u.shrink(0)]} />
                <div mix={[u.vstack({ gap: 0.5 })]}>
                  <span mix={[u.fontSize("xs"), u.fg("var(--acad-muted)")]}>{data.emailLabel}</span>
                  <a
                    href={`mailto:${settings.email}`}
                    mix={[
                      u.fontSize("sm"),
                      u.weight("semibold"),
                      u.fg("var(--acad-primary)"),
                      u.textDecoration("none")
                    ]}
                  >
                    {settings.email}
                  </a>
                </div>
              </div>

              <div mix={[u.hstack({ gap: 3, align: "center" })]}>
                <ClockIcon size={18} mix={[u.fg("var(--acad-primary)"), u.shrink(0)]} />
                <div mix={[u.vstack({ gap: 0.5 })]}>
                  <span mix={[u.fontSize("xs"), u.fg("var(--acad-muted)")]}>{data.hoursLabel}</span>
                  <Text mix={[u.fontSize("sm"), u.weight("medium"), u.m(0)]}>{settings.hours}</Text>
                </div>
              </div>
            </div>

            {data.showMap && (
              <div mix={[acadCard(), u.overflow("hidden")]}>
                <iframe
                  title="PAART Academy Puliyangudi Location Map"
                  src={mapSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  mix={[u.width("full"), u.height(56), u.border("none"), u.block()]}
                />
              </div>
            )}
          </div>

          <EnquiryFormCard
            courses={collections.courses}
            honeypotFields={collections.honeypotFields}
            submitted={requestState.formSubmitted}
            error={requestState.formError}
            returnTo={data.returnTo}
          />
        </div>
      </AcademicSection>
    )
  }
}

export function AdmissionFormBlock(
  handle: Handle<{
    block: BlockOf<"admission_form">
    collections: HydratedCollections
    requestState: HydratedPageResult["requestState"]
  }>
) {
  return () => {
    const { block, collections, requestState } = handle.props
    const values = requestState.formValues
    const defaultCourse = values.courseInterested || requestState.selectedCourse

    return (
      <AcademicSection tone={block.data.tone}>
        <div mix={[u.maxWidth("56rem"), u.mi("auto")]}>
          {requestState.formError && (
            <div
              role="alert"
              mix={[
                u.p(4),
                u.mbe(5),
                u.rounded("lg"),
                u.border({ width: 1, color: "danger" }),
                u.bg("danger.tint")
              ]}
            >
              <Text mix={[u.fontSize("sm"), u.weight("medium"), u.fg("danger"), u.m(0)]}>
                {requestState.formError}
              </Text>
            </div>
          )}

          <form
            method="POST"
            action={routes.admissions.submit.href()}
            encType="multipart/form-data"
            mix={[
              acadCard("primary"),
              u.vstack({ gap: 6 }),
              u.p(6),
              u.media("(min-width: 48rem)", u.p(8))
            ]}
          >
            {collections.honeypotFields && (
              <div aria-hidden="true" mix={[u.visuallyHidden()]}>
                {Object.entries(collections.honeypotFields).map(([k, v]) => (
                  <input
                    key={k}
                    type="text"
                    name={k}
                    defaultValue={v}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                ))}
              </div>
            )}

            <div mix={[u.vstack({ gap: 4 })]}>
              <h2 mix={[acadSerif(), u.fontSize("lg"), u.weight("bold"), u.m(0)]}>
                1. Student &amp; Contact Particulars
              </h2>

              <div
                mix={[
                  u.grid(),
                  u.gap(4),
                  u.media(
                    "(min-width: 44rem)",
                    u.raw({ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" })
                  )
                ]}
              >
                <label mix={[u.vstack({ gap: 1.5 })]}>
                  <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                    Student Full Name *
                  </Text>
                  <Input
                    name="studentName"
                    required
                    defaultValue={values.studentName ?? ""}
                    placeholder="As per SSLC / Degree certificate"
                  />
                </label>

                <label mix={[u.vstack({ gap: 1.5 })]}>
                  <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                    Parent / Guardian Name *
                  </Text>
                  <Input
                    name="parentName"
                    required
                    defaultValue={values.parentName ?? ""}
                    placeholder="Father / Mother / Guardian name"
                  />
                </label>

                <label mix={[u.vstack({ gap: 1.5 })]}>
                  <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                    Date of Birth *
                  </Text>
                  <Input
                    name="dateOfBirth"
                    type="date"
                    required
                    defaultValue={values.dateOfBirth ?? ""}
                  />
                </label>

                <label mix={[u.vstack({ gap: 1.5 })]}>
                  <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Gender *</Text>
                  <Select name="gender" required>
                    <Select.Option value="" selected={!values.gender}>
                      Select gender...
                    </Select.Option>
                    <Select.Option value="Male" selected={values.gender === "Male"}>
                      Male
                    </Select.Option>
                    <Select.Option value="Female" selected={values.gender === "Female"}>
                      Female
                    </Select.Option>
                    <Select.Option value="Other" selected={values.gender === "Other"}>
                      Other
                    </Select.Option>
                  </Select>
                </label>

                <label mix={[u.vstack({ gap: 1.5 })]}>
                  <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                    Mobile Number *
                  </Text>
                  <Input
                    name="mobile"
                    type="tel"
                    required
                    defaultValue={values.mobile ?? ""}
                    placeholder="+91 98765 43210"
                  />
                </label>

                <label mix={[u.vstack({ gap: 1.5 })]}>
                  <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                    WhatsApp Number
                  </Text>
                  <Input
                    name="whatsapp"
                    type="tel"
                    defaultValue={values.whatsapp ?? ""}
                    placeholder="Same as mobile if left blank"
                  />
                </label>

                <label mix={[u.vstack({ gap: 1.5 })]}>
                  <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Email Address</Text>
                  <Input
                    name="email"
                    type="email"
                    defaultValue={values.email ?? ""}
                    placeholder="student@example.com"
                  />
                </label>

                <label mix={[u.vstack({ gap: 1.5 })]}>
                  <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Town / City *</Text>
                  <Input
                    name="city"
                    required
                    defaultValue={values.city ?? "Puliyangudi"}
                    placeholder="Puliyangudi"
                  />
                </label>
              </div>

              <div
                mix={[
                  u.grid(),
                  u.gap(4),
                  u.media("(min-width: 44rem)", u.raw({ gridTemplateColumns: "2fr 1fr 1fr" }))
                ]}
              >
                <label mix={[u.vstack({ gap: 1.5 })]}>
                  <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                    Residential Street Address *
                  </Text>
                  <Input
                    name="address"
                    required
                    defaultValue={values.address ?? ""}
                    placeholder="Door No, Street, Area"
                  />
                </label>

                <label mix={[u.vstack({ gap: 1.5 })]}>
                  <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>District *</Text>
                  <Input name="district" required defaultValue={values.district ?? "Tenkasi"} />
                </label>

                <label mix={[u.vstack({ gap: 1.5 })]}>
                  <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Pincode *</Text>
                  <Input
                    name="pincode"
                    required
                    defaultValue={values.pincode ?? "627855"}
                    placeholder="627855"
                  />
                </label>
              </div>
              <input type="hidden" name="state" value="Tamil Nadu" />
            </div>

            <div
              mix={[
                u.vstack({ gap: 4 }),
                u.pbs(5),
                u.borderEdge("top", { width: 1, color: "var(--acad-border)" })
              ]}
            >
              <h2 mix={[acadSerif(), u.fontSize("lg"), u.weight("bold"), u.m(0)]}>
                2. Programme Selection &amp; Educational Qualification
              </h2>

              <div
                mix={[
                  u.grid(),
                  u.gap(4),
                  u.media(
                    "(min-width: 44rem)",
                    u.raw({ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" })
                  )
                ]}
              >
                <label mix={[u.vstack({ gap: 1.5 })]}>
                  <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                    Course Applying For *
                  </Text>
                  <Select name="courseInterested" required>
                    <Select.Option value="" selected={!defaultCourse}>
                      Select target examination...
                    </Select.Option>
                    {collections.courses.map((c) => (
                      <Select.Option
                        key={c.id}
                        value={c.title}
                        selected={defaultCourse === c.title || defaultCourse === c.slug}
                      >
                        {c.title} ({c.category})
                      </Select.Option>
                    ))}
                    <Select.Option
                      value="NMMS School Scholarship"
                      selected={defaultCourse === "NMMS School Scholarship"}
                    >
                      NMMS School Scholarship
                    </Select.Option>
                    <Select.Option
                      value="Typewriting / Steno / Basic Computer"
                      selected={defaultCourse === "Typewriting / Steno / Basic Computer"}
                    >
                      Typewriting / Steno / Basic Computer
                    </Select.Option>
                  </Select>
                </label>

                <label mix={[u.vstack({ gap: 1.5 })]}>
                  <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                    Preferred Batch *
                  </Text>
                  <Select name="preferredBatch" required>
                    <Select.Option
                      value="Regular Weekday"
                      selected={(values.preferredBatch ?? "Regular Weekday") === "Regular Weekday"}
                    >
                      Regular Weekday Batch
                    </Select.Option>
                    <Select.Option
                      value="Weekend Batch"
                      selected={values.preferredBatch === "Weekend Batch"}
                    >
                      Weekend Batch (Sat &amp; Sun)
                    </Select.Option>
                    <Select.Option
                      value="Morning Track + Classroom"
                      selected={values.preferredBatch === "Morning Track + Classroom"}
                    >
                      Morning Physical + Classroom
                    </Select.Option>
                  </Select>
                </label>

                <label mix={[u.vstack({ gap: 1.5 })]}>
                  <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                    Highest Qualification *
                  </Text>
                  <Select name="previousQualification" required>
                    <Select.Option value="" selected={!values.previousQualification}>
                      Select qualification...
                    </Select.Option>
                    <Select.Option
                      value="School Student (NMMS)"
                      selected={values.previousQualification === "School Student (NMMS)"}
                    >
                      School Student (NMMS)
                    </Select.Option>
                    <Select.Option
                      value="SSLC (10th)"
                      selected={values.previousQualification === "SSLC (10th)"}
                    >
                      SSLC (10th Standard)
                    </Select.Option>
                    <Select.Option
                      value="HSC (+2) / Diploma"
                      selected={values.previousQualification === "HSC (+2) / Diploma"}
                    >
                      HSC (+2) / ITI / Diploma
                    </Select.Option>
                    <Select.Option
                      value="Undergraduate Degree"
                      selected={values.previousQualification === "Undergraduate Degree"}
                    >
                      Undergraduate Degree
                    </Select.Option>
                    <Select.Option
                      value="Postgraduate / B.Ed"
                      selected={values.previousQualification === "Postgraduate / B.Ed"}
                    >
                      Postgraduate / B.Ed / D.El.Ed
                    </Select.Option>
                  </Select>
                </label>

                <label mix={[u.vstack({ gap: 1.5 })]}>
                  <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                    School / College Name
                  </Text>
                  <Input
                    name="schoolCollegeName"
                    defaultValue={values.schoolCollegeName ?? ""}
                    placeholder="Institution name"
                  />
                </label>

                <label mix={[u.vstack({ gap: 1.5 })]}>
                  <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                    Year of Passing
                  </Text>
                  <Input
                    name="yearOfPassing"
                    defaultValue={values.yearOfPassing ?? ""}
                    placeholder="e.g. 2025"
                  />
                </label>

                <label mix={[u.vstack({ gap: 1.5 })]}>
                  <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                    Percentage / CGPA
                  </Text>
                  <Input
                    name="marksPercentage"
                    defaultValue={values.marksPercentage ?? ""}
                    placeholder="e.g. 78%"
                  />
                </label>
              </div>
            </div>

            <div
              mix={[
                u.vstack({ gap: 4 }),
                u.pbs(5),
                u.borderEdge("top", { width: 1, color: "var(--acad-border)" })
              ]}
            >
              <h2 mix={[acadSerif(), u.fontSize("lg"), u.weight("bold"), u.m(0)]}>
                3. Supporting Documents (Optional) &amp; Remarks
              </h2>

              <div
                mix={[
                  u.grid(),
                  u.gap(4),
                  u.media(
                    "(min-width: 44rem)",
                    u.raw({ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" })
                  )
                ]}
              >
                <label mix={[u.vstack({ gap: 1.5 })]}>
                  <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                    Passport Size Photo (JPG/PNG, max 5 MB)
                  </Text>
                  <Input name="studentPhoto" type="file" accept=".jpg,.jpeg,.png,.webp" />
                </label>

                <label mix={[u.vstack({ gap: 1.5 })]}>
                  <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                    Certificate / ID Proof (PDF/JPG, max 5 MB)
                  </Text>
                  <Input
                    name="supportingDocument"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                  />
                </label>
              </div>

              <label mix={[u.vstack({ gap: 1.5 })]}>
                <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                  Scholarship Request or Additional Notes
                </Text>
                <TextArea
                  name="message"
                  rows={3}
                  defaultValue={values.message ?? ""}
                  placeholder="Mention any previous exam attempts, medium preference (Tamil/English), or scholarship request..."
                />
              </label>
            </div>

            <div
              mix={[
                u.hstack({ gap: 3, align: "center", justify: "between" }),
                u.flexWrap("wrap"),
                u.pbs(4),
                u.borderEdge("top", { width: 1, color: "var(--acad-border)" })
              ]}
            >
              <div mix={[u.hstack({ gap: 2, align: "center" })]}>
                <ShieldCheckIcon size={16} mix={[u.fg("var(--acad-primary)")]} />
                <span mix={[u.fontSize("xs"), u.fg("var(--acad-muted)")]}>
                  Submitted directly to PAART Academy Admissions Office, Puliyangudi.
                </span>
              </div>
              <Button type="submit" color="brand" variant="solid" size="lg">
                <SendIcon size={16} aria-hidden="true" />
                <span>Submit Admission Application</span>
              </Button>
            </div>
          </form>
        </div>
      </AcademicSection>
    )
  }
}

export function EntityDetailMainBlock(
  handle: Handle<{
    block: BlockOf<"entity_detail_main">
    settings: SiteSettings
    requestState: HydratedPageResult["requestState"]
  }>
) {
  return () => {
    const { block, settings, requestState } = handle.props
    const { data } = block

    if (data.entityKind === "course") {
      const course = requestState.boundCourse
      if (!course) {
        return (
          <AcademicSection>
            <div mix={[acadCard("primary"), u.p(6), u.vstack({ gap: 2 })]}>
              <Badge color="brand" variant="outline" mix={[u.self("start")]}>
                Course Detail Template Slot
              </Badge>
              <Text mix={[u.fontSize("sm"), u.fg("var(--acad-muted)"), u.m(0)]}>
                Each active course at <code>/courses/:slug</code> renders its syllabus, eligibility,
                and curriculum details here.
              </Text>
            </div>
          </AcademicSection>
        )
      }

      const details = course.details
      return (
        <>
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
                    Bilingual Tamil &amp; English study materials, OMR practice, and individual
                    score mentoring included.
                  </p>
                </div>
              </div>
            </div>
          </AcademicSection>

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
            description={data.ctaSubtext}
            settings={settings}
          />
        </>
      )
    }

    const blog = requestState.boundBlog
    if (!blog) {
      return (
        <AcademicSection>
          <div mix={[acadCard("primary"), u.p(6), u.vstack({ gap: 2 })]}>
            <Badge color="brand" variant="outline" mix={[u.self("start")]}>
              Blog Article Template Slot
            </Badge>
            <Text mix={[u.fontSize("sm"), u.fg("var(--acad-muted)"), u.m(0)]}>
              Each published article at <code>/blogs/:slug</code> renders its masthead, author
              byline, and formatted Markdown body here.
            </Text>
          </div>
        </AcademicSection>
      )
    }

    return (
      <>
        <AcademicPageBanner
          rubric={`${blog.category} · Published ${blog.publishedDate}`}
          title={blog.title}
          description={blog.shortDescription}
          breadcrumbs={[
            { label: "Exam Blog", href: routes.blogs.index.href() },
            { label: blog.title }
          ]}
        />

        <AcademicSection>
          <article mix={[u.vstack({ gap: 6 }), u.maxWidth("48rem"), u.mi("auto")]}>
            <div mix={[u.hstack({ gap: 2, align: "center" }), u.flexWrap("wrap")]}>
              <Badge color="brand" variant="default">
                {blog.category}
              </Badge>
              <span mix={[u.fontSize("xs"), u.fg("var(--acad-muted)")]}>
                By {blog.author} · {blog.publishedDate}
              </span>
            </div>

            <div mix={[acadCard(), u.overflow("hidden")]}>
              <img
                src={blog.featuredImage}
                alt={blog.title}
                mix={[u.width("full"), u.height(80), u.fit("cover"), u.block()]}
              />
            </div>

            <div>{renderSafeMarkdown(blog.content)}</div>

            <div
              mix={[
                acadCard("gold"),
                u.hstack({ gap: 4, align: "center", justify: "between" }),
                u.flexWrap("wrap"),
                u.p(5),
                u.mbs(4)
              ]}
            >
              <div mix={[u.vstack({ gap: 1 })]}>
                <h2 mix={[acadSerif(), u.fontSize("base"), u.weight("bold"), u.m(0)]}>
                  {data.ctaHeading}
                </h2>
                <span mix={[u.fontSize("xs"), u.fg("var(--acad-muted)")]}>{data.ctaSubtext}</span>
              </div>
              <LinkButton
                href={data.ctaHref || routes.admissions.apply.href()}
                color="brand"
                variant="solid"
                size="sm"
              >
                <span>{data.ctaLabel || "Online Admission Form"}</span>
                <ArrowRightIcon size={14} />
              </LinkButton>
            </div>
          </article>
        </AcademicSection>
      </>
    )
  }
}
