import { createController } from "remix/router"
import {
  renderEntityTemplatePage,
  renderPublicNotFound,
  renderStaticCmsSlug
} from "~/app/http/controllers/public/cms-responder"
import { buildArticleSchema } from "~/app/initializers/seo"
import { findBlogBySlug } from "~/app/models/blogs"
import { routes } from "~/routes"

export default createController(routes.blogs, {
  actions: {
    async index(ctx) {
      return renderStaticCmsSlug(ctx, "/blogs", { includeOrgSchema: false })
    },

    async show(ctx) {
      const slug = ctx.params.slug
      const blog = await findBlogBySlug(slug)

      if (!blog) {
        return renderPublicNotFound(ctx, {
          title: "Article Not Found | PAART Academy",
          heading: "Article Not Found",
          message: "The requested exam preparation article does not exist or has been unpublished.",
          ctaLabel: "Back to Exam Guides",
          ctaHref: routes.blogs.index.href()
        })
      }

      return renderEntityTemplatePage(ctx, "template:blog-detail", {
        titleOverride: blog.seoTitle,
        descriptionOverride: blog.metaDescription,
        canonicalPathOverride: `/blogs/${blog.slug}`,
        includeOrgSchema: false,
        extraSchemas: [buildArticleSchema(blog)],
        boundBlog: blog
      })
    }
  }
})
