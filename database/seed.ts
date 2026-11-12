import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"
import { password as cryptoPassword } from "@sdxc/crypto"
import { parseEmailAddress } from "@sdxc/email-address"
import { isSuccess, unwrap } from "@sdxc/result"
import { closeDatabase, getDatabase, type PaartDb } from "../app/initializers/database"
import { appConfig } from "../config/app"
import { SEED_BLOGS, SEED_COURSES, SEED_GALLERY, SEED_MATERIALS } from "../config/courses"
import { DEFAULT_PAGES, DEFAULT_SITE_CHROME } from "../config/default-pages"
import { TRUST_PROFILE } from "../config/trust"
import {
  batches,
  blogs,
  courses,
  enrollments,
  examResults,
  exams,
  galleryItems,
  materials,
  notifications,
  pageRevisions,
  pages,
  siteChrome,
  siteSettings,
  syllabusTopics,
  type UserRole,
  users
} from "./schema"

function normalizeSeedEmail(raw: string): string {
  const parsed = parseEmailAddress(raw)
  if (isSuccess(parsed)) {
    return parsed.data.canonical
  }
  return raw.trim().toLowerCase()
}

async function upsertSeedUser(
  db: PaartDb,
  input: {
    id: string
    email: string
    fullName: string
    phone: string
    department?: string
    role: UserRole
    plainPassword: string
    mustChangePassword: boolean
  },
  now: Date
): Promise<string> {
  const canonicalEmail = normalizeSeedEmail(input.email)
  const existingByEmail = await db.findOne(users, { where: { email: canonicalEmail } })
  if (existingByEmail) {
    const validRes = await cryptoPassword.verify(existingByEmail.password_hash, input.plainPassword)
    const passwordMatches = isSuccess(validRes) && validRes.data
    await db.update(users, existingByEmail.id, {
      full_name: input.fullName,
      role: input.role,
      status: "active",
      ...(passwordMatches
        ? {}
        : { password_hash: unwrap(await cryptoPassword.hash(input.plainPassword)) }),
      updated_at: now
    })
    return existingByEmail.id
  }

  const existingById = await db.find(users, input.id)
  const userId = existingById ? `${input.id}-${Date.now()}` : input.id
  const passwordHash = unwrap(await cryptoPassword.hash(input.plainPassword))

  await db.create(users, {
    id: userId,
    email: canonicalEmail,
    full_name: input.fullName,
    phone: input.phone,
    department: input.department ?? "",
    role: input.role,
    password_hash: passwordHash,
    must_change_password: input.mustChangePassword,
    status: "active",
    last_login_at: null,
    credentials_sent_at: now,
    credentials_delivery_error: null,
    created_at: now,
    updated_at: now
  })

  return userId
}

