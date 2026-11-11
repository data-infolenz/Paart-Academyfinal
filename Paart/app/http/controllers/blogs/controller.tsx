import * as u from "@sdxc/u"
import { Heading, LinkButton, Text } from "@sdxc/ui"
import { LandingSection } from "@sdxc/ui/landing"
import { createController } from "remix/router"
import { buildArticleSchema } from "~/app/initializers/seo"
import { findBlogBySlug, listPublishedBlogs } from "~/app/models/blogs"
import { getSiteSettings } from "~/app/models/settings"
import { Document } from "~/resources/layouts/document"
import { LandingLayout } from "~/resources/layouts/landing"
import { BlogsIndexPage } from "~/resources/views/blogs/index-page"
import { BlogShowPage } from "~/resources/views/blogs/show-page"
import { routes } from "~/routes"

export default createController(routes.blogs, {
  actions: {
    async index(ctx) {
      const [settings, blogs] = await Promise.all([getSiteSettings(), listPublishedBlogs()])

      return ctx.render(
        <Document
          title="Exam Preparation Guides & Strategy Articles | PAART Academy"
          description="Read practical study plans, syllabus breakdowns, and physical test preparation guides written by PAART Academy mentors."
          assets={ctx.assets}
        >
          <BlogsIndexPage user={ctx.user} settings={settings} blogs={blogs} />
        </Document>
      )
    },

    async show(ctx) {
      const slug = ctx.params.slug
      const [settings, blog] = await Promise.all([getSiteSettings(), findBlogBySlug(slug)])

      if (!blog) {
        return ctx.render(
          <Document title="Article Not Found | PAART Academy" assets={ctx.assets}>
            <LandingLayout user={ctx.user} settings={settings}>
              <LandingSection variant="frame" ruled>
                <div mix={[u.vstack({ gap: 4, align: "center" }), u.pb(12), u.textAlign("center")]}>
                  <Heading level={1} mix={[u.fontSize("2xl"), u.weight("bold"), u.m(0)]}>
                    Article Not Found
                  </Heading>
                  <Text mix={[u.fontSize("sm"), u.fg("neutral.muted"), u.m(0)]}>
                    The requested exam preparation article does not exist or has been unpublished.
                  </Text>
                  <LinkButton href={routes.blogs.index.href()} color="brand" variant="solid">
                    Back to Exam Guides
                  </LinkButton>
                </div>
              </LandingSection>
            </LandingLayout>
          </Document>,
          { status: 404 }
        )
      }

      return ctx.render(
        <Document
          title={blog.seoTitle}
          description={blog.metaDescription}
          schema={buildArticleSchema(blog)}
          assets={ctx.assets}
        >
          <BlogShowPage user={ctx.user} settings={settings} blog={blog} />
        </Document>
      )
    }
  }
})
