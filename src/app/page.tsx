import { HomeSectionsMaster } from '@/components/public/HomeSectionsMaster';
import { PublicFooter, PublicNavbar } from '@/components/public/PublicChrome';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <>
      <PublicNavbar />
      <HomeSectionsMaster />
      <PublicFooter />
    </>
  );
}
