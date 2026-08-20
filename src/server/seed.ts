import { courses } from '@/data/courses';
import { gallery, materials } from '@/data/content';
import { contact } from '@/config/contact';
import type { Blog, CmsData, GalleryItem, ManagedCourse, Material } from '@/types/cms';

const now = new Date().toISOString();
const courseImages = [
  '/images/exam (1).jpeg',
  '/images/exam (2).jpeg',
  '/images/exam (3).jpeg',
  '/images/exam (4).jpeg',
  '/images/exam (5).jpeg',
];

export const seededCourses: ManagedCourse[] = courses.map((course, index) => ({
  id: course.id,
  slug: course.slug,
  title: course.title,
  category: course.category,
  shortDescription: course.shortDescription,
  duration: 'Flexible weekday and weekend batches',
  eligibility: 'Students preparing for government and competitive examinations',
  image: courseImages[index % courseImages.length],
  features: course.highlights,
  examStages: course.examStages,
  enabled: course.enabled,
  updatedAt: now,
}));

export const seededBlogs: Blog[] = [
  {
    id: 'blog-tnpsc-group-4',
    slug: 'how-to-prepare-for-tnpsc-group-4',
    title: 'How to Prepare for TNPSC Group 4 with a Clear Study Plan',
    shortDescription: 'A practical preparation rhythm for Group 4 aspirants: syllabus, revision, tests and current affairs.',
    content:
      'TNPSC Group 4 preparation becomes easier when students follow a weekly structure. Start with the syllabus, revise Tamil and General Studies regularly, practise aptitude every day and review mock-test mistakes. PAART Academy keeps the process focused with study materials, current affairs support and guided tests.',
    author: 'PAART Academic Team',
    publishedDate: '2026-08-01',
    category: 'TNPSC',
    featuredImage: '/images/2.JPG',
    seoTitle: 'TNPSC Group 4 Preparation Guide | PAART Academy',
    metaDescription: 'Learn how to prepare for TNPSC Group 4 with a simple study plan from PAART Academy.',
    keywords: 'TNPSC Group 4, TNPSC coaching, PAART Academy',
    published: true,
    updatedAt: now,
  },
  {
    id: 'blog-current-affairs',
    slug: 'daily-current-affairs-for-tnpsc',
    title: 'Why Daily Current Affairs Matter for TNPSC Exams',
    shortDescription: 'A daily reading habit helps students connect events with exam-relevant facts and concepts.',
    content:
      'Current affairs preparation works best when it is consistent. Read short daily notes, connect them with static subjects and revise monthly. This habit improves recall and makes mock tests more meaningful.',
    author: 'PAART Academic Team',
    publishedDate: '2026-08-05',
    category: 'Current Affairs',
    featuredImage: '/images/3.JPG',
    seoTitle: 'Daily Current Affairs for TNPSC | PAART Academy',
    metaDescription: 'Understand how daily current affairs preparation supports TNPSC exam readiness.',
    keywords: 'TNPSC current affairs, daily current affairs, competitive exams',
    published: true,
    updatedAt: now,
  },
];

export const seededGallery: GalleryItem[] = gallery.map((item, index) => ({
  id: `gallery-${index + 1}`,
  title: item.title,
  description: item.alt,
  category: ['Classroom', 'Events', 'Students', 'Activities', 'Classroom', 'Students', 'Activities', 'Classroom', 'Events', 'Achievements', 'Celebrations', 'Students'][index] ?? 'Classroom',
  image: item.image,
  order: index + 1,
  createdAt: now,
}));

export const seededMaterials: Material[] = materials.map((item, index) => ({
  id: `material-${index + 1}`,
  title: item.title,
  category: index < 3 ? 'Study Material' : index < 7 ? 'Notes' : 'Resources',
  description: `Download ${item.title} resources prepared for structured competitive exam revision.`,
  thumbnail: '',
  fileUrl: item.href,
  externalUrl: '',
  published: true,
  displayOrder: index + 1,
  createdAt: now,
  updatedAt: now,
}));

export const defaultCmsData: CmsData = {
  admissions: [],
  enquiries: [],
  courses: seededCourses,
  materials: seededMaterials,
  blogs: seededBlogs,
  gallery: seededGallery,
  media: [],
  settings: {
    siteName: 'PAART Academy',
    phone: contact.phone,
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? process.env.WHATSAPP_NUMBER ?? contact.whatsapp.replace('+', ''),
    email: contact.email,
    address: contact.address,
    hours: contact.hours,
    seoTitle: 'PAART Academy | TNPSC & Competitive Exam Preparation',
    seoDescription:
      'PAART Academy provides premium TNPSC and competitive exam coaching with admissions, test series, study materials, current affairs and student support.',
    canonicalUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://paartacademy.in',
  },
};
