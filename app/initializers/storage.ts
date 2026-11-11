import crypto from "node:crypto"
import fsp from "node:fs/promises"
import path from "node:path"
import process from "node:process"

const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".pdf"])
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024 // 5 MB

export async function saveUploadedFile(
  file: unknown,
  subfolder: "photos" | "documents"
): Promise<string | null> {
  if (!(file instanceof File) || file.size === 0 || !file.name) {
    return null
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(`Uploaded file "${file.name}" exceeds the 5 MB limit.`)
  }

  const ext = path.extname(file.name).toLowerCase()
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    throw new Error(`Unsupported file format "${ext}". Allowed: JPG, PNG, WEBP, PDF.`)
  }

  const safeId = `${Date.now().toString(36)}-${crypto.randomBytes(6).toString("hex")}${ext}`
  const targetDir = path.resolve(process.cwd(), "uploads", subfolder)
  await fsp.mkdir(targetDir, { recursive: true })

  const bytes = Buffer.from(await file.arrayBuffer())
  await fsp.writeFile(path.join(targetDir, safeId), bytes)

  return `/uploads/${subfolder}/${safeId}`
}
