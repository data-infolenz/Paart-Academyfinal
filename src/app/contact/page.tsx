import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { PublicFooter, PublicNavbar } from '@/components/public/PublicChrome';
import { trustProfile } from '@/data/trust';
import { readCms } from '@/server/db';

export const metadata = { title: 'Contact | PAART Academy' };
export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const { courses, settings } = await readCms();
  return (
    <>
      <PublicNavbar />
      <main className="page-shell">
        <section className="page-hero"><span className="eyebrow">Contact</span><h1>Talk to our <em>admission team.</em></h1><p>{trustProfile.name}</p><p>{trustProfile.address}</p><p>{trustProfile.additionalAddress}</p><div className="trust-phone-list">{trustProfile.phones.map((phone) => <a key={phone} href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>)}</div><p>{settings.email}</p></section>
        <section className="section-wrap enquiry-band"><EnquiryForm courses={courses.filter((course) => course.enabled)} whatsapp={settings.whatsapp} /></section>
      </main>
      <PublicFooter />
    </>
  );
}
