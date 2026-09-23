import { Award, CheckCircle2, Users } from 'lucide-react';
import { trustDetails } from '@/data/trust-details';
import { achievementCounts, trustProfile } from '@/data/trust';

function DetailCards({ items }: { items: { title: string; description: string }[] }) {
  return <div className="feature-grid">{items.map(({ title, description }) => <article key={title}><Users size={24} aria-hidden="true" /><h3>{title}</h3><p>{description}</p></article>)}</div>;
}

export function TrustPurpose() {
  return <>
    <section className="section-wrap soft-band" id="vision">
      <div className="section-title"><span className="eyebrow">Our vision</span><h2>An empowered <em>and educated community.</em></h2>{trustDetails.vision.map((text) => <p key={text}>{text}</p>)}</div>
    </section>
    <section className="section-wrap" id="mission">
      <div className="section-title"><span className="eyebrow">Our mission</span><h2>Accessible education. <em>Meaningful opportunities.</em></h2><p>{trustDetails.mission}</p></div>
      <div className="trust-copy"><p>We aim to:</p><ul>{trustDetails.missionAims.map((text) => <li key={text}>{text}</li>)}</ul></div>
    </section>
    <section className="section-wrap soft-band" id="objectives">
      <div className="section-title"><span className="eyebrow">Our objectives</span><h2>Supporting students <em>at every step.</em></h2><p>{trustDetails.objectivesIntro}</p></div>
      <div className="trust-copy"><ul>{trustDetails.objectives.map((text) => <li key={text}>{text}</li>)}</ul></div>
    </section>
  </>;
}

export function TrustAchievements() {
  return <section className="section-wrap soft-band" id="achievements">
    <div className="section-title"><span className="eyebrow">Key achievements</span><h2>Milestones that <em>inspire our community.</em></h2><p>PAART was established on <strong><time dateTime={trustProfile.establishedDate}>{trustProfile.establishedDateLabel}</time></strong>.</p><p>{trustDetails.achievementsIntro}</p></div>
    <div className="achievement-summary">
      <h3>Department-wise achievement counts</h3>
      <dl className="achievement-counts">{achievementCounts.map(({ department, count }) => <div key={department}><dt>{department}</dt><dd>{count}</dd></div>)}</dl>
    </div>
    <p className="trust-copy achievement-highlights">Some highlighted achievements include:</p>
    <div className="feature-grid trust-achievements">{trustDetails.achievements.map((title) => <article key={title}><Award size={26} aria-hidden="true" /><h3>{title}</h3></article>)}</div>
    <p className="trust-copy trust-closing">{trustDetails.achievementsConclusion}</p>
  </section>;
}

export function TrustActivities() {
  return <section className="section-wrap" id="activities">
    <div className="section-title"><span className="eyebrow">Our activities</span><h2>Education and support <em>for our community.</em></h2><p>{trustDetails.activitiesIntro}</p></div>
    <DetailCards items={trustDetails.activities} />
  </section>;
}

export function TrustFuturePlans() {
  return <section className="section-wrap soft-band" id="future-plans">
    <div className="section-title"><span className="eyebrow">Future plans</span><h2>More opportunities. <em>A wider reach.</em></h2><p>{trustDetails.plansIntro}</p></div>
    <div className="feature-grid">{trustDetails.plans.map(({ title, description }) => <article key={title}><CheckCircle2 size={24} aria-hidden="true" /><h3>{title}</h3><p>{description}</p><span className="trust-plan-label">Planned initiative</span></article>)}</div>
  </section>;
}

export function TrustCommunity() {
  return <>
    <section className="section-wrap" id="values">
      <div className="section-title"><span className="eyebrow">Our values</span><h2>Education, service <em>and integrity.</em></h2></div>
      <DetailCards items={trustDetails.values} />
    </section>
    <section className="section-wrap soft-band" id="our-approach">
      <div className="section-title"><span className="eyebrow">Our approach</span><h2>Guidance for <em>the whole journey.</em></h2>{trustDetails.approach.map((text) => <p key={text}>{text}</p>)}</div>
    </section>
    <section className="section-wrap" id="who-we-support">
      <div className="section-title"><span className="eyebrow">Who we support</span><h2>Opportunities for <em>every learner.</em></h2><p>{trustDetails.audienceIntro}</p></div>
      <DetailCards items={trustDetails.audience} />
    </section>
  </>;
}
