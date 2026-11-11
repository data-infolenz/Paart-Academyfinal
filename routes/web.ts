import { get, post, route } from "remix/routes"

export const routes = route({
  // Public Core Pages
  home: "/",
  about: "/about",
  materials: "/materials",
  gallery: "/gallery",
  faq: "/faq",
  contact: "/contact",
  enquirySubmit: post("/enquiries"),

  // Machine & Health Endpoints
  sitemap: "/sitemap.xml",
  llms: "/llms.txt",
  healthz: "/healthz",
  readyz: "/readyz",

  // Courses Catalog
  courses: route({
    index: "/courses",
    show: "/courses/:slug"
  }),

  // Blogs & Exam Updates
  blogs: route({
    index: "/blogs",
    show: "/blogs/:slug"
  }),

  // Online Admissions
  admissions: route({
    apply: get("/admissions"),
    submit: post("/admissions"),
    success: get("/admissions/success")
  }),

  // Admin Authentication
  auth: route({
    signIn: get("/admin/sign-in"),
    login: post("/admin/sign-in"),
    logout: post("/admin/logout")
  }),

  // Admin Console (SSR AppShell)
  admin: route({
    index: "/admin",
    admissions: "/admin/admissions",
    admissionStatus: post("/admin/admissions/:id/status"),
    enquiries: "/admin/enquiries",
    enquiryStatus: post("/admin/enquiries/:id/status"),
    courses: "/admin/courses",
    courseCreate: post("/admin/courses"),
    courseToggle: post("/admin/courses/:id/toggle"),
    courseDelete: post("/admin/courses/:id/delete"),
    materials: "/admin/materials",
    materialCreate: post("/admin/materials"),
    materialDelete: post("/admin/materials/:id/delete"),
    blogs: "/admin/blogs",
    blogCreate: post("/admin/blogs"),
    blogToggle: post("/admin/blogs/:id/toggle"),
    blogDelete: post("/admin/blogs/:id/delete"),
    gallery: "/admin/gallery",
    galleryCreate: post("/admin/gallery"),
    galleryDelete: post("/admin/gallery/:id/delete"),
    settings: get("/admin/settings"),
    settingsUpdate: post("/admin/settings")
  })
})

export type Routes = typeof routes