export async function seedDatabase(targetDb?: PaartDb): Promise<void> {
  const db = targetDb ?? getDatabase()
  const now = new Date()

  for (const c of SEED_COURSES) {
    const existing = await db.find(courses, c.id)
    if (!existing) {
      await db.create(courses, {
        id: c.id,
        slug: c.slug,
        title: c.title,
        category: c.category,
        short_description: c.shortDescription,
        duration: c.duration,
        eligibility: c.eligibility,
        image: c.image,
        features: c.features,
        exam_stages: c.examStages,
        details: c.details,
        enabled: c.enabled,
        display_order: c.displayOrder,
        created_at: now,
        updated_at: now
      })
    }
  }

  for (const m of SEED_MATERIALS) {
    const existing = await db.find(materials, m.id)
    if (!existing) {
      await db.create(materials, {
        id: m.id,
        title: m.title,
        category: m.category,
        description: m.description,
        file_url: m.fileUrl,
        external_url: m.externalUrl,
        course_id: null,
        visibility: "public",
        uploaded_by: null,
        published: m.published,
        display_order: m.displayOrder,
        created_at: now,
        updated_at: now
      })
    }
  }

  for (const b of SEED_BLOGS) {
    const existing = await db.find(blogs, b.id)
    if (!existing) {
      await db.create(blogs, {
        id: b.id,
        slug: b.slug,
        title: b.title,
        short_description: b.shortDescription,
        content: b.content,
        author: b.author,
        published_date: b.publishedDate,
        category: b.category,
        featured_image: b.featuredImage,
        seo_title: b.seoTitle,
        meta_description: b.metaDescription,
        published: b.published,
        created_at: now,
        updated_at: now
      })
    }
  }

  for (const g of SEED_GALLERY) {
    const existing = await db.find(galleryItems, g.id)
    if (!existing) {
      await db.create(galleryItems, {
        id: g.id,
        title: g.title,
        description: g.description,
        category: g.category,
        image: g.image,
        video_url: null,
        display_order: g.displayOrder,
        created_at: now
      })
    }
  }

  const existingSettings = await db.find(siteSettings, "default")
  if (!existingSettings) {
    await db.create(siteSettings, {
      id: "default",
      site_name: TRUST_PROFILE.shortName,
      phone: TRUST_PROFILE.phone,
      whatsapp: TRUST_PROFILE.whatsapp,
      email: TRUST_PROFILE.email,
      address_primary: TRUST_PROFILE.addressPrimary,
      address_secondary: TRUST_PROFILE.addressSecondary,
      hours: TRUST_PROFILE.hours,
      seo_title: "PAART Academy | TNPSC, TNUSRB & Competitive Exam Coaching in Puliyangudi",
      seo_description: TRUST_PROFILE.summary,
      canonical_url: appConfig.PAART_PUBLIC_URL,
      updated_at: now
    })
  }

  // Bootstrap Administrator from .env (always ensured across environments)
  const adminId = await upsertSeedUser(
    db,
    {
      id: "019a0000-0000-7000-8000-000000000001",
      email: appConfig.PAART_ADMIN_EMAIL,
      fullName: "PAART Chief Administrator",
      phone: TRUST_PROFILE.phone,
      department: "Administration",
      role: "admin",
      plainPassword: appConfig.PAART_ADMIN_PASSWORD,
      mustChangePassword: false
    },
    now
  )

  // Seed global site_chrome singleton idempotently
  const existingChrome = await db.find(siteChrome, "default")
  if (!existingChrome) {
    await db.create(siteChrome, {
      id: "default",
      utility_bar: DEFAULT_SITE_CHROME.utilityBar,
      header_nav: DEFAULT_SITE_CHROME.headerNav,
      header_ctas: DEFAULT_SITE_CHROME.headerCtas,
      footer_columns: DEFAULT_SITE_CHROME.footerColumns,
      trust_profile: DEFAULT_SITE_CHROME.trustProfile,
      version: 1,
      updated_by: adminId,
      updated_at: now
    })
  }

  // Seed default server-driven pages & collection templates idempotently
  for (const pageSeed of DEFAULT_PAGES) {
    const existingPage = await db.findOne(pages, { where: { slug: pageSeed.slug } })
    if (!existingPage) {
      await db.create(pages, {
        id: pageSeed.id,
        slug: pageSeed.slug,
        title: pageSeed.title,
        kind: pageSeed.pageKind,
        status: "published",
        is_system: pageSeed.isSystem,
        draft_blocks: pageSeed.blocks,
        published_blocks: pageSeed.blocks,
        seo: pageSeed.seo,
        version: 1,
        published_version: 1,
        updated_by: adminId,
        published_by: adminId,
        published_at: now,
        created_at: now,
        updated_at: now
      })

      await db.create(pageRevisions, {
        id: `${pageSeed.id}-rev-1`,
        page_id: pageSeed.id,
        version: 1,
        blocks: pageSeed.blocks,
        seo: pageSeed.seo,
        diff_patch: [],
        note: "Initial institutional seed revision",
        created_by: adminId,
        created_at: now
      })
    }
  }

  if (appConfig.NODE_ENV !== "production") {
    const facultyId = await upsertSeedUser(
      db,
      {
        id: "019a0000-0000-7000-8000-000000000002",
        email: "faculty@paart.in",
        fullName: "Prof. S. Muruganandham",
        phone: "+91 9842100111",
        department: "TNPSC General Studies & Tamil",
        role: "faculty",
        plainPassword: "Faculty@2026Paart!",
        mustChangePassword: false
      },
      now
    )

    const aspirant1Id = await upsertSeedUser(
      db,
      {
        id: "019a0000-0000-7000-8000-000000000003",
        email: "aspirant@paart.in",
        fullName: "M. Karthikeyan",
        phone: "+91 9842100222",
        department: "TNPSC Group IV",
        role: "aspirant",
        plainPassword: "Aspirant@2026Paart!",
        mustChangePassword: false
      },
      now
    )

    const aspirant2Id = await upsertSeedUser(
      db,
      {
        id: "019a0000-0000-7000-8000-000000000004",
        email: "kavitha.aspirant@paart.in",
        fullName: "R. Kavitha",
        phone: "+91 9842100333",
        department: "TNPSC Group IV",
        role: "aspirant",
        plainPassword: "Aspirant@2026Paart!",
        mustChangePassword: false
      },
      now
    )

    const batchG4Id = "batch-group4-2026-a"
    if (!(await db.find(batches, batchG4Id))) {
      await db.create(batches, {
        id: batchG4Id,
        course_id: "group-4",
        faculty_id: facultyId,
        name: "TNPSC Group IV — 2026 Regular Morning Batch A",
        code: "PAART-G4-26A",
        schedule_label: "Mon–Sat · 9:30 AM – 1:00 PM",
        starts_on: "2026-06-01",
        ends_on: "2026-12-15",
        is_active: true,
        created_at: now,
        updated_at: now
      })
    }

    const batchG1Id = "batch-group1-2026-w"
    if (!(await db.find(batches, batchG1Id))) {
      await db.create(batches, {
        id: batchG1Id,
        course_id: "group-1",
        faculty_id: facultyId,
        name: "TNPSC Group I — 2026 Weekend Mentorship Batch",
        code: "PAART-G1-26W",
        schedule_label: "Sat & Sun · 9:30 AM – 4:30 PM",
        starts_on: "2026-06-15",
        ends_on: "2027-04-30",
        is_active: true,
        created_at: now,
        updated_at: now
      })
    }

    const sampleEnrollments = [
      {
        id: "enr-g4-001",
        batch_id: batchG4Id,
        aspirant_id: aspirant1Id,
        roll_number: "PAART-G4-001"
      },
      {
        id: "enr-g4-002",
        batch_id: batchG4Id,
        aspirant_id: aspirant2Id,
        roll_number: "PAART-G4-002"
      }
    ]
    for (const enr of sampleEnrollments) {
      const existingEnr = await db.findOne(enrollments, {
        where: { batch_id: enr.batch_id, aspirant_id: enr.aspirant_id }
      })
      if (!existingEnr) {
        await db.create(enrollments, {
          id: enr.id,
          batch_id: enr.batch_id,
          aspirant_id: enr.aspirant_id,
          admission_id: null,
          roll_number: enr.roll_number,
          status: "active",
          enrolled_at: now
        })
      }
    }

    const sampleTopics = [
      {
        id: "syl-g4-01",
        unit_label: "Part A · Unit 1",
        title: "General Tamil — Ilakkanam & Samacheer 6th–10th Poetry",
        sort_order: 1,
        status: "completed" as const,
        completed_at: now
      },
      {
        id: "syl-g4-02",
        unit_label: "Part B · Unit 4",
        title: "Indian Polity — Constitution, Fundamental Rights & Panchayati Raj",
        sort_order: 2,
        status: "completed" as const,
        completed_at: now
      },
      {
        id: "syl-g4-03",
        unit_label: "Part B · Unit 7",
        title: "Tamil Nadu History, Heritage & Socio-Political Movements",
        sort_order: 3,
        status: "in_progress" as const,
        completed_at: null
      },
      {
        id: "syl-g4-04",
        unit_label: "Part B · Unit 10",
        title: "Aptitude & Mental Ability — Simplification, Ratio, Time & Work",
        sort_order: 4,
        status: "pending" as const,
        completed_at: null
      }
    ]
    for (const topic of sampleTopics) {
      if (!(await db.find(syllabusTopics, topic.id))) {
        await db.create(syllabusTopics, {
          id: topic.id,
          batch_id: batchG4Id,
          unit_label: topic.unit_label,
          title: topic.title,
          sort_order: topic.sort_order,
          status: topic.status,
          completed_at: topic.completed_at,
          updated_by: facultyId,
          created_at: now,
          updated_at: now
        })
      }
    }

    const sampleExams = [
      {
        id: "exam-g4-mock-01",
        title: "OMR Weekly Test 01 — General Tamil & Polity",
        exam_type: "weekly_mock" as const,
        exam_date: "2026-09-14",
        syllabus_notes: "Samacheer 6th–8th Tamil + Indian Constitution Articles 1–51A",
        max_marks: 100,
        qualifying_marks: 40,
        status: "published" as const,
        published_at: now
      },
      {
        id: "exam-g4-mock-02",
        title: "OMR Revision Test 02 — Tamil Literature & TN Administration",
        exam_type: "omr_revision" as const,
        exam_date: "2026-10-12",
        syllabus_notes: "Samacheer 9th–10th Tamil + Welfare Schemes of Tamil Nadu",
        max_marks: 100,
        qualifying_marks: 40,
        status: "published" as const,
        published_at: now
      },
      {
        id: "exam-g4-full-03",
        title: "Full-Length Model OMR Exam 03 (200 Questions)",
        exam_type: "full_test" as const,
        exam_date: "2026-11-28",
        syllabus_notes: "Complete Group IV Pattern — 100 Tamil + 75 GS + 25 Aptitude",
        max_marks: 300,
        qualifying_marks: 120,
        status: "scheduled" as const,
        published_at: null
      }
    ]
    for (const ex of sampleExams) {
      if (!(await db.find(exams, ex.id))) {
        await db.create(exams, {
          id: ex.id,
          batch_id: batchG4Id,
          title: ex.title,
          exam_type: ex.exam_type,
          exam_date: ex.exam_date,
          syllabus_notes: ex.syllabus_notes,
          max_marks: ex.max_marks,
          qualifying_marks: ex.qualifying_marks,
          status: ex.status,
          published_at: ex.published_at,
          created_by: facultyId,
          created_at: now,
          updated_at: now
        })
      }
    }

    const sampleResults = [
      {
        id: "res-01-a1",
        exam_id: "exam-g4-mock-01",
        aspirant_id: aspirant1Id,
        marks_obtained: 78,
        rank: 2,
        remarks: "Strong accuracy in General Tamil; revise Fundamental Duties."
      },
      {
        id: "res-01-a2",
        exam_id: "exam-g4-mock-01",
        aspirant_id: aspirant2Id,
        marks_obtained: 84,
        rank: 1,
        remarks: "Consistent OMR speed and top score in Polity."
      },
      {
        id: "res-02-a1",
        exam_id: "exam-g4-mock-02",
        aspirant_id: aspirant1Id,
        marks_obtained: 86,
        rank: 1,
        remarks: "Excellent +8 mark improvement; keep up daily Tamil revision."
      },
      {
        id: "res-02-a2",
        exam_id: "exam-g4-mock-02",
        aspirant_id: aspirant2Id,
        marks_obtained: 82,
        rank: 2,
        remarks: "Well prepared; review recent TN welfare schemes."
      }
    ]
    for (const res of sampleResults) {
      const existingRes = await db.findOne(examResults, {
        where: { exam_id: res.exam_id, aspirant_id: res.aspirant_id }
      })
      if (!existingRes) {
        await db.create(examResults, {
          id: res.id,
          exam_id: res.exam_id,
          aspirant_id: res.aspirant_id,
          attendance: "present",
          marks_obtained: res.marks_obtained,
          rank: res.rank,
          remarks: res.remarks,
          updated_by: facultyId,
          updated_at: now
        })
      }
    }

    if (!(await db.find(materials, "mat-enrolled-g4-omr"))) {
      await db.create(materials, {
        id: "mat-enrolled-g4-omr",
        title: "Batch Exclusive: Group IV 500 High-Yield Tamil & Polity OMR Workbook",
        category: "Question Bank",
        description:
          "Enrolled batch workbook with annotated answer keys and Samacheer page references.",
        file_url: "/study-materials/group4-enrolled-omr-workbook.pdf",
        external_url: "",
        course_id: "group-4",
        visibility: "enrolled",
        uploaded_by: facultyId,
        published: true,
        display_order: 5,
        created_at: now,
        updated_at: now
      })
    }

    const sampleNotifications = [
      {
        id: "notif-all-01",
        title: "Library & Study Hall Extended Timing This Week",
        body: "Puliyangudi campus study hall remains open until 7:30 PM from Monday to Saturday for revision.",
        category: "general" as const,
        target_scope: "all" as const,
        target_course_id: null,
        target_batch_id: null,
        published_by: adminId
      },
      {
        id: "notif-batch-g4-01",
        title: "Full-Length Model OMR Exam 03 — Hall Reporting at 9:15 AM",
        body: "All Group IV Morning Batch A aspirants must bring black ballpoint pens for OMR shading practice on 28 Nov 2026.",
        category: "exam" as const,
        target_scope: "batch" as const,
        target_course_id: "group-4",
        target_batch_id: batchG4Id,
        published_by: facultyId
      }
    ]
    for (const notif of sampleNotifications) {
      if (!(await db.find(notifications, notif.id))) {
        await db.create(notifications, {
          ...notif,
          published_at: now
        })
      }
    }
  }
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMain) {
  let exitCode = 0
  try {
    console.log("[PAART DB] Seeding PostgreSQL database...")
    await seedDatabase()
    console.log("[PAART DB] Seed completed successfully.")
  } catch (error) {
    console.error("[PAART DB] Seed failed:", error)
    exitCode = 1
  } finally {
    await closeDatabase().catch(() => {})
  }
  if (exitCode !== 0) {
    process.exit(exitCode)
  }
}
