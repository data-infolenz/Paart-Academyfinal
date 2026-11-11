import type { Handle } from "remix/component"
import * as u from "@sdxc/u"
import { Badge, Heading, LinkButton, Text } from "@sdxc/ui"
import { PageHeader, StatCard } from "@sdxc/ui/app"
import type { AdminUser } from "~/app/initializers/auth"
import type { AdmissionItem } from "~/app/models/admissions"
import type { EnquiryItem } from "~/app/models/enquiries"
import { AdminLayout } from "~/resources/layouts/admin"
import { routes } from "~/routes"

export interface AdminOverviewPageProps {
  user: AdminUser
  counts: {
    admissions: number
    enquiries: number
    activeCourses: number
    materials: number
    blogs: number
    gallery: number
  }
  recentAdmissions: AdmissionItem[]
  recentEnquiries: EnquiryItem[]
}

export function AdminOverviewPage(handle: Handle<AdminOverviewPageProps>) {
  return () => {
    const { user, counts, recentAdmissions, recentEnquiries } = handle.props

    return (
      <AdminLayout user={user} currentPath={routes.admin.index.href()}>
        <PageHeader
          title="Academy Overview"
          description="Monitor online student registrations, course enquiries, and published academic content."
          primaryAction={
            <LinkButton href={routes.admin.admissions.href()} color="brand" variant="solid">
              View All Admissions
            </LinkButton>
          }
          actions={
            <LinkButton href={routes.admin.courses.href()} color="neutral" variant="outline">
              Manage Courses
            </LinkButton>
          }
        />

        <StatCard.Group columns={3}>
          <StatCard href={routes.admin.admissions.href()}>
            <StatCard.Label>Student Admissions</StatCard.Label>
            <StatCard.Value>{counts.admissions}</StatCard.Value>
            <StatCard.Footer>Online registration forms received</StatCard.Footer>
          </StatCard>

          <StatCard href={routes.admin.enquiries.href()}>
            <StatCard.Label>Course Enquiries</StatCard.Label>
            <StatCard.Value>{counts.enquiries}</StatCard.Value>
            <StatCard.Footer>Callback &amp; guidance requests</StatCard.Footer>
          </StatCard>

          <StatCard href={routes.admin.courses.href()}>
            <StatCard.Label>Active Courses</StatCard.Label>
            <StatCard.Value>{counts.activeCourses}</StatCard.Value>
            <StatCard.Footer>Published exam coaching tracks</StatCard.Footer>
          </StatCard>

          <StatCard href={routes.admin.materials.href()}>
            <StatCard.Label>Study Materials</StatCard.Label>
            <StatCard.Value>{counts.materials}</StatCard.Value>
            <StatCard.Footer>Free student downloads &amp; PDFs</StatCard.Footer>
          </StatCard>

          <StatCard href={routes.admin.blogs.href()}>
            <StatCard.Label>Published Articles</StatCard.Label>
            <StatCard.Value>{counts.blogs}</StatCard.Value>
            <StatCard.Footer>Exam strategy &amp; syllabus guides</StatCard.Footer>
          </StatCard>

          <StatCard href={routes.admin.gallery.href()}>
            <StatCard.Label>Gallery Highlights</StatCard.Label>
            <StatCard.Value>{counts.gallery}</StatCard.Value>
            <StatCard.Footer>Campus, test hall &amp; rank photos</StatCard.Footer>
          </StatCard>
        </StatCard.Group>

        <div
          mix={[
            u.grid(),
            u.gap(5),
            u.media(
              "(min-width: 56rem)",
              u.raw({ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" })
            )
          ]}
        >
          {/* Recent Admissions */}
          <section
            mix={[
              u.vstack({ gap: 3 }),
              u.p(5),
              u.rounded("xl"),
              u.border({ width: 1, color: "neutral" }),
              u.bg("var(--ui-surface, var(--ui-bg))")
            ]}
          >
            <div mix={[u.hstack({ justify: "between", align: "center" })]}>
              <Heading level={2} mix={[u.fontSize("md"), u.weight("semibold"), u.m(0)]}>
                Recent Student Admissions
              </Heading>
              <LinkButton href={routes.admin.admissions.href()} variant="ghost" size="sm">
                View all
              </LinkButton>
            </div>

            {recentAdmissions.length === 0 ? (
              <Text mix={[u.fontSize("sm"), u.fg("neutral.muted"), u.m(0)]}>
                No online admission applications recorded yet.
              </Text>
            ) : (
              <div mix={[u.vstack({ gap: 2.5 })]}>
                {recentAdmissions.map((adm) => (
                  <div
                    key={adm.id}
                    mix={[
                      u.hstack({ justify: "between", align: "center", gap: 3 }),
                      u.p(3),
                      u.rounded("lg"),
                      u.border({ width: 1, color: "neutral" })
                    ]}
                  >
                    <div mix={[u.vstack({ gap: 0.5 }), u.minWidth(0)]}>
                      <Text mix={[u.fontSize("sm"), u.weight("semibold"), u.m(0)]}>
                        {adm.studentName} ({adm.applicationId})
                      </Text>
                      <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                        {adm.courseInterested} · {adm.mobile}
                      </Text>
                    </div>
                    <Badge color="brand" variant="secondary">
                      {adm.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recent Enquiries */}
          <section
            mix={[
              u.vstack({ gap: 3 }),
              u.p(5),
              u.rounded("xl"),
              u.border({ width: 1, color: "neutral" }),
              u.bg("var(--ui-surface, var(--ui-bg))")
            ]}
          >
            <div mix={[u.hstack({ justify: "between", align: "center" })]}>
              <Heading level={2} mix={[u.fontSize("md"), u.weight("semibold"), u.m(0)]}>
                Recent Course Enquiries
              </Heading>
              <LinkButton href={routes.admin.enquiries.href()} variant="ghost" size="sm">
                View all
              </LinkButton>
            </div>

            {recentEnquiries.length === 0 ? (
              <Text mix={[u.fontSize("sm"), u.fg("neutral.muted"), u.m(0)]}>
                No course enquiries recorded yet.
              </Text>
            ) : (
              <div mix={[u.vstack({ gap: 2.5 })]}>
                {recentEnquiries.map((enq) => (
                  <div
                    key={enq.id}
                    mix={[
                      u.hstack({ justify: "between", align: "center", gap: 3 }),
                      u.p(3),
                      u.rounded("lg"),
                      u.border({ width: 1, color: "neutral" })
                    ]}
                  >
                    <div mix={[u.vstack({ gap: 0.5 }), u.minWidth(0)]}>
                      <Text mix={[u.fontSize("sm"), u.weight("semibold"), u.m(0)]}>{enq.name}</Text>
                      <Text mix={[u.fontSize("xs"), u.fg("neutral.muted"), u.m(0)]}>
                        {enq.courseInterested} · {enq.phone}
                      </Text>
                    </div>
                    <Badge color="neutral" variant="outline">
                      {enq.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </AdminLayout>
    )
  }
}
