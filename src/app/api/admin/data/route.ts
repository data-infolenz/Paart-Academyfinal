import { NextResponse } from 'next/server';
import { readCms } from '@/server/db';
import { requireAdmin, unauthorized } from '@/server/auth';

export async function GET() {
  if (!(await requireAdmin())) return unauthorized();
  return NextResponse.json(await readCms());
}
