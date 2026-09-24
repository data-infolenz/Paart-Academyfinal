'use client';

import { useEffect, useId, useRef } from 'react';

const journeyPath = 'M 20 12 V 74 C 20 100 34 100 34 126 V 164 C 34 190 8 190 8 216 V 264 C 8 290 34 290 34 316 V 354 C 34 380 20 380 20 406 V 468';

export function ScrollJourney() {
  const gradientId = useId();
  const pathRef = useRef<SVGPathElement>(null);
  const tipRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    const tip = tipRef.current;
    if (!path || !tip) return;
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const length = path.getTotalLength();
    let frame = 0;

    const draw = () => {
      frame = 0;
      const page = document.scrollingElement ?? document.documentElement;
      const distance = page.scrollHeight - page.clientHeight;
      const progress = motionPreference.matches ? 1 : distance > 0 ? Math.min(1, Math.max(0, page.scrollTop / distance)) : 1;
      path.style.strokeDashoffset = String(1 - progress);
      const point = path.getPointAtLength(length * progress);
      tip.setAttribute('cx', String(point.x));
      tip.setAttribute('cy', String(point.y));
    };
    const scheduleDraw = () => {
      if (!frame) frame = window.requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener('scroll', scheduleDraw, { passive: true });
    window.addEventListener('resize', scheduleDraw);
    motionPreference.addEventListener('change', scheduleDraw);
    const resizeObserver = new ResizeObserver(scheduleDraw);
    resizeObserver.observe(document.documentElement);
    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener('scroll', scheduleDraw);
      window.removeEventListener('resize', scheduleDraw);
      motionPreference.removeEventListener('change', scheduleDraw);
      resizeObserver.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <div className="scroll-journey" aria-hidden="true">
    <svg viewBox="0 0 42 480" fill="none" focusable="false">
      <defs><linearGradient id={gradientId} x1="20" y1="12" x2="20" y2="468" gradientUnits="userSpaceOnUse"><stop stopColor="#6caa87" /><stop offset="1" stopColor="#145237" /></linearGradient></defs>
      <path className="scroll-journey-track" d={journeyPath} />
      <path ref={pathRef} className="scroll-journey-progress" d={journeyPath} pathLength="1" stroke={`url(#${gradientId})`} />
      <circle className="scroll-journey-endpoint" cx="20" cy="12" r="3" />
      <circle className="scroll-journey-endpoint" cx="20" cy="468" r="3" />
      <circle ref={tipRef} className="scroll-journey-tip" cx="20" cy="12" r="4" />
    </svg>
  </div>;
}