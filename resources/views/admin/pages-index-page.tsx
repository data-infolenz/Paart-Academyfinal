import type { Handle } from "remix/component"
import {
  BlocksIcon,
  CircleCheckIcon,
  ExternalLinkIcon,
  EyeIcon,
  PlusIcon,
  TrashIcon,
  TriangleAlertIcon
} from "@sdxc/icons"
import * as u from "@sdxc/u"
import { Badge, Button, Dialog, Heading, Input, LinkButton, Text, TextArea } from "@sdxc/ui"
import { PageHeader } from "@sdxc/ui/app"
import type { AdminUser } from "~/app/initializers/auth"
import type { AdminPageSummary } from "~/app/models/cms"
import { AdminLayout } from "~/resources/layouts/admin"
import { routes } from "~/routes"

export interface AdminPagesIndexPageProps {
  user: AdminUser
  pages: AdminPageSummary[]
  sampleCourseSlug?: string | null
  sampleBlogSlug?: string | null
  notice?: string | null
  error?: string | null
  formValues?: {
    title?: string
    slug?: string
    seoTitle?: string
    seoDescription?: string
  }
}

function buildPreviewHref(
  page: AdminPageSummary,
  sampleCourseSlug?: string | null,
  sampleBlogSlug?: string | null
): string {
  if (page.slug === "template:course-detail") {
    return sampleCourseSlug
      ? `/courses/${sampleCourseSlug}?preview=draft`
      : "/courses?preview=draft"
  }
  if (page.slug === "template:blog-detail") {
    return sampleBlogSlug ? `/blogs/${sampleBlogSlug}?preview=draft` : "/blogs?preview=draft"
  }
  return `${page.slug}?preview=draft`
}

function renderStatusBadge(page: AdminPageSummary) {
  if (page.status === "draft") {
    return (
      <Badge color="warning" variant="outline">
        Unpublished Draft
      </Badge>
    )
  }
  if (page.hasUnpublishedChanges) {
    return (
      <Badge color="warning" variant="secondary">
        Published · Draft Edits Pending
      </Badge>
    )
  }
  return (
    <Badge color="success" variant="secondary">
      Published Live
    </Badge>
  )
}

