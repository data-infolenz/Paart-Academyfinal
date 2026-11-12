import { randomString } from "@sdxc/crypto"
import type { Mailer } from "@sdxc/mail"
import { isSuccess } from "@sdxc/result"
import { generateUUID } from "@sdxc/uuid/v7"
import {
  generateTemporaryPassword,
  hashUserPassword,
  normalizeUserEmail,
  revokeUserSessions
} from "~/app/initializers/auth"
import { db as defaultDb, type PaartDb } from "~/app/initializers/database"
import { sendAccountCredentialsEmail } from "~/app/initializers/mail"
import {
  admissions,
  batches,
  courses,
  enrollments,
  type UserRole,
  type UserRow,
  type UserStatus,
  users
} from "~/database/schema"

export class ProvisioningValidationError extends Error {
  readonly statusCode: number

  constructor(message: string, statusCode = 422) {
    super(message)
    this.name = "ProvisioningValidationError"
    this.statusCode = statusCode
  }
}

export interface UserEnrollmentBadge {
  enrollmentId: string
  batchId: string
  batchName: string
  batchCode: string
  courseId: string
  courseTitle: string
  rollNumber: string
  status: string
}

export interface ManagedUserItem {
  id: string
  email: string
  fullName: string
  phone: string
  department: string
  role: UserRole
  status: UserStatus
  mustChangePassword: boolean
  lastLoginAt: string | null
  credentialsSentAt: string | null
  credentialsDeliveryError: string | null
  createdAt: string
  enrollments: UserEnrollmentBadge[]
}

function toIsoOrNull(val: Date | string | null | undefined): string | null {
  if (!val) return null
  return val instanceof Date ? val.toISOString() : String(val)
}

function mapUserRow(row: UserRow, userEnrollments: UserEnrollmentBadge[] = []): ManagedUserItem {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    phone: row.phone,
    department: row.department,
    role: row.role,
    status: row.status,
    mustChangePassword: Boolean(row.must_change_password),
    lastLoginAt: toIsoOrNull(row.last_login_at),
    credentialsSentAt: toIsoOrNull(row.credentials_sent_at),
    credentialsDeliveryError: row.credentials_delivery_error ?? null,
    createdAt: toIsoOrNull(row.created_at) ?? new Date().toISOString(),
    enrollments: userEnrollments
  }
}

export async function listManagedUsers(targetDb: PaartDb = defaultDb): Promise<ManagedUserItem[]> {
  const [userRows, enrollmentRows, batchRows, courseRows] = await Promise.all([
    targetDb.findMany(users, { orderBy: ["created_at", "desc"], limit: 500 }),
    targetDb.findMany(enrollments),
    targetDb.findMany(batches),
    targetDb.findMany(courses)
  ])

  const batchMap = new Map(batchRows.map((b) => [b.id, b]))
  const courseMap = new Map(courseRows.map((c) => [c.id, c]))
  const enrollmentsByAspirant = new Map<string, UserEnrollmentBadge[]>()

  for (const enr of enrollmentRows) {
    const batch = batchMap.get(enr.batch_id)
    if (!batch) continue
    const course = courseMap.get(batch.course_id)
    const list = enrollmentsByAspirant.get(enr.aspirant_id) ?? []
    list.push({
      enrollmentId: enr.id,
      batchId: batch.id,
      batchName: batch.name,
      batchCode: batch.code,
      courseId: batch.course_id,
      courseTitle: course?.title ?? batch.course_id,
      rollNumber: enr.roll_number,
      status: enr.status
    })
    enrollmentsByAspirant.set(enr.aspirant_id, list)
  }

  return userRows.map((u) => mapUserRow(u, enrollmentsByAspirant.get(u.id) ?? []))
}

export async function listActiveFacultyUsers(
  targetDb: PaartDb = defaultDb
): Promise<Array<{ id: string; fullName: string; email: string; department: string }>> {
  const rows = await targetDb.findMany(users, {
    where: { role: "faculty", status: "active" },
    orderBy: ["full_name", "asc"]
  })
  return rows.map((r) => ({
    id: r.id,
    fullName: r.full_name,
    email: r.email,
    department: r.department
  }))
}

async function generateRollNumber(
  batchCode: string,
  batchId: string,
  targetDb: PaartDb
): Promise<string> {
  const existingCount = await targetDb.count(enrollments, { where: { batch_id: batchId } })
  const seq = String(existingCount + 1).padStart(3, "0")
  const suffix = randomString({ length: 2, alphabet: "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" })
  return `${batchCode}-${seq}${suffix}`
}

export interface ProvisionUserInput {
  role: "faculty" | "aspirant"
  email: string
  fullName: string
  phone?: string
  department?: string
  batchId?: string
  admissionId?: string
  origin: string
  mailer?: Mailer
}

