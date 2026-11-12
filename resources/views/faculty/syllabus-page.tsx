import type { Handle } from "remix/component"
import * as u from "@sdxc/u"
import { Badge, Button, Heading, Input, ProgressBar, Select, Text } from "@sdxc/ui"
import { PageHeader } from "@sdxc/ui/app"
import type { SessionUser } from "~/app/initializers/auth"
import type { BatchSummaryItem, SyllabusTopicItem } from "~/app/models/lms"
import { SYLLABUS_TOPIC_STATUSES } from "~/database/schema"
import { FacultyLayout } from "~/resources/layouts/faculty"
import { routes } from "~/routes"

export interface FacultySyllabusPageProps {
  user: SessionUser
  batch: BatchSummaryItem
  topics: SyllabusTopicItem[]
  notice?: string | null
  error?: string | null
}

export function FacultySyllabusPage(handle: Handle<FacultySyllabusPageProps>) {
  return () => {
    const { user, batch, topics, notice, error } = handle.props

    return (
      <FacultyLayout user={user} currentPath={routes.faculty.batchSyllabus.href({ id: batch.id })}>
        <PageHeader
          crumbs={[
            { label: "Faculty", href: routes.faculty.index.href() },
            { label: `${batch.code} Syllabus` }
          ]}
          title={`${batch.name} — Syllabus Tracker`}
          description={`${batch.courseTitle} · Update module completion so enrolled aspirants see live progress in their portal.`}
          status={<Badge color="brand">{batch.syllabusProgressPct}% Completed</Badge>}
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

        <div
          mix={[
            u.vstack({ gap: 2.5 }),
            u.p(4),
            u.rounded("xl"),
            u.border({ width: 1, color: "neutral" }),
            u.bg("var(--ui-surface, var(--ui-bg))")
          ]}
        >
          <ProgressBar>
            <ProgressBar.Indicator
              value={batch.syllabusProgressPct}
              max={100}
              aria-label="Overall batch syllabus completion"
            />
            <ProgressBar.ValueLabel>
              {batch.completedTopics} of {batch.totalTopics} modules completed (
              {batch.syllabusProgressPct}%)
            </ProgressBar.ValueLabel>
          </ProgressBar>
        </div>

        <form
          method="POST"
          action={routes.faculty.batchSyllabusCreate.href({ id: batch.id })}
          mix={[
            u.vstack({ gap: 3.5 }),
            u.p(5),
            u.rounded("xl"),
            u.border({ width: 1, color: "neutral" }),
            u.bg("var(--ui-surface, var(--ui-bg))")
          ]}
        >
          <Heading level={2} mix={[u.fontSize("md"), u.weight("semibold"), u.m(0)]}>
            Add Syllabus Topic / Module
          </Heading>
          <div
            mix={[
              u.grid(),
              u.gap(3),
              u.media("(min-width: 48rem)", u.raw({ gridTemplateColumns: "1fr 2.2fr 1fr auto" })),
              u.raw({ alignItems: "end" })
            ]}
          >
            <label mix={[u.vstack({ gap: 1 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Unit Label *</Text>
              <Input name="unitLabel" required defaultValue={`Unit ${topics.length + 1}`} />
            </label>

            <label mix={[u.vstack({ gap: 1 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Topic Title *</Text>
              <Input
                name="title"
                required
                placeholder="e.g. Fundamental Rights & Directive Principles"
              />
            </label>

            <label mix={[u.vstack({ gap: 1 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Initial Status</Text>
              <Select name="status">
                {SYLLABUS_TOPIC_STATUSES.map((st) => (
                  <Select.Option key={st} value={st}>
                    {st.replace("_", " ")}
                  </Select.Option>
                ))}
              </Select>
            </label>

            <Button type="submit" color="brand" variant="solid">
              Add Topic
            </Button>
          </div>
        </form>

        <div mix={[u.vstack({ gap: 2.5 })]}>
          {topics.map((topic) => (
            <div
              key={topic.id}
              mix={[
                u.hstack({ justify: "between", align: "center", gap: 3 }),
                u.flexWrap("wrap"),
                u.p(4),
                u.rounded("xl"),
                u.border({ width: 1, color: "neutral" }),
                u.bg("var(--ui-surface, var(--ui-bg))")
              ]}
            >
              <div mix={[u.vstack({ gap: 1 })]}>
                <div mix={[u.hstack({ gap: 2, align: "center" }), u.flexWrap("wrap")]}>
                  <Badge color="brand" variant="outline">
                    {topic.unitLabel}
                  </Badge>
                  <Text mix={[u.fontSize("sm"), u.weight("semibold"), u.m(0)]}>{topic.title}</Text>
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
                    {topic.status.replace("_", " ")}
                  </Badge>
                </div>
                {topic.completedAt && (
                  <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                    Completed on {topic.completedAt.slice(0, 10)}
                  </Text>
                )}
              </div>

              <form
                method="POST"
                action={routes.faculty.batchSyllabusStatus.href({
                  id: batch.id,
                  topicId: topic.id
                })}
                mix={[u.hstack({ gap: 2, align: "center" })]}
              >
                <Select name="status" aria-label={`Status for ${topic.title}`}>
                  {SYLLABUS_TOPIC_STATUSES.map((st) => (
                    <Select.Option key={st} value={st} selected={topic.status === st}>
                      {st.replace("_", " ")}
                    </Select.Option>
                  ))}
                </Select>
                <Button type="submit" size="sm" variant="outline" color="brand">
                  Save
                </Button>
              </form>
            </div>
          ))}
        </div>
      </FacultyLayout>
    )
  }
}
