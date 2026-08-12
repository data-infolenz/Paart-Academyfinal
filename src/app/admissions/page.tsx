import { AdmissionForm } from '@/components/forms/AdmissionForm';
import { PublicFooter, PublicNavbar } from '@/components/public/PublicChrome';
import { readCms } from '@/server/db';

export const metadata = { title: 'Admissions | Apply Now | PAART Academy' };
export const dynamic = 'force-dynamic';

export default async function AdmissionsPage() {
  const { courses } = await readCms();
  return (
    <>
      <PublicNavbar />
      <main className="page-shell">
        <section className="page-hero"><span className="eyebrow">Admissions</span><h1>Submit your application <em>online.</em></h1><p>Complete the admission form and receive a unique PAART application ID instantly.</p></section>
        <section className="section-wrap"><AdmissionForm courses={courses.filter((course) => course.enabled)} /></section>
      </main>
      <PublicFooter />
    </>
  );
}
