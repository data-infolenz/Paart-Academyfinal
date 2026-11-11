import type { Handle } from "remix/component"
import { ArrowRightIcon, ChevronDownIcon } from "@sdxc/icons"
import { Accordion, LinkButton } from "@sdxc/ui"
import { ClosingCta, FaqBand } from "@sdxc/ui/landing"
import { landingCtaChrome } from "@sdxc/ui/styles"
import type { AdminUser } from "~/app/initializers/auth"
import type { SiteSettings } from "~/app/models/settings"
import { PAART_FAQ_CATEGORIES } from "~/config/faqs"
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
        <FaqBand
          variant="frame"
          ruled
          columns={2}
          eyebrow="Student Help Desk"
          title="Frequently Asked Questions"
          description="Everything you need to know about PAART Academy's batches, bilingual study materials, test series, and scholarship support."
        >
          {PAART_FAQ_CATEGORIES.map((cat) => (
            <Accordion key={cat.id}>
              {cat.items.map((item, idx) => (
                <Accordion.Item key={item.question} name="faq-page" open={idx === 0}>
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
          ))}
        </FaqBand>

        <ClosingCta
          variant="frame"
          tone="tinted"
          title="Still Have Questions About Your Exam Eligibility?"
          description="Speak directly with our Puliyangudi academic mentors or send us an enquiry."
          actions={
            <LinkButton
              href={routes.contact.href()}
              color="brand"
              variant="solid"
              mix={[landingCtaChrome()]}
            >
              <span>Contact Campus Coordinator</span>
              <ArrowRightIcon size={16} />
            </LinkButton>
          }
        />
      </LandingLayout>
    )
  }
}
