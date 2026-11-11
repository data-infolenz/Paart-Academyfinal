import type { Handle } from "remix/component"
import { ArrowRightIcon, ClockIcon } from "@sdxc/icons"
import * as u from "@sdxc/u"
import { Badge, Heading, Link, Text } from "@sdxc/ui"
import type { CourseItem } from "~/app/models/courses"
import { routes } from "~/routes"

export interface CourseCardProps {
  course: CourseItem
}

export function CourseCard(handle: Handle<CourseCardProps>) {
  return () => {
    const { course } = handle.props

    return (
      <Link
        href={routes.courses.show.href({ slug: course.slug })}
        mix={[
          u.vstack({ gap: 0, align: "stretch" }),
          u.rounded("xl"),
          u.border({ width: 1, color: "neutral" }),
          u.bg("var(--ui-surface, var(--ui-bg))"),
          u.overflow("hidden"),
          u.textDecoration("none"),
          u.fg("inherit"),
          u.transition("border-color, box-shadow"),
          u.hover([u.border({ color: "brand" }), u.shadow("md")])
        ]}
      >
        <div mix={[u.relative(), u.height(44), u.overflow("hidden"), u.bg("neutral.tint")]}>
          <img
            src={course.image}
            alt={course.title}
            loading="lazy"
            decoding="async"
            mix={[u.width("full"), u.height("full"), u.fit("cover")]}
          />
          <div mix={[u.absolute(), u.insTop(3), u.insLeft(3)]}>
            <Badge color="brand" variant="default">
              {course.category}
            </Badge>
          </div>
        </div>

        <div mix={[u.vstack({ gap: 3, align: "stretch" }), u.p(5), u.grow(1)]}>
          <Heading level={3} mix={[u.fontSize("lg"), u.weight("semibold"), u.m(0)]}>
            {course.title}
          </Heading>

          <Text mix={[u.fontSize("sm"), u.fg("neutral.muted"), u.m(0), u.grow(1)]}>
            {course.shortDescription}
          </Text>

          {course.features.length > 0 && (
            <div mix={[u.hstack({ gap: 1.5 }), u.flexWrap("wrap")]}>
              {course.features.slice(0, 3).map((feat) => (
                <Badge key={feat} color="neutral" variant="outline">
                  {feat}
                </Badge>
              ))}
            </div>
          )}

          <div
            mix={[
              u.hstack({ gap: 2, align: "center", justify: "between" }),
              u.pbs(3),
              u.borderEdge("top", { width: 1 }),
              u.border({ color: "neutral" })
            ]}
          >
            <div mix={[u.hstack({ gap: 1.5, align: "center" }), u.fg("neutral.muted")]}>
              <ClockIcon size={14} aria-hidden="true" />
              <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                {course.duration.split("·")[0]?.trim()}
              </Text>
            </div>
            <span
              mix={[
                u.hstack({ gap: 1, align: "center" }),
                u.fontSize("xs"),
                u.weight("semibold"),
                u.fg("brand")
              ]}
            >
              <span>Syllabus & Details</span>
              <ArrowRightIcon size={14} aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
    )
  }
}
