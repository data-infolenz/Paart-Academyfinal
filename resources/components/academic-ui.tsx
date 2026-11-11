import type { Handle, RemixNode } from "remix/component"
import { ArrowRightIcon, MapPinIcon, PhoneIcon } from "@sdxc/icons"
import * as u from "@sdxc/u"
import { LinkButton, Text } from "@sdxc/ui"
import type { SiteSettings } from "~/app/models/settings"
import { TRUST_PROFILE } from "~/config/trust"
import { routes } from "~/routes"

/* ==========================================================================
   Composable `@sdxc/u` Academic Mixin Recipes
   ========================================================================== */

export function acadContainer() {
  return u.combine([
    u.width("full"),
    u.maxWidth("var(--acad-measure)"),
    u.mi("auto"),
    u.pi(5),
    u.media("(min-width: 48rem)", u.pi(8))
  ])
}

export function acadSerif() {
  return u.combine([
    u.font("serif"),
    u.raw({ letterSpacing: "-0.02em", fontOpticalSizing: "auto" })
  ])
}

export function acadCard(accent: "none" | "primary" | "gold" = "none") {
  return u.combine([
    u.bg("var(--acad-surface)"),
    u.border({ width: 1, color: "var(--acad-border)" }),
    u.rounded("lg"),
    accent === "primary" && u.borderEdge("top", { width: 3, color: "var(--acad-primary)" }),
    accent === "gold" && u.borderEdge("top", { width: 3, color: "var(--acad-gold-bright)" })
  ])
}

export function acadProspectusCard() {
  return u.combine([
    u.vstack({ gap: 0, align: "stretch" }),
    acadCard("primary"),
    u.overflow("hidden"),
    u.textDecoration("none"),
    u.fg("inherit"),
    u.transition("border-color, box-shadow, transform"),
    u.hover([u.border({ color: "var(--acad-primary)" }), u.shadow("md"), u.translateY("-1px")])
  ])
}

export function acadCampusFrame() {
  return u.combine([
    u.bg("var(--acad-surface)"),
    u.border({ width: 1, color: "var(--acad-border-strong)" }),
    u.borderEdge("top", { width: 4, color: "var(--acad-primary)" }),
    u.rounded("lg"),
    u.overflow("hidden"),
    u.shadow("lg")
  ])
}

export function acadCampusCaption() {
  return u.combine([
    u.p(4),
    u.borderEdge("top", { width: 1, color: "var(--acad-border)" }),
    u.bg("var(--acad-surface)")
  ])
}

export function acadRubric() {
  return u.combine([
    u.inlineFlex(),
    u.items("center"),
    u.gap(2),
    u.fontSize("xs"),
    u.weight("bold"),
    u.textTransform("uppercase"),
    u.raw({ letterSpacing: "0.08em" }),
    u.fg("var(--acad-gold)"),
    u.m(0),
    u.mbe(1.5),
    u.before([
      u.pseudoContent(""),
      u.inlineBlock(),
      u.width(5),
      u.raw({ height: "2px" }),
      u.bg("var(--acad-gold-bright)")
    ])
  ])
}

export function acadSectionTitle() {
  return u.combine([
    acadSerif(),
    u.raw({ fontSize: "clamp(1.5rem, 2.4vw, 2.05rem)", lineHeight: "1.24" }),
    u.weight("bold"),
    u.fg("var(--acad-ink)"),
    u.m(0)
  ])
}

export function acadHonourBand() {
  return u.combine([
    u.bg("var(--acad-honour-bg)"),
    u.fg("var(--acad-honour-fg)"),
    u.borderEdge("bottom", { width: 3, color: "var(--acad-gold-bright)" }),
    u.pb(11),
    u.pbs(11)
  ])
}

export function acadStatGrid() {
  return u.combine([
    u.grid(),
    u.gap(4),
    u.raw({ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }),
    u.media("(min-width: 56rem)", u.raw({ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }))
  ])
}

export function acadStatBox() {
  return u.combine([
    u.p(5),
    u.bg("var(--acad-honour-card)"),
    u.border({ width: 1, color: "var(--acad-honour-border)" }),
    u.rounded("md")
  ])
}

export function acadStatNumber() {
  return u.combine([
    acadSerif(),
    u.raw({ fontSize: "clamp(1.75rem, 2.8vw, 2.35rem)", lineHeight: "1.1" }),
    u.weight("bold"),
    u.fg("var(--acad-honour-gold)"),
    u.tabularNums(),
    u.m(0)
  ])
}

