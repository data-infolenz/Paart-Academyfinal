import { NextResponse } from 'next/server';
import { readCms } from '@/server/db';
import { requireAdmin, unauthorized } from '@/server/auth';

export async function GET() {
  if (!(await requireAdmin())) return unauthorized();
  const data = await readCms();
  return NextResponse.json({
    totals: {
      admissions: data.admissions.length,
      newAdmissions: data.admissions.filter((item) => item.status === 'New').length,
      enquiries: data.enquiries.length,
      courses: data.courses.length,
      materials: data.materials.length,
      blogs: data.blogs.length,
      gallery: data.gallery.length,
    },
    recentAdmissions: data.admissions.slice(0, 6),
    recentEnquiries: data.enquiries.slice(0, 6),
  });
}
