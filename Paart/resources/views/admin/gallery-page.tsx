import type { Handle } from "remix/component"
import * as u from "@sdxc/u"
import { Badge, Button, Heading, Input, Select, Text } from "@sdxc/ui"
import { PageHeader } from "@sdxc/ui/app"
import type { AdminUser } from "~/app/initializers/auth"
import type { GalleryItem } from "~/app/models/gallery"
import { AdminLayout } from "~/resources/layouts/admin"
import { routes } from "~/routes"

export interface AdminGalleryPageProps {
  user: AdminUser
  items: GalleryItem[]
  error?: string | null
}

const GALLERY_CATEGORIES = [
  "Classroom",
  "Model Exams",
  "Physical Coaching",
  "Achievements",
  "Community"
]

export function AdminGalleryPage(handle: Handle<AdminGalleryPageProps>) {
  return () => {
    const { user, items, error } = handle.props

    return (
      <AdminLayout user={user} currentPath={routes.admin.gallery.href()}>
        <PageHeader
          crumbs={[{ label: "Admin", href: routes.admin.index.href() }, { label: "Gallery" }]}
          title="Campus & Achievement Gallery"
          description="Manage verified photos of classrooms, mock exams, physical coaching, and rank holders."
          status={<Badge color="brand">{items.length} Photos</Badge>}
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
          action={routes.admin.galleryCreate.href()}
          mix={[
            u.vstack({ gap: 4 }),
            u.p(5),
            u.rounded("xl"),
            u.border({ width: 1, color: "neutral" }),
            u.bg("var(--ui-surface, var(--ui-bg))")
          ]}
        >
          <Heading level={2} mix={[u.fontSize("md"), u.weight("semibold"), u.m(0)]}>
            Add Gallery Item
          </Heading>

          <div
            mix={[
              u.grid(),
              u.gap(3.5),
              u.media("(min-width: 48rem)", u.raw({ gridTemplateColumns: "2fr 1fr 2fr" }))
            ]}
          >
            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Title *</Text>
              <Input name="title" required placeholder="e.g. Weekend TNPSC OMR Test Session" />
            </label>

            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Category *</Text>
              <Select name="category" required>
                {GALLERY_CATEGORIES.map((cat) => (
                  <Select.Option key={cat} value={cat}>
                    {cat}
                  </Select.Option>
                ))}
              </Select>
            </label>

            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Image Path / URL *</Text>
              <Input name="image" required placeholder="/images/classroom-2.jpg" />
            </label>
          </div>

          <label mix={[u.vstack({ gap: 1.5 })]}>
            <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Caption</Text>
            <Input
              name="description"
              placeholder="Short caption describing the session or event..."
            />
          </label>

          <div mix={[u.hstack({ justify: "end" })]}>
            <Button type="submit" color="brand" variant="solid">
              Add to Gallery
            </Button>
          </div>
        </form>

        <div
          mix={[
            u.grid(),
            u.gap(4),
            u.media(
              "(min-width: 48rem)",
              u.raw({ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" })
            )
          ]}
        >
          {items.map((item) => (
            <div
              key={item.id}
              mix={[
                u.vstack({ gap: 3 }),
                u.p(3.5),
                u.rounded("xl"),
                u.border({ width: 1, color: "neutral" }),
                u.bg("var(--ui-surface, var(--ui-bg))")
              ]}
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                mix={[
                  u.width("full"),
                  u.rounded("lg"),
                  u.raw({ aspectRatio: "16/10", objectFit: "cover" })
                ]}
              />
              <div mix={[u.hstack({ justify: "between", align: "start", gap: 2 })]}>
                <div mix={[u.vstack({ gap: 0.5 }), u.minWidth(0)]}>
                  <Text mix={[u.fontSize("sm"), u.weight("semibold"), u.m(0)]}>{item.title}</Text>
                  <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                    {item.category}
                  </Text>
                </div>
                <form method="POST" action={routes.admin.galleryDelete.href({ id: item.id })}>
                  <Button type="submit" size="sm" variant="outline" color="danger">
                    Remove
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
