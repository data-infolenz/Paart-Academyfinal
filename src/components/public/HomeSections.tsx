import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, CheckCircle2, GraduationCap, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { readCms } from '@/server/db';
import { EnquiryForm } from '@/components/forms/EnquiryForm';

export async function HomeSections() {
  const data = await readCms();
  const courses = data.courses.filter((course) => course.enabled);
  const blogs = data.blogs.filter((blog) => blog.published).slice(0, 3);
  const gallery = [...data.gallery].sort((a, b) => a.order - b.order).slice(0, 4);

  return (
    <main>
      <section className="premium-hero">
        <div className="hero-copy">
          <span className="eyebrow">Admissions open 2026</span>
          <h1>Your Government Job Journey <em>Starts Here.</em></h1>
          <p>Structured TNPSC and competitive exam preparation with expert guidance, updated study materials, current affairs, test series and mentoring.</p>
          <div className="hero-actions">
            <Link className="premium-button" href="/admissions">Apply Now <ArrowRight size={18} /></Link>
            <Link className="glass-button" href="/courses">Explore Courses <BookOpen size={18} /></Link>
          </div>
          <div className="hero-trust"><span><ShieldCheck size={18} /> Exam-focused learning</span><span><Users size={18} /> Tamil + English support</span></div>
        </div>
        <div className="hero-media">
          <Image src="https://images.pexels.com/photos/7092542/pexels-photo-7092542.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Teacher guiding students in a classroom" width={940} height={650} priority />
          <div><Sparkles size={20} /> Premium learning environment</div>
        </div>
      </section>

      <section className="section-wrap">
        <div className="section-title"><span className="eyebrow">About PAART Academy</span><h2>Guidance that builds <em>confident aspirants.</em></h2><p>PAART Academy is a focused learning space for TNPSC and competitive exam students. Every class, material and test is designed to make preparation steady, readable and measurable.</p></div>
        <div className="feature-grid">{['Structured syllabus', 'Daily current affairs', 'Regular mock tests', 'Personal mentoring'].map((item) => <article key={item}><CheckCircle2 size={22} /><h3>{item}</h3><p>Professional support designed for repeatable progress and clear exam readiness.</p></article>)}</div>
      </section>

      <section className="section-wrap soft-band">
        <div className="section-title"><span className="eyebrow">Our courses</span><h2>Choose your exam. <em>Build your preparation.</em></h2></div>
        <div className="course-grid-pro">{courses.slice(0, 8).map((course) => <Link className="premium-card" href={`/courses/${course.slug}`} key={course.id}><GraduationCap size={26} /><span>{course.category}</span><h3>{course.title}</h3><p>{course.shortDescription}</p><b>View details <ArrowRight size={16} /></b></Link>)}</div>
      </section>

      <section className="section-wrap">
        <div className="section-title"><span className="eyebrow">Blogs</span><h2>Exam preparation insights <em>from PAART.</em></h2></div>
        <div className="blog-grid">{blogs.map((blog) => <Link className="blog-card" href={`/blogs/${blog.slug}`} key={blog.id}><Image src={blog.featuredImage} alt={blog.title} width={620} height={390} /><span>{blog.category} · {blog.publishedDate}</span><h3>{blog.title}</h3><p>{blog.shortDescription}</p></Link>)}</div>
      </section>

      <section className="section-wrap soft-band">
        <div className="section-title"><span className="eyebrow">Gallery</span><h2>Learning moments, <em>captured beautifully.</em></h2></div>
        <div className="masonry-grid">{gallery.map((item) => <figure key={item.id}><Image src={item.image} alt={item.description || item.title} width={620} height={420} /><figcaption>{item.title}</figcaption></figure>)}</div>
      </section>

      <section className="section-wrap enquiry-band">
        <div className="section-title"><span className="eyebrow">Student enquiry</span><h2>Let us plan your <em>next right step.</em></h2><p>Send an enquiry and continue directly on WhatsApp with a pre-filled message.</p></div>
        <EnquiryForm courses={courses} whatsapp={data.settings.whatsapp} />
      </section>
    </main>
  );
}
