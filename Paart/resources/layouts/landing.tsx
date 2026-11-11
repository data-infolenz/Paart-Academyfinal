import type { Handle, RemixNode } from "remix/component"
import * as u from "@sdxc/u"
import { DialogDismiss, Link, LinkButton, Text } from "@sdxc/ui"
import { SiteFooter, SiteHeader } from "@sdxc/ui/landing"
import type { AdminUser } from "~/app/initializers/auth"
import type { SiteSettings } from "~/app/models/settings"
import { TRUST_PROFILE } from "~/config/trust"
import { ThemeToggle } from "~/resources/components/theme-toggle"
import { routes } from "~/routes"

export interface LandingLayoutProps {
  user?: AdminUser | null
  settings?: SiteSettings
  children?: RemixNode
}

const HEADER_ITEMS: SiteHeader.Item[] = [
  { label: "Courses", href: routes.courses.index.href() },
  { label: "Study Materials", href: routes.materials.href() },
  { label: "About & Impact", href: routes.about.href() },
  { label: "Gallery", href: routes.gallery.href() },
  { label: "Blogs", href: routes.blogs.index.href() },
  { label: "Contact", href: routes.contact.href() }
]

const FOOTER_COLUMNS: SiteFooter.Column[] = [
  {
    title: "Exam Programmes",
    links: [
      {
        label: "TNPSC Group I, II & IIA",
        href: routes.courses.show.href({ slug: "tnpsc-group-1" })
      },
      { label: "TNPSC Group IV & VAO", href: routes.courses.show.href({ slug: "tnpsc-group-4" }) },
      { label: "TNUSRB SI & Constable", href: routes.courses.show.href({ slug: "tnusrb-si" }) },
      { label: "TET, SSC, Banking & RRB", href: routes.courses.index.href() }
    ]
  },
  {
    title: "Student Resources",
    links: [
      { label: "Free Study Materials", href: routes.materials.href() },
      { label: "Preparation Blog", href: routes.blogs.index.href() },
      { label: "Frequently Asked Questions", href: routes.faq.href() },
      { label: "Online Admission Form", href: routes.admissions.apply.href() }
    ]
  },
  {
    title: "Trust & Campus",
    links: [
      { label: "About PAART Trust", href: routes.about.href() },
      { label: "Gallery & Events", href: routes.gallery.href() },
      { label: "Campus & Contact", href: routes.contact.href() },
      { label: "Admin Sign In", href: routes.auth.signIn.href() }
    ]
  }
]

export function BrandMark(_handle: Handle) {
  return () => (
    <div mix={[u.hstack({ gap: 2.5, align: "center" })]}>
      <img
        src="/images/paart-logo.png"
        alt="PAART Academy Logo"
        width={34}
        height={38}
        decoding="async"
        mix={[u.fit("contain"), u.shrink(0)]}
      />
      <div mix={[u.vstack({ gap: 0 })]}>
        <Text mix={[u.fontSize("base"), u.weight("bold"), u.fg("neutral.emphasis"), u.m(0)]}>
          PAART Academy
        </Text>
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
    const email = settings?.email ?? TRUST_PROFILE.email
    const address = settings?.addressPrimary ?? TRUST_PROFILE.addressPrimary
    const hours = settings?.hours ?? TRUST_PROFILE.hours

    return (
      <div mix={[u.minHeight("100vh"), u.vstack(), u.fg(), u.font("sans")]}>
        <SkipToContentLink />

        <SiteHeader
          id="paart-site-header"
          collapseAt="xl"
          navLabel="Main Navigation"
          menuLabel="Toggle navigation menu"
          closeLabel="Close navigation menu"
          brand={
            <Link
              href={routes.home.href()}
              aria-label="PAART Academy Home"
              mix={[u.hstack({ gap: 2.5, align: "center" }), u.textDecoration("none")]}
            >
              <BrandMark />
            </Link>
          }
          items={HEADER_ITEMS}
          tools={
            <div mix={[u.hstack({ gap: 2, align: "center" })]}>
              <ThemeToggle />
            </div>
          }
          actions={
            user
              ? [{ label: "Admin Console", href: routes.admin.index.href() }]
              : [{ label: "Enquire", href: routes.contact.href() }]
          }
          cta={{
            label: "Apply for Admission",
            href: routes.admissions.apply.href()
          }}
          sheet={<DialogDismiss />}
        />

        <main
          id="main-content"
          tabIndex={-1}
          mix={[
            u.vstack(),
            u.grow(),
            u.focusVisible(u.outline("none")),
            u.bg(),
            u.when("& section[id], & div[id]", u.scrollMargin(20, 0, 0, 0))
          ]}
        >
          {children}
        </main>

        <SiteFooter
          brand={
            <Link
              href={routes.home.href()}
              aria-label="PAART Academy Home"
              mix={[u.hstack({ gap: 2.5, align: "center" }), u.textDecoration("none")]}
            >
              <BrandMark />
            </Link>
          }
          tagline={`${TRUST_PROFILE.legalName} — ${address} · ${phone} · ${email} · ${hours}`}
          columns={FOOTER_COLUMNS}
          legal={
            <Text mix={[u.fg("neutral.muted"), u.m(0)]}>
              © {new Date().getFullYear()} {TRUST_PROFILE.legalName} (PAART). All rights reserved.
            </Text>
          }
          mix={[u.bg("surface.raised")]}
        />
      </div>
    )
  }
}
