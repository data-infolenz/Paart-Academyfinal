import type { Handle } from "remix/component"
import * as u from "@sdxc/u"
import { Badge, Button, Heading, Input, Select, Text, TextArea } from "@sdxc/ui"
import { PageHeader } from "@sdxc/ui/app"
import type { SessionUser } from "~/app/initializers/auth"
import type { CourseItem } from "~/app/models/courses"
import type { BatchSummaryItem, NotificationItem } from "~/app/models/lms"
import { FacultyLayout } from "~/resources/layouts/faculty"
import { routes } from "~/routes"

export interface FacultyNotificationsPageProps {
  user: SessionUser
  notifications: NotificationItem[]
  courses: CourseItem[]
  batches: BatchSummaryItem[]
  notice?: string | null
  error?: string | null
}

export function FacultyNotificationsPage(handle: Handle<FacultyNotificationsPageProps>) {
  return () => {
    const { user, notifications, courses, batches, notice, error } = handle.props
    const activeBatches = batches.filter((b) => b.isActive)

    return (
      <FacultyLayout user={user} currentPath={routes.faculty.notifications.href()}>
        <PageHeader
          crumbs={[
            { label: "Faculty", href: routes.faculty.index.href() },
            { label: "Notifications" }
          ]}
          title="Targeted Academic Notifications"
          description="Broadcast exam timetables, venue alerts, and study updates to all aspirants, a course, or a specific batch."
          status={<Badge color="brand">{notifications.length} Sent</Badge>}
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
          action={routes.faculty.notificationCreate.href()}
          mix={[
            u.vstack({ gap: 4 }),
            u.p(5),
            u.rounded("xl"),
            u.border({ width: 1, color: "neutral" }),
            u.bg("var(--ui-surface, var(--ui-bg))")
          ]}
        >
          <Heading level={2} mix={[u.fontSize("md"), u.weight("semibold"), u.m(0)]}>
            Post Academic Announcement
          </Heading>

          <div
            mix={[
              u.grid(),
              u.gap(3.5),
              u.media("(min-width: 48rem)", u.raw({ gridTemplateColumns: "2fr 1fr" }))
            ]}
          >
            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Headline *</Text>
              <Input
                name="title"
                required
                placeholder="e.g. OMR Mock Test 04 Hall Allocation & Reporting Time"
              />
            </label>

            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Category *</Text>
              <Select name="category" required>
                <Select.Option value="exam">Exam Alert</Select.Option>
                <Select.Option value="schedule">Class Schedule</Select.Option>
                <Select.Option value="material">Study Material</Select.Option>
                <Select.Option value="general">General Notice</Select.Option>
              </Select>
            </label>
          </div>

          <div
            mix={[
              u.grid(),
              u.gap(3.5),
              u.media(
                "(min-width: 48rem)",
                u.raw({ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" })
              )
            ]}
          >
            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Audience Scope *</Text>
              <Select name="targetScope" required>
                <Select.Option value="all">All Enrolled Aspirants</Select.Option>
                <Select.Option value="course">Specific Course</Select.Option>
                <Select.Option value="batch">Specific Batch Cohort</Select.Option>
              </Select>
            </label>

            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                Target Course (when scope = Course)
              </Text>
              <Select name="targetCourseId">
                <Select.Option value="">— Select Course —</Select.Option>
                {courses.map((c) => (
                  <Select.Option key={c.id} value={c.id}>
                    {c.title}
                  </Select.Option>
                ))}
              </Select>
            </label>

            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                Target Batch (when scope = Batch)
              </Text>
              <Select name="targetBatchId">
                <Select.Option value="">— Select Batch —</Select.Option>
                {activeBatches.map((b) => (
                  <Select.Option key={b.id} value={b.id}>
                    {b.name} ({b.code})
                  </Select.Option>
                ))}
              </Select>
            </label>
          </div>

          <label mix={[u.vstack({ gap: 1.5 })]}>
            <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Message Body *</Text>
            <TextArea
              name="body"
              required
              rows={3}
              placeholder="Write clear instructions for aspirants..."
            />
          </label>

          <div mix={[u.hstack({ justify: "end" })]}>
            <Button type="submit" color="brand" variant="solid">
              Publish Notification
            </Button>
          </div>
        </form>

        <div mix={[u.vstack({ gap: 3 })]}>
          {notifications.map((item) => (
            <div
              key={item.id}
              mix={[
                u.vstack({ gap: 1.5 }),
                u.p(4),
                u.rounded("xl"),
                u.border({ width: 1, color: "neutral" }),
                u.bg("var(--ui-surface, var(--ui-bg))")
              ]}
            >
              <div mix={[u.hstack({ gap: 2, align: "center" }), u.flexWrap("wrap")]}>
                <Text mix={[u.fontSize("sm"), u.weight("bold"), u.m(0)]}>{item.title}</Text>
                <Badge color="brand" variant="outline">
                  {item.category}
                </Badge>
                <Badge color="neutral" variant="secondary">
                  {item.targetScope === "all"
                    ? "All Aspirants"
                    : item.targetScope === "batch"
                      ? `Batch: ${item.targetBatchName}`
                      : `Course: ${item.targetCourseTitle}`}
                </Badge>
                <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                  {item.publishedAt.slice(0, 10)}
                </Text>
              </div>
              <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>{item.body}</Text>
            </div>
          ))}
        </div>
      </FacultyLayout>
    )
  }
}
