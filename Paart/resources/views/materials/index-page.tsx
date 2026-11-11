import type { Handle } from "remix/component"
import { DownloadIcon, FileTextIcon } from "@sdxc/icons"
import * as u from "@sdxc/u"
import { Badge, LinkButton, Text } from "@sdxc/ui"
import type { AdminUser } from "~/app/initializers/auth"
import type { MaterialItem } from "~/app/models/materials"
import type { SiteSettings } from "~/app/models/settings"
import {
  acadCard,
  AcademicCalloutBand,
  AcademicPageBanner,
  AcademicSection,
  acadSerif
} from "~/resources/components/academic-ui"
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
        <AcademicPageBanner
          rubric="Open Student Library"
          title="Study Materials &amp; Revision Notes"
          description="Download structured Samacheer unit notes, General Tamil guides, monthly current affairs capsules, and solved previous-year question papers."
          breadcrumbs={[{ label: "Study Materials" }]}
        />

        <AcademicSection>
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
                  acadCard(),
                  u.hstack({ gap: 4, align: "start", justify: "between" }),
                  u.p(5),
                  u.textDecoration("none"),
                  u.fg("inherit"),
                  u.hover(u.border({ color: "var(--acad-primary)" }))
                ]}
              >
                <div mix={[u.hstack({ gap: 3.5, align: "start" }), u.minWidth(0)]}>
                  <div
                    mix={[
                      u.p(2.5),
                      u.rounded("md"),
                      u.bg("var(--acad-primary-soft)"),
                      u.fg("var(--acad-primary)"),
                      u.shrink(0)
                    ]}
                  >
                    <FileTextIcon size={20} />
                  </div>
                  <div mix={[u.vstack({ gap: 1.5 }), u.minWidth(0)]}>
                    <Badge color="neutral" variant="outline">
                      {mat.category}
                    </Badge>
                    <h2 mix={[acadSerif(), u.fontSize("base"), u.weight("bold"), u.m(0)]}>
                      {mat.title}
                    </h2>
                    <Text
                      mix={[
                        u.fontSize("xs"),
                        u.leading("normal"),
                        u.fg("var(--acad-muted)"),
                        u.m(0)
                      ]}
                    >
                      {mat.description}
                    </Text>
                  </div>
                </div>
                <div mix={[u.fg("var(--acad-primary)"), u.shrink(0)]}>
                  <DownloadIcon size={18} />
                </div>
              </a>
            ))}
          </div>
        </AcademicSection>

        <AcademicCalloutBand
          title="Looking for Printed Booklets &amp; Full OMR Test Series?"
          description="Enrolled classroom and weekend batch students receive printed bilingual booklets and weekly OMR test papers at our Puliyangudi campus."
          settings={settings}
        />
      </LandingLayout>
    )
  }
}
