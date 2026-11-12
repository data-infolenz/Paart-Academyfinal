import * as s from "remix/data-schema"
import { redirect } from "remix/response/redirect"
import { createController } from "remix/router"
import { requireFacultyOrAdmin } from "~/app/http/middleware/auth"
import { createMaterialSchema, formDataToObject } from "~/app/http/validators"
import { listAllCourses } from "~/app/models/courses"
import {
  createExam,
  createNotification,
  createSyllabusTopic,
  exportExamMarksTemplateCsv,
  getBatchSyllabusView,
  getExamMarksSheet,
  importExamMarksCsv,
  LmsValidationError,
  listAllNotifications,
  listBatches,
  listExams,
  type MarksEntryInputRow,
  publishExamResults,
  saveExamMarks,
  updateSyllabusTopicStatus
} from "~/app/models/lms"
import { createMaterial, deleteMaterial, listAllMaterials } from "~/app/models/materials"
import type { AttendanceStatus, MaterialVisibility, SyllabusTopicStatus } from "~/database/schema"
import { Document } from "~/resources/layouts/document"
import { FacultyExamMarksPage } from "~/resources/views/faculty/exam-marks-page"
import { FacultyExamsPage } from "~/resources/views/faculty/exams-page"
import { FacultyMaterialsPage } from "~/resources/views/faculty/materials-page"
import { FacultyNotificationsPage } from "~/resources/views/faculty/notifications-page"
import { FacultyOverviewPage } from "~/resources/views/faculty/overview-page"
import { FacultySyllabusPage } from "~/resources/views/faculty/syllabus-page"
import { routes } from "~/routes"

function formString(form: FormData, key: string, fallback = ""): string {
  const value = form.get(key)
  return typeof value === "string" ? value : fallback
}