export interface ProvisionUserResult {
  user: ManagedUserItem
  temporaryPassword: string
  emailDelivered: boolean
  emailError: string | null
}

export async function provisionUserAccount(
  input: ProvisionUserInput,
  targetDb: PaartDb = defaultDb
): Promise<ProvisionUserResult> {
  if (input.role !== "faculty" && input.role !== "aspirant") {
    throw new ProvisioningValidationError("Only faculty or aspirant accounts can be provisioned.")
  }

  const fullName = input.fullName.trim()
  if (fullName.length < 2) {
    throw new ProvisioningValidationError("Full name must be at least 2 characters.")
  }

  const normalized = normalizeUserEmail(input.email)
  if (!normalized) {
    throw new ProvisioningValidationError("Enter a valid recipient email address.")
  }

  const existing = await targetDb.findOne(users, { where: { email: normalized.canonical } })
  if (existing) {
    throw new ProvisioningValidationError(
      `An account with email "${normalized.canonical}" already exists.`
    )
  }

  let batchSummary: string | undefined
  let resolvedBatch: Awaited<ReturnType<PaartDb["find"]>> | null = null
  const cleanBatchId = input.batchId?.trim() || ""

  if (input.role === "aspirant" && cleanBatchId.length > 0) {
    const batch = await targetDb.find(batches, cleanBatchId)
    if (!batch) {
      throw new ProvisioningValidationError("Selected batch does not exist.")
    }
    resolvedBatch = batch
    const course = await targetDb.find(courses, batch.course_id)
    batchSummary = course
      ? `${course.title} · ${batch.name} (${batch.code})`
      : `${batch.name} (${batch.code})`
  }

  const temporaryPassword = generateTemporaryPassword(16)
  const passwordHash = await hashUserPassword(temporaryPassword)
  const userId = generateUUID()
  const now = new Date()

  await targetDb.create(users, {
    id: userId,
    email: normalized.canonical,
    full_name: fullName,
    phone: (input.phone ?? "").trim(),
    department: (input.department ?? "").trim(),
    role: input.role,
    password_hash: passwordHash,
    must_change_password: true,
    status: "active",
    last_login_at: null,
    credentials_sent_at: null,
    credentials_delivery_error: null,
    created_at: now,
    updated_at: now
  })

  if (input.role === "aspirant" && resolvedBatch) {
    const batchRow = resolvedBatch as { id: string; code: string; name: string; course_id: string }
    const rollNumber = await generateRollNumber(batchRow.code, batchRow.id, targetDb)
    await targetDb.create(enrollments, {
      id: generateUUID(),
      batch_id: batchRow.id,
      aspirant_id: userId,
      admission_id: input.admissionId ?? null,
      roll_number: rollNumber,
      status: "active",
      enrolled_at: now
    })
  }

  const mailResult = await sendAccountCredentialsEmail({
    kind: "welcome",
    toEmail: normalized.canonical,
    fullName,
    role: input.role,
    temporaryPassword,
    origin: input.origin,
    batchSummary,
    mailer: input.mailer
  })

  let emailDelivered = false
  let emailError: string | null = null

  if (isSuccess(mailResult)) {
    emailDelivered = true
    await targetDb.update(users, userId, {
      credentials_sent_at: new Date(),
      credentials_delivery_error: null,
      updated_at: new Date()
    })
  } else {
    emailError =
      "Failed to deliver credentials email over SMTP. Use 'Reset & Resend Credentials' once SMTP is reachable."
    await targetDb.update(users, userId, {
      credentials_delivery_error: emailError,
      updated_at: new Date()
    })
  }

  const updatedRow = await targetDb.find(users, userId)
  return {
    user: mapUserRow(updatedRow!),
    temporaryPassword,
    emailDelivered,
    emailError
  }
}

export async function resendUserCredentials(
  input: {
    userId: string
    origin: string
    mailer?: Mailer
  },
  targetDb: PaartDb = defaultDb
): Promise<ProvisionUserResult> {
  const userRow = await targetDb.find(users, input.userId)
  if (!userRow) {
    throw new ProvisioningValidationError("User account not found.", 404)
  }
  if (userRow.role === "admin") {
    throw new ProvisioningValidationError(
      "Administrator passwords cannot be reset via temporary email re-issuance."
    )
  }

  const temporaryPassword = generateTemporaryPassword(16)
  const passwordHash = await hashUserPassword(temporaryPassword)
  const now = new Date()

  await targetDb.update(users, userRow.id, {
    password_hash: passwordHash,
    must_change_password: true,
    updated_at: now
  })

  await revokeUserSessions(userRow.id, undefined, targetDb)

  const mailResult = await sendAccountCredentialsEmail({
    kind: "reset",
    toEmail: userRow.email,
    fullName: userRow.full_name,
    role: userRow.role,
    temporaryPassword,
    origin: input.origin,
    mailer: input.mailer
  })

  let emailDelivered = false
  let emailError: string | null = null

  if (isSuccess(mailResult)) {
    emailDelivered = true
    await targetDb.update(users, userRow.id, {
      credentials_sent_at: new Date(),
      credentials_delivery_error: null,
      updated_at: new Date()
    })
  } else {
    emailError =
      "Failed to deliver reset credentials email over SMTP. Check SMTP settings and retry."
    await targetDb.update(users, userRow.id, {
      credentials_delivery_error: emailError,
      updated_at: new Date()
    })
  }

  const refreshed = await targetDb.find(users, userRow.id)
  return {
    user: mapUserRow(refreshed!),
    temporaryPassword,
    emailDelivered,
    emailError
  }
}

