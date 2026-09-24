'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import type { GalleryItem } from '@/types/cms';

export function GalleryCardSwap({ items }: { items: GalleryItem[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || items.length === 0) return;
    const cards = Array.from(stage.querySelectorAll<HTMLElement>('.gallery-swap-card'));
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let order = cards.map((_, index) => index);
    let timer: ReturnType<typeof setTimeout> | undefined;
    let timeline: gsap.core.Timeline | undefined;
    let hovered = false;
    let focused = false;
    let visible = false;
    let disposed = false;
    const slot = (position: number) => ({ x: Math.min(position, 3) * 20, y: -Math.min(position, 3) * 24, z: -Math.min(position, 3) * 80, skewY: 4, opacity: position < 4 ? 1 : 0, zIndex: cards.length - position });
    const context = gsap.context(() => cards.forEach((card, index) => gsap.set(card, slot(index))), stage);
    const canPlay = () => !disposed && visible && !document.hidden && !hovered && !focused && !motion.matches;
    const clearTimer = () => { if (timer) clearTimeout(timer); timer = undefined; };
    const schedule = () => {
      clearTimer();
      if (canPlay() && cards.length > 1) timer = setTimeout(swap, 2600);
    };
    function swap() {
      if (disposed || cards.length < 2 || (timeline && timeline.progress() < 1)) return;
      clearTimer();
      const [front, ...rest] = order;
      const nextOrder = [...rest, front];
      const complete = () => {
        order = nextOrder;
        setActiveIndex(order[0]);
        schedule();
      };
      if (motion.matches) {
        nextOrder.forEach((index, position) => gsap.set(cards[index], slot(position)));
        complete();
        return;
      }
      timeline = gsap.timeline({ onComplete: complete });
      timeline.to(cards[front], { y: 150, rotation: -4, opacity: 0, duration: 0.3, ease: 'power2.in' });
      rest.forEach((index, position) => {
        timeline!.set(cards[index], { zIndex: cards.length - position }, 0.18);
        timeline!.to(cards[index], { ...slot(position), duration: 0.45, ease: 'power3.out' }, 0.18 + Math.min(position, 3) * 0.03);
      });
      timeline.set(cards[front], { ...slot(cards.length - 1), y: 100, rotation: 0, opacity: 0 }, 0.28);
      timeline.to(cards[front], { ...slot(cards.length - 1), duration: 0.4, ease: 'power3.out' }, 0.3);
    }
    const sync = () => {
      if (canPlay()) { timeline?.resume(); if (!timeline || timeline.progress() === 1) schedule(); }
      else { clearTimer(); timeline?.pause(); }
    };
    const enter = () => { hovered = true; sync(); };
    const leave = () => { hovered = false; sync(); };
    const focus = () => { focused = true; sync(); };
    const blur = (event: FocusEvent) => { if (!stage.contains(event.relatedTarget as Node | null)) { focused = false; sync(); } };
    const click = () => { if (!disposed && cards.length > 1 && (!timeline || timeline.progress() === 1)) swap(); };
    const motionChanged = () => { if (motion.matches) timeline?.progress(1); sync(); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: .15 });
    observer.observe(stage);
    stage.addEventListener('mouseenter', enter);
    stage.addEventListener('mouseleave', leave);
    stage.addEventListener('focusin', focus);
    stage.addEventListener('focusout', blur);
    stage.addEventListener('click', click);
    document.addEventListener('visibilitychange', sync);
    motion.addEventListener('change', motionChanged);
    return () => {
      disposed = true;
      clearTimer();
      timeline?.kill();
      gsap.killTweensOf(cards);
      observer.disconnect();
      context.revert();
      stage.removeEventListener('mouseenter', enter);
      stage.removeEventListener('mouseleave', leave);
      stage.removeEventListener('focusin', focus);
      stage.removeEventListener('focusout', blur);
      stage.removeEventListener('click', click);
      document.removeEventListener('visibilitychange', sync);
      motion.removeEventListener('change', motionChanged);
    };
  }, [items]);

  if (!items.length) return null;
  return <section className="gallery-swap-section" id="scrolling-gallery" aria-label="Academy photo showcase">
    <div className="gallery-swap-copy">
      <span className="eyebrow">Life at PAART</span>
      <h2>Learning together.<br /><em>Growing together.</em></h2>
      <p>A closer look at our students, celebrations, and community activities.</p>
      <Link className="gallery-swap-link" href="/gallery">Explore the gallery <ArrowRight size={18} /></Link>
    </div>
    <div ref={stageRef} className="gallery-swap-stage" role="group" aria-roledescription="carousel" aria-label="PAART gallery photos">
      {items.map((item, index) => <figure key={item.id} className="gallery-swap-card" aria-hidden={index !== activeIndex}>
        <Image
          src={item.image}
          alt={item.description || item.title}
          fill
          sizes="(max-width: 760px) 85vw, 500px"
          priority={index === 0}
          loading={index < 3 ? 'eager' : 'lazy'}
          quality={80}
        />
        <figcaption><h3>{item.title}</h3>{item.description && <p>{item.description}</p>}</figcaption>
      </figure>)}
    </div>
  </section>;
}