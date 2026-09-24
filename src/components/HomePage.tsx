'use client';

import Image from 'next/image';
import type { FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight, BookOpen, CalendarDays, Check, ChevronDown, Clock3, FileText,
  GraduationCap, Headphones, Menu, MessageCircle, MoveDown, NotebookTabs,
  Phone, Search, ShieldCheck, Sparkles, Target, Users, X,
} from 'lucide-react';
import { courses, courseCategories, megaMenuGroups, Course, CourseCategory } from '@/data/courses';
import { currentAffairs, currentAffairsCategories, features, gallery, materials, testSeries, heroSlides } from '@/data/content';
import { contact } from '@/config/contact';

const logo = '/images/paart_logo.png';

function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CourseCategory | 'ALL'>('ALL');
  const [slideIndex, setSlideIndex] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [formSent, setFormSent] = useState(false);
  const [currentAffairsSearch, setCurrentAffairsSearch] = useState('');

  useEffect(() => {
    const timer = window.setInterval(() => setSlideIndex((index) => (index + 1) % heroSlides.length), 5000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const pathSlug = window.location.pathname.split('/').filter(Boolean).pop();
    if (pathSlug && pathSlug !== 'courses') setSelectedCourse(courses.find((course) => course.slug === pathSlug) ?? null);
  }, []);

  const visibleCourses = useMemo(
    () => courses.filter((course) => course.enabled && (activeCategory === 'ALL' || course.category === activeCategory)),
    [activeCategory],
  );

  const filteredAffairs = useMemo(
    () => currentAffairs.filter((item) => `${item.headline} ${item.category}`.toLowerCase().includes(currentAffairsSearch.toLowerCase())),
    [currentAffairsSearch],
  );

  const openCourse = (course: Course) => {
    setSelectedCourse(course);
    window.history.pushState({}, '', `/courses/${course.slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitEnquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormSent(true);
  };

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    setMegaOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="site-shell">
      <div className="ambient ambient-red" />
      <div className="ambient ambient-blue" />
      <header className="navbar">
        <div className="nav-inner">
          <a className="brand" href="#home" onClick={() => setSelectedCourse(null)} aria-label="PAART Academy home">
            <Image src={logo} alt="PAART Academy logo" width={64} height={74} priority />
            <span>PAART <small>ACADEMY</small></span>
          </a>
          <nav className={menuOpen ? 'nav-links nav-links-open' : 'nav-links'} aria-label="Primary navigation">
            <button onClick={() => scrollTo('home')}>Home</button>
            <button onClick={() => scrollTo('about')}>About Us</button>
            <div className="nav-dropdown">
              <button className={megaOpen ? 'nav-active' : ''} onClick={() => setMegaOpen(!megaOpen)} aria-expanded={megaOpen}>Courses <ChevronDown size={15} /></button>
              {megaOpen && <div className="mega-menu">{megaMenuGroups.map((group) => <div key={group.title}><strong>{group.title}</strong>{group.items.map((item) => <button key={item} onClick={() => scrollTo('courses')}>{item}<ArrowRight size={13} /></button>)}</div>)}</div>}
            </div>
            <button onClick={() => scrollTo('test-series')}>Test Series</button>
            <button onClick={() => scrollTo('current-affairs')}>Current Affairs</button>
            <button onClick={() => scrollTo('materials')}>Study Materials</button>
            <button onClick={() => scrollTo('results')}>Results</button>
            <button onClick={() => scrollTo('activities')}>Events</button>
            <button onClick={() => scrollTo('contact')}>Contact</button>
          </nav>
          <button className="nav-cta" onClick={() => scrollTo('enquiry')}>Student Enquiry <ArrowRight size={16} /></button>
          <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </header>

      {selectedCourse ? <CourseDetail course={selectedCourse} onBack={() => { setSelectedCourse(null); window.history.pushState({}, '', '/'); }} onEnquire={() => scrollTo('enquiry')} /> : <>
        <main>
          <section className="hero section-pad" id="home">
            <div className="hero-copy reveal-up">
              <div className="eyebrow"><span className="eyebrow-dot" /> Admissions open 2026</div>
              <h1>Your Government Job Journey <em>Starts Here.</em></h1>
              <p className="hero-lead">Structured preparation for TNPSC and other competitive examinations with expert guidance, updated study materials, current affairs and regular performance practice.</p>
              <div className="hero-actions"><button className="button button-primary" onClick={() => scrollTo('courses')}>Explore Courses <ArrowRight size={18} /></button><button className="button button-ghost" onClick={() => scrollTo('enquiry')}>Student Enquiry <MessageCircle size={18} /></button></div>
              <div className="hero-trust"><div><ShieldCheck size={17} /> Exam-focused learning</div><div><Users size={17} /> Tamil + English support</div></div>
            </div>
            <div className="hero-visual reveal-scale" onMouseEnter={(event) => event.currentTarget.classList.add('paused')} onMouseLeave={(event) => event.currentTarget.classList.remove('paused')}>
              <div className="hero-image-frame"><div className="slider-track" style={{ transform: `translateY(-${slideIndex * 100}%)` }}>{heroSlides.map((slide, index) => <Image key={slide.image} src={slide.image} alt={slide.alt} width={940} height={650} priority={index === 0} sizes="(max-width: 1024px) 100vw, 600px" quality={85} />)}</div><div className="image-overlay" /><div className="slider-controls">{heroSlides.map((slide, index) => <button key={slide.image} className={index === slideIndex ? 'active' : ''} onClick={() => setSlideIndex(index)} aria-label={`Show slide ${index + 1}`} />)}</div></div>
              <div className="float-card float-one"><span className="float-icon red-icon"><CalendarDays size={20} /></span><div><b>Daily</b><small>Current Affairs</small></div></div>
              <div className="float-card float-two"><span className="float-icon blue-icon"><Target size={20} /></span><div><b>Regular</b><small>Mock Tests</small></div></div>
              <div className="float-card float-three"><span className="float-icon green-icon"><BookOpen size={20} /></span><div><b>Tamil + English</b><small>Learning support</small></div></div>
              <div className="vertical-label"><MoveDown size={14} /> Scroll to explore</div>
            </div>
          </section>

          <section className="marquee-strip"><div><span>TNPSC</span><i /> <span>Competitive Exams</span><i /> <span>Current Affairs</span><i /> <span>Test Series</span><i /> <span>Student Guidance</span><i /> <span>TNPSC</span><i /></div></section>

          <section className="section-pad about-section" id="about"><div className="section-intro"><div className="eyebrow">About PAART Academy</div><h2>Guidance that builds <em>confident aspirants.</em></h2></div><div className="about-grid"><div className="about-message"><p>PAART Academy is a focused learning space for students preparing for TNPSC and other competitive examinations. We bring together a clear study rhythm, relevant content and the support needed to keep moving forward.</p><p>From current affairs and updated study materials to regular tests, doubt clearing and mentoring, every part of the preparation journey is designed to make progress feel purposeful.</p><button className="text-link" onClick={() => scrollTo('enquiry')}>Talk to our team <ArrowRight size={17} /></button></div><div className="about-pillars"><div><span>01</span><b>Learn with structure</b><small>Follow a clear plan built around your exam.</small></div><div><span>02</span><b>Practice with purpose</b><small>Turn concepts into confidence through regular tests.</small></div><div><span>03</span><b>Improve continuously</b><small>Use review and mentoring to keep progressing.</small></div></div></div></section>

          <section className="section-pad light-section" id="courses"><div className="section-heading"><div><div className="eyebrow">Our courses</div><h2>Choose your exam.<br /><em>Build your preparation.</em></h2></div><p>Explore focused pathways for the examinations you are preparing to take. Course information stays editable as new programs are introduced.</p></div><div className="filter-row" role="tablist" aria-label="Course categories"><button className={activeCategory === 'ALL' ? 'filter-active' : ''} onClick={() => setActiveCategory('ALL')}>All courses</button>{courseCategories.map((category) => <button key={category} className={activeCategory === category ? 'filter-active' : ''} onClick={() => setActiveCategory(category)}>{category}</button>)}</div><div className="course-grid">{visibleCourses.map((course) => <article className="course-card" key={course.id}><div className="course-card-top"><span className="course-badge">{course.category}</span><span className="course-number">{course.id === 'group-1' ? '01' : course.id === 'group-2' ? '02' : '•'}</span></div><div className="course-icon"><GraduationCap size={25} /></div><h3>{course.title}</h3><p>{course.shortDescription}</p><div className="course-stages">{course.examStages.map((stage) => <span key={stage}>{stage}</span>)}</div><div className="course-bottom"><button className="text-link" onClick={() => openCourse(course)}>View details <ArrowRight size={16} /></button><button className="icon-button" onClick={() => scrollTo('enquiry')} aria-label={`Enquire about ${course.title}`}><MessageCircle size={17} /></button></div></article>)}</div></section>

          <section className="section-pad split-section" id="current-affairs"><div className="split-copy"><div className="eyebrow">Daily current affairs</div><h2>Stay updated.<br /><em>Stay exam ready.</em></h2><p>Make current affairs a steady part of your preparation with concise, exam-oriented reading in Tamil and English.</p><button className="button button-dark" onClick={() => scrollTo('enquiry')}>Get updates <ArrowRight size={17} /></button></div><div className="affairs-panel"><div className="panel-header"><b>Latest learning desk</b><div className="search-field"><Search size={16} /><input value={currentAffairsSearch} onChange={(event) => setCurrentAffairsSearch(event.target.value)} placeholder="Search topics" aria-label="Search current affairs" /></div></div><div className="category-scroller">{currentAffairsCategories.slice(0, 5).map((category) => <span key={category}>{category}</span>)}</div>{filteredAffairs.map((item) => <article className="affair-row" key={item.headline}><div className="affair-date"><b>{item.date}</b><small>{item.language}</small></div><div><span>{item.category}</span><h3>{item.headline}</h3><p>{item.summary}</p></div><ArrowRight size={17} /></article>)}</div></section>

          <section className="section-pad dark-section" id="test-series"><div className="section-heading light-heading"><div><div className="eyebrow">Test series</div><h2>Practice. Analyse.<br /><em>Improve.</em></h2></div><p>Test architecture ready for daily practice, subject tests, previous year questions and full-length exam simulations.</p></div><div className="test-grid">{testSeries.map((test) => <article className="test-card" key={test.title}><div className="test-card-icon"><NotebookTabs size={20} /></div><span>{test.type}</span><h3>{test.title}</h3><div className="test-meta"><span><FileText size={14} /> {test.questions}</span><span><Clock3 size={14} /> {test.duration}</span></div><button className="test-action" onClick={() => scrollTo('enquiry')}>Register interest <ArrowRight size={16} /></button></article>)}</div></section>

          <section className="section-pad materials-section" id="materials"><div className="section-heading"><div><div className="eyebrow">Study materials</div><h2>Everything you need<br /><em>to revise well.</em></h2></div><p>Organised subject areas for your preparation. Add verified PAART Academy PDF files in public/study-materials and these links will use the public URLs directly.</p></div><div className="materials-grid">{materials.map((material, index) => <article key={material.title} className="material-card"><span>{String(index + 1).padStart(2, '0')}</span><BookOpen size={19} /><h3>{material.title}</h3><div className="material-actions"><a href={material.href} target="_blank" rel="noreferrer">View Material <ArrowRight size={15} /></a><a href={material.href} download>Download PDF <ArrowRight size={15} /></a></div></article>)}</div></section>

          <section className="section-pad process-section"><div className="section-intro centered"><div className="eyebrow">The PAART method</div><h2>A preparation rhythm<br /><em>that moves with you.</em></h2></div><div className="timeline">{['Learn', 'Understand', 'Practice', 'Take Tests', 'Analyse', 'Improve', 'Revise', 'Final Preparation'].map((step, index) => <div className="timeline-step" key={step}><span>{String(index + 1).padStart(2, '0')}</span><div><b>{step}</b><small>{index === 0 ? 'Build the base' : index === 7 ? 'Walk in ready' : 'Keep moving forward'}</small></div></div>)}</div></section>

          <section className="section-pad feature-section"><div className="feature-header"><div className="eyebrow">Why choose PAART</div><h2>Serious preparation.<br /><em>Thoughtful support.</em></h2></div><div className="feature-grid">{features.map((feature, index) => <div className="feature-item" key={feature}><span>{String(index + 1).padStart(2, '0')}</span><div><Check size={16} /><b>{feature}</b></div></div>)}</div></section>

          <section className="section-pad results-section" id="results"><div className="results-card"><div><div className="eyebrow">Our achievers</div><h2>Your result story<br /><em>starts with preparation.</em></h2><p>Verified student achievements and result highlights will be shared here as PAART Academy records are updated.</p></div><div className="result-placeholder"><Sparkles size={29} /><b>Results showcase</b><span>Student stories coming soon</span></div></div></section>

          <section className="section-pad activities-section" id="activities"><div className="section-heading"><div><div className="eyebrow">PAART Academy activities</div><h2>Learning that happens<br /><em>beyond the classroom.</em></h2></div><p>Discover the energy of focused study, collaborative practice and student support.</p></div><div className="gallery-grid">{gallery.map((item, index) => <figure className={`gallery-item gallery-${index + 1}`} key={item.title}><Image src={item.image} alt={item.alt} width={940} height={650} loading="lazy" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px" quality={80} /><figcaption><span>{item.title}</span><ArrowUpRightIcon /></figcaption></figure>)}</div></section>

          <section className="section-pad enquiry-section" id="enquiry"><div className="enquiry-intro"><div className="eyebrow">Student enquiry</div><h2>Let’s plan your<br /><em>next right step.</em></h2><p>Share a few details and the PAART Academy team can help you find the right preparation path.</p><div className="enquiry-contact"><a href={`tel:${contact.phone}`}><Phone size={17} /> {contact.phone}</a><a href={`mailto:${contact.email}`}><Headphones size={17} /> {contact.email}</a></div></div><form className="enquiry-form" onSubmit={submitEnquiry}>{formSent ? <div className="form-success"><div><Check size={26} /></div><h3>Thank you for reaching out.</h3><p>Your enquiry has been noted. The PAART Academy team will connect with you using the details provided.</p><button type="button" className="button button-primary" onClick={() => setFormSent(false)}>Send another enquiry</button></div> : <><div className="form-row"><label>Student name<input required name="name" placeholder="Your full name" /></label><label>Phone number<input required name="phone" type="tel" placeholder="10-digit number" /></label></div><div className="form-row"><label>Email address<input name="email" type="email" placeholder="you@example.com" /></label><label>District<input name="district" placeholder="Your district" /></label></div><div className="form-row"><label>Interested exam<select name="exam" defaultValue=""><option value="" disabled>Select an exam</option>{courses.filter((course) => course.enabled).map((course) => <option value={course.title} key={course.id}>{course.title}</option>)}</select></label><label>Preferred language<select name="language" defaultValue="Both"><option>Tamil</option><option>English</option><option>Both</option></select></label></div><label>Message<textarea name="message" placeholder="Tell us how we can guide you" rows={4} /></label><button className="button button-primary form-submit" type="submit">Send enquiry <ArrowRight size={18} /></button></>}</form></section>
        </main>
      </>}

      <footer className="footer" id="contact"><div className="footer-main"><div className="footer-brand"><Image src={logo} alt="PAART Academy logo" width={55} height={63} /><h3>PAART <span>ACADEMY</span></h3><p>Structured preparation for competitive examinations, with the guidance to keep progressing.</p><a className="whatsapp-link" href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Chat with PAART Academy</a></div><div className="footer-links"><div><b>Explore</b><button onClick={() => scrollTo('about')}>About us</button><button onClick={() => scrollTo('courses')}>Courses</button><button onClick={() => scrollTo('test-series')}>Test series</button><button onClick={() => scrollTo('current-affairs')}>Current affairs</button></div><div><b>Support</b><button onClick={() => scrollTo('materials')}>Study materials</button><button onClick={() => scrollTo('results')}>Results</button><button onClick={() => scrollTo('activities')}>Activities</button><button onClick={() => scrollTo('enquiry')}>Student enquiry</button></div><div><b>Contact</b><span>{contact.address}</span><span>{contact.additionalAddress}</span><span>{contact.hours}</span><a href={`mailto:${contact.email}`}>{contact.email}</a><a href={`tel:${contact.phone}`}>{contact.phone}</a></div></div></div><div className="footer-bottom"><span>© 2026 PAART Academy. All rights reserved.</span><span>Privacy policy &nbsp; · &nbsp; Terms</span><span>TNPSC · Competitive Exams · Student Guidance</span></div></footer>
      <a className="whatsapp-float" href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noreferrer" aria-label="Chat with PAART Academy"><MessageCircle size={23} /><span>Chat with PAART Academy</span></a>
    </div>
  );
}

function CourseDetail({ course, onBack, onEnquire }: { course: Course; onBack: () => void; onEnquire: () => void }) {
  return <main className="course-detail"><div className="section-pad detail-hero"><button className="back-link" onClick={onBack}>← All courses</button><div className="eyebrow">{course.category}</div><h1>{course.title}</h1><p>{course.shortDescription}</p><button className="button button-primary" onClick={onEnquire}>Student enquiry <ArrowRight size={18} /></button></div><div className="section-pad detail-grid"><div><div className="eyebrow">Course overview</div><h2>A clear path from <em>study to readiness.</em></h2><p>This editable course page is designed to hold verified PAART Academy information as each program is finalised. Students can use it as a starting point for course guidance and enquiry.</p><div className="detail-block"><h3>Preparation highlights</h3>{course.highlights.map((highlight) => <div key={highlight}><Check size={16} /> {highlight}</div>)}</div></div><aside className="detail-aside"><span>Exam stages</span>{course.examStages.map((stage) => <b key={stage}>{stage}<ArrowRight size={15} /></b>)}<small>Batch information, syllabus and FAQs will be published here when verified.</small></aside></div></main>;
}

function ArrowUpRightIcon() { return <ArrowRight size={18} />; }

export default HomePage;

