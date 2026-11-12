import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { resetCmsCache } from "~/app/initializers/cms-cache"
import { db, type PaartDb } from "~/app/initializers/database"
import { DEFAULT_SITE_CHROME } from "~/config/default-pages"
import { pages, users } from "~/database/schema"
import {
  createCampaignPage,
  deleteCampaignPage,
  findPageById,
  getSiteChrome,
  listPageRevisions,
  patchPageDraftBlocks,
  publishPage,
  resolvePublicPage,
  restorePageRevision,
  savePageDraft
} from "./cms"
import { createDefaultBlock } from "./cms-schemas"

describe("CMS data layer (app/models/cms.ts)", () => {
  const createdPageIds: string[] = []
  let adminId = "019a0000-0000-7000-8000-000000000001"

  beforeEach(async () => {
    resetCmsCache()
    const admin = await db.findOne(users, { where: { role: "admin" } })
    if (admin) {
      adminId = admin.id
    }
  })

  afterEach(async () => {
    for (const id of createdPageIds.splice(0)) {
      await db.delete(pages, id).catch(() => {})
    }
    resetCmsCache()
  })

  it("enforces draft isolation, optimistic concurrency, publish authorship, cache invalidation, and 1-click rollback", async () => {
    const slugName = `cms-test-batch-${Date.now()}`
    const created = await createCampaignPage(
      {
        title: "TNPSC Group II Test Series Campaign",
        slug: slugName
      },
      adminId
    )
    expect(created.status).toBe("ok")
    if (created.status !== "ok") return
    createdPageIds.push(created.pageId)

    // 1. Draft page returns null publicly, and non-admins cannot preview draft
    expect(await resolvePublicPage(created.slug)).toBeNull()
    expect(await resolvePublicPage(created.slug, { previewDraft: true, isAdmin: false })).toBeNull()

    // Admin draft preview succeeds
    const adminPreview = await resolvePublicPage(created.slug, {
      previewDraft: true,
      isAdmin: true
    })
    expect(adminPreview).not.toBeNull()
    expect(adminPreview?.isDraftPreview).toBe(true)
    expect(adminPreview?.rawBlocks).toHaveLength(3)

    // 2. Patch draft blocks (reorder block 2 to index 0) using @sdxc/json-patch
    const reordered = await patchPageDraftBlocks(
      created.pageId,
      [{ op: "move", from: "/blocks/2", path: "/blocks/0" }],
      1,
      adminId
    )
    expect(reordered.status).toBe("ok")
    if (reordered.status !== "ok") return
    expect(reordered.version).toBe(2)
    expect(reordered.blocks[0]?.id).toBe("blk-cta")

    // 3. Stale expectedVersion triggers optimistic concurrency conflict (409)
    const stalePatch = await patchPageDraftBlocks(
      created.pageId,
      [{ op: "move", from: "/blocks/1", path: "/blocks/0" }],
      1,
      adminId
    )
    expect(stalePatch).toEqual({ status: "conflict", currentVersion: 2 })

    // 4. Publish revision v1
    const pub1 = await publishPage(created.pageId, adminId, "Launch campaign v1")
    expect(pub1.status).toBe("ok")
    if (pub1.status !== "ok") return
    expect(pub1.publishedVersion).toBe(1)

    // Public read hits & populates cache
    const liveV1 = await resolvePublicPage(created.slug)
    expect(liveV1).not.toBeNull()
    expect(liveV1?.publishedVersion).toBe(1)
    expect((liveV1?.rawBlocks[0] as { id: string } | undefined)?.id).toBe("blk-cta")

    // 5. Save draft edit (v2 candidate) — live published page MUST remain on v1!
    const pageAfterPub1 = await findPageById(created.pageId)
    expect(pageAfterPub1).not.toBeNull()
    const v2Notice = createDefaultBlock("notice_bar", "blk-v2-notice")
    const draftSave = await savePageDraft(
      created.pageId,
      {
        title: "TNPSC Group II Updated Title",
        seo: pageAfterPub1!.seo,
        blocks: [v2Notice, ...pageAfterPub1!.draftBlocks],
        expectedVersion: pageAfterPub1!.version
      },
      adminId
    )
    expect(draftSave.status).toBe("ok")

    const stillLiveV1 = await resolvePublicPage(created.slug)
    expect(stillLiveV1?.rawBlocks).toHaveLength(3)

    // 6. Publish v2 — cache is purged immediately and public sees 4 blocks
    const pub2 = await publishPage(created.pageId, adminId, "Add v2 notice bar")
    expect(pub2.status).toBe("ok")

    const liveV2 = await resolvePublicPage(created.slug)
    expect(liveV2?.publishedVersion).toBe(2)
    expect(liveV2?.rawBlocks).toHaveLength(4)

    // Verify revision history & authorship
    const revisions = await listPageRevisions(created.pageId)
    expect(revisions).toHaveLength(2)
    expect(revisions[0]?.version).toBe(2)
    expect(revisions[0]?.createdBy).toBe(adminId)
    expect(revisions[0]?.diffOpsCount).toBeGreaterThan(0)

    // 7. Roll back to revision v1 — public immediately reverts to 3 blocks
    const rev1 = revisions.find((r) => r.version === 1)!
    const restored = await restorePageRevision(created.pageId, rev1.id, adminId)
    expect(restored).toEqual({
      status: "ok",
      publishedVersion: 3,
      restoredFromVersion: 1
    })

    const liveRestored = await resolvePublicPage(created.slug)
    expect(liveRestored?.publishedVersion).toBe(3)
    expect(liveRestored?.rawBlocks).toHaveLength(3)

    // 8. System page deletion is forbidden, custom campaign deletion succeeds
    const sysDelete = await deleteCampaignPage("page-home")
    expect(sysDelete.status).toBe("forbidden_system_page")

    const customDelete = await deleteCampaignPage(created.pageId)
    expect(customDelete).toEqual({ status: "ok", deletedSlug: created.slug })
    createdPageIds.pop()
    expect(await resolvePublicPage(created.slug)).toBeNull()
  })

  it("falls back cleanly to DEFAULT_PAGES and DEFAULT_SITE_CHROME when PostgreSQL is offline", async () => {
    const offlineDb = {
      find: async () => {
        throw new Error("ECONNREFUSED")
      },
      findOne: async () => {
        throw new Error("ECONNREFUSED")
      },
      findMany: async () => {
        throw new Error("ECONNREFUSED")
      }
    } as unknown as PaartDb

    const homeFallback = await resolvePublicPage("/", { targetDb: offlineDb })
    expect(homeFallback).not.toBeNull()
    expect(homeFallback?.slug).toBe("/")
    expect(homeFallback?.rawBlocks.length).toBeGreaterThan(0)

    const chromeFallback = await getSiteChrome({ bypassCache: true, targetDb: offlineDb })
    expect(chromeFallback.chrome.trustProfile.shortName).toBe(
      DEFAULT_SITE_CHROME.trustProfile.shortName
    )
  })
})
