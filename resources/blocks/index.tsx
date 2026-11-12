import type { Handle, RemixNode } from "remix/component"
import { currentLog } from "@sdxc/logger"
import type { AdminUser } from "~/app/initializers/auth"
import { chromeToSiteSettings, type ResolvedCmsPage } from "~/app/models/cms"
import type { HydratedCollections, HydratedPageResult } from "~/app/models/cms-hydrator"
import {
  type PageBlock,
  parsePageBlocksSafe,
  type SiteChromeConfig
} from "~/app/models/cms-schemas"
import type { SiteSettings } from "~/app/models/settings"
import { DEFAULT_SITE_CHROME } from "~/config/default-pages"
import { type DraftPreviewBannerInfo, LandingLayout } from "~/resources/layouts/landing"
import {
  AdmissionFormBlock,
  BlogFeedBlock,
  CourseCatalogBlock,
  ContactHubBlock,
  EntityDetailMainBlock,
  FaqAccordionBlock,
  GalleryShowcaseBlock,
  MaterialsCatalogBlock
} from "./collection-blocks"
import {
  AcademicHeroBlock,
  CalloutBandBlock,
  DepartmentTableBlock,
  HonourRollStatsBlock,
  NoticeBarBlock,
  PageBannerBlock,
  PillarsGridBlock,
  RichProseBlock
} from "./institutional-blocks"

export interface BlockRendererProps {
  pageSlug?: string
  blocks?: PageBlock[]
  rawBlocks?: unknown
  settings?: SiteSettings
  collections?: HydratedCollections
  requestState?: HydratedPageResult["requestState"]
}

const EMPTY_COLLECTIONS: HydratedCollections = {
  courses: [],
  materials: [],
  blogs: [],
  gallery: []
}

const EMPTY_REQUEST_STATE: HydratedPageResult["requestState"] = {
  activeCategory: "ALL",
  selectedCourse: "",
  formSubmitted: false,
  formError: null,
  formValues: {},
  boundCourse: null,
  boundBlog: null
}

function renderSingleBlock(
  block: PageBlock,
  pageSlug: string,
  settings: SiteSettings,
  collections: HydratedCollections,
  requestState: HydratedPageResult["requestState"]
): RemixNode {
  switch (block.type) {
    case "notice_bar":
      return <NoticeBarBlock key={block.id} block={block} />
    case "academic_hero":
      return <AcademicHeroBlock key={block.id} block={block} settings={settings} />
    case "page_banner":
      return <PageBannerBlock key={block.id} block={block} />
    case "honour_roll_stats":
      return <HonourRollStatsBlock key={block.id} block={block} />
    case "department_table":
      return <DepartmentTableBlock key={block.id} block={block} />
    case "pillars_grid":
      return <PillarsGridBlock key={block.id} block={block} />
    case "rich_prose":
      return <RichProseBlock key={block.id} block={block} />
    case "course_catalog":
      return (
        <CourseCatalogBlock
          key={block.id}
          block={block}
          collections={collections}
          requestState={requestState}
          pageSlug={pageSlug}
        />
      )
    case "materials_catalog":
      return (
        <MaterialsCatalogBlock
          key={block.id}
          block={block}
          collections={collections}
          requestState={requestState}
          pageSlug={pageSlug}
        />
      )
    case "gallery_showcase":
      return (
        <GalleryShowcaseBlock
          key={block.id}
          block={block}
          collections={collections}
          requestState={requestState}
          pageSlug={pageSlug}
        />
      )
    case "blog_feed":
      return <BlogFeedBlock key={block.id} block={block} collections={collections} />
    case "faq_accordion":
      return <FaqAccordionBlock key={block.id} block={block} />
    case "contact_hub":
      return (
        <ContactHubBlock
          key={block.id}
          block={block}
          settings={settings}
          collections={collections}
          requestState={requestState}
        />
      )
    case "admission_form":
      return (
        <AdmissionFormBlock
          key={block.id}
          block={block}
          collections={collections}
          requestState={requestState}
        />
      )
    case "callout_band":
      return <CalloutBandBlock key={block.id} block={block} settings={settings} />
    case "entity_detail_main":
      return (
        <EntityDetailMainBlock
          key={block.id}
          block={block}
          settings={settings}
          requestState={requestState}
        />
      )
  }
}

export function BlockRenderer(handle: Handle<BlockRendererProps>) {
  return () => {
    const {
      pageSlug = "/",
      blocks,
      rawBlocks,
      settings = chromeToSiteSettings(DEFAULT_SITE_CHROME),
      collections = EMPTY_COLLECTIONS,
      requestState = EMPTY_REQUEST_STATE
    } = handle.props

    const validatedBlocks =
      blocks ??
      (() => {
        const summary = parsePageBlocksSafe(rawBlocks)
        if (summary.skippedCount > 0) {
          currentLog()?.warn("cms.renderer_skipped_blocks", {
            pageSlug,
            skippedCount: summary.skippedCount
          })
        }
        return summary.validBlocks.filter((b) => b.enabled)
      })()

    return (
      <>
        {validatedBlocks.map((block) => {
          try {
            return renderSingleBlock(block, pageSlug, settings, collections, requestState)
          } catch (err) {
            currentLog()?.warn("cms.block_render_error", {
              pageSlug,
              blockId: block.id,
              blockType: block.type,
              message: err instanceof Error ? err.message : "Block render error"
            })
            return null
          }
        })}
      </>
    )
  }
}

export interface CmsPublicPageProps {
  user?: AdminUser | null
  chrome: SiteChromeConfig
  page: ResolvedCmsPage
  hydrated: HydratedPageResult
}

export function CmsPublicPage(handle: Handle<CmsPublicPageProps>) {
  return () => {
    const { user, chrome, page, hydrated } = handle.props
    const settings = chromeToSiteSettings(chrome)
    const previewBanner: DraftPreviewBannerInfo | null = page.isDraftPreview
      ? {
          pageId: page.id,
          slug: page.slug,
          version: page.version,
          status: page.status
        }
      : null

    return (
      <LandingLayout user={user} chrome={chrome} settings={settings} previewBanner={previewBanner}>
        <BlockRenderer
          pageSlug={page.slug}
          blocks={hydrated.activeBlocks}
          settings={settings}
          collections={hydrated.collections}
          requestState={hydrated.requestState}
        />
      </LandingLayout>
    )
  }
}
