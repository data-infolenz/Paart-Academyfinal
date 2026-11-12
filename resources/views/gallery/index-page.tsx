import type { Handle } from "remix/component"
import * as u from "@sdxc/u"
import { Badge, LinkButton, Text } from "@sdxc/ui"
import type { AdminUser } from "~/app/initializers/auth"
import type { GalleryItem } from "~/app/models/gallery"
import type { SiteSettings } from "~/app/models/settings"
import {
  acadCard,
  AcademicCalloutBand,
  AcademicPageBanner,
  AcademicSection,
  AcademicSectionHeader,
  acadSerif
} from "~/resources/components/academic-ui"
import { LandingLayout } from "~/resources/layouts/landing"
import { routes } from "~/routes"

export interface GalleryIndexPageProps {
  user?: AdminUser | null
  settings: SiteSettings
  items: GalleryItem[]
  activeCategory: string
}

const GALLERY_CATEGORIES = [
  "ALL",
  "Classroom",
  "Model Exams",
  "Physical Coaching",
  "Achievements",
  "Community"
]

export function GalleryIndexPage(handle: Handle<GalleryIndexPageProps>) {
  return () => {
    const { user, settings, items, activeCategory } = handle.props

    return (
      <LandingLayout user={user} settings={settings}>
        <AcademicPageBanner
          rubric="Campus & Student Life"
          title="Gallery &amp; Activity Showcase"
          description="Photographs from PAART Academy classroom batches, weekly OMR model exams, physical track training, rank felicitations, and community guidance camps."
          breadcrumbs={[{ label: "Gallery" }]}
        />

        <AcademicSection>
          <div mix={[u.hstack({ gap: 2 }), u.flexWrap("wrap"), u.mbe(6)]}>
            {GALLERY_CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat
              const href =
                cat === "ALL"
                  ? routes.gallery.href()
                  : `${routes.gallery.href()}?category=${encodeURIComponent(cat)}`
              return (
                <LinkButton
                  key={cat}
                  href={href}
                  size="sm"
                  color={isSelected ? "brand" : "neutral"}
                  variant={isSelected ? "solid" : "outline"}
                >
                  {cat === "ALL" ? "All Photographs" : cat}
                </LinkButton>
              )
            })}
          </div>

          <div
            mix={[
              u.grid(),
              u.gap(5),
              u.media(
                "(min-width: 44rem)",
                u.raw({ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" })
              ),
              u.media(
                "(min-width: 68rem)",
                u.raw({ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" })
              )
            ]}
          >
            {items.map((item) => (
              <figure
                key={item.id}
                mix={[acadCard(), u.vstack({ gap: 0 }), u.m(0), u.overflow("hidden")]}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  mix={[u.width("full"), u.height(52), u.fit("cover"), u.block()]}
                />
                <figcaption mix={[u.vstack({ gap: 1.5, align: "start" }), u.p(4)]}>
                  <Badge color="neutral" variant="outline" mix={[u.self("start")]}>
                    {item.category}
                  </Badge>
                  <h2 mix={[acadSerif(), u.fontSize("sm"), u.weight("bold"), u.m(0)]}>
                    {item.title}
                  </h2>
                  {item.description && (
                    <Text
                      mix={[
                        u.fontSize("xs"),
                        u.leading("normal"),
                        u.fg("var(--acad-muted)"),
                        u.m(0)
                      ]}
                    >
                      {item.description}
                    </Text>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>
        </AcademicSection>

        {/* Campus Video Highlights */}
        <AcademicSection tone="paper">
          <AcademicSectionHeader
            rubric="Campus Recordings"
            title="Classroom &amp; Event Videos"
            description="Glimpses of classroom discipline, model exams, and student felicitation programmes in Puliyangudi."
          />

          <div
            mix={[
              u.grid(),
              u.gap(5),
              u.media(
                "(min-width: 52rem)",
                u.raw({ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" })
              )
            ]}
          >
            {[
              {
                src: "/videos/paart-video-1.mp4",
                title: "Classroom & Aspirant Preparation Highlights"
              },
              {
                src: "/videos/paart-video-2.mp4",
                title: "PAART Community & Student Guidance Events"
              }
            ].map((vid) => (
              <div key={vid.src} mix={[acadCard(), u.vstack({ gap: 0 }), u.overflow("hidden")]}>
                <video
                  controls
                  preload="metadata"
                  src={vid.src}
                  mix={[u.width("full"), u.height(64), u.fit("cover"), u.bg("neutral.solid")]}
                />
                <div mix={[u.p(4)]}>
                  <h3 mix={[acadSerif(), u.fontSize("sm"), u.weight("bold"), u.m(0)]}>
                    {vid.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </AcademicSection>

        <AcademicCalloutBand
          title="Experience Our Study Hall &amp; Classroom Batches in Person"
          description="Visit our Puliyangudi campus Monday through Saturday to tour the library, classrooms, and upcoming batch schedules."
          settings={settings}
        />
      </LandingLayout>
    )
  }
}
