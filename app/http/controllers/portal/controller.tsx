import { createController } from "remix/router"
import { requireAspirant } from "~/app/http/middleware/auth"
import { getAspirantPortalSnapshot, listNotificationsForAspirant } from "~/app/models/lms"
import { listMaterialsForAspirant } from "~/app/models/materials"
import { Document } from "~/resources/layouts/document"
import { PortalExamsPage } from "~/resources/views/portal/exams-page"
import { PortalMarksPage } from "~/resources/views/portal/marks-page"
import { PortalMaterialsPage } from "~/resources/views/portal/materials-page"
import { PortalNotificationsPage } from "~/resources/views/portal/notifications-page"
import { PortalOverviewPage } from "~/resources/views/portal/overview-page"
import { PortalProgressPage } from "~/resources/views/portal/progress-page"
import { routes } from "~/routes"

export default createController(routes.portal, {
  actions: {
    async index(ctx) {
      // Strictly scope all portal data to the authenticated aspirant session user ID
      const user = requireAspirant(ctx.request)
      const snapshot = await getAspirantPortalSnapshot(user.id)

      return ctx.render(
        <Document title="Aspirant Portal — PAART Academy" assets={ctx.assets}>
          <PortalOverviewPage user={user} snapshot={snapshot} />
        </Document>
      )
    },

    async progress(ctx) {
      const user = requireAspirant(ctx.request)
      const snapshot = await getAspirantPortalSnapshot(user.id)

      return ctx.render(
        <Document title="Syllabus & Progress — PAART Portal" assets={ctx.assets}>
          <PortalProgressPage user={user} snapshot={snapshot} />
        </Document>
      )
    },

    async exams(ctx) {
      const user = requireAspirant(ctx.request)
      const snapshot = await getAspirantPortalSnapshot(user.id)

      return ctx.render(
        <Document title="Exam Timetable — PAART Portal" assets={ctx.assets}>
          <PortalExamsPage user={user} exams={snapshot.upcomingAndPastExams} />
        </Document>
      )
    },

    async marks(ctx) {
      const user = requireAspirant(ctx.request)
      const snapshot = await getAspirantPortalSnapshot(user.id)

      return ctx.render(
        <Document title="My Marks & Ranks — PAART Portal" assets={ctx.assets}>
          <PortalMarksPage user={user} scorecards={snapshot.scorecards} />
        </Document>
      )
    },

    async materials(ctx) {
      const user = requireAspirant(ctx.request)
      const materials = await listMaterialsForAspirant(user.id)

      return ctx.render(
        <Document title="Study Materials — PAART Portal" assets={ctx.assets}>
          <PortalMaterialsPage user={user} materials={materials} />
        </Document>
      )
    },

    async notifications(ctx) {
      const user = requireAspirant(ctx.request)
      const notifications = await listNotificationsForAspirant(user.id)

      return ctx.render(
        <Document title="Notifications — PAART Portal" assets={ctx.assets}>
          <PortalNotificationsPage user={user} notifications={notifications} />
        </Document>
      )
    }
  }
})
