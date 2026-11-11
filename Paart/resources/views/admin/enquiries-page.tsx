import type { Handle } from "remix/component"
import * as u from "@sdxc/u"
import { Badge, Button, Heading, Select, Text } from "@sdxc/ui"
import { PageHeader } from "@sdxc/ui/app"
import type { AdminUser } from "~/app/initializers/auth"
import type { EnquiryItem } from "~/app/models/enquiries"
import { ENQUIRY_STATUSES } from "~/database/schema"
import { AdminLayout } from "~/resources/layouts/admin"
import { routes } from "~/routes"

export interface AdminEnquiriesPageProps {
  user: AdminUser
  enquiries: EnquiryItem[]
}

export function AdminEnquiriesPage(handle: Handle<AdminEnquiriesPageProps>) {
  return () => {
    const { user, enquiries } = handle.props

    return (
      <AdminLayout user={user} currentPath={routes.admin.enquiries.href()}>
        <PageHeader
          crumbs={[{ label: "Admin", href: routes.admin.index.href() }, { label: "Enquiries" }]}
          title="Course & Counselling Enquiries"
          description="Follow up on student callback requests submitted from the Contact page."
          status={<Badge color="brand">{enquiries.length} Total</Badge>}
        />

        {enquiries.length === 0 ? (
          <div
            mix={[
              u.p(8),
              u.rounded("xl"),
              u.border({ width: 1, color: "neutral" }),
              u.bg("var(--ui-surface, var(--ui-bg))"),
              u.textAlign("center")
            ]}
          >
            <Text mix={[u.fontSize("sm"), u.fg("neutral.muted"), u.m(0)]}>
              No enquiries have been submitted yet.
            </Text>
          </div>
        ) : (
          <div mix={[u.vstack({ gap: 3.5 })]}>
            {enquiries.map((enq) => (
              <div
                key={enq.id}
                mix={[
                  u.vstack({ gap: 2.5 }),
                  u.p(5),
                  u.rounded("xl"),
                  u.border({ width: 1, color: "neutral" }),
                  u.bg("var(--ui-surface, var(--ui-bg))")
                ]}
              >
                <div
                  mix={[
                    u.hstack({ justify: "between", align: "start", gap: 3 }),
                    u.flexWrap("wrap")
                  ]}
                >
                  <div mix={[u.vstack({ gap: 1 })]}>
                    <div mix={[u.hstack({ gap: 2, align: "center" })]}>
                      <Heading level={2} mix={[u.fontSize("md"), u.weight("semibold"), u.m(0)]}>
                        {enq.name}
                      </Heading>
                      <Badge
                        color={
                          enq.status === "Closed"
                            ? "success"
                            : enq.status === "Contacted"
                              ? "brand"
                              : "warning"
                        }
                        variant="secondary"
                      >
                        {enq.status}
                      </Badge>
                    </div>
                    <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                      Phone: <strong>{enq.phone}</strong> · Programme:{" "}
                      <strong>{enq.courseInterested}</strong>
                      {enq.district ? ` · Location: ${enq.district}` : ""}
                    </Text>
                  </div>

                  <form
                    method="POST"
                    action={routes.admin.enquiryStatus.href({ id: enq.id })}
                    mix={[u.hstack({ gap: 2, align: "center" })]}
                  >
                    <Select name="status" aria-label={`Status for ${enq.name}`}>
                      {ENQUIRY_STATUSES.map((st) => (
                        <Select.Option key={st} value={st} selected={enq.status === st}>
                          {st}
                        </Select.Option>
                      ))}
                    </Select>
                    <Button type="submit" size="sm" color="brand" variant="outline">
                      Save
                    </Button>
                  </form>
                </div>

                {enq.message && <Text mix={[u.fontSize("sm"), u.fg(), u.m(0)]}>{enq.message}</Text>}
              </div>
            ))}
          </div>
        )}
      </AdminLayout>
    )
  }
}
