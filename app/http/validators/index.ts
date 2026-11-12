import * as s from "remix/data-schema"

const trimmedString = (minLen = 0, msg = "Required field") =>
  s
    .defaulted(s.string(), "")
    .transform((val) => val.trim())
    .refine((val) => val.length >= minLen, msg)

const phoneSchema = trimmedString(10, "Enter a valid 10-digit phone number").refine(
  (val) => /^[0-9+\-\s()]{10,18}$/.test(val),
  "Enter a valid phone number"
)

export const signInSchema = s.object({
  email: trimmedString(3, "Email is required"),
  password: s.defaulted(s.string(), "").refine((v) => v.length >= 1, "Password is required")
})

export const changePasswordSchema = s.object({
  currentPassword: s
    .defaulted(s.string(), "")
    .refine((v) => v.length >= 1, "Current password is required"),
  newPassword: s.defaulted(s.string(), "").refine((v) => v.length >= 1, "New password is required"),
  confirmPassword: s
    .defaulted(s.string(), "")
    .refine((v) => v.length >= 1, "Please confirm your new password")
})

export const enquirySchema = s.object({
  name: trimmedString(2, "Full name is required"),
  phone: phoneSchema,
  email: trimmedString(0),
  district: trimmedString(0),
  courseInterested: trimmedString(2, "Please select a course"),
  message: trimmedString(0)
})

export const admissionSchema = s.object({
  studentName: trimmedString(2, "Student full name is required"),
  parentName: trimmedString(2, "Parent / Guardian name is required"),
  dateOfBirth: trimmedString(4, "Date of birth is required"),
  gender: trimmedString(1, "Please select gender"),
  mobile: phoneSchema,
  whatsapp: trimmedString(0),
  email: trimmedString(0),
  address: trimmedString(4, "Residential address is required"),
  city: trimmedString(2, "Town / City is required"),
  district: trimmedString(2, "District is required"),
  state: trimmedString(2, "State is required"),
  pincode: trimmedString(6, "Valid 6-digit pincode is required"),
  courseInterested: trimmedString(2, "Please choose a course"),
  previousQualification: trimmedString(2, "Qualification is required"),
  schoolCollegeName: trimmedString(0),
  yearOfPassing: trimmedString(0),
  marksPercentage: trimmedString(0),
  preferredBatch: trimmedString(2, "Preferred batch is required"),
  message: trimmedString(0)
})

export const createCourseSchema = s.object({
  title: trimmedString(3, "Course title is required"),
  category: trimmedString(2, "Category is required"),
  shortDescription: trimmedString(10, "Short description is required"),
  duration: trimmedString(2, "Duration is required"),
  eligibility: trimmedString(2, "Eligibility is required"),
  image: trimmedString(0),
  features: trimmedString(0),
  examStages: trimmedString(0)
})

export const createMaterialSchema = s.object({
  title: trimmedString(3, "Material title is required"),
  category: trimmedString(2, "Category is required"),
  description: trimmedString(4, "Description is required"),
  fileUrl: trimmedString(0),
  externalUrl: trimmedString(0),
  courseId: trimmedString(0),
  visibility: trimmedString(0)
})

export const provisionUserSchema = s.object({
  role: trimmedString(3, "Select a valid role"),
  email: trimmedString(3, "Recipient email address is required"),
  fullName: trimmedString(2, "Full name is required"),
  phone: trimmedString(0),
  department: trimmedString(0),
  batchId: trimmedString(0)
})

export const createBatchSchema = s.object({
  courseId: trimmedString(2, "Select a coaching course"),
  facultyId: trimmedString(0),
  name: trimmedString(3, "Batch name is required"),
  code: trimmedString(3, "Batch code is required"),
  scheduleLabel: trimmedString(0),
  startsOn: trimmedString(0),
  endsOn: trimmedString(0)
})

export const provisionAdmissionSchema = s.object({
  email: trimmedString(3, "Valid email address is required"),
  batchId: trimmedString(2, "Select a target batch"),
  linkExisting: trimmedString(0)
})

export const createBlogSchema = s.object({
  title: trimmedString(5, "Blog title is required"),
  category: trimmedString(2, "Category is required"),
  shortDescription: trimmedString(10, "Short summary is required"),
  content: trimmedString(20, "Article content is required"),
  featuredImage: trimmedString(0)
})

export const createGallerySchema = s.object({
  title: trimmedString(3, "Title is required"),
  category: trimmedString(2, "Category is required"),
  description: trimmedString(0),
  image: trimmedString(4, "Image URL/path is required")
})

export const updateSettingsSchema = s.object({
  siteName: trimmedString(2, "Site name is required"),
  phone: phoneSchema,
  whatsapp: trimmedString(10, "WhatsApp number is required"),
  email: trimmedString(5, "Email is required"),
  addressPrimary: trimmedString(5, "Primary address is required"),
  addressSecondary: trimmedString(0),
  hours: trimmedString(3, "Working hours are required"),
  seoTitle: trimmedString(5, "SEO title is required"),
  seoDescription: trimmedString(10, "SEO description is required")
})

export function formDataToObject(formData: FormData): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") {
      out[key] = value
    }
  }
  return out
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
