import type { Handle } from "remix/component"
import * as u from "@sdxc/u"
import { Badge, Button, Heading, Input, Select, Text, TextArea } from "@sdxc/ui"
import { PageHeader } from "@sdxc/ui/app"
import type { SessionUser } from "~/app/initializers/auth"
import type { CourseItem } from "~/app/models/courses"
import type { MaterialItem } from "~/app/models/materials"
import { FacultyLayout } from "~/resources/layouts/faculty"
import { routes } from "~/routes"

export interface FacultyMaterialsPageProps {
  user: SessionUser
  materials: MaterialItem[]
  courses: CourseItem[]
  notice?: string | null
  error?: string | null
}

const MATERIAL_CATEGORIES = ["Study Material", "Notes", "Current Affairs", "Question Bank"]

export function FacultyMaterialsPage(handle: Handle<FacultyMaterialsPageProps>) {
  return () => {
    const { user, materials, courses, notice, error } = handle.props

    return (
      <FacultyLayout user={user} currentPath={routes.faculty.materials.href()}>
        <PageHeader
          crumbs={[
            { label: "Faculty", href: routes.faculty.index.href() },
            { label: "Study Materials" }
          ]}
          title="Course Study Materials"
          description="Publish public downloads or enrolled-only course notes and question banks."
          status={<Badge color="brand">{materials.length} Items</Badge>}
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
          action={routes.faculty.materialCreate.href()}
          mix={[
            u.vstack({ gap: 4 }),
            u.p(5),
            u.rounded("xl"),
            u.border({ width: 1, color: "neutral" }),
            u.bg("var(--ui-surface, var(--ui-bg))")
          ]}
        >
          <Heading level={2} mix={[u.fontSize("md"), u.weight("semibold"), u.m(0)]}>
            Publish Study Material
          </Heading>

          <div
            mix={[
              u.grid(),
              u.gap(3.5),
              u.media("(min-width: 48rem)", u.raw({ gridTemplateColumns: "2fr 1fr" }))
            ]}
          >
            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Material Title *</Text>
              <Input
                name="title"
                required
                placeholder="e.g. Unit-8 Tamil Nadu Administration Handout"
              />
            </label>

            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Category *</Text>
              <Select name="category" required>
                {MATERIAL_CATEGORIES.map((cat) => (
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
                u.raw({ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" })
              )
            ]}
          >
            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Visibility *</Text>
              <Select name="visibility" required>
                <Select.Option value="enrolled">
                  Enrolled Aspirants Only (Course Restricted)
                </Select.Option>
                <Select.Option value="public">Public Website + All Portals</Select.Option>
              </Select>
            </label>

            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Course Scope *</Text>
              <Select name="courseId">
                <Select.Option value="">General / All Enrolled Courses</Select.Option>
                {courses.map((course) => (
                  <Select.Option key={course.id} value={course.id}>
                    {course.title}
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
                u.raw({ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" })
              )
            ]}
          >
            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                File Path (in /public)
              </Text>
              <Input name="fileUrl" placeholder="/study-materials/unit8-handout.pdf" />
            </label>

            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                External Resource URL
              </Text>
              <Input name="externalUrl" placeholder="https://drive.google.com/..." />
            </label>
          </div>

          <label mix={[u.vstack({ gap: 1.5 })]}>
            <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Description *</Text>
            <TextArea
              name="description"
              required
              rows={2}
              placeholder="Chapters covered, revision tips, and target examination..."
            />
          </label>

          <div mix={[u.hstack({ justify: "end" })]}>
            <Button type="submit" color="brand" variant="solid">
              Publish Material
            </Button>
          </div>
        </form>

        <div mix={[u.vstack({ gap: 3 })]}>
          {materials.map((mat) => (
            <div
              key={mat.id}
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
                  <Text mix={[u.fontSize("sm"), u.weight("bold"), u.m(0)]}>{mat.title}</Text>
                  <Badge color="brand" variant="outline">
                    {mat.category}
                  </Badge>
                  <Badge
                    color={mat.visibility === "enrolled" ? "warning" : "success"}
                    variant="secondary"
                  >
                    {mat.visibility === "enrolled" ? "Enrolled Only" : "Public"}
                  </Badge>
                  {mat.courseTitle && (
                    <Badge color="neutral" variant="outline">
                      {mat.courseTitle}
                    </Badge>
                  )}
                </div>
                <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                  {mat.description}
                </Text>
              </div>

              <form method="POST" action={routes.faculty.materialDelete.href({ id: mat.id })}>
                <Button type="submit" size="sm" variant="outline" color="danger">
                  Remove
                </Button>
              </form>
            </div>
          ))}
        </div>
      </FacultyLayout>
    )
  }
}
