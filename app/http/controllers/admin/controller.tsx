import * as s from "remix/data-schema"
import { redirect } from "remix/response/redirect"
import { createController } from "remix/router"
import { requireAdmin } from "~/app/http/middleware/auth"
import {
  createBatchSchema,
  createBlogSchema,
  createCourseSchema,
  createGallerySchema,
  createMaterialSchema,
  formDataToObject,
  provisionAdmissionSchema,
  provisionUserSchema,
  slugify,
  updateSettingsSchema
} from "~/app/http/validators"
import { listAdmissions, updateAdmissionStatus } from "~/app/models/admissions"
import { createBlog, deleteBlog, listAllBlogs, toggleBlogPublished } from "~/app/models/blogs"
import {
  createCourse,
  deleteCourse,
  listAllCourses,
  toggleCourseEnabled
} from "~/app/models/courses"
import { listEnquiries, updateEnquiryStatus } from "~/app/models/enquiries"
import { createGalleryItem, deleteGalleryItem, listGalleryItems } from "~/app/models/gallery"
import { createBatch, LmsValidationError, listBatches, toggleBatchActive } from "~/app/models/lms"
import { createMaterial, deleteMaterial, listAllMaterials } from "~/app/models/materials"
import { getSiteSettings, upsertSiteSettings } from "~/app/models/settings"
import {
  listActiveFacultyUsers,
  listManagedUsers,
  ProvisioningValidationError,
  provisionAdmissionApplicant,
  provisionUserAccount,
  resendUserCredentials,
  updateUserAccountStatus
} from "~/app/models/users"
import { COURSE_CATEGORIES, type CourseCategory } from "~/config/courses"
import {
  ADMISSION_STATUSES,
  type AdmissionStatus,
  ENQUIRY_STATUSES,
  type EnquiryStatus,
  type MaterialVisibility,
  USER_STATUSES,
  type UserStatus
} from "~/database/schema"
import { Document } from "~/resources/layouts/document"
import { AdminAdmissionsPage } from "~/resources/views/admin/admissions-page"
import { AdminBatchesPage } from "~/resources/views/admin/batches-page"
import { AdminBlogsPage } from "~/resources/views/admin/blogs-page"
import { AdminCoursesPage } from "~/resources/views/admin/courses-page"
import { AdminEnquiriesPage } from "~/resources/views/admin/enquiries-page"
import { AdminGalleryPage } from "~/resources/views/admin/gallery-page"
import { AdminMaterialsPage } from "~/resources/views/admin/materials-page"
import { AdminOverviewPage } from "~/resources/views/admin/overview-page"
import { AdminSettingsPage } from "~/resources/views/admin/settings-page"
import { AdminUsersPage } from "~/resources/views/admin/users-page"
import { routes } from "~/routes"

