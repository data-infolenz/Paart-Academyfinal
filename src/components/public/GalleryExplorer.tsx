'use client';

import Image from 'next/image';
import { X } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { GalleryItem } from '@/types/cms';

const categories = ['All', 'Classroom', 'Events', 'Activities', 'Celebrations', 'Students', 'Achievements'];

export function GalleryExplorer({ items }: { items: GalleryItem[] }) {
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const visible = useMemo(() => {
    const sorted = [...items].sort((a, b) => a.order - b.order);
    return category === 'All' ? sorted : sorted.filter((item) => item.category === category);
  }, [items, category]);

  return (
    <>
      <div className="gallery-filters" role="tablist" aria-label="Gallery categories">
        {categories.map((item) => <button className={category === item ? 'active' : ''} key={item} onClick={() => setCategory(item)}>{item}</button>)}
      </div>
      <div className="masonry-grid">
        {visible.map((item, index) => (
          <button className="gallery-tile" key={item.id} onClick={() => setSelected(item)} aria-label={`Preview ${item.title}`}>
            <Image
              src={item.image}
              alt={item.description || item.title}
              width={620}
              height={420}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
              priority={index < 4}
              loading={index < 4 ? 'eager' : 'lazy'}
              quality={80}
            />
            <span><b>{item.title}</b><small>{item.category}</small></span>
          </button>
        ))}
      </div>
      {selected && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={selected.title}>
          <button className="lightbox-close" onClick={() => setSelected(null)} aria-label="Close preview"><X size={24} /></button>
          <figure>
            <Image
              src={selected.image}
              alt={selected.description || selected.title}
              width={1200}
              height={780}
              sizes="(max-width: 1200px) 95vw, 1200px"
              priority
              quality={85}
            />
            <figcaption><b>{selected.title}</b><span>{selected.description}</span></figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
