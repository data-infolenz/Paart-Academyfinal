import type { Handle } from "remix/component"
import { DownloadIcon, FileTextIcon } from "@sdxc/icons"
import * as u from "@sdxc/u"
import { Badge, Heading, HeadingScope, LinkButton, Text } from "@sdxc/ui"
import { LandingHeader, LandingSection } from "@sdxc/ui/landing"
import type { AdminUser } from "~/app/initializers/auth"
import type { MaterialItem } from "~/app/models/materials"
import type { SiteSettings } from "~/app/models/settings"
import { LandingLayout } from "~/resources/layouts/landing"
import { routes } from "~/routes"

export interface MaterialsIndexPageProps {
  user?: AdminUser | null
  settings: SiteSettings
  materials: MaterialItem[]
  activeCategory: string
}

const MATERIAL_CATEGORIES = ["ALL", "Study Material", "Notes", "Current Affairs", "Question Bank"]

export function MaterialsIndexPage(handle: Handle<MaterialsIndexPageProps>) {
  return () => {
    const { user, settings, materials, activeCategory } = handle.props

    return (
      <LandingLayout user={user} settings={settings}>
        <LandingSection variant="frame" ruled>
          <HeadingScope level={1}>
            <LandingHeader
              eyebrow="Open Student Library"
              eyebrowVariant="pill"
              description="Download structured unit notes, General Tamil guides, monthly current affairs capsules, and solved previous-year question papers."
            >
              Study Materials &amp; Revision Notes
            </LandingHeader>

            <div mix={[u.hstack({ gap: 2 }), u.flexWrap("wrap"), u.mbe(6)]}>
              {MATERIAL_CATEGORIES.map((cat) => {
                const isSelected = activeCategory === cat
                const href =
                  cat === "ALL"
                    ? routes.materials.href()
                    : `${routes.materials.href()}?category=${encodeURIComponent(cat)}`
                return (
                  <LinkButton
                    key={cat}
                    href={href}
                    size="sm"
                    color={isSelected ? "brand" : "neutral"}
                    variant={isSelected ? "solid" : "outline"}
                  >
                    {cat === "ALL" ? "All Resources" : cat}
                  </LinkButton>
                )
              })}
            </div>

            <div
              mix={[
                u.grid(),
                u.gap(4),
                u.media(
                  "(min-width: 48rem)",
                  u.raw({ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" })
                )
              ]}
            >
              {materials.map((mat) => (
                <a
                  key={mat.id}
                  href={mat.externalUrl || mat.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  mix={[
                    u.hstack({ gap: 4, align: "start", justify: "between" }),
                    u.p(5),
                    u.rounded("xl"),
                    u.border({ width: 1, color: "neutral" }),
                    u.bg("var(--ui-surface, var(--ui-bg))"),
                    u.textDecoration("none"),
                    u.fg("inherit"),
                    u.hover([u.border({ color: "brand" }), u.shadow("sm")])
                  ]}
                >
                  <div mix={[u.hstack({ gap: 3.5, align: "start" }), u.minWidth(0)]}>
                    <div
                      mix={[
                        u.p(2.5),
                        u.rounded("lg"),
                        u.bg("brand.tint"),
                        u.fg("brand"),
                        u.shrink(0)
                      ]}
                    >
                      <FileTextIcon size={20} />
                    </div>
                    <div mix={[u.vstack({ gap: 1.5 }), u.minWidth(0)]}>
                      <Badge color="neutral" variant="outline">
                        {mat.category}
                      </Badge>
                      <Heading level={3} mix={[u.fontSize("base"), u.weight("semibold"), u.m(0)]}>
                        {mat.title}
                      </Heading>
                      <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                        {mat.description}
                      </Text>
                    </div>
                  </div>
                  <div mix={[u.hstack({ gap: 1, align: "center" }), u.fg("brand"), u.shrink(0)]}>
                    <DownloadIcon size={17} />
                  </div>
                </a>
              ))}
            </div>
          </HeadingScope>
        </LandingSection>
      </LandingLayout>
    )
  }
}
