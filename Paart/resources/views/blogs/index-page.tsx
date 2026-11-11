import type { Handle } from "remix/component"
import { ArrowRightIcon } from "@sdxc/icons"
import * as u from "@sdxc/u"
import { Badge, Text } from "@sdxc/ui"
import type { AdminUser } from "~/app/initializers/auth"
import type { BlogItem } from "~/app/models/blogs"
import type { SiteSettings } from "~/app/models/settings"
import {
  AcademicCalloutBand,
  AcademicPageBanner,
  AcademicSection,
  acadProspectusCard,
  acadSerif
} from "~/resources/components/academic-ui"
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
        <AcademicPageBanner
          rubric="Academic Gazette & Guidance"
          title="Exam Strategy &amp; Preparation Articles"
          description="Practical study schedules, Samacheer syllabus strategies, and exam readiness articles prepared by the PAART Academic Team."
          breadcrumbs={[{ label: "Exam Blog" }]}
        />

        <AcademicSection>
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
              <a
                key={blog.id}
                href={routes.blogs.show.href({ slug: blog.slug })}
                mix={[acadProspectusCard()]}
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
                    <span mix={[u.fontSize("xs"), u.fg("var(--acad-muted)")]}>
                      {blog.publishedDate}
                    </span>
                  </div>
                  <h2
                    mix={[
                      acadSerif(),
                      u.fontSize("lg"),
                      u.weight("bold"),
                      u.leading("snug"),
                      u.m(0)
                    ]}
                  >
                    {blog.title}
                  </h2>
                  <Text
                    mix={[
                      u.fontSize("sm"),
                      u.leading("relaxed"),
                      u.fg("var(--acad-muted)"),
                      u.m(0),
                      u.grow(1)
                    ]}
                  >
                    {blog.shortDescription}
                  </Text>
                  <span
                    mix={[
                      u.hstack({ gap: 1, align: "center" }),
                      u.fontSize("xs"),
                      u.weight("bold"),
                      u.pbs(2),
                      u.fg("var(--acad-primary)")
                    ]}
                  >
                    <span>Read Full Guide</span>
                    <ArrowRightIcon size={14} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </AcademicSection>

        <AcademicCalloutBand
          title="Want Personalised Guidance for Your Target Exam?"
          description="Meet our mentors in Puliyangudi to build a realistic daily timetable around your qualification."
          settings={settings}
        />
      </LandingLayout>
    )
  }
}