export default createController(routes.faculty, {
  actions: {
    async index(ctx) {
      const user = requireFacultyOrAdmin(ctx.request)
      const [batches, exams, materials, notifications] = await Promise.all([
        listBatches(),
        listExams(),
        listAllMaterials(),
        listAllNotifications()
      ])

      return ctx.render(
        <Document title="Faculty Workspace — PAART Academy" assets={ctx.assets}>
          <FacultyOverviewPage
            user={user}
            batches={batches}
            recentExams={exams}
            materialsCount={materials.length}
            notificationsCount={notifications.length}
          />
        </Document>
      )
    },

    async batchSyllabus(ctx) {
      const user = requireFacultyOrAdmin(ctx.request)
      const url = new URL(ctx.request.url)
      const notice = url.searchParams.get("notice")
      const error = url.searchParams.get("error")

      try {
        const { batch, topics } = await getBatchSyllabusView(ctx.params.id)
        return ctx.render(
          <Document title={`${batch.code} Syllabus — PAART Faculty`} assets={ctx.assets}>
            <FacultySyllabusPage
              user={user}
              batch={batch}
              topics={topics}
              notice={notice}
              error={error}
            />
          </Document>
        )
      } catch (err) {
        if (err instanceof LmsValidationError && err.statusCode === 404) {
          return new Response("Batch not found.", { status: 404 })
        }
        throw err
      }
    },

    async batchSyllabusCreate(ctx) {
      const user = requireFacultyOrAdmin(ctx.request)
      const form = ctx.formData ?? (await ctx.request.formData())
      const unitLabel = formString(form, "unitLabel")
      const title = formString(form, "title")
      const status = formString(form, "status", "pending") as SyllabusTopicStatus

      try {
        await createSyllabusTopic({
          batchId: ctx.params.id,
          unitLabel,
          title,
          status,
          actorUserId: user.id
        })
        const notice = encodeURIComponent("Syllabus topic added.")
        return redirect(
          `${routes.faculty.batchSyllabus.href({ id: ctx.params.id })}?notice=${notice}`,
          303
        )
      } catch (err) {
        const msg = encodeURIComponent(
          err instanceof LmsValidationError ? err.message : "Failed to add syllabus topic."
        )
        return redirect(
          `${routes.faculty.batchSyllabus.href({ id: ctx.params.id })}?error=${msg}`,
          303
        )
      }
    },

    async batchSyllabusStatus(ctx) {
      const user = requireFacultyOrAdmin(ctx.request)
      const form = ctx.formData ?? (await ctx.request.formData())
      const status = formString(form, "status") as SyllabusTopicStatus

      try {
        await updateSyllabusTopicStatus({
          batchId: ctx.params.id,
          topicId: ctx.params.topicId,
          status,
          actorUserId: user.id
        })
        const notice = encodeURIComponent("Syllabus topic completion updated.")
        return redirect(
          `${routes.faculty.batchSyllabus.href({ id: ctx.params.id })}?notice=${notice}`,
          303
        )
      } catch (err) {
        const msg = encodeURIComponent(
          err instanceof LmsValidationError ? err.message : "Failed to update topic status."
        )
        return redirect(
          `${routes.faculty.batchSyllabus.href({ id: ctx.params.id })}?error=${msg}`,
          303
        )
      }
    },

    async exams(ctx) {
      const user = requireFacultyOrAdmin(ctx.request)
      const url = new URL(ctx.request.url)
      const notice = url.searchParams.get("notice")
      const error = url.searchParams.get("error")
      const [exams, batches] = await Promise.all([listExams(), listBatches()])

      return ctx.render(
        <Document title="Exams & Scorecards — PAART Faculty" assets={ctx.assets}>
          <FacultyExamsPage
            user={user}
            exams={exams}
            batches={batches}
            notice={notice}
            error={error}
          />
        </Document>
      )
    },

    async examCreate(ctx) {
      const user = requireFacultyOrAdmin(ctx.request)
      const form = ctx.formData ?? (await ctx.request.formData())
      const batchId = formString(form, "batchId")
      const title = formString(form, "title")
      const examType = formString(form, "examType", "weekly_mock")
      const examDate = formString(form, "examDate")
      const syllabusNotes = formString(form, "syllabusNotes")
      const maxMarks = Number(formString(form, "maxMarks"))
      const qualifyingMarks = Number(formString(form, "qualifyingMarks"))

      try {
        const exam = await createExam({
          batchId,
          title,
          examType,
          examDate,
          syllabusNotes,
          maxMarks,
          qualifyingMarks,
          actorUserId: user.id
        })
        const notice = encodeURIComponent(`Scheduled "${exam.title}" for ${exam.batchCode}.`)
        return redirect(`${routes.faculty.exams.href()}?notice=${notice}`, 303)
      } catch (err) {
        if (err instanceof LmsValidationError) {
          const [exams, batches] = await Promise.all([listExams(), listBatches()])
          return ctx.render(
            <Document title="Exams & Scorecards — PAART Faculty" assets={ctx.assets}>
              <FacultyExamsPage user={user} exams={exams} batches={batches} error={err.message} />
            </Document>,
            { status: err.statusCode }
          )
        }
        throw err
      }
    },

    async examMarks(ctx) {
      const user = requireFacultyOrAdmin(ctx.request)
      const url = new URL(ctx.request.url)
      const notice = url.searchParams.get("notice")
      const error = url.searchParams.get("error")

      try {
        const { exam, entries } = await getExamMarksSheet(ctx.params.id)
        return ctx.render(
          <Document title={`${exam.title} Marks — PAART Faculty`} assets={ctx.assets}>
            <FacultyExamMarksPage
              user={user}
              exam={exam}
              entries={entries}
              notice={notice}
              error={error}
            />
          </Document>
        )
      } catch (err) {
        if (err instanceof LmsValidationError && err.statusCode === 404) {
          return new Response("Exam not found.", { status: 404 })
        }
        throw err
      }
    },

    async examMarksSave(ctx) {
      const user = requireFacultyOrAdmin(ctx.request)
      const form = ctx.formData ?? (await ctx.request.formData())
      const rowCount = Number.parseInt(formString(form, "rowCount", "0"), 10)

      const rows: MarksEntryInputRow[] = []
      if (Number.isFinite(rowCount) && rowCount > 0) {
        for (let i = 0; i < rowCount; i++) {
          const aspirantId = formString(form, `aspirantId_${i}`).trim()
          if (!aspirantId) continue
          const attendance = (formString(form, `attendance_${i}`, "present").trim() ||
            "present") as AttendanceStatus
          const marksObtained = Number(formString(form, `marks_${i}`, "0"))
          const remarks = formString(form, `remarks_${i}`)
          rows.push({ aspirantId, attendance, marksObtained, remarks })
        }
      }

      try {
        await saveExamMarks({
          examId: ctx.params.id,
          rows,
          actorUserId: user.id
        })
        const notice = encodeURIComponent("Saved aspirant marks and remarks.")
        return redirect(
          `${routes.faculty.examMarks.href({ id: ctx.params.id })}?notice=${notice}`,
          303
        )
      } catch (err) {
        if (err instanceof LmsValidationError) {
          const { exam, entries } = await getExamMarksSheet(ctx.params.id)
          return ctx.render(
            <Document title={`${exam.title} Marks — PAART Faculty`} assets={ctx.assets}>
              <FacultyExamMarksPage user={user} exam={exam} entries={entries} error={err.message} />
            </Document>,
            { status: err.statusCode }
          )
        }
        throw err
      }
    },

    async examMarksTemplate(ctx) {
      requireFacultyOrAdmin(ctx.request)
      try {
        const { filename, csv } = await exportExamMarksTemplateCsv(ctx.params.id)
        return new Response(csv, {
          status: 200,
          headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Cache-Control": "no-store"
          }
        })
      } catch (err) {
        if (err instanceof LmsValidationError && err.statusCode === 404) {
          return new Response("Exam not found.", { status: 404 })
        }
        throw err
      }
    },

    async examMarksImport(ctx) {
      const user = requireFacultyOrAdmin(ctx.request)
      const form = ctx.formData ?? (await ctx.request.formData())

      let csvText = ""
      const fileEntry = form.get("csvFile")
      if (fileEntry instanceof File && fileEntry.size > 0) {
        csvText = await fileEntry.text()
      } else {
        const pasted = form.get("csvText")
        if (typeof pasted === "string") {
          csvText = pasted
        }
      }

      try {
        const { importedCount } = await importExamMarksCsv({
          examId: ctx.params.id,
          csvText,
          actorUserId: user.id
        })
        const notice = encodeURIComponent(
          `Validated and imported ${importedCount} aspirant rows from CSV.`
        )
        return redirect(
          `${routes.faculty.examMarks.href({ id: ctx.params.id })}?notice=${notice}`,
          303
        )
      } catch (err) {
        if (err instanceof LmsValidationError) {
          const { exam, entries } = await getExamMarksSheet(ctx.params.id)
          return ctx.render(
            <Document title={`${exam.title} Marks — PAART Faculty`} assets={ctx.assets}>
              <FacultyExamMarksPage user={user} exam={exam} entries={entries} error={err.message} />
            </Document>,
            { status: err.statusCode }
          )
        }
        throw err
      }
    },

    async examPublish(ctx) {
      const user = requireFacultyOrAdmin(ctx.request)
      try {
        await publishExamResults({
          examId: ctx.params.id,
          actorUserId: user.id
        })
        const notice = encodeURIComponent(
          "Published exam results and computed batch ranks. Scorecards are now live in Aspirant Portals."
        )
        return redirect(
          `${routes.faculty.examMarks.href({ id: ctx.params.id })}?notice=${notice}`,
          303
        )
      } catch (err) {
        const msg = encodeURIComponent(
          err instanceof LmsValidationError ? err.message : "Failed to publish exam results."
        )
        return redirect(`${routes.faculty.examMarks.href({ id: ctx.params.id })}?error=${msg}`, 303)
      }
    },

    async materials(ctx) {
      const user = requireFacultyOrAdmin(ctx.request)
      const url = new URL(ctx.request.url)
      const notice = url.searchParams.get("notice")
      const error = url.searchParams.get("error")
      const [materials, courses] = await Promise.all([listAllMaterials(), listAllCourses()])

      return ctx.render(
        <Document title="Study Materials — PAART Faculty" assets={ctx.assets}>
          <FacultyMaterialsPage
            user={user}
            materials={materials}
            courses={courses}
            notice={notice}
            error={error}
          />
        </Document>
      )
    },

    async materialCreate(ctx) {
      const user = requireFacultyOrAdmin(ctx.request)
      const form = ctx.formData ?? (await ctx.request.formData())
      const parsed = s.parseSafe(createMaterialSchema, formDataToObject(form))
      if (!parsed.success) {
        const msg = encodeURIComponent(
          parsed.issues[0]?.message || "Invalid study material fields."
        )
        return redirect(`${routes.faculty.materials.href()}?error=${msg}`, 303)
      }

      const visibility: MaterialVisibility =
        parsed.value.visibility === "enrolled" ? "enrolled" : "public"

      await createMaterial({
        title: parsed.value.title,
        category: parsed.value.category,
        description: parsed.value.description,
        fileUrl: parsed.value.fileUrl,
        externalUrl: parsed.value.externalUrl,
        courseId: parsed.value.courseId || null,
        visibility,
        uploadedBy: user.id
      })

      const notice = encodeURIComponent("Published study material.")
      return redirect(`${routes.faculty.materials.href()}?notice=${notice}`, 303)
    },

    async materialDelete(ctx) {
      requireFacultyOrAdmin(ctx.request)
      await deleteMaterial(ctx.params.id)
      return redirect(routes.faculty.materials.href(), 303)
    },

    async notifications(ctx) {
      const user = requireFacultyOrAdmin(ctx.request)
      const url = new URL(ctx.request.url)
      const notice = url.searchParams.get("notice")
      const error = url.searchParams.get("error")
      const [notifications, courses, batches] = await Promise.all([
        listAllNotifications(),
        listAllCourses(),
        listBatches()
      ])

      return ctx.render(
        <Document title="Academic Notifications — PAART Faculty" assets={ctx.assets}>
          <FacultyNotificationsPage
            user={user}
            notifications={notifications}
            courses={courses}
            batches={batches}
            notice={notice}
            error={error}
          />
        </Document>
      )
    },

    async notificationCreate(ctx) {
      const user = requireFacultyOrAdmin(ctx.request)
      const form = ctx.formData ?? (await ctx.request.formData())
      const title = formString(form, "title")
      const body = formString(form, "body")
      const category = formString(form, "category", "general")
      const targetScope = formString(form, "targetScope", "all")
      const targetCourseId = formString(form, "targetCourseId") || null
      const targetBatchId = formString(form, "targetBatchId") || null

      try {
        await createNotification({
          title,
          body,
          category,
          targetScope,
          targetCourseId,
          targetBatchId,
          actorUserId: user.id
        })
        const notice = encodeURIComponent("Published notification.")
        return redirect(`${routes.faculty.notifications.href()}?notice=${notice}`, 303)
      } catch (err) {
        if (err instanceof LmsValidationError) {
          const [notifications, courses, batches] = await Promise.all([
            listAllNotifications(),
            listAllCourses(),
            listBatches()
          ])
          return ctx.render(
            <Document title="Academic Notifications — PAART Faculty" assets={ctx.assets}>
              <FacultyNotificationsPage
                user={user}
                notifications={notifications}
                courses={courses}
                batches={batches}
                error={err.message}
              />
            </Document>,
            { status: err.statusCode }
          )
        }
        throw err
      }
    }
  }
})
