import type { Handle } from "remix/component"
import { LockIcon, ShieldCheckIcon } from "@sdxc/icons"
import * as u from "@sdxc/u"
import { Button, Input, Text } from "@sdxc/ui"
import type { SiteSettings } from "~/app/models/settings"
import {
  AcademicSection,
  acadCard,
  acadRubric,
  acadSerif
} from "~/resources/components/academic-ui"
import { LandingLayout } from "~/resources/layouts/landing"
import { routes } from "~/routes"

export interface SignInPageProps {
  settings: SiteSettings
  error?: string | null
  notice?: string | null
  defaultEmail?: string
}

export function SignInPage(handle: Handle<SignInPageProps>) {
  return () => {
    const { settings, error, notice, defaultEmail = "" } = handle.props

    return (
      <LandingLayout user={null} settings={settings}>
        <AcademicSection tone="paper">
          <div
            mix={[
              acadCard("primary"),
              u.vstack({ gap: 5 }),
              u.maxWidth("29rem"),
              u.mi("auto"),
              u.p(7),
              u.shadow("md")
            ]}
          >
            <div mix={[u.vstack({ gap: 1.5, align: "start" })]}>
              <div mix={[u.hstack({ gap: 2.5, align: "center" })]}>
                <div
                  mix={[
                    u.hstack({ align: "center", justify: "center" }),
                    u.p(2.5),
                    u.rounded("md"),
                    u.bg("var(--acad-primary-soft)"),
                    u.fg("var(--acad-primary)")
                  ]}
                >
                  <LockIcon size={20} />
                </div>
                <p mix={[acadRubric(), u.m(0)]}>Institutional Access</p>
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
                PAART Academy Portal Sign In
              </h1>
              <Text
                mix={[u.fontSize("sm"), u.leading("relaxed"), u.fg("var(--acad-muted)"), u.m(0)]}
              >
                Sign in with your academy email and password to access the Aspirant Portal, Teaching
                Faculty Workspace, or Administration Console.
              </Text>
            </div>

            {notice && (
              <div
                role="status"
                mix={[
                  u.p(3.5),
                  u.rounded("md"),
                  u.border({ width: 1, color: "success" }),
                  u.bg("success.tint")
                ]}
              >
                <Text mix={[u.fontSize("sm"), u.weight("medium"), u.fg("success"), u.m(0)]}>
                  {notice}
                </Text>
              </div>
            )}

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

            <form method="POST" action={routes.auth.login.href()} mix={[u.vstack({ gap: 4 })]}>
              <label mix={[u.vstack({ gap: 1.5 })]}>
                <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                  Registered Email Address
                </Text>
                <Input
                  name="email"
                  type="email"
                  required
                  autoComplete="username"
                  defaultValue={defaultEmail}
                  placeholder="name@paart.in"
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
                <span>Sign In to Workspace</span>
              </Button>
            </form>

            <div
              mix={[
                u.vstack({ gap: 2 }),
                u.pbs(3.5),
                u.borderEdge("top", { width: 1, color: "var(--acad-border)" })
              ]}
            >
              <div mix={[u.hstack({ gap: 2, align: "center" })]}>
                <ShieldCheckIcon size={15} mix={[u.fg("var(--acad-primary)"), u.shrink(0)]} />
                <Text mix={[u.fontSize("xs"), u.fg("var(--acad-muted)"), u.m(0)]}>
                  Accounts are provisioned by PAART Academy Administration upon batch enrollment or
                  faculty appointment.
                </Text>
              </div>
            </div>
          </div>
        </AcademicSection>
      </LandingLayout>
    )
  }
}
