import type { Handle, RemixNode } from "remix/component"
import { ClockIcon, MailIcon, MapPinIcon, MenuIcon, PhoneIcon, ShieldCheckIcon } from "@sdxc/icons"
import * as u from "@sdxc/u"
import { LinkButton, Text } from "@sdxc/ui"
import type { AdminUser } from "~/app/initializers/auth"
import type { SiteSettings } from "~/app/models/settings"
import { TRUST_PROFILE } from "~/config/trust"
import { acadContainer, acadSerif } from "~/resources/components/academic-ui"
import { ThemeToggle } from "~/resources/components/theme-toggle"
import { routes } from "~/routes"

export interface LandingLayoutProps {
  user?: AdminUser | null
  settings?: SiteSettings
  children?: RemixNode
}

const NAV_ITEMS = [
  { label: "Home", href: routes.home.href() },
  { label: "Courses", href: routes.courses.index.href() },
  { label: "Study Materials", href: routes.materials.href() },
  { label: "About & Results", href: routes.about.href() },
  { label: "Gallery", href: routes.gallery.href() },
  { label: "Exam Blog", href: routes.blogs.index.href() },
  { label: "FAQ", href: routes.faq.href() },
  { label: "Contact", href: routes.contact.href() }
] as const

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

export function LandingLayout(handle: Handle<LandingLayoutProps>) {
  return () => {
    const { user, settings, children } = handle.props
    const phone = settings?.phone ?? TRUST_PROFILE.phone
    const phoneHref = `tel:${phone.replace(/\s+/g, "")}`
    const email = settings?.email ?? TRUST_PROFILE.email
    const addressPrimary = settings?.addressPrimary ?? TRUST_PROFILE.addressPrimary
    const addressSecondary = settings?.addressSecondary ?? TRUST_PROFILE.addressSecondary
    const hours = settings?.hours ?? TRUST_PROFILE.hours

    return (
      <div mix={[u.minHeight("100vh"), u.vstack()]}>
        <SkipToContentLink />

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
              <span>
                <strong>{TRUST_PROFILE.legalName}</strong> · Est. {TRUST_PROFILE.establishedLabel}
              </span>
            </div>

            <div mix={[u.hstack({ gap: 4, align: "center" }), u.flexWrap("wrap")]}>
              <span
                mix={[
                  u.hidden(),
                  u.media("(min-width: 56rem)", u.hstack({ gap: 1.5, align: "center" }))
                ]}
              >
                <ClockIcon size={13} aria-hidden="true" mix={[u.fg("#f5c669")]} />
                <span>{hours}</span>
              </span>

              <a href={phoneHref} mix={[u.hstack({ gap: 1.5, align: "center" })]}>
                <PhoneIcon size={13} aria-hidden="true" mix={[u.fg("#f5c669")]} />
                <span>{phone}</span>
              </a>

              <a
                href={routes.materials.href()}
                mix={[u.hidden(), u.media("(min-width: 56rem)", u.inlineFlex())]}
              >
                Free PDF Notes
              </a>
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
              aria-label="PAART Academy Home"
              mix={[
                u.hstack({ gap: 3.5, align: "center" }),
                u.textDecoration("none"),
                u.fg("inherit"),
                u.minWidth(0)
              ]}
            >
              <img
                src="/images/paart-logo.png"
                alt="PAART Academy Official Crest"
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
                  PAART Academy
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
                  Puliyangudi, Tenkasi Dist. · Competitive Exam &amp; Skill Coaching
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
              {NAV_ITEMS.map((item) => (
                <a key={item.href} href={item.href} mix={[navLinkMix()]}>
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
              {user ? (
                <LinkButton
                  href={routes.admin.index.href()}
                  color="neutral"
                  variant="outline"
                  size="sm"
                >
                  Admin Console
                </LinkButton>
              ) : (
                <LinkButton
                  href={routes.contact.href()}
                  color="neutral"
                  variant="outline"
                  size="sm"
                >
                  Enquire
                </LinkButton>
              )}
              <LinkButton
                href={routes.admissions.apply.href()}
                color="brand"
                variant="solid"
                size="sm"
              >
                Admission Form
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
                  {NAV_ITEMS.map((item) => (
                    <a key={item.href} href={item.href} mix={[navLinkMix()]}>
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
                    {user ? (
                      <LinkButton
                        href={routes.admin.index.href()}
                        color="neutral"
                        variant="outline"
                        size="sm"
                      >
                        Admin Console
                      </LinkButton>
                    ) : (
                      <LinkButton
                        href={routes.contact.href()}
                        color="neutral"
                        variant="outline"
                        size="sm"
                      >
                        Campus Enquiry
                      </LinkButton>
                    )}
                    <LinkButton
                      href={routes.admissions.apply.href()}
                      color="brand"
                      variant="solid"
                      size="sm"
                    >
                      Online Admission Form
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
                  u.raw({ gridTemplateColumns: "1.45fr 1fr 1fr 1fr", gap: "2.25rem" })
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
                      PAART Academy
                    </p>
                    <p mix={[u.fontSize("xs"), u.fg("#f5c669"), u.m(0), u.mbs(0.5)]}>
                      {TRUST_PROFILE.legalName}
                    </p>
                  </div>
                </div>

                <p mix={[u.fontSize("sm"), u.leading("relaxed"), u.fg("#cfe0d6"), u.m(0)]}>
                  Public educational &amp; welfare trust established on{" "}
                  {TRUST_PROFILE.establishedLabel} in Puliyangudi, dedicated to government service
                  coaching, bilingual mentoring, scholarships, and career skills.
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

              {/* Column 2: Coaching Programmes */}
              <div>
                <h2 mix={[footerHeadingMix()]}>Exam Programmes</h2>
                <ul mix={[footerListMix()]}>
                  <li>
                    <a href={routes.courses.show.href({ slug: "tnpsc-group-1" })}>
                      TNPSC Group I, II &amp; IIA
                    </a>
                  </li>
                  <li>
                    <a href={routes.courses.show.href({ slug: "tnpsc-group-4" })}>
                      TNPSC Group IV &amp; VAO
                    </a>
                  </li>
                  <li>
                    <a href={routes.courses.show.href({ slug: "tnusrb-si" })}>
                      TNUSRB Sub-Inspector &amp; PC
                    </a>
                  </li>
                  <li>
                    <a href={routes.courses.index.href()}>TET, SSC, Banking &amp; Railway</a>
                  </li>
                  <li>
                    <a href={routes.admissions.apply.href()}>
                      NMMS, Typewriting &amp; Computer Skills
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 3: Student Resource Desk */}
              <div>
                <h2 mix={[footerHeadingMix()]}>Student Help Desk</h2>
                <ul mix={[footerListMix()]}>
                  <li>
                    <a href={routes.admissions.apply.href()}>Online Admission Form</a>
                  </li>
                  <li>
                    <a href={routes.materials.href()}>Free Study Materials &amp; Notes</a>
                  </li>
                  <li>
                    <a href={routes.blogs.index.href()}>Exam Preparation Articles</a>
                  </li>
                  <li>
                    <a href={routes.faq.href()}>Frequently Asked Questions</a>
                  </li>
                  <li>
                    <a href={routes.contact.href()}>Batch Timings &amp; Counselling</a>
                  </li>
                </ul>
              </div>

              {/* Column 4: About Trust & Governance */}
              <div>
                <h2 mix={[footerHeadingMix()]}>Trust &amp; Campus</h2>
                <ul mix={[footerListMix()]}>
                  <li>
                    <a href={routes.about.href()}>About PAART Trust &amp; Vision</a>
                  </li>
                  <li>
                    <a href={`${routes.about.href()}#results`}>323+ Selection Track Record</a>
                  </li>
                  <li>
                    <a href={routes.gallery.href()}>Classroom &amp; Exam Gallery</a>
                  </li>
                  <li>
                    <a href={routes.contact.href()}>Puliyangudi Campus Map</a>
                  </li>
                  <li>
                    <a href={routes.auth.signIn.href()}>Staff / Admin Login</a>
                  </li>
                </ul>
              </div>
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
                © {new Date().getFullYear()} {TRUST_PROFILE.legalName} (PAART). All rights reserved.
              </span>
              <span>Campus Hours: {hours} · Puliyangudi, Tenkasi District – 627855</span>
            </div>
          </div>
        </footer>
      </div>
    )
  }
}
