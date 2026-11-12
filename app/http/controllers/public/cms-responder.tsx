import type { SchemaOrg } from "@sdxc/seo"
import * as u from "@sdxc/u"
import { Heading, LinkButton, Text } from "@sdxc/ui"
import { LandingSection } from "@sdxc/ui/landing"
import { canManageCms } from "~/app/initializers/authz"
import type { AppContext } from "~/app/initializers/router"
import {
  buildEducationalOrganizationSchema,
  buildFaqSchema,
  SITE_URL
} from "~/app/initializers/seo"
import type { BlogItem } from "~/app/models/blogs"
import {
  chromeToSiteSettings,
  getSiteChrome,
  type ResolvedCmsPage,
  resolveCollectionTemplate,
  resolvePublicPage
} from "~/app/models/cms"
import { hydratePageBlocks } from "~/app/models/cms-hydrator"
import type { CourseItem } from "~/app/models/courses"
import { CmsPublicPage } from "~/resources/blocks"
import { Document } from "~/resources/layouts/document"
import { LandingLayout } from "~/resources/layouts/landing"
import { routes } from "~/routes"

export async function isAdminPreviewRequest(ctx: AppContext): Promise<{
  previewDraft: boolean
  isAdmin: boolean
}> {
  const url = new URL(ctx.request.url)
  const previewDraft = url.searchParams.get("preview") === "draft"
  if (!previewDraft) {
    return { previewDraft: false, isAdmin: false }
  }
  const isAdmin = await canManageCms(ctx.user)
  return { previewDraft, isAdmin }
}

export async function renderPublicNotFound(
  ctx: AppContext,
  opts: {
    title?: string
    heading?: string
    message?: string
    ctaLabel?: string
    ctaHref?: string
  } = {}
): Promise<Response> {
  const { chrome } = await getSiteChrome()
  const settings = chromeToSiteSettings(chrome)

  return ctx.render(
    <Document
      title={opts.title ?? "Page Not Found | PAART Academy"}
      robots="noindex, nofollow"
      assets={ctx.assets}
    >
      <LandingLayout user={ctx.user} chrome={chrome} settings={settings}>
        <LandingSection variant="frame" ruled>
          <div mix={[u.vstack({ gap: 4, align: "center" }), u.pb(12), u.textAlign("center")]}>
            <Heading level={1} mix={[u.fontSize("2xl"), u.weight("bold"), u.m(0)]}>
              {opts.heading ?? "Page Not Found"}
            </Heading>
            <Text mix={[u.fontSize("sm"), u.fg("neutral.muted"), u.m(0)]}>
              {opts.message ?? "The requested page does not exist or has not been published yet."}
            </Text>
            <LinkButton href={opts.ctaHref ?? routes.home.href()} color="brand" variant="solid">
              {opts.ctaLabel ?? "Return to Home"}
            </LinkButton>
          </div>
        </LandingSection>
      </LandingLayout>
    </Document>,
    { status: 404 }
  )
}

export async function renderCmsPageResponse(
  ctx: AppContext,
  page: ResolvedCmsPage,
  extra: {
    titleOverride?: string
    descriptionOverride?: string
    canonicalPathOverride?: string
    extraSchemas?: SchemaOrg.Node[]
    includeOrgSchema?: boolean
    boundCourse?: CourseItem | null
    boundBlog?: BlogItem | null
    formError?: string | null
    formValues?: Record<string, string>
    statusCode?: number
  } = {}
): Promise<Response> {
  const url = new URL(ctx.request.url)
  const [{ chrome }, hydrated] = await Promise.all([
    getSiteChrome({ bypassCache: page.isDraftPreview }),
    hydratePageBlocks(page.rawBlocks, {
      pageSlug: page.slug,
      user: ctx.user,
      activeCategoryQuery: url.searchParams.get("category") || "ALL",
      selectedCourseQuery: url.searchParams.get("course") || "",
      formSubmitted: url.searchParams.get("submitted") === "1",
      formError: extra.formError ?? url.searchParams.get("error"),
      formValues: extra.formValues,
      boundCourse: extra.boundCourse ?? null,
      boundBlog: extra.boundBlog ?? null
    })
  ])

  const schemas: SchemaOrg.Node[] = []
  if (extra.includeOrgSchema !== false) {
    schemas.push(buildEducationalOrganizationSchema(chrome.trustProfile))
  }
  if (extra.extraSchemas) {
    schemas.push(...extra.extraSchemas)
  }
  if (hydrated.faqItems.length > 0) {
    schemas.push(buildFaqSchema(hydrated.faqItems))
  }

  const canonicalPath = extra.canonicalPathOverride || page.seo.canonicalPath || page.slug
  const canonicalUrl = canonicalPath.startsWith("http")
    ? canonicalPath
    : canonicalPath.startsWith("/")
      ? `${SITE_URL}${canonicalPath}`
      : undefined

  const shouldNoindex = page.isDraftPreview || page.seo.noindex
  const headers: Record<string, string> = {}
  if (page.isDraftPreview) {
    headers["Cache-Control"] = "private, no-store"
  }

  return ctx.render(
    <Document
      title={extra.titleOverride || page.seo.title}
      description={extra.descriptionOverride || page.seo.description || chrome.trustProfile.summary}
      canonical={canonicalUrl}
      robots={shouldNoindex ? "noindex, nofollow" : undefined}
      og={
        page.seo.ogImage
          ? {
              image: page.seo.ogImage.startsWith("http")
                ? page.seo.ogImage
                : `${SITE_URL}${page.seo.ogImage.startsWith("/") ? page.seo.ogImage : `/${page.seo.ogImage}`}`
            }
          : undefined
      }
      schema={schemas.length > 0 ? schemas : undefined}
      assets={ctx.assets}
    >
      <CmsPublicPage user={ctx.user} chrome={chrome} page={page} hydrated={hydrated} />
    </Document>,
    {
      status: extra.statusCode ?? 200,
      headers
    }
  )
}

export async function renderStaticCmsSlug(
  ctx: AppContext,
  slug: string,
  extra?: Parameters<typeof renderCmsPageResponse>[2]
): Promise<Response> {
  const { previewDraft, isAdmin } = await isAdminPreviewRequest(ctx)
  const page = await resolvePublicPage(slug, { previewDraft, isAdmin })
  if (!page) {
    return renderPublicNotFound(ctx)
  }
  return renderCmsPageResponse(ctx, page, extra)
}

export async function renderEntityTemplatePage(
  ctx: AppContext,
  templateSlug: "template:course-detail" | "template:blog-detail",
  extra: Parameters<typeof renderCmsPageResponse>[2]
): Promise<Response> {
  const { previewDraft, isAdmin } = await isAdminPreviewRequest(ctx)
  const templatePage = await resolveCollectionTemplate(templateSlug, { previewDraft, isAdmin })
  return renderCmsPageResponse(ctx, templatePage, extra)
}
