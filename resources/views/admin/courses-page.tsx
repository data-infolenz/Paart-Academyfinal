import type { Handle } from "remix/component"
import * as u from "@sdxc/u"
import { Badge, Button, Heading, Input, Select, Text, TextArea } from "@sdxc/ui"
import { PageHeader } from "@sdxc/ui/app"
import type { AdminUser } from "~/app/initializers/auth"
import type { CourseItem } from "~/app/models/courses"
import { COURSE_CATEGORIES } from "~/config/courses"
import { AdminLayout } from "~/resources/layouts/admin"
import { routes } from "~/routes"

export interface AdminCoursesPageProps {
  user: AdminUser
  courses: CourseItem[]
  error?: string | null
}

export function AdminCoursesPage(handle: Handle<AdminCoursesPageProps>) {
  return () => {
    const { user, courses, error } = handle.props

    return (
      <AdminLayout user={user} currentPath={routes.admin.courses.href()}>
        <PageHeader
          crumbs={[{ label: "Admin", href: routes.admin.index.href() }, { label: "Courses" }]}
          title="Coaching Courses Catalog"
          description="Create new competitive exam programmes or toggle visibility on the public catalog."
          status={<Badge color="brand">{courses.length} Courses</Badge>}
        />

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

        {/* Add New Course Form */}
        <form
          method="POST"
          action={routes.admin.courseCreate.href()}
          mix={[
            u.vstack({ gap: 4 }),
            u.p(5),
            u.rounded("xl"),
            u.border({ width: 1, color: "neutral" }),
            u.bg("var(--ui-surface, var(--ui-bg))")
          ]}
        >
          <Heading level={2} mix={[u.fontSize("md"), u.weight("semibold"), u.m(0)]}>
            Add New Coaching Programme
          </Heading>

          <div
            mix={[
              u.grid(),
              u.gap(3.5),
              u.media("(min-width: 48rem)", u.raw({ gridTemplateColumns: "2fr 1fr" }))
            ]}
          >
            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Course Title *</Text>
              <Input name="title" required placeholder="e.g. TNPSC Group 2A Mains Batch" />
            </label>

            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Category *</Text>
              <Select name="category" required>
                {COURSE_CATEGORIES.map((cat) => (
                  <Select.Option key={cat} value={cat}>
                    {cat}
                  </Select.Option>
                ))}
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
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Duration *</Text>
              <Input name="duration" required placeholder="6 Months" />
            </label>

            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Eligibility *</Text>
              <Input name="eligibility" required placeholder="Any Undergraduate Degree" />
            </label>

            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Banner Image Path</Text>
              <Input name="image" defaultValue="/images/course-exam-1.jpg" />
            </label>
          </div>

          <label mix={[u.vstack({ gap: 1.5 })]}>
            <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Short Description *</Text>
            <TextArea
              name="shortDescription"
              required
              rows={2}
              placeholder="Concise summary of syllabus coverage, test series, and target posts..."
            />
          </label>

          <div
            mix={[
              u.grid(),
              u.gap(3.5),
              u.media(
                "(min-width: 48rem)",
                u.raw({ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" })
              )
            ]}
          >
            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                Key Features (comma-separated)
              </Text>
              <Input
                name="features"
                placeholder="Bilingual Notes, Weekly OMR Mock Tests, Mentor Review"
              />
            </label>

            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                Exam Stages (comma-separated)
              </Text>
              <Input name="examStages" placeholder="Preliminary Exam, Mains Written, Counselling" />
            </label>
          </div>

          <div mix={[u.hstack({ justify: "end" })]}>
            <Button type="submit" color="brand" variant="solid">
              Create Course
            </Button>
          </div>
        </form>

        {/* Existing Courses List */}
        <div mix={[u.vstack({ gap: 3 })]}>
          {courses.map((course) => (
            <div
              key={course.id}
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
                  <Text mix={[u.fontSize("sm"), u.weight("bold"), u.m(0)]}>{course.title}</Text>
                  <Badge color="brand" variant="outline">
                    {course.category}
                  </Badge>
                  <Badge color={course.enabled ? "success" : "neutral"} variant="secondary">
                    {course.enabled ? "Active" : "Hidden"}
                  </Badge>
                </div>
                <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                  /{course.slug} · {course.duration} · {course.eligibility}
                </Text>
              </div>

              <div mix={[u.hstack({ gap: 2 })]}>
                <form method="POST" action={routes.admin.courseToggle.href({ id: course.id })}>
                  <Button type="submit" size="sm" variant="outline" color="neutral">
                    {course.enabled ? "Disable" : "Enable"}
                  </Button>
                </form>
                <form method="POST" action={routes.admin.courseDelete.href({ id: course.id })}>
                  <Button type="submit" size="sm" variant="outline" color="danger">
                    Delete
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
