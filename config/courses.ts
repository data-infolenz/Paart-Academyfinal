export const COURSE_CATEGORIES = [
  "TNPSC",
  "TNUSRB",
  "TET / TRB",
  "SSC",
  "BANKING",
  "RAILWAY"
] as const

export type CourseCategory = (typeof COURSE_CATEGORIES)[number]

export interface CourseDetailSpec {
  overview: string
  whoCanJoin: string
  preparationFocus: string
  keyAreas: string
  support: string
  outcome: string
}

export interface SeedCourseItem {
  id: string
  slug: string
  title: string
  category: CourseCategory
  shortDescription: string
  duration: string
  eligibility: string
  image: string
  features: string[]
  examStages: string[]
  details: CourseDetailSpec
  enabled: boolean
  displayOrder: number
}

export const SEED_COURSES: SeedCourseItem[] = [
  {
    id: "group-1",
    slug: "tnpsc-group-1",
    title: "TNPSC Group I",
    category: "TNPSC",
    shortDescription:
      "Structured three-stage preparation for aspirants targeting Tamil Nadu's premier civil and administrative services.",
    duration: "10–12 Months · Weekday & Weekend Batches",
    eligibility: "Any recognized Bachelor's Degree",
    image: "/images/course-exam-1.jpg",
    features: ["General Studies", "Mains Answer Writing", "Interview Mentoring"],
    examStages: ["Preliminary", "Mains", "Interview"],
    details: {
      overview:
        "A structured preparation programme for candidates aiming for senior administrative and civil service positions through the TNPSC Group I examination.",
      whoCanJoin: "Graduates preparing for Tamil Nadu state-level administrative services.",
      preparationFocus:
        "Preliminary Examination, Main Descriptive Examination, Answer Writing, Current Affairs, and Interview Guidance.",
      keyAreas:
        "General Studies, Aptitude & Mental Ability, Indian Polity, History, Geography, Economy, Science & Technology, Tamil Nadu Administration, and Current Affairs.",
      support:
        "Bilingual study materials, weekly tests, Mains answer evaluation, full-length mock examinations, and individual performance reviews.",
      outcome:
        "Builds strong conceptual mastery, descriptive writing clarity, and disciplined exam strategy across all three stages."
    },
    enabled: true,
    displayOrder: 1
  },
  {
    id: "group-2",
    slug: "tnpsc-group-2",
    title: "TNPSC Group II",
    category: "TNPSC",
    shortDescription:
      "Comprehensive coaching across Preliminary and Main stages for executive Tamil Nadu state government posts.",
    duration: "8–10 Months · Weekday & Weekend Batches",
    eligibility: "Any recognized Bachelor's Degree",
    image: "/images/course-exam-2.jpg",
    features: ["Tamil / English Language", "Aptitude", "Full-Length Mock Tests"],
    examStages: ["Preliminary", "Mains"],
    details: {
      overview:
        "Comprehensive preparation for candidates appearing for TNPSC Group II recruitment examinations.",
      whoCanJoin: "Graduates interested in executive Tamil Nadu government services.",
      preparationFocus:
        "Preliminary screening, Main examination mastery, and systematic revision cycles.",
      keyAreas:
        "General Studies, General Tamil / General English, Aptitude, Polity, Economy, History, Geography, Science, and Current Affairs.",
      support:
        "Topic-wise classroom sessions, daily question drills, OMR mock tests, updated study materials, and revision workshops.",
      outcome: "Develops thorough subject command, speed, accuracy, and exam-hall confidence."
    },
    enabled: true,
    displayOrder: 2
  },
  {
    id: "group-2a",
    slug: "tnpsc-group-2a",
    title: "TNPSC Group IIA",
    category: "TNPSC",
    shortDescription:
      "Focused preparation for non-interview state government positions with a disciplined revision and test schedule.",
    duration: "6–8 Months · Weekday & Weekend Batches",
    eligibility: "Any recognized Bachelor's Degree",
    image: "/images/course-exam-3.jpg",
    features: ["Syllabus Completion", "Revision Plans", "Score Analytics"],
    examStages: ["Preliminary", "Mains"],
    details: {
      overview:
        "Focused preparation for candidates targeting non-interview ministerial and secretariat posts under TNPSC Group IIA.",
      whoCanJoin: "Graduates preparing for Group IIA government positions.",
      preparationFocus:
        "Preliminary and Main examination preparation with high-volume objective practice.",
      keyAreas:
        "General Studies, Aptitude, Tamil Eligibility, State Administration, Economy, Polity, and Current Affairs.",
      support:
        "Regular unit tests, structured revision timetables, printed/PDF notes, and doubt clarification.",
      outcome: "Provides a repeatable preparation system for high-scoring consistency."
    },
    enabled: true,
    displayOrder: 3
  },
  {
    id: "group-4",
    slug: "tnpsc-group-4",
    title: "TNPSC Group IV",
    category: "TNPSC",
    shortDescription:
      "Foundation-to-rank coaching for Group IV single-stage written exams, covering General Tamil, GS, and Maths.",
    duration: "6 Months · Regular & Weekend Batches",
    eligibility: "SSLC (10th Standard) & above as per notification",
    image: "/images/course-exam-4.jpg",
    features: ["General Tamil Focus", "Daily OMR Practice", "Previous Papers"],
    examStages: ["Single Written Exam"],
    details: {
      overview:
        "A foundation-to-exam-level programme designed for candidates preparing for TNPSC Group IV clerical, typist, and field posts.",
      whoCanJoin: "Eligible SSLC, Higher Secondary, and graduate candidates.",
      preparationFocus:
        "Strong Samacheer Kalvi basics, objective accuracy, Tamil scoring mastery, and full-length OMR mocks.",
      keyAreas:
        "General Tamil (Part A), General Studies, Aptitude & Mental Ability, Tamil Nadu History, Polity, Economy, and Current Affairs.",
      support:
        "Concept-first teaching, daily test drills, previous-year paper walkthroughs, and error tracking.",
      outcome: "Maximizes accuracy and time management for high cut-off Group IV competition."
    },
    enabled: true,
    displayOrder: 4
  },
  {
    id: "vao",
    slug: "vao",
    title: "Village Administrative Officer (VAO)",
    category: "TNPSC",
    shortDescription:
      "Dedicated coaching for revenue and village administration aspirants with Tamil Nadu governance focus.",
    duration: "6 Months · Regular & Weekend Batches",
    eligibility: "SSLC (10th Standard) & above",
    image: "/images/course-exam-5.jpg",
    features: ["Village Administration Basics", "Previous Papers", "Guided Revision"],
    examStages: ["Written Exam"],
    details: {
      overview: "Focused preparation for Village Administrative Officer recruitment under TNPSC.",
      whoCanJoin: "Candidates aspiring to serve in grassroots revenue and village administration.",
      preparationFocus:
        "General Tamil, General Studies, revenue fundamentals, and quantitative aptitude.",
      keyAreas:
        "General Studies, Tamil, Mathematics, Reasoning, Tamil Nadu History, Geography, Polity, and Village Administration.",
      support: "Unit tests, model OMR exams, previous-year analysis, and bilingual study handouts.",
      outcome: "Establishes a rock-solid foundation for VAO and combined Group IV examinations."
    },
    enabled: true,
    displayOrder: 5
  },
  {
    id: "tnusrb-si",
    slug: "tnusrb-si",
    title: "TNUSRB Sub-Inspector (SI)",
    category: "TNUSRB",
    shortDescription:
      "Disciplined written exam and physical stage guidance from the academy behind Puliyangudi's historic direct SI selection.",
    duration: "6–8 Months · Written + Physical Guidance",
    eligibility: "Any recognized Bachelor's Degree",
    image: "/images/course-exam-1.jpg",
    features: ["Psychology & GK", "Physical Endurance Guidance", "Viva Preparation"],
    examStages: ["Written Exam", "Physical Efficiency Test", "Viva-Voce"],
    details: {
      overview:
        "Structured preparation for candidates aspiring to become Sub-Inspectors of Police through TNUSRB recruitment.",
      whoCanJoin: "Eligible graduates who meet TNUSRB physical and academic standards.",
      preparationFocus:
        "Written examination scoring alongside structured physical test readiness and interview poise.",
      keyAreas:
        "General Knowledge, Police Psychology, Logical Reasoning, Numerical Ability, Tamil Eligibility, and Current Affairs.",
      support:
        "Timed mock tests, psychology drill sets, physical coaching guidance, and officer mentorship.",
      outcome:
        "Equips aspirants with written accuracy, analytical speed, and uniformed-service discipline."
    },
    enabled: true,
    displayOrder: 6
  },
  {
    id: "police-constable",
    slug: "police-constable",
    title: "TNUSRB Grade II Police Constable",
    category: "TNUSRB",
    shortDescription:
      "Proven written + physical coaching programme backed by PAART's State 1st Rank BCM track record.",
    duration: "4–6 Months · Regular Batches",
    eligibility: "10th Standard (SSLC) Pass",
    image: "/images/course-exam-2.jpg",
    features: ["Psychology & Tamil GK", "Model Exams", "Physical Track Support"],
    examStages: ["Written Exam", "Physical Measurement & Efficiency Test"],
    details: {
      overview:
        "An exam-focused programme for Grade II Police Constable, Jail Warder, and Fireman recruitment.",
      whoCanJoin: "SSLC-qualified candidates aspiring to join Tamil Nadu uniformed services.",
      preparationFocus:
        "High-accuracy written preparation paired with physical endurance awareness.",
      keyAreas:
        "General Knowledge, Psychology, Tamil Eligibility, Mathematics, Science, and Current Affairs.",
      support:
        "Daily practice tests, state-level model exams, physical coaching sessions, and doubt clearing.",
      outcome:
        "Builds exam speed, accuracy, and physical readiness to clear both stages decisively."
    },
    enabled: true,
    displayOrder: 7
  },
  {
    id: "tet",
    slug: "tet",
    title: "TNTET (Paper I & Paper II)",
    category: "TET / TRB",
    shortDescription:
      "Concept-driven coaching in Child Development, Pedagogy, Languages, and core subjects for aspiring teachers.",
    duration: "5–6 Months · Weekday & Weekend Batches",
    eligibility: "D.El.Ed / B.Ed as per Paper I & II norms",
    image: "/images/course-exam-3.jpg",
    features: ["Child Pedagogy", "Paper I & II Tracks", "30+ Past Qualifiers"],
    examStages: ["Paper I (Primary)", "Paper II (Graduate Teacher)"],
    details: {
      overview:
        "Concept-based preparation for Teacher Eligibility Test (TNTET) Paper I and Paper II.",
      whoCanJoin: "D.El.Ed and B.Ed teacher aspirants meeting TRB eligibility criteria.",
      preparationFocus:
        "Child Development & Pedagogy mastery alongside school-textbook subject depth.",
      keyAreas:
        "Child Development & Pedagogy, Tamil, English, Mathematics & Science / Social Science.",
      support:
        "Pedagogy workshops, textbook line-by-line tests, previous TRB papers, and full mocks.",
      outcome: "Strengthens pedagogical clarity and subject command to qualify comfortably."
    },
    enabled: true,
    displayOrder: 8
  },
  {
    id: "ssc",
    slug: "ssc",
    title: "SSC Coaching (CGL / CHSL / MTS)",
    category: "SSC",
    shortDescription:
      "Central government exam foundation focusing on Quantitative Aptitude, Reasoning, English, and General Awareness.",
    duration: "6–8 Months · CBT Focused",
    eligibility: "10th / 12th / Degree (exam-specific)",
    image: "/images/course-exam-4.jpg",
    features: ["Speed Maths", "English Comprehension", "Tier I & II CBT Mocks"],
    examStages: ["Tier I (CBT)", "Tier II (CBT)"],
    details: {
      overview:
        "Comprehensive coaching for Staff Selection Commission central government recruitments (CGL, CHSL, GD, MTS).",
      whoCanJoin: "10th, +2, and graduate aspirants targeting central government departments.",
      preparationFocus:
        "Calculation speed, reasoning shortcuts, English grammar/comprehension, and static GK.",
      keyAreas:
        "Arithmetic, Advance Maths, Logical Reasoning, English Language, General Science, and Current Events.",
      support:
        "Timed sectional drills, shortcut worksheets, CBT test analysis, and bilingual explanations.",
      outcome: "Builds national-level CBT speed and accuracy across Tier I and Tier II."
    },
    enabled: true,
    displayOrder: 9
  },
  {
    id: "banking",
    slug: "banking",
    title: "Banking Exams (IBPS / SBI Clerk & PO)",
    category: "BANKING",
    shortDescription:
      "High-speed reasoning, data interpretation, quantitative aptitude, and banking awareness preparation.",
    duration: "6 Months · Intensive Practice",
    eligibility: "Any recognized Bachelor's Degree",
    image: "/images/course-exam-5.jpg",
    features: ["Puzzles & Seating", "Data Interpretation", "Banking & Economy GK"],
    examStages: ["Preliminary", "Mains", "Interview (PO)"],
    details: {
      overview:
        "Targeted preparation for IBPS, SBI, and Regional Rural Bank Clerk and Probationary Officer exams.",
      whoCanJoin: "Graduates seeking careers in public sector and nationalized banks.",
      preparationFocus:
        "Sectional timing, puzzle solving, Data Interpretation, and financial awareness.",
      keyAreas:
        "Quantitative Aptitude, Logical Reasoning, English Language, Banking & Financial Awareness, and Computer Knowledge.",
      support:
        "Timed sectional tests, shortcut drills, Mains-level DI practice, and interview prep.",
      outcome:
        "Sharpens speed and precision to clear strict sectional and overall banking cut-offs."
    },
    enabled: true,
    displayOrder: 10
  },
  {
    id: "railway",
    slug: "railway",
    title: "RRB Railway Coaching (NTPC / ALP / Group D)",
    category: "RAILWAY",
    shortDescription:
      "Guided study framework covering General Science, Mathematics, and Reasoning for Indian Railways CBT exams.",
    duration: "5–6 Months · Regular & Weekend Batches",
    eligibility: "10th / ITI / +2 / Degree (post-specific)",
    image: "/images/course-exam-1.jpg",
    features: ["NCERT/Samacheer Science", "Maths & Reasoning", "CBT Mock Series"],
    examStages: ["CBT Stage I", "CBT Stage II / Skill Test"],
    details: {
      overview:
        "Structured coaching for Railway Recruitment Board (NTPC, Group D, ALP, Technician) examinations.",
      whoCanJoin: "10th, ITI, diploma, and degree holders eligible for RRB notifications.",
      preparationFocus:
        "High-weightage General Science, numerical aptitude, and non-verbal/verbal reasoning.",
      keyAreas:
        "Mathematics, General Intelligence & Reasoning, Physics, Chemistry, Life Sciences, and Current Affairs.",
      support:
        "Previous RRB shift paper practice, topic revision sheets, and full-length mock tests.",
      outcome: "Equips students with reliable CBT scoring consistency for Indian Railways careers."
    },
    enabled: true,
    displayOrder: 11
  }
]

