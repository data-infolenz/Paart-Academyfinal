import { parse as parseBracketParams } from "@sdxc/bracket-params"
import type { Operation } from "@sdxc/json-patch"
import { isSuccess } from "@sdxc/result"
import { generateUUID } from "@sdxc/uuid/v7"
import * as s from "remix/data-schema"
import { redirect } from "remix/response/redirect"
import { requireCmsAdmin } from "~/app/http/middleware/auth"
import type { AdminUser } from "~/app/initializers/auth"
import type { AppContext } from "~/app/initializers/router"
import { listPublishedBlogs } from "~/app/models/blogs"
import {
  createCampaignPage,
  deleteCampaignPage,
  findPageById,
  getSiteChrome,
  listAllPagesForAdmin,
  listPageRevisions,
  patchPageDraftBlocks,
  publishPage,
  restorePageRevision,
  savePageDraft,
  updateSiteChrome
} from "~/app/models/cms"
import {
  BLOCK_TYPES,
  type BlockType,
  cleanSubmittedBlockArrays,
  cleanSubmittedSiteChrome,
  createCampaignPageSchema,
  createDefaultBlock,
  intField,
  pageSeoSchema
} from "~/app/models/cms-schemas"
import { listActiveCourses } from "~/app/models/courses"
import { Document } from "~/resources/layouts/document"
import { AdminChromePage } from "~/resources/views/admin/chrome-page"
import { AdminPageEditorPage } from "~/resources/views/admin/page-editor-page"
import { AdminPagesIndexPage } from "~/resources/views/admin/pages-index-page"
import { routes } from "~/routes"

type IdRouteContext = AppContext & { params: { id: string } }
type RevisionRouteContext = AppContext & { params: { id: string; revisionId: string } }

function readFormString(form: FormData, key: string): string {
  const entry = form.get(key)
  return typeof entry === "string" ? entry.trim() : ""
}

function readFormInt(form: FormData, key: string, fallback: number): number {
  const raw = readFormString(form, key)
  if (!raw) return fallback
  const n = Number.parseInt(raw, 10)
  return Number.isFinite(n) ? n : fallback
}

const pageDraftBracketSchema = s.object({
  title: s.defaulted(s.string(), "").transform((v) => v.trim()),
  expectedVersion: intField(1, 1, 10_000_000),
  seo: pageSeoSchema,
  blocks: s.defaulted(s.array(s.any()), [])
})

const siteChromeBracketSchema = s.object({
  expectedVersion: intField(1, 1, 10_000_000),
  utilityBar: s.defaulted(s.record(s.string(), s.any()), {}),
  headerNav: s.defaulted(s.array(s.any()), []),
  headerCtas: s.defaulted(s.record(s.string(), s.any()), {}),
  footerColumns: s.defaulted(s.array(s.any()), []),
  trustProfile: s.defaulted(s.record(s.string(), s.any()), {})
})

async function resolveSampleEntitySlugs(): Promise<{
  sampleCourseSlug: string | null
  sampleBlogSlug: string | null
}> {
  const [courses, blogs] = await Promise.all([listActiveCourses(), listPublishedBlogs()])
  return {
    sampleCourseSlug: courses[0]?.slug ?? null,
    sampleBlogSlug: blogs[0]?.slug ?? null
  }
}

async function computePreviewHref(slug: string): Promise<string> {
  if (slug === "template:course-detail") {
    const courses = await listActiveCourses()
    return courses[0] ? `/courses/${courses[0].slug}?preview=draft` : "/courses?preview=draft"
  }
  if (slug === "template:blog-detail") {
    const blogs = await listPublishedBlogs()
    return blogs[0] ? `/blogs/${blogs[0].slug}?preview=draft` : "/blogs?preview=draft"
  }
  return `${slug}?preview=draft`
}

