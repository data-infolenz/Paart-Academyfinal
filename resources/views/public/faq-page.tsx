import type { Handle } from "remix/component"
import { ArrowRightIcon, ChevronDownIcon } from "@sdxc/icons"
import * as u from "@sdxc/u"
import { Accordion, LinkButton } from "@sdxc/ui"
import type { AdminUser } from "~/app/initializers/auth"
import type { SiteSettings } from "~/app/models/settings"
import { PAART_FAQ_CATEGORIES } from "~/config/faqs"
import {
  acadCard,
  AcademicCalloutBand,
  AcademicPageBanner,
  AcademicSection,
  acadSerif
} from "~/resources/components/academic-ui"
import { LandingLayout } from "~/resources/layouts/landing"
import { routes } from "~/routes"

export interface FaqPageProps {
  user?: AdminUser | null
  settings: SiteSettings
}

export function FaqPage(handle: Handle<FaqPageProps>) {
  return () => {
    const { user, settings } = handle.props

    return (
      <LandingLayout user={user} settings={settings}>
        <AcademicPageBanner
          rubric="Student & Parent Help Desk"
          title="Frequently Asked Questions"
          description="Clear answers about PAART Academy's batch timings, Tamil & English study materials, OMR test series, physical coaching, and fee scholarships."
          breadcrumbs={[{ label: "FAQ" }]}
        />

        <AcademicSection>
          <div
            mix={[
              u.grid(),
              u.gap(5),
              u.media(
                "(min-width: 56rem)",
                u.raw({ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" })
              )
            ]}
          >
            {PAART_FAQ_CATEGORIES.map((cat) => (
              <div key={cat.id} mix={[acadCard(), u.p(5), u.vstack({ gap: 3 })]}>
                <h2
                  mix={[
                    acadSerif(),
                    u.fontSize("lg"),
                    u.weight("bold"),
                    u.fg("var(--acad-primary)"),
                    u.m(0)
                  ]}
                >
                  {cat.title}
                </h2>
                <Accordion>
                  {cat.items.map((item, idx) => (
                    <Accordion.Item key={item.question} name={`faq-${cat.id}`} open={idx === 0}>
                      <Accordion.Trigger>
                        {item.question}
                        <ChevronDownIcon data-slot="icon" aria-hidden="true" />
                      </Accordion.Trigger>
                      <Accordion.Content>
                        <p>{item.answer}</p>
                      </Accordion.Content>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </AcademicSection>

        <AcademicCalloutBand
          title="Still Have Questions About Exam Eligibility or Scholarships?"
          description="Speak directly with our Puliyangudi academic mentors or send us an enquiry."
          settings={settings}
          actions={
            <LinkButton href={routes.contact.href()} color="brand" variant="solid">
              <span>Contact Campus Coordinator</span>
              <ArrowRightIcon size={16} />
            </LinkButton>
          }
        />
      </LandingLayout>
    )
  }
}
