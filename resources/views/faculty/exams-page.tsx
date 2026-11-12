import type { Handle } from "remix/component"
import * as u from "@sdxc/u"
import { Badge, Button, Heading, Input, LinkButton, Select, Text, TextArea } from "@sdxc/ui"
import { PageHeader } from "@sdxc/ui/app"
import type { SessionUser } from "~/app/initializers/auth"
import type { BatchSummaryItem, ExamItem } from "~/app/models/lms"
import { FacultyLayout } from "~/resources/layouts/faculty"
import { routes } from "~/routes"

export interface FacultyExamsPageProps {
  user: SessionUser
  exams: ExamItem[]
  batches: BatchSummaryItem[]
  notice?: string | null
  error?: string | null
}

const EXAM_TYPE_LABELS: Record<string, string> = {
  weekly_mock: "Weekly Mock Test",
  omr_revision: "OMR Revision Test",
  full_test: "Full Syllabus Test"
}

export function FacultyExamsPage(handle: Handle<FacultyExamsPageProps>) {
  return () => {
    const { user, exams, batches, notice, error } = handle.props
    const activeBatches = batches.filter((b) => b.isActive)

    return (
      <FacultyLayout user={user} currentPath={routes.faculty.exams.href()}>
        <PageHeader
          crumbs={[
            { label: "Faculty", href: routes.faculty.index.href() },
            { label: "Exams & Scorecards" }
          ]}
          title="Mock & OMR Exams"
          description="Schedule upcoming cohort tests, enter or bulk-import aspirant marks, and publish ranked scorecards."
          status={<Badge color="brand">{exams.length} Exams</Badge>}
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
          action={routes.faculty.examCreate.href()}
          mix={[
            u.vstack({ gap: 4 }),
            u.p(5),
            u.rounded("xl"),
            u.border({ width: 1, color: "neutral" }),
            u.bg("var(--ui-surface, var(--ui-bg))")
          ]}
        >
          <Heading level={2} mix={[u.fontSize("md"), u.weight("semibold"), u.m(0)]}>
            Schedule New Batch Exam
          </Heading>

          <div
            mix={[
              u.grid(),
              u.gap(3.5),
              u.media("(min-width: 48rem)", u.raw({ gridTemplateColumns: "1.4fr 1.8fr 1fr" }))
            ]}
          >
            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Target Batch *</Text>
              <Select name="batchId" required>
                {activeBatches.map((b) => (
                  <Select.Option key={b.id} value={b.id}>
                    {b.name} ({b.code})
                  </Select.Option>
                ))}
              </Select>
            </label>

            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Exam Title *</Text>
              <Input
                name="title"
                required
                placeholder="e.g. TNPSC Group 1 — Polity & Economy OMR Test 04"
              />
            </label>

            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Exam Type *</Text>
              <Select name="examType" required>
                <Select.Option value="weekly_mock">Weekly Mock Test</Select.Option>
                <Select.Option value="omr_revision">OMR Revision Test</Select.Option>
                <Select.Option value="full_test">Full Syllabus Test</Select.Option>
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
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Exam Date *</Text>
              <Input type="date" name="examDate" required />
            </label>

            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Maximum Marks *</Text>
              <Input type="number" name="maxMarks" required min="1" step="0.5" defaultValue="100" />
            </label>

            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Qualifying Marks *</Text>
              <Input
                type="number"
                name="qualifyingMarks"
                required
                min="0"
                step="0.5"
                defaultValue="40"
              />
            </label>
          </div>

          <label mix={[u.vstack({ gap: 1.5 })]}>
            <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
              Syllabus Coverage &amp; Exam Instructions
            </Text>
            <TextArea
              name="syllabusNotes"
              rows={2}
              placeholder="Units covered, negative marking rules, reporting time, OMR black ballpoint pen instructions..."
            />
          </label>

          <div mix={[u.hstack({ justify: "end" })]}>
            <Button type="submit" color="brand" variant="solid">
              Schedule Exam
            </Button>
          </div>
        </form>

        <div mix={[u.vstack({ gap: 3 })]}>
          {exams.map((exam) => (
            <div
              key={exam.id}
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
                  <Text mix={[u.fontSize("sm"), u.weight("bold"), u.m(0)]}>{exam.title}</Text>
                  <Badge color="brand" variant="outline">
                    {exam.batchCode}
                  </Badge>
                  <Badge color="neutral" variant="secondary">
                    {EXAM_TYPE_LABELS[exam.examType] ?? exam.examType}
                  </Badge>
                  <Badge
                    color={exam.status === "published" ? "success" : "warning"}
                    variant="secondary"
                  >
                    {exam.status === "published" ? "Published" : "Scheduled (Draft Marks)"}
                  </Badge>
                </div>
                <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                  Date: <strong>{exam.examDate}</strong> · Max: {exam.maxMarks} · Qualifying:{" "}
                  {exam.qualifyingMarks} · Recorded: {exam.recordedCount}/{exam.enrolledCount}{" "}
                  aspirants
                </Text>
                {exam.syllabusNotes && (
                  <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                    Syllabus: {exam.syllabusNotes}
                  </Text>
                )}
              </div>

              <div mix={[u.hstack({ gap: 2, align: "center" })]}>
                <LinkButton
                  href={routes.faculty.examMarks.href({ id: exam.id })}
                  size="sm"
                  color="brand"
                  variant="outline"
                >
                  Enter Marks / Publish
                </LinkButton>
              </div>
            </div>
          ))}
        </div>
      </FacultyLayout>
    )
  }
}
