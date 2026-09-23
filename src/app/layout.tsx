import type { Metadata } from 'next';
import { Merriweather } from 'next/font/google';
import './globals.css';
import './neumorphism.css';

const merriweather = Merriweather({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-merriweather',
});

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
    <html lang="en" className={merriweather.variable}>
      <body>{children}</body>
    </html>
  );
}
