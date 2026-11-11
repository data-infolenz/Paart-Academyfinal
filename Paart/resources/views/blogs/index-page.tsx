import type { Handle } from "remix/component"
import { ArrowRightIcon } from "@sdxc/icons"
import * as u from "@sdxc/u"
import { Badge, Heading, HeadingScope, Link, Text } from "@sdxc/ui"
import { LandingHeader, LandingSection } from "@sdxc/ui/landing"
import type { AdminUser } from "~/app/initializers/auth"
import type { BlogItem } from "~/app/models/blogs"
import type { SiteSettings } from "~/app/models/settings"
import { LandingLayout } from "~/resources/layouts/landing"
import { routes } from "~/routes"

export interface BlogsIndexPageProps {
  user?: AdminUser | null
  settings: SiteSettings
  blogs: BlogItem[]
}

export function BlogsIndexPage(handle: Handle<BlogsIndexPageProps>) {
  return () => {
    const { user, settings, blogs } = handle.props

    return (
      <LandingLayout user={user} settings={settings}>
        <LandingSection variant="frame" ruled>
          <HeadingScope level={1}>
            <LandingHeader
              eyebrow="Preparation Articles"
              eyebrowVariant="pill"
              description="Practical study schedules, syllabus strategies, and exam readiness articles from the PAART Academic Team."
            >
              Exam Strategy &amp; Updates Blog
            </LandingHeader>

            <div
              mix={[
                u.grid(),
                u.gap(5),
                u.media(
                  "(min-width: 48rem)",
                  u.raw({ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" })
                ),
                u.media(
                  "(min-width: 68rem)",
                  u.raw({ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" })
                )
              ]}
            >
              {blogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={routes.blogs.show.href({ slug: blog.slug })}
                  mix={[
                    u.vstack({ gap: 0 }),
                    u.rounded("xl"),
                    u.border({ width: 1, color: "neutral" }),
                    u.bg("var(--ui-surface, var(--ui-bg))"),
                    u.overflow("hidden"),
                    u.textDecoration("none"),
                    u.fg("inherit"),
                    u.hover([u.border({ color: "brand" }), u.shadow("md")])
                  ]}
                >
                  <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    loading="lazy"
                    decoding="async"
                    mix={[u.width("full"), u.height(44), u.fit("cover"), u.block()]}
                  />
                  <div mix={[u.vstack({ gap: 2.5 }), u.p(5), u.grow(1)]}>
                    <div mix={[u.hstack({ gap: 2, align: "center" })]}>
                      <Badge color="brand" variant="outline">
                        {blog.category}
                      </Badge>
                      <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                        {blog.publishedDate}
                      </Text>
                    </div>
                    <Heading level={2} mix={[u.fontSize("lg"), u.weight("semibold"), u.m(0)]}>
                      {blog.title}
                    </Heading>
                    <Text mix={[u.fontSize("sm"), u.fg("neutral.muted"), u.m(0), u.grow(1)]}>
                      {blog.shortDescription}
                    </Text>
                    <span
                      mix={[
                        u.hstack({ gap: 1, align: "center" }),
                        u.fontSize("xs"),
                        u.weight("semibold"),
                        u.fg("brand"),
                        u.pbs(2)
                      ]}
                    >
                      <span>Read Article</span>
                      <ArrowRightIcon size={14} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </HeadingScope>
        </LandingSection>
      </LandingLayout>
    )
  }
}
