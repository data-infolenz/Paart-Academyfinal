import type { Handle } from "remix/component"
import * as u from "@sdxc/u"
import { Badge, Heading, Text } from "@sdxc/ui"
import { PageHeader } from "@sdxc/ui/app"
import type { SessionUser } from "~/app/initializers/auth"
import type { NotificationItem } from "~/app/models/lms"
import { PortalLayout } from "~/resources/layouts/portal"
import { routes } from "~/routes"

export interface PortalNotificationsPageProps {
  user: SessionUser
  notifications: NotificationItem[]
}

export function PortalNotificationsPage(handle: Handle<PortalNotificationsPageProps>) {
  return () => {
    const { user, notifications } = handle.props

    return (
      <PortalLayout user={user} currentPath={routes.portal.notifications.href()}>
        <PageHeader
          crumbs={[
            { label: "Portal", href: routes.portal.index.href() },
            { label: "Notifications" }
          ]}
          title="Academy & Cohort Notifications"
          description="Exam alerts, timetable updates, and faculty announcements targeted to your course and batch."
          status={<Badge color="brand">{notifications.length} Notices</Badge>}
        />

        {notifications.length === 0 ? (
          <div
            mix={[
              u.p(6),
              u.rounded("xl"),
              u.border({ width: 1, color: "neutral" }),
              u.bg("var(--ui-surface, var(--ui-bg))"),
              u.textAlign("center")
            ]}
          >
            <Text mix={[u.fontSize("sm"), u.fg("neutral.muted"), u.m(0)]}>
              No notifications posted for your batch or course yet.
            </Text>
          </div>
        ) : (
          <div mix={[u.vstack({ gap: 3 })]}>
            {notifications.map((notif) => (
              <div
                key={notif.id}
                mix={[
                  u.vstack({ gap: 2 }),
                  u.p(4.5),
                  u.rounded("xl"),
                  u.border({ width: 1, color: "neutral" }),
                  u.bg("var(--ui-surface, var(--ui-bg))")
                ]}
              >
                <div mix={[u.hstack({ gap: 2, align: "center" }), u.flexWrap("wrap")]}>
                  <Badge color="brand" variant="outline">
                    {notif.category}
                  </Badge>
                  <Badge color="neutral" variant="secondary">
                    {notif.targetScope === "all"
                      ? "Academy-Wide"
                      : notif.targetScope === "batch"
                        ? `Batch: ${notif.targetBatchName}`
                        : `Course: ${notif.targetCourseTitle}`}
                  </Badge>
                  <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                    {notif.publishedAt.slice(0, 10)}
                  </Text>
                </div>

                <Heading level={2} mix={[u.fontSize("md"), u.weight("bold"), u.m(0)]}>
                  {notif.title}
                </Heading>

                <Text mix={[u.fontSize("sm"), u.fg("neutral.muted"), u.m(0)]}>{notif.body}</Text>
              </div>
            ))}
          </div>
        )}
      </PortalLayout>
    )
  }
}
