import { Award, CheckCircle2, Users } from 'lucide-react';
import { trustDetails } from '@/data/trust-details';
import { achievementCounts, trustProfile } from '@/data/trust';
import { AnimatedText } from '@/components/animation/AnimatedText';
import { CountUp } from '@/components/animation/CountUp';

function DetailCards({ items }: { items: { title: string; description: string }[] }) {
  return <div className="feature-grid">{items.map(({ title, description }, i) => <article key={title} data-rev style={{ '--d': `${i * 60}ms` } as React.CSSProperties}><Users size={24} aria-hidden="true" /><h3>{title}</h3><p>{description}</p></article>)}</div>;
}

export function TrustPurpose() {
  return <>
    <section className="section-wrap soft-band" id="vision">
      <div className="section-title"><span className="eyebrow fade-up">Our vision</span><h2><AnimatedText text="An empowered and educated community." /></h2>{trustDetails.vision.map((text, i) => <p key={text} className="fade-up" style={{ transitionDelay: `${80 + i * 40}ms` }}>{text}</p>)}</div>
    </section>
    <section className="section-wrap" id="mission">
      <div className="section-title"><span className="eyebrow fade-up">Our mission</span><h2><AnimatedText text="Accessible education. Meaningful opportunities." /></h2><p className="fade-up">{trustDetails.mission}</p></div>
      <div className="trust-copy fade-up"><p>We aim to:</p><ul>{trustDetails.missionAims.map((text, i) => <li key={text} data-rev style={{ '--d': `${i * 40}ms` } as React.CSSProperties}>{text}</li>)}</ul></div>
    </section>
    <section className="section-wrap soft-band" id="objectives">
      <div className="section-title"><span className="eyebrow fade-up">Our objectives</span><h2><AnimatedText text="Supporting students at every step." /></h2><p className="fade-up">{trustDetails.objectivesIntro}</p></div>
      <div className="trust-copy"><ul className="fade-up">{trustDetails.objectives.map((text, i) => <li key={text} data-rev style={{ '--d': `${i * 40}ms` } as React.CSSProperties}>{text}</li>)}</ul></div>
    </section>
  </>;
}

export function TrustAchievements() {
  return <section className="section-wrap soft-band" id="achievements">
    <div className="section-title"><span className="eyebrow fade-up">Key achievements</span><h2><AnimatedText text="Milestones that inspire our community." /></h2><p className="fade-up">PAART was established on <strong><time dateTime={trustProfile.establishedDate}>{trustProfile.establishedDateLabel}</time></strong>.</p><p className="fade-up">{trustDetails.achievementsIntro}</p></div>
    <div className="achievement-summary fade-up">
      <h3>Department-wise achievement counts</h3>
      <dl className="achievement-counts">{achievementCounts.map(({ department, count }, i) => <div key={department} data-rev style={{ '--d': `${i * 40}ms` } as React.CSSProperties}><dt>{department}</dt><dd><CountUp end={count} durationMs={1200} /></dd></div>)}</dl>
    </div>
    <p className="trust-copy achievement-highlights fade-up">Some highlighted achievements include:</p>
    <div className="feature-grid trust-achievements">{trustDetails.achievements.map((title, i) => <article key={title} data-rev style={{ '--d': `${i * 60}ms` } as React.CSSProperties}><Award size={26} aria-hidden="true" /><h3>{title}</h3></article>)}</div>
    <p className="trust-copy trust-closing fade-up"><mark>{trustDetails.achievementsConclusion}</mark></p>
  </section>;
}

export function TrustActivities() {
  return <section className="section-wrap" id="activities">
    <div className="section-title"><span className="eyebrow fade-up">Our activities</span><h2><AnimatedText text="Education and support for our community." /></h2><p className="fade-up">{trustDetails.activitiesIntro}</p></div>
    <DetailCards items={trustDetails.activities} />
  </section>;
}

export function TrustFuturePlans() {
  return <section className="section-wrap soft-band" id="future-plans">
    <div className="section-title"><span className="eyebrow fade-up">Future plans</span><h2><AnimatedText text="More opportunities. A wider reach." /></h2><p className="fade-up">{trustDetails.plansIntro}</p></div>
    <div className="feature-grid">{trustDetails.plans.map(({ title, description }, i) => <article key={title} data-rev style={{ '--d': `${i * 60}ms` } as React.CSSProperties}><CheckCircle2 size={24} aria-hidden="true" /><h3>{title}</h3><p>{description}</p><span className="trust-plan-label">Planned initiative</span></article>)}</div>
  </section>;
}

export function TrustCommunity() {
  return <>
    <section className="section-wrap" id="values">
      <div className="section-title"><span className="eyebrow fade-up">Our values</span><h2><AnimatedText text="Education, service and integrity." /></h2></div>
      <DetailCards items={trustDetails.values} />
    </section>
    <section className="section-wrap soft-band" id="our-approach">
      <div className="section-title"><span className="eyebrow fade-up">Our approach</span><h2><AnimatedText text="Guidance for the whole journey." /></h2>{trustDetails.approach.map((text, i) => <p key={text} className="fade-up" style={{ transitionDelay: `${80 + i * 40}ms` }}>{text}</p>)}</div>
    </section>
    <section className="section-wrap" id="who-we-support">
      <div className="section-title"><span className="eyebrow fade-up">Who we support</span><h2><AnimatedText text="Opportunities for every learner." /></h2><p className="fade-up">{trustDetails.audienceIntro}</p></div>
      <DetailCards items={trustDetails.audience} />
    </section>
  </>;
}
