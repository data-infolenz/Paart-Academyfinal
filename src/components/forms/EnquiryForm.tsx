'use client';

import { FormEvent, useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import type { ManagedCourse } from '@/types/cms';

export function EnquiryForm({ courses, whatsapp }: { courses: ManagedCourse[]; whatsapp: string }) {
  const [sending, setSending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    const data = new FormData(event.currentTarget);
    const payload = {
      name: String(data.get('name') ?? ''),
      phone: String(data.get('phone') ?? ''),
      courseInterested: String(data.get('courseInterested') ?? ''),
      message: String(data.get('message') ?? ''),
    };
    await fetch('/api/enquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const text = encodeURIComponent(`Hello,\n\nI would like to enquire about your academy.\n\nName: ${payload.name}\nPhone: ${payload.phone}\nCourse Interested: ${payload.courseInterested}\nMessage: ${payload.message}\n\nPlease provide more information.`);
    window.location.href = `https://wa.me/${whatsapp}?text=${text}`;
  }

  return (
    <form className="premium-form compact" onSubmit={submit}>
      <label>Name<input name="name" required /></label>
      <label>Phone Number<input name="phone" type="tel" required /></label>
      <label>Course Interested<select name="courseInterested" required><option value="">Select course</option>{courses.map((course) => <option key={course.id}>{course.title}</option>)}</select></label>
      <label className="wide">Message<textarea name="message" rows={4} /></label>
      <button className="premium-button wide" disabled={sending}>{sending ? <MessageCircle size={18} /> : <Send size={18} />} Send Enquiry</button>
    </form>
  );
}
