import type { Handle } from "remix/component"
import { LockIcon, LogOutIcon } from "@sdxc/icons"
import * as u from "@sdxc/u"
import { Badge, Button, Input, Text } from "@sdxc/ui"
import type { SessionUser } from "~/app/initializers/auth"
import type { SiteSettings } from "~/app/models/settings"
import {
  AcademicSection,
  acadCard,
  acadRubric,
  acadSerif
} from "~/resources/components/academic-ui"
import { LandingLayout } from "~/resources/layouts/landing"
import { routes } from "~/routes"

export interface ChangePasswordPageProps {
  user: SessionUser
  settings: SiteSettings
  error?: string | null
}

export function ChangePasswordPage(handle: Handle<ChangePasswordPageProps>) {
  return () => {
    const { user, settings, error } = handle.props

    return (
      <LandingLayout user={user} settings={settings}>
        <AcademicSection tone="paper">
          <div
            mix={[
              acadCard("gold"),
              u.vstack({ gap: 5 }),
              u.maxWidth("31rem"),
              u.mi("auto"),
              u.p(7),
              u.shadow("md")
            ]}
          >
            <div mix={[u.vstack({ gap: 2, align: "start" })]}>
              <div mix={[u.hstack({ gap: 2, align: "center" }), u.flexWrap("wrap")]}>
                <div
                  mix={[
                    u.p(2),
                    u.rounded("md"),
                    u.bg("var(--acad-primary-soft)"),
                    u.fg("var(--acad-primary)")
                  ]}
                >
                  <LockIcon size={18} />
                </div>
                <p mix={[acadRubric(), u.m(0)]}>Account Security</p>
                <Badge color="brand" variant="outline" mix={[u.self("start")]}>
                  {user.role.toUpperCase()}
                </Badge>
              </div>

              <h1
                mix={[
                  acadSerif(),
                  u.fontSize("2xl"),
                  u.weight("bold"),
                  u.fg("var(--acad-ink)"),
                  u.m(0)
                ]}
              >
                {user.mustChangePassword
                  ? "Set Your Permanent Password"
                  : "Update Account Password"}
              </h1>

              <Text
                mix={[u.fontSize("sm"), u.leading("relaxed"), u.fg("var(--acad-muted)"), u.m(0)]}
              >
                Signed in as <strong>{user.fullName}</strong> ({user.email}).{" "}
                {user.mustChangePassword
                  ? "Because you signed in with an administrator-issued temporary password, you must choose a new personal password (at least 12 characters) before continuing."
                  : "Choose a strong passphrase of at least 12 characters that does not contain your name or email."}
              </Text>
            </div>

            {error && (
              <div
                role="alert"
                mix={[
                  u.p(3.5),
                  u.rounded("md"),
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
              action={routes.auth.changePassword.href()}
              mix={[u.vstack({ gap: 4 })]}
            >
              <label mix={[u.vstack({ gap: 1.5 })]}>
                <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                  Current / Temporary Password
                </Text>
                <Input
                  name="currentPassword"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="Enter your current password"
                />
              </label>

              <label mix={[u.vstack({ gap: 1.5 })]}>
                <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                  New Password (minimum 12 characters)
                </Text>
                <Input
                  name="newPassword"
                  type="password"
                  required
                  minLength={12}
                  autoComplete="new-password"
                  placeholder="Enter a strong new password or passphrase"
                />
              </label>

              <label mix={[u.vstack({ gap: 1.5 })]}>
                <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                  Confirm New Password
                </Text>
                <Input
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={12}
                  autoComplete="new-password"
                  placeholder="Re-enter your new password"
                />
              </label>

              <Button type="submit" color="brand" variant="solid" mix={[u.width("full")]}>
                <span>Save New Password &amp; Continue</span>
              </Button>
            </form>

            <div
              mix={[
                u.hstack({ justify: "between", align: "center" }),
                u.pbs(3),
                u.borderEdge("top", { width: 1, color: "var(--acad-border)" })
              ]}
            >
              <Text mix={[u.fontSize("xs"), u.fg("var(--acad-muted)"), u.m(0)]}>
                Need to sign in as a different user?
              </Text>
              <form method="POST" action={routes.auth.logout.href()}>
                <Button type="submit" size="sm" variant="ghost" color="neutral">
                  <LogOutIcon size={14} />
                  <span>Sign Out</span>
                </Button>
              </form>
            </div>
          </div>
        </AcademicSection>
      </LandingLayout>
    )
  }
}
