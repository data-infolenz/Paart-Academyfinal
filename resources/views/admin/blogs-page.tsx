import type { Handle } from "remix/component"
import * as u from "@sdxc/u"
import { Badge, Button, Heading, Input, Text, TextArea } from "@sdxc/ui"
import { PageHeader } from "@sdxc/ui/app"
import type { AdminUser } from "~/app/initializers/auth"
import type { BlogItem } from "~/app/models/blogs"
import { AdminLayout } from "~/resources/layouts/admin"
import { routes } from "~/routes"

export interface AdminBlogsPageProps {
  user: AdminUser
  blogs: BlogItem[]
  error?: string | null
}

export function AdminBlogsPage(handle: Handle<AdminBlogsPageProps>) {
  return () => {
    const { user, blogs, error } = handle.props

    return (
      <AdminLayout user={user} currentPath={routes.admin.blogs.href()}>
        <PageHeader
          crumbs={[
            { label: "Admin", href: routes.admin.index.href() },
            { label: "Blogs & Updates" }
          ]}
          title="Exam Guides & Academic Articles"
          description="Publish preparation strategies, exam notification summaries, and study roadmaps."
          status={<Badge color="brand">{blogs.length} Articles</Badge>}
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
          action={routes.admin.blogCreate.href()}
          mix={[
            u.vstack({ gap: 4 }),
            u.p(5),
            u.rounded("xl"),
            u.border({ width: 1, color: "neutral" }),
            u.bg("var(--ui-surface, var(--ui-bg))")
          ]}
        >
          <Heading level={2} mix={[u.fontSize("md"), u.weight("semibold"), u.m(0)]}>
            Publish New Article
          </Heading>

          <div
            mix={[
              u.grid(),
              u.gap(3.5),
              u.media("(min-width: 48rem)", u.raw({ gridTemplateColumns: "2fr 1fr 1fr" }))
            ]}
          >
            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Article Title *</Text>
              <Input name="title" required placeholder="e.g. TNPSC Group 2 Mains Writing Guide" />
            </label>

            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Category *</Text>
              <Input name="category" required placeholder="Exam Strategy" />
            </label>

            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Featured Image</Text>
              <Input name="featuredImage" defaultValue="/images/classroom-1.jpg" />
            </label>
          </div>

          <label mix={[u.vstack({ gap: 1.5 })]}>
            <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>Short Summary *</Text>
            <Input
              name="shortDescription"
              required
              placeholder="One-sentence summary shown on cards and SEO meta description..."
            />
          </label>

          <label mix={[u.vstack({ gap: 1.5 })]}>
            <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
              Full Article Content * (separate paragraphs with a blank line)
            </Text>
            <TextArea
              name="content"
              required
              rows={5}
              placeholder="Write the detailed preparation guide here..."
            />
          </label>

          <div mix={[u.hstack({ justify: "end" })]}>
            <Button type="submit" color="brand" variant="solid">
              Publish Article
            </Button>
          </div>
        </form>

        <div mix={[u.vstack({ gap: 3 })]}>
          {blogs.map((blog) => (
            <div
              key={blog.id}
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
                  <Text mix={[u.fontSize("sm"), u.weight("bold"), u.m(0)]}>{blog.title}</Text>
                  <Badge color="brand" variant="outline">
                    {blog.category}
                  </Badge>
                  <Badge color={blog.published ? "success" : "neutral"} variant="secondary">
                    {blog.published ? "Published" : "Draft"}
                  </Badge>
                </div>
                <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                  /blogs/{blog.slug} · {blog.publishedDate}
                </Text>
              </div>

              <div mix={[u.hstack({ gap: 2 })]}>
                <form method="POST" action={routes.admin.blogToggle.href({ id: blog.id })}>
                  <Button type="submit" size="sm" variant="outline" color="neutral">
                    {blog.published ? "Unpublish" : "Publish"}
                  </Button>
                </form>
                <form method="POST" action={routes.admin.blogDelete.href({ id: blog.id })}>
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
