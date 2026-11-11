import type { AppContext } from "~/app/initializers/router"
import { listActiveCourses } from "~/app/models/courses"
import { listPublishedMaterials } from "~/app/models/materials"
import { getSiteSettings } from "~/app/models/settings"
import { DEPARTMENT_SELECTIONS, TRUST_PROFILE } from "~/config/trust"

export async function llmsAction(ctx: AppContext): Promise<Response> {
  const origin = new URL(ctx.request.url).origin
  const [settings, courses, materials] = await Promise.all([
    getSiteSettings(),
    listActiveCourses(),
    listPublishedMaterials()
  ])

  const lines: string[] = [
    `# ${settings.siteName} (${TRUST_PROFILE.legalName})`,
    "",
    `> ${TRUST_PROFILE.summary}`,
    "",
    "## Official Contact & Campus",
    `- Website: ${origin}`,
    `- Established: ${TRUST_PROFILE.establishedDate}`,
    `- Primary Campus: ${settings.addressPrimary}`,
    `- Secondary Campus: ${settings.addressSecondary}`,
    `- Phone: ${settings.phone} (WhatsApp: https://wa.me/${settings.whatsapp})`,
    `- Email: ${settings.email}`,
    `- Office Hours: ${settings.hours}`,
    "",
    "## Verified Selection Track Record",
    ...DEPARTMENT_SELECTIONS.map((d) => `- ${d.department}: ${d.count} selections`),
    "",
    "## Active Coaching Programmes",
    ...courses.map(
      (c) =>
        `- [${c.title}](${origin}/courses/${c.slug}) (${c.category}, ${c.duration}): ${c.shortDescription}`
    ),
    "",
    "## Free Study Materials",
    ...materials.map((m) => `- ${m.title} (${m.category}): ${m.description}`),
    "",
    "## Key Pages",
    `- [Home](${origin}/)`,
    `- [About PAART Trust](${origin}/about)`,
    `- [Courses Catalog](${origin}/courses)`,
    `- [Study Materials](${origin}/materials)`,
    `- [Campus Gallery](${origin}/gallery)`,
    `- [Preparation Articles](${origin}/blogs)`,
    `- [Frequently Asked Questions](${origin}/faq)`,
    `- [Online Admission Application](${origin}/admissions)`,
    `- [Contact & Counselling](${origin}/contact)`
  ]

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  })
}

export default llmsAction
