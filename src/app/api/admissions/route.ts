import { NextRequest, NextResponse } from 'next/server';
import type { Admission } from '@/types/cms';
import { makeId, updateCms } from '@/server/db';
import { saveUpload } from '@/server/uploads';

const requiredFields = ['studentName', 'parentName', 'dateOfBirth', 'gender', 'mobile', 'email', 'courseInterested'];

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    for (const field of requiredFields) {
      if (!String(form.get(field) ?? '').trim()) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }
    const admission = await updateCms(async (data) => {
      const year = new Date().getFullYear();
      const applicationId = `PAART-ADM-${year}-${String(data.admissions.length + 1).padStart(4, '0')}`;
      const photo = form.get('studentPhoto');
      const docs = form.getAll('documents');
      const now = new Date().toISOString();
      const record: Admission = {
        id: makeId('adm'),
        applicationId,
        studentName: String(form.get('studentName') ?? ''),
        parentName: String(form.get('parentName') ?? ''),
        dateOfBirth: String(form.get('dateOfBirth') ?? ''),
        gender: String(form.get('gender') ?? ''),
        mobile: String(form.get('mobile') ?? ''),
        whatsapp: String(form.get('whatsapp') ?? ''),
        email: String(form.get('email') ?? ''),
        address: String(form.get('address') ?? ''),
        city: String(form.get('city') ?? ''),
        district: String(form.get('district') ?? ''),
        state: String(form.get('state') ?? ''),
        pincode: String(form.get('pincode') ?? ''),
        courseInterested: String(form.get('courseInterested') ?? ''),
        previousQualification: String(form.get('previousQualification') ?? ''),
        schoolCollegeName: String(form.get('schoolCollegeName') ?? ''),
        yearOfPassing: String(form.get('yearOfPassing') ?? ''),
        marksPercentage: String(form.get('marksPercentage') ?? ''),
        preferredBatch: String(form.get('preferredBatch') ?? ''),
        message: String(form.get('message') ?? ''),
        status: 'New',
        studentPhoto: photo instanceof File && photo.size ? await saveUpload(photo, 'admissions', false) : undefined,
        documents: await Promise.all(docs.filter((doc): doc is File => doc instanceof File && doc.size > 0).map((doc) => saveUpload(doc, 'documents', true))),
        appliedDate: now,
        updatedAt: now,
      };
      data.admissions.unshift(record);
      return record;
    });
    return NextResponse.json({ ok: true, applicationId: admission.applicationId, admission });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Admission submission failed' }, { status: 400 });
  }
}
