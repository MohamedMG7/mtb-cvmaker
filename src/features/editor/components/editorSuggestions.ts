export const editorHints = {
  draftTitle: 'Senior Product Designer Resume',
  fullName: 'Amina Patel',
  headline: 'Product-minded builder for workflow-heavy products',
  email: 'name@example.com',
  phone: '+20 100 123 4567',
  location: 'Cairo, Egypt',
  website: 'portfolio.dev or linkedin.com/in/yourname',
  summary: 'Write a tight 2 to 4 line summary focused on your strengths and direction.',
  role: 'Senior Frontend Engineer',
  organization: 'Mercor',
  projectName: 'Resume Builder',
  projectUrl: 'https://github.com/yourname/resume-builder',
  projectSubtitle: 'Local-first CV builder with polished PDF export',
  degree: 'BSc in Computer Science',
  school: 'Cairo University',
  issuer: 'Amazon Web Services',
  date: '2024 or Jan 2024',
  locationShort: 'Remote or Cairo, Egypt',
  sectionTitle: 'Keep the title clear and standard',
  skillGroup: 'Core Technologies',
  skillItems: 'React, TypeScript, Vite, Zustand',
  language: 'Arabic',
  languageLevel: 'Professional working proficiency',
  interest: 'Trail running',
  linkLabel: 'GitHub',
  referenceName: 'Mona Hassan',
  relationship: 'Engineering Manager',
  contact: 'mona.hassan@example.com or +20 100 123 4567',
  customTitle: 'Speaking',
  customSubtitle: 'Guest speaker at product and frontend meetups',
  textarea: 'Use short, high-signal lines instead of long paragraphs.',
} as const

export const editorSuggestions = {
  headlines: [
    'Senior Product Designer for complex workflow tools',
    'Frontend Engineer focused on polished product experiences',
    'Full-stack developer with strong product sense',
    'Data analyst turning messy workflows into clear decisions',
  ],
  roles: [
    'Senior Frontend Engineer',
    'Product Designer',
    'Full-stack Developer',
    'Growth Marketing Manager',
    'Data Analyst',
  ],
  organizations: [
    'Mercor',
    'Google',
    'Freelance',
    'Confidential startup',
    'Self-employed',
  ],
  sectionTitles: [
    'Experience',
    'Projects',
    'Education',
    'Certifications',
    'Awards',
    'Volunteer Experience',
    'Leadership',
  ],
  dates: ['2026', '2025', '2024', 'Jan 2024', 'Present'],
  projectTypes: [
    'Internal operations platform',
    'Customer-facing web app',
    'Portfolio case study',
    'Open-source tool',
  ],
  degrees: [
    'BSc in Computer Science',
    'BA in Design',
    'MSc in Data Science',
    'MBA',
  ],
  skillGroupNames: [
    'Core Technologies',
    'Product Skills',
    'Design Tools',
    'Programming Languages',
    'Leadership',
  ],
  languageLevels: [
    'Native',
    'Fluent',
    'Professional working proficiency',
    'Limited working proficiency',
    'Conversational',
  ],
  linkLabels: ['GitHub', 'LinkedIn', 'Portfolio', 'Behance', 'Scholar Profile'],
  relationships: [
    'Engineering Manager',
    'Product Manager',
    'Former Manager',
    'Professor',
    'Client',
  ],
  customTitles: ['Leadership', 'Speaking', 'Teaching', 'Community', 'Research'],
  highlightLines: [
    'Led a cross-functional initiative that improved delivery speed.',
    'Shipped a redesign that made a complex workflow easier to complete.',
    'Improved quality, conversion, or efficiency through a measurable change.',
  ],
  summaryLines: [
    'Product-minded professional with a track record of shipping clear, useful experiences.',
    'Brings strong execution, communication, and ownership across fast-moving teams.',
    'Best used when the role values both craft and practical delivery.',
  ],
  detailLines: [
    'Mention the scope, outcome, or level of responsibility.',
    'Add context that makes this item relevant for the target role.',
    'Keep only the strongest proof and skip filler.',
  ],
  interests: ['Trail running', 'Editorial design', 'Open-source', 'Photography', 'Mentoring'],
} as const

export const appendSuggestionLine = (values: string[], suggestion: string) => {
  const normalizedSuggestion = suggestion.trim()
  const normalizedValues = values.map((value) => value.trim()).filter(Boolean)

  if (!normalizedSuggestion || normalizedValues.includes(normalizedSuggestion)) {
    return normalizedValues
  }

  return [...normalizedValues, normalizedSuggestion]
}