export interface SeedMaterialItem {
  id: string
  title: string
  category: string
  description: string
  fileUrl: string
  externalUrl: string
  published: boolean
  displayOrder: number
}

export const SEED_MATERIALS: SeedMaterialItem[] = [
  {
    id: "mat-general-studies",
    title: "TNPSC General Studies Complete Foundation Notes",
    category: "Study Material",
    description:
      "Structured unit-wise syllabus notes aligned with Tamil Nadu Samacheer Kalvi standards.",
    fileUrl: "/study-materials/general-studies.pdf",
    externalUrl: "",
    published: true,
    displayOrder: 1
  },
  {
    id: "mat-general-tamil",
    title: "General Tamil (Pothu Tamil) Eligibility & Scoring Guide",
    category: "Study Material",
    description:
      "Grammar, literature, and scholars quick-revision compilation for Group II, IIA & IV.",
    fileUrl: "/study-materials/tamil.pdf",
    externalUrl: "",
    published: true,
    displayOrder: 2
  },
  {
    id: "mat-aptitude",
    title: "Aptitude & Mental Ability Formula Handbook",
    category: "Study Material",
    description:
      "Topic-wise solved models covering percentages, ratios, time & work, mensuration, and reasoning.",
    fileUrl: "/study-materials/aptitude.pdf",
    externalUrl: "",
    published: true,
    displayOrder: 3
  },
  {
    id: "mat-polity",
    title: "Indian Polity & Constitution Quick Revision",
    category: "Notes",
    description:
      "Key articles, schedules, amendments, parliamentary procedures, and state governance.",
    fileUrl: "/study-materials/indian-polity.pdf",
    externalUrl: "",
    published: true,
    displayOrder: 4
  },
  {
    id: "mat-history",
    title: "Indian National Movement & Tamil Nadu Heritage",
    category: "Notes",
    description:
      "Chronological timelines, freedom fighters of Tamil Nadu, and socio-religious reform movements.",
    fileUrl: "/study-materials/history.pdf",
    externalUrl: "",
    published: true,
    displayOrder: 5
  },
  {
    id: "mat-economy",
    title: "Indian & Tamil Nadu Economy Essentials",
    category: "Notes",
    description:
      "Five-year plans, RBI, fiscal policy, welfare schemes, and Tamil Nadu development indicators.",
    fileUrl: "/study-materials/economy.pdf",
    externalUrl: "",
    published: true,
    displayOrder: 6
  },
  {
    id: "mat-current-affairs",
    title: "Monthly Current Affairs Capsule (Tamil & English)",
    category: "Current Affairs",
    description: "Exam-focused state, national, science, awards, and government scheme updates.",
    fileUrl: "/study-materials/current-affairs.pdf",
    externalUrl: "",
    published: true,
    displayOrder: 7
  },
  {
    id: "mat-pyq",
    title: "Solved Previous Year Question Bank (TNPSC & TNUSRB)",
    category: "Question Bank",
    description: "Official past papers with answer keys and topic-frequency insights.",
    fileUrl: "/study-materials/previous-year-questions.pdf",
    externalUrl: "",
    published: true,
    displayOrder: 8
  }
]

