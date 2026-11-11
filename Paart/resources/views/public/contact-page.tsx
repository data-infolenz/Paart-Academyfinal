import type { Handle } from "remix/component"
import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from "@sdxc/icons"
import * as u from "@sdxc/u"
import { Heading, HeadingScope, Text } from "@sdxc/ui"
import { LandingHeader, LandingSection } from "@sdxc/ui/landing"
import type { AdminUser } from "~/app/initializers/auth"
import type { CourseItem } from "~/app/models/courses"
import type { SiteSettings } from "~/app/models/settings"
import { EnquiryFormCard } from "~/resources/components/enquiry-form"
import { LandingLayout } from "~/resources/layouts/landing"

export interface ContactPageProps {
  user?: AdminUser | null
  settings: SiteSettings
  courses: CourseItem[]
  honeypotFields?: Record<string, string>
  submitted?: boolean
  error?: string | null
}

export function ContactPage(handle: Handle<ContactPageProps>) {
  return () => {
    const { user, settings, courses, honeypotFields, submitted, error } = handle.props
    const mapQuery = encodeURIComponent(settings.addressPrimary)
    const mapSrc = `https://www.google.com/maps?q=${mapQuery}&output=embed`

    return (
      <LandingLayout user={user} settings={settings}>
        <LandingSection variant="frame" ruled>
          <HeadingScope level={1}>
            <LandingHeader
              eyebrow="Campus & Counselling"
              eyebrowVariant="pill"
              description="Visit our Puliyangudi campus for in-person academic counselling, syllabus orientation, or scholarship guidance."
            >
              Contact PAART Academy
            </LandingHeader>

            <div
              mix={[
                u.grid(),
                u.gap(6),
                u.items("start"),
                u.media("(min-width: 58rem)", u.raw({ gridTemplateColumns: "0.95fr 1.05fr" }))
              ]}
            >
              {/* Left Column: Official Contact Details & Map */}
              <div mix={[u.vstack({ gap: 4 })]}>
                <div
                  mix={[
                    u.vstack({ gap: 4 }),
                    u.p(6),
                    u.rounded("xl"),
                    u.border({ width: 1, color: "neutral" }),
                    u.bg("var(--ui-surface, var(--ui-bg))")
                  ]}
                >
                  <Heading level={2} mix={[u.fontSize("lg"), u.weight("semibold"), u.m(0)]}>
                    Puliyangudi Campus Offices
                  </Heading>

                  <div mix={[u.hstack({ gap: 3, align: "start" })]}>
                    <MapPinIcon size={18} mix={[u.fg("brand"), u.shrink(0), u.mbs(0.5)]} />
                    <div mix={[u.vstack({ gap: 1 })]}>
                      <Text
                        mix={[
                          u.fontSize("xs"),
                          u.weight("semibold"),
                          u.fg("neutral.muted"),
                          u.m(0)
                        ]}
                      >
                        Primary Campus
                      </Text>
                      <Text mix={[u.fontSize("sm"), u.m(0)]}>{settings.addressPrimary}</Text>
                      {settings.addressSecondary && (
                        <>
                          <Text
                            mix={[
                              u.fontSize("xs"),
                              u.weight("semibold"),
                              u.fg("neutral.muted"),
                              u.m(0),
                              u.pbs(1)
                            ]}
                          >
                            Additional Hall
                          </Text>
                          <Text mix={[u.fontSize("sm"), u.m(0)]}>{settings.addressSecondary}</Text>
                        </>
                      )}
                    </div>
                  </div>

                  <div mix={[u.hstack({ gap: 3, align: "center" })]}>
                    <PhoneIcon size={18} mix={[u.fg("brand"), u.shrink(0)]} />
                    <div mix={[u.vstack({ gap: 0.5 })]}>
                      <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                        Admissions &amp; WhatsApp Helpline
                      </Text>
                      <a
                        href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                        mix={[
                          u.fontSize("sm"),
                          u.weight("semibold"),
                          u.fg("brand"),
                          u.textDecoration("none")
                        ]}
                      >
                        {settings.phone}
                      </a>
                    </div>
                  </div>

                  <div mix={[u.hstack({ gap: 3, align: "center" })]}>
                    <MailIcon size={18} mix={[u.fg("brand"), u.shrink(0)]} />
                    <div mix={[u.vstack({ gap: 0.5 })]}>
                      <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                        Email Address
                      </Text>
                      <a
                        href={`mailto:${settings.email}`}
                        mix={[
                          u.fontSize("sm"),
                          u.weight("semibold"),
                          u.fg("brand"),
                          u.textDecoration("none")
                        ]}
                      >
                        {settings.email}
                      </a>
                    </div>
                  </div>

                  <div mix={[u.hstack({ gap: 3, align: "center" })]}>
                    <ClockIcon size={18} mix={[u.fg("brand"), u.shrink(0)]} />
                    <div mix={[u.vstack({ gap: 0.5 })]}>
                      <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                        Campus &amp; Study Hall Hours
                      </Text>
                      <Text mix={[u.fontSize("sm"), u.weight("medium"), u.m(0)]}>
                        {settings.hours}
                      </Text>
                    </div>
                  </div>
                </div>

                <div
                  mix={[
                    u.rounded("xl"),
                    u.overflow("hidden"),
                    u.border({ width: 1, color: "neutral" }),
                    u.bg("var(--ui-surface, var(--ui-bg))")
                  ]}
                >
                  <iframe
                    title="PAART Academy Puliyangudi Location Map"
                    src={mapSrc}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    mix={[u.width("full"), u.height(56), u.border("none"), u.block()]}
                  />
                </div>
              </div>

              {/* Right Column: Validated Enquiry Form */}
              <EnquiryFormCard
                courses={courses}
                honeypotFields={honeypotFields}
                submitted={submitted}
                error={error}
                returnTo="/contact"
              />
            </div>
          </HeadingScope>
        </LandingSection>
      </LandingLayout>
    )
  }
}
