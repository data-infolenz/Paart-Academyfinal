import Image from 'next/image';
import { trustProfile } from '@/data/trust';
import Link from 'next/link';
import { readCms } from '@/server/db';
import { PublicNavClient } from './PublicNavClient';

const navItems = [
  ['Home', '/'],
  ['About', '/about'],
  ['Activities', '/#activities'],
  ['Achievements', '/#achievements'],
  ['Future plans', '/#future-plans'],
  ['Courses', '/#courses'],
  ['Materials', '/#materials'],
  ['Gallery', '/#gallery'],
  ['Blogs', '/#blogs'],
  ['Admission', '/#admission'],
  ['Contact', '/#contact'],
];

export async function PublicNavbar() {
  const { settings } = await readCms();
  return <PublicNavClient whatsapp={settings.whatsapp} />;
}

export async function PublicFooter() {
  const { settings } = await readCms();
  return (
    <footer className="premium-footer">
      <div className="footer-brand-panel">
        <div className="footer-logo-row">
          <Image src="/images/paart_logo.png" alt="PAART Academy logo" width={64} height={72} />
          <div>
            <h2>PAART Academy</h2>
            <span>TNPSC & Competitive Exam Preparation</span>
          </div>
        </div>
        <p>{trustProfile.name}</p><p>{trustProfile.description}</p>
        <Link className="footer-admin-link" href="/admin">Admin Panel</Link>
      </div>
      <div className="footer-column">
        <b>Explore</b>
        {navItems.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
      </div>
      <div className="footer-column">
        <b>Courses</b>
        <Link href="/courses/tnpsc-group-1">TNPSC Group I</Link>
        <Link href="/courses/tnpsc-group-2">TNPSC Group II</Link>
        <Link href="/courses/tnpsc-group-4">TNPSC Group IV</Link>
        <Link href="/courses/vao">VAO</Link>
      </div>
      <div className="footer-column">
        <b>Resources</b>
        <Link href="/#materials">Learning Materials</Link>
        <Link href="/#gallery">Gallery</Link>
        <Link href="/#blogs">Blogs</Link>
        <Link href="/admissions">Apply Online</Link>
      </div>
      <div className="footer-column footer-contact">
        <b>Contact</b>
        <span>{trustProfile.address}</span>
        <span>{trustProfile.additionalAddress}</span>
        {trustProfile.phones.map((phone) => <a key={phone} href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>)}
        <a href={`mailto:${settings.email}`}>{settings.email}</a>
        <span>{settings.hours}</span>
      </div>
      <div className="footer-bottom-bar">
        <span>Copyright 2026 Datainfolenz. All rights reserved.</span>
        <span>Privacy Policy · Terms · Student Support</span>
      </div>
    </footer>
  );
}
