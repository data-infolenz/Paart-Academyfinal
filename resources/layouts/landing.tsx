import type { Handle, RemixNode } from "remix/component"
import {
  ClockIcon,
  EyeIcon,
  MailIcon,
  MapPinIcon,
  MenuIcon,
  PhoneIcon,
  ShieldCheckIcon
} from "@sdxc/icons"
import * as u from "@sdxc/u"
import { Badge, LinkButton, Text } from "@sdxc/ui"
import type { AdminUser } from "~/app/initializers/auth"
import type { SiteChromeConfig } from "~/app/models/cms-schemas"
import type { SiteSettings } from "~/app/models/settings"
import { DEFAULT_SITE_CHROME } from "~/config/default-pages"
import { acadContainer, acadSerif } from "~/resources/components/academic-ui"
import { ThemeToggle } from "~/resources/components/theme-toggle"
import { routes } from "~/routes"

export interface DraftPreviewBannerInfo {
  pageId: string
  slug: string
  version: number
  status: string
}

export interface LandingLayoutProps {
  user?: AdminUser | null
  settings?: SiteSettings
  chrome?: SiteChromeConfig
  previewBanner?: DraftPreviewBannerInfo | null
  children?: RemixNode
}

function navLinkMix() {
  return u.combine([
    u.inlineFlex(),
    u.items("center"),
    u.pb(2),
    u.pbs(2),
    u.pi(3),
    u.rounded("md"),
    u.fontSize("sm"),
    u.weight("semibold"),
    u.fg("var(--acad-ink)"),
    u.textDecoration("none"),
    u.transition("background-color, color"),
    u.hover([u.bg("var(--acad-primary-soft)"), u.fg("var(--acad-primary)")])
  ])
}

function footerHeadingMix() {
  return u.combine([
    acadSerif(),
    u.fontSize("base"),
    u.weight("bold"),
    u.fg("var(--acad-honour-gold)"),
    u.m(0),
    u.mbe(3.5),
    u.pbe(2),
    u.borderEdge("bottom", { width: 1, color: "rgba(245, 198, 105, 0.22)" })
  ])
}

function footerListMix() {
  return u.combine([
    u.listStyle("none"),
    u.m(0),
    u.p(0),
    u.vstack({ gap: 2 }),
    u.when("& a", [u.fg("#d6e5dc"), u.textDecoration("none"), u.fontSize("sm")]),
    u.when("& a:hover", [u.fg("#ffffff"), u.textDecoration("underline")])
  ])
}

export function BrandMark(_handle: Handle) {
  return () => (
    <div mix={[u.hstack({ gap: 2.5, align: "center" })]}>
      <img
        src="/images/paart-logo.png"
        alt="PAART Academy Emblem"
        width={36}
        height={40}
        decoding="async"
        mix={[u.fit("contain"), u.shrink(0)]}
      />
      <div mix={[u.vstack({ gap: 0 })]}>
        <Text mix={[u.fontSize("base"), u.weight("bold"), u.m(0)]}>PAART Academy</Text>
        <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>Puliyangudi · Est. 2018</Text>
      </div>
    </div>
  )
}

function SkipToContentLink(_handle: Handle) {
  return () => (
    <LinkButton
      href="#main-content"
      color="brand"
      variant="solid"
      size="sm"
      mix={[
        u.when("&:not(:focus):not(:focus-visible)", u.visuallyHidden()),
        u.focusVisible([
          u.fixed(),
          u.insTop(3),
          u.insLeft("50%"),
          u.translateX("-50%"),
          u.z(9999),
          u.shadow("xl"),
          u.m("auto")
        ])
      ]}
    >
      Skip to main content
    </LinkButton>
  )
}

function workspaceMetaForUser(user: AdminUser) {
  switch (user.role) {
    case "admin":
      return { label: "Admin Console", href: routes.admin.index.href() }
    case "faculty":
      return { label: "Faculty Workspace", href: routes.faculty.index.href() }
    case "aspirant":
      return { label: "Aspirant Portal", href: routes.portal.index.href() }
  }
}

export function LandingLayout(handle: Handle<LandingLayoutProps>) {
  return () => {
    const { user, settings, chrome = DEFAULT_SITE_CHROME, previewBanner, children } = handle.props
    const workspace = user ? workspaceMetaForUser(user) : null

    const trust = chrome.trustProfile
    const shortName = settings?.siteName ?? trust.shortName
    const phone = settings?.phone ?? trust.phone
    const phoneHref = `tel:${phone.replace(/\s+/g, "")}`
    const email = settings?.email ?? trust.email
    const addressPrimary = settings?.addressPrimary ?? trust.addressPrimary
    const addressSecondary = settings?.addressSecondary ?? trust.addressSecondary
    const hours = settings?.hours ?? trust.hours

    const utilityBadge =
      chrome.utilityBar.badgeText || `${trust.legalName} · Est. ${trust.establishedLabel}`
    const navItems = chrome.headerNav.length > 0 ? chrome.headerNav : DEFAULT_SITE_CHROME.headerNav
    const footerCols =
      chrome.footerColumns.length > 0 ? chrome.footerColumns : DEFAULT_SITE_CHROME.footerColumns
    const loginLabel = chrome.headerCtas.loginLabel || "Portal Login"
    const primaryCtaLabel = chrome.headerCtas.primaryLabel || "Admission Form"
    const primaryCtaHref = chrome.headerCtas.primaryHref || routes.admissions.apply.href()

    return (
      <div mix={[u.minHeight("100vh"), u.vstack()]}>
        <SkipToContentLink />

        {/* Admin Draft Preview Banner (only when ?preview=draft for an authenticated Admin) */}
        {previewBanner && (
          <div
            role="status"
            aria-label="Draft Preview Mode"
            mix={[
              u.bg("warning.tint"),
              u.borderEdge("bottom", { width: 2, color: "warning" }),
              u.pbs(2),
              u.pbe(2),
              u.fontSize("xs")
            ]}
          >
            <div
              mix={[
                acadContainer(),
                u.hstack({ gap: 3, align: "center", justify: "between" }),
                u.flexWrap("wrap")
              ]}
            >
              <div mix={[u.hstack({ gap: 2, align: "center" }), u.flexWrap("wrap")]}>
                <EyeIcon size={15} mix={[u.fg("warning"), u.shrink(0)]} />
                <Badge color="warning" variant="default">
                  Draft Preview (v{previewBanner.version})
                </Badge>
                <span mix={[u.weight("semibold"), u.fg("var(--acad-ink)")]}>
                  Viewing unpublished draft for <code>{previewBanner.slug}</code> (
                  {previewBanner.status})
                </span>
              </div>
              <div mix={[u.hstack({ gap: 2, align: "center" })]}>
                <LinkButton
                  href={`/admin/pages/${encodeURIComponent(previewBanner.pageId)}`}
                  size="sm"
                  color="brand"
                  variant="solid"
                >
                  Open in Page Studio
                </LinkButton>
                {previewBanner.slug.startsWith("/") && (
                  <LinkButton href={previewBanner.slug} size="sm" color="neutral" variant="outline">
                    Exit Preview
                  </LinkButton>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 1. Official Institutional Top Utility Bar */}
        <div
          mix={[
            u.bg("var(--acad-primary-deep)"),
            u.fg("#eef5f1"),
            u.borderEdge("bottom", { width: 2, color: "var(--acad-gold-bright)" }),
            u.fontSize("xs"),
            u.when("& a", [u.fg("#ffffff"), u.textDecoration("none"), u.weight("medium")]),
            u.when("& a:hover", u.textDecoration("underline"))
          ]}
        >
          <div
            mix={[
              acadContainer(),
              u.hstack({ gap: 3, align: "center", justify: "between" }),
              u.flexWrap("wrap"),
              u.pbs(2),
              u.pbe(2)
            ]}
          >
            <div mix={[u.hstack({ gap: 2, align: "center" })]}>
              <ShieldCheckIcon size={14} aria-hidden="true" mix={[u.fg("#f5c669"), u.shrink(0)]} />
              <span>{utilityBadge}</span>
            </div>

            <div mix={[u.hstack({ gap: 4, align: "center" }), u.flexWrap("wrap")]}>
              {chrome.utilityBar.showHours && (
                <span
                  mix={[
                    u.hidden(),
                    u.media("(min-width: 56rem)", u.hstack({ gap: 1.5, align: "center" }))
                  ]}
                >
                  <ClockIcon size={13} aria-hidden="true" mix={[u.fg("#f5c669")]} />
                  <span>{hours}</span>
                </span>
              )}

              {chrome.utilityBar.showPhone && (
                <a href={phoneHref} mix={[u.hstack({ gap: 1.5, align: "center" })]}>
                  <PhoneIcon size={13} aria-hidden="true" mix={[u.fg("#f5c669")]} />
                  <span>{phone}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* 2. Main Academic Masthead & Navigation */}
        <header
          id="paart-site-header"
          mix={[
            u.sticky(),
            u.insTop(0),
            u.z(40),
            u.bg("var(--acad-surface)"),
            u.borderEdge("bottom", { width: 1, color: "var(--acad-border)" }),
            u.shadow("xs")
          ]}
        >
          <div
            mix={[
              acadContainer(),
              u.hstack({ gap: 4, align: "center", justify: "between" }),
              u.pbs(3.5),
              u.pbe(3.5)
            ]}
          >
            <a
              href={routes.home.href()}
              aria-label={`${shortName} Home`}
              mix={[
                u.hstack({ gap: 3.5, align: "center" }),
                u.textDecoration("none"),
                u.fg("inherit"),
                u.minWidth(0)
              ]}
            >
              <img
                src="/images/paart-logo.png"
                alt={`${shortName} Official Crest`}
                width={48}
                height={54}
                decoding="async"
                mix={[u.width(12), u.height(14), u.fit("contain"), u.shrink(0)]}
              />
              <div>
                <p
                  mix={[
                    acadSerif(),
                    u.fontSize("xl"),
                    u.media("(min-width: 48rem)", u.fontSize("2xl")),
                    u.weight("bold"),
                    u.leading("tight"),
                    u.fg("var(--acad-ink)"),
                    u.m(0)
                  ]}
                >
                  {shortName}
                </p>
                <p
                  mix={[
                    u.fontSize("xs"),
                    u.weight("semibold"),
                    u.fg("var(--acad-muted)"),
                    u.m(0),
                    u.mbs(0.5)
                  ]}
                >
                  Competitive Exam &amp; Skill Coaching
                </p>
              </div>
            </a>

            <nav
              aria-label="Main Navigation"
              mix={[
                u.hidden(),
                u.media("(min-width: 70rem)", u.hstack({ gap: 1, align: "center" }))
              ]}
            >
              {navItems.map((item) => (
                <a key={`${item.label}-${item.href}`} href={item.href} mix={[navLinkMix()]}>
                  {item.label}
                </a>
              ))}
            </nav>

            <div
              mix={[
                u.hidden(),
                u.media("(min-width: 70rem)", u.hstack({ gap: 2.5, align: "center" }))
              ]}
            >
              <ThemeToggle />
              {workspace ? (
                <LinkButton href={workspace.href} color="neutral" variant="outline" size="sm">
                  {workspace.label}
                </LinkButton>
              ) : (
                <LinkButton
                  href={routes.auth.loginPage.href()}
                  color="neutral"
                  variant="outline"
                  size="sm"
                >
                  {loginLabel}
                </LinkButton>
              )}
              <LinkButton href={primaryCtaHref} color="brand" variant="solid" size="sm">
                {primaryCtaLabel}
              </LinkButton>
            </div>

            {/* Mobile Controls */}
            <div
              mix={[
                u.hstack({ gap: 2, align: "center" }),
                u.media("(min-width: 70rem)", u.hidden())
              ]}
            >
              <ThemeToggle />
              <details
                mix={[u.relative(), u.when("& > summary::-webkit-details-marker", u.hidden())]}
              >
                <summary
                  aria-label="Toggle navigation menu"
                  mix={[
                    u.listStyle("none"),
                    u.cursor("pointer"),
                    u.inlineFlex(),
                    u.items("center"),
                    u.gap(1.5),
                    u.pbs(2),
                    u.pbe(2),
                    u.pi(3),
                    u.rounded("md"),
                    u.border({ width: 1, color: "var(--acad-border-strong)" }),
                    u.bg("var(--acad-surface)"),
                    u.fg("var(--acad-ink)"),
                    u.fontSize("sm"),
                    u.weight("semibold")
                  ]}
                >
                  <MenuIcon size={17} aria-hidden="true" />
                  <span>Menu</span>
                </summary>
                <div
                  mix={[
                    u.absolute(),
                    u.insRight(0),
                    u.raw({ top: "calc(100% + 0.55rem)", width: "min(20rem, calc(100vw - 2rem))" }),
                    u.bg("var(--acad-surface)"),
                    u.border({ width: 1, color: "var(--acad-border-strong)" }),
                    u.borderEdge("top", { width: 3, color: "var(--acad-primary)" }),
                    u.rounded("lg"),
                    u.shadow("xl"),
                    u.p(3.5),
                    u.vstack({ gap: 1 }),
                    u.z(60)
                  ]}
                >
                  {navItems.map((item) => (
                    <a key={`mob-${item.label}-${item.href}`} href={item.href} mix={[navLinkMix()]}>
                      {item.label}
                    </a>
                  ))}
                  <div
                    mix={[
                      u.vstack({ gap: 2 }),
                      u.pbs(2.5),
                      u.mbs(1.5),
                      u.borderEdge("top", { width: 1, color: "var(--acad-border)" })
                    ]}
                  >
                    {workspace ? (
                      <LinkButton href={workspace.href} color="neutral" variant="outline" size="sm">
                        {workspace.label}
                      </LinkButton>
                    ) : (
                      <LinkButton
                        href={routes.auth.loginPage.href()}
                        color="neutral"
                        variant="outline"
                        size="sm"
                      >
                        {loginLabel}
                      </LinkButton>
                    )}
                    <LinkButton href={primaryCtaHref} color="brand" variant="solid" size="sm">
                      {primaryCtaLabel}
                    </LinkButton>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </header>

        {/* 3. Main Page Content */}
        <main
          id="main-content"
          tabIndex={-1}
          mix={[
            u.vstack(),
            u.grow(),
            u.focusVisible(u.outline("none")),
            u.when("& section[id], & div[id]", u.scrollMargin(24, 0, 0, 0))
          ]}
        >
          {children}
        </main>

        {/* 4. Official Institutional Footer */}
        <footer
          mix={[
            u.bg("var(--acad-primary-deep)"),
            u.fg("#e6efe9"),
            u.borderEdge("top", { width: 4, color: "var(--acad-gold-bright)" }),
            u.pbs(13),
            u.pbe(7)
          ]}
        >
          <div mix={[acadContainer()]}>
            <div
              mix={[
                u.grid(),
                u.gap(8),
                u.media(
                  "(min-width: 56rem)",
                  u.raw({
                    gridTemplateColumns: `1.45fr repeat(${Math.max(1, footerCols.length)}, minmax(0, 1fr))`,
                    gap: "2.25rem"
                  })
                )
              ]}
            >
              {/* Column 1: Trust Seal & Campus Addresses */}
              <div mix={[u.vstack({ gap: 3 })]}>
                <div mix={[u.hstack({ gap: 3, align: "center" })]}>
                  <img
                    src="/images/paart-logo.png"
                    alt="PAART Trust Seal"
                    width={46}
                    height={52}
                    loading="lazy"
                    decoding="async"
                    mix={[u.fit("contain"), u.shrink(0)]}
                  />
                  <div>
                    <p
                      mix={[
                        acadSerif(),
                        u.fontSize("lg"),
                        u.weight("bold"),
                        u.fg("#ffffff"),
                        u.m(0)
                      ]}
                    >
                      {shortName}
                    </p>
                    <p mix={[u.fontSize("xs"), u.fg("#f5c669"), u.m(0), u.mbs(0.5)]}>
                      {trust.legalName}
                    </p>
                  </div>
                </div>

                <p mix={[u.fontSize("sm"), u.leading("relaxed"), u.fg("#cfe0d6"), u.m(0)]}>
                  {trust.summary ||
                    `Public educational & welfare trust established on ${trust.establishedLabel} in Puliyangudi, dedicated to government service coaching, bilingual mentoring, scholarships, and career skills.`}
                </p>

                <div mix={[u.vstack({ gap: 2 }), u.fontSize("xs"), u.fg("#dce9e1")]}>
                  <div mix={[u.hstack({ gap: 2, align: "start" })]}>
                    <MapPinIcon size={15} mix={[u.fg("#f5c669"), u.shrink(0), u.mbs(0.5)]} />
                    <span>{addressPrimary}</span>
                  </div>
                  {addressSecondary && (
                    <div mix={[u.hstack({ gap: 2, align: "start" })]}>
                      <MapPinIcon size={15} mix={[u.fg("#f5c669"), u.shrink(0), u.mbs(0.5)]} />
                      <span>Training Hall: {addressSecondary}</span>
                    </div>
                  )}
                  <div mix={[u.hstack({ gap: 2, align: "center" })]}>
                    <PhoneIcon size={14} mix={[u.fg("#f5c669"), u.shrink(0)]} />
                    <a
                      href={phoneHref}
                      mix={[u.fg("#ffffff"), u.textDecoration("none"), u.weight("semibold")]}
                    >
                      {phone}
                    </a>
                  </div>
                  <div mix={[u.hstack({ gap: 2, align: "center" })]}>
                    <MailIcon size={14} mix={[u.fg("#f5c669"), u.shrink(0)]} />
                    <a href={`mailto:${email}`} mix={[u.fg("#dce9e1"), u.textDecoration("none")]}>
                      {email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Dynamic Database-Driven Footer Columns */}
              {footerCols.map((colItem) => (
                <div key={colItem.heading}>
                  <h2 mix={[footerHeadingMix()]}>{colItem.heading}</h2>
                  <ul mix={[footerListMix()]}>
                    {colItem.links.map((lnk) => (
                      <li key={`${colItem.heading}-${lnk.label}-${lnk.href}`}>
                        <a href={lnk.href}>{lnk.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div
              mix={[
                u.mbs(10),
                u.pbs(5),
                u.borderEdge("top", { width: 1, color: "rgba(255, 255, 255, 0.12)" }),
                u.hstack({ gap: 3, align: "center", justify: "between" }),
                u.flexWrap("wrap"),
                u.fontSize("xs"),
                u.fg("#b7ccc0")
              ]}
            >
              <span>
                © {new Date().getFullYear()} {trust.legalName} (PAART). All rights reserved.
              </span>
              <span>Campus Hours: {hours} · Puliyangudi, Tenkasi District – 627855</span>
            </div>
          </div>
        </footer>
      </div>
    )
  }
}
