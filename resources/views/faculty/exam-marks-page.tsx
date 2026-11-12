import type { Handle } from "remix/component"
import * as u from "@sdxc/u"
import { Badge, Button, Heading, Input, LinkButton, Select, Text, TextArea } from "@sdxc/ui"
import { PageHeader, Table } from "@sdxc/ui/app"
import type { SessionUser } from "~/app/initializers/auth"
import type { ExamItem, MarksSheetEntry } from "~/app/models/lms"
import { FacultyLayout } from "~/resources/layouts/faculty"
import { routes } from "~/routes"

export interface FacultyExamMarksPageProps {
  user: SessionUser
  exam: ExamItem
  entries: MarksSheetEntry[]
  notice?: string | null
  error?: string | null
}

export function FacultyExamMarksPage(handle: Handle<FacultyExamMarksPageProps>) {
  return () => {
    const { user, exam, entries, notice, error } = handle.props

    return (
      <FacultyLayout user={user} currentPath={routes.faculty.examMarks.href({ id: exam.id })}>
        <PageHeader
          crumbs={[
            { label: "Faculty", href: routes.faculty.index.href() },
            { label: "Exams", href: routes.faculty.exams.href() },
            { label: exam.title }
          ]}
          title={exam.title}
          description={`${exam.batchName} (${exam.batchCode}) · Date: ${exam.examDate} · Max Marks: ${exam.maxMarks} · Qualifying: ${exam.qualifyingMarks}`}
          status={
            <Badge color={exam.status === "published" ? "success" : "warning"}>
              {exam.status === "published"
                ? "Published to Portal"
                : "Draft (Hidden from Aspirants)"}
            </Badge>
          }
          actions={
            <div mix={[u.hstack({ gap: 2, align: "center" }), u.flexWrap("wrap")]}>
              <LinkButton
                href={routes.faculty.examMarksTemplate.href({ id: exam.id })}
                size="sm"
                variant="outline"
                color="neutral"
              >
                Download CSV Template
              </LinkButton>

              <form method="POST" action={routes.faculty.examPublish.href({ id: exam.id })}>
                <Button type="submit" size="sm" color="success" variant="solid">
                  {exam.status === "published"
                    ? "Recompute Ranks & Republish"
                    : "Publish Results & Compute Ranks"}
                </Button>
              </form>
            </div>
          }
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

        {/* CSV Import Box */}
        <form
          method="POST"
          action={routes.faculty.examMarksImport.href({ id: exam.id })}
          encType="multipart/form-data"
          mix={[
            u.vstack({ gap: 3 }),
            u.p(4.5),
            u.rounded("xl"),
            u.border({ width: 1, color: "neutral" }),
            u.bg("var(--ui-surface, var(--ui-bg))")
          ]}
        >
          <div
            mix={[u.hstack({ justify: "between", align: "center", gap: 3 }), u.flexWrap("wrap")]}
          >
            <div mix={[u.vstack({ gap: 0.5 })]}>
              <Heading level={2} mix={[u.fontSize("sm"), u.weight("semibold"), u.m(0)]}>
                Bulk Import Marks via CSV
              </Heading>
              <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                Upload a `.csv` file or paste CSV rows with headers{" "}
                <code>roll_number,email,attendance,marks_obtained,remarks</code>.
              </Text>
            </div>
          </div>

          <div
            mix={[
              u.grid(),
              u.gap(3),
              u.media("(min-width: 48rem)", u.raw({ gridTemplateColumns: "1fr 1.6fr auto" })),
              u.raw({ alignItems: "end" })
            ]}
          >
            <label mix={[u.vstack({ gap: 1 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>CSV File</Text>
              <input type="file" name="csvFile" accept=".csv,text/csv" />
            </label>

            <label mix={[u.vstack({ gap: 1 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                Or Paste CSV Content Directly
              </Text>
              <TextArea
                name="csvText"
                rows={2}
                placeholder="email,attendance,marks_obtained,remarks"
              />
            </label>

            <Button type="submit" size="sm" color="brand" variant="outline">
              Validate &amp; Import CSV
            </Button>
          </div>
        </form>

        {/* Manual / Grid Marks Sheet */}
        {entries.length === 0 ? (
          <div
            mix={[
              u.p(6),
              u.rounded("xl"),
              u.border({ width: 1, color: "neutral" }),
              u.bg("var(--ui-surface, var(--ui-bg))")
            ]}
          >
            <Text mix={[u.fontSize("sm"), u.fg("neutral.muted"), u.m(0)]}>
              No aspirants are actively enrolled in {exam.batchName} ({exam.batchCode}) yet.
            </Text>
          </div>
        ) : (
          <form
            method="POST"
            action={routes.faculty.examMarksSave.href({ id: exam.id })}
            mix={[
              u.vstack({ gap: 4 }),
              u.p(5),
              u.rounded("xl"),
              u.border({ width: 1, color: "neutral" }),
              u.bg("var(--ui-surface, var(--ui-bg))")
            ]}
          >
            <div mix={[u.hstack({ justify: "between", align: "center" }), u.flexWrap("wrap")]}>
              <Heading level={2} mix={[u.fontSize("md"), u.weight("semibold"), u.m(0)]}>
                Enrolled Aspirant Scorecards ({entries.length})
              </Heading>
              <Button type="submit" color="brand" variant="solid" size="sm">
                Save Marks Sheet
              </Button>
            </div>

            <Table.Container>
              <Table aria-label={`Marks entry for ${exam.title}`} density="comfortable">
                <Table.Header>
                  <Table.Row>
                    <Table.Column>Roll No.</Table.Column>
                    <Table.Column>Aspirant</Table.Column>
                    <Table.Column>Attendance</Table.Column>
                    <Table.Column numeric>Marks (/ {exam.maxMarks})</Table.Column>
                    <Table.Column numeric>Rank</Table.Column>
                    <Table.Column>Faculty Remarks</Table.Column>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {entries.map((entry, index) => (
                    <Table.Row key={entry.aspirantId}>
                      <Table.Cell>
                        <input
                          type="hidden"
                          name={`aspirantId_${index}`}
                          value={entry.aspirantId}
                        />
                        <code>{entry.rollNumber}</code>
                      </Table.Cell>
                      <Table.Cell>
                        <div mix={[u.vstack({ gap: 0.5 })]}>
                          <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                            {entry.fullName}
                          </Text>
                          <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                            {entry.email}
                          </Text>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <Select
                          name={`attendance_${index}`}
                          aria-label={`Attendance for ${entry.fullName}`}
                        >
                          <Select.Option value="present" selected={entry.attendance === "present"}>
                            Present
                          </Select.Option>
                          <Select.Option value="absent" selected={entry.attendance === "absent"}>
                            Absent
                          </Select.Option>
                        </Select>
                      </Table.Cell>
                      <Table.Cell numeric>
                        <Input
                          type="number"
                          name={`marks_${index}`}
                          min="0"
                          max={String(exam.maxMarks)}
                          step="0.25"
                          defaultValue={String(entry.marksObtained)}
                          aria-label={`Marks for ${entry.fullName}`}
                        />
                      </Table.Cell>
                      <Table.Cell numeric>{entry.rank ? `#${entry.rank}` : "—"}</Table.Cell>
                      <Table.Cell>
                        <Input
                          name={`remarks_${index}`}
                          defaultValue={entry.remarks}
                          placeholder="Optional feedback..."
                          aria-label={`Remarks for ${entry.fullName}`}
                        />
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Table.Container>

            <input type="hidden" name="rowCount" value={String(entries.length)} />

            <div mix={[u.hstack({ justify: "end" })]}>
              <Button type="submit" color="brand" variant="solid">
                Save Marks Sheet
              </Button>
            </div>
          </form>
        )}
      </FacultyLayout>
    )
  }
}
