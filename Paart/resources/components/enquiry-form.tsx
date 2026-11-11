import type { Handle } from "remix/component"
import { CircleCheckIcon, SendIcon } from "@sdxc/icons"
import * as u from "@sdxc/u"
import { Button, Heading, Input, Select, Text, TextArea } from "@sdxc/ui"
import type { CourseItem } from "~/app/models/courses"
import { routes } from "~/routes"

export interface EnquiryFormCardProps {
  courses: CourseItem[]
  honeypotFields?: Record<string, string>
  submitted?: boolean
  error?: string | null
  returnTo?: string
}

export function EnquiryFormCard(handle: Handle<EnquiryFormCardProps>) {
  return () => {
    const {
      courses,
      honeypotFields,
      submitted = false,
      error = null,
      returnTo = "/contact"
    } = handle.props

    return (
      <div
        mix={[
          u.vstack({ gap: 4 }),
          u.p(6),
          u.rounded("xl"),
          u.border({ width: 1, color: "neutral" }),
          u.bg("var(--ui-surface, var(--ui-bg))")
        ]}
      >
        <div mix={[u.vstack({ gap: 1 })]}>
          <Heading level={3} mix={[u.fontSize("xl"), u.weight("semibold"), u.m(0)]}>
            Request Course & Batch Guidance
          </Heading>
          <Text mix={[u.fontSize("sm"), u.fg("neutral.muted"), u.m(0)]}>
            Share your exam goal and our academic coordinators in Puliyangudi will reach out.
          </Text>
        </div>

        {submitted && (
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
              Thank you! Your enquiry has been recorded. Our team will contact you shortly.
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

        <form method="POST" action={routes.enquirySubmit.href()} mix={[u.vstack({ gap: 3.5 })]}>
          <input type="hidden" name="returnTo" value={returnTo} />
          {honeypotFields && (
            <div aria-hidden="true" mix={[u.visuallyHidden()]}>
              {Object.entries(honeypotFields).map(([k, v]) => (
                <input
                  key={k}
                  type="text"
                  name={k}
                  defaultValue={v}
                  tabIndex={-1}
                  autoComplete="off"
                />
              ))}
            </div>
          )}

          <div
            mix={[
              u.grid(),
              u.gap(3.5),
              u.media(
                "(min-width: 40rem)",
                u.raw({ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" })
              )
            ]}
          >
            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Full Name *</Text>
              <Input name="name" required placeholder="e.g. Mohamed Riyaz" />
            </label>

            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                Mobile / WhatsApp *
              </Text>
              <Input name="phone" type="tel" required placeholder="+91 98765 43210" />
            </label>
          </div>

          <div
            mix={[
              u.grid(),
              u.gap(3.5),
              u.media(
                "(min-width: 40rem)",
                u.raw({ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" })
              )
            ]}
          >
            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                Target Exam / Course *
              </Text>
              <Select name="courseInterested" required>
                <Select.Option value="">Select a programme...</Select.Option>
                {courses.map((c) => (
                  <Select.Option key={c.id} value={c.title}>
                    {c.title} ({c.category})
                  </Select.Option>
                ))}
                <Select.Option value="NMMS / Typing / Computer Skills">
                  NMMS / Typing / Computer Skills
                </Select.Option>
              </Select>
            </label>

            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Town / District</Text>
              <Input name="district" placeholder="e.g. Puliyangudi, Tenkasi" />
            </label>
          </div>

          <label mix={[u.vstack({ gap: 1.5 })]}>
            <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
              Questions or Batch Preference
            </Text>
            <TextArea
              name="message"
              rows={3}
              placeholder="Let us know your educational qualification or preferred batch timing..."
            />
          </label>

          <div mix={[u.hstack({ justify: "end" }), u.pbs(1)]}>
            <Button type="submit" color="brand" variant="solid">
              <SendIcon size={15} aria-hidden="true" />
              <span>Submit Enquiry</span>
            </Button>
          </div>
        </form>
      </div>
    )
  }
}
