import crypto from "node:crypto"
import { db } from "~/app/initializers/database"
import { type AdmissionRow, admissions, type AdmissionStatus } from "~/database/schema"

export interface AdmissionItem {
  id: string
  applicationId: string
  studentName: string
  parentName: string
  dateOfBirth: string
  gender: string
  mobile: string
  whatsapp: string
  email: string
  address: string
  city: string
  district: string
  state: string
  pincode: string
  courseInterested: string
  previousQualification: string
  schoolCollegeName: string
  yearOfPassing: string
  marksPercentage: string
  preferredBatch: string
  message: string
  photoUrl: string | null
  documentUrl: string | null
  provisionedUserId: string | null
  status: AdmissionStatus
  createdAt: string
}

function mapAdmissionRow(row: AdmissionRow): AdmissionItem {
  return {
    id: row.id,
    applicationId: row.application_id,
    studentName: row.student_name,
    parentName: row.parent_name,
    dateOfBirth: row.date_of_birth,
    gender: row.gender,
    mobile: row.mobile,
    whatsapp: row.whatsapp,
    email: row.email,
    address: row.address,
    city: row.city,
    district: row.district,
    state: row.state,
    pincode: row.pincode,
    courseInterested: row.course_interested,
    previousQualification: row.previous_qualification,
    schoolCollegeName: row.school_college_name,
    yearOfPassing: row.year_of_passing,
    marksPercentage: row.marks_percentage,
    preferredBatch: row.preferred_batch,
    message: row.message,
    photoUrl: row.photo_url ?? null,
    documentUrl: row.document_url ?? null,
    provisionedUserId: row.provisioned_user_id ?? null,
    status: row.status,
    createdAt:
      row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at)
  }
}

export async function listAdmissions(): Promise<AdmissionItem[]> {
  try {
    const rows = await db.findMany(admissions, {
      orderBy: ["created_at", "desc"],
      limit: 200
    })
    return rows.map(mapAdmissionRow)
  } catch {
    return []
  }
}

export async function createAdmission(input: {
  studentName: string
  parentName: string
  dateOfBirth: string
  gender: string
  mobile: string
  whatsapp: string
  email: string
  address: string
  city: string
  district: string
  state: string
  pincode: string
  courseInterested: string
  previousQualification: string
  schoolCollegeName: string
  yearOfPassing: string
  marksPercentage: string
  preferredBatch: string
  message: string
  photoUrl?: string | null
  documentUrl?: string | null
}): Promise<{ id: string; applicationId: string }> {
  const id = `adm-${crypto.randomUUID().slice(0, 8)}`
  const year = new Date().getFullYear()
  const code = crypto.randomBytes(3).toString("hex").toUpperCase()
  const applicationId = `PAART-${year}-${code}`
  const now = new Date()

  await db.create(admissions, {
    id,
    application_id: applicationId,
    student_name: input.studentName,
    parent_name: input.parentName,
    date_of_birth: input.dateOfBirth,
    gender: input.gender,
    mobile: input.mobile,
    whatsapp: input.whatsapp || input.mobile,
    email: input.email,
    address: input.address,
    city: input.city,
    district: input.district,
    state: input.state,
    pincode: input.pincode,
    course_interested: input.courseInterested,
    previous_qualification: input.previousQualification,
    school_college_name: input.schoolCollegeName,
    year_of_passing: input.yearOfPassing,
    marks_percentage: input.marksPercentage,
    preferred_batch: input.preferredBatch,
    message: input.message,
    photo_url: input.photoUrl ?? null,
    document_url: input.documentUrl ?? null,
    status: "New",
    created_at: now,
    updated_at: now
  })

  return { id, applicationId }
}

export async function updateAdmissionStatus(id: string, status: AdmissionStatus): Promise<void> {
  await db.update(admissions, id, {
    status,
    updated_at: new Date()
  })
}
