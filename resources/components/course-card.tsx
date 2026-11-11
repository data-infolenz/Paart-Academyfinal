import type { Handle } from "remix/component"
import { ArrowRightIcon, ClockIcon, GraduationCapIcon } from "@sdxc/icons"
import * as u from "@sdxc/u"
import { Badge, Text } from "@sdxc/ui"
import type { CourseItem } from "~/app/models/courses"
import { acadProspectusCard, acadSerif } from "~/resources/components/academic-ui"
import { routes } from "~/routes"

export interface CourseCardProps {
  course: CourseItem
}

export function CourseCard(handle: Handle<CourseCardProps>) {
  return () => {
    const { course } = handle.props

    return (
      <a href={routes.courses.show.href({ slug: course.slug })} mix={[acadProspectusCard()]}>
        <div mix={[u.relative(), u.height(44), u.overflow("hidden"), u.bg("neutral.tint")]}>
          <img
            src={course.image}
            alt={course.title}
            loading="lazy"
            decoding="async"
            mix={[u.width("full"), u.height("full"), u.fit("cover"), u.block()]}
          />
          <div mix={[u.absolute(), u.insTop(3), u.insLeft(3)]}>
            <Badge color="brand" variant="default">
              {course.category}
            </Badge>
          </div>
        </div>

        <div mix={[u.vstack({ gap: 3, align: "stretch" }), u.p(5), u.grow(1)]}>
          <h3
            mix={[
              acadSerif(),
              u.fontSize("lg"),
              u.weight("bold"),
              u.leading("snug"),
              u.fg("var(--acad-ink)"),
              u.m(0)
            ]}
          >
            {course.title}
          </h3>

          <Text
            mix={[
              u.fontSize("sm"),
              u.leading("relaxed"),
              u.fg("var(--acad-muted)"),
              u.m(0),
              u.grow(1)
            ]}
          >
            {course.shortDescription}
          </Text>

          <div
            mix={[
              u.vstack({ gap: 1.5 }),
              u.p(3),
              u.rounded("md"),
              u.bg("var(--acad-paper)"),
              u.border({ width: 1, color: "var(--acad-border)" })
            ]}
          >
            <div mix={[u.hstack({ gap: 2, align: "center" })]}>
              <ClockIcon size={13} mix={[u.fg("var(--acad-primary)"), u.shrink(0)]} />
              <span mix={[u.fontSize("xs"), u.weight("semibold"), u.fg("var(--acad-ink)")]}>
                {course.duration.split("·")[0]?.trim()}
              </span>
            </div>
            <div mix={[u.hstack({ gap: 2, align: "center" })]}>
              <GraduationCapIcon size={13} mix={[u.fg("var(--acad-primary)"), u.shrink(0)]} />
              <span mix={[u.fontSize("xs"), u.fg("var(--acad-muted)")]}>
                Eligibility: {course.eligibility}
              </span>
            </div>
          </div>

          <div
            mix={[
              u.hstack({ gap: 2, align: "center", justify: "between" }),
              u.pbs(2.5),
              u.borderEdge("top", { width: 1, color: "var(--acad-border)" })
            ]}
          >
            <span mix={[u.fontSize("xs"), u.weight("medium"), u.fg("var(--acad-muted)")]}>
              {course.examStages.slice(0, 2).join(" · ")}
            </span>
            <span
              mix={[
                u.hstack({ gap: 1, align: "center" }),
                u.fontSize("xs"),
                u.weight("bold"),
                u.fg("var(--acad-primary)")
              ]}
            >
              <span>Syllabus &amp; Batch</span>
              <ArrowRightIcon size={14} aria-hidden="true" />
            </span>
          </div>
        </div>
      </a>
    )
  }
}