export interface SeedBlogItem {
  id: string
  slug: string
  title: string
  shortDescription: string
  content: string
  author: string
  publishedDate: string
  category: string
  featuredImage: string
  seoTitle: string
  metaDescription: string
  published: boolean
}

export const SEED_BLOGS: SeedBlogItem[] = [
  {
    id: "blog-tnpsc-group-4-plan",
    slug: "how-to-prepare-for-tnpsc-group-4",
    title: "How to Prepare for TNPSC Group 4 with a Clear Weekly Study Plan",
    shortDescription:
      "A practical preparation rhythm for Group 4 aspirants covering Samacheer books, General Tamil, daily aptitude, and OMR mock review.",
    content: [
      "TNPSC Group 4 rewards consistency far more than last-minute cramming. Because hundreds of thousands of candidates compete for a single-stage objective paper, every mark in General Tamil, Aptitude, and General Studies shifts your state rank significantly.",
      "1. Anchor Your Preparation in Samacheer Kalvi Textbooks: Start with 6th to 10th Standard Tamil, Science, and Social Science textbooks before moving to selective 11th and 12th units. Build short self-written margin notes as you finish each term.",
      "2. Treat General Tamil (100 Questions) as Your Rank Engine: Dedicate the first 90 minutes of every morning to Tamil grammar (Ilakkanam), Sangam & modern literature, and Tamil scholars. Aim for 95+ accuracy through daily 50-question drills.",
      "3. Solve 20 Aptitude Problems Daily: Arithmetic and logical reasoning carry 25 assured questions. Practising 20 problems every day builds automatic recognition of HCF/LCM, percentages, simple/compound interest, and series patterns.",
      "4. Weekly OMR Mock & Mistake Register: Every weekend at PAART Academy, students sit for timed OMR tests and log every wrong answer into three buckets — concept gap, misread question, or time pressure — so errors are never repeated."
    ].join("\n\n"),
    author: "PAART Academic Team",
    publishedDate: "2026-08-01",
    category: "TNPSC Strategy",
    featuredImage: "/images/classroom-2.jpg",
    seoTitle: "TNPSC Group 4 Weekly Study Plan & Preparation Guide | PAART Academy",
    metaDescription:
      "Step-by-step TNPSC Group 4 study plan from PAART Academy Puliyangudi covering General Tamil, Samacheer books, Aptitude, and OMR mock tests.",
    published: true
  },
  {
    id: "blog-daily-current-affairs",
    slug: "daily-current-affairs-for-tnpsc",
    title: "Why Daily Current Affairs Habits Decide Competitive Exam Cut-Offs",
    shortDescription:
      "How a 30-minute daily reading routine connects current events with Polity, Economy, and Science syllabus topics.",
    content: [
      "Many aspirants postpone Current Affairs until two weeks before the examination, turning an easy scoring area into overwhelming memorization. When studied daily for 30 minutes, current events reinforce your static General Studies subjects naturally.",
      "1. Link Headlines to Static Syllabus Units: When reading about a new Tamil Nadu welfare initiative or constitutional judgement, immediately connect it to the relevant Polity article, economic indicator, or district geography.",
      "2. Maintain Concise Monthly Capsules: Focus on government schemes, science & ISRO milestones, state awards, sports, and official appointments rather than transient political commentary.",
      "3. Revise in Weekly & Monthly Cycles: At PAART Academy, daily classroom highlights are consolidated into monthly bilingual Tamil and English revision sheets followed by objective quizzes."
    ].join("\n\n"),
    author: "PAART Academic Team",
    publishedDate: "2026-08-10",
    category: "Current Affairs",
    featuredImage: "/images/classroom-3.jpg",
    seoTitle: "Daily Current Affairs Strategy for TNPSC & Govt Exams | PAART Academy",
    metaDescription:
      "Learn how to study daily current affairs effectively for TNPSC, TNUSRB, SSC, and Banking examinations with PAART Academy.",
    published: true
  },
  {
    id: "blog-tnusrb-preparation",
    slug: "tnusrb-police-si-constable-preparation-guide",
    title: "Balancing Written Accuracy and Physical Readiness for TNUSRB Exams",
    shortDescription:
      "Lessons from PAART Academy's State 1st Rank BCM Constable and historic Sub-Inspector selections in Puliyangudi.",
    content: [
      "Uniformed services recruitment under TNUSRB (Sub-Inspector and Grade II Police Constable) demands dual discipline: high written scores in General Knowledge & Psychology alongside consistent physical track conditioning.",
      "1. Master Psychology & Logical Reasoning Early: Psychology questions test observation, numerical reasoning, and situational clarity. Regular practice makes this the highest-accuracy section on exam day.",
      "2. Start Physical Conditioning Alongside Classroom Prep: Waiting until written results are announced leaves too little recovery time for rope climbing, long jump, and endurance runs. Morning track routines keep both mind and body sharp.",
      "3. Full-Length Model Examinations: Simulating real exam timing eliminates anxiety and builds the composure needed to top state-level merit lists."
    ].join("\n\n"),
    author: "PAART Uniformed Services Wing",
    publishedDate: "2026-09-05",
    category: "TNUSRB",
    featuredImage: "/images/paart-event-6-1.jpg",
    seoTitle: "TNUSRB SI & Police Constable Preparation Guide | PAART Academy",
    metaDescription:
      "Practical written and physical preparation strategy for TNUSRB Sub-Inspector and Grade II Police Constable aspirants.",
    published: true
  }
]

