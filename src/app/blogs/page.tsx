import Image from 'next/image';
import Link from 'next/link';
import { readCms } from '@/server/db';
import { PublicFooter, PublicNavbar } from '@/components/public/PublicChrome';

export const metadata = { title: 'Blogs | PAART Academy' };
export const dynamic = 'force-dynamic';

export default async function BlogsPage() {
  const { blogs } = await readCms();
  return (
    <>
      <PublicNavbar />
      <main className="page-shell">
        <section className="page-hero"><span className="eyebrow">Blogs</span><h1>Preparation insights <em>for aspirants.</em></h1><p>SEO-friendly articles managed from the admin panel.</p></section>
        <section className="section-wrap"><div className="blog-grid">{blogs.filter((blog) => blog.published).map((blog) => <Link className="blog-card" href={`/blogs/${blog.slug}`} key={blog.id}><Image src={blog.featuredImage} alt={blog.title} width={620} height={390} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px" quality={80} /><span>{blog.category} · {blog.publishedDate}</span><h3>{blog.title}</h3><p>{blog.shortDescription}</p></Link>)}</div></section>
      </main>
      <PublicFooter />
    </>
  );
}
