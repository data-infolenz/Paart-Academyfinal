import type { Handle } from "remix/component"
import * as u from "@sdxc/u"
import { Badge, Button, Heading, Input, Link, Select, Text } from "@sdxc/ui"
import { PageHeader } from "@sdxc/ui/app"
import type { AdminUser } from "~/app/initializers/auth"
import type { AdmissionItem } from "~/app/models/admissions"
import type { BatchSummaryItem } from "~/app/models/lms"
import { ADMISSION_STATUSES } from "~/database/schema"
import { AdminLayout } from "~/resources/layouts/admin"
import { routes } from "~/routes"

export interface AdminAdmissionsPageProps {
  user: AdminUser
  admissions: AdmissionItem[]
  batches: BatchSummaryItem[]
  notice?: string | null
  warning?: string | null
  error?: string | null
}

export function AdminAdmissionsPage(handle: Handle<AdminAdmissionsPageProps>) {
  return () => {
    const { user, admissions, batches, notice, warning, error } = handle.props
    const activeBatches = batches.filter((b) => b.isActive)

    return (
      <AdminLayout user={user} currentPath={routes.admin.admissions.href()}>
        <PageHeader
          crumbs={[{ label: "Admin", href: routes.admin.index.href() }, { label: "Admissions" }]}
          title="Student Admission Applications"
          description="Review student registrations, update status, or convert applicants directly into enrolled Aspirant portal accounts."
          status={<Badge color="brand">{admissions.length} Total</Badge>}
        />

        {notice && (
          <div
            role="status"
            mix={[
              u.p(3.5),
              u.rounded("lg"),
              u.border({ width: 1, color: "success" }),
              u.bg("success.tint")
            ]}
          >
            <Text mix={[u.fontSize("sm"), u.weight("medium"), u.fg("success"), u.m(0)]}>
              {notice}
            </Text>
          </div>
        )}

        {warning && (
          <div
            role="alert"
            mix={[
              u.p(3.5),
              u.rounded("lg"),
              u.border({ width: 1, color: "warning" }),
              u.bg("warning.tint")
            ]}
          >
            <Text mix={[u.fontSize("sm"), u.weight("medium"), u.fg("warning"), u.m(0)]}>
              {warning}
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
                  u.vstack({ gap: 3.5 }),
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
                          adm.status === "Approved" ||
                          adm.status === "Joined" ||
                          adm.status === "enrolled"
                            ? "success"
                            : adm.status === "Rejected"
                              ? "danger"
                              : "neutral"
                        }
                        variant="secondary"
                      >
                        {adm.status}
                      </Badge>
                      {adm.provisionedUserId && (
                        <Badge color="success" variant="outline">
                          Portal Account Provisioned
                        </Badge>
                      )}
                    </div>
                    <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                      Course: <strong>{adm.courseInterested}</strong> · Preferred:{" "}
                      {adm.preferredBatch} · Qualification: {adm.previousQualification}
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
                    <strong>Email:</strong> {adm.email || "Not provided"} · <strong>City:</strong>{" "}
                    {adm.city}, {adm.district}
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

                {!adm.provisionedUserId && activeBatches.length > 0 && (
                  <form
                    method="POST"
                    action={routes.admin.admissionProvision.href({ id: adm.id })}
                    mix={[
                      u.vstack({ gap: 2.5 }),
                      u.p(3.5),
                      u.rounded("lg"),
                      u.border({ width: 1, color: "neutral" }),
                      u.bg("var(--ui-bg)")
                    ]}
                  >
                    <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                      1-Click Provision Aspirant Account &amp; Batch Enrollment
                    </Text>
                    <div
                      mix={[
                        u.grid(),
                        u.gap(2.5),
                        u.media(
                          "(min-width: 52rem)",
                          u.raw({ gridTemplateColumns: "1.3fr 1.5fr auto auto" })
                        ),
                        u.raw({ alignItems: "end" })
                      ]}
                    >
                      <label mix={[u.vstack({ gap: 1 })]}>
                        <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                          Aspirant Login Email *
                        </Text>
                        <Input
                          type="email"
                          name="email"
                          required
                          defaultValue={adm.email}
                          placeholder="student@email.com"
                        />
                      </label>

                      <label mix={[u.vstack({ gap: 1 })]}>
                        <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                          Target Batch *
                        </Text>
                        <Select name="batchId" required>
                          {activeBatches.map((b) => (
                            <Select.Option key={b.id} value={b.id}>
                              {b.name} ({b.code})
                            </Select.Option>
                          ))}
                        </Select>
                      </label>

                      <label
                        mix={[
                          u.hstack({ gap: 1.5, align: "center" }),
                          u.pb(2),
                          u.fontSize("xs"),
                          u.fg("neutral.muted")
                        ]}
                      >
                        <input type="checkbox" name="linkExisting" value="1" />
                        <span>Link existing if registered</span>
                      </label>

                      <Button type="submit" size="sm" color="brand" variant="solid">
                        Provision &amp; Send Email
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            ))}
          </div>
        )}
      </AdminLayout>
    )
  }
}
