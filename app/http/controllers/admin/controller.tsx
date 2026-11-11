import * as s from "remix/data-schema"
import { redirect } from "remix/response/redirect"
import { createController } from "remix/router"
import { requireAdmin } from "~/app/http/middleware/auth"
import {
  createBlogSchema,
  createCourseSchema,
  createGallerySchema,
  createMaterialSchema,
  formDataToObject,
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
import { createMaterial, deleteMaterial, listAllMaterials } from "~/app/models/materials"
import { getSiteSettings, upsertSiteSettings } from "~/app/models/settings"
import { COURSE_CATEGORIES, type CourseCategory } from "~/config/courses"
import {
  ADMISSION_STATUSES,
  type AdmissionStatus,
  ENQUIRY_STATUSES,
  type EnquiryStatus
} from "~/database/schema"
import { Document } from "~/resources/layouts/document"
import { AdminAdmissionsPage } from "~/resources/views/admin/admissions-page"
import { AdminBlogsPage } from "~/resources/views/admin/blogs-page"
import { AdminCoursesPage } from "~/resources/views/admin/courses-page"
import { AdminEnquiriesPage } from "~/resources/views/admin/enquiries-page"
import { AdminGalleryPage } from "~/resources/views/admin/gallery-page"
import { AdminMaterialsPage } from "~/resources/views/admin/materials-page"
import { AdminOverviewPage } from "~/resources/views/admin/overview-page"
import { AdminSettingsPage } from "~/resources/views/admin/settings-page"
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

    async admissions(ctx) {
      const user = requireAdmin(ctx.request)
      const admissions = await listAdmissions()

      return ctx.render(
        <Document title="Student Admissions — PAART Admin Console" assets={ctx.assets}>
          <AdminAdmissionsPage user={user} admissions={admissions} />
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
      const materials = await listAllMaterials()

      return ctx.render(
        <Document title="Study Materials — PAART Admin Console" assets={ctx.assets}>
          <AdminMaterialsPage user={user} materials={materials} error={error} />
        </Document>
      )
    },

    async materialCreate(ctx) {
      requireAdmin(ctx.request)
      const form = ctx.formData ?? (await ctx.request.formData())
      const parsed = s.parseSafe(createMaterialSchema, formDataToObject(form))
      if (!parsed.success) {
        const msg = encodeURIComponent(parsed.issues[0]?.message || "Invalid material fields.")
        return redirect(`${routes.admin.materials.href()}?error=${msg}`, 303)
      }

      try {
        await createMaterial(parsed.value)
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
