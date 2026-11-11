import type { Handle } from "remix/component"
import * as u from "@sdxc/u"
import { Badge, Button, Heading, Link, Select, Text } from "@sdxc/ui"
import { PageHeader } from "@sdxc/ui/app"
import type { AdminUser } from "~/app/initializers/auth"
import type { AdmissionItem } from "~/app/models/admissions"
import { ADMISSION_STATUSES } from "~/database/schema"
import { AdminLayout } from "~/resources/layouts/admin"
import { routes } from "~/routes"

export interface AdminAdmissionsPageProps {
  user: AdminUser
  admissions: AdmissionItem[]
}

export function AdminAdmissionsPage(handle: Handle<AdminAdmissionsPageProps>) {
  return () => {
    const { user, admissions } = handle.props

    return (
      <AdminLayout user={user} currentPath={routes.admin.admissions.href()}>
        <PageHeader
          crumbs={[{ label: "Admin", href: routes.admin.index.href() }, { label: "Admissions" }]}
          title="Student Admission Applications"
          description="Review student registrations, verify uploaded certificates, and update admission status."
          status={<Badge color="brand">{admissions.length} Total</Badge>}
        />

        {admissions.length === 0 ? (
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
              No online admission applications submitted yet.
            </Text>
          </div>
        ) : (
          <div mix={[u.vstack({ gap: 4 })]}>
            {admissions.map((adm) => (
              <div
                key={adm.id}
                mix={[
                  u.vstack({ gap: 3 }),
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
                    <div mix={[u.hstack({ gap: 2, align: "center" }), u.flexWrap("wrap")]}>
                      <Heading level={2} mix={[u.fontSize("md"), u.weight("bold"), u.m(0)]}>
                        {adm.studentName}
                      </Heading>
                      <Badge color="brand" variant="outline">
                        {adm.applicationId}
                      </Badge>
                      <Badge
                        color={
                          adm.status === "Approved" || adm.status === "Joined"
                            ? "success"
                            : adm.status === "Rejected"
                              ? "danger"
                              : "neutral"
                        }
                        variant="secondary"
                      >
                        {adm.status}
                      </Badge>
                    </div>
                    <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                      Course: <strong>{adm.courseInterested}</strong> · Batch: {adm.preferredBatch}{" "}
                      · Qualification: {adm.previousQualification}
                    </Text>
                  </div>

                  <form
                    method="POST"
                    action={routes.admin.admissionStatus.href({ id: adm.id })}
                    mix={[u.hstack({ gap: 2, align: "center" })]}
                  >
                    <Select name="status" aria-label={`Status for ${adm.studentName}`}>
                      {ADMISSION_STATUSES.map((st) => (
                        <Select.Option key={st} value={st} selected={adm.status === st}>
                          {st}
                        </Select.Option>
                      ))}
                    </Select>
                    <Button type="submit" size="sm" color="brand" variant="outline">
                      Update
                    </Button>
                  </form>
                </div>

                <div
                  mix={[
                    u.grid(),
                    u.gap(2),
                    u.media(
                      "(min-width: 48rem)",
                      u.raw({ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" })
                    ),
                    u.pbs(2),
                    u.borderEdge("top", { width: 1 }),
                    u.border({ color: "neutral" })
                  ]}
                >
                  <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                    <strong>Mobile:</strong> {adm.mobile}{" "}
                    {adm.whatsapp ? `(WA: ${adm.whatsapp})` : ""}
                  </Text>
                  <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                    <strong>Location:</strong> {adm.city}, {adm.district} - {adm.pincode}
                  </Text>
                  <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                    <strong>Parent/Guardian:</strong> {adm.parentName} · DOB: {adm.dateOfBirth}
                  </Text>
                </div>

                {(adm.photoUrl || adm.documentUrl || adm.message) && (
                  <div mix={[u.hstack({ gap: 4, align: "center" }), u.flexWrap("wrap")]}>
                    {adm.photoUrl && (
                      <Link
                        href={adm.photoUrl}
                        target="_blank"
                        rel="noreferrer"
                        mix={[u.fontSize("xs")]}
                      >
                        View Student Photo
                      </Link>
                    )}
                    {adm.documentUrl && (
                      <Link
                        href={adm.documentUrl}
                        target="_blank"
                        rel="noreferrer"
                        mix={[u.fontSize("xs")]}
                      >
                        View Supporting Document
                      </Link>
                    )}
                    {adm.message && (
                      <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                        Note: {adm.message}
                      </Text>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </AdminLayout>
    )
  }
}
