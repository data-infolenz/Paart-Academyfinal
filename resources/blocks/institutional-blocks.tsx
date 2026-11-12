import type { Handle } from "remix/component"
import {
  ArrowRightIcon,
  AwardIcon,
  BookOpenIcon,
  CircleCheckIcon,
  ClockIcon,
  GraduationCapIcon,
  MapPinIcon,
  PhoneIcon,
  ShieldCheckIcon
} from "@sdxc/icons"
import * as u from "@sdxc/u"
import { Badge, LinkButton, Text } from "@sdxc/ui"
import { renderSafeMarkdown } from "~/app/initializers/cms-render"
import type { PageBlock } from "~/app/models/cms-schemas"
import type { SiteSettings } from "~/app/models/settings"
import {
  acadCampusCaption,
  acadCampusFrame,
  acadCard,
  acadContainer,
  acadHonourBand,
  AcademicCalloutBand,
  AcademicPageBanner,
  AcademicSection,
  AcademicSectionHeader,
  acadPlaque,
  acadPlaqueGrid,
  acadSerif,
  acadStatBox,
  acadStatDetail,
  acadStatGrid,
  acadStatLabel,
  acadStatNumber
} from "~/resources/components/academic-ui"

type BlockOf<K extends PageBlock["type"]> = Extract<PageBlock, { type: K }>

