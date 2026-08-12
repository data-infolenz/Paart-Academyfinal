import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { UploadedFile } from '@/types/cms';

const imageTypes = ['image/jpeg', 'image/png', 'image/webp'];
const documentTypes = [...imageTypes, 'application/pdf'];
const maxSize = 5 * 1024 * 1024;

export async function saveUpload(file: File, folder: string, documents = false): Promise<UploadedFile> {
  const allowed = documents ? documentTypes : imageTypes;
  if (!allowed.includes(file.type)) throw new Error('Unsupported file type');
  if (file.size > maxSize) throw new Error('File exceeds 5MB upload limit');
  const bytes = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, uniqueName), bytes);
  return {
    name: file.name,
    url: `/uploads/${folder}/${uniqueName}`,
    type: file.type,
    size: file.size,
  };
}
