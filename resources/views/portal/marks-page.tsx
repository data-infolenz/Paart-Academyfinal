import type { Handle } from "remix/component"
import * as u from "@sdxc/u"
import { Badge, Text } from "@sdxc/ui"
import { PageHeader, Table } from "@sdxc/ui/app"
import type { SessionUser } from "~/app/initializers/auth"
import type { AspirantPublishedScorecard } from "~/app/models/lms"
import { PortalLayout } from "~/resources/layouts/portal"
import { routes } from "~/routes"

export interface PortalMarksPageProps {
  user: SessionUser
  scorecards: AspirantPublishedScorecard[]
}

export function PortalMarksPage(handle: Handle<PortalMarksPageProps>) {
  return () => {
    const { user, scorecards } = handle.props
    const orderedNewestFirst = [...scorecards].reverse()

    return (
      <PortalLayout user={user} currentPath={routes.portal.marks.href()}>
        <PageHeader
          crumbs={[
            { label: "Portal", href: routes.portal.index.href() },
            { label: "My Marks & Ranks" }
          ]}
          title="Published Test Marks & Batch Ranks"
          description="Your personal evaluated OMR & mock test scorecards, qualifying status, cohort rank, and faculty remarks."
          status={<Badge color="brand">{scorecards.length} Published</Badge>}
        />

        {orderedNewestFirst.length === 0 ? (
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
              No published exam scorecards yet. Draft evaluations remain hidden until officially
              published by your faculty mentor.
            </Text>
          </div>
        ) : (
          <div
            mix={[
              u.p(4),
              u.rounded("xl"),
              u.border({ width: 1, color: "neutral" }),
              u.bg("var(--ui-surface, var(--ui-bg))")
            ]}
          >
            <Table.Container>
              <Table aria-label="Published exam scorecards" density="comfortable">
                <Table.Header>
                  <Table.Row>
                    <Table.Column>Exam &amp; Batch</Table.Column>
                    <Table.Column>Date</Table.Column>
                    <Table.Column>Attendance</Table.Column>
                    <Table.Column numeric>Marks</Table.Column>
                    <Table.Column numeric>Percentage</Table.Column>
                    <Table.Column>Outcome</Table.Column>
                    <Table.Column numeric>Batch Rank</Table.Column>
                    <Table.Column>Faculty Remarks</Table.Column>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {orderedNewestFirst.map((card) => (
                    <Table.Row key={card.examId}>
                      <Table.Cell>
                        <div mix={[u.vstack({ gap: 0.5 })]}>
                          <Text mix={[u.fontSize("xs"), u.weight("bold"), u.m(0)]}>
                            {card.examTitle}
                          </Text>
                          <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                            {card.courseTitle} · {card.batchCode}
                          </Text>
                        </div>
                      </Table.Cell>
                      <Table.Cell>{card.examDate}</Table.Cell>
                      <Table.Cell>
                        <Badge
                          color={card.attendance === "present" ? "success" : "neutral"}
                          variant="outline"
                        >
                          {card.attendance}
                        </Badge>
                      </Table.Cell>
                      <Table.Cell numeric>
                        {card.attendance === "present"
                          ? `${card.marksObtained} / ${card.maxMarks}`
                          : "—"}
                      </Table.Cell>
                      <Table.Cell numeric>
                        {card.attendance === "present" ? `${card.percentage}%` : "—"}
                      </Table.Cell>
                      <Table.Cell>
                        {card.attendance === "absent" ? (
                          <Badge color="neutral" variant="secondary">
                            Absent
                          </Badge>
                        ) : card.qualified ? (
                          <Badge color="success" variant="secondary">
                            Qualified
                          </Badge>
                        ) : (
                          <Badge color="warning" variant="secondary">
                            Needs Revision
                          </Badge>
                        )}
                      </Table.Cell>
                      <Table.Cell numeric>{card.rank ? `#${card.rank}` : "—"}</Table.Cell>
                      <Table.Cell>
                        <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                          {card.remarks || "—"}
                        </Text>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Table.Container>
          </div>
        )}
      </PortalLayout>
    )
  }
}
