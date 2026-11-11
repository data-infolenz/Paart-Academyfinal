export interface FaqItem {
  question: string
  answer: string
}

export interface FaqCategory {
  id: string
  title: string
  items: FaqItem[]
}

export const PAART_FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "admissions",
    title: "Admissions, Batches & Eligibility",
    items: [
      {
        question: "Who can join PAART Academy's competitive exam programmes?",
        answer:
          "School students (NMMS), 10th/+2 pass candidates (TNPSC Group IV, VAO, Police Constable, SSC MTS/CHSL, RRB), and graduates (TNPSC Group I/II/IIA, TNUSRB SI, TET/TRB, Banking, SSC CGL) can enroll according to exam eligibility."
      },
      {
        question: "Are classes taught in Tamil or English?",
        answer:
          "All core classes, study materials, and test series support both Tamil and English medium aspirants, with dedicated General Tamil eligibility and scoring sessions."
      },
      {
        question: "Do you offer weekend batches for college students and working aspirants?",
        answer:
          "Yes. PAART runs both regular weekday classroom batches and structured weekend batches, along with study-hall access from Monday to Saturday (9:00 AM – 7:00 PM)."
      }
    ]
  },
  {
    id: "methodology",
    title: "Study Materials, Mock Tests & Scholarships",
    items: [
      {
        question: "How frequently are practice tests and mock exams conducted?",
        answer:
          "Students complete daily topic drills, weekly unit tests, and full-length OMR/CBT model examinations modelled on the latest TNPSC, TNUSRB, and central exam patterns."
      },
      {
        question: "Does PAART provide support for economically weaker students?",
        answer:
          "Yes. Operated by Puliyangudi Academic & Achievements Resource Trust (established December 2018), PAART provides scholarship support and accessible guidance so meritorious students from economically weaker backgrounds are never held back."
      },
      {
        question: "How do I apply for admission or enquire about the upcoming batch?",
        answer:
          "You can submit the online Admission Form at /admissions, send a quick enquiry on /contact, or call/WhatsApp +91 6382450070 directly."
      }
    ]
  }
]

export const FLAT_FAQS: FaqItem[] = PAART_FAQ_CATEGORIES.flatMap((c) => c.items)
