export type CourseDetails = {
  overview: string;
  whoCanJoin: string;
  preparationFocus: string;
  keyAreas: string;
  support: string;
  outcome: string;
};

// Course descriptions supplied by PAART, keyed by the existing course IDs.
export const courseDetails: Partial<Record<string, CourseDetails>> = {
  "group-1": {
    "overview": "A structured preparation program for candidates aiming for senior administrative and civil service positions through the TNPSC Group I examination.",
    "whoCanJoin": "Graduates who are preparing for Tamil Nadu state-level administrative services.",
    "preparationFocus": "Preliminary Examination, Main Examination, Answer Writing, Current Affairs and Interview Guidance.",
    "keyAreas": "General Studies, Aptitude, Indian Polity, History, Geography, Economy, Science & Technology, Tamil Nadu Administration and Current Affairs.",
    "support": "Study materials, regular tests, revision sessions, mock examinations and performance analysis.",
    "outcome": "Helps students build strong conceptual knowledge, exam strategy and consistent preparation for all stages of the examination."
  },
  "group-2": {
    "overview": "Comprehensive preparation for candidates appearing for TNPSC Group II examinations.",
    "whoCanJoin": "Graduates interested in Tamil Nadu government services through Group II recruitment.",
    "preparationFocus": "Preliminary Examination, Main Examination and systematic revision.",
    "keyAreas": "General Studies, General Tamil/English, Aptitude, Polity, Economy, History, Geography, Science and Current Affairs.",
    "support": "Topic-wise classes, practice questions, mock tests, study materials and revision support.",
    "outcome": "Develops subject understanding, speed, accuracy and examination confidence."
  },
  "group-2a": {
    "overview": "Focused preparation for candidates targeting non-interview posts under TNPSC Group IIA.",
    "whoCanJoin": "Graduates preparing for Group IIA government positions.",
    "preparationFocus": "Preliminary and main examination preparation with strong emphasis on objective and descriptive practice.",
    "keyAreas": "General Studies, Aptitude, Tamil Eligibility, Administration, Economy, Polity and Current Affairs.",
    "support": "Regular tests, revision schedules, study materials and doubt clarification.",
    "outcome": "Provides a clear and repeatable preparation system for consistent exam performance."
  },
  "group-4": {
    "overview": "A foundation-to-exam-level program designed for candidates preparing for TNPSC Group IV posts.",
    "whoCanJoin": "Eligible school-level and graduate candidates based on the recruitment notification.",
    "preparationFocus": "Strong basics, objective question practice, revision and full-length mock examinations.",
    "keyAreas": "General Studies, General Tamil, Aptitude, History, Geography, Polity, Economy and Current Affairs.",
    "support": "Simple concept teaching, daily practice, previous-year questions and mock tests.",
    "outcome": "Helps students improve accuracy, time management and confidence for the examination."
  },
  "vao": {
    "overview": "Focused preparation for Village Administrative Officer-related recruitment examinations.",
    "whoCanJoin": "Candidates interested in village-level administrative government service.",
    "preparationFocus": "General awareness, Tamil, aptitude and government-exam fundamentals.",
    "keyAreas": "General Studies, Tamil, Mathematics, Reasoning, Tamil Nadu History, Geography, Polity and Current Affairs.",
    "support": "Practice tests, revision, model questions and previous-year question analysis.",
    "outcome": "Builds a strong foundation for VAO and related competitive examinations."
  },
  "tnusrb-si": {
    "overview": "Structured preparation for candidates aspiring to become Sub Inspectors through TNUSRB recruitment.",
    "whoCanJoin": "Eligible graduates who wish to enter the police service.",
    "preparationFocus": "Written examination preparation together with awareness of subsequent selection stages.",
    "keyAreas": "General Knowledge, Psychology, Reasoning, Numerical Ability, Communication Skills and Current Affairs.",
    "support": "Mock tests, practice sets, exam strategy and systematic revision.",
    "outcome": "Improves written exam readiness, analytical ability and overall confidence."
  },
  "police-constable": {
    "overview": "An exam-focused program for candidates preparing for police constable recruitment examinations.",
    "whoCanJoin": "Eligible candidates interested in joining the police department.",
    "preparationFocus": "Written examination concepts, regular question practice and revision.",
    "keyAreas": "General Knowledge, Tamil, Mathematics, Reasoning, Science and Current Affairs.",
    "support": "Daily practice, topic tests, mock examinations and doubt-clearing sessions.",
    "outcome": "Helps candidates develop speed, accuracy and exam readiness."
  },
  "tet": {
    "overview": "Concept-based preparation for candidates appearing for Teacher Eligibility Tests.",
    "whoCanJoin": "Teacher aspirants who meet the required educational qualifications.",
    "preparationFocus": "Teaching aptitude, subject knowledge and child development concepts.",
    "keyAreas": "Child Development & Pedagogy, Tamil/Language, English, Mathematics, Environmental Studies, Science and Social Science as applicable.",
    "support": "Concept classes, practice questions, previous-year papers and mock tests.",
    "outcome": "Strengthens subject knowledge and improves confidence for eligibility examinations."
  },
  "ssc": {
    "overview": "A comprehensive preparation program for Staff Selection Commission examinations for central government jobs.",
    "whoCanJoin": "Candidates preparing for SSC examinations based on their qualification level.",
    "preparationFocus": "Quantitative Aptitude, Reasoning, English, General Awareness and Current Affairs.",
    "keyAreas": "Arithmetic, Algebra, Geometry, Logical Reasoning, Vocabulary, Grammar, General Knowledge and Current Events.",
    "support": "Practice sets, speed-building exercises, mock tests and performance analysis.",
    "outcome": "Helps candidates improve problem-solving speed, accuracy and overall competitive exam performance."
  },
  "banking": {
    "overview": "Focused preparation for candidates seeking opportunities in banking sector recruitment examinations.",
    "whoCanJoin": "Graduates preparing for bank clerk, probationary officer and related examinations.",
    "preparationFocus": "Speed, accuracy, reasoning ability, quantitative aptitude and language skills.",
    "keyAreas": "Quantitative Aptitude, Reasoning, English, Banking Awareness, Computer Awareness and Current Affairs.",
    "support": "Timed practice, mock exams, shortcuts, revision sessions and question analysis.",
    "outcome": "Improves examination speed, accuracy and confidence across all major banking exam sections."
  },
  "railway": {
    "overview": "A structured preparation program for candidates appearing for railway recruitment examinations.",
    "whoCanJoin": "Candidates interested in various Railway Recruitment Board examinations according to eligibility.",
    "preparationFocus": "General awareness, mathematics, reasoning and science-based preparation.",
    "keyAreas": "Mathematics, General Intelligence & Reasoning, General Science, General Awareness and Current Affairs.",
    "support": "Previous-year question practice, mock examinations, topic revision and test analysis.",
    "outcome": "Develops a strong competitive-exam foundation and improves readiness for railway recruitment tests."
  }
};

export const courseProvision = "Structured classes, study materials, regular practice tests, previous-year questions, revision sessions, mock examinations, current affairs support and doubt clarification.";
