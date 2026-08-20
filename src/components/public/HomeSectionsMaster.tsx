import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  CheckCircle2,
  Download,
  GraduationCap,
  Headphones,
  MapPin,
  PenLine,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import { readCms } from '@/server/db';
import { EnquiryForm } from '@/components/forms/EnquiryForm';

export async function HomeSectionsMaster() {
  const data = await readCms();
  const courses = data.courses.filter((course) => course.enabled);
  const materials = data.materials.filter((material) => material.published).sort((a, b) => a.displayOrder - b.displayOrder);
  const blogs = data.blogs.filter((blog) => blog.published).slice(0, 3);
  const gallery = [...data.gallery].sort((a, b) => a.order - b.order).slice(0, 6);
  const galleryLoop = [...data.gallery, ...data.gallery, ...data.gallery].sort((a, b) => a.order - b.order);
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(data.settings.address)}&output=embed`;

  return (
    <main>
      <section className="premium-hero" id="home">
        <div className="hero-study-effect book-effect" aria-hidden="true"><BookOpen size={118} /></div>
        <div className="hero-study-effect pen-effect" aria-hidden="true"><PenLine size={92} /><span /></div>
        <div className="hero-copy">
          <span className="eyebrow">Admissions open 2026</span>
          <h1><span>Your Government</span><span>Job Journey</span><em>Starts Here.</em></h1>
          <p>Structured TNPSC and competitive exam preparation with expert guidance, updated study materials, current affairs, test series and mentoring.</p>
          <div className="hero-actions">
            <Link className="premium-button" href="#courses">Explore Courses <BookOpen size={18} /></Link>
            <Link className="glass-button" href="#admission">Apply Now <ArrowRight size={18} /></Link>
          </div>
          <div className="hero-trust"><span><ShieldCheck size={18} /> Exam-focused learning</span><span><Users size={18} /> Tamil + English support</span></div>
        </div>
        <div className="hero-media">
          <video className="hero-video video-one" autoPlay muted loop playsInline preload="metadata" aria-label="PAART Academy classroom video 1">
            <source src="/videos/paart-video-1.mp4" type="video/mp4" />
          </video>
          <video className="hero-video video-two" autoPlay muted loop playsInline preload="metadata" aria-label="PAART Academy classroom video 2">
            <source src="/videos/paart-video-2.mp4" type="video/mp4" />
          </video>
          <div><Sparkles size={20} /> Premium learning environment</div>
        </div>
      </section>

      <section className="section-wrap stats-strip" id="achievements">
        {[['15+', 'Focused courses'], ['1000+', 'Student enquiries'], ['Daily', 'Current affairs'], ['2', 'Language support']].map(([value, label]) => <article key={label}><b>{value}</b><span>{label}</span></article>)}
      </section>

      <section className="section-wrap" id="about">
        <div className="section-title"><span className="eyebrow">About PAART Academy</span><h2>Guidance that builds <em>confident aspirants.</em></h2><p>PAART Academy is a focused learning space for TNPSC and competitive exam students. Every class, material and test is designed to make preparation steady, readable and measurable.</p></div>
        <div className="feature-grid">{['Structured syllabus', 'Daily current affairs', 'Regular mock tests', 'Personal mentoring'].map((item) => <article key={item}><CheckCircle2 size={22} /><h3>{item}</h3><p>Professional support designed for repeatable progress and clear exam readiness.</p></article>)}</div>
      </section>

      <section className="section-wrap soft-band" id="why-choose-us">
        <div className="section-title"><span className="eyebrow">Why choose us</span><h2>Designed for clarity, <em>discipline and confidence.</em></h2></div>
        <div className="feature-grid">{['Expert academic planning', 'Mock-test based improvement', 'Updated resources', 'Student-first support'].map((item) => <article key={item}><Award size={22} /><h3>{item}</h3><p>Each learning touchpoint is built around exam relevance, consistency and measurable preparation progress.</p></article>)}</div>
      </section>

      <section className="section-wrap" id="courses">
        <div className="section-title"><span className="eyebrow">Our courses</span><h2>Choose your exam. <em>Build your preparation.</em></h2></div>
        <div className="course-grid-pro">{courses.slice(0, 8).map((course) => <Link className="premium-card course-card-pro" href={`/courses/${course.slug}`} key={course.id}>{course.image && <Image src={course.image} alt={course.title} width={480} height={260} />}<GraduationCap size={26} /><span>{course.category}</span><h3>{course.title}</h3><p>{course.shortDescription}</p><small>{course.duration}</small><b>View details <ArrowRight size={16} /></b></Link>)}</div>
      </section>

      <section className="section-wrap soft-band" id="materials">
        <div className="section-title"><span className="eyebrow">Learning materials</span><h2>Resources that make <em>revision easier.</em></h2><p>Study materials, notes, PDFs, current affairs, question papers, mock tests and syllabus files managed from the admin panel.</p></div>
        <div className="materials-grid-pro">{materials.slice(0, 8).map((material) => <a className="material-pro" href={material.externalUrl || material.fileUrl} key={material.id} target="_blank" rel="noreferrer"><Download size={22} /><span>{material.category}</span><h3>{material.title}</h3><p>{material.description}</p><b>View / Download <ArrowRight size={15} /></b></a>)}</div>
      </section>

      <section className="section-wrap" id="facilities">
        <div className="section-title"><span className="eyebrow">Facilities</span><h2>A focused academy environment <em>for serious study.</em></h2></div>
        <div className="feature-grid">{['Classroom learning', 'Study materials desk', 'Test practice support', 'Guidance and counselling'].map((item) => <article key={item}><Building2 size={22} /><h3>{item}</h3><p>Clean, supportive learning systems shaped for repeated study, doubt clearing and exam confidence.</p></article>)}</div>
      </section>

      <section className="gallery-marquee-section" id="scrolling-gallery" aria-label="Scrolling academy gallery">
        <div className="marquee-row">{galleryLoop.map((item, index) => <Image key={`${item.id}-a-${index}`} src={item.image} alt={item.title} width={320} height={210} />)}</div>
        <div className="marquee-row reverse">{galleryLoop.map((item, index) => <Image key={`${item.id}-b-${index}`} src={item.image} alt={item.title} width={320} height={210} />)}</div>
      </section>

      <section className="section-wrap soft-band" id="gallery">
        <div className="section-title"><span className="eyebrow">Gallery</span><h2>Learning moments, <em>captured beautifully.</em></h2></div>
        <div className="masonry-grid home-gallery-grid">{gallery.map((item) => <figure key={item.id}><Image src={item.image} alt={item.description || item.title} width={620} height={420} /><figcaption>{item.title}</figcaption></figure>)}</div>
        <Link className="premium-button section-action" href="/gallery">Open full gallery <ArrowRight size={16} /></Link>
      </section>

      <section className="section-wrap" id="testimonials">
        <div className="section-title"><span className="eyebrow">Testimonials</span><h2>Support students can <em>feel every week.</em></h2></div>
        <div className="feature-grid">{['Clear explanations and regular tests helped me stay consistent.', 'The current affairs support made revision easier before mock tests.', 'The team guided me in choosing the right preparation path.', 'Materials and mentoring helped me organise my study plan.'].map((quote) => <article key={quote}><Star size={22} /><p>{quote}</p><h3>PAART Student</h3></article>)}</div>
      </section>

      <section className="section-wrap soft-band" id="blogs">
        <div className="section-title"><span className="eyebrow">Blogs</span><h2>Exam preparation insights <em>from PAART.</em></h2></div>
        <div className="blog-grid">{blogs.map((blog) => <Link className="blog-card" href={`/blogs/${blog.slug}`} key={blog.id}><Image src={blog.featuredImage} alt={blog.title} width={620} height={390} /><span>{blog.category} - {blog.publishedDate}</span><h3>{blog.title}</h3><p>{blog.shortDescription}</p></Link>)}</div>
      </section>

      <section className="section-wrap admission-home" id="admission">
        <div className="section-title"><span className="eyebrow">Admission</span><h2>Ready to begin? <em>Apply online.</em></h2><p>Submit the detailed admission form, upload documents and receive your application ID instantly.</p></div>
        <Link className="premium-button" href="/admissions">Open Admission Form <ArrowRight size={18} /></Link>
      </section>

      <section className="section-wrap enquiry-band" id="contact">
        <div className="section-title contact-details">
          <span className="eyebrow">Get in touch</span>
          <h2>Let us plan your <em>next right step.</em></h2>
          <p>Send an enquiry and continue directly on WhatsApp with a pre-filled message.</p>
          <a href={`tel:${data.settings.phone}`}><Phone size={18} /> {data.settings.phone}</a>
          <a href={`mailto:${data.settings.email}`}><Headphones size={18} /> {data.settings.email}</a>
          <span><MapPin size={18} /> {data.settings.address}</span>
        </div>
        <div className="contact-grid">
          <EnquiryForm courses={courses} whatsapp={data.settings.whatsapp} />
          <iframe className="map-frame" src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="PAART Academy location" />
        </div>
      </section>
    </main>
  );
}
