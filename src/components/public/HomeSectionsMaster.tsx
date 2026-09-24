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
  Phone,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { trustProfile, presentationEvents } from '@/data/trust';
import { presentationGallery } from '@/data/presentation-gallery';
import { TrustAchievements, TrustActivities, TrustFuturePlans, TrustPurpose, TrustCommunity } from './TrustSections';
import { readCms } from '@/server/db';
import { GalleryCardSwap } from './GalleryCardSwap';
import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { AnimatedText } from '@/components/animation/AnimatedText';

export async function HomeSectionsMaster() {
  const data = await readCms();
  const courses = data.courses.filter((course) => course.enabled);
  const materials = data.materials.filter((material) => material.published).sort((a, b) => a.displayOrder - b.displayOrder);
  const blogs = data.blogs.filter((blog) => blog.published).slice(0, 3);
  const gallery = [...data.gallery].sort((a, b) => a.order - b.order).slice(0, 6);
  const showcaseGallery = [...data.gallery].sort((a, b) => a.order - b.order);
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(trustProfile.address)}&output=embed`;

  return (
    <main>
      <section className="premium-hero campus-hero" id="home">
        <div className="hero-copy">
          <span className="eyebrow fade-up">Admissions open 2026</span>
          <h1 className="animated-text-container">
            <span>
              <span className="word" style={{transitionDelay:'80ms'}}>Your</span>{' '}<span className="word" style={{transitionDelay:'116ms'}}>Government</span>
            </span>
            <span>
              <span className="word" style={{transitionDelay:'152ms'}}>Job</span>{' '}<span className="word" style={{transitionDelay:'188ms'}}>Journey</span>
            </span>
            <em>
              <span className="word" style={{transitionDelay:'224ms'}}>Starts</span>{' '}<span className="word" style={{transitionDelay:'260ms'}}>Here.</span>
            </em>
          </h1>
          <p className="fade-up" style={{transitionDelay:'160ms'}}>Structured TNPSC and competitive exam preparation with expert guidance, updated study materials, current affairs, test series and mentoring.</p>
          <div className="hero-actions fade-up" style={{transitionDelay:'240ms'}}>
            <Link className="premium-button" href="#courses" data-rev-btn>Explore Courses <BookOpen size={18} /></Link>
            <Link className="glass-button" href="#admission" data-rev-btn style={{'--d': '80ms'} as React.CSSProperties}>Apply Now <ArrowRight size={18} /></Link>
          </div>
          <div className="hero-trust fade-up" style={{transitionDelay:'320ms'}}><span><ShieldCheck size={18} /> Exam-focused learning</span><span><Users size={18} /> Tamil + English support</span></div>
        </div>
        <figure className="campus-backdrop fade-up" style={{transitionDelay:'400ms'}}>
          <Image
            src="/images/paart-training-hall-front.png"
            alt="Front-view design of PAART Academy’s planned new training hall"
            fill
            sizes="(max-width: 1024px) 100vw, 1200px"
            priority
            quality={85}
          />
          <figcaption>
            <Building2 size={24} aria-hidden="true" />
            <span><strong>New Training Hall</strong><small>Planned expansion · Front view</small></span>
          </figcaption>
        </figure>
      </section>

      <TrustAchievements />

      <section className="section-wrap" id="about">
        <div className="section-title"><span className="eyebrow fade-up">About PAART Academy</span><h2><AnimatedText text="Guidance that builds confident aspirants." /></h2><p className="fade-up">{trustProfile.description}</p></div>
        <p className="trust-full-name fade-up">{trustProfile.name}</p><Link className="text-link fade-up" href="/about">Discover our trust <ArrowRight size={16} /></Link><div className="feature-grid">{['Structured syllabus', 'Daily current affairs', 'Regular mock tests', 'Personal mentoring'].map((item, i) => <article key={item} data-rev style={{ '--d': `${i * 70}ms` } as React.CSSProperties}><CheckCircle2 size={22} /><h3>{item}</h3><p>Professional support designed for repeatable progress and clear exam readiness.</p></article>)}</div>
      </section>

      <TrustPurpose />
      <TrustActivities />

      <section className="section-wrap soft-band" id="why-choose-us">
        <div className="section-title"><span className="eyebrow fade-up">Why choose us</span><h2><AnimatedText text="Designed for clarity, discipline and confidence." /></h2></div>
        <div className="feature-grid">{['Expert academic planning', 'Mock-test based improvement', 'Updated resources', 'Student-first support'].map((item, i) => <article key={item} data-rev style={{ '--d': `${i * 70}ms` } as React.CSSProperties}><Award size={22} /><h3>{item}</h3><p>Each learning touchpoint is built around exam relevance, consistency and measurable preparation progress.</p></article>)}</div>
      </section>

      <section className="section-wrap" id="courses">
        <div className="section-title"><span className="eyebrow fade-up">Our courses</span><h2><AnimatedText text="Choose your exam. Build your preparation." /></h2><p className="fade-up">Our current programmes include TNPSC Groups, Police Department exams, NMMS coaching and typing training. Contact us for programme and batch details.</p></div>
        <div className="course-grid-pro">{courses.map((course, i) => <Link className="premium-card course-card-pro" href={`/courses/${course.slug}`} key={course.id} data-rev style={{ '--d': `${Math.min(i, 4) * 70}ms` } as React.CSSProperties}>{course.image && <Image src={course.image} alt={course.title} width={480} height={260} sizes="(max-width: 768px) 100vw, 360px" quality={80} />}<GraduationCap size={26} /><span>{course.category}</span><h3>{course.title}</h3><p>{course.shortDescription}</p><small>{course.duration}</small><b>View details <ArrowRight size={16} /></b></Link>)}</div>
      </section>

      <section className="section-wrap soft-band" id="materials">
        <div className="section-title"><span className="eyebrow fade-up">Learning materials</span><h2><AnimatedText text="Resources that make revision easier." /></h2><p className="fade-up">Study materials, notes, PDFs, current affairs, question papers, mock tests and syllabus files managed from the admin panel.</p></div>
        <div className="materials-grid-pro">{materials.slice(0, 8).map((material, i) => <a className="material-pro" href={material.externalUrl || material.fileUrl} key={material.id} target="_blank" rel="noreferrer" data-rev style={{ '--d': `${Math.min(i, 5) * 70}ms` } as React.CSSProperties}><Download size={22} /><span>{material.category}</span><h3>{material.title}</h3><p>{material.description}</p><b>View / Download <ArrowRight size={15} /></b></a>)}</div>
      </section>

      <TrustCommunity />

      <GalleryCardSwap items={showcaseGallery} />

      <section className="section-wrap soft-band" id="gallery">
        <div className="section-title"><span className="eyebrow fade-up">Gallery</span><h2><AnimatedText text="Learning moments, captured beautifully." /></h2></div>
        <div className="masonry-grid home-gallery-grid">{gallery.map((item, i) => <figure key={item.id} data-rev-scale style={{ '--d': `${i * 60}ms` } as React.CSSProperties}><Image src={item.image} alt={item.description || item.title} width={620} height={420} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px" quality={80} /><figcaption>{item.title}</figcaption></figure>)}</div>
        <Link className="premium-button section-action fade-up" href="/gallery">Open full gallery <ArrowRight size={16} /></Link>
      </section>

      <section className="section-wrap" id="events">
        <div className="section-title"><span className="eyebrow fade-up">Events and community</span><h2><AnimatedText text="PAART in action." /></h2></div>
        <div className="blog-grid">{presentationEvents.map((event, i) => {
          const photo = presentationGallery.find((item) => item.title === event.title);
          return <article className="blog-card" key={event.slide} data-rev style={{ '--d': `${i * 70}ms` } as React.CSSProperties}>{photo && <Image src={photo.image} alt={event.title} width={620} height={420} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px" quality={80} />}<h3>{event.title}</h3><p>{event.description}</p></article>;
        })}</div>
        <Link className="premium-button section-action fade-up" href="/gallery">See all activity photos <ArrowRight size={16} /></Link>
      </section>
      <TrustFuturePlans />

      <section className="section-wrap soft-band" id="blogs">
        <div className="section-title"><span className="eyebrow fade-up">Blogs</span><h2><AnimatedText text="Exam preparation insights from PAART." /></h2></div>
        <div className="blog-grid">{blogs.map((blog, i) => <Link className="blog-card" href={`/blogs/${blog.slug}`} key={blog.id} data-rev style={{ '--d': `${i * 70}ms` } as React.CSSProperties}><Image src={blog.featuredImage} alt={blog.title} width={620} height={390} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px" quality={80} /><span>{blog.category} - {blog.publishedDate}</span><h3>{blog.title}</h3><p>{blog.shortDescription}</p></Link>)}</div>
      </section>

      <section className="section-wrap admission-home" id="admission">
        <div className="section-title"><span className="eyebrow fade-up">Admission</span><h2><AnimatedText text="Ready to begin? Apply online." /></h2><p className="fade-up">Submit the detailed admission form, upload documents and receive your application ID instantly.</p></div>
        <Link className="premium-button fade-up" href="/admissions">Open Admission Form <ArrowRight size={18} /></Link>
      </section>

      <section className="section-wrap enquiry-band" id="contact">
        <div className="section-title contact-details">
          <span className="eyebrow fade-up">Get in touch</span>
          <h2><AnimatedText text="Let us plan your next right step." /></h2>
          <p className="fade-up">Send an enquiry and continue directly on WhatsApp with a pre-filled message.</p>
          {trustProfile.phones.map((phone, i) => <a key={phone} href={`tel:${phone.replace(/\s/g, '')}`} className="fade-up" style={{ transitionDelay: `${i * 40}ms` }}><Phone size={18} /> {phone}</a>)}
          <a href={`mailto:${data.settings.email}`} className="fade-up" style={{ transitionDelay: '80ms' }}><Headphones size={18} /> {data.settings.email}</a>
          <span className="fade-up" style={{ transitionDelay: '120ms' }}><MapPin size={18} /> {trustProfile.address}</span>
          <span className="fade-up" style={{ transitionDelay: '160ms' }}><MapPin size={18} /> {trustProfile.additionalAddress}</span>
        </div>
        <div className="contact-grid fade-up" style={{ transitionDelay: '200ms' }}>
          <EnquiryForm courses={courses} whatsapp={data.settings.whatsapp} />
          <iframe className="map-frame" src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="PAART Academy location" />
        </div>
      </section>
    </main>
  );
}
