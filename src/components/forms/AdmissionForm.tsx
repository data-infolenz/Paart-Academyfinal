'use client';

import { FormEvent, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import type { ManagedCourse } from '@/types/cms';

const textFields = [
  ['studentName', 'Student Name', 'text', true],
  ['parentName', 'Father / Parent Name', 'text', true],
  ['dateOfBirth', 'Date of Birth', 'date', true],
  ['mobile', 'Mobile Number', 'tel', true],
  ['whatsapp', 'WhatsApp Number', 'tel', false],
  ['email', 'Email Address', 'email', true],
  ['address', 'Address', 'text', false],
  ['city', 'City', 'text', false],
  ['district', 'District', 'text', false],
  ['state', 'State', 'text', false],
  ['pincode', 'Pincode', 'text', false],
  ['previousQualification', 'Previous Qualification', 'text', false],
  ['schoolCollegeName', 'School / College Name', 'text', false],
  ['yearOfPassing', 'Year of Passing', 'text', false],
  ['marksPercentage', 'Marks / Percentage', 'text', false],
  ['preferredBatch', 'Preferred Batch', 'text', false],
] as const;

export function AdmissionForm({ courses }: { courses: ManagedCourse[] }) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setMessage('Submitting Application...');
    const formData = new FormData(event.currentTarget);
    const response = await fetch('/api/admissions', { method: 'POST', body: formData });
    const result = await response.json();
    if (!response.ok) {
      setStatus('error');
      setMessage(result.error ?? 'Application could not be submitted.');
      return;
    }
    event.currentTarget.reset();
    setStatus('success');
    setMessage(`Application Submitted Successfully! Application ID: ${result.applicationId}. Our admission team will contact you shortly.`);
  }

  return (
    <form className="premium-form" onSubmit={submit}>
      {textFields.map(([name, label, type, required]) => (
        <label key={name}>{label}<input name={name} type={type} required={required} /></label>
      ))}
      <label>Gender<select name="gender" required><option value="">Select gender</option><option>Female</option><option>Male</option><option>Other</option></select></label>
      <label>Course Interested<select name="courseInterested" required><option value="">Select course</option>{courses.map((course) => <option key={course.id}>{course.title}</option>)}</select></label>
      <label className="wide">Message / Additional Information<textarea name="message" rows={5} /></label>
      <label>Student Photo<input name="studentPhoto" type="file" accept=".jpg,.jpeg,.png,.webp" /></label>
      <label>Required Documents<input name="documents" type="file" accept=".pdf,.jpg,.jpeg,.png" multiple /></label>
      <button className="premium-button wide" disabled={status === 'submitting'}>
        {status === 'submitting' ? <Loader2 className="spin" size={18} /> : <CheckCircle2 size={18} />} Submit Application
      </button>
      {message && <p className={`form-note ${status}`}>{message}</p>}
    </form>
  );
}
