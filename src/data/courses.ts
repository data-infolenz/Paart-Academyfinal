export type CourseCategory = 'TNPSC' | 'TNUSRB' | 'TET / TRB' | 'SSC' | 'BANKING' | 'RAILWAY' | 'OTHER EXAMS';

export type Course = {
  id: string;
  slug: string;
  title: string;
  category: CourseCategory;
  shortDescription: string;
  examStages: string[];
  highlights: string[];
  enabled: boolean;
};

export const courseCategories: CourseCategory[] = ['TNPSC', 'TNUSRB', 'TET / TRB', 'SSC', 'BANKING', 'RAILWAY', 'OTHER EXAMS'];

export const courses: Course[] = [
  { id: 'group-1', slug: 'tnpsc-group-1', title: 'TNPSC Group I', category: 'TNPSC', shortDescription: 'A structured path for aspirants targeting Tamil Nadu’s premier civil services examination.', examStages: ['Preliminary', 'Mains', 'Interview'], highlights: ['General Studies', 'Current Affairs', 'Answer writing'], enabled: true },
  { id: 'group-2', slug: 'tnpsc-group-2', title: 'TNPSC Group II', category: 'TNPSC', shortDescription: 'Build confidence across the common and main examination stages with guided practice.', examStages: ['Preliminary', 'Mains'], highlights: ['Tamil eligibility', 'Aptitude', 'Mock tests'], enabled: true },
  { id: 'group-2a', slug: 'tnpsc-group-2a', title: 'TNPSC Group IIA', category: 'TNPSC', shortDescription: 'Focused preparation for non-interview posts with a clear, repeatable study rhythm.', examStages: ['Preliminary', 'Mains'], highlights: ['Subject coverage', 'Revision plans', 'Performance review'], enabled: true },
  { id: 'group-4', slug: 'tnpsc-group-4', title: 'TNPSC Group IV', category: 'TNPSC', shortDescription: 'Practical preparation for the Group IV examination, from basics to full-length tests.', examStages: ['Written exam'], highlights: ['Tamil', 'General Studies', 'Daily practice'], enabled: true },
  { id: 'vao', slug: 'vao', title: 'VAO', category: 'TNPSC', shortDescription: 'An accessible foundation for village administrative officer exam preparation.', examStages: ['Written exam'], highlights: ['State focus', 'Previous papers', 'Revision support'], enabled: true },
  { id: 'tnusrb-si', slug: 'tnusrb-si', title: 'TNUSRB Sub Inspector', category: 'TNUSRB', shortDescription: 'Prepare with discipline for the written examination and the stages that follow.', examStages: ['Written exam', 'Physical stages'], highlights: ['Aptitude', 'Tamil Nadu GK', 'Practice sets'], enabled: true },
  { id: 'police-constable', slug: 'police-constable', title: 'Police Constable', category: 'TNUSRB', shortDescription: 'Build exam readiness through consistent practice, revision and test analysis.', examStages: ['Written exam', 'Physical stages'], highlights: ['General Knowledge', 'Tamil', 'Mock tests'], enabled: true },
  { id: 'tet', slug: 'tet', title: 'TET', category: 'TET / TRB', shortDescription: 'Strengthen core concepts and examination confidence for teaching eligibility tests.', examStages: ['Paper I', 'Paper II'], highlights: ['Child development', 'Subject pedagogy', 'Practice tests'], enabled: true },
  { id: 'ssc', slug: 'ssc', title: 'SSC Preparation', category: 'SSC', shortDescription: 'A flexible foundation for central government competitive examination preparation.', examStages: ['Tier I', 'Tier II'], highlights: ['Quantitative aptitude', 'Reasoning', 'English'], enabled: true },
  { id: 'banking', slug: 'banking', title: 'Banking Preparation', category: 'BANKING', shortDescription: 'Build speed and accuracy across the core sections of banking examinations.', examStages: ['Preliminary', 'Mains'], highlights: ['Reasoning', 'Quantitative aptitude', 'Current affairs'], enabled: true },
  { id: 'railway', slug: 'railway', title: 'Railway Preparation', category: 'RAILWAY', shortDescription: 'A guided study framework for students preparing for railway examinations.', examStages: ['Computer-based test', 'Further stages'], highlights: ['General Science', 'Maths', 'Mock tests'], enabled: true },
];

export const megaMenuGroups = [
  { title: 'TNPSC', items: ['Group I', 'Group II', 'Group IIA', 'Group IV', 'VAO', 'Combined Technical Services'] },
  { title: 'TNUSRB', items: ['Sub Inspector', 'Police Constable'] },
  { title: 'Teaching Exams', items: ['TET', 'TRB'] },
  { title: 'Central Government', items: ['SSC', 'Banking', 'Railway'] },
  { title: 'Other Competitive Exams', items: ['Explore available courses'] },
];