export async function updateUserAccountStatus(
  input: {
    actorAdminId: string
    targetUserId: string
    nextStatus: UserStatus
  },
  targetDb: PaartDb = defaultDb
): Promise<ManagedUserItem> {
  if (input.actorAdminId === input.targetUserId && input.nextStatus === "suspended") {
    throw new ProvisioningValidationError(
      "You cannot suspend your own active administrator account.",
      422
    )
  }

  const userRow = await targetDb.find(users, input.targetUserId)
  if (!userRow) {
    throw new ProvisioningValidationError("User account not found.", 404)
  }

  await targetDb.update(users, userRow.id, {
    status: input.nextStatus,
    updated_at: new Date()
  })

  if (input.nextStatus === "suspended") {
    await revokeUserSessions(userRow.id, undefined, targetDb)
  }

  const updated = await targetDb.find(users, userRow.id)
  return mapUserRow(updated!)
}

export async function provisionAdmissionApplicant(
  input: {
    admissionId: string
    email: string
    batchId: string
    linkExisting?: boolean
    origin: string
    mailer?: Mailer
  },
  targetDb: PaartDb = defaultDb
): Promise<{
  userId: string
  emailDelivered: boolean
  emailError: string | null
  linkedExisting: boolean
}> {
  const admission = await targetDb.find(admissions, input.admissionId)
  if (!admission) {
    throw new ProvisioningValidationError("Admission application not found.", 404)
  }

  const batch = await targetDb.find(batches, input.batchId.trim())
  if (!batch) {
    throw new ProvisioningValidationError("Please select a valid target batch for enrollment.")
  }

  const normalized = normalizeUserEmail(input.email)
  if (!normalized) {
    throw new ProvisioningValidationError("Please provide a valid email address for the aspirant.")
  }

  const existingUser = await targetDb.findOne(users, { where: { email: normalized.canonical } })

  if (existingUser) {
    if (!input.linkExisting || existingUser.role !== "aspirant") {
      throw new ProvisioningValidationError(
        existingUser.role !== "aspirant"
          ? `Email "${normalized.canonical}" belongs to a ${existingUser.role} account and cannot be enrolled as an aspirant.`
          : `An aspirant account with email "${normalized.canonical}" already exists. Enable 'Link existing aspirant' to enroll them in this batch.`
      )
    }

    const existingEnrollment = await targetDb.findOne(enrollments, {
      where: { batch_id: batch.id, aspirant_id: existingUser.id }
    })

    if (!existingEnrollment) {
      const rollNumber = await generateRollNumber(batch.code, batch.id, targetDb)
      await targetDb.create(enrollments, {
        id: generateUUID(),
        batch_id: batch.id,
        aspirant_id: existingUser.id,
        admission_id: admission.id,
        roll_number: rollNumber,
        status: "active",
        enrolled_at: new Date()
      })
    }

    await targetDb.update(admissions, admission.id, {
      email: normalized.canonical,
      provisioned_user_id: existingUser.id,
      status: "enrolled",
      updated_at: new Date()
    })

    return {
      userId: existingUser.id,
      emailDelivered: true,
      emailError: null,
      linkedExisting: true
    }
  }

  const provisioned = await provisionUserAccount(
    {
      role: "aspirant",
      email: normalized.canonical,
      fullName: admission.student_name,
      phone: admission.mobile,
      batchId: batch.id,
      admissionId: admission.id,
      origin: input.origin,
      mailer: input.mailer
    },
    targetDb
  )

  await targetDb.update(admissions, admission.id, {
    email: normalized.canonical,
    provisioned_user_id: provisioned.user.id,
    status: "enrolled",
    updated_at: new Date()
  })

  return {
    userId: provisioned.user.id,
    emailDelivered: provisioned.emailDelivered,
    emailError: provisioned.emailError,
    linkedExisting: false
  }
}
