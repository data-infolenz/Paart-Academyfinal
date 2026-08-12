import Link from 'next/link';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { readCms } from '@/server/db';
import { PublicFooter, PublicNavbar } from '@/components/public/PublicChrome';

export const metadata = { title: 'Courses | PAART Academy' };
export const dynamic = 'force-dynamic';

export default async function CoursesPage() {
  const { courses } = await readCms();
  return (
    <>
      <PublicNavbar />
      <main className="page-shell">
        <section className="page-hero"><span className="eyebrow">Courses</span><h1>Choose your exam. <em>Build your preparation.</em></h1><p>All course content can be managed from the admin panel and appears here automatically.</p></section>
        <section className="section-wrap"><div className="course-grid-pro">{courses.filter((course) => course.enabled).map((course) => <Link className="premium-card" href={`/courses/${course.slug}`} key={course.id}><GraduationCap size={28} /><span>{course.category}</span><h3>{course.title}</h3><p>{course.shortDescription}</p><b>{course.duration}</b><b>View details <ArrowRight size={16} /></b></Link>)}</div></section>
      </main>
      <PublicFooter />
    </>
  );
}
