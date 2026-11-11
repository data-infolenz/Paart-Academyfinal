import type { Handle } from "remix/component"
import { LockIcon, ShieldCheckIcon } from "@sdxc/icons"
import * as u from "@sdxc/u"
import { Button, Heading, HeadingScope, Input, Text } from "@sdxc/ui"
import { LandingSection } from "@sdxc/ui/landing"
import type { SiteSettings } from "~/app/models/settings"
import { LandingLayout } from "~/resources/layouts/landing"
import { routes } from "~/routes"

export interface SignInPageProps {
  settings: SiteSettings
  error?: string | null
  defaultEmail?: string
}

export function SignInPage(handle: Handle<SignInPageProps>) {
  return () => {
    const { settings, error, defaultEmail = "" } = handle.props

    return (
      <LandingLayout user={null} settings={settings}>
        <LandingSection variant="frame" ruled>
          <HeadingScope level={1}>
            <div
              mix={[
                u.vstack({ gap: 5 }),
                u.maxWidth("26rem"),
                u.mi("auto"),
                u.p(7),
                u.rounded("xl"),
                u.border({ width: 1, color: "neutral" }),
                u.bg("var(--ui-surface, var(--ui-bg))")
              ]}
            >
              <div mix={[u.vstack({ gap: 2, align: "center" }), u.textAlign("center")]}>
                <div
                  mix={[
                    u.hstack({ align: "center", justify: "center" }),
                    u.p(3),
                    u.rounded("full"),
                    u.bg("brand.tint"),
                    u.fg("brand")
                  ]}
                >
                  <LockIcon size={22} />
                </div>
                <Heading level={1} mix={[u.fontSize("xl"), u.weight("bold"), u.m(0)]}>
                  PAART Admin Console
                </Heading>
                <Text mix={[u.fontSize("sm"), u.fg("neutral.muted"), u.m(0)]}>
                  Sign in with your administrator credentials to manage admissions, enquiries, and
                  academic content.
                </Text>
              </div>

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

              <form method="POST" action={routes.auth.login.href()} mix={[u.vstack({ gap: 4 })]}>
                <label mix={[u.vstack({ gap: 1.5 })]}>
                  <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                    Administrator Email
                  </Text>
                  <Input
                    name="email"
                    type="email"
                    required
                    autoComplete="username"
                    defaultValue={defaultEmail}
                    placeholder="admin@paart.in"
                  />
                </label>

                <label mix={[u.vstack({ gap: 1.5 })]}>
                  <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Password</Text>
                  <Input
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    placeholder="••••••••••••"
                  />
                </label>

                <Button type="submit" color="brand" variant="solid" mix={[u.width("full")]}>
                  <span>Sign In to Admin</span>
                </Button>
              </form>

              <div
                mix={[
                  u.hstack({ gap: 2, align: "center", justify: "center" }),
                  u.pbs(3),
                  u.borderEdge("top", { width: 1 }),
                  u.border({ color: "neutral" })
                ]}
              >
                <ShieldCheckIcon size={14} mix={[u.fg("brand")]} />
                <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                  Protected by PBKDF2-SHA256 &amp; HMAC HttpOnly session cookies
                </Text>
              </div>
            </div>
          </HeadingScope>
        </LandingSection>
      </LandingLayout>
    )
  }
}
