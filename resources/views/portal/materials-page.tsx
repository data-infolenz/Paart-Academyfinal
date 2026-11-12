import type { Handle } from "remix/component"
import * as u from "@sdxc/u"
import { Badge, Heading, LinkButton, Text } from "@sdxc/ui"
import { PageHeader } from "@sdxc/ui/app"
import type { SessionUser } from "~/app/initializers/auth"
import type { MaterialItem } from "~/app/models/materials"
import { PortalLayout } from "~/resources/layouts/portal"
import { routes } from "~/routes"

export interface PortalMaterialsPageProps {
  user: SessionUser
  materials: MaterialItem[]
}

export function PortalMaterialsPage(handle: Handle<PortalMaterialsPageProps>) {
  return () => {
    const { user, materials } = handle.props

    return (
      <PortalLayout user={user} currentPath={routes.portal.materials.href()}>
        <PageHeader
          crumbs={[
            { label: "Portal", href: routes.portal.index.href() },
            { label: "Study Materials" }
          ]}
          title="Course Study Materials & Question Banks"
          description="Exclusive notes for your enrolled course alongside general PAART Academy reference downloads."
          status={<Badge color="brand">{materials.length} Resources</Badge>}
        />

        {materials.length === 0 ? (
          <div
            mix={[
              u.p(6),
              u.rounded("xl"),
              u.border({ width: 1, color: "neutral" }),
              u.bg("var(--ui-surface, var(--ui-bg))"),
              u.textAlign("center")
            ]}
          >
            <Text mix={[u.fontSize("sm"), u.fg("neutral.muted"), u.m(0)]}>
              No study materials available yet.
            </Text>
          </div>
        ) : (
          <div
            mix={[
              u.grid(),
              u.gap(4),
              u.media(
                "(min-width: 52rem)",
                u.raw({ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" })
              )
            ]}
          >
            {materials.map((mat) => {
              const targetHref = mat.fileUrl || mat.externalUrl
              return (
                <div
                  key={mat.id}
                  mix={[
                    u.vstack({ gap: 3 }),
                    u.p(5),
                    u.rounded("xl"),
                    u.border({ width: 1, color: "neutral" }),
                    u.bg("var(--ui-surface, var(--ui-bg))")
                  ]}
                >
                  <div mix={[u.hstack({ gap: 2, align: "center" }), u.flexWrap("wrap")]}>
                    <Badge color="brand" variant="outline">
                      {mat.category}
                    </Badge>
                    <Badge
                      color={mat.visibility === "enrolled" ? "warning" : "success"}
                      variant="secondary"
                    >
                      {mat.visibility === "enrolled"
                        ? "Enrolled Cohort Exclusive"
                        : "Academy Public"}
                    </Badge>
                    {mat.courseTitle && (
                      <Badge color="neutral" variant="outline">
                        {mat.courseTitle}
                      </Badge>
                    )}
                  </div>

                  <Heading level={2} mix={[u.fontSize("md"), u.weight("bold"), u.m(0)]}>
                    {mat.title}
                  </Heading>

                  <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                    {mat.description}
                  </Text>

                  {targetHref && (
                    <div mix={[u.hstack({ justify: "start" })]}>
                      <LinkButton
                        href={targetHref}
                        target="_blank"
                        rel="noreferrer"
                        size="sm"
                        color="brand"
                        variant="outline"
                      >
                        Download / Open Resource
                      </LinkButton>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </PortalLayout>
    )
  }
}
