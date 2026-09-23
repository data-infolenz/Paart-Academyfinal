import type { CourseDetails } from '@/data/course-details';

export type AdmissionStatus = 'New' | 'Contacted' | 'Pending' | 'Approved' | 'Rejected' | 'Joined';

export type UploadedFile = {
  name: string;
  url: string;
  type: string;
  size: number;
};

export type Admission = {
  id: string;
  applicationId: string;
  studentName: string;
  parentName: string;
  dateOfBirth: string;
  gender: string;
  mobile: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  courseInterested: string;
  previousQualification: string;
  schoolCollegeName: string;
  yearOfPassing: string;
  marksPercentage: string;
  preferredBatch: string;
  message: string;
  status: AdmissionStatus;
  studentPhoto?: UploadedFile;
  documents: UploadedFile[];
  appliedDate: string;
  updatedAt: string;
};

export type Enquiry = {
  id: string;
  name: string;
  phone: string;
  courseInterested: string;
  message: string;
  status: 'New' | 'Contacted' | 'Closed';
  createdAt: string;
};

export type ManagedCourse = {
  details?: CourseDetails;
  provision?: string;
  id: string;
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  duration: string;
  eligibility: string;
  image: string;
  features: string[];
  examStages: string[];
  enabled: boolean;
  updatedAt: string;
};

export type Blog = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  content: string;
  author: string;
  publishedDate: string;
  category: string;
  featuredImage: string;
  seoTitle: string;
  metaDescription: string;
  keywords: string;
  published: boolean;
  updatedAt: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  videoUrl?: string;
  order: number;
  createdAt: string;
};

export type MediaItem = {
  id: string;
  title: string;
  url: string;
  type: string;
  size: number;
  createdAt: string;
};

export type Material = {
  id: string;
  title: string;
  category: string;
  description: string;
  thumbnail: string;
  fileUrl: string;
  externalUrl: string;
  published: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type Settings = {
  additionalAddress?: string;
  siteName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  hours: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
};

export type CmsData = {
  admissions: Admission[];
  enquiries: Enquiry[];
  courses: ManagedCourse[];
  materials: Material[];
  blogs: Blog[];
  gallery: GalleryItem[];
  media: MediaItem[];
  settings: Settings;
};
