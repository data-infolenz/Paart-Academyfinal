import type { Handle } from "remix/component"
import * as u from "@sdxc/u"
import { Badge, Button, Heading, Input, Link, Select, Text } from "@sdxc/ui"
import { PageHeader } from "@sdxc/ui/app"
import type { AdminUser } from "~/app/initializers/auth"
import type { CourseItem } from "~/app/models/courses"
import type { BatchSummaryItem } from "~/app/models/lms"
import { AdminLayout } from "~/resources/layouts/admin"
import { routes } from "~/routes"

export interface AdminBatchesPageProps {
  user: AdminUser
  batches: BatchSummaryItem[]
  courses: CourseItem[]
  facultyList: Array<{ id: string; fullName: string; email: string; department: string }>
  notice?: string | null
  error?: string | null
}

export function AdminBatchesPage(handle: Handle<AdminBatchesPageProps>) {
  return () => {
    const { user, batches, courses, facultyList, notice, error } = handle.props

    return (
      <AdminLayout user={user} currentPath={routes.admin.batches.href()}>
        <PageHeader
          crumbs={[{ label: "Admin", href: routes.admin.index.href() }, { label: "Batches" }]}
          title="Academic Batches & Cohorts"
          description="Organize enrolled aspirants into scheduled course cohorts and assign lead faculty mentors."
          status={<Badge color="brand">{batches.length} Batches</Badge>}
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
          action={routes.admin.batchCreate.href()}
          mix={[
            u.vstack({ gap: 4 }),
            u.p(5),
            u.rounded("xl"),
            u.border({ width: 1, color: "neutral" }),
            u.bg("var(--ui-surface, var(--ui-bg))")
          ]}
        >
          <Heading level={2} mix={[u.fontSize("md"), u.weight("semibold"), u.m(0)]}>
            Create New Batch Cohort
          </Heading>

          <div
            mix={[
              u.grid(),
              u.gap(3.5),
              u.media("(min-width: 48rem)", u.raw({ gridTemplateColumns: "1.5fr 1.5fr 1fr" }))
            ]}
          >
            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Coaching Course *</Text>
              <Select name="courseId" required>
                {courses.map((course) => (
                  <Select.Option key={course.id} value={course.id}>
                    {course.title} ({course.category})
                  </Select.Option>
                ))}
              </Select>
            </label>

            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Batch Name *</Text>
              <Input name="name" required placeholder="e.g. TNPSC Group 1 Weekday Morning Batch" />
            </label>

            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                Unique Batch Code *
              </Text>
              <Input name="code" required placeholder="e.g. TNPSC-G1-2026B" />
            </label>
          </div>

          <div
            mix={[
              u.grid(),
              u.gap(3.5),
              u.media("(min-width: 48rem)", u.raw({ gridTemplateColumns: "1.4fr 1.4fr 1fr 1fr" }))
            ]}
          >
            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                Lead Faculty Mentor
              </Text>
              <Select name="facultyId">
                <Select.Option value="">Unassigned (Shared Faculty Access)</Select.Option>
                {facultyList.map((fac) => (
                  <Select.Option key={fac.id} value={fac.id}>
                    {fac.fullName} ({fac.department || fac.email})
                  </Select.Option>
                ))}
              </Select>
            </label>

            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Class Schedule</Text>
              <Input name="scheduleLabel" placeholder="Mon–Sat · 9:30 AM – 1:00 PM" />
            </label>

            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Starts On</Text>
              <Input type="date" name="startsOn" />
            </label>

            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Ends On</Text>
              <Input type="date" name="endsOn" />
            </label>
          </div>

          <div mix={[u.hstack({ justify: "end" })]}>
            <Button type="submit" color="brand" variant="solid">
              Create Batch
            </Button>
          </div>
        </form>

        <div mix={[u.vstack({ gap: 3 })]}>
          {batches.map((batch) => (
            <div
              key={batch.id}
              mix={[
                u.hstack({ justify: "between", align: "center", gap: 3 }),
                u.flexWrap("wrap"),
                u.p(4),
                u.rounded("xl"),
                u.border({ width: 1, color: "neutral" }),
                u.bg("var(--ui-surface, var(--ui-bg))")
              ]}
            >
              <div mix={[u.vstack({ gap: 1 }), u.minWidth(0)]}>
                <div mix={[u.hstack({ gap: 2, align: "center" }), u.flexWrap("wrap")]}>
                  <Text mix={[u.fontSize("sm"), u.weight("bold"), u.m(0)]}>{batch.name}</Text>
                  <Badge color="brand" variant="outline">
                    {batch.code}
                  </Badge>
                  <Badge color={batch.isActive ? "success" : "neutral"} variant="secondary">
                    {batch.isActive ? "Active" : "Archived"}
                  </Badge>
                  <Badge color="neutral" variant="outline">
                    {batch.enrolledCount} Enrolled · {batch.syllabusProgressPct}% Syllabus
                  </Badge>
                </div>
                <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                  {batch.courseTitle}
                  {batch.facultyName ? ` · Mentor: ${batch.facultyName}` : ""}
                  {batch.scheduleLabel ? ` · ${batch.scheduleLabel}` : ""}
                </Text>
              </div>

              <div mix={[u.hstack({ gap: 2, align: "center" })]}>
                <Link
                  href={routes.faculty.batchSyllabus.href({ id: batch.id })}
                  mix={[u.fontSize("xs"), u.weight("semibold")]}
                >
                  Manage Syllabus
                </Link>
                <form method="POST" action={routes.admin.batchToggle.href({ id: batch.id })}>
                  <Button type="submit" size="sm" variant="outline" color="neutral">
                    {batch.isActive ? "Archive" : "Activate"}
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </AdminLayout>
    )
  }
}
