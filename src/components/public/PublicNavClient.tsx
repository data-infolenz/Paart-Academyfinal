'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Menu, MessageCircle, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const navItems = [
  ['Home', '/'],
  ['About', '/#about'],
  ['Courses', '/#courses'],
  ['Materials', '/#materials'],
  ['Gallery', '/#gallery'],
  ['Blogs', '/#blogs'],
  ['Admission', '/#admission'],
  ['Contact', '/#contact'],
  ['Admin Panel', '/admin'],
];

const sectionIds = navItems
  .map(([, href]) => href.startsWith('/#') ? href.slice(2) : href === '/' ? 'home' : '')
  .filter(Boolean);

export function PublicNavClient({ whatsapp }: { whatsapp: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (pathname !== '/') return;

    const syncFromHash = () => {
      const id = window.location.hash.replace('#', '');
      if (sectionIds.includes(id)) setActiveSection(id);
    };

    syncFromHash();

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0.1, 0.35, 0.6] }
    );

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    window.addEventListener('hashchange', syncFromHash);
    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', syncFromHash);
    };
  }, [pathname]);

  return (
    <header className={`premium-nav ${scrolled ? 'nav-scrolled' : ''}`}>
      <Link className="premium-brand nav-logo-reveal" href="/" onClick={() => setOpen(false)}>
        <Image src="/images/paart_logo.png" alt="PAART Academy logo" width={62} height={70} priority />
        <span>PAART <small>ACADEMY</small></span>
      </Link>
      <button className="nav-menu-button" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'}>{open ? <X size={23} /> : <Menu size={23} />}</button>
      <nav className={open ? 'premium-links open' : 'premium-links'}>
        {navItems.map(([label, href], i) => {
          const sectionId = href.startsWith('/#') ? href.slice(2) : href === '/' ? 'home' : '';
          const active = sectionId
            ? pathname === '/' && activeSection === sectionId
            : pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));

          return (
            <Link
              className={`${active ? 'active' : ''} nav-item-reveal`}
              style={{ '--nav-d': `${i * 50}ms` } as React.CSSProperties}
              key={href}
              href={href}
              onClick={() => {
                if (sectionId) setActiveSection(sectionId);
                setOpen(false);
              }}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="premium-nav-actions">
        <Link className="icon-whatsapp" href={`https://wa.me/${whatsapp}`} target="_blank" aria-label="WhatsApp PAART Academy">
          <MessageCircle size={19} />
        </Link>
        <Link className="premium-cta" href="/admissions">Apply Now <ArrowRight size={17} /></Link>
      </div>
    </header>
  );
}
