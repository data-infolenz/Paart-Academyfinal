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
import { ScrollJourney } from './ScrollJourney';
import { GalleryCardSwap } from './GalleryCardSwap';
import { EnquiryForm } from '@/components/forms/EnquiryForm';

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
      <ScrollJourney />
      <section className="premium-hero campus-hero" id="home">
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
        <figure className="campus-backdrop">
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
        <div className="section-title"><span className="eyebrow">About PAART Academy</span><h2>Guidance that builds <em>confident aspirants.</em></h2><p>{trustProfile.description}</p></div>
        <p className="trust-full-name">{trustProfile.name}</p><Link className="text-link" href="/about">Discover our trust <ArrowRight size={16} /></Link><div className="feature-grid">{['Structured syllabus', 'Daily current affairs', 'Regular mock tests', 'Personal mentoring'].map((item) => <article key={item}><CheckCircle2 size={22} /><h3>{item}</h3><p>Professional support designed for repeatable progress and clear exam readiness.</p></article>)}</div>
      </section>

      <TrustPurpose />
      <TrustActivities />

      <section className="section-wrap soft-band" id="why-choose-us">
        <div className="section-title"><span className="eyebrow">Why choose us</span><h2>Designed for clarity, <em>discipline and confidence.</em></h2></div>
        <div className="feature-grid">{['Expert academic planning', 'Mock-test based improvement', 'Updated resources', 'Student-first support'].map((item) => <article key={item}><Award size={22} /><h3>{item}</h3><p>Each learning touchpoint is built around exam relevance, consistency and measurable preparation progress.</p></article>)}</div>
      </section>

      <section className="section-wrap" id="courses">
        <div className="section-title"><span className="eyebrow">Our courses</span><h2>Choose your exam. <em>Build your preparation.</em></h2><p>Our current programmes include TNPSC Groups, Police Department exams, NMMS coaching and typing training. Contact us for programme and batch details.</p></div>
        <div className="course-grid-pro">{courses.map((course) => <Link className="premium-card course-card-pro" href={`/courses/${course.slug}`} key={course.id}>{course.image && <Image src={course.image} alt={course.title} width={480} height={260} sizes="(max-width: 768px) 100vw, 360px" quality={80} />}<GraduationCap size={26} /><span>{course.category}</span><h3>{course.title}</h3><p>{course.shortDescription}</p><small>{course.duration}</small><b>View details <ArrowRight size={16} /></b></Link>)}</div>
      </section>

      <section className="section-wrap soft-band" id="materials">
        <div className="section-title"><span className="eyebrow">Learning materials</span><h2>Resources that make <em>revision easier.</em></h2><p>Study materials, notes, PDFs, current affairs, question papers, mock tests and syllabus files managed from the admin panel.</p></div>
        <div className="materials-grid-pro">{materials.slice(0, 8).map((material) => <a className="material-pro" href={material.externalUrl || material.fileUrl} key={material.id} target="_blank" rel="noreferrer"><Download size={22} /><span>{material.category}</span><h3>{material.title}</h3><p>{material.description}</p><b>View / Download <ArrowRight size={15} /></b></a>)}</div>
      </section>

      <TrustCommunity />

      <GalleryCardSwap items={showcaseGallery} />

      <section className="section-wrap soft-band" id="gallery">
        <div className="section-title"><span className="eyebrow">Gallery</span><h2>Learning moments, <em>captured beautifully.</em></h2></div>
        <div className="masonry-grid home-gallery-grid">{gallery.map((item) => <figure key={item.id}><Image src={item.image} alt={item.description || item.title} width={620} height={420} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px" quality={80} /><figcaption>{item.title}</figcaption></figure>)}</div>
        <Link className="premium-button section-action" href="/gallery">Open full gallery <ArrowRight size={16} /></Link>
      </section>

      <section className="section-wrap" id="events">
        <div className="section-title"><span className="eyebrow">Events and community</span><h2>PAART <em>in action.</em></h2></div>
        <div className="blog-grid">{presentationEvents.map((event) => {
          const photo = presentationGallery.find((item) => item.title === event.title);
          return <article className="blog-card" key={event.slide}>{photo && <Image src={photo.image} alt={event.title} width={620} height={420} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px" quality={80} />}<h3>{event.title}</h3><p>{event.description}</p></article>;
        })}</div>
        <Link className="premium-button section-action" href="/gallery">See all activity photos <ArrowRight size={16} /></Link>
      </section>
      <TrustFuturePlans />

      <section className="section-wrap soft-band" id="blogs">
        <div className="section-title"><span className="eyebrow">Blogs</span><h2>Exam preparation insights <em>from PAART.</em></h2></div>
        <div className="blog-grid">{blogs.map((blog) => <Link className="blog-card" href={`/blogs/${blog.slug}`} key={blog.id}><Image src={blog.featuredImage} alt={blog.title} width={620} height={390} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px" quality={80} /><span>{blog.category} - {blog.publishedDate}</span><h3>{blog.title}</h3><p>{blog.shortDescription}</p></Link>)}</div>
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
          {trustProfile.phones.map((phone) => <a key={phone} href={`tel:${phone.replace(/\s/g, '')}`}><Phone size={18} /> {phone}</a>)}
          <a href={`mailto:${data.settings.email}`}><Headphones size={18} /> {data.settings.email}</a>
          <span><MapPin size={18} /> {trustProfile.address}</span>
          <span><MapPin size={18} /> {trustProfile.additionalAddress}</span>
        </div>
        <div className="contact-grid">
          <EnquiryForm courses={courses} whatsapp={data.settings.whatsapp} />
          <iframe className="map-frame" src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="PAART Academy location" />
        </div>
      </section>
    </main>
  );
}
