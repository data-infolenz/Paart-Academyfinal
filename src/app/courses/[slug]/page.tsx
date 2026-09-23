import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { readCms } from '@/server/db';
import { PublicFooter, PublicNavbar } from '@/components/public/PublicChrome';
import { courseProvision } from '@/data/course-details';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await readCms();
  const course = data.courses.find((item) => item.slug === slug);
  return { title: course ? `${course.title} | PAART Academy` : 'Course | PAART Academy', description: course ? course.details?.overview ?? course.shortDescription : undefined };
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await readCms();
  const course = data.courses.find((item) => item.slug === slug);
  if (!course) notFound();
  const details = course.details;
  const sections = details ? [
    { title: 'Who Can Join', content: details.whoCanJoin },
    { title: 'Preparation Focus', content: details.preparationFocus },
    { title: 'Key Areas', content: details.keyAreas },
    { title: 'Course Support', content: details.support },
    { title: 'Course Outcome', content: details.outcome },
  ] : [];

  return (
    <>
      <PublicNavbar />
      <main className="page-shell">
        <section className="page-hero"><span className="eyebrow">{course.category}</span><h1>{course.title}</h1><p>{course.shortDescription}</p></section>
        {details ? <section className="section-wrap course-information" aria-label={`${course.title} course details`}>
          <div className="section-title"><h2>Course Overview</h2><p>{details.overview}</p></div>
          <div className="feature-grid course-information-grid">{sections.map(({ title, content }) => <article key={title}><h2>{title}</h2><p>{content}</p></article>)}</div>
        </section> : <section className="section-wrap detail-two"><div><h2>Course Overview</h2><p>{course.eligibility}</p><p>{course.duration}</p></div><aside>{course.features.map((feature) => <span key={feature}><CheckCircle2 size={18} /> {feature}</span>)}</aside></section>}
        <section className="section-wrap soft-band course-provision">
          <div className="section-title"><h2>What We Provide</h2><p>{course.provision ?? courseProvision}</p></div>
          <div className="course-admission-callout">
            <h2>Start Your Preparation With PAART</h2>
            <div className="hero-actions">
              <Link className="premium-button" href="/admissions">Apply Now <ArrowRight size={18} aria-hidden="true" /></Link>
              <Link className="premium-button" href="/contact">Enquire for Course Details <ArrowRight size={18} aria-hidden="true" /></Link>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
