import type { Handle } from "remix/component"
import * as u from "@sdxc/u"
import { Badge, Heading, Text } from "@sdxc/ui"
import { PageHeader } from "@sdxc/ui/app"
import type { SessionUser } from "~/app/initializers/auth"
import type { ExamItem } from "~/app/models/lms"
import { PortalLayout } from "~/resources/layouts/portal"
import { routes } from "~/routes"

export interface PortalExamsPageProps {
  user: SessionUser
  exams: ExamItem[]
}

const EXAM_TYPE_LABELS: Record<string, string> = {
  weekly_mock: "Weekly Mock Test",
  omr_revision: "OMR Revision Test",
  full_test: "Full Syllabus Test"
}

export function PortalExamsPage(handle: Handle<PortalExamsPageProps>) {
  return () => {
    const { user, exams } = handle.props

    return (
      <PortalLayout user={user} currentPath={routes.portal.exams.href()}>
        <PageHeader
          crumbs={[
            { label: "Portal", href: routes.portal.index.href() },
            { label: "Exam Timetable" }
          ]}
          title="Batch Exam Timetable"
          description="Upcoming and past mock & OMR examinations scheduled for your enrolled cohorts."
          status={<Badge color="brand">{exams.length} Scheduled</Badge>}
        />

        {exams.length === 0 ? (
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
              No exams have been scheduled for your enrolled batch yet.
            </Text>
          </div>
        ) : (
          <div mix={[u.vstack({ gap: 3.5 })]}>
            {exams.map((exam) => (
              <div
                key={exam.id}
                mix={[
                  u.vstack({ gap: 2 }),
                  u.p(4.5),
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
                        {exam.title}
                      </Heading>
                      <Badge color="brand" variant="outline">
                        {exam.batchCode}
                      </Badge>
                      <Badge color="neutral" variant="secondary">
                        {EXAM_TYPE_LABELS[exam.examType] ?? exam.examType}
                      </Badge>
                    </div>
                    <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                      {exam.courseTitle} — {exam.batchName}
                    </Text>
                  </div>

                  <Badge
                    color={exam.status === "published" ? "success" : "warning"}
                    variant="secondary"
                  >
                    {exam.status === "published"
                      ? "Results Published"
                      : `Scheduled · ${exam.examDate}`}
                  </Badge>
                </div>

                <div mix={[u.hstack({ gap: 4, align: "center" }), u.flexWrap("wrap")]}>
                  <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                    <strong>Exam Date:</strong> {exam.examDate}
                  </Text>
                  <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                    <strong>Maximum Marks:</strong> {exam.maxMarks}
                  </Text>
                  <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                    <strong>Qualifying Marks:</strong> {exam.qualifyingMarks}
                  </Text>
                </div>

                {exam.syllabusNotes && (
                  <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                    <strong>Syllabus Coverage:</strong> {exam.syllabusNotes}
                  </Text>
                )}
              </div>
            ))}
          </div>
        )}
      </PortalLayout>
    )
  }
}
