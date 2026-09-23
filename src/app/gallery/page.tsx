import { presentationGallery } from '@/data/presentation-gallery';
import { readCms } from '@/server/db';
import { PublicFooter, PublicNavbar } from '@/components/public/PublicChrome';
import { GalleryExplorer } from '@/components/public/GalleryExplorer';

export const metadata = { title: 'Gallery | PAART Academy' };
export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  const { gallery } = await readCms();
  return (
    <>
      <PublicNavbar />
      <main className="page-shell">
        <section className="page-hero"><span className="eyebrow">Gallery</span><h1>Academy moments <em>and activities.</em></h1><p>Classroom, events, activities, celebrations, students and achievements.</p></section>
        <section className="section-wrap"><GalleryExplorer items={[...presentationGallery, ...gallery]} /></section>
      </main>
      <PublicFooter />
    </>
  );
}
