import { NextRequest, NextResponse } from 'next/server';
import { readCms, updateCms } from '@/server/db';
import { requireAdmin, unauthorized } from '@/server/auth';

export async function GET() {
  if (!(await requireAdmin())) return unauthorized();
  const data = await readCms();
  return NextResponse.json(data.settings);
}

export async function PATCH(request: NextRequest) {
  if (!(await requireAdmin())) return unauthorized();
  const body = await request.json();
  const settings = await updateCms((data) => {
    data.settings = { ...data.settings, ...body };
    return data.settings;
  });
  return NextResponse.json(settings);
}
