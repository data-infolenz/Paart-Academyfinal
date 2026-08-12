'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { BookOpen, FileImage, LayoutDashboard, Loader2, LogOut, Newspaper, Save, Search, Settings, Trash2, Upload, Users } from 'lucide-react';
import { usePathname } from 'next/navigation';
import type { Admission, Blog, CmsData, Enquiry, GalleryItem, ManagedCourse, Material, MediaItem } from '@/types/cms';

const nav = ['Dashboard', 'Admissions', 'Enquiries', 'Courses', 'Materials', 'Blogs', 'Gallery', 'Media', 'Settings'] as const;
type View = (typeof nav)[number];

type Draft = Record<string, string | boolean | number>;

const emptyCourse = { title: '', category: 'TNPSC', shortDescription: '', duration: '', eligibility: '', image: '', features: '', examStages: '', enabled: true };
const emptyMaterial = { title: '', category: 'Study Material', description: '', thumbnail: '', fileUrl: '', externalUrl: '', displayOrder: 1, published: true };
const emptyBlog = { title: '', shortDescription: '', content: '', author: 'PAART Academy', publishedDate: new Date().toISOString().slice(0, 10), category: '', featuredImage: '', seoTitle: '', metaDescription: '', keywords: '', published: true };
const emptyGallery = { title: '', description: '', category: 'Classroom', image: '', videoUrl: '', order: 1 };

export function AdminPanel() {
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('Dashboard');
  const [data, setData] = useState<CmsData | null>(null);
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState('');
  const [draft, setDraft] = useState<Draft>({});
  const [error, setError] = useState('');

  useEffect(() => {
    const segment = pathname.split('/').filter(Boolean).pop();
    const match = nav.find((item) => item.toLowerCase() === segment);
    if (match) setView(match);
    if (segment === 'dashboard') setView('Dashboard');
  }, [pathname]);

  async function load() {
    const response = await fetch('/api/admin/data');
    if (!response.ok) {
      setAuthed(false);
      setLoading(false);
      return;
    }
    setAuthed(true);
    setData(await response.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy('login');
    setError('');
    const form = new FormData(event.currentTarget);
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.get('email'), password: form.get('password') }),
    });
    if (!response.ok) {
      setError('Invalid admin credentials.');
      setBusy('');
      return;
    }
    await load();
    setBusy('');
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setAuthed(false);
    setData(null);
  }

  async function patch(collection: string, id: string, body: Draft) {
    setBusy(id);
    await fetch(`/api/admin/${collection}/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    await load();
    setBusy('');
  }

  async function remove(collection: string, id: string) {
    setBusy(id);
    await fetch(`/api/admin/${collection}/${id}`, { method: 'DELETE' });
    await load();
    setBusy('');
  }

  async function create(collection: string) {
    const fallback = collection === 'courses' ? emptyCourse : collection === 'materials' ? emptyMaterial : collection === 'blogs' ? emptyBlog : emptyGallery;
    setBusy(collection);
    await fetch(`/api/admin/${collection}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...fallback, ...draft }) });
    setDraft({});
    await load();
    setBusy('');
  }

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = Object.fromEntries(new FormData(event.currentTarget).entries());
    setBusy('settings');
    await fetch('/api/admin/settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    await load();
    setBusy('');
  }

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy('upload');
    await fetch('/api/admin/upload', { method: 'POST', body: new FormData(event.currentTarget) });
    event.currentTarget.reset();
    await load();
    setBusy('');
  }

  const filteredAdmissions = useMemo(() => filter(data?.admissions ?? [], query, ['applicationId', 'studentName', 'mobile', 'courseInterested', 'status']), [data, query]);
  const filteredEnquiries = useMemo(() => filter(data?.enquiries ?? [], query, ['name', 'phone', 'courseInterested', 'status']), [data, query]);

  if (loading) return <main className="admin-loading"><Loader2 className="spin" /> Loading admin panel</main>;
  if (!authed) return (
    <main className="admin-login">
      <form onSubmit={login}>
        <span className="eyebrow">Secure admin</span>
        <h1>PAART Academy Admin</h1>
        <label>Email<input name="email" type="email" defaultValue="admin@paartacademy.in" required /></label>
        <label>Password<input name="password" type="password" placeholder="Paart@2026" required /></label>
        <button className="premium-button" disabled={busy === 'login'}>{busy === 'login' ? <Loader2 className="spin" /> : <LayoutDashboard />} Login</button>
        {error && <p className="form-note error">{error}</p>}
      </form>
    </main>
  );

  if (!data) return null;

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <h1>PAART <span>Admin</span></h1>
        {nav.map((item) => <button key={item} className={view === item ? 'active' : ''} onClick={() => setView(item)}>{icon(item)} {item}</button>)}
        <button onClick={logout}><LogOut size={18} /> Logout</button>
      </aside>
      <section className="admin-main">
        <div className="admin-top"><div><span className="eyebrow">{view}</span><h2>{view === 'Dashboard' ? 'Academy command center' : `Manage ${view.toLowerCase()}`}</h2></div>{view !== 'Dashboard' && view !== 'Settings' && <label className="admin-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search records" /></label>}</div>
        {view === 'Dashboard' && <Dashboard data={data} />}
        {view === 'Admissions' && <AdmissionsTable items={filteredAdmissions} busy={busy} patch={patch} remove={remove} />}
        {view === 'Enquiries' && <EnquiriesTable items={filteredEnquiries} busy={busy} patch={patch} remove={remove} />}
        {view === 'Courses' && <CourseManager items={data.courses} draft={draft} setDraft={setDraft} create={create} patch={patch} remove={remove} />}
        {view === 'Materials' && <MaterialManager items={data.materials} draft={draft} setDraft={setDraft} create={create} patch={patch} remove={remove} />}
        {view === 'Blogs' && <BlogManager items={data.blogs} draft={draft} setDraft={setDraft} create={create} patch={patch} remove={remove} />}
        {view === 'Gallery' && <GalleryManager items={data.gallery} draft={draft} setDraft={setDraft} create={create} remove={remove} />}
        {view === 'Media' && <MediaManager items={data.media} upload={upload} remove={remove} busy={busy} />}
        {view === 'Settings' && <SettingsForm data={data} saveSettings={saveSettings} busy={busy} />}
      </section>
    </main>
  );
}

