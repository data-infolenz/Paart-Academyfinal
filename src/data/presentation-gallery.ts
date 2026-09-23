import { presentationEvents } from './trust';
import type { GalleryItem } from '@/types/cms';

const photos = [
  { slide: 5, image: '/images/paart-event-5-1.jpg' },
  { slide: 5, image: '/images/paart-event-5-2.jpg' },
  { slide: 5, image: '/images/paart-event-5-3.jpg' },
  { slide: 5, image: '/images/paart-event-5-4.jpg' },
  { slide: 5, image: '/images/paart-event-5-5.jpg' },
  { slide: 6, image: '/images/paart-event-6-1.jpg' },
  { slide: 6, image: '/images/paart-event-6-2.png' },
  { slide: 7, image: '/images/paart-event-7-1.png' },
  { slide: 7, image: '/images/paart-event-7-2.png' },
  { slide: 8, image: '/images/paart-event-8-1.jpg' },
  { slide: 8, image: '/images/paart-event-8-2.jpg' },
  { slide: 8, image: '/images/paart-event-8-3.jpg' },
  { slide: 8, image: '/images/paart-event-8-4.jpg' },
  { slide: 9, image: '/images/paart-event-9-1.png' },
  { slide: 9, image: '/images/paart-event-9-2.jpg' },
  { slide: 10, image: '/images/paart-event-10-1.jpg' },
  { slide: 10, image: '/images/paart-event-10-2.png' },
  { slide: 10, image: '/images/paart-event-10-3.png' },
  { slide: 11, image: '/images/paart-event-11-1.png' },
];
export const presentationGallery: GalleryItem[] = photos.map((photo, index) => {
  const event = presentationEvents.find((item) => item.slide === photo.slide)!;
  return { id: 'presentation-' + index, title: event.title, description: event.description, category: 'Activities', image: photo.image, order: index, createdAt: '' };
});
