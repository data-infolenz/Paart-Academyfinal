'use client';
import { useEffect, useRef } from 'react';

export default function RevealObserver() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Unobserve after reveal
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -5% 0px',
      }
    );

    const observeElements = () => {
      const elements = document.querySelectorAll(
        '[data-rev]:not(.is-visible), [data-rev-scale]:not(.is-visible), [data-rev-btn]:not(.is-visible), .fade-up:not(.is-visible), .animated-text-container:not(.is-visible)'
      );
      elements.forEach((el) => {
        observerRef.current?.observe(el);
      });
    };

    observeElements();

    // Observe newly added elements
    const mutationObserver = new MutationObserver((mutations) => {
      let shouldReObserve = false;
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          shouldReObserve = true;
        }
      });
      if (shouldReObserve) {
        observeElements();
      }
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      observerRef.current?.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
