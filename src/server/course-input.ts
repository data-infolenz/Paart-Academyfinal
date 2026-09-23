import type { ManagedCourse } from '@/types/cms';
import type { CourseDetails } from '@/data/course-details';

export function parseCourseInput(input: unknown, creating = false): Partial<ManagedCourse> {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Invalid course data.');
  const body = input as Record<string, unknown>;
  const result: Partial<ManagedCourse> = {};
  const textFields = ['title', 'category', 'shortDescription', 'duration', 'eligibility', 'image', 'provision'] as const;
  for (const field of textFields) {
    if (body[field] !== undefined) {
      if (typeof body[field] !== 'string') throw new Error(`${field} must be text.`);
      result[field] = body[field].trim();
    }
  }
  if ((creating || body.title !== undefined) && !result.title) throw new Error('Enter a course title.');
  for (const field of ['features', 'examStages'] as const) {
    if (body[field] === undefined) continue;
    const value = body[field];
    if (typeof value === 'string') result[field] = value.split('\n').map((line) => line.trim()).filter(Boolean);
    else if (Array.isArray(value) && value.every((item) => typeof item === 'string')) result[field] = value.map((item) => item.trim()).filter(Boolean);
    else throw new Error(`${field} must contain text entries.`);
  }
  if (body.enabled !== undefined) {
    if (typeof body.enabled !== 'boolean') throw new Error('Course visibility must be true or false.');
    result.enabled = body.enabled;
  }
  if (body.details !== undefined) {
    if (!body.details || typeof body.details !== 'object' || Array.isArray(body.details)) throw new Error('Invalid course details.');
    const incoming = body.details as Record<string, unknown>;
    const details = {} as CourseDetails;
    for (const field of ['overview', 'whoCanJoin', 'preparationFocus', 'keyAreas', 'support', 'outcome'] as const) {
      if (typeof incoming[field] !== 'string') throw new Error('Include all six course detail sections.');
      details[field] = incoming[field].trim();
    }
    result.details = details;
  }
  return result;
}
