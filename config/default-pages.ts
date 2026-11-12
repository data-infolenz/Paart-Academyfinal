import type { PageBlock, PageSeo, SiteChromeConfig } from "~/app/models/cms-schemas"
import { PAART_FAQ_CATEGORIES } from "./faqs"
import {
  DEPARTMENT_SELECTIONS,
  IMPACT_METRICS,
  STATE_RANK_HIGHLIGHTS,
  TRUST_INITIATIVES,
  TRUST_PILLARS,
  TRUST_PROFILE,
  TRUST_VISION_MISSION
} from "./trust"

export interface DefaultPageSeed {
  id: string
  slug: string
  title: string
  pageKind: "static_page" | "collection_template"
  isSystem: boolean
  seo: PageSeo
  blocks: PageBlock[]
}

export const DEFAULT_SITE_CHROME: SiteChromeConfig = {
  utilityBar: {
    badgeText: `${TRUST_PROFILE.legalName} · Est. ${TRUST_PROFILE.establishedLabel}`,
    showHours: true,
    showPhone: true,
    resourceLabel: "Free PDF Notes",
    resourceHref: "/materials"
  },
  headerNav: [
    { label: "Home", href: "/" },
    { label: "Courses", href: "/courses" },
    { label: "Study Materials", href: "/materials" },
    { label: "About & Results", href: "/about" },
    { label: "Gallery", href: "/gallery" },
    { label: "Exam Blog", href: "/blogs" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" }
  ],
  headerCtas: {
    primaryLabel: "Admission Form",
    primaryHref: "/admissions",
    loginLabel: "Portal Login"
  },
  footerColumns: [
    {
      heading: "Exam Programmes",
      links: [
        { label: "TNPSC Group I, II & IIA", href: "/courses/tnpsc-group-1" },
        { label: "TNPSC Group IV & VAO", href: "/courses/tnpsc-group-4" },
        { label: "TNUSRB Sub-Inspector & PC", href: "/courses/tnusrb-si" },
        { label: "TET, SSC, Banking & Railway", href: "/courses" },
        { label: "NMMS, Typewriting & Computer Skills", href: "/admissions" }
      ]
    },
    {
      heading: "Student Help Desk",
      links: [
        { label: "Online Admission Form", href: "/admissions" },
        { label: "Free Study Materials & Notes", href: "/materials" },
        { label: "Exam Preparation Articles", href: "/blogs" },
        { label: "Frequently Asked Questions", href: "/faq" },
        { label: "Batch Timings & Counselling", href: "/contact" }
      ]
    },
    {
      heading: "Trust & Campus",
      links: [
        { label: "About PAART Trust & Vision", href: "/about" },
        { label: "323+ Selection Track Record", href: "/about#results" },
        { label: "Classroom & Exam Gallery", href: "/gallery" },
        { label: "Puliyangudi Campus Map", href: "/contact" },
        { label: "Aspirant / Faculty / Admin Login", href: "/login" }
      ]
    }
  ],
  trustProfile: {
    shortName: TRUST_PROFILE.shortName,
    legalName: TRUST_PROFILE.legalName,
    establishedDate: TRUST_PROFILE.establishedDate,
    establishedLabel: TRUST_PROFILE.establishedLabel,
    tagline: TRUST_PROFILE.tagline,
    summary: TRUST_PROFILE.summary,
    phone: TRUST_PROFILE.phone,
    whatsapp: TRUST_PROFILE.whatsapp,
    email: TRUST_PROFILE.email,
    addressPrimary: TRUST_PROFILE.addressPrimary,
    addressSecondary: TRUST_PROFILE.addressSecondary,
    hours: TRUST_PROFILE.hours
  }
}

export const DEFAULT_PAGES: DefaultPageSeed[] = [
  {
    id: "page-home",
    slug: "/",
    title: "Home — Institutional Landing Page",
    pageKind: "static_page",
    isSystem: true,
    seo: {
      title: "PAART Academy | TNPSC, TNUSRB & Competitive Exam Coaching in Puliyangudi",
      description: TRUST_PROFILE.summary,
      canonicalPath: "/",
      ogImage: "/images/paart-training-hall-front.png",
      noindex: false
    },
    blocks: [
      {
        id: "home-hero",
        type: "academic_hero",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Puliyangudi, Tenkasi District · Public Educational Trust",
          heading: "Disciplined Coaching for Government Service & Academic Excellence",
          description: `Established on ${TRUST_PROFILE.establishedLabel}, ${TRUST_PROFILE.legalName} (PAART Academy) guides students and aspirants across Tenkasi District with bilingual Tamil & English classes, Samacheer syllabus coverage, daily OMR/CBT test series, and personal mentoring.`,
          streams: [
            "TNPSC Group I · II · IIA · IV & VAO",
            "TNUSRB Sub-Inspector & Police Constable",
            "TET / TRB Teaching Exams",
            "SSC · Banking · RRB Railway",
            "NMMS · Typewriting · Steno · Computer"
          ],
          primaryCtaLabel: "Online Admission Form",
          primaryCtaHref: "/admissions",
          secondaryCtaLabel: "View Courses & Syllabus",
          secondaryCtaHref: "/courses",
          mainImage: "/images/paart-training-hall-front.png",
          mainImageAlt: "PAART Coaching Centre Building in Puliyangudi, Tenkasi District",
          subImageLeft: "/images/classroom-1.jpg",
          subImageLeftAlt: "PAART Academy classroom mentoring session",
          subImageRight: "/images/course-exam-1.jpg",
          subImageRightAlt: "Students writing weekly OMR model examination at PAART Academy",
          campusLabel: "PAART Coaching Centre · Puliyangudi Campus",
          campusBadge: "Est. Dec 2018",
          campusSubtext: "Lebbaisaburam Street & Jamaliya Masjid Complex (Jinnah Nagar 3rd St)"
        }
      },
      {
        id: "home-notice-bar",
        type: "notice_bar",
        enabled: true,
        visibilityRule: "",
        data: {
          badge: "Notice",
          message:
            "Registrations open for Regular Weekday, Weekend & Morning Track batches in Puliyangudi (Tamil & English Medium).",
          ctaLabel: "Submit",
          ctaHref: "/admissions"
        }
      },
      {
        id: "home-honour-roll",
        type: "honour_roll_stats",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Academy Roll of Honour",
          heading: "Verified Selections & State-Rank Achievements",
          actionLabel: "Department-wise selection list",
          actionHref: "/about",
          metrics: IMPACT_METRICS.map((m) => ({ ...m })),
          highlights: STATE_RANK_HIGHLIGHTS.map((h) => ({ ...h }))
        }
      },
      {
        id: "home-courses",
        type: "course_catalog",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Academic Prospectus",
          title: "Competitive Examination Programmes",
          description:
            "Structured classroom coaching for Tamil Nadu state civil services, uniformed services, teacher eligibility, and central government recruitments.",
          sectionId: "courses",
          tone: "default",
          categoryFilter: "ALL",
          limit: 6,
          showCategoryTabs: false,
          showHeader: true,
          viewAllLabel: "View All Programmes",
          viewAllHref: "/courses"
        }
      },
      {
        id: "home-pedagogy",
        type: "pillars_grid",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Campus Pedagogy & Study Hall",
          title: "How Students Prepare at PAART Academy",
          description:
            "Consistent daily teaching, bilingual study notes, weekly OMR/CBT mock tests, and community welfare support.",
          sectionId: "",
          tone: "paper",
          layout: "numbered_with_schedule",
          actionLabel: "View Classroom Gallery",
          actionHref: "/gallery",
          cards: TRUST_PILLARS.map((p) => ({
            badge: "",
            accent: "none" as const,
            title: p.title,
            description: p.description,
            paragraphs: [],
            values: []
          })),
          scheduleTitle: "Campus Batch Timings & Study Hall",
          scheduleItems: [
            {
              batch: "Morning Physical & Track Session",
              detail: "6:00 AM – 8:00 AM · Endurance & rope/jump drills for TNUSRB SI & PC"
            },
            {
              batch: "Regular Weekday Classroom Batch",
              detail: "9:30 AM – 4:30 PM · Subject lectures, Samacheer revision & daily test"
            },
            {
              batch: "Weekend Batch (College & Working Aspirants)",
              detail: "Saturday & Sunday · Intensive syllabus coverage & OMR mock series"
            },
            {
              batch: "Supervised Library & Study Hall",
              detail: "Open Monday – Saturday, 9:00 AM – 7:00 PM with reference books"
            }
          ],
          sideImage: "/images/achievement-1.jpg",
          sideImageAlt: "Students attending foundation and scholarship coaching at PAART Academy",
          sideCaption: "NMMS School Scholarship, Typewriting & Career Guidance Camps"
        }
      },
      {
        id: "home-library-gazette",
        type: "materials_catalog",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Open Student Library",
          title: "Free Study Materials & Notes",
          description: "",
          tone: "default",
          layout: "split_with_blogs",
          categoryFilter: "ALL",
          limit: 4,
          showCategoryTabs: false,
          blogRubric: "Academic Gazette",
          blogTitle: "Exam Strategy & Guidance",
          blogLimit: 3
        }
      },
      {
        id: "home-faq",
        type: "faq_accordion",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Student & Parent Help Desk",
          title: "Frequently Asked Questions",
          description:
            "Clear answers regarding batch timings, Tamil & English medium instruction, mock exams, and fee scholarships.",
          tone: "paper",
          showHeader: true,
          actionLabel: "Full FAQ Page",
          actionHref: "/faq",
          categories: PAART_FAQ_CATEGORIES.map((cat) => ({
            id: cat.id,
            title: cat.title,
            items: cat.items.map((item) => ({ ...item }))
          }))
        }
      },
      {
        id: "home-callout",
        type: "callout_band",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Walk-In Counselling & Registration",
          title: "Visit PAART Academy in Puliyangudi or Register Online",
          description:
            "Meet our faculty coordinators in person for syllabus counselling, batch selection, and scholarship guidance, or submit your admission form online.",
          primaryCtaLabel: "Online Admission Form",
          primaryCtaHref: "/admissions",
          secondaryCtaLabel: "",
          secondaryCtaHref: ""
        }
      }
    ]
  },
  {
    id: "page-about",
    slug: "/about",
    title: "About PAART Trust & Selection Track Record",
    pageKind: "static_page",
    isSystem: true,
    seo: {
      title: "About PAART Trust & Selection Track Record | PAART Academy",
      description:
        "Established on 22 December 2018 in Puliyangudi, PAART Trust empowers rural and semi-urban aspirants with disciplined competitive exam coaching.",
      canonicalPath: "/about",
      ogImage: "/images/achievement-1.jpg",
      noindex: false
    },
    blocks: [
      {
        id: "about-banner",
        type: "page_banner",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: `Public Educational Trust · Est. ${TRUST_PROFILE.establishedLabel}`,
          title: `${TRUST_PROFILE.legalName} (PAART)`,
          description: TRUST_PROFILE.summary,
          breadcrumbs: [{ label: "About & Results", href: "" }]
        }
      },
      {
        id: "about-metrics",
        type: "honour_roll_stats",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "",
          heading: "",
          actionLabel: "",
          actionHref: "",
          metrics: IMPACT_METRICS.map((m) => ({ ...m })),
          highlights: []
        }
      },
      {
        id: "about-vision-mission",
        type: "pillars_grid",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Institutional Mandate",
          title: "Vision, Mission & Core Values",
          description:
            "Serving students across Puliyangudi and Tenkasi District with disciplined, accessible public-service coaching.",
          sectionId: "",
          tone: "default",
          layout: "vision_mission",
          actionLabel: "",
          actionHref: "",
          cards: [
            {
              badge: "Our Vision",
              accent: "primary",
              title: "Empowering Every Student in Our Community",
              description: "",
              paragraphs: [...TRUST_VISION_MISSION.vision],
              values: []
            },
            {
              badge: "Our Mission",
              accent: "gold",
              title: "Accessible Coaching & Career Guidance",
              description: TRUST_VISION_MISSION.mission,
              paragraphs: [],
              values: TRUST_VISION_MISSION.values.map((v) => ({ ...v }))
            }
          ],
          scheduleTitle: "",
          scheduleItems: [],
          sideImage: "",
          sideImageAlt: "",
          sideCaption: ""
        }
      },
      {
        id: "about-results",
        type: "department_table",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Verified Selection Register",
          title: "Student Achievements & State Rank Milestones",
          description:
            "Selections and certifications earned by PAART Academy students across Tamil Nadu state, central, and skill examinations.",
          sectionId: "results",
          tone: "paper",
          highlights: STATE_RANK_HIGHLIGHTS.map((h) => ({ ...h })),
          rows: DEPARTMENT_SELECTIONS.map((r) => ({ ...r }))
        }
      },
      {
        id: "about-initiatives",
        type: "pillars_grid",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Community Welfare & Skill Development",
          title: "Trust Initiatives & Future Roadmap",
          description:
            "Educational guidance, scholarships, skill certification, and upcoming academic facilities operated by PAART Trust.",
          sectionId: "",
          tone: "default",
          layout: "three_col",
          actionLabel: "",
          actionHref: "",
          cards: TRUST_INITIATIVES.map((item) => ({
            badge: "",
            accent: "none" as const,
            title: item.title,
            description: item.description,
            paragraphs: [],
            values: []
          })),
          scheduleTitle: "",
          scheduleItems: [],
          sideImage: "",
          sideImageAlt: "",
          sideCaption: ""
        }
      },
      {
        id: "about-callout",
        type: "callout_band",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Admissions & Academic Counselling",
          title: "Join PAART Academy's Upcoming Coaching Batch",
          description:
            "Explore our competitive examination programmes or visit our Puliyangudi campus for free academic counselling.",
          primaryCtaLabel: "Online Admission Form",
          primaryCtaHref: "/admissions",
          secondaryCtaLabel: "",
          secondaryCtaHref: ""
        }
      }
    ]
  },
  {
    id: "page-courses",
    slug: "/courses",
    title: "Competitive Examination Courses",
    pageKind: "static_page",
    isSystem: true,
    seo: {
      title: "Competitive Exam Coaching Courses (TNPSC, TNUSRB, TET, SSC, RRB) | PAART Academy",
      description:
        "Explore structured classroom coaching programmes at PAART Academy Puliyangudi for TNPSC Group 1/2/4, TNUSRB Police SI/PC, TET/TRB, SSC, Banking, and Railways.",
      canonicalPath: "/courses",
      ogImage: "/images/course-exam-1.jpg",
      noindex: false
    },
    blocks: [
      {
        id: "courses-banner",
        type: "page_banner",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Academic Prospectus",
          title: "Competitive Examination Courses",
          description:
            "Structured classroom coaching, bilingual Tamil & English study materials, daily topic drills, and full-length mock examinations.",
          breadcrumbs: [{ label: "Courses", href: "" }]
        }
      },
      {
        id: "courses-catalog",
        type: "course_catalog",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Academic Prospectus",
          title: "Competitive Examination Programmes",
          description: "",
          sectionId: "courses",
          tone: "default",
          categoryFilter: "ALL",
          limit: 0,
          showCategoryTabs: true,
          showHeader: false,
          viewAllLabel: "",
          viewAllHref: ""
        }
      },
      {
        id: "courses-callout",
        type: "callout_band",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Admissions & Academic Counselling",
          title: "Need Help Choosing the Right Examination Batch?",
          description:
            "Speak with our Puliyangudi faculty coordinators to match your educational qualification with upcoming notifications.",
          primaryCtaLabel: "Online Admission Form",
          primaryCtaHref: "/admissions",
          secondaryCtaLabel: "",
          secondaryCtaHref: ""
        }
      }
    ]
  },
  {
    id: "page-materials",
    slug: "/materials",
    title: "Study Materials & Revision Notes",
    pageKind: "static_page",
    isSystem: true,
    seo: {
      title: "Free TNPSC, TNUSRB & TET Study Materials | PAART Academy",
      description:
        "Download bilingual Samacheer syllabus notes, OMR practice booklets, and current affairs digests curated by PAART Academy.",
      canonicalPath: "/materials",
      ogImage: "",
      noindex: false
    },
    blocks: [
      {
        id: "materials-banner",
        type: "page_banner",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Open Student Library",
          title: "Study Materials & Revision Notes",
          description:
            "Download structured Samacheer unit notes, General Tamil guides, monthly current affairs capsules, and solved previous-year question papers.",
          breadcrumbs: [{ label: "Study Materials", href: "" }]
        }
      },
      {
        id: "materials-grid",
        type: "materials_catalog",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Open Student Library",
          title: "Free Study Materials & Notes",
          description: "",
          tone: "default",
          layout: "grid",
          categoryFilter: "ALL",
          limit: 0,
          showCategoryTabs: true,
          blogRubric: "",
          blogTitle: "",
          blogLimit: 3
        }
      },
      {
        id: "materials-callout",
        type: "callout_band",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Admissions & Academic Counselling",
          title: "Looking for Printed Booklets & Full OMR Test Series?",
          description:
            "Enrolled classroom and weekend batch students receive printed bilingual booklets and weekly OMR test papers at our Puliyangudi campus.",
          primaryCtaLabel: "Online Admission Form",
          primaryCtaHref: "/admissions",
          secondaryCtaLabel: "",
          secondaryCtaHref: ""
        }
      }
    ]
  },
  {
    id: "page-gallery",
    slug: "/gallery",
    title: "Gallery & Activity Showcase",
    pageKind: "static_page",
    isSystem: true,
    seo: {
      title: "Campus Classrooms, Mock Exams & Achievements Gallery | PAART Academy",
      description:
        "Explore verified photographs and videos of classroom coaching, OMR mock tests, physical endurance training, and state rank holders at PAART Academy.",
      canonicalPath: "/gallery",
      ogImage: "/images/classroom-1.jpg",
      noindex: false
    },
    blocks: [
      {
        id: "gallery-banner",
        type: "page_banner",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Campus & Student Life",
          title: "Gallery & Activity Showcase",
          description:
            "Photographs from PAART Academy classroom batches, weekly OMR model exams, physical track training, rank felicitations, and community guidance camps.",
          breadcrumbs: [{ label: "Gallery", href: "" }]
        }
      },
      {
        id: "gallery-showcase",
        type: "gallery_showcase",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Campus & Student Life",
          title: "Gallery & Activity Showcase",
          description: "",
          tone: "default",
          categoryFilter: "ALL",
          showCategoryTabs: true,
          videosRubric: "Campus Recordings",
          videosTitle: "Classroom & Event Videos",
          videosDescription:
            "Glimpses of classroom discipline, model exams, and student felicitation programmes in Puliyangudi.",
          videos: [
            {
              src: "/videos/paart-video-1.mp4",
              title: "Classroom & Aspirant Preparation Highlights"
            },
            {
              src: "/videos/paart-video-2.mp4",
              title: "PAART Community & Student Guidance Events"
            }
          ]
        }
      },
      {
        id: "gallery-callout",
        type: "callout_band",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Admissions & Academic Counselling",
          title: "Experience Our Study Hall & Classroom Batches in Person",
          description:
            "Visit our Puliyangudi campus Monday through Saturday to tour the library, classrooms, and upcoming batch schedules.",
          primaryCtaLabel: "Online Admission Form",
          primaryCtaHref: "/admissions",
          secondaryCtaLabel: "",
          secondaryCtaHref: ""
        }
      }
    ]
  },
  {
    id: "page-blogs",
    slug: "/blogs",
    title: "Exam Strategy & Preparation Articles",
    pageKind: "static_page",
    isSystem: true,
    seo: {
      title: "Exam Preparation Guides & Strategy Articles | PAART Academy",
      description:
        "Read practical study plans, syllabus breakdowns, and physical test preparation guides written by PAART Academy mentors.",
      canonicalPath: "/blogs",
      ogImage: "",
      noindex: false
    },
    blocks: [
      {
        id: "blogs-banner",
        type: "page_banner",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Academic Gazette & Guidance",
          title: "Exam Strategy & Preparation Articles",
          description:
            "Practical study schedules, Samacheer syllabus strategies, and exam readiness articles prepared by the PAART Academic Team.",
          breadcrumbs: [{ label: "Exam Blog", href: "" }]
        }
      },
      {
        id: "blogs-feed",
        type: "blog_feed",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Academic Gazette & Guidance",
          title: "Exam Strategy & Preparation Articles",
          description: "",
          tone: "default",
          showHeader: false,
          limit: 0
        }
      },
      {
        id: "blogs-callout",
        type: "callout_band",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Admissions & Academic Counselling",
          title: "Want Personalised Guidance for Your Target Exam?",
          description:
            "Meet our mentors in Puliyangudi to build a realistic daily timetable around your qualification.",
          primaryCtaLabel: "Online Admission Form",
          primaryCtaHref: "/admissions",
          secondaryCtaLabel: "",
          secondaryCtaHref: ""
        }
      }
    ]
  },
  {
    id: "page-faq",
    slug: "/faq",
    title: "Frequently Asked Questions",
    pageKind: "static_page",
    isSystem: true,
    seo: {
      title: "Frequently Asked Questions | PAART Academy Puliyangudi",
      description:
        "Clear answers on PAART Academy batch timings, bilingual study materials, physical training, scholarship eligibility, and admission steps.",
      canonicalPath: "/faq",
      ogImage: "",
      noindex: false
    },
    blocks: [
      {
        id: "faq-banner",
        type: "page_banner",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Student & Parent Help Desk",
          title: "Frequently Asked Questions",
          description:
            "Clear answers about PAART Academy's batch timings, Tamil & English study materials, OMR test series, physical coaching, and fee scholarships.",
          breadcrumbs: [{ label: "FAQ", href: "" }]
        }
      },
      {
        id: "faq-accordion-main",
        type: "faq_accordion",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Student & Parent Help Desk",
          title: "Frequently Asked Questions",
          description: "",
          tone: "default",
          showHeader: false,
          actionLabel: "",
          actionHref: "",
          categories: PAART_FAQ_CATEGORIES.map((cat) => ({
            id: cat.id,
            title: cat.title,
            items: cat.items.map((item) => ({ ...item }))
          }))
        }
      },
      {
        id: "faq-callout",
        type: "callout_band",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Admissions & Academic Counselling",
          title: "Still Have Questions About Exam Eligibility or Scholarships?",
          description:
            "Speak directly with our Puliyangudi academic mentors or send us an enquiry.",
          primaryCtaLabel: "Contact Campus Coordinator",
          primaryCtaHref: "/contact",
          secondaryCtaLabel: "",
          secondaryCtaHref: ""
        }
      }
    ]
  },
  {
    id: "page-contact",
    slug: "/contact",
    title: "Contact PAART Academy",
    pageKind: "static_page",
    isSystem: true,
    seo: {
      title: "Contact PAART Academy & Campus Directions | Puliyangudi",
      description: `Reach PAART Academy at ${TRUST_PROFILE.phone} or visit our Puliyangudi campus (${TRUST_PROFILE.addressPrimary}) for batch timings and free counselling.`,
      canonicalPath: "/contact",
      ogImage: "",
      noindex: false
    },
    blocks: [
      {
        id: "contact-banner",
        type: "page_banner",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Campus Offices & Counselling",
          title: "Contact PAART Academy",
          description:
            "Visit our Puliyangudi campus in person for academic counselling, batch schedules, syllabus guidance, or scholarship enquiries.",
          breadcrumbs: [{ label: "Contact", href: "" }]
        }
      },
      {
        id: "contact-hub-main",
        type: "contact_hub",
        enabled: true,
        visibilityRule: "",
        data: {
          heading: "Puliyangudi Campus Offices",
          primaryOfficeLabel: "Primary Office & Classroom",
          secondaryOfficeLabel: "Training Hall",
          phoneLabel: "Admissions & WhatsApp Helpline",
          emailLabel: "Official Email",
          hoursLabel: "Campus & Study Hall Hours",
          showMap: true,
          returnTo: "/contact"
        }
      }
    ]
  },
  {
    id: "page-admissions",
    slug: "/admissions",
    title: "Online Student Admission Application",
    pageKind: "static_page",
    isSystem: true,
    seo: {
      title: "Online Student Admission Application | PAART Academy Puliyangudi",
      description:
        "Apply online for TNPSC, TNUSRB Police, TET/TRB, SSC, Banking, Railways, NMMS, and Skill certification coaching batches at PAART Academy.",
      canonicalPath: "/admissions",
      ogImage: "",
      noindex: false
    },
    blocks: [
      {
        id: "admissions-banner",
        type: "page_banner",
        enabled: true,
        visibilityRule: "",
        data: {
          rubric: "Student Admissions Desk",
          title: "Student Admission Application Form",
          description:
            "Complete the student registration form below to apply for classroom coaching, weekend batches, or skill certification at PAART Academy, Puliyangudi.",
          breadcrumbs: [{ label: "Admission Form", href: "" }]
        }
      },
      {
        id: "admissions-form-main",
        type: "admission_form",
        enabled: true,
        visibilityRule: "",
        data: {
          tone: "default"
        }
      }
    ]
  },
  {
    id: "template-course-detail",
    slug: "template:course-detail",
    title: "Course Detail Page Layout Template",
    pageKind: "collection_template",
    isSystem: true,
    seo: {
      title: "Programme Detail Template | PAART Academy",
      description: "Shared block layout template wrapping every /courses/:slug detail page.",
      canonicalPath: "",
      ogImage: "",
      noindex: false
    },
    blocks: [
      {
        id: "course-detail-main",
        type: "entity_detail_main",
        enabled: true,
        visibilityRule: "",
        data: {
          entityKind: "course",
          ctaHeading: "Register for Upcoming Batch",
          ctaSubtext:
            "Submit your admission registration online or visit our Puliyangudi office for batch counselling.",
          ctaLabel: "Online Admission Form",
          ctaHref: "/admissions"
        }
      }
    ]
  },
  {
    id: "template-blog-detail",
    slug: "template:blog-detail",
    title: "Blog Article Detail Page Layout Template",
    pageKind: "collection_template",
    isSystem: true,
    seo: {
      title: "Article Detail Template | PAART Academy",
      description: "Shared block layout template wrapping every /blogs/:slug article page.",
      canonicalPath: "",
      ogImage: "",
      noindex: false
    },
    blocks: [
      {
        id: "blog-detail-main",
        type: "entity_detail_main",
        enabled: true,
        visibilityRule: "",
        data: {
          entityKind: "blog",
          ctaHeading: "Preparing for an upcoming government examination?",
          ctaSubtext: "Join structured classroom batches and daily test series at PAART Academy.",
          ctaLabel: "Online Admission Form",
          ctaHref: "/admissions"
        }
      }
    ]
  }
]

export function findDefaultPageBySlug(slug: string): DefaultPageSeed | null {
  return DEFAULT_PAGES.find((p) => p.slug === slug) ?? null
}