export interface SeedGalleryItem {
  id: string
  title: string
  description: string
  category: "Classroom" | "Model Exams" | "Physical Coaching" | "Achievements" | "Community"
  image: string
  displayOrder: number
}

export const SEED_GALLERY: SeedGalleryItem[] = [
  {
    id: "gal-1",
    title: "Focused Classroom Coaching Session",
    description:
      "Aspirants attending structured General Studies lecture at PAART Academy Puliyangudi.",
    category: "Classroom",
    image: "/images/classroom-1.jpg",
    displayOrder: 1
  },
  {
    id: "gal-2",
    title: "Guided Mentorship & Syllabus Review",
    description: "Faculty guiding students through topic-wise competitive exam revision.",
    category: "Classroom",
    image: "/images/classroom-2.jpg",
    displayOrder: 2
  },
  {
    id: "gal-3",
    title: "Grade II Police Constable Model Exam",
    description: "Full-length OMR model examination conducted for TNUSRB aspirants.",
    category: "Model Exams",
    image: "/images/paart-event-5-1.jpg",
    displayOrder: 3
  },
  {
    id: "gal-4",
    title: "Physical Endurance & Track Coaching",
    description:
      "Outdoor physical efficiency training for Sub-Inspector and Police Constable batches.",
    category: "Physical Coaching",
    image: "/images/paart-event-6-1.jpg",
    displayOrder: 4
  },
  {
    id: "gal-5",
    title: "Government Officers Felicitation & Guidance",
    description: "Serving government officers and Sub-Inspectors mentoring PAART students.",
    category: "Achievements",
    image: "/images/paart-event-9-2.jpg",
    displayOrder: 5
  },
  {
    id: "gal-6",
    title: "Career Awareness Seminar on Public Service",
    description: "Community seminar highlighting government job pathways for students and parents.",
    category: "Community",
    image: "/images/paart-event-8-1.jpg",
    displayOrder: 6
  },
  {
    id: "gal-7",
    title: "Student Essay & Talent Competition",
    description: "Encouraging school and college students toward civil service awareness.",
    category: "Community",
    image: "/images/paart-event-10-1.jpg",
    displayOrder: 7
  },
  {
    id: "gal-8",
    title: "Classroom Discussion & Doubt Clearing",
    description: "Interactive bilingual problem-solving session at PAART Academy.",
    category: "Classroom",
    image: "/images/classroom-discussion.jpg",
    displayOrder: 8
  },
  {
    id: "gal-9",
    title: "State Rank & Qualifier Felicitation",
    description: "Celebrating PAART qualifiers across TNPSC, TET, NMMS, and TNUSRB exams.",
    category: "Achievements",
    image: "/images/achievement-1.jpg",
    displayOrder: 9
  }
]