async function renderEditorState(
  ctx: AppContext,
  user: AdminUser,
  pageId: string,
  options: {
    statusCode?: number
    notice?: string | null
    error?: string | null
    conflictMessage?: string | null
  } = {}
): Promise<Response> {
  const page = await findPageById(pageId)
  if (!page) {
    const msg = encodeURIComponent("Requested page could not be found.")
    return redirect(`${routes.admin.pages.href()}?error=${msg}`, 303)
  }

  const [revisions, previewHref] = await Promise.all([
    listPageRevisions(pageId),
    computePreviewHref(page.slug)
  ])

  return ctx.render(
    <Document title={`Edit ${page.title} — PAART Admin Console`} assets={ctx.assets}>
      <AdminPageEditorPage
        user={user}
        page={page}
        revisions={revisions}
        previewHref={previewHref}
        notice={options.notice ?? null}
        error={options.error ?? null}
        conflictMessage={options.conflictMessage ?? null}
      />
    </Document>,
    { status: options.statusCode ?? 200 }
  )
}

export const cmsAdminActions = {
  async pages(ctx: AppContext) {
    const user = await requireCmsAdmin(ctx.request)
    const url = new URL(ctx.request.url)
    const notice = url.searchParams.get("notice")
    const error = url.searchParams.get("error")

    const [allPages, samples] = await Promise.all([
      listAllPagesForAdmin(),
      resolveSampleEntitySlugs()
    ])

    return ctx.render(
      <Document title="Page Builder — PAART Admin Console" assets={ctx.assets}>
        <AdminPagesIndexPage
          user={user}
          pages={allPages}
          sampleCourseSlug={samples.sampleCourseSlug}
          sampleBlogSlug={samples.sampleBlogSlug}
          notice={notice}
          error={error}
        />
      </Document>
    )
  },

  async pageCreate(ctx: AppContext) {
    const user = await requireCmsAdmin(ctx.request)
    const form = ctx.formData ?? (await ctx.request.formData())

    const formValues = {
      title: readFormString(form, "title"),
      slug: readFormString(form, "slug"),
      seoTitle: readFormString(form, "seoTitle"),
      seoDescription: readFormString(form, "seoDescription")
    }

    const renderCreateError = async (message: string, status = 422) => {
      const [allPages, samples] = await Promise.all([
        listAllPagesForAdmin(),
        resolveSampleEntitySlugs()
      ])
      return ctx.render(
        <Document title="Page Builder — PAART Admin Console" assets={ctx.assets}>
          <AdminPagesIndexPage
            user={user}
            pages={allPages}
            sampleCourseSlug={samples.sampleCourseSlug}
            sampleBlogSlug={samples.sampleBlogSlug}
            error={message}
            formValues={formValues}
          />
        </Document>,
        { status }
      )
    }

    const parsed = parseBracketParams(form, createCampaignPageSchema, {
      depth: 6,
      parameterLimit: 200
    })
    if (!isSuccess(parsed)) {
      const firstIssue = parsed.error.issues[0]?.message ?? "Invalid campaign page details."
      return renderCreateError(firstIssue, 422)
    }

    const created = await createCampaignPage(parsed.data, user.id)
    if (created.status === "invalid") {
      return renderCreateError(created.message, 422)
    }

    const notice = encodeURIComponent(
      `Created campaign draft "${parsed.data.title}" (${created.slug}). Compose your blocks below and publish when ready.`
    )
    return redirect(`${routes.admin.pageEdit.href({ id: created.pageId })}?notice=${notice}`, 303)
  },

  async pageEdit(ctx: IdRouteContext) {
    const user = await requireCmsAdmin(ctx.request)
    const url = new URL(ctx.request.url)
    return renderEditorState(ctx, user, ctx.params.id, {
      notice: url.searchParams.get("notice"),
      error: url.searchParams.get("error"),
      conflictMessage: url.searchParams.get("conflict")
    })
  },

  async pageDraftSave(ctx: IdRouteContext) {
    const user = await requireCmsAdmin(ctx.request)
    const form = ctx.formData ?? (await ctx.request.formData())

    const parsed = parseBracketParams(form, pageDraftBracketSchema, {
      depth: 12,
      parameterLimit: 8000
    })
    if (!isSuccess(parsed)) {
      const issueMsg = parsed.error.issues[0]?.message ?? "Invalid draft block submission."
      return renderEditorState(ctx, user, ctx.params.id, {
        statusCode: 422,
        error: issueMsg
      })
    }

    const cleanedBlocks = cleanSubmittedBlockArrays(parsed.data.blocks)
    const saved = await savePageDraft(
      ctx.params.id,
      {
        title: parsed.data.title,
        seo: parsed.data.seo,
        blocks: cleanedBlocks,
        expectedVersion: parsed.data.expectedVersion
      },
      user.id
    )

    if (saved.status === "not_found") {
      return redirect(
        `${routes.admin.pages.href()}?error=${encodeURIComponent("Page not found.")}`,
        303
      )
    }
    if (saved.status === "conflict") {
      return renderEditorState(ctx, user, ctx.params.id, {
        statusCode: 409,
        conflictMessage: `Version conflict: database is at v${saved.currentVersion} while your form submitted v${parsed.data.expectedVersion}. Reloaded latest draft.`
      })
    }
    if (saved.status === "invalid") {
      return renderEditorState(ctx, user, ctx.params.id, {
        statusCode: 422,
        error: saved.message
      })
    }

    const notice = encodeURIComponent(
      `Saved draft v${saved.version}. Public live page remains unchanged until you publish.`
    )
    return redirect(`${routes.admin.pageEdit.href({ id: ctx.params.id })}?notice=${notice}`, 303)
  },

  async pageBlockAdd(ctx: IdRouteContext) {
    const user = await requireCmsAdmin(ctx.request)
    const form = ctx.formData ?? (await ctx.request.formData())
    const blockTypeRaw = readFormString(form, "blockType")
    const position = readFormString(form, "position") === "start" ? "start" : "end"
    const expectedVersion = readFormInt(form, "expectedVersion", -1)

    if (!BLOCK_TYPES.includes(blockTypeRaw as BlockType)) {
      return renderEditorState(ctx, user, ctx.params.id, {
        statusCode: 422,
        error: `Unknown block type "${blockTypeRaw}".`
      })
    }

    const newBlock = createDefaultBlock(blockTypeRaw as BlockType)
    const operations: Operation[] = [
      {
        op: "add",
        path: position === "start" ? "/blocks/0" : "/blocks/-",
        value: newBlock as unknown as Operation extends { value: infer V } ? V : never
      }
    ]

    const patched = await patchPageDraftBlocks(ctx.params.id, operations, expectedVersion, user.id)

    if (patched.status === "not_found") {
      return redirect(routes.admin.pages.href(), 303)
    }
    if (patched.status === "conflict") {
      return renderEditorState(ctx, user, ctx.params.id, {
        statusCode: 409,
        conflictMessage: `Version conflict while adding block (current v${patched.currentVersion}, submitted v${expectedVersion}).`
      })
    }
    if (patched.status === "invalid") {
      return renderEditorState(ctx, user, ctx.params.id, {
        statusCode: 422,
        error: patched.message
      })
    }

    const notice = encodeURIComponent(
      `Added "${blockTypeRaw}" block to draft (v${patched.version}).`
    )
    return redirect(`${routes.admin.pageEdit.href({ id: ctx.params.id })}?notice=${notice}`, 303)
  },

  async pageBlockPatch(ctx: IdRouteContext) {
    const user = await requireCmsAdmin(ctx.request)
    const form = ctx.formData ?? (await ctx.request.formData())
    const expectedVersion = readFormInt(form, "expectedVersion", -1)
    const rawOperationsJson = readFormString(form, "operations")
    const patchAction = readFormString(form, "patchAction")
    const blockIndex = readFormInt(form, "blockIndex", -1)

    const currentPage = await findPageById(ctx.params.id)
    if (!currentPage) {
      return redirect(routes.admin.pages.href(), 303)
    }

    let operations: Operation[] = []

    if (rawOperationsJson) {
      try {
        const parsedJson: unknown = JSON.parse(rawOperationsJson)
        if (!Array.isArray(parsedJson)) {
          return renderEditorState(ctx, user, ctx.params.id, {
            statusCode: 422,
            error: "JSON Patch operations must be an array."
          })
        }
        operations = parsedJson as Operation[]
      } catch {
        return renderEditorState(ctx, user, ctx.params.id, {
          statusCode: 422,
          error: "Malformed RFC 6902 JSON Patch payload."
        })
      }
    } else {
      const targetBlock = currentPage.draftBlocks[blockIndex]
      if (!targetBlock) {
        return renderEditorState(ctx, user, ctx.params.id, {
          statusCode: 422,
          error: "Selected block index is out of range."
        })
      }

      switch (patchAction) {
        case "move_up":
          if (blockIndex > 0) {
            operations = [
              { op: "move", from: `/blocks/${blockIndex}`, path: `/blocks/${blockIndex - 1}` }
            ]
          }
          break
        case "move_down":
          if (blockIndex < currentPage.draftBlocks.length - 1) {
            operations = [
              { op: "move", from: `/blocks/${blockIndex}`, path: `/blocks/${blockIndex + 1}` }
            ]
          }
          break
        case "toggle":
          operations = [
            {
              op: "replace",
              path: `/blocks/${blockIndex}/enabled`,
              value: !targetBlock.enabled
            }
          ]
          break
        case "duplicate": {
          const clone = {
            ...structuredClone(targetBlock),
            id: `blk-${generateUUID()}`
          }
          operations = [
            {
              op: "add",
              path: `/blocks/${blockIndex + 1}`,
              value: clone as unknown as Operation extends { value: infer V } ? V : never
            }
          ]
          break
        }
        case "remove":
          operations = [{ op: "remove", path: `/blocks/${blockIndex}` }]
          break
        default:
          return renderEditorState(ctx, user, ctx.params.id, {
            statusCode: 422,
            error: `Unsupported block patch action "${patchAction}".`
          })
      }
    }

    const patched = await patchPageDraftBlocks(ctx.params.id, operations, expectedVersion, user.id)

    if (patched.status === "not_found") {
      return redirect(routes.admin.pages.href(), 303)
    }
    if (patched.status === "conflict") {
      return renderEditorState(ctx, user, ctx.params.id, {
        statusCode: 409,
        conflictMessage: `Version conflict: database is at v${patched.currentVersion} while request carried v${expectedVersion}.`
      })
    }
    if (patched.status === "invalid") {
      return renderEditorState(ctx, user, ctx.params.id, {
        statusCode: 422,
        error: patched.message
      })
    }

    const notice = encodeURIComponent(`Updated draft block structure (v${patched.version}).`)
    return redirect(`${routes.admin.pageEdit.href({ id: ctx.params.id })}?notice=${notice}`, 303)
  },

  async pagePublish(ctx: IdRouteContext) {
    const user = await requireCmsAdmin(ctx.request)
    const form = ctx.formData ?? (await ctx.request.formData())
    const note = readFormString(form, "note")
    const hasExpected = readFormString(form, "expectedVersion") !== ""
    const expectedVersion = hasExpected ? readFormInt(form, "expectedVersion", -1) : undefined

    const published = await publishPage(ctx.params.id, user.id, note, {
      expectedVersion
    })

    if (published.status === "not_found") {
      return redirect(routes.admin.pages.href(), 303)
    }
    if (published.status === "conflict") {
      return renderEditorState(ctx, user, ctx.params.id, {
        statusCode: 409,
        conflictMessage: `Cannot publish stale draft: database is at v${published.currentVersion}. Review the latest draft before publishing.`
      })
    }
    if (published.status === "invalid") {
      return renderEditorState(ctx, user, ctx.params.id, {
        statusCode: 422,
        error: published.message
      })
    }

    const notice = encodeURIComponent(
      `Published live revision v${published.publishedVersion} and purged SSR cache.`
    )
    return redirect(`${routes.admin.pageEdit.href({ id: ctx.params.id })}?notice=${notice}`, 303)
  },

  async pageRevisionRestore(ctx: RevisionRouteContext) {
    const user = await requireCmsAdmin(ctx.request)
    const restored = await restorePageRevision(ctx.params.id, ctx.params.revisionId, user.id)

    if (restored.status === "not_found") {
      return renderEditorState(ctx, user, ctx.params.id, {
        statusCode: 404,
        error: "Target revision snapshot was not found for this page."
      })
    }

    const notice = encodeURIComponent(
      `Restored page from revision v${restored.restoredFromVersion} as live revision v${restored.publishedVersion}.`
    )
    return redirect(`${routes.admin.pageEdit.href({ id: ctx.params.id })}?notice=${notice}`, 303)
  },

  async pageDelete(ctx: IdRouteContext) {
    await requireCmsAdmin(ctx.request)
    const deleted = await deleteCampaignPage(ctx.params.id)

    if (deleted.status === "forbidden_system_page") {
      const err = encodeURIComponent("Core institutional pages cannot be deleted.")
      return redirect(`${routes.admin.pages.href()}?error=${err}`, 303)
    }
    if (deleted.status === "not_found") {
      return redirect(routes.admin.pages.href(), 303)
    }

    const notice = encodeURIComponent(`Deleted campaign page "${deleted.deletedSlug}".`)
    return redirect(`${routes.admin.pages.href()}?notice=${notice}`, 303)
  },

  async chrome(ctx: AppContext) {
    const user = await requireCmsAdmin(ctx.request)
    const url = new URL(ctx.request.url)
    const saved = url.searchParams.get("saved") === "1"
    const error = url.searchParams.get("error")
    const { chrome, version } = await getSiteChrome({ bypassCache: true })

    return ctx.render(
      <Document title="Navigation & Footer — PAART Admin Console" assets={ctx.assets}>
        <AdminChromePage
          user={user}
          chrome={chrome}
          version={version}
          saved={saved}
          error={error}
        />
      </Document>
    )
  },

  async chromeUpdate(ctx: AppContext) {
    const user = await requireCmsAdmin(ctx.request)
    const form = ctx.formData ?? (await ctx.request.formData())

    const parsed = parseBracketParams(form, siteChromeBracketSchema, {
      depth: 10,
      parameterLimit: 4000
    })

    if (!isSuccess(parsed)) {
      const { chrome, version } = await getSiteChrome({ bypassCache: true })
      const msg = parsed.error.issues[0]?.message ?? "Invalid site chrome submission."
      return ctx.render(
        <Document title="Navigation & Footer — PAART Admin Console" assets={ctx.assets}>
          <AdminChromePage user={user} chrome={chrome} version={version} error={msg} />
        </Document>,
        { status: 422 }
      )
    }

    const cleaned = cleanSubmittedSiteChrome({
      utilityBar: parsed.data.utilityBar,
      headerNav: parsed.data.headerNav,
      headerCtas: parsed.data.headerCtas,
      footerColumns: parsed.data.footerColumns,
      trustProfile: parsed.data.trustProfile
    })

    const updated = await updateSiteChrome(cleaned, user.id, {
      expectedVersion: parsed.data.expectedVersion
    })

    if (updated.status === "conflict") {
      const latest = await getSiteChrome({ bypassCache: true })
      return ctx.render(
        <Document title="Navigation & Footer — PAART Admin Console" assets={ctx.assets}>
          <AdminChromePage
            user={user}
            chrome={latest.chrome}
            version={latest.version}
            conflictMessage={`Version conflict: site chrome is at v${updated.currentVersion}. Reloaded latest configuration.`}
          />
        </Document>,
        { status: 409 }
      )
    }

    if (updated.status === "invalid") {
      const latest = await getSiteChrome({ bypassCache: true })
      return ctx.render(
        <Document title="Navigation & Footer — PAART Admin Console" assets={ctx.assets}>
          <AdminChromePage
            user={user}
            chrome={latest.chrome}
            version={latest.version}
            error={updated.message}
          />
        </Document>,
        { status: 422 }
      )
    }

    return redirect(`${routes.admin.chrome.href()}?saved=1`, 303)
  }
}
