import type { Handle } from "remix/component"
import * as u from "@sdxc/u"
import { Badge, Heading, Link, LinkButton, ProgressBar, Text } from "@sdxc/ui"
import { PageHeader, StatCard } from "@sdxc/ui/app"
import type { SessionUser } from "~/app/initializers/auth"
import type { BatchSummaryItem, ExamItem } from "~/app/models/lms"
import { FacultyLayout } from "~/resources/layouts/faculty"
import { routes } from "~/routes"

export interface FacultyOverviewPageProps {
  user: SessionUser
  batches: BatchSummaryItem[]
  recentExams: ExamItem[]
  materialsCount: number
  notificationsCount: number
}

export function FacultyOverviewPage(handle: Handle<FacultyOverviewPageProps>) {
  return () => {
    const { user, batches, recentExams, materialsCount, notificationsCount } = handle.props
    const activeBatches = batches.filter((b) => b.isActive)
    const totalEnrolled = activeBatches.reduce((sum, b) => sum + b.enrolledCount, 0)

    return (
      <FacultyLayout user={user} currentPath={routes.faculty.index.href()}>
        <PageHeader
          crumbs={[{ label: "Faculty Workspace" }]}
          title={`Welcome, ${user.name}`}
          description="Manage batch syllabus coverage, schedule mock & OMR exams, record aspirant scorecards, and share study resources."
          actions={
            <div mix={[u.hstack({ gap: 2, align: "center" }), u.flexWrap("wrap")]}>
              <LinkButton
                href={routes.faculty.exams.href()}
                color="brand"
                variant="solid"
                size="sm"
              >
                Schedule Exam / Enter Marks
              </LinkButton>
              <LinkButton
                href={routes.faculty.notifications.href()}
                color="neutral"
                variant="outline"
                size="sm"
              >
                Post Notification
              </LinkButton>
            </div>
          }
        />

        <StatCard.Group columns={4}>
          <StatCard>
            <StatCard.Label>Active Batches</StatCard.Label>
            <StatCard.Value>{activeBatches.length}</StatCard.Value>
            <StatCard.Footer>{totalEnrolled} enrolled aspirants across cohorts</StatCard.Footer>
          </StatCard>
          <StatCard>
            <StatCard.Label>Exams Scheduled / Published</StatCard.Label>
            <StatCard.Value>{recentExams.length}</StatCard.Value>
            <StatCard.Footer>
              {recentExams.filter((e) => e.status === "published").length} published scorecards
            </StatCard.Footer>
          </StatCard>
          <StatCard>
            <StatCard.Label>Study Materials</StatCard.Label>
            <StatCard.Value>{materialsCount}</StatCard.Value>
            <StatCard.Footer>Public &amp; enrolled course resources</StatCard.Footer>
          </StatCard>
          <StatCard>
            <StatCard.Label>Broadcast Alerts</StatCard.Label>
            <StatCard.Value>{notificationsCount}</StatCard.Value>
            <StatCard.Footer>Targeted exam &amp; timetable updates</StatCard.Footer>
          </StatCard>
        </StatCard.Group>

        <div mix={[u.vstack({ gap: 3.5 })]}>
          <div mix={[u.hstack({ justify: "between", align: "center" })]}>
            <Heading level={2} mix={[u.fontSize("lg"), u.weight("semibold"), u.m(0)]}>
              Batch Cohorts &amp; Syllabus Completion
            </Heading>
          </div>

          {activeBatches.length === 0 ? (
            <div
              mix={[
                u.p(6),
                u.rounded("xl"),
                u.border({ width: 1, color: "neutral" }),
                u.bg("var(--ui-surface, var(--ui-bg))")
              ]}
            >
              <Text mix={[u.fontSize("sm"), u.fg("neutral.muted"), u.m(0)]}>
                No active batches created yet. Ask an Administrator to create a batch cohort in
                Admin Console.
              </Text>
            </div>
          ) : (
            <div
              mix={[
                u.grid(),
                u.gap(4),
                u.media(
                  "(min-width: 52rem)",
                  u.raw({ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" })
                )
              ]}
            >
              {activeBatches.map((batch) => (
                <div
                  key={batch.id}
                  mix={[
                    u.vstack({ gap: 3 }),
                    u.p(5),
                    u.rounded("xl"),
                    u.border({ width: 1, color: "neutral" }),
                    u.bg("var(--ui-surface, var(--ui-bg))")
                  ]}
                >
                  <div mix={[u.hstack({ justify: "between", align: "start", gap: 2 })]}>
                    <div mix={[u.vstack({ gap: 1 })]}>
                      <div mix={[u.hstack({ gap: 2, align: "center" }), u.flexWrap("wrap")]}>
                        <Heading level={3} mix={[u.fontSize("md"), u.weight("bold"), u.m(0)]}>
                          {batch.name}
                        </Heading>
                        <Badge color="brand" variant="outline">
                          {batch.code}
                        </Badge>
                      </div>
                      <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                        {batch.courseTitle}
                        {batch.scheduleLabel ? ` · ${batch.scheduleLabel}` : ""}
                      </Text>
                    </div>
                    <Badge color="neutral" variant="secondary">
                      {batch.enrolledCount} Aspirants
                    </Badge>
                  </div>

                  <ProgressBar>
                    <ProgressBar.Indicator
                      value={batch.syllabusProgressPct}
                      max={100}
                      aria-label={`Syllabus completion for ${batch.name}`}
                    />
                    <ProgressBar.ValueLabel>
                      {batch.completedTopics} / {batch.totalTopics} topics completed (
                      {batch.syllabusProgressPct}%)
                    </ProgressBar.ValueLabel>
                  </ProgressBar>

                  <div mix={[u.hstack({ justify: "between", align: "center" })]}>
                    <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                      {batch.facultyName ? `Mentor: ${batch.facultyName}` : "Shared Faculty Cohort"}
                    </Text>
                    <Link
                      href={routes.faculty.batchSyllabus.href({ id: batch.id })}
                      mix={[u.fontSize("xs"), u.weight("semibold")]}
                    >
                      Update Syllabus Topics →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </FacultyLayout>
    )
  }
}