export function AdminPagesIndexPage(handle: Handle<AdminPagesIndexPageProps>) {
  return () => {
    const {
      user,
      pages,
      sampleCourseSlug,
      sampleBlogSlug,
      notice = null,
      error = null,
      formValues
    } = handle.props

    const corePages = pages.filter((p) => p.kind === "static_page" && p.isSystem)
    const campaignPages = pages.filter((p) => p.kind === "static_page" && !p.isSystem)
    const templatePages = pages.filter((p) => p.kind === "collection_template")

    const publishedCount = pages.filter((p) => p.status === "published").length
    const pendingDraftsCount = pages.filter((p) => p.hasUnpublishedChanges).length

    const renderPageGroup = (
      heading: string,
      subtitle: string,
      items: AdminPageSummary[],
      allowDelete: boolean
    ) => (
      <section
        mix={[
          u.vstack({ gap: 3.5 }),
          u.p(5),
          u.rounded("xl"),
          u.border({ width: 1, color: "neutral" }),
          u.bg("var(--ui-surface, var(--ui-bg))")
        ]}
      >
        <div mix={[u.hstack({ gap: 2, align: "center", justify: "between" }), u.flexWrap("wrap")]}>
          <div mix={[u.vstack({ gap: 0.5 })]}>
            <Heading level={2} mix={[u.fontSize("md"), u.weight("semibold"), u.m(0)]}>
              {heading}
            </Heading>
            <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>{subtitle}</Text>
          </div>
          <Badge color="neutral" variant="outline">
            {items.length} {items.length === 1 ? "Page" : "Pages"}
          </Badge>
        </div>

        {items.length === 0 ? (
          <div
            mix={[
              u.p(5),
              u.rounded("lg"),
              u.border({ width: 1, style: "dashed", color: "neutral" }),
              u.textAlign("center")
            ]}
          >
            <Text mix={[u.fontSize("sm"), u.fg("neutral.muted"), u.m(0)]}>
              No custom campaign landing pages yet. Click "New Campaign Page" above to launch an
              exam batch or scholarship page.
            </Text>
          </div>
        ) : (
          <div mix={[u.vstack({ gap: 2.5 })]}>
            {items.map((page) => {
              const previewHref = buildPreviewHref(page, sampleCourseSlug, sampleBlogSlug)
              return (
                <div
                  key={page.id}
                  mix={[
                    u.hstack({ gap: 3, align: "center", justify: "between" }),
                    u.flexWrap("wrap"),
                    u.p(3.5),
                    u.rounded("lg"),
                    u.border({ width: 1, color: "neutral" }),
                    u.bg("var(--ui-bg)")
                  ]}
                >
                  <div mix={[u.vstack({ gap: 1 }), u.minWidth(0), u.grow(1)]}>
                    <div mix={[u.hstack({ gap: 2, align: "center" }), u.flexWrap("wrap")]}>
                      <Text mix={[u.fontSize("sm"), u.weight("semibold"), u.m(0)]}>
                        {page.title}
                      </Text>
                      <code
                        mix={[
                          u.pi(2),
                          u.pb(0.5),
                          u.rounded("md"),
                          u.bg("neutral.tint"),
                          u.fontSize("xs")
                        ]}
                      >
                        {page.slug}
                      </code>
                      {renderStatusBadge(page)}
                    </div>
                    <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                      {page.draftBlockCount} draft blocks · Version v{page.version}
                      {page.publishedVersion > 0
                        ? ` (Live v${page.publishedVersion})`
                        : " (Never published)"}{" "}
                      · Updated {page.updatedAt.toISOString().slice(0, 10)}
                    </Text>
                  </div>

                  <div mix={[u.hstack({ gap: 2, align: "center" }), u.flexWrap("wrap")]}>
                    <LinkButton href={previewHref} variant="outline" color="neutral" size="sm">
                      <EyeIcon size={14} />
                      <span>Preview Draft</span>
                    </LinkButton>

                    {page.status === "published" && page.kind === "static_page" && (
                      <LinkButton href={page.slug} variant="ghost" color="neutral" size="sm">
                        <span>Live</span>
                        <ExternalLinkIcon size={13} />
                      </LinkButton>
                    )}

                    <LinkButton
                      href={routes.admin.pageEdit.href({ id: page.id })}
                      variant="solid"
                      color="brand"
                      size="sm"
                    >
                      <BlocksIcon size={14} />
                      <span>Edit Blocks</span>
                    </LinkButton>

                    {allowDelete && (
                      <form
                        method="POST"
                        action={routes.admin.pageDelete.href({ id: page.id })}
                        mix={[u.m(0)]}
                      >
                        <Button
                          type="submit"
                          variant="outline"
                          color="danger"
                          size="sm"
                          aria-label={`Delete ${page.title}`}
                          title={`Delete ${page.title}`}
                        >
                          <TrashIcon size={14} />
                        </Button>
                      </form>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    )

    return (
      <AdminLayout user={user} currentPath={routes.admin.pages.href()}>
        <PageHeader
          crumbsLabel="Breadcrumb"
          crumbs={[{ label: "Admin", href: routes.admin.index.href() }, { label: "Page Builder" }]}
          title="Server-Driven Page Studio"
          description="Compose, preview, publish, and roll back institutional pages, exam campaign slugs, and entity detail templates."
          status={<Badge color="brand">{pages.length} Total Pages</Badge>}
          actions={
            <LinkButton href={routes.admin.chrome.href()} variant="outline" color="neutral">
              Navigation & Footer
            </LinkButton>
          }
          primaryAction={
            <Button
              color="brand"
              variant="solid"
              commandfor="create-campaign-dialog"
              command="show-modal"
            >
              <PlusIcon size={15} />
              <span>New Campaign Page</span>
            </Button>
          }
        />

        {/* Summary KPI Strip */}
        <div
          mix={[
            u.grid(),
            u.gap(3.5),
            u.media(
              "(min-width: 48rem)",
              u.raw({ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" })
            )
          ]}
        >
          {[
            { label: "Core Institutional Routes", value: String(corePages.length) },
            { label: "Published Live", value: String(publishedCount) },
            { label: "Drafts / Pending Edits", value: String(pendingDraftsCount) },
            { label: "Campaign Slugs", value: String(campaignPages.length) }
          ].map((stat) => (
            <div
              key={stat.label}
              mix={[
                u.vstack({ gap: 1 }),
                u.p(4),
                u.rounded("xl"),
                u.border({ width: 1, color: "neutral" }),
                u.bg("var(--ui-surface, var(--ui-bg))")
              ]}
            >
              <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>{stat.label}</Text>
              <Text mix={[u.fontSize("xl"), u.weight("bold"), u.m(0)]}>{stat.value}</Text>
            </div>
          ))}
        </div>

        {notice && (
          <div
            role="status"
            mix={[
              u.hstack({ gap: 2.5, align: "center" }),
              u.p(3.5),
              u.rounded("lg"),
              u.border({ width: 1, color: "success" }),
              u.bg("success.tint")
            ]}
          >
            <CircleCheckIcon size={18} mix={[u.fg("success"), u.shrink(0)]} />
            <Text mix={[u.fontSize("sm"), u.weight("medium"), u.fg("success"), u.m(0)]}>
              {notice}
            </Text>
          </div>
        )}

        {error && (
          <div
            role="alert"
            mix={[
              u.hstack({ gap: 2.5, align: "center" }),
              u.p(3.5),
              u.rounded("lg"),
              u.border({ width: 1, color: "danger" }),
              u.bg("danger.tint")
            ]}
          >
            <TriangleAlertIcon size={18} mix={[u.fg("danger"), u.shrink(0)]} />
            <Text mix={[u.fontSize("sm"), u.weight("medium"), u.fg("danger"), u.m(0)]}>
              {error}
            </Text>
          </div>
        )}

        {/* Create Campaign Dialog (Native <dialog> via @sdxc/ui Invoker Commands) */}
        <Dialog
          id="create-campaign-dialog"
          open={Boolean(error)}
          aria-labelledby="create-campaign-title"
        >
          <Dialog.Header>
            <Dialog.Title id="create-campaign-title">Create Custom Campaign Page</Dialog.Title>
            <Dialog.Description>
              Launch a dedicated landing page (e.g. TNPSC Group IV 2027 Batch or NMMS Scholarship).
              New pages start in unpublished Draft mode until you publish them.
            </Dialog.Description>
          </Dialog.Header>

          <form
            method="POST"
            action={routes.admin.pageCreate.href()}
            mix={[u.vstack({ gap: 3.5 }), u.p(5)]}
          >
            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                Campaign Page Title *
              </Text>
              <Input
                name="title"
                required
                defaultValue={formValues?.title ?? ""}
                placeholder="e.g. TNPSC Group IV 2027 Batch"
              />
            </label>

            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                URL Slug (optional — auto-generated from title if blank)
              </Text>
              <Input
                name="slug"
                defaultValue={formValues?.slug ?? ""}
                placeholder="e.g. /tnpsc-group-iv-2027-batch"
              />
            </label>

            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>SEO Meta Title</Text>
              <Input
                name="seoTitle"
                defaultValue={formValues?.seoTitle ?? ""}
                placeholder="Optional custom <title> tag"
              />
            </label>

            <label mix={[u.vstack({ gap: 1.5 })]}>
              <Text mix={[u.fontSize("xs"), u.weight("semibold"), u.m(0)]}>
                SEO Meta Description
              </Text>
              <TextArea
                name="seoDescription"
                rows={2}
                defaultValue={formValues?.seoDescription ?? ""}
                placeholder="Optional search engine summary..."
              />
            </label>

            <Dialog.Footer>
              <Button
                commandfor="create-campaign-dialog"
                command="close"
                variant="outline"
                color="neutral"
              >
                Cancel
              </Button>
              <Button type="submit" color="brand" variant="solid">
                Create Draft & Open Composer
              </Button>
            </Dialog.Footer>
          </form>

          <Dialog.Close commandfor="create-campaign-dialog" aria-label="Close dialog" />
        </Dialog>

        {renderPageGroup(
          "Core Institutional Pages",
          "Protected routes powering /, /about, /courses, /materials, /gallery, /blogs, /faq, /contact, and /admissions.",
          corePages,
          false
        )}

        {renderPageGroup(
          "Custom Campaign & Exam Landing Pages",
          "Custom /:slug pages automatically synced with /sitemap.xml and /llms.txt once published.",
          campaignPages,
          true
        )}

        {renderPageGroup(
          "Collection Detail Templates",
          "Shared block layouts bound dynamically to active /courses/:slug and /blogs/:slug records.",
          templatePages,
          false
        )}
      </AdminLayout>
    )
  }
}
