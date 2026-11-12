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

  // Unified Multi-Role Authentication & Account Security
  auth: route({
    loginPage: get("/login"),
    login: post("/login"),
    logout: post("/logout"),
    changePasswordPage: get("/account/change-password"),
    changePassword: post("/account/change-password"),
    signIn: get("/admin/sign-in"),
    legacyLogout: post("/admin/logout")
  }),

  // Admin Console (SSR AppShell)
  admin: route({
    index: "/admin",
    users: get("/admin/users"),
    userCreate: post("/admin/users"),
    userResendCredentials: post("/admin/users/:id/resend-credentials"),
    userStatus: post("/admin/users/:id/status"),
    batches: get("/admin/batches"),
    batchCreate: post("/admin/batches"),
    batchToggle: post("/admin/batches/:id/toggle"),
    admissions: "/admin/admissions",
    admissionStatus: post("/admin/admissions/:id/status"),
    admissionProvision: post("/admin/admissions/:id/provision"),
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
    pages: get("/admin/pages"),
    pageCreate: post("/admin/pages"),
    pageEdit: get("/admin/pages/:id"),
    pageDraftSave: post("/admin/pages/:id/draft"),
    pageBlockAdd: post("/admin/pages/:id/blocks/add"),
    pageBlockPatch: post("/admin/pages/:id/blocks/patch"),
    pagePublish: post("/admin/pages/:id/publish"),
    pageRevisionRestore: post("/admin/pages/:id/revisions/:revisionId/restore"),
    pageDelete: post("/admin/pages/:id/delete"),
    chrome: get("/admin/chrome"),
    chromeUpdate: post("/admin/chrome"),
    settings: get("/admin/settings"),
    settingsUpdate: post("/admin/settings")
  }),

  // Faculty Workspace (SSR AppShell)
  faculty: route({
    index: "/faculty",
    batchSyllabus: get("/faculty/batches/:id/syllabus"),
    batchSyllabusCreate: post("/faculty/batches/:id/syllabus"),
    batchSyllabusStatus: post("/faculty/batches/:id/syllabus/:topicId/status"),
    exams: get("/faculty/exams"),
    examCreate: post("/faculty/exams"),
    examMarks: get("/faculty/exams/:id/marks"),
    examMarksSave: post("/faculty/exams/:id/marks"),
    examMarksTemplate: get("/faculty/exams/:id/marks/template.csv"),
    examMarksImport: post("/faculty/exams/:id/marks/import"),
    examPublish: post("/faculty/exams/:id/publish"),
    materials: get("/faculty/materials"),
    materialCreate: post("/faculty/materials"),
    materialDelete: post("/faculty/materials/:id/delete"),
    notifications: get("/faculty/notifications"),
    notificationCreate: post("/faculty/notifications")
  }),

  // Aspirant Portal (SSR AppShell)
  portal: route({
    index: "/portal",
    progress: get("/portal/progress"),
    exams: get("/portal/exams"),
    marks: get("/portal/marks"),
    materials: get("/portal/materials"),
    notifications: get("/portal/notifications")
  }),

  // Custom Server-Driven Campaign Pages (mapped last in router.ts so explicit routes always win)
  campaign: route({
    show: get("/:slug")
  })
})

export type Routes = typeof routes