function filter<T extends Record<string, unknown>>(items: T[], query: string, fields: string[]) {
  const needle = query.toLowerCase();
  return items.filter((item) => fields.some((field) => String(item[field] ?? '').toLowerCase().includes(needle)));
}

function icon(view: View) {
  const props = { size: 18 };
  if (view === 'Dashboard') return <LayoutDashboard {...props} />;
  if (view === 'Admissions' || view === 'Enquiries') return <Users {...props} />;
  if (view === 'Courses') return <BookOpen {...props} />;
  if (view === 'Blogs') return <Newspaper {...props} />;
  if (view === 'Materials') return <DownloadIcon />;
  if (view === 'Gallery' || view === 'Media') return <FileImage {...props} />;
  return <Settings {...props} />;
}

function Dashboard({ data }: { data: CmsData }) {
  const cards = [
    ['Total Admissions', data.admissions.length],
    ['New Admissions', data.admissions.filter((item) => item.status === 'New').length],
    ['Total Enquiries', data.enquiries.length],
    ['Total Courses', data.courses.length],
    ['Total Materials', data.materials.length],
    ['Total Blogs', data.blogs.length],
    ['Gallery Images', data.gallery.length],
  ];
  return <><div className="metric-grid">{cards.map(([label, value]) => <article key={label}><span>{label}</span><b>{value}</b></article>)}</div><div className="admin-columns"><Recent title="Recent Admissions" items={data.admissions.slice(0, 6).map((item) => `${item.applicationId} · ${item.studentName} · ${item.status}`)} /><Recent title="Recent Enquiries" items={data.enquiries.slice(0, 6).map((item) => `${item.name} · ${item.phone} · ${item.status}`)} /></div></>;
}

function DownloadIcon() {
  return <FileImage size={18} />;
}

function Recent({ title, items }: { title: string; items: string[] }) {
  return <article className="admin-panel-card"><h3>{title}</h3>{items.length ? items.map((item) => <p key={item}>{item}</p>) : <p>No records yet.</p>}</article>;
}

function AdmissionsTable({ items, busy, patch, remove }: { items: Admission[]; busy: string; patch: (c: string, id: string, body: Draft) => Promise<void>; remove: (c: string, id: string) => Promise<void> }) {
  return <div className="admin-table">{items.map((item) => <article key={item.id}><b>{item.applicationId}</b><span>{item.studentName}</span><span>{item.mobile}</span><span>{item.courseInterested}</span><select value={item.status} onChange={(event) => patch('admissions', item.id, { status: event.target.value })}>{['New', 'Contacted', 'Pending', 'Approved', 'Rejected', 'Joined'].map((status) => <option key={status}>{status}</option>)}</select><small>{new Date(item.appliedDate).toLocaleDateString()}</small><button onClick={() => remove('admissions', item.id)} disabled={busy === item.id}><Trash2 size={16} /></button></article>)}</div>;
}

function EnquiriesTable({ items, busy, patch, remove }: { items: Enquiry[]; busy: string; patch: (c: string, id: string, body: Draft) => Promise<void>; remove: (c: string, id: string) => Promise<void> }) {
  return <div className="admin-table">{items.map((item) => <article key={item.id}><b>{item.name}</b><span>{item.phone}</span><span>{item.courseInterested}</span><span>{item.message}</span><select value={item.status} onChange={(event) => patch('enquiries', item.id, { status: event.target.value })}>{['New', 'Contacted', 'Closed'].map((status) => <option key={status}>{status}</option>)}</select><button onClick={() => remove('enquiries', item.id)} disabled={busy === item.id}><Trash2 size={16} /></button></article>)}</div>;
}

