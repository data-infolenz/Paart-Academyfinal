import { NextRequest, NextResponse } from 'next/server';
import { updateCms } from '@/server/db';
import { requireAdmin, unauthorized } from '@/server/auth';
import { parseCourseInput } from '@/server/course-input';

const editable = ['admissions', 'enquiries', 'courses', 'materials', 'blogs', 'gallery', 'media'] as const;
type Editable = (typeof editable)[number];

function isEditable(value: string): value is Editable {
  return editable.includes(value as Editable);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ collection: string; id: string }> }) {
  if (!(await requireAdmin())) return unauthorized();
  const { collection, id } = await context.params;
  if (!isEditable(collection)) return NextResponse.json({ error: 'Unknown collection' }, { status: 404 });
  let body = await request.json();
  if (collection === 'courses') {
    try { body = parseCourseInput(body); }
    catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid course data.' }, { status: 400 }); }
  }
  const item = await updateCms((data) => {
    const list = data[collection] as Array<Record<string, unknown>>;
    const index = list.findIndex((entry) => entry.id === id);
    if (index < 0) return null;
    list[index] = { ...list[index], ...body, updatedAt: new Date().toISOString() };
    return list[index];
  });
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
}

export async function DELETE(_: NextRequest, context: { params: Promise<{ collection: string; id: string }> }) {
  if (!(await requireAdmin())) return unauthorized();
  const { collection, id } = await context.params;
  if (!isEditable(collection)) return NextResponse.json({ error: 'Unknown collection' }, { status: 404 });
  await updateCms((data) => {
    const list = data[collection] as Array<Record<string, unknown>>;
    const index = list.findIndex((entry) => entry.id === id);
    if (index >= 0) list.splice(index, 1);
  });
  return NextResponse.json({ ok: true });
}
