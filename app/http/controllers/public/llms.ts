import type { AppContext } from "~/app/initializers/router"
import { getSiteChrome, listPublishedIndexablePages } from "~/app/models/cms"
import { listActiveCourses } from "~/app/models/courses"
import { listPublishedMaterials } from "~/app/models/materials"
import { DEPARTMENT_SELECTIONS } from "~/config/trust"

export async function llmsAction(ctx: AppContext): Promise<Response> {
  const origin = new URL(ctx.request.url).origin
  const [{ chrome }, courses, materials, indexablePages] = await Promise.all([
    getSiteChrome(),
    listActiveCourses(),
    listPublishedMaterials(),
    listPublishedIndexablePages()
  ])
  const trust = chrome.trustProfile

  const lines: string[] = [
    `# ${trust.shortName} (${trust.legalName})`,
    "",
    `> ${trust.summary}`,
    "",
    "## Official Contact & Campus",
    `- Website: ${origin}`,
    `- Established: ${trust.establishedDate}`,
    `- Primary Campus: ${trust.addressPrimary}`,
    `- Secondary Campus: ${trust.addressSecondary}`,
    `- Phone: ${trust.phone} (WhatsApp: https://wa.me/${trust.whatsapp})`,
    `- Email: ${trust.email}`,
    `- Office Hours: ${trust.hours}`,
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
    "## Published Pages",
    ...indexablePages.map(
      (p) =>
        `- [${p.title}](${origin}${p.slug})${p.seo.description ? `: ${p.seo.description}` : ""}`
    )
  ]

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  })
}

export default llmsAction
