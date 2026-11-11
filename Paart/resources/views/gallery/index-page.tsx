import type { Handle } from "remix/component"
import * as u from "@sdxc/u"
import { Badge, Heading, HeadingScope, LinkButton, Text } from "@sdxc/ui"
import { LandingHeader, LandingSection } from "@sdxc/ui/landing"
import type { AdminUser } from "~/app/initializers/auth"
import type { GalleryItem } from "~/app/models/gallery"
import type { SiteSettings } from "~/app/models/settings"
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
        <LandingSection variant="frame" ruled>
          <HeadingScope level={1}>
            <LandingHeader
              eyebrow="Campus & Community"
              eyebrowVariant="pill"
              description="Highlights from PAART Academy classroom batches, state-level model exams, physical track coaching, rank felicitations, and community seminars."
            >
              Gallery &amp; Activity Showcase
            </LandingHeader>

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
                    {cat === "ALL" ? "All Photos" : cat}
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
                  mix={[
                    u.vstack({ gap: 0 }),
                    u.m(0),
                    u.rounded("xl"),
                    u.border({ width: 1, color: "neutral" }),
                    u.bg("var(--ui-surface, var(--ui-bg))"),
                    u.overflow("hidden")
                  ]}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    mix={[u.width("full"), u.height(52), u.fit("cover"), u.block()]}
                  />
                  <figcaption mix={[u.vstack({ gap: 1.5 }), u.p(4)]}>
                    <Badge color="neutral" variant="outline">
                      {item.category}
                    </Badge>
                    <Heading level={3} mix={[u.fontSize("sm"), u.weight("semibold"), u.m(0)]}>
                      {item.title}
                    </Heading>
                    {item.description && (
                      <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                        {item.description}
                      </Text>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>
          </HeadingScope>
        </LandingSection>

        {/* Campus Video Highlights */}
        <LandingSection variant="frame" tone="tinted" ruled>
          <HeadingScope level={2}>
            <LandingHeader
              eyebrow="Video Highlights"
              description="Glimpses of classroom discipline and community events at PAART Academy."
            >
              Academy Videos
            </LandingHeader>

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
                <div
                  key={vid.src}
                  mix={[
                    u.vstack({ gap: 0 }),
                    u.rounded("xl"),
                    u.border({ width: 1, color: "neutral" }),
                    u.bg("var(--ui-surface, var(--ui-bg))"),
                    u.overflow("hidden")
                  ]}
                >
                  <video
                    controls
                    preload="metadata"
                    src={vid.src}
                    mix={[u.width("full"), u.height(64), u.fit("cover"), u.bg("neutral.solid")]}
                  />
                  <div mix={[u.p(4)]}>
                    <Text mix={[u.fontSize("sm"), u.weight("semibold"), u.m(0)]}>{vid.title}</Text>
                  </div>
                </div>
              ))}
            </div>
          </HeadingScope>
        </LandingSection>
      </LandingLayout>
    )
  }
}
