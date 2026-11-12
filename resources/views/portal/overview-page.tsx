import type { Handle } from "remix/component"
import * as u from "@sdxc/u"
import { Badge, Heading, Link, LinkButton, ProgressBar, Text } from "@sdxc/ui"
import { Chart, PageHeader, StatCard } from "@sdxc/ui/app"
import type { SessionUser } from "~/app/initializers/auth"
import type { AspirantPortalSnapshot } from "~/app/models/lms"
import { PortalLayout } from "~/resources/layouts/portal"
import { routes } from "~/routes"

export interface PortalOverviewPageProps {
  user: SessionUser
  snapshot: AspirantPortalSnapshot
}

export function PortalOverviewPage(handle: Handle<PortalOverviewPageProps>) {
  return () => {
    const { user, snapshot } = handle.props
    const presentCards = snapshot.scorecards.filter((s) => s.attendance === "present")
    const chartPoints: Chart.LinePoint[] = presentCards.map((card, idx) => ({
      x: idx,
      y: card.percentage,
      label: `${card.examTitle} (${card.examDate}): ${card.percentage}% (${card.marksObtained}/${card.maxMarks})`
    }))

    return (
      <PortalLayout user={user} currentPath={routes.portal.index.href()}>
        <PageHeader
          crumbs={[{ label: "Aspirant Portal" }]}
          title={`Welcome back, ${user.name}`}
          description="Track your enrolled batch syllabus progress, mock exam score trends, upcoming test dates, and mentor updates."
          actions={
            <div mix={[u.hstack({ gap: 2, align: "center" }), u.flexWrap("wrap")]}>
              <LinkButton href={routes.portal.marks.href()} color="brand" variant="solid" size="sm">
                View Scorecards
              </LinkButton>
              <LinkButton
                href={routes.portal.materials.href()}
                color="neutral"
                variant="outline"
                size="sm"
              >
                Study Materials
              </LinkButton>
            </div>
          }
        />

        <StatCard.Group columns={4}>
          <StatCard href={routes.portal.progress.href()}>
            <StatCard.Label>Syllabus Completion</StatCard.Label>
            <StatCard.Value>{snapshot.overallSyllabusPct}%</StatCard.Value>
            <StatCard.Footer>
              Across {snapshot.batches.length || 0} active batch enrollment
              {snapshot.batches.length === 1 ? "" : "s"}
            </StatCard.Footer>
          </StatCard>

          <StatCard href={routes.portal.marks.href()}>
            <StatCard.Label>Published Mock Tests</StatCard.Label>
            <StatCard.Value>{snapshot.completedExamsCount}</StatCard.Value>
            <StatCard.Footer>Evaluated OMR &amp; mock examinations</StatCard.Footer>
          </StatCard>

          <StatCard href={routes.portal.marks.href()}>
            <StatCard.Label>Average Score</StatCard.Label>
            <StatCard.Value>
              {presentCards.length > 0 ? `${snapshot.averagePercentage}%` : "—"}
            </StatCard.Value>
            <StatCard.Footer>
              {presentCards.length > 0
                ? "Mean percentage across attended exams"
                : "Appears once first exam is published"}
            </StatCard.Footer>
          </StatCard>

          <StatCard href={routes.portal.marks.href()}>
            <StatCard.Label>Best Batch Rank</StatCard.Label>
            <StatCard.Value>{snapshot.bestRank ? `#${snapshot.bestRank}` : "—"}</StatCard.Value>
            <StatCard.Footer>Highest standing in published cohort tests</StatCard.Footer>
          </StatCard>
        </StatCard.Group>

        {/* Enrolled Batches & Module Checklist Summary */}
        <div mix={[u.vstack({ gap: 3.5 })]}>
          <div mix={[u.hstack({ justify: "between", align: "center" })]}>
            <Heading level={2} mix={[u.fontSize("lg"), u.weight("semibold"), u.m(0)]}>
              My Enrolled Batches &amp; Syllabus Progress
            </Heading>
            <Link
              href={routes.portal.progress.href()}
              mix={[u.fontSize("xs"), u.weight("semibold")]}
            >
              Full Syllabus Checklist →
            </Link>
          </div>

          {snapshot.batches.length === 0 ? (
            <div
              mix={[
                u.p(5),
                u.rounded("xl"),
                u.border({ width: 1, color: "neutral" }),
                u.bg("var(--ui-surface, var(--ui-bg))")
              ]}
            >
              <Text mix={[u.fontSize("sm"), u.fg("neutral.muted"), u.m(0)]}>
                Your account is active. Batch assignment will appear here once finalized by the
                admissions desk.
              </Text>
            </div>
          ) : (
            <div mix={[u.vstack({ gap: 3.5 })]}>
              {snapshot.batches.map((b) => (
                <div
                  key={b.enrollmentId}
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
                        <Heading level={3} mix={[u.fontSize("md"), u.weight("bold"), u.m(0)]}>
                          {b.courseTitle} — {b.batchName}
                        </Heading>
                        <Badge color="brand" variant="outline">
                          {b.batchCode}
                        </Badge>
                        <Badge color="neutral" variant="secondary">
                          Roll No: {b.rollNumber}
                        </Badge>
                      </div>
                      <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                        {b.scheduleLabel || "Regular Schedule"}
                        {b.facultyName ? ` · Lead Mentor: ${b.facultyName}` : ""}
                      </Text>
                    </div>
                    <Badge color="success" variant="outline">
                      {b.syllabusProgressPct}% Complete
                    </Badge>
                  </div>

                  <ProgressBar>
                    <ProgressBar.Indicator
                      value={b.syllabusProgressPct}
                      max={100}
                      aria-label={`Syllabus completion for ${b.batchName}`}
                    />
                    <ProgressBar.ValueLabel>
                      {b.completedTopics} of {b.totalTopics} modules completed
                      {b.inProgressTopics > 0 ? ` · ${b.inProgressTopics} in progress` : ""}
                    </ProgressBar.ValueLabel>
                  </ProgressBar>

                  {b.topics.length > 0 && (
                    <div mix={[u.hstack({ gap: 2, align: "center" }), u.flexWrap("wrap")]}>
                      {b.topics.slice(0, 6).map((topic) => (
                        <Badge
                          key={topic.id}
                          color={
                            topic.status === "completed"
                              ? "success"
                              : topic.status === "in_progress"
                                ? "warning"
                                : "neutral"
                          }
                          variant="outline"
                        >
                          {topic.unitLabel}: {topic.title}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chronological Score Progression Chart */}
        <div
          mix={[
            u.vstack({ gap: 3.5 }),
            u.p(5),
            u.rounded("xl"),
            u.border({ width: 1, color: "neutral" }),
            u.bg("var(--ui-surface, var(--ui-bg))")
          ]}
        >
          <div mix={[u.hstack({ justify: "between", align: "center" }), u.flexWrap("wrap")]}>
            <div mix={[u.vstack({ gap: 0.5 })]}>
              <Heading level={2} mix={[u.fontSize("md"), u.weight("semibold"), u.m(0)]}>
                Chronological Mock Exam Score Trend
              </Heading>
              <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                Percentage trajectory across published mock and OMR tests
              </Text>
            </div>
            <Link href={routes.portal.marks.href()} mix={[u.fontSize("xs"), u.weight("semibold")]}>
              Inspect Detailed Scorecards →
            </Link>
          </div>

          {chartPoints.length === 0 ? (
            <div
              mix={[
                u.p(6),
                u.rounded("lg"),
                u.border({ width: 1, color: "neutral" }),
                u.bg("var(--ui-bg)"),
                u.textAlign("center")
              ]}
            >
              <Text mix={[u.fontSize("sm"), u.fg("neutral.muted"), u.m(0)]}>
                No published exam scores recorded yet. Once your faculty publishes your first mock
                or OMR test, your chronological score progression chart will appear here.
              </Text>
            </div>
          ) : (
            <div mix={[u.vstack({ gap: 2 })]}>
              <Chart
                width={640}
                height={210}
                xDomain={[0, Math.max(1, chartPoints.length - 1)]}
                yDomain={[0, 100]}
                aria-label="Chronological mock exam score percentage progression"
              >
                <Chart.Threshold y={40} label="Qualifying (40%)" tone="warning" />
                <Chart.Area points={chartPoints} color={1} baseline={0} />
                <Chart.Line points={chartPoints} color={1} />
              </Chart>
              <Chart.Legend aria-label="Score progression series">
                <Chart.Legend.Item color={1}>Test Score Percentage (%)</Chart.Legend.Item>
              </Chart.Legend>
            </div>
          )}
        </div>

        {/* Recent Targeted Notifications */}
        <div mix={[u.vstack({ gap: 3 })]}>
          <div mix={[u.hstack({ justify: "between", align: "center" })]}>
            <Heading level={2} mix={[u.fontSize("md"), u.weight("semibold"), u.m(0)]}>
              Recent Academy Notifications
            </Heading>
            <Link
              href={routes.portal.notifications.href()}
              mix={[u.fontSize("xs"), u.weight("semibold")]}
            >
              All Notifications →
            </Link>
          </div>

          {snapshot.notifications.length === 0 ? (
            <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
              No announcements posted for your cohort yet.
            </Text>
          ) : (
            <div mix={[u.vstack({ gap: 2.5 })]}>
              {snapshot.notifications.slice(0, 3).map((notif) => (
                <div
                  key={notif.id}
                  mix={[
                    u.vstack({ gap: 1 }),
                    u.p(4),
                    u.rounded("xl"),
                    u.border({ width: 1, color: "neutral" }),
                    u.bg("var(--ui-surface, var(--ui-bg))")
                  ]}
                >
                  <div mix={[u.hstack({ gap: 2, align: "center" }), u.flexWrap("wrap")]}>
                    <Badge color="brand" variant="outline">
                      {notif.category}
                    </Badge>
                    <Text mix={[u.fontSize("sm"), u.weight("semibold"), u.m(0)]}>
                      {notif.title}
                    </Text>
                    <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                      · {notif.publishedAt.slice(0, 10)}
                    </Text>
                  </div>
                  <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>{notif.body}</Text>
                </div>
              ))}
            </div>
          )}
        </div>
      </PortalLayout>
    )
  }
}