export default createController(routes.admin, {
  actions: {
    async index(ctx) {
      const user = requireAdmin(ctx.request)
      const [admissions, enquiries, courses, materials, blogs, gallery] = await Promise.all([
        listAdmissions(),
        listEnquiries(),
        listAllCourses(),
        listAllMaterials(),
        listAllBlogs(),
        listGalleryItems()
      ])

      return ctx.render(
        <Document title="Overview — PAART Admin Console" assets={ctx.assets}>
          <AdminOverviewPage
            user={user}
            counts={{
              admissions: admissions.length,
              enquiries: enquiries.length,
              activeCourses: courses.filter((c) => c.enabled).length,
              materials: materials.length,
              blogs: blogs.filter((b) => b.published).length,
              gallery: gallery.length
            }}
            recentAdmissions={admissions.slice(0, 5)}
            recentEnquiries={enquiries.slice(0, 5)}
          />
        </Document>
      )
    },

    async users(ctx) {
      const user = requireAdmin(ctx.request)
      const url = new URL(ctx.request.url)
      const notice = url.searchParams.get("notice")
      const warning = url.searchParams.get("warning")
      const error = url.searchParams.get("error")
      const [managedUsers, batches] = await Promise.all([listManagedUsers(), listBatches()])

      return ctx.render(
        <Document title="Users & Access — PAART Admin Console" assets={ctx.assets}>
          <AdminUsersPage
            user={user}
            users={managedUsers}
            batches={batches}
            notice={notice}
            warning={warning}
            error={error}
          />
        </Document>
      )
    },

    async userCreate(ctx) {
      const admin = requireAdmin(ctx.request)
      const form = ctx.formData ?? (await ctx.request.formData())
      const parsed = s.parseSafe(provisionUserSchema, formDataToObject(form))

      const renderError = async (message: string, statusCode = 422) => {
        const [managedUsers, batches] = await Promise.all([listManagedUsers(), listBatches()])
        return ctx.render(
          <Document title="Users & Access — PAART Admin Console" assets={ctx.assets}>
            <AdminUsersPage user={admin} users={managedUsers} batches={batches} error={message} />
          </Document>,
          { status: statusCode }
        )
      }

      if (!parsed.success) {
        return renderError(parsed.issues[0]?.message || "Invalid account provisioning fields.", 422)
      }

      if (parsed.value.role !== "faculty" && parsed.value.role !== "aspirant") {
        return renderError("Role must be either faculty or aspirant.", 422)
      }

      const origin = new URL(ctx.request.url).origin

      try {
        const created = await provisionUserAccount({
          role: parsed.value.role,
          email: parsed.value.email,
          fullName: parsed.value.fullName,
          phone: parsed.value.phone,
          department: parsed.value.department,
          batchId: parsed.value.batchId,
          origin
        })

        if (!created.emailDelivered && created.emailError) {
          const warn = encodeURIComponent(
            `Account created for ${created.user.email}, but SMTP email delivery failed. Use 'Reset & Resend Credentials' to retry.`
          )
          return redirect(`${routes.admin.users.href()}?warning=${warn}`, 303)
        }

        const msg = encodeURIComponent(
          `Provisioned ${created.user.role} account for ${created.user.email} and dispatched welcome credentials.`
        )
        return redirect(`${routes.admin.users.href()}?notice=${msg}`, 303)
      } catch (err) {
        if (err instanceof ProvisioningValidationError) {
          return renderError(err.message, err.statusCode)
        }
        return renderError("Unable to provision user account right now.", 500)
      }
    },

    async userResendCredentials(ctx) {
      requireAdmin(ctx.request)
      const origin = new URL(ctx.request.url).origin

      try {
        const res = await resendUserCredentials({
          userId: ctx.params.id,
          origin
        })

        if (!res.emailDelivered && res.emailError) {
          const warn = encodeURIComponent(
            `Temporary password rotated for ${res.user.email}, but SMTP delivery failed.`
          )
          return redirect(`${routes.admin.users.href()}?warning=${warn}`, 303)
        }

        const msg = encodeURIComponent(
          `Rotated temporary password, revoked active sessions, and sent credentials to ${res.user.email}.`
        )
        return redirect(`${routes.admin.users.href()}?notice=${msg}`, 303)
      } catch (err) {
        const msg = encodeURIComponent(
          err instanceof ProvisioningValidationError
            ? err.message
            : "Failed to reset user credentials."
        )
        return redirect(`${routes.admin.users.href()}?error=${msg}`, 303)
      }
    },

    async userStatus(ctx) {
      const admin = requireAdmin(ctx.request)
      const form = ctx.formData ?? (await ctx.request.formData())
      const rawStatus = form.get("status")
      const nextStatus = typeof rawStatus === "string" ? rawStatus.trim() : ""

      if (!USER_STATUSES.includes(nextStatus as UserStatus)) {
        return new Response("Invalid user status.", { status: 422 })
      }

      try {
        const updated = await updateUserAccountStatus({
          actorAdminId: admin.id,
          targetUserId: ctx.params.id,
          nextStatus: nextStatus as UserStatus
        })
        const msg = encodeURIComponent(
          `Updated ${updated.email} account status to ${updated.status}.`
        )
        return redirect(`${routes.admin.users.href()}?notice=${msg}`, 303)
      } catch (err) {
        if (err instanceof ProvisioningValidationError) {
          const [managedUsers, batches] = await Promise.all([listManagedUsers(), listBatches()])
          return ctx.render(
            <Document title="Users & Access — PAART Admin Console" assets={ctx.assets}>
              <AdminUsersPage
                user={admin}
                users={managedUsers}
                batches={batches}
                error={err.message}
              />
            </Document>,
            { status: err.statusCode }
          )
        }
        return new Response("Unable to update user status.", { status: 500 })
      }
    },

    async batches(ctx) {
      const user = requireAdmin(ctx.request)
      const url = new URL(ctx.request.url)
      const notice = url.searchParams.get("notice")
      const error = url.searchParams.get("error")
      const [batches, courses, facultyList] = await Promise.all([
        listBatches(),
        listAllCourses(),
        listActiveFacultyUsers()
      ])

      return ctx.render(
        <Document title="Academic Batches — PAART Admin Console" assets={ctx.assets}>
          <AdminBatchesPage
            user={user}
            batches={batches}
            courses={courses}
            facultyList={facultyList}
            notice={notice}
            error={error}
          />
        </Document>
      )
    },

    async batchCreate(ctx) {
      requireAdmin(ctx.request)
      const form = ctx.formData ?? (await ctx.request.formData())
      const parsed = s.parseSafe(createBatchSchema, formDataToObject(form))
      if (!parsed.success) {
        const msg = encodeURIComponent(parsed.issues[0]?.message || "Invalid batch details.")
        return redirect(`${routes.admin.batches.href()}?error=${msg}`, 303)
      }

      try {
        const batch = await createBatch(parsed.value)
        const notice = encodeURIComponent(`Created batch ${batch.name} (${batch.code}).`)
        return redirect(`${routes.admin.batches.href()}?notice=${notice}`, 303)
      } catch (err) {
        const msg = encodeURIComponent(
          err instanceof LmsValidationError ? err.message : "Failed to create batch."
        )
        return redirect(`${routes.admin.batches.href()}?error=${msg}`, 303)
      }
    },

    async batchToggle(ctx) {
      requireAdmin(ctx.request)
      try {
        await toggleBatchActive(ctx.params.id)
      } catch {
        // ignore if missing
      }
      return redirect(routes.admin.batches.href(), 303)
    },

    async admissions(ctx) {
      const user = requireAdmin(ctx.request)
      const url = new URL(ctx.request.url)
      const notice = url.searchParams.get("notice")
      const warning = url.searchParams.get("warning")
      const error = url.searchParams.get("error")
      const [admissions, batches] = await Promise.all([listAdmissions(), listBatches()])

      return ctx.render(
        <Document title="Student Admissions — PAART Admin Console" assets={ctx.assets}>
          <AdminAdmissionsPage
            user={user}
            admissions={admissions}
            batches={batches}
            notice={notice}
            warning={warning}
            error={error}
          />
        </Document>
      )
    },

    async admissionStatus(ctx) {
      requireAdmin(ctx.request)
      const form = ctx.formData ?? (await ctx.request.formData())
      const statusEntry = form.get("status")
      const status = typeof statusEntry === "string" ? statusEntry : ""
      if (ADMISSION_STATUSES.includes(status as AdmissionStatus)) {
        try {
          await updateAdmissionStatus(ctx.params.id, status as AdmissionStatus)
        } catch {
          // ignore if DB offline
        }
      }
      return redirect(routes.admin.admissions.href(), 303)
    },

    async admissionProvision(ctx) {
      const admin = requireAdmin(ctx.request)
      const form = ctx.formData ?? (await ctx.request.formData())
      const parsed = s.parseSafe(provisionAdmissionSchema, formDataToObject(form))

      const renderError = async (message: string, statusCode = 422) => {
        const [admissions, batches] = await Promise.all([listAdmissions(), listBatches()])
        return ctx.render(
          <Document title="Student Admissions — PAART Admin Console" assets={ctx.assets}>
            <AdminAdmissionsPage
              user={admin}
              admissions={admissions}
              batches={batches}
              error={message}
            />
          </Document>,
          { status: statusCode }
        )
      }

      if (!parsed.success) {
        return renderError(
          parsed.issues[0]?.message || "Invalid admission provisioning details.",
          422
        )
      }

      const origin = new URL(ctx.request.url).origin

      try {
        const result = await provisionAdmissionApplicant({
          admissionId: ctx.params.id,
          email: parsed.value.email,
          batchId: parsed.value.batchId,
          linkExisting: parsed.value.linkExisting === "1" || parsed.value.linkExisting === "true",
          origin
        })

        if (!result.emailDelivered && result.emailError) {
          const warn = encodeURIComponent(
            "Aspirant account and batch enrollment created, but SMTP welcome email failed. Retry from Users & Access."
          )
          return redirect(`${routes.admin.admissions.href()}?warning=${warn}`, 303)
        }

        const msg = encodeURIComponent(
          result.linkedExisting
            ? "Linked existing aspirant account, enrolled in batch, and marked admission as enrolled."
            : "Provisioned aspirant portal account, enrolled in batch, and sent welcome credentials."
        )
        return redirect(`${routes.admin.admissions.href()}?notice=${msg}`, 303)
      } catch (err) {
        if (err instanceof ProvisioningValidationError) {
          return renderError(err.message, err.statusCode)
        }
        return renderError("Unable to provision aspirant from admission application.", 500)
      }
    },

    async enquiries(ctx) {
      const user = requireAdmin(ctx.request)
      const enquiries = await listEnquiries()

      return ctx.render(
        <Document title="Course Enquiries — PAART Admin Console" assets={ctx.assets}>
          <AdminEnquiriesPage user={user} enquiries={enquiries} />
        </Document>
      )
    },

    async enquiryStatus(ctx) {
      requireAdmin(ctx.request)
      const form = ctx.formData ?? (await ctx.request.formData())
      const statusEntry = form.get("status")
      const status = typeof statusEntry === "string" ? statusEntry : ""
      if (ENQUIRY_STATUSES.includes(status as EnquiryStatus)) {
        try {
          await updateEnquiryStatus(ctx.params.id, status as EnquiryStatus)
        } catch {
          // ignore if DB offline
        }
      }
      return redirect(routes.admin.enquiries.href(), 303)
    },

    async courses(ctx) {
      const user = requireAdmin(ctx.request)
      const url = new URL(ctx.request.url)
      const error = url.searchParams.get("error")
      const courses = await listAllCourses()

      return ctx.render(
        <Document title="Courses Catalog — PAART Admin Console" assets={ctx.assets}>
          <AdminCoursesPage user={user} courses={courses} error={error} />
        </Document>
      )
    },

    async courseCreate(ctx) {
      requireAdmin(ctx.request)
      const form = ctx.formData ?? (await ctx.request.formData())
      const parsed = s.parseSafe(createCourseSchema, formDataToObject(form))
      if (!parsed.success) {
        const msg = encodeURIComponent(parsed.issues[0]?.message || "Invalid course fields.")
        return redirect(`${routes.admin.courses.href()}?error=${msg}`, 303)
      }

      const category: CourseCategory = COURSE_CATEGORIES.includes(
        parsed.value.category as CourseCategory
      )
        ? (parsed.value.category as CourseCategory)
        : "TNPSC"

      try {
        await createCourse({
          slug: slugify(parsed.value.title),
          title: parsed.value.title,
          category,
          shortDescription: parsed.value.shortDescription,
          duration: parsed.value.duration,
          eligibility: parsed.value.eligibility,
          image: parsed.value.image || "/images/course-exam-1.jpg",
          features: parsed.value.features
            ? parsed.value.features
                .split(",")
                .map((x) => x.trim())
                .filter(Boolean)
            : [],
          examStages: parsed.value.examStages
            ? parsed.value.examStages
                .split(",")
                .map((x) => x.trim())
                .filter(Boolean)
            : []
        })
        return redirect(routes.admin.courses.href(), 303)
      } catch {
        return redirect(
          `${routes.admin.courses.href()}?error=${encodeURIComponent("Database connection is required to create courses.")}`,
          303
        )
      }
    },

    async courseToggle(ctx) {
      requireAdmin(ctx.request)
      try {
        await toggleCourseEnabled(ctx.params.id)
      } catch {
        // ignore if DB offline
      }
      return redirect(routes.admin.courses.href(), 303)
    },

    async courseDelete(ctx) {
      requireAdmin(ctx.request)
      try {
        await deleteCourse(ctx.params.id)
      } catch {
        // ignore if DB offline
      }
      return redirect(routes.admin.courses.href(), 303)
    },

    async materials(ctx) {
      const user = requireAdmin(ctx.request)
      const url = new URL(ctx.request.url)
      const error = url.searchParams.get("error")
      const [materials, courses] = await Promise.all([listAllMaterials(), listAllCourses()])

      return ctx.render(
        <Document title="Study Materials — PAART Admin Console" assets={ctx.assets}>
          <AdminMaterialsPage user={user} materials={materials} courses={courses} error={error} />
        </Document>
      )
    },

    async materialCreate(ctx) {
      const admin = requireAdmin(ctx.request)
      const form = ctx.formData ?? (await ctx.request.formData())
      const parsed = s.parseSafe(createMaterialSchema, formDataToObject(form))
      if (!parsed.success) {
        const msg = encodeURIComponent(parsed.issues[0]?.message || "Invalid material fields.")
        return redirect(`${routes.admin.materials.href()}?error=${msg}`, 303)
      }

      const visibility: MaterialVisibility =
        parsed.value.visibility === "enrolled" ? "enrolled" : "public"

      try {
        await createMaterial({
          title: parsed.value.title,
          category: parsed.value.category,
          description: parsed.value.description,
          fileUrl: parsed.value.fileUrl,
          externalUrl: parsed.value.externalUrl,
          courseId: parsed.value.courseId || null,
          visibility,
          uploadedBy: admin.id
        })
        return redirect(routes.admin.materials.href(), 303)
      } catch {
        return redirect(
          `${routes.admin.materials.href()}?error=${encodeURIComponent("Database connection is required to publish materials.")}`,
          303
        )
      }
    },

    async materialDelete(ctx) {
      requireAdmin(ctx.request)
      try {
        await deleteMaterial(ctx.params.id)
      } catch {
        // ignore if DB offline
      }
      return redirect(routes.admin.materials.href(), 303)
    },

    async blogs(ctx) {
      const user = requireAdmin(ctx.request)
      const url = new URL(ctx.request.url)
      const error = url.searchParams.get("error")
      const blogs = await listAllBlogs()

      return ctx.render(
        <Document title="Blogs & Articles — PAART Admin Console" assets={ctx.assets}>
          <AdminBlogsPage user={user} blogs={blogs} error={error} />
        </Document>
      )
    },

    async blogCreate(ctx) {
      requireAdmin(ctx.request)
      const form = ctx.formData ?? (await ctx.request.formData())
      const parsed = s.parseSafe(createBlogSchema, formDataToObject(form))
      if (!parsed.success) {
        const msg = encodeURIComponent(parsed.issues[0]?.message || "Invalid article fields.")
        return redirect(`${routes.admin.blogs.href()}?error=${msg}`, 303)
      }

      try {
        await createBlog({
          slug: slugify(parsed.value.title),
          ...parsed.value
        })
        return redirect(routes.admin.blogs.href(), 303)
      } catch {
        return redirect(
          `${routes.admin.blogs.href()}?error=${encodeURIComponent("Database connection is required to publish articles.")}`,
          303
        )
      }
    },

    async blogToggle(ctx) {
      requireAdmin(ctx.request)
      try {
        await toggleBlogPublished(ctx.params.id)
      } catch {
        // ignore if DB offline
      }
      return redirect(routes.admin.blogs.href(), 303)
    },

    async blogDelete(ctx) {
      requireAdmin(ctx.request)
      try {
        await deleteBlog(ctx.params.id)
      } catch {
        // ignore if DB offline
      }
      return redirect(routes.admin.blogs.href(), 303)
    },

    async gallery(ctx) {
      const user = requireAdmin(ctx.request)
      const url = new URL(ctx.request.url)
      const error = url.searchParams.get("error")
      const items = await listGalleryItems()

      return ctx.render(
        <Document title="Campus Gallery — PAART Admin Console" assets={ctx.assets}>
          <AdminGalleryPage user={user} items={items} error={error} />
        </Document>
      )
    },

    async galleryCreate(ctx) {
      requireAdmin(ctx.request)
      const form = ctx.formData ?? (await ctx.request.formData())
      const parsed = s.parseSafe(createGallerySchema, formDataToObject(form))
      if (!parsed.success) {
        const msg = encodeURIComponent(parsed.issues[0]?.message || "Invalid gallery fields.")
        return redirect(`${routes.admin.gallery.href()}?error=${msg}`, 303)
      }

      try {
        await createGalleryItem(parsed.value)
        return redirect(routes.admin.gallery.href(), 303)
      } catch {
        return redirect(
          `${routes.admin.gallery.href()}?error=${encodeURIComponent("Database connection is required to add gallery items.")}`,
          303
        )
      }
    },

    async galleryDelete(ctx) {
      requireAdmin(ctx.request)
      try {
        await deleteGalleryItem(ctx.params.id)
      } catch {
        // ignore if DB offline
      }
      return redirect(routes.admin.gallery.href(), 303)
    },

    async settings(ctx) {
      const user = requireAdmin(ctx.request)
      const url = new URL(ctx.request.url)
      const saved = url.searchParams.get("saved") === "1"
      const error = url.searchParams.get("error")
      const settings = await getSiteSettings()

      return ctx.render(
        <Document title="Site Settings — PAART Admin Console" assets={ctx.assets}>
          <AdminSettingsPage user={user} settings={settings} saved={saved} error={error} />
        </Document>
      )
    },

    async settingsUpdate(ctx) {
      requireAdmin(ctx.request)
      const form = ctx.formData ?? (await ctx.request.formData())
      const parsed = s.parseSafe(updateSettingsSchema, formDataToObject(form))
      if (!parsed.success) {
        const msg = encodeURIComponent(parsed.issues[0]?.message || "Invalid settings.")
        return redirect(`${routes.admin.settings.href()}?error=${msg}`, 303)
      }

      try {
        await upsertSiteSettings(parsed.value)
        return redirect(`${routes.admin.settings.href()}?saved=1`, 303)
      } catch {
        return redirect(
          `${routes.admin.settings.href()}?error=${encodeURIComponent("Database connection is required to persist site settings.")}`,
          303
        )
      }
    }
  }
})