function CourseManager({ items, draft, setDraft, create, patch, remove }: { items: ManagedCourse[]; draft: Draft; setDraft: (d: Draft) => void; create: (c: string) => Promise<void>; patch: (c: string, id: string, body: Draft) => Promise<void>; remove: (c: string, id: string) => Promise<void> }) {
  return <><ManagerForm fields={['title', 'category', 'shortDescription', 'duration', 'eligibility', 'image', 'features', 'examStages']} draft={draft} setDraft={setDraft} onCreate={() => create('courses')} /><div className="content-list">{items.map((item) => <article key={item.id}><h3>{item.title}</h3><p>{item.shortDescription}</p><button onClick={() => patch('courses', item.id, { enabled: !item.enabled })}>{item.enabled ? 'Disable' : 'Enable'}</button><button onClick={() => remove('courses', item.id)}><Trash2 size={16} /></button></article>)}</div></>;
}

function BlogManager({ items, draft, setDraft, create, patch, remove }: { items: Blog[]; draft: Draft; setDraft: (d: Draft) => void; create: (c: string) => Promise<void>; patch: (c: string, id: string, body: Draft) => Promise<void>; remove: (c: string, id: string) => Promise<void> }) {
  return <><ManagerForm fields={['title', 'shortDescription', 'content', 'author', 'publishedDate', 'category', 'featuredImage', 'seoTitle', 'metaDescription', 'keywords']} draft={draft} setDraft={setDraft} onCreate={() => create('blogs')} /><div className="content-list">{items.map((item) => <article key={item.id}><h3>{item.title}</h3><p>{item.shortDescription}</p><button onClick={() => patch('blogs', item.id, { published: !item.published })}>{item.published ? 'Unpublish' : 'Publish'}</button><button onClick={() => remove('blogs', item.id)}><Trash2 size={16} /></button></article>)}</div></>;
}

function MaterialManager({ items, draft, setDraft, create, patch, remove }: { items: Material[]; draft: Draft; setDraft: (d: Draft) => void; create: (c: string) => Promise<void>; patch: (c: string, id: string, body: Draft) => Promise<void>; remove: (c: string, id: string) => Promise<void> }) {
  return <><ManagerForm fields={['title', 'category', 'description', 'thumbnail', 'fileUrl', 'externalUrl', 'displayOrder']} draft={draft} setDraft={setDraft} onCreate={() => create('materials')} /><div className="content-list">{items.map((item) => <article key={item.id}><h3>{item.title}</h3><p>{item.category}</p><p>{item.description}</p><button onClick={() => patch('materials', item.id, { published: !item.published })}>{item.published ? 'Unpublish' : 'Publish'}</button><button onClick={() => remove('materials', item.id)}><Trash2 size={16} /></button></article>)}</div></>;
}

function GalleryManager({ items, draft, setDraft, create, remove }: { items: GalleryItem[]; draft: Draft; setDraft: (d: Draft) => void; create: (c: string) => Promise<void>; remove: (c: string, id: string) => Promise<void> }) {
  return <><ManagerForm fields={['title', 'description', 'category', 'image', 'videoUrl', 'order']} draft={draft} setDraft={setDraft} onCreate={() => create('gallery')} /><div className="content-list">{items.map((item) => <article key={item.id}><h3>{item.title}</h3><p>{item.category}</p><button onClick={() => remove('gallery', item.id)}><Trash2 size={16} /></button></article>)}</div></>;
}

function ManagerForm({ fields, draft, setDraft, onCreate }: { fields: string[]; draft: Draft; setDraft: (d: Draft) => void; onCreate: () => void }) {
  return <section className="manager-form">{fields.map((field) => <label key={field}>{field}<textarea value={String(draft[field] ?? '')} onChange={(event) => setDraft({ ...draft, [field]: event.target.value })} rows={field.includes('content') || field.includes('features') ? 4 : 2} /></label>)}<button className="premium-button" onClick={onCreate}><Save size={17} /> Add New</button></section>;
}

function MediaManager({ items, upload, remove, busy }: { items: MediaItem[]; upload: (event: FormEvent<HTMLFormElement>) => Promise<void>; remove: (c: string, id: string) => Promise<void>; busy: string }) {
  return <><form className="manager-form" onSubmit={upload}><label>Title<input name="title" /></label><label>Upload<input name="file" type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" required /></label><button className="premium-button" disabled={busy === 'upload'}><Upload size={17} /> Upload</button></form><div className="content-list">{items.map((item) => <article key={item.id}><h3>{item.title}</h3><p>{item.url}</p><button onClick={() => navigator.clipboard.writeText(item.url)}>Copy URL</button><button onClick={() => remove('media', item.id)}><Trash2 size={16} /></button></article>)}</div></>;
}

function SettingsForm({ data, saveSettings, busy }: { data: CmsData; saveSettings: (event: FormEvent<HTMLFormElement>) => Promise<void>; busy: string }) {
  return <form className="manager-form settings-form" onSubmit={saveSettings}>{Object.entries(data.settings).map(([key, value]) => <label key={key}>{key}<textarea name={key} defaultValue={String(value)} rows={2} /></label>)}<button className="premium-button" disabled={busy === 'settings'}><Save size={17} /> Save Settings</button></form>;
}
