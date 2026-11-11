import type { Handle } from "remix/component"
import { CircleCheckIcon } from "@sdxc/icons"
import * as u from "@sdxc/u"
import { Button, Input, Text, TextArea } from "@sdxc/ui"
import { PageHeader } from "@sdxc/ui/app"
import type { AdminUser } from "~/app/initializers/auth"
import type { SiteSettings } from "~/app/models/settings"
import { AdminLayout } from "~/resources/layouts/admin"
import { routes } from "~/routes"

export interface AdminSettingsPageProps {
  user: AdminUser
  settings: SiteSettings
  saved?: boolean
  error?: string | null
}

export function AdminSettingsPage(handle: Handle<AdminSettingsPageProps>) {
  return () => {
    const { user, settings, saved = false, error = null } = handle.props

    return (
      <AdminLayout user={user} currentPath={routes.admin.settings.href()}>
        <PageHeader
          crumbs={[{ label: "Admin", href: routes.admin.index.href() }, { label: "Site Settings" }]}
          title="Institute & SEO Settings"
          description="Update official PAART Academy contact numbers, campus addresses, office hours, and default SEO metadata."
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
              Site settings saved successfully.
            </Text>
          </div>
        )}

        {error && (
          <div
            role="alert"
            mix={[
              u.p(3.5),
              u.rounded("lg"),
              u.border({ width: 1, color: "danger" }),
              u.bg("danger.tint")
            ]}
          >
            <Text mix={[u.fontSize("sm"), u.weight("medium"), u.fg("danger"), u.m(0)]}>
              {error}
            </Text>
          </div>
        )}

        <form
          method="POST"
          action={routes.admin.settingsUpdate.href()}
          mix={[
            u.vstack({ gap: 4 }),
            u.p(6),
            u.rounded("xl"),
            u.border({ width: 1, color: "neutral" }),
            u.bg("var(--ui-surface, var(--ui-bg))")
          ]}
        >
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
            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Institute Name *</Text>
              <Input name="siteName" required defaultValue={settings.siteName} />
            </label>

            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Official Email *</Text>
              <Input name="email" type="email" required defaultValue={settings.email} />
            </label>

            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Primary Phone *</Text>
              <Input name="phone" required defaultValue={settings.phone} />
            </label>

            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                WhatsApp Number (digits) *
              </Text>
              <Input name="whatsapp" required defaultValue={settings.whatsapp} />
            </label>
          </div>

          <label mix={[u.vstack({ gap: 1.5 })]}>
            <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
              Primary Campus Address *
            </Text>
            <Input name="addressPrimary" required defaultValue={settings.addressPrimary} />
          </label>

          <label mix={[u.vstack({ gap: 1.5 })]}>
            <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
              Secondary Campus / Training Hall Address
            </Text>
            <Input name="addressSecondary" defaultValue={settings.addressSecondary} />
          </label>

          <label mix={[u.vstack({ gap: 1.5 })]}>
            <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Working Hours *</Text>
            <Input name="hours" required defaultValue={settings.hours} />
          </label>

          <label mix={[u.vstack({ gap: 1.5 })]}>
            <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Default SEO Title *</Text>
            <Input name="seoTitle" required defaultValue={settings.seoTitle} />
          </label>

          <label mix={[u.vstack({ gap: 1.5 })]}>
            <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
              Default Meta Description *
            </Text>
            <TextArea
              name="seoDescription"
              rows={3}
              required
              defaultValue={settings.seoDescription}
            />
          </label>

          <div mix={[u.hstack({ justify: "end" })]}>
            <Button type="submit" color="brand" variant="solid">
              Save Institute Settings
            </Button>
          </div>
        </form>
      </AdminLayout>
    )
  }
}
