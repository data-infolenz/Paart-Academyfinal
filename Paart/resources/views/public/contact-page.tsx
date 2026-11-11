import type { Handle } from "remix/component"
import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from "@sdxc/icons"
import * as u from "@sdxc/u"
import { Text } from "@sdxc/ui"
import type { AdminUser } from "~/app/initializers/auth"
import type { CourseItem } from "~/app/models/courses"
import type { SiteSettings } from "~/app/models/settings"
import {
  acadCard,
  AcademicPageBanner,
  AcademicSection,
  acadSerif
} from "~/resources/components/academic-ui"
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
        <AcademicPageBanner
          rubric="Campus Offices & Counselling"
          title="Contact PAART Academy"
          description="Visit our Puliyangudi campus in person for academic counselling, batch schedules, syllabus guidance, or scholarship enquiries."
          breadcrumbs={[{ label: "Contact" }]}
        />

        <AcademicSection>
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
              <div mix={[acadCard("primary"), u.vstack({ gap: 4 }), u.p(6)]}>
                <h2 mix={[acadSerif(), u.fontSize("lg"), u.weight("bold"), u.m(0)]}>
                  Puliyangudi Campus Offices
                </h2>

                <div mix={[u.hstack({ gap: 3, align: "start" })]}>
                  <MapPinIcon
                    size={18}
                    mix={[u.fg("var(--acad-primary)"), u.shrink(0), u.mbs(0.5)]}
                  />
                  <div mix={[u.vstack({ gap: 1 })]}>
                    <span mix={[u.fontSize("xs"), u.weight("bold"), u.fg("var(--acad-muted)")]}>
                      Primary Office &amp; Classroom
                    </span>
                    <Text mix={[u.fontSize("sm"), u.m(0)]}>{settings.addressPrimary}</Text>
                    {settings.addressSecondary && (
                      <>
                        <span
                          mix={[
                            u.fontSize("xs"),
                            u.weight("bold"),
                            u.fg("var(--acad-muted)"),
                            u.pbs(1)
                          ]}
                        >
                          Training Hall
                        </span>
                        <Text mix={[u.fontSize("sm"), u.m(0)]}>{settings.addressSecondary}</Text>
                      </>
                    )}
                  </div>
                </div>

                <div mix={[u.hstack({ gap: 3, align: "center" })]}>
                  <PhoneIcon size={18} mix={[u.fg("var(--acad-primary)"), u.shrink(0)]} />
                  <div mix={[u.vstack({ gap: 0.5 })]}>
                    <span mix={[u.fontSize("xs"), u.fg("var(--acad-muted)")]}>
                      Admissions &amp; WhatsApp Helpline
                    </span>
                    <a
                      href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                      mix={[
                        u.fontSize("sm"),
                        u.weight("bold"),
                        u.fg("var(--acad-primary)"),
                        u.textDecoration("none")
                      ]}
                    >
                      {settings.phone}
                    </a>
                  </div>
                </div>

                <div mix={[u.hstack({ gap: 3, align: "center" })]}>
                  <MailIcon size={18} mix={[u.fg("var(--acad-primary)"), u.shrink(0)]} />
                  <div mix={[u.vstack({ gap: 0.5 })]}>
                    <span mix={[u.fontSize("xs"), u.fg("var(--acad-muted)")]}>Official Email</span>
                    <a
                      href={`mailto:${settings.email}`}
                      mix={[
                        u.fontSize("sm"),
                        u.weight("semibold"),
                        u.fg("var(--acad-primary)"),
                        u.textDecoration("none")
                      ]}
                    >
                      {settings.email}
                    </a>
                  </div>
                </div>

                <div mix={[u.hstack({ gap: 3, align: "center" })]}>
                  <ClockIcon size={18} mix={[u.fg("var(--acad-primary)"), u.shrink(0)]} />
                  <div mix={[u.vstack({ gap: 0.5 })]}>
                    <span mix={[u.fontSize("xs"), u.fg("var(--acad-muted)")]}>
                      Campus &amp; Study Hall Hours
                    </span>
                    <Text mix={[u.fontSize("sm"), u.weight("medium"), u.m(0)]}>
                      {settings.hours}
                    </Text>
                  </div>
                </div>
              </div>

              <div mix={[acadCard(), u.overflow("hidden")]}>
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
        </AcademicSection>
      </LandingLayout>
    )
  }
}
