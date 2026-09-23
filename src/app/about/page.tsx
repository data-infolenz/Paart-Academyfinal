import { PublicFooter, PublicNavbar } from '@/components/public/PublicChrome';
import { TrustAchievements, TrustActivities, TrustFuturePlans, TrustPurpose, TrustCommunity } from '@/components/public/TrustSections';


export const metadata = { title: 'About PAART | Puliyangudi Academic & Achievements Resource Trust' };

export default function AboutPage() {
  return <>
    <PublicNavbar />
    <main className="page-shell">
      <section className="page-hero">
        <span className="eyebrow">About Us</span>
        <h1>Education, opportunity <em>and community.</em></h1>
        <p><strong>PAART – Puliyangudi Academic &amp; Achievements Resource Trust</strong> is a non-profit public welfare trust established on <strong>22 December 2018</strong> with the aim of supporting students, job aspirants, and the community through education, training, guidance, and social welfare initiatives.</p>
        <p>Based in <strong>Puliyangudi, Tenkasi District</strong>, PAART works to create opportunities for students from different educational and economic backgrounds. The trust provides guidance for higher education, competitive examinations, skill development, personality development, scholarships, and other student-support activities.</p>
        <p>Our focus is not only on examination success, but also on helping students develop the knowledge, confidence, skills, and direction required to build a better future.</p>
      </section>
      <TrustPurpose />
      <TrustActivities />
      <TrustAchievements />
      <TrustFuturePlans />
      <TrustCommunity />
    </main>
    <PublicFooter />
  </>;
}