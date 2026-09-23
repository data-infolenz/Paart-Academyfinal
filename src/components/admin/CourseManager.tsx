'use client';

import { useRef, useState, type FormEvent } from 'react';
import { Loader2, Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import type { ManagedCourse } from '@/types/cms';
import { courseProvision, type CourseDetails } from '@/data/course-details';

const detailFields: { key: keyof CourseDetails; label: string }[] = [
  { key: 'overview', label: 'Course Overview' },
  { key: 'whoCanJoin', label: 'Who Can Join' },
  { key: 'preparationFocus', label: 'Preparation Focus' },
  { key: 'keyAreas', label: 'Key Areas' },
  { key: 'support', label: 'Course Support' },
  { key: 'outcome', label: 'Course Outcome' },
];
const blankDetails: CourseDetails = { overview: '', whoCanJoin: '', preparationFocus: '', keyAreas: '', support: '', outcome: '' };
const blankCourse = { title: '', category: 'TNPSC', shortDescription: '', duration: '', eligibility: '', image: '', features: '', examStages: '', enabled: true, details: blankDetails, provision: courseProvision };
type CourseDraft = typeof blankCourse;

export function CourseManager({ items, query, onSaved }: { items: ManagedCourse[]; query: string; onSaved: () => Promise<void> }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<CourseDraft>(blankCourse);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const titleInput = useRef<HTMLInputElement>(null);
  const requestPending = useRef(false);

  function reset() { setEditingId(null); setDraft(blankCourse); setError(''); }
  function edit(course: ManagedCourse) {
    setEditingId(course.id);
    setDraft({ title: course.title, category: course.category, shortDescription: course.shortDescription, duration: course.duration, eligibility: course.eligibility, image: course.image, features: course.features.join('\n'), examStages: course.examStages.join('\n'), enabled: course.enabled, details: { ...blankDetails, ...course.details }, provision: course.provision ?? courseProvision });
    setError(''); setMessage('');
    titleInput.current?.focus();
  }
  async function mutate(url: string, method: string, body?: unknown): Promise<boolean> {
    if (requestPending.current) return false;
    requestPending.current = true; setBusy(true); setError(''); setMessage('');
    try {
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error || 'Unable to save. Please try again.');
      }
      await onSaved();
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to save. Please try again.');
      return false;
    } finally { requestPending.current = false; setBusy(false); }
  }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const updating = editingId !== null;
    if (await mutate(updating ? `/api/admin/courses/${editingId}` : '/api/admin/courses', updating ? 'PATCH' : 'POST', draft)) {
      reset(); setMessage(updating ? 'Course changes saved.' : 'New course saved.');
    }
  }
  const visible = items.filter((course) => `${course.title} ${course.category}`.toLowerCase().includes(query.toLowerCase()));

  return <>
    <form onSubmit={save} className="admin-course-editor">
      <div className="admin-course-editor-heading"><h3>{editingId ? 'Edit course' : 'Add new course'}</h3>{editingId && <button type="button" disabled={busy} onClick={reset}><X size={16} /> Cancel</button>}</div>
      <fieldset disabled={busy} className="manager-form">
        <label>Course title<input ref={titleInput} required value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} /></label>
        <label>Category<input required value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} /></label>
        <label>Batch / duration<input value={draft.duration} onChange={(event) => setDraft({ ...draft, duration: event.target.value })} /></label>
        <label className="course-editor-wide">Short description<textarea rows={2} value={draft.shortDescription} onChange={(event) => setDraft({ ...draft, shortDescription: event.target.value })} /></label>
        <label>Image URL<input value={draft.image} onChange={(event) => setDraft({ ...draft, image: event.target.value })} /></label>
        <label>Eligibility<input value={draft.eligibility} onChange={(event) => setDraft({ ...draft, eligibility: event.target.value })} /></label>
        <label>Highlights (one per line)<textarea rows={3} value={draft.features} onChange={(event) => setDraft({ ...draft, features: event.target.value })} /></label>
        <label>Exam stages (one per line)<textarea rows={3} value={draft.examStages} onChange={(event) => setDraft({ ...draft, examStages: event.target.value })} /></label>
        <h4 className="course-editor-wide">View details page content</h4>
        {detailFields.map(({ key, label }) => <label key={key}>{label}<textarea rows={5} value={draft.details[key]} onChange={(event) => setDraft({ ...draft, details: { ...draft.details, [key]: event.target.value } })} /></label>)}
        <label className="course-editor-wide">What We Provide<textarea rows={3} value={draft.provision} onChange={(event) => setDraft({ ...draft, provision: event.target.value })} /></label>
        <label>Visibility<select value={draft.enabled ? 'enabled' : 'disabled'} onChange={(event) => setDraft({ ...draft, enabled: event.target.value === 'enabled' })}><option value="enabled">Enabled</option><option value="disabled">Disabled</option></select></label>
        <div className="course-editor-actions course-editor-wide"><button type="submit" className="premium-button">{busy ? <Loader2 size={17} className="spin" /> : <Save size={17} />} {busy ? 'Saving...' : editingId ? 'Save Changes' : 'Add & Save Course'}</button>{editingId && <button type="button" onClick={reset}><X size={17} /> Cancel</button>}</div>
      </fieldset>
    </form>
    {error && <p className="form-note error" role="alert">{error}</p>}
    {message && <p className="form-note" role="status">{message}</p>}
    <div className="content-list">{visible.map((course) => <article key={course.id}>
      <h3>{course.title}</h3><p>{course.shortDescription}</p>
      <button disabled={busy} onClick={() => edit(course)}><Pencil size={16} /> Edit</button>
      <button disabled={busy} onClick={async () => { if (await mutate(`/api/admin/courses/${course.id}`, 'PATCH', { enabled: !course.enabled })) { if (editingId === course.id) setDraft({ ...draft, enabled: !course.enabled }); setMessage('Course visibility saved.'); } }}>{course.enabled ? 'Disable' : 'Enable'}</button>
      <button disabled={busy} aria-label={`Delete ${course.title}`} onClick={async () => { if (!window.confirm(`Delete ${course.title}?`)) return; if (await mutate(`/api/admin/courses/${course.id}`, 'DELETE')) { if (editingId === course.id) reset(); setMessage('Course deleted.'); } }}><Trash2 size={16} /> Delete</button>
    </article>)}</div>
    {!visible.length && <p>No courses match your search.</p>}
    {editingId && <button className="course-add-button" disabled={busy} onClick={() => { reset(); titleInput.current?.focus(); }}><Plus size={17} /> Add new course</button>}
  </>;
}
