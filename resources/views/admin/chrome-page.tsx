import { fieldName } from "@sdxc/bracket-params"
import { CircleCheckIcon, ExternalLinkIcon, TriangleAlertIcon } from "@sdxc/icons"
import * as u from "@sdxc/u"
import { Badge, Button, Heading, Input, LinkButton, Select, Text, TextArea } from "@sdxc/ui"
import { PageHeader } from "@sdxc/ui/app"
import type { Handle, RemixNode } from "remix/component"
import type { AdminUser } from "~/app/initializers/auth"
import type { SiteChromeConfig } from "~/app/models/cms-schemas"
import { AdminLayout } from "~/resources/layouts/admin"
import { routes } from "~/routes"

export interface AdminChromePageProps {
  user: AdminUser
  chrome: SiteChromeConfig
  version: number
  saved?: boolean
  error?: string | null
  conflictMessage?: string | null
}

function ChromeField(handle: Handle<{ label: string; children?: RemixNode }>) {
  return () => (
    <label mix={[u.vstack({ gap: 1.5 })]}>
      <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>{handle.props.label}</Text>
      {handle.props.children}
    </label>
  )
}

function ChromeBoolSelect(handle: Handle<{ name: string; current: boolean }>) {
  return () => {
    const { name, current } = handle.props
    return (
      <Select name={name}>
        <Select.Option value="true" selected={current}>
          Visible
        </Select.Option>
        <Select.Option value="false" selected={!current}>
          Hidden
        </Select.Option>
      </Select>
    )
  }
}