export function acadStatLabel() {
  return u.combine([
    u.fontSize("sm"),
    u.weight("bold"),
    u.fg("var(--acad-honour-fg)"),
    u.m(0),
    u.mbs(1.5),
    u.mbe(0.5)
  ])
}

export function acadStatDetail() {
  return u.combine([u.fontSize("xs"), u.fg("var(--acad-honour-muted)"), u.m(0)])
}

export function acadPlaqueGrid() {
  return u.combine([
    u.grid(),
    u.gap(4),
    u.mbs(5),
    u.media("(min-width: 56rem)", u.raw({ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }))
  ])
}

export function acadPlaque() {
  return u.combine([
    u.p(5),
    u.bg("rgba(255, 255, 255, 0.045)"),
    u.border({ width: 1, color: "var(--acad-honour-border)" }),
    u.borderEdge("left", { width: 3, color: "var(--acad-honour-gold)" }),
    u.rounded("md")
  ])
}

/* ==========================================================================
   Academic Layout & Section Components
   ========================================================================== */

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface AcademicPageBannerProps {
  rubric: string
  title: RemixNode
  description?: RemixNode
  breadcrumbs?: BreadcrumbItem[]
  actions?: RemixNode
}

export function AcademicPageBanner(handle: Handle<AcademicPageBannerProps>) {
  return () => {
    const { rubric, title, description, breadcrumbs, actions } = handle.props

    return (
      <header
        mix={[
          u.bg("var(--acad-paper)"),
          u.borderEdge("top", { width: 3, color: "var(--acad-primary)" }),
          u.borderEdge("bottom", { width: 1, color: "var(--acad-border)" }),
          u.pbs(9),
          u.pbe(10)
        ]}
      >
        <div mix={[acadContainer()]}>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav
              aria-label="Breadcrumb"
              mix={[
                u.hstack({ gap: 1.5, align: "center" }),
                u.flexWrap("wrap"),
                u.fontSize("xs"),
                u.fg("var(--acad-muted)"),
                u.mbe(3),
                u.when("& a", [
                  u.fg("var(--acad-primary)"),
                  u.weight("semibold"),
                  u.textDecoration("none")
                ]),
                u.when("& a:hover", u.textDecoration("underline"))
              ]}
            >
              <a href={routes.home.href()}>Home</a>
              {breadcrumbs.map((crumb) => (
                <span key={crumb.label} mix={[u.hstack({ gap: 1.5, align: "center" })]}>
                  <span aria-hidden="true">/</span>
                  {crumb.href ? <a href={crumb.href}>{crumb.label}</a> : <span>{crumb.label}</span>}
                </span>
              ))}
            </nav>
          )}

          <div mix={[u.hstack({ gap: 4, align: "end", justify: "between" }), u.flexWrap("wrap")]}>
            <div mix={[u.vstack({ gap: 0 })]}>
              <p mix={[acadRubric()]}>{rubric}</p>
              <h1
                mix={[
                  acadSerif(),
                  u.raw({ fontSize: "clamp(1.75rem, 3vw, 2.45rem)", lineHeight: "1.2" }),
                  u.weight("bold"),
                  u.fg("var(--acad-ink)"),
                  u.m(0)
                ]}
              >
                {title}
              </h1>
              {description && (
                <p
                  mix={[
                    u.fontSize("base"),
                    u.leading("relaxed"),
                    u.fg("var(--acad-muted)"),
                    u.m(0),
                    u.mbs(2.5),
                    u.maxWidth("56rem")
                  ]}
                >
                  {description}
                </p>
              )}
            </div>

            {actions && <div mix={[u.hstack({ gap: 2.5 }), u.flexWrap("wrap")]}>{actions}</div>}
          </div>
        </div>
      </header>
    )
  }
}

export interface AcademicSectionProps {
  id?: string
  tone?: "default" | "paper"
  bordered?: boolean
  children?: RemixNode
}

