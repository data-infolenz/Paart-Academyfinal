import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { CmsData } from '@/types/cms';
import { defaultCmsData } from './seed';
import { courseDetails, courseProvision } from '@/data/course-details';

const dataDir = path.join(process.cwd(), '.data');
const dataFile = path.join(dataDir, 'cms.json');

async function ensureDataFile() {
  await mkdir(dataDir, { recursive: true });
  try {
    await readFile(dataFile, 'utf8');
  } catch {
    await writeFile(dataFile, JSON.stringify(defaultCmsData, null, 2));
  }
}

export async function readCms(): Promise<CmsData> {
  await ensureDataFile();
  const raw = await readFile(dataFile, 'utf8');
  const parsed = JSON.parse(raw) as Partial<CmsData>;
  return {
    ...defaultCmsData,
    ...parsed,
    settings: { ...defaultCmsData.settings, ...parsed.settings },
    courses: (parsed.courses ?? defaultCmsData.courses).map((course) => ({
      ...course,
      details: course.details ?? courseDetails[course.id],
      provision: course.provision ?? courseProvision,
    })),
    materials: parsed.materials?.length ? parsed.materials : defaultCmsData.materials,
    blogs: parsed.blogs?.length ? parsed.blogs : defaultCmsData.blogs,
    gallery: parsed.gallery?.length ? parsed.gallery : defaultCmsData.gallery,
  };
}

export async function writeCms(data: CmsData) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(dataFile, JSON.stringify(data, null, 2));
}

export async function updateCms<T>(updater: (data: CmsData) => T | Promise<T>) {
  const data = await readCms();
  const result = await updater(data);
  await writeCms(data);
  return result;
}

export function makeId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