export function AdminChromePage(handle: Handle<AdminChromePageProps>) {
  return () => {
    const {
      user,
      chrome,
      version,
      saved = false,
      error = null,
      conflictMessage = null
    } = handle.props

    const navWithBlanks = [...chrome.headerNav, { label: "", href: "" }, { label: "", href: "" }]

    const footerWithBlankCol = [
      ...chrome.footerColumns,
      {
        heading: "",
        links: [
          { label: "", href: "" },
          { label: "", href: "" }
        ]
      }
    ]

    return (
      <AdminLayout user={user} currentPath={routes.admin.chrome.href()}>
        <PageHeader
          crumbsLabel="Breadcrumb"
          crumbs={[
            { label: "Admin", href: routes.admin.index.href() },
            { label: "Navigation & Footer" }
          ]}
          title="Site Chrome & Trust Identity Studio"
          description="Manage the global utility announcement bar, primary header navigation, trust contact details, and multi-column footer across every public page."
          status={
            <Badge color="brand" variant="secondary">
              Chrome v{version}
            </Badge>
          }
          actions={
            <LinkButton href={routes.home.href()} variant="outline" color="neutral">
              <span>Inspect Live Header & Footer</span>
              <ExternalLinkIcon size={13} />
            </LinkButton>
          }
        />

        {saved && (
          <div
            role="status"
            mix={[
              u.hstack({ gap: 2.5, align: "center" }),
              u.p(3.5),
              u.rounded("lg"),
              u.border({ width: 1, color: "success" }),
              u.bg("success.tint")
            ]}
          >
            <CircleCheckIcon size={18} mix={[u.fg("success"), u.shrink(0)]} />
            <Text mix={[u.fontSize("sm"), u.weight("medium"), u.fg("success"), u.m(0)]}>
              Site chrome published (v{version}) and public layout cache invalidated immediately.
            </Text>
          </div>
        )}

        {conflictMessage && (
          <div
            role="alert"
            mix={[
              u.hstack({ gap: 2.5, align: "center" }),
              u.p(3.5),
              u.rounded("lg"),
              u.border({ width: 1, color: "warning" }),
              u.bg("warning.tint")
            ]}
          >
            <TriangleAlertIcon size={18} mix={[u.fg("warning"), u.shrink(0)]} />
            <Text mix={[u.fontSize("sm"), u.weight("medium"), u.fg("warning"), u.m(0)]}>
              {conflictMessage}
            </Text>
          </div>
        )}

        {error && (
          <div
            role="alert"
            mix={[
              u.hstack({ gap: 2.5, align: "center" }),
              u.p(3.5),
              u.rounded("lg"),
              u.border({ width: 1, color: "danger" }),
              u.bg("danger.tint")
            ]}
          >
            <TriangleAlertIcon size={18} mix={[u.fg("danger"), u.shrink(0)]} />
            <Text mix={[u.fontSize("sm"), u.weight("medium"), u.fg("danger"), u.m(0)]}>
              {error}
            </Text>
          </div>
        )}

        <form method="POST" action={routes.admin.chromeUpdate.href()} mix={[u.vstack({ gap: 5 })]}>
          <input type="hidden" name="expectedVersion" value={String(version)} />

          {/* 1. Top Institutional Utility Bar */}
          <section
            mix={[
              u.vstack({ gap: 3.5 }),
              u.p(5),
              u.rounded("xl"),
              u.border({ width: 1, color: "neutral" }),
              u.bg("var(--ui-surface, var(--ui-bg))")
            ]}
          >
            <Heading level={2} mix={[u.fontSize("md"), u.weight("semibold"), u.m(0)]}>
              Top Institutional Utility Bar
            </Heading>

            <div
              mix={[
                u.grid(),
                u.gap(3.5),
                u.media(
                  "(min-width: 48rem)",
                  u.raw({ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" })
                )
              ]}
            >
              <ChromeField label="Announcement Badge Text (optional)">
                <Input
                  name={fieldName(["utilityBar", "badgeText"])}
                  defaultValue={chrome.utilityBar.badgeText}
                  placeholder="e.g. 2027 Batch Registrations Open"
                />
              </ChromeField>
              <ChromeField label="Show Campus Hours">
                <ChromeBoolSelect
                  name={fieldName(["utilityBar", "showHours"])}
                  current={chrome.utilityBar.showHours}
                />
              </ChromeField>
              <ChromeField label="Show Helpline Phone">
                <ChromeBoolSelect
                  name={fieldName(["utilityBar", "showPhone"])}
                  current={chrome.utilityBar.showPhone}
                />
              </ChromeField>
            </div>

            <div
              mix={[
                u.grid(),
                u.gap(3.5),
                u.media(
                  "(min-width: 48rem)",
                  u.raw({ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" })
                )
              ]}
            >
              <ChromeField label="Quick Resource Link Label">
                <Input
                  name={fieldName(["utilityBar", "resourceLabel"])}
                  defaultValue={chrome.utilityBar.resourceLabel}
                />
              </ChromeField>
              <ChromeField label="Quick Resource Link URL">
                <Input
                  name={fieldName(["utilityBar", "resourceHref"])}
                  defaultValue={chrome.utilityBar.resourceHref}
                />
              </ChromeField>
            </div>
          </section>

          {/* 2. Header Navigation & Action Buttons */}
          <section
            mix={[
              u.vstack({ gap: 3.5 }),
              u.p(5),
              u.rounded("xl"),
              u.border({ width: 1, color: "neutral" }),
              u.bg("var(--ui-surface, var(--ui-bg))")
            ]}
          >
            <div mix={[u.vstack({ gap: 0.5 })]}>
              <Heading level={2} mix={[u.fontSize("md"), u.weight("semibold"), u.m(0)]}>
                Header Navigation & Portal CTAs
              </Heading>
              <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                Clear both label and URL to remove a link; fill an empty row at the bottom to add a
                new menu item.
              </Text>
            </div>

            <div mix={[u.vstack({ gap: 2 })]}>
              {navWithBlanks.map((item, idx) => (
                <div
                  key={`nav-${idx}`}
                  mix={[
                    u.grid(),
                    u.gap(2.5),
                    u.media("(min-width: 48rem)", u.raw({ gridTemplateColumns: "1fr 1fr" }))
                  ]}
                >
                  <Input
                    name={fieldName(["headerNav", idx, "label"])}
                    defaultValue={item.label}
                    placeholder={`Nav link #${idx + 1} label (e.g. Courses)`}
                  />
                  <Input
                    name={fieldName(["headerNav", idx, "href"])}
                    defaultValue={item.href}
                    placeholder={`Nav link #${idx + 1} URL (e.g. /courses)`}
                  />
                </div>
              ))}
            </div>

            <div
              mix={[
                u.grid(),
                u.gap(3.5),
                u.mbs(2),
                u.media(
                  "(min-width: 48rem)",
                  u.raw({ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" })
                )
              ]}
            >
              <ChromeField label="Primary Header CTA Label *">
                <Input
                  name={fieldName(["headerCtas", "primaryLabel"])}
                  required
                  defaultValue={chrome.headerCtas.primaryLabel}
                />
              </ChromeField>
              <ChromeField label="Primary Header CTA URL *">
                <Input
                  name={fieldName(["headerCtas", "primaryHref"])}
                  required
                  defaultValue={chrome.headerCtas.primaryHref}
                />
              </ChromeField>
              <ChromeField label="Guest Login Button Label *">
                <Input
                  name={fieldName(["headerCtas", "loginLabel"])}
                  required
                  defaultValue={chrome.headerCtas.loginLabel}
                />
              </ChromeField>
            </div>
          </section>

          {/* 3. Institutional Trust Profile */}
          <section
            mix={[
              u.vstack({ gap: 3.5 }),
              u.p(5),
              u.rounded("xl"),
              u.border({ width: 1, color: "neutral" }),
              u.bg("var(--ui-surface, var(--ui-bg))")
            ]}
          >
            <Heading level={2} mix={[u.fontSize("md"), u.weight("semibold"), u.m(0)]}>
              Educational Trust Identity & Campus Contact Details
            </Heading>

            <div
              mix={[
                u.grid(),
                u.gap(3.5),
                u.media(
                  "(min-width: 48rem)",
                  u.raw({ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" })
                )
              ]}
            >
              <ChromeField label="Short Brand Name *">
                <Input
                  name={fieldName(["trustProfile", "shortName"])}
                  required
                  defaultValue={chrome.trustProfile.shortName}
                />
              </ChromeField>
              <ChromeField label="Registered Legal Trust Name *">
                <Input
                  name={fieldName(["trustProfile", "legalName"])}
                  required
                  defaultValue={chrome.trustProfile.legalName}
                />
              </ChromeField>
              <ChromeField label="Established ISO Date">
                <Input
                  name={fieldName(["trustProfile", "establishedDate"])}
                  defaultValue={chrome.trustProfile.establishedDate}
                />
              </ChromeField>
              <ChromeField label="Established Display Label *">
                <Input
                  name={fieldName(["trustProfile", "establishedLabel"])}
                  required
                  defaultValue={chrome.trustProfile.establishedLabel}
                />
              </ChromeField>
              <ChromeField label="Primary Phone *">
                <Input
                  name={fieldName(["trustProfile", "phone"])}
                  required
                  defaultValue={chrome.trustProfile.phone}
                />
              </ChromeField>
              <ChromeField label="WhatsApp Digits">
                <Input
                  name={fieldName(["trustProfile", "whatsapp"])}
                  defaultValue={chrome.trustProfile.whatsapp}
                />
              </ChromeField>
              <ChromeField label="Official Email *">
                <Input
                  name={fieldName(["trustProfile", "email"])}
                  type="email"
                  required
                  defaultValue={chrome.trustProfile.email}
                />
              </ChromeField>
              <ChromeField label="Operating Hours *">
                <Input
                  name={fieldName(["trustProfile", "hours"])}
                  required
                  defaultValue={chrome.trustProfile.hours}
                />
              </ChromeField>
            </div>

            <ChromeField label="Masthead Tagline">
              <Input
                name={fieldName(["trustProfile", "tagline"])}
                defaultValue={chrome.trustProfile.tagline}
              />
            </ChromeField>

            <ChromeField label="Primary Campus Address *">
              <Input
                name={fieldName(["trustProfile", "addressPrimary"])}
                required
                defaultValue={chrome.trustProfile.addressPrimary}
              />
            </ChromeField>

            <ChromeField label="Secondary Training Hall Address">
              <Input
                name={fieldName(["trustProfile", "addressSecondary"])}
                defaultValue={chrome.trustProfile.addressSecondary}
              />
            </ChromeField>

            <ChromeField label="Institutional Summary (Footer & Schema.org)">
              <TextArea
                name={fieldName(["trustProfile", "summary"])}
                rows={3}
                defaultValue={chrome.trustProfile.summary}
              />
            </ChromeField>
          </section>

          {/* 4. Multi-Column Footer Links */}
          <section
            mix={[
              u.vstack({ gap: 4 }),
              u.p(5),
              u.rounded("xl"),
              u.border({ width: 1, color: "neutral" }),
              u.bg("var(--ui-surface, var(--ui-bg))")
            ]}
          >
            <div mix={[u.vstack({ gap: 0.5 })]}>
              <Heading level={2} mix={[u.fontSize("md"), u.weight("semibold"), u.m(0)]}>
                Multi-Column Footer Navigation
              </Heading>
              <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                Edit column headings and links. Leave unused rows or the trailing new-column card
                blank to omit.
              </Text>
            </div>

            <div mix={[u.vstack({ gap: 3.5 })]}>
              {footerWithBlankCol.map((col, cIdx) => {
                const linksWithBlanks =
                  col.heading.length > 0
                    ? [...col.links, { label: "", href: "" }, { label: "", href: "" }]
                    : col.links
                return (
                  <div
                    key={`fcol-${cIdx}`}
                    mix={[
                      u.vstack({ gap: 2.5 }),
                      u.p(4),
                      u.rounded("lg"),
                      u.border({ width: 1, color: "neutral" }),
                      u.bg("var(--ui-bg)")
                    ]}
                  >
                    <ChromeField label={`Footer Column #${cIdx + 1} Heading`}>
                      <Input
                        name={fieldName(["footerColumns", cIdx, "heading"])}
                        defaultValue={col.heading}
                        placeholder="e.g. Academic Links or Exam Streams"
                      />
                    </ChromeField>

                    {linksWithBlanks.map((lnk, lIdx) => (
                      <div
                        key={`flnk-${cIdx}-${lIdx}`}
                        mix={[
                          u.grid(),
                          u.gap(2.5),
                          u.media("(min-width: 48rem)", u.raw({ gridTemplateColumns: "1fr 1fr" }))
                        ]}
                      >
                        <Input
                          name={fieldName(["footerColumns", cIdx, "links", lIdx, "label"])}
                          defaultValue={lnk.label}
                          placeholder="Link label..."
                        />
                        <Input
                          name={fieldName(["footerColumns", cIdx, "links", lIdx, "href"])}
                          defaultValue={lnk.href}
                          placeholder="/courses or https://..."
                        />
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </section>

          <div
            mix={[
              u.hstack({ gap: 3, align: "center", justify: "end" }),
              u.p(4),
              u.rounded("xl"),
              u.border({ width: 1, color: "neutral" }),
              u.bg("var(--ui-surface, var(--ui-bg))")
            ]}
          >
            <Button type="submit" color="brand" variant="solid">
              Publish Site Chrome & Purge Public Cache
            </Button>
          </div>
        </form>
      </AdminLayout>
    )
  }
}
