import {
  PublicFooter,
  PublicNavbar,
} from "@/components/public/PublicChrome";

export const metadata = {
  title: "About PAART Academy | Professional Competitive Exam Coaching",
};

export default function AboutPage() {
  return (
    <>
      <PublicNavbar />

      <main className="page-shell">
        <section className="page-hero">
          <span className="eyebrow">About us</span>

          <h1>
            Premium guidance for <em>serious aspirants.</em>
          </h1>

          <p>
            PAART Academy helps students prepare for TNPSC and competitive
            examinations with structure, mentoring, current affairs and regular
            test practice.
          </p>
        </section>

        <section className="section-wrap">
          <div className="feature-grid">
            {[
              "Exam-first content",
              "Readable study rhythm",
              "Performance review",
              "Student support",
            ].map((item) => (
              <article key={item}>
                <h3>{item}</h3>
                <p>
                  Our teaching and support systems are built to help students
                  stay consistent from foundation to final revision.
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <PublicFooter />
    </>
  );
}