import type { Handle } from "remix/component"
import * as u from "@sdxc/u"
import { Badge, Button, Heading, Input, Select, Text, TextArea } from "@sdxc/ui"
import { PageHeader } from "@sdxc/ui/app"
import type { AdminUser } from "~/app/initializers/auth"
import type { CourseItem } from "~/app/models/courses"
import type { MaterialItem } from "~/app/models/materials"
import { AdminLayout } from "~/resources/layouts/admin"
import { routes } from "~/routes"

export interface AdminMaterialsPageProps {
  user: AdminUser
  materials: MaterialItem[]
  courses: CourseItem[]
  error?: string | null
}

const MATERIAL_CATEGORIES = ["Study Material", "Notes", "Current Affairs", "Question Bank"]

export function AdminMaterialsPage(handle: Handle<AdminMaterialsPageProps>) {
  return () => {
    const { user, materials, courses, error } = handle.props

    return (
      <AdminLayout user={user} currentPath={routes.admin.materials.href()}>
        <PageHeader
          crumbs={[
            { label: "Admin", href: routes.admin.index.href() },
            { label: "Study Materials" }
          ]}
          title="Study Materials & Downloads"
          description="Publish public PDF notes or course-restricted study materials for enrolled aspirants."
          status={<Badge color="brand">{materials.length} Items</Badge>}
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

        <form
          method="POST"
          action={routes.admin.materialCreate.href()}
          mix={[
            u.vstack({ gap: 4 }),
            u.p(5),
            u.rounded("xl"),
            u.border({ width: 1, color: "neutral" }),
            u.bg("var(--ui-surface, var(--ui-bg))")
          ]}
        >
          <Heading level={2} mix={[u.fontSize("md"), u.weight("semibold"), u.m(0)]}>
            Add Study Material
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
              <Input name="title" required placeholder="e.g. TNPSC Group 4 General Tamil Notes" />
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
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                Access Visibility *
              </Text>
              <Select name="visibility" required>
                <Select.Option value="public">Public (Website + Aspirant Portal)</Select.Option>
                <Select.Option value="enrolled">
                  Enrolled Aspirants Only (Restricted to Course)
                </Select.Option>
              </Select>
            </label>

            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                Target Course (for Enrolled Visibility)
              </Text>
              <Select name="courseId">
                <Select.Option value="">All Courses / General</Select.Option>
                {courses.map((c) => (
                  <Select.Option key={c.id} value={c.id}>
                    {c.title}
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
                Local File Path (inside /public)
              </Text>
              <Input name="fileUrl" placeholder="/study-materials/tnpsc-notes.pdf" />
            </label>

            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                External Download URL (optional)
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
              placeholder="Summary of topics covered in this study material..."
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

              <form method="POST" action={routes.admin.materialDelete.href({ id: mat.id })}>
                <Button type="submit" size="sm" variant="outline" color="danger">
                  Delete
                </Button>
              </form>
            </div>
          ))}
        </div>
      </AdminLayout>
    )
  }
}
