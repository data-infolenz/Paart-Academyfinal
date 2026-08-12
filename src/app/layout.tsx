import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://paartacademy.in'),
  title: 'PAART Academy | TNPSC & Competitive Exam Preparation',
  description:
    'PAART Academy provides preparation and guidance for TNPSC and other competitive examinations with current affairs, study materials, test series and student support.',
  keywords: ['PAART Academy', 'TNPSC coaching', 'competitive exam preparation', 'Puliyangudi academy'],
  openGraph: {
    title: 'PAART Academy | TNPSC & Competitive Exam Preparation',
    description: 'Premium coaching, admissions, test series, current affairs and student support for TNPSC and competitive exam aspirants.',
    images: ['/images/paart_logo.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
