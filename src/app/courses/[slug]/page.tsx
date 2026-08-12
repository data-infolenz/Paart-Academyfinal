import { notFound } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { readCms } from '@/server/db';
import { PublicFooter, PublicNavbar } from '@/components/public/PublicChrome';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await readCms();
  const course = data.courses.find((item) => item.slug === slug);
  return { title: course ? `${course.title} | PAART Academy` : 'Course | PAART Academy', description: course?.shortDescription };
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await readCms();
  const course = data.courses.find((item) => item.slug === slug);
  if (!course) notFound();
  return (
    <>
      <PublicNavbar />
      <main className="page-shell">
        <section className="page-hero"><span className="eyebrow">{course.category}</span><h1>{course.title}</h1><p>{course.shortDescription}</p></section>
        <section className="section-wrap detail-two"><div><h2>Course overview</h2><p>{course.eligibility}</p><p>{course.duration}</p></div><aside>{course.features.map((feature) => <span key={feature}><CheckCircle2 size={18} /> {feature}</span>)}</aside></section>
      </main>
      <PublicFooter />
    </>
  );
}
