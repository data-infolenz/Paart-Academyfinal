'use client';
import React, { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  end: number;
  durationMs?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export const CountUp: React.FC<CountUpProps> = ({ 
  end, 
  durationMs = 1200, 
  className = '',
  prefix = '',
  suffix = ''
}) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      setCount(end);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    let hasStarted = false;

    observerRef.current = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !hasStarted) {
        hasStarted = true;
        let startTimestamp: number | null = null;
        
        const step = (timestamp: number) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / durationMs, 1);
          
          // easeOutQuad
          const easeProgress = progress * (2 - progress);
          setCount(Math.floor(easeProgress * end));
          
          if (progress < 1) {
            window.requestAnimationFrame(step);
          } else {
            setCount(end);
          }
        };
        
        window.requestAnimationFrame(step);
        observerRef.current?.disconnect();
      }
    }, { threshold: 0.1 });

    observerRef.current.observe(element);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [end, durationMs]);

  return (
    <span ref={elementRef} className={className}>
      {prefix}{count}{suffix}
    </span>
  );
};
