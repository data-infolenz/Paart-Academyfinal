import type { Handle } from "remix/component"
import * as u from "@sdxc/u"
import { Badge, Heading, ProgressBar, Text } from "@sdxc/ui"
import { Chart, PageHeader } from "@sdxc/ui/app"
import type { SessionUser } from "~/app/initializers/auth"
import type { AspirantPortalSnapshot } from "~/app/models/lms"
import { PortalLayout } from "~/resources/layouts/portal"
import { routes } from "~/routes"

export interface PortalProgressPageProps {
  user: SessionUser
  snapshot: AspirantPortalSnapshot
}

export function PortalProgressPage(handle: Handle<PortalProgressPageProps>) {
  return () => {
    const { user, snapshot } = handle.props
    const presentCards = snapshot.scorecards.filter((s) => s.attendance === "present")
    const chartPoints: Chart.LinePoint[] = presentCards.map((card, idx) => ({
      x: idx,
      y: card.percentage,
      label: `${card.examTitle}: ${card.percentage}%`
    }))

    return (
      <PortalLayout user={user} currentPath={routes.portal.progress.href()}>
        <PageHeader
          crumbs={[
            { label: "Portal", href: routes.portal.index.href() },
            { label: "Syllabus & Progress" }
          ]}
          title="Syllabus Modules & Score Analytics"
          description="Detailed unit-by-unit syllabus checklist and cumulative mock test performance."
          status={<Badge color="brand">{snapshot.overallSyllabusPct}% Syllabus Done</Badge>}
        />

        {snapshot.batches.map((batch) => (
          <div
            key={batch.enrollmentId}
            mix={[
              u.vstack({ gap: 4 }),
              u.p(5),
              u.rounded("xl"),
              u.border({ width: 1, color: "neutral" }),
              u.bg("var(--ui-surface, var(--ui-bg))")
            ]}
          >
            <div
              mix={[u.hstack({ justify: "between", align: "center", gap: 3 }), u.flexWrap("wrap")]}
            >
              <div mix={[u.vstack({ gap: 1 })]}>
                <div mix={[u.hstack({ gap: 2, align: "center" }), u.flexWrap("wrap")]}>
                  <Heading level={2} mix={[u.fontSize("md"), u.weight("bold"), u.m(0)]}>
                    {batch.courseTitle} — {batch.batchName}
                  </Heading>
                  <Badge color="brand" variant="outline">
                    {batch.batchCode}
                  </Badge>
                </div>
                <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                  Roll No: <strong>{batch.rollNumber}</strong>
                  {batch.facultyName ? ` · Faculty Mentor: ${batch.facultyName}` : ""}
                </Text>
              </div>
              <Badge color="success" variant="secondary">
                {batch.completedTopics} / {batch.totalTopics} Completed ({batch.syllabusProgressPct}
                %)
              </Badge>
            </div>

            <ProgressBar>
              <ProgressBar.Indicator
                value={batch.syllabusProgressPct}
                max={100}
                aria-label={`${batch.batchName} syllabus progress`}
              />
              <ProgressBar.ValueLabel>
                {batch.syllabusProgressPct}% syllabus completed
              </ProgressBar.ValueLabel>
            </ProgressBar>

            {batch.topics.length === 0 ? (
              <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                Syllabus units are being prepared by your faculty mentor.
              </Text>
            ) : (
              <div mix={[u.vstack({ gap: 2 })]}>
                {batch.topics.map((topic) => (
                  <div
                    key={topic.id}
                    mix={[
                      u.hstack({ justify: "between", align: "center", gap: 2 }),
                      u.flexWrap("wrap"),
                      u.p(3),
                      u.rounded("lg"),
                      u.border({ width: 1, color: "neutral" }),
                      u.bg("var(--ui-bg)")
                    ]}
                  >
                    <div mix={[u.hstack({ gap: 2, align: "center" }), u.flexWrap("wrap")]}>
                      <Badge color="brand" variant="outline">
                        {topic.unitLabel}
                      </Badge>
                      <Text mix={[u.fontSize("sm"), u.weight("medium"), u.m(0)]}>
                        {topic.title}
                      </Text>
                    </div>
                    <Badge
                      color={
                        topic.status === "completed"
                          ? "success"
                          : topic.status === "in_progress"
                            ? "warning"
                            : "neutral"
                      }
                      variant="secondary"
                    >
                      {topic.status === "completed"
                        ? "Completed"
                        : topic.status === "in_progress"
                          ? "In Progress"
                          : "Upcoming"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {chartPoints.length > 0 && (
          <div
            mix={[
              u.vstack({ gap: 3 }),
              u.p(5),
              u.rounded("xl"),
              u.border({ width: 1, color: "neutral" }),
              u.bg("var(--ui-surface, var(--ui-bg))")
            ]}
          >
            <Heading level={2} mix={[u.fontSize("md"), u.weight("semibold"), u.m(0)]}>
              Cumulative Score Trajectory
            </Heading>
            <Chart
              width={640}
              height={220}
              xDomain={[0, Math.max(1, chartPoints.length - 1)]}
              yDomain={[0, 100]}
              aria-label="Cumulative exam score progression"
            >
              <Chart.Threshold y={40} label="Qualifying" tone="warning" />
              <Chart.Area points={chartPoints} color={2} baseline={0} />
              <Chart.Line points={chartPoints} color={2} />
            </Chart>
          </div>
        )}
      </PortalLayout>
    )
  }
}
