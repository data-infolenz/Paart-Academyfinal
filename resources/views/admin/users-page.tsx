import type { Handle } from "remix/component"
import * as u from "@sdxc/u"
import { Badge, Button, Heading, Input, Select, Text } from "@sdxc/ui"
import { PageHeader } from "@sdxc/ui/app"
import type { AdminUser } from "~/app/initializers/auth"
import type { BatchSummaryItem } from "~/app/models/lms"
import type { ManagedUserItem } from "~/app/models/users"
import { AdminLayout } from "~/resources/layouts/admin"
import { routes } from "~/routes"

export interface AdminUsersPageProps {
  user: AdminUser
  users: ManagedUserItem[]
  batches: BatchSummaryItem[]
  notice?: string | null
  warning?: string | null
  error?: string | null
}

export function AdminUsersPage(handle: Handle<AdminUsersPageProps>) {
  return () => {
    const { user, users, batches, notice, warning, error } = handle.props
    const activeBatches = batches.filter((b) => b.isActive)

    return (
      <AdminLayout user={user} currentPath={routes.admin.users.href()}>
        <PageHeader
          crumbs={[
            { label: "Admin", href: routes.admin.index.href() },
            { label: "Users & Access" }
          ]}
          title="Users & Role Provisioning"
          description="Provision Faculty and Aspirant accounts with auto-generated temporary credentials delivered over SMTP."
          status={<Badge color="brand">{users.length} Accounts</Badge>}
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

        <form
          method="POST"
          action={routes.admin.userCreate.href()}
          mix={[
            u.vstack({ gap: 4 }),
            u.p(5),
            u.rounded("xl"),
            u.border({ width: 1, color: "neutral" }),
            u.bg("var(--ui-surface, var(--ui-bg))")
          ]}
        >
          <div mix={[u.vstack({ gap: 1 })]}>
            <Heading level={2} mix={[u.fontSize("md"), u.weight("semibold"), u.m(0)]}>
              Provision New Faculty or Aspirant Account
            </Heading>
            <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
              A high-entropy temporary password is generated automatically, hashed in PostgreSQL,
              and emailed to the recipient. First sign-in forces password rotation.
            </Text>
          </div>

          <div
            mix={[
              u.grid(),
              u.gap(3.5),
              u.media("(min-width: 48rem)", u.raw({ gridTemplateColumns: "1fr 1.5fr 1.5fr" }))
            ]}
          >
            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Account Role *</Text>
              <Select name="role" required>
                <Select.Option value="aspirant">Aspirant (Student Portal)</Select.Option>
                <Select.Option value="faculty">Faculty (Teaching Workspace)</Select.Option>
              </Select>
            </label>

            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Full Name *</Text>
              <Input name="fullName" required placeholder="e.g. Karthikeyan Murugan" />
            </label>

            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Email Address *</Text>
              <Input
                type="email"
                name="email"
                required
                placeholder="aspirant@example.com"
                autoComplete="off"
              />
            </label>
          </div>

          <div
            mix={[
              u.grid(),
              u.gap(3.5),
              u.media("(min-width: 48rem)", u.raw({ gridTemplateColumns: "1fr 1fr 1.5fr" }))
            ]}
          >
            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                Mobile Phone (optional)
              </Text>
              <Input name="phone" placeholder="+91 98400 00000" />
            </label>

            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                Department / Subject (Faculty)
              </Text>
              <Input name="department" placeholder="e.g. Indian Polity & General Studies" />
            </label>

            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                Initial Batch Enrollment (Aspirants)
              </Text>
              <Select name="batchId">
                <Select.Option value="">No immediate batch enrollment</Select.Option>
                {activeBatches.map((b) => (
                  <Select.Option key={b.id} value={b.id}>
                    {b.name} ({b.code}) — {b.courseTitle}
                  </Select.Option>
                ))}
              </Select>
            </label>
          </div>

          <div mix={[u.hstack({ justify: "end" })]}>
            <Button type="submit" color="brand" variant="solid">
              Create Account &amp; Send Credentials
            </Button>
          </div>
        </form>

        <div mix={[u.vstack({ gap: 3 })]}>
          {users.map((item) => {
            const isSelf = item.id === user.id
            const nextStatus = item.status === "active" ? "suspended" : "active"

            return (
              <div
                key={item.id}
                mix={[
                  u.vstack({ gap: 3 }),
                  u.p(4),
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
                  <div mix={[u.vstack({ gap: 1 }), u.minWidth(0)]}>
                    <div mix={[u.hstack({ gap: 2, align: "center" }), u.flexWrap("wrap")]}>
                      <Text mix={[u.fontSize("sm"), u.weight("bold"), u.m(0)]}>
                        {item.fullName}
                      </Text>
                      <Badge
                        color={
                          item.role === "admin"
                            ? "brand"
                            : item.role === "faculty"
                              ? "warning"
                              : "neutral"
                        }
                        variant="outline"
                      >
                        {item.role}
                      </Badge>
                      <Badge
                        color={item.status === "active" ? "success" : "danger"}
                        variant="secondary"
                      >
                        {item.status}
                      </Badge>
                      {item.mustChangePassword && (
                        <Badge color="warning" variant="outline">
                          First-Login Reset Pending
                        </Badge>
                      )}
                      {item.credentialsSentAt && !item.credentialsDeliveryError && (
                        <Badge color="success" variant="outline">
                          SMTP Sent {item.credentialsSentAt.slice(0, 10)}
                        </Badge>
                      )}
                    </div>

                    <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                      {item.email}
                      {item.phone ? ` · ${item.phone}` : ""}
                      {item.department ? ` · ${item.department}` : ""}
                    </Text>

                    {item.enrollments.length > 0 && (
                      <div mix={[u.hstack({ gap: 1.5, align: "center" }), u.flexWrap("wrap")]}>
                        {item.enrollments.map((enr) => (
                          <Badge key={enr.enrollmentId} color="brand" variant="secondary">
                            {enr.batchCode} · Roll {enr.rollNumber}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div mix={[u.hstack({ gap: 2, align: "center" }), u.flexWrap("wrap")]}>
                    {item.role !== "admin" && (
                      <form
                        method="POST"
                        action={routes.admin.userResendCredentials.href({ id: item.id })}
                      >
                        <Button type="submit" size="sm" variant="outline" color="brand">
                          Reset &amp; Resend Credentials
                        </Button>
                      </form>
                    )}

                    {!isSelf && (
                      <form method="POST" action={routes.admin.userStatus.href({ id: item.id })}>
                        <input type="hidden" name="status" value={nextStatus} />
                        <Button
                          type="submit"
                          size="sm"
                          variant="outline"
                          color={item.status === "active" ? "danger" : "success"}
                        >
                          {item.status === "active" ? "Suspend" : "Reactivate"}
                        </Button>
                      </form>
                    )}
                  </div>
                </div>

                {item.credentialsDeliveryError && (
                  <div
                    role="alert"
                    mix={[
                      u.p(2.5),
                      u.rounded("md"),
                      u.border({ width: 1, color: "warning" }),
                      u.bg("warning.tint")
                    ]}
                  >
                    <Text mix={[u.fontSize("xs"), u.fg("warning"), u.m(0)]}>
                      <strong>SMTP Delivery Warning:</strong> {item.credentialsDeliveryError}
                    </Text>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </AdminLayout>
    )
  }
}
