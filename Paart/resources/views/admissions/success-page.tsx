import type { Handle } from "remix/component"
import { ArrowRightIcon, CircleCheckIcon, PhoneIcon } from "@sdxc/icons"
import * as u from "@sdxc/u"
import { Badge, Heading, HeadingScope, LinkButton, Text } from "@sdxc/ui"
import { LandingSection } from "@sdxc/ui/landing"
import type { AdminUser } from "~/app/initializers/auth"
import type { SiteSettings } from "~/app/models/settings"
import { LandingLayout } from "~/resources/layouts/landing"
import { routes } from "~/routes"

export interface AdmissionSuccessPageProps {
  user?: AdminUser | null
  settings: SiteSettings
  applicationId: string
}

export function AdmissionSuccessPage(handle: Handle<AdmissionSuccessPageProps>) {
  return () => {
    const { user, settings, applicationId } = handle.props

    return (
      <LandingLayout user={user} settings={settings}>
        <LandingSection variant="frame" ruled>
          <HeadingScope level={1}>
            <div
              mix={[
                u.vstack({ gap: 4, align: "center" }),
                u.maxWidth("38rem"),
                u.mi("auto"),
                u.p(8),
                u.rounded("xl"),
                u.border({ width: 1, color: "neutral" }),
                u.bg("var(--ui-surface, var(--ui-bg))"),
                u.textAlign("center")
              ]}
            >
              <div mix={[u.p(3), u.rounded("full"), u.bg("success.tint"), u.fg("success")]}>
                <CircleCheckIcon size={28} />
              </div>

              <Badge color="brand" variant="default">
                Application Reference: {applicationId}
              </Badge>

              <Heading level={1} mix={[u.fontSize("2xl"), u.weight("bold"), u.m(0)]}>
                Admission Application Received
              </Heading>

              <Text mix={[u.fontSize("sm"), u.fg("neutral.muted"), u.m(0)]}>
                Thank you for registering with PAART Academy. Please note your reference number{" "}
                <strong>{applicationId}</strong>. Our Puliyangudi admissions coordinator will
                contact you on your mobile/WhatsApp number regarding batch orientation and document
                verification.
              </Text>

              <div mix={[u.hstack({ gap: 3, justify: "center" }), u.flexWrap("wrap"), u.pbs(2)]}>
                <LinkButton href={routes.courses.index.href()} color="brand" variant="solid">
                  <span>Explore Study Materials &amp; Courses</span>
                  <ArrowRightIcon size={15} />
                </LinkButton>
                <LinkButton
                  href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                  color="neutral"
                  variant="outline"
                >
                  <PhoneIcon size={15} />
                  <span>Call {settings.phone}</span>
                </LinkButton>
              </div>
            </div>
          </HeadingScope>
        </LandingSection>
      </LandingLayout>
    )
  }
}
