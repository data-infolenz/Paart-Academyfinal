import Image from 'next/image';
import { notFound } from 'next/navigation';
import { readCms } from '@/server/db';
import { PublicFooter, PublicNavbar } from '@/components/public/PublicChrome';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { blogs } = await readCms();
  const blog = blogs.find((item) => item.slug === slug);
  return { title: blog?.seoTitle ?? 'Blog | PAART Academy', description: blog?.metaDescription, keywords: blog?.keywords };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { blogs } = await readCms();
  const blog = blogs.find((item) => item.slug === slug && item.published);
  if (!blog) notFound();
  return (
    <>
      <PublicNavbar />
      <main className="page-shell">
        <article className="article-page">
          <span className="eyebrow">{blog.category} · {blog.publishedDate}</span>
          <h1>{blog.title}</h1>
          <p>{blog.shortDescription}</p>
          <Image src={blog.featuredImage} alt={blog.title} width={1180} height={620} sizes="(max-width: 1024px) 100vw, 1180px" priority quality={85} />
          <div>{blog.content.split('\n').map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        </article>
      </main>
      <PublicFooter />
    </>
  );
}
