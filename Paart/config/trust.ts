export const TRUST_PROFILE = {
  shortName: "PAART Academy",
  legalName: "Puliyangudi Academic & Achievements Resource Trust",
  establishedDate: "2018-12-22",
  establishedLabel: "22 December 2018",
  tagline: "Structured Government Exam Coaching & Community Career Guidance",
  summary:
    "PAART is a public educational & welfare trust in Puliyangudi, Tenkasi District, empowering students and government job aspirants with structured exam coaching, bilingual mentoring, scholarships, and career guidance.",
  phone: "+91 6382450070",
  phoneHref: "tel:+916382450070",
  whatsapp: "916382450070",
  whatsappHref: "https://wa.me/916382450070",
  email: "paart.com@gmail.com",
  addressPrimary: "85, Lebbaisaburam Street, Puliyangudi, Tenkasi District, Tamil Nadu 627855",
  addressSecondary: "Jamalia Jumma Pallivasal Complex, Jinnah Nagar 3rd Street, Puliyangudi",
  hours: "Monday – Saturday, 9:00 AM – 7:00 PM"
} as const

export interface ImpactMetric {
  label: string
  count: string
  detail: string
}

export const IMPACT_METRICS: ImpactMetric[] = [
  {
    label: "Total Selections & Qualifiers",
    count: "323+",
    detail: "Across state, central & skill exams"
  },
  { label: "TNPSC Selections", count: "53", detail: "Group I, II, IIA, IV & VAO posts" },
  { label: "TET & NMMS Qualifiers", count: "62", detail: "30 TET teachers & 32 NMMS scholars" },
  {
    label: "Skills & Steno Certified",
    count: "206",
    detail: "130 Computer, 70 Typewriting & 6 Steno"
  }
]

export const DEPARTMENT_SELECTIONS = [
  { department: "TNPSC Civil & Group Services", count: 53 },
  { department: "Teacher Eligibility Test (TET)", count: 30 },
  { department: "NMMS School Scholarship", count: 32 },
  { department: "Staff Selection Commission (SSC)", count: 2 },
  { department: "Typewriting Certification", count: 70 },
  { department: "Stenography Examination", count: 6 },
  { department: "Basic Computer Course", count: 130 }
] as const

export const STATE_RANK_HIGHLIGHTS = [
  {
    title: "State 1st Rank — Steno Examination",
    badge: "BCM Category",
    description:
      "Secured Tamil Nadu State-level First Rank in the Government Stenography Examination."
  },
  {
    title: "State 1st Rank — Grade II Police Constable",
    badge: "BCM Category",
    description:
      "Achieved State-level First Rank in the TNUSRB Grade II Police Constable written examination."
  },
  {
    title: "Historic Direct Sub-Inspector Selection",
    badge: "Puliyangudi Milestone",
    description:
      "Produced the first direct Sub-Inspector selection from the BCM category in Puliyangudi town history."
  }
] as const

export const TRUST_PILLARS = [
  {
    title: "Structured Syllabus & Study Plan",
    description:
      "Weekly topic schedules, bilingual Tamil & English instruction, and dedicated study hall discipline tailored to official exam notifications."
  },
  {
    title: "Daily Current Affairs & Test Series",
    description:
      "Daily revision capsules, subject-wise practice sets, OMR/CBT full-length mock exams, and previous-year paper analysis."
  },
  {
    title: "Personal Mentoring & Doubt Clearing",
    description:
      "Individual score tracking, answer-writing feedback, physical endurance guidance for uniformed services, and interview mentoring."
  },
  {
    title: "Community Scholarships & Welfare",
    description:
      "Accessible fee support for economically weaker students, higher-education counselling, NMMS school coaching, and skill training."
  }
] as const

export const TRUST_VISION_MISSION = {
  vision: [
    "To create an empowered and educated community where every student has access to the guidance, training, skills, and opportunities required to achieve their full potential.",
    "PAART envisions serving as a trusted educational institution that helps students progress toward higher education, government public service, professional careers, and responsible citizenship."
  ],
  mission:
    "To provide accessible, structured, and high-quality competitive exam coaching, career guidance, and skill training for students and job aspirants regardless of economic background.",
  values: [
    {
      title: "Equal Opportunity",
      description:
        "Ensuring quality exam guidance reaches deserving students from every economic background."
    },
    {
      title: "Academic Discipline",
      description:
        "Consistent daily testing, syllabus completion, and measurable progress tracking."
    },
    {
      title: "Integrity & Service",
      description:
        "Transparent public welfare trust governance dedicated to genuine student outcomes."
    },
    {
      title: "Holistic Growth",
      description:
        "Building communication, confidence, typing/computer literacy, and career clarity alongside exam prep."
    }
  ]
} as const

export const TRUST_INITIATIVES = [
  {
    title: "Competitive Examination Coaching",
    description:
      "Classroom coaching and test series for TNPSC Groups, TNUSRB SI/PC, TET/TRB, SSC, Banking, and Railway."
  },
  {
    title: "Higher Education & Career Guidance",
    description:
      "Awareness sessions for +2 and college students on degree pathways, scholarships, and public service careers."
  },
  {
    title: "NMMS School Scholarship Coaching",
    description:
      "Early-stage foundation coaching for school students appearing in the National Means-cum-Merit Scholarship exam."
  },
  {
    title: "Typing, Steno & Computer Skills",
    description:
      "Practical office automation, typewriting, and stenography certification courses boosting employability."
  },
  {
    title: "Scholarships & Student Welfare",
    description:
      "Financial assistance for meritorious students from economically weaker families and girls' medical awareness camps."
  },
  {
    title: "Future Expansion Roadmap",
    description:
      "Upcoming UPSC foundation batches, Spoken English labs, private-sector skill readiness, and a dedicated new training hall."
  }
] as const
