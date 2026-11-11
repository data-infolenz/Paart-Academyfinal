import type { Handle } from "remix/component"
import { ArrowRightIcon } from "@sdxc/icons"
import * as u from "@sdxc/u"
import { Badge, LinkButton, Text } from "@sdxc/ui"
import type { AdminUser } from "~/app/initializers/auth"
import type { BlogItem } from "~/app/models/blogs"
import type { SiteSettings } from "~/app/models/settings"
import {
  acadCard,
  AcademicPageBanner,
  AcademicSection,
  acadSerif
} from "~/resources/components/academic-ui"
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
        <AcademicPageBanner
          rubric={`${blog.category} · Published ${blog.publishedDate}`}
          title={blog.title}
          description={blog.shortDescription}
          breadcrumbs={[
            { label: "Exam Blog", href: routes.blogs.index.href() },
            { label: blog.title }
          ]}
        />

        <AcademicSection>
          <article mix={[u.vstack({ gap: 6 }), u.maxWidth("48rem"), u.mi("auto")]}>
            <div mix={[u.hstack({ gap: 2, align: "center" }), u.flexWrap("wrap")]}>
              <Badge color="brand" variant="default">
                {blog.category}
              </Badge>
              <span mix={[u.fontSize("xs"), u.fg("var(--acad-muted)")]}>
                By {blog.author} · {blog.publishedDate}
              </span>
            </div>

            <div mix={[acadCard(), u.overflow("hidden")]}>
              <img
                src={blog.featuredImage}
                alt={blog.title}
                mix={[u.width("full"), u.height(80), u.fit("cover"), u.block()]}
              />
            </div>

            <div mix={[u.vstack({ gap: 4 })]}>
              {paragraphs.map((p, idx) => (
                <Text
                  key={idx}
                  mix={[u.fontSize("base"), u.leading("relaxed"), u.fg("var(--acad-ink)"), u.m(0)]}
                >
                  {p}
                </Text>
              ))}
            </div>

            <div
              mix={[
                acadCard("gold"),
                u.hstack({ gap: 4, align: "center", justify: "between" }),
                u.flexWrap("wrap"),
                u.p(5),
                u.mbs(4)
              ]}
            >
              <div mix={[u.vstack({ gap: 1 })]}>
                <h2 mix={[acadSerif(), u.fontSize("base"), u.weight("bold"), u.m(0)]}>
                  Preparing for an upcoming government examination?
                </h2>
                <span mix={[u.fontSize("xs"), u.fg("var(--acad-muted)")]}>
                  Join structured classroom batches and daily test series at PAART Academy.
                </span>
              </div>
              <LinkButton
                href={routes.admissions.apply.href()}
                color="brand"
                variant="solid"
                size="sm"
              >
                <span>Online Admission Form</span>
                <ArrowRightIcon size={14} />
              </LinkButton>
            </div>
          </article>
        </AcademicSection>
      </LandingLayout>
    )
  }
}