export function AcademicSection(handle: Handle<AcademicSectionProps>) {
  return () => {
    const { id, tone = "default", bordered = true, children } = handle.props

    return (
      <section
        id={id}
        mix={[
          u.pbs(13),
          u.pbe(13),
          u.media("(min-width: 56rem)", [u.pbs(16), u.pbe(16)]),
          tone === "paper" && u.bg("var(--acad-paper)"),
          bordered && u.borderEdge("bottom", { width: 1, color: "var(--acad-border)" })
        ]}
      >
        <div mix={[acadContainer()]}>{children}</div>
      </section>
    )
  }
}

export interface AcademicSectionHeaderProps {
  rubric: string
  title: RemixNode
  description?: RemixNode
  action?: RemixNode
}

export function AcademicSectionHeader(handle: Handle<AcademicSectionHeaderProps>) {
  return () => {
    const { rubric, title, description, action } = handle.props

    return (
      <div
        mix={[
          u.hstack({ gap: 4, align: "end", justify: "between" }),
          u.flexWrap("wrap"),
          u.mbe(8),
          u.pbe(4),
          u.borderEdge("bottom", { width: 1, color: "var(--acad-border)" })
        ]}
      >
        <div>
          <p mix={[acadRubric()]}>{rubric}</p>
          <h2 mix={[acadSectionTitle()]}>{title}</h2>
          {description && (
            <p
              mix={[
                u.fontSize("sm"),
                u.leading("relaxed"),
                u.fg("var(--acad-muted)"),
                u.m(0),
                u.mbs(2),
                u.maxWidth("52rem")
              ]}
            >
              {description}
            </p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
    )
  }
}

export interface AcademicCalloutBandProps {
  rubric?: string
  title: RemixNode
  description?: RemixNode
  settings?: SiteSettings
  actions?: RemixNode
}

export function AcademicCalloutBand(handle: Handle<AcademicCalloutBandProps>) {
  return () => {
    const {
      rubric = "Admissions & Academic Counselling",
      title,
      description,
      settings,
      actions
    } = handle.props
    const phone = settings?.phone ?? TRUST_PROFILE.phone
    const address = settings?.addressPrimary ?? TRUST_PROFILE.addressPrimary
    const hours = settings?.hours ?? TRUST_PROFILE.hours

    return (
      <section
        mix={[
          u.pbs(13),
          u.pbe(13),
          u.media("(min-width: 56rem)", [u.pbs(16), u.pbe(16)]),
          u.bg("var(--acad-paper)")
        ]}
      >
        <div mix={[acadContainer()]}>
          <div
            mix={[
              acadCard("gold"),
              u.p(6),
              u.media("(min-width: 48rem)", u.p(8)),
              u.grid(),
              u.gap(6),
              u.items("center"),
              u.media("(min-width: 56rem)", u.raw({ gridTemplateColumns: "1.35fr 0.65fr" }))
            ]}
          >
            <div mix={[u.vstack({ gap: 2.5 })]}>
              <p mix={[acadRubric(), u.mbe(0)]}>{rubric}</p>
              <h2 mix={[acadSectionTitle()]}>{title}</h2>
              {description && (
                <Text mix={[u.fontSize("sm"), u.fg("var(--acad-muted)"), u.m(0)]}>
                  {description}
                </Text>
              )}
              <div mix={[u.hstack({ gap: 4, align: "center" }), u.flexWrap("wrap"), u.pbs(1)]}>
                <span
                  mix={[
                    u.hstack({ gap: 1.5, align: "center" }),
                    u.fontSize("xs"),
                    u.fg("var(--acad-muted)")
                  ]}
                >
                  <MapPinIcon size={14} mix={[u.fg("var(--acad-primary)")]} />
                  <span>{address}</span>
                </span>
                <span
                  mix={[
                    u.hstack({ gap: 1.5, align: "center" }),
                    u.fontSize("xs"),
                    u.fg("var(--acad-muted)")
                  ]}
                >
                  <span>· {hours}</span>
                </span>
              </div>
            </div>

            <div mix={[u.vstack({ gap: 2.5, align: "stretch" })]}>
              {actions ?? (
                <>
                  <LinkButton href={routes.admissions.apply.href()} color="brand" variant="solid">
                    <span>Online Admission Form</span>
                    <ArrowRightIcon size={15} aria-hidden="true" />
                  </LinkButton>
                  <LinkButton
                    href={`tel:${phone.replace(/\s+/g, "")}`}
                    color="neutral"
                    variant="outline"
                  >
                    <PhoneIcon size={15} aria-hidden="true" />
                    <span>{phone}</span>
                  </LinkButton>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }
}