export function NoticeBarBlock(handle: Handle<{ block: BlockOf<"notice_bar"> }>) {
  return () => {
    const { data } = handle.props.block
    return (
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
              {data.badge}
            </span>
            <span mix={[u.fg("var(--acad-ink)"), u.weight("medium")]}>{data.message}</span>
          </div>
          {data.ctaLabel && data.ctaHref && (
            <a
              href={data.ctaHref}
              mix={[
                u.hstack({ gap: 1, align: "center" }),
                u.weight("bold"),
                u.fontSize("xs"),
                u.fg("var(--acad-primary)"),
                u.textDecoration("none")
              ]}
            >
              <span>{data.ctaLabel}</span>
              <ArrowRightIcon size={14} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    )
  }
}

export function AcademicHeroBlock(
  handle: Handle<{ block: BlockOf<"academic_hero">; settings: SiteSettings }>
) {
  return () => {
    const { block, settings } = handle.props
    const { data } = block

    return (
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
              <span>{data.rubric}</span>
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
              {data.heading}
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
              {data.description}
            </p>

            {data.streams.length > 0 && (
              <div
                aria-label="Coaching Streams"
                mix={[u.hstack({ gap: 2 }), u.flexWrap("wrap"), u.pbs(1)]}
              >
                {data.streams.map((stream) => (
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
            )}

            <div mix={[u.hstack({ gap: 3 }), u.flexWrap("wrap"), u.pbs(1)]}>
              <LinkButton href={data.primaryCtaHref} color="brand" variant="solid" size="lg">
                <span>{data.primaryCtaLabel}</span>
                <ArrowRightIcon size={16} aria-hidden="true" />
              </LinkButton>

              {data.secondaryCtaLabel && data.secondaryCtaHref && (
                <LinkButton
                  href={data.secondaryCtaHref}
                  color="neutral"
                  variant="outline"
                  size="lg"
                >
                  <BookOpenIcon size={16} aria-hidden="true" />
                  <span>{data.secondaryCtaLabel}</span>
                </LinkButton>
              )}
            </div>
          </div>

          <div mix={[acadCampusFrame()]}>
            <img
              src={data.mainImage || "/images/paart-training-hall-front.png"}
              alt={data.mainImageAlt || data.heading}
              width={640}
              height={380}
              mix={[u.width("full"), u.height(60), u.fit("cover"), u.block()]}
            />

            {(data.subImageLeft || data.subImageRight) && (
              <div
                mix={[
                  u.grid(),
                  u.gap(0),
                  u.raw({ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }),
                  u.borderEdge("top", { width: 1, color: "var(--acad-border)" })
                ]}
              >
                {data.subImageLeft && (
                  <img
                    src={data.subImageLeft}
                    alt={data.subImageLeftAlt || "PAART classroom"}
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
                )}
                {data.subImageRight && (
                  <img
                    src={data.subImageRight}
                    alt={data.subImageRightAlt || "PAART model exam"}
                    width={320}
                    height={160}
                    loading="lazy"
                    decoding="async"
                    mix={[u.width("full"), u.height(28), u.fit("cover"), u.block()]}
                  />
                )}
              </div>
            )}

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
                    {data.campusLabel}
                  </span>
                </div>
                {data.campusBadge && (
                  <Badge color="brand" variant="outline">
                    {data.campusBadge}
                  </Badge>
                )}
              </div>
              {data.campusSubtext && (
                <p mix={[u.fontSize("xs"), u.fg("var(--acad-muted)"), u.m(0), u.mbs(1.5)]}>
                  {data.campusSubtext} · {settings.hours}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export function PageBannerBlock(handle: Handle<{ block: BlockOf<"page_banner"> }>) {
  return () => {
    const { data } = handle.props.block
    return (
      <AcademicPageBanner
        rubric={data.rubric}
        title={data.title}
        description={data.description || undefined}
        breadcrumbs={data.breadcrumbs.map((b) => ({
          label: b.label,
          href: b.href || undefined
        }))}
      />
    )
  }
}

export function HonourRollStatsBlock(handle: Handle<{ block: BlockOf<"honour_roll_stats"> }>) {
  return () => {
    const { id, data } = handle.props.block
    const headingId = `${id}-heading`
    const hasHeading = Boolean(data.heading || data.rubric)

    return (
      <section
        aria-labelledby={hasHeading ? headingId : undefined}
        aria-label={!hasHeading ? "Selection Track Record" : undefined}
        mix={[acadHonourBand()]}
      >
        <div mix={[acadContainer()]}>
          {hasHeading && (
            <div
              mix={[
                u.hstack({ gap: 3, align: "end", justify: "between" }),
                u.flexWrap("wrap"),
                u.mbe(5)
              ]}
            >
              <div>
                {data.rubric && (
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
                    {data.rubric}
                  </p>
                )}
                {data.heading && (
                  <h2
                    id={headingId}
                    mix={[
                      acadSerif(),
                      u.fontSize("2xl"),
                      u.weight("bold"),
                      u.fg("#ffffff"),
                      u.m(0)
                    ]}
                  >
                    {data.heading}
                  </h2>
                )}
              </div>

              {data.actionLabel && data.actionHref && (
                <a
                  href={data.actionHref}
                  mix={[
                    u.hstack({ gap: 1, align: "center" }),
                    u.fontSize("sm"),
                    u.weight("semibold"),
                    u.fg("#f5c669"),
                    u.textDecoration("none")
                  ]}
                >
                  <span>{data.actionLabel}</span>
                  <ArrowRightIcon size={15} aria-hidden="true" />
                </a>
              )}
            </div>
          )}

          {data.metrics.length > 0 && (
            <div mix={[acadStatGrid()]}>
              {data.metrics.map((m) => (
                <div key={m.label} mix={[acadStatBox()]}>
                  <p mix={[acadStatNumber()]}>{m.count}</p>
                  <p mix={[acadStatLabel()]}>{m.label}</p>
                  {m.detail && <p mix={[acadStatDetail()]}>{m.detail}</p>}
                </div>
              ))}
            </div>
          )}

          {data.highlights.length > 0 && (
            <div mix={[acadPlaqueGrid()]}>
              {data.highlights.map((item) => (
                <div key={item.title} mix={[acadPlaque()]}>
                  {item.badge && (
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
                  )}
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
                  {item.description && (
                    <p mix={[u.fontSize("xs"), u.leading("normal"), u.fg("#cbe0d5"), u.m(0)]}>
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    )
  }
}

export function DepartmentTableBlock(handle: Handle<{ block: BlockOf<"department_table"> }>) {
  return () => {
    const { data } = handle.props.block

    return (
      <AcademicSection id={data.sectionId || undefined} tone={data.tone}>
        <AcademicSectionHeader
          rubric={data.rubric}
          title={data.title}
          description={data.description || undefined}
        />

        <div
          mix={[
            u.grid(),
            u.gap(6),
            data.highlights.length > 0 &&
              u.media("(min-width: 56rem)", u.raw({ gridTemplateColumns: "1.1fr 0.9fr" }))
          ]}
        >
          {data.highlights.length > 0 && (
            <div mix={[u.vstack({ gap: 3.5 })]}>
              {data.highlights.map((item) => (
                <div key={item.title} mix={[acadCard(), u.vstack({ gap: 2 }), u.p(5)]}>
                  <div mix={[u.hstack({ gap: 2, align: "center", justify: "between" })]}>
                    <div mix={[u.hstack({ gap: 2, align: "center" })]}>
                      <AwardIcon size={18} mix={[u.fg("var(--acad-gold)")]} />
                      <h3 mix={[acadSerif(), u.fontSize("base"), u.weight("bold"), u.m(0)]}>
                        {item.title}
                      </h3>
                    </div>
                    {item.badge && (
                      <Badge color="brand" variant="default">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  {item.description && (
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
                  )}
                </div>
              ))}
            </div>
          )}

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
            {data.rows.map((row) => (
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
    )
  }
}

export function PillarsGridBlock(handle: Handle<{ block: BlockOf<"pillars_grid"> }>) {
  return () => {
    const { data } = handle.props.block

    const headerAction =
      data.actionLabel && data.actionHref ? (
        <LinkButton href={data.actionHref} color="neutral" variant="outline" size="sm">
          <span>{data.actionLabel}</span>
          <ArrowRightIcon size={14} aria-hidden="true" />
        </LinkButton>
      ) : undefined

    return (
      <AcademicSection id={data.sectionId || undefined} tone={data.tone}>
        <AcademicSectionHeader
          rubric={data.rubric}
          title={data.title}
          description={data.description || undefined}
          action={headerAction}
        />

        {data.layout === "numbered_with_schedule" ? (
          <div
            mix={[
              u.grid(),
              u.gap(6),
              u.items("start"),
              u.media("(min-width: 58rem)", u.raw({ gridTemplateColumns: "1.08fr 0.92fr" }))
            ]}
          >
            <div mix={[u.vstack({ gap: 3.5 })]}>
              {data.cards.map((pillar, idx) => (
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
                    {pillar.description && (
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
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div mix={[u.vstack({ gap: 4 })]}>
              {data.scheduleItems.length > 0 && (
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
                      {data.scheduleTitle || "Campus Batch Timings"}
                    </h3>
                  </div>

                  <div mix={[u.vstack({ gap: 2.5 })]}>
                    {data.scheduleItems.map((slot) => (
                      <div
                        key={slot.batch}
                        mix={[
                          u.pbs(2.5),
                          u.borderEdge("top", { width: 1, color: "var(--acad-border)" })
                        ]}
                      >
                        <p
                          mix={[
                            u.fontSize("sm"),
                            u.weight("bold"),
                            u.fg("var(--acad-ink)"),
                            u.m(0)
                          ]}
                        >
                          {slot.batch}
                        </p>
                        {slot.detail && (
                          <p
                            mix={[u.fontSize("xs"), u.fg("var(--acad-muted)"), u.m(0), u.mbs(0.5)]}
                          >
                            {slot.detail}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {data.sideImage && (
                <figure mix={[acadCard(), u.m(0), u.overflow("hidden")]}>
                  <img
                    src={data.sideImage}
                    alt={data.sideImageAlt || data.sideCaption || data.title}
                    loading="lazy"
                    decoding="async"
                    mix={[u.width("full"), u.height(44), u.fit("cover"), u.block()]}
                  />
                  {data.sideCaption && (
                    <figcaption mix={[u.p(3.5)]}>
                      <div mix={[u.hstack({ gap: 2, align: "center" })]}>
                        <ShieldCheckIcon size={15} mix={[u.fg("var(--acad-primary)")]} />
                        <span
                          mix={[u.fontSize("xs"), u.weight("semibold"), u.fg("var(--acad-ink)")]}
                        >
                          {data.sideCaption}
                        </span>
                      </div>
                    </figcaption>
                  )}
                </figure>
              )}
            </div>
          </div>
        ) : data.layout === "vision_mission" ? (
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
            {data.cards.map((card) => (
              <div key={card.title} mix={[acadCard(card.accent), u.vstack({ gap: 3 }), u.p(6)]}>
                {card.badge && (
                  <Badge color="brand" variant="outline" mix={[u.self("start")]}>
                    {card.badge}
                  </Badge>
                )}
                <h3 mix={[acadSerif(), u.fontSize("xl"), u.weight("bold"), u.m(0)]}>
                  {card.title}
                </h3>
                {card.description && (
                  <Text
                    mix={[
                      u.fontSize("sm"),
                      u.leading("relaxed"),
                      u.fg("var(--acad-muted)"),
                      u.m(0)
                    ]}
                  >
                    {card.description}
                  </Text>
                )}
                {card.paragraphs.map((p) => (
                  <Text
                    key={p}
                    mix={[
                      u.fontSize("sm"),
                      u.leading("relaxed"),
                      u.fg("var(--acad-muted)"),
                      u.m(0)
                    ]}
                  >
                    {p}
                  </Text>
                ))}
                {card.values.length > 0 && (
                  <div mix={[u.grid(), u.gap(2.5), u.pbs(2)]}>
                    {card.values.map((v) => (
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
                )}
              </div>
            ))}
          </div>
        ) : (
          <div
            mix={[
              u.grid(),
              u.gap(4),
              u.media(
                "(min-width: 48rem)",
                u.raw({ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" })
              ),
              data.layout === "three_col" &&
                u.media(
                  "(min-width: 68rem)",
                  u.raw({ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" })
                )
            ]}
          >
            {data.cards.map((item) => (
              <div key={item.title} mix={[acadCard(item.accent), u.vstack({ gap: 2 }), u.p(5)]}>
                <ShieldCheckIcon size={18} mix={[u.fg("var(--acad-primary)")]} />
                <h3 mix={[acadSerif(), u.fontSize("base"), u.weight("bold"), u.m(0)]}>
                  {item.title}
                </h3>
                {item.description && (
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
                )}
              </div>
            ))}
          </div>
        )}
      </AcademicSection>
    )
  }
}

export function RichProseBlock(handle: Handle<{ block: BlockOf<"rich_prose"> }>) {
  return () => {
    const { data } = handle.props.block

    return (
      <AcademicSection tone={data.tone}>
        {(data.rubric || data.title) && (
          <AcademicSectionHeader
            rubric={data.rubric || "Official Notice"}
            title={data.title || "Academic Overview"}
            description={data.description || undefined}
          />
        )}
        <div mix={[acadCard(), u.p(6), u.media("(min-width: 48rem)", u.p(8))]}>
          {renderSafeMarkdown(data.markdown)}
        </div>
      </AcademicSection>
    )
  }
}

export function CalloutBandBlock(
  handle: Handle<{ block: BlockOf<"callout_band">; settings: SiteSettings }>
) {
  return () => {
    const { block, settings } = handle.props
    const { data } = block
    const phone = settings.phone

    const customActions =
      data.primaryCtaHref && data.primaryCtaHref !== "/admissions" ? (
        <>
          <LinkButton href={data.primaryCtaHref} color="brand" variant="solid">
            <span>{data.primaryCtaLabel || "Learn More"}</span>
            <ArrowRightIcon size={15} aria-hidden="true" />
          </LinkButton>
          {data.secondaryCtaLabel && data.secondaryCtaHref ? (
            <LinkButton href={data.secondaryCtaHref} color="neutral" variant="outline">
              <span>{data.secondaryCtaLabel}</span>
            </LinkButton>
          ) : (
            <LinkButton href={`tel:${phone.replace(/\s+/g, "")}`} color="neutral" variant="outline">
              <PhoneIcon size={15} aria-hidden="true" />
              <span>{phone}</span>
            </LinkButton>
          )}
        </>
      ) : data.secondaryCtaLabel && data.secondaryCtaHref ? (
        <>
          <LinkButton href={data.primaryCtaHref || "/admissions"} color="brand" variant="solid">
            <span>{data.primaryCtaLabel || "Online Admission Form"}</span>
            <ArrowRightIcon size={15} aria-hidden="true" />
          </LinkButton>
          <LinkButton href={data.secondaryCtaHref} color="neutral" variant="outline">
            <span>{data.secondaryCtaLabel}</span>
          </LinkButton>
        </>
      ) : undefined

    return (
      <AcademicCalloutBand
        rubric={data.rubric || undefined}
        title={data.title}
        description={data.description || undefined}
        settings={settings}
        actions={customActions}
      />
    )
  }
}
