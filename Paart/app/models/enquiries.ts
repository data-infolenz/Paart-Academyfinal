import crypto from "node:crypto"
import { db } from "~/app/initializers/database"
import { enquiries, type EnquiryRow, type EnquiryStatus } from "~/database/schema"

export interface EnquiryItem {
  id: string
  name: string
  phone: string
  email: string | null
  district: string | null
  courseInterested: string
  message: string
  status: EnquiryStatus
  createdAt: string
}

function mapEnquiryRow(row: EnquiryRow): EnquiryItem {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email ?? null,
    district: row.district ?? null,
    courseInterested: row.course_interested,
    message: row.message,
    status: row.status,
    createdAt:
      row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at)
  }
}

export async function listEnquiries(): Promise<EnquiryItem[]> {
  try {
    const rows = await db.findMany(enquiries, {
      orderBy: ["created_at", "desc"],
      limit: 200
    })
    return rows.map(mapEnquiryRow)
  } catch {
    return []
  }
}

export async function createEnquiry(input: {
  name: string
  phone: string
  email?: string
  district?: string
  courseInterested: string
  message?: string
}): Promise<string> {
  const id = `enq-${crypto.randomUUID().slice(0, 8)}`
  const now = new Date()
  await db.create(enquiries, {
    id,
    name: input.name,
    phone: input.phone,
    email: input.email || null,
    district: input.district || null,
    course_interested: input.courseInterested,
    message: input.message || "",
    status: "New",
    created_at: now,
    updated_at: now
  })
  return id
}

export async function updateEnquiryStatus(id: string, status: EnquiryStatus): Promise<void> {
  await db.update(enquiries, id, {
    status,
    updated_at: new Date()
  })
}
