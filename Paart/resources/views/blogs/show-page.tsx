import type { Handle } from "remix/component"
import { ArrowLeftIcon, ArrowRightIcon } from "@sdxc/icons"
import * as u from "@sdxc/u"
import { Badge, Heading, HeadingScope, Link, LinkButton, Text } from "@sdxc/ui"
import { LandingSection } from "@sdxc/ui/landing"
import type { AdminUser } from "~/app/initializers/auth"
import type { BlogItem } from "~/app/models/blogs"
import type { SiteSettings } from "~/app/models/settings"
import { LandingLayout } from "~/resources/layouts/landing"
import { routes } from "~/routes"

export interface BlogShowPageProps {
  user?: AdminUser | null
  settings: SiteSettings
  blog: BlogItem
}

export function BlogShowPage(handle: Handle<BlogShowPageProps>) {
  return () => {
    const { user, settings, blog } = handle.props
    const paragraphs = blog.content
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean)

    return (
      <LandingLayout user={user} settings={settings}>
        <LandingSection variant="frame" ruled>
          <HeadingScope level={1}>
            <article mix={[u.vstack({ gap: 6 }), u.maxWidth("48rem"), u.mi("auto")]}>
              <Link
                href={routes.blogs.index.href()}
                mix={[
                  u.hstack({ gap: 1.5, align: "center" }),
                  u.fontSize("sm"),
                  u.weight("medium"),
                  u.fg("neutral.muted"),
                  u.textDecoration("none")
                ]}
              >
                <ArrowLeftIcon size={15} />
                <span>Back to Blog</span>
              </Link>

              <div mix={[u.vstack({ gap: 3 })]}>
                <div mix={[u.hstack({ gap: 2, align: "center" }), u.flexWrap("wrap")]}>
                  <Badge color="brand" variant="default">
                    {blog.category}
                  </Badge>
                  <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                    Published {blog.publishedDate} · {blog.author}
                  </Text>
                </div>

                <Heading level={1} mix={[u.fontSize("3xl"), u.weight("bold"), u.m(0)]}>
                  {blog.title}
                </Heading>

                <Text mix={[u.fontSize("base"), u.fg("neutral.muted"), u.m(0)]}>
                  {blog.shortDescription}
                </Text>
              </div>

              <div
                mix={[
                  u.rounded("xl"),
                  u.overflow("hidden"),
                  u.border({ width: 1, color: "neutral" })
                ]}
              >
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  mix={[u.width("full"), u.height(80), u.fit("cover"), u.block()]}
                />
              </div>

              <div mix={[u.vstack({ gap: 4 })]}>
                {paragraphs.map((p, idx) => (
                  <Text key={idx} mix={[u.fontSize("base"), u.m(0)]}>
                    {p}
                  </Text>
                ))}
              </div>

              <div
                mix={[
                  u.hstack({ gap: 4, align: "center", justify: "between" }),
                  u.flexWrap("wrap"),
                  u.p(5),
                  u.rounded("xl"),
                  u.border({ width: 1, color: "neutral" }),
                  u.bg("surface.raised"),
                  u.mbs(4)
                ]}
              >
                <div mix={[u.vstack({ gap: 0.5 })]}>
                  <Text mix={[u.fontSize("sm"), u.weight("semibold"), u.m(0)]}>
                    Preparing for an upcoming government examination?
                  </Text>
                  <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                    Join structured classroom batches and daily test series at PAART Academy.
                  </Text>
                </div>
                <LinkButton
                  href={routes.admissions.apply.href()}
                  color="brand"
                  variant="solid"
                  size="sm"
                >
                  <span>Apply Online</span>
                  <ArrowRightIcon size={14} />
                </LinkButton>
              </div>
            </article>
          </HeadingScope>
        </LandingSection>
      </LandingLayout>
    )
  }
}
