import { z } from 'zod'

export const templateIds = ['cambridge', 'minimal', 'atlas'] as const
export type TemplateId = (typeof templateIds)[number]

export const densityOptions = ['comfortable', 'compact'] as const
export type Density = (typeof densityOptions)[number]

export const CURRENT_DOCUMENT_VERSION = '1.3.0'

const TimedHighlightsItemSchema = z.object({
  id: z.string(),
  role: z.string(),
  organization: z.string(),
  location: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  current: z.boolean(),
  highlights: z.array(z.string()),
})

const ProjectItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  subtitle: z.string(),
  url: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  current: z.boolean(),
  highlights: z.array(z.string()),
})

const EducationItemSchema = z.object({
  id: z.string(),
  degree: z.string(),
  school: z.string(),
  location: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  details: z.array(z.string()),
})

const SkillGroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  items: z.array(z.string()),
})

const LinkItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  url: z.string(),
})

const DatedItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  issuer: z.string(),
  date: z.string(),
  url: z.string(),
  details: z.array(z.string()),
})

const PublicationItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  publisher: z.string(),
  date: z.string(),
  url: z.string(),
  details: z.array(z.string()),
})

const LanguageItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  level: z.string(),
})

const InterestItemSchema = z.object({
  id: z.string(),
  name: z.string(),
})

const ReferenceItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  relationship: z.string(),
  contact: z.string(),
  details: z.string(),
})

const CustomItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  details: z.array(z.string()),
})

const ExperienceSectionSchema = z.object({
  id: z.string(),
  type: z.literal('experience'),
  title: z.string(),
  visible: z.boolean(),
  items: z.array(TimedHighlightsItemSchema),
})

const ProjectsSectionSchema = z.object({
  id: z.string(),
  type: z.literal('projects'),
  title: z.string(),
  visible: z.boolean(),
  items: z.array(ProjectItemSchema),
})

const EducationSectionSchema = z.object({
  id: z.string(),
  type: z.literal('education'),
  title: z.string(),
  visible: z.boolean(),
  items: z.array(EducationItemSchema),
})

const SkillsSectionSchema = z.object({
  id: z.string(),
  type: z.literal('skills'),
  title: z.string(),
  visible: z.boolean(),
  groups: z.array(SkillGroupSchema),
})

const CertificationsSectionSchema = z.object({
  id: z.string(),
  type: z.literal('certifications'),
  title: z.string(),
  visible: z.boolean(),
  items: z.array(DatedItemSchema),
})

const AwardsSectionSchema = z.object({
  id: z.string(),
  type: z.literal('awards'),
  title: z.string(),
  visible: z.boolean(),
  items: z.array(DatedItemSchema),
})

const VolunteerSectionSchema = z.object({
  id: z.string(),
  type: z.literal('volunteer'),
  title: z.string(),
  visible: z.boolean(),
  items: z.array(TimedHighlightsItemSchema),
})

const PublicationsSectionSchema = z.object({
  id: z.string(),
  type: z.literal('publications'),
  title: z.string(),
  visible: z.boolean(),
  items: z.array(PublicationItemSchema),
})

const LanguagesSectionSchema = z.object({
  id: z.string(),
  type: z.literal('languages'),
  title: z.string(),
  visible: z.boolean(),
  items: z.array(LanguageItemSchema),
})

const InterestsSectionSchema = z.object({
  id: z.string(),
  type: z.literal('interests'),
  title: z.string(),
  visible: z.boolean(),
  items: z.array(InterestItemSchema),
})

const LinksSectionSchema = z.object({
  id: z.string(),
  type: z.literal('links'),
  title: z.string(),
  visible: z.boolean(),
  items: z.array(LinkItemSchema),
})

const ReferencesSectionSchema = z.object({
  id: z.string(),
  type: z.literal('references'),
  title: z.string(),
  visible: z.boolean(),
  items: z.array(ReferenceItemSchema),
})

const CustomSectionSchema = z.object({
  id: z.string(),
  type: z.literal('custom'),
  title: z.string(),
  visible: z.boolean(),
  items: z.array(CustomItemSchema),
})

const CvSectionSchema = z.discriminatedUnion('type', [
  ExperienceSectionSchema,
  ProjectsSectionSchema,
  EducationSectionSchema,
  SkillsSectionSchema,
  CertificationsSectionSchema,
  AwardsSectionSchema,
  VolunteerSectionSchema,
  PublicationsSectionSchema,
  LanguagesSectionSchema,
  InterestsSectionSchema,
  LinksSectionSchema,
  ReferencesSectionSchema,
  CustomSectionSchema,
])

export const CvDocumentSchema = z.object({
  version: z.string(),
  metadata: z.object({
    id: z.string(),
    title: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
  profile: z.object({
    fullName: z.string(),
    headline: z.string(),
    email: z.string(),
    phone: z.string(),
    location: z.string(),
    website: z.string(),
    summary: z.string(),
  }),
  theme: z.object({
    templateId: z.enum(templateIds),
    textColor: z.string(),
    fontFamily: z.string(),
    density: z.enum(densityOptions),
  }),
  sections: z.array(CvSectionSchema),
})

export type ExperienceItem = z.infer<typeof TimedHighlightsItemSchema>
export type VolunteerItem = z.infer<typeof TimedHighlightsItemSchema>
export type ProjectItem = z.infer<typeof ProjectItemSchema>
export type EducationItem = z.infer<typeof EducationItemSchema>
export type SkillGroup = z.infer<typeof SkillGroupSchema>
export type LinkItem = z.infer<typeof LinkItemSchema>
export type CertificationItem = z.infer<typeof DatedItemSchema>
export type AwardItem = z.infer<typeof DatedItemSchema>
export type PublicationItem = z.infer<typeof PublicationItemSchema>
export type LanguageItem = z.infer<typeof LanguageItemSchema>
export type InterestItem = z.infer<typeof InterestItemSchema>
export type ReferenceItem = z.infer<typeof ReferenceItemSchema>
export type CustomItem = z.infer<typeof CustomItemSchema>

export type ExperienceSection = z.infer<typeof ExperienceSectionSchema>
export type ProjectsSection = z.infer<typeof ProjectsSectionSchema>
export type EducationSection = z.infer<typeof EducationSectionSchema>
export type SkillsSection = z.infer<typeof SkillsSectionSchema>
export type CertificationsSection = z.infer<typeof CertificationsSectionSchema>
export type AwardsSection = z.infer<typeof AwardsSectionSchema>
export type VolunteerSection = z.infer<typeof VolunteerSectionSchema>
export type PublicationsSection = z.infer<typeof PublicationsSectionSchema>
export type LanguagesSection = z.infer<typeof LanguagesSectionSchema>
export type InterestsSection = z.infer<typeof InterestsSectionSchema>
export type LinksSection = z.infer<typeof LinksSectionSchema>
export type ReferencesSection = z.infer<typeof ReferencesSectionSchema>
export type CustomSection = z.infer<typeof CustomSectionSchema>
export type CvSection = z.infer<typeof CvSectionSchema>
export type CvDocument = z.infer<typeof CvDocumentSchema>

type UnknownRecord = Record<string, unknown>

export const makeId = () => crypto.randomUUID()
const now = () => new Date().toISOString()

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const asString = (value: unknown, fallback = '') =>
  typeof value === 'string' ? value : fallback

const asBoolean = (value: unknown, fallback = false) =>
  typeof value === 'boolean' ? value : fallback

const asStringArray = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []

const asRecordArray = (value: unknown) =>
  Array.isArray(value) ? value.filter(isRecord) : []

const asEnum = <TOption extends string>(
  value: unknown,
  options: readonly TOption[],
  fallback: TOption,
) => (typeof value === 'string' && options.includes(value as TOption) ? (value as TOption) : fallback)

const makeTimedHighlightsItem = (
  role = 'Frontend Engineer',
  organization = 'Open Studio',
  location = 'Remote',
  startDate = '2023',
): ExperienceItem => ({
  id: makeId(),
  role,
  organization,
  location,
  startDate,
  endDate: '',
  current: true,
  highlights: [
    'Designed and shipped polished interfaces for workflow-heavy tools.',
    'Improved feature delivery by standardizing reusable UI patterns.',
  ],
})

const makeProjectItem = (): ProjectItem => ({
  id: makeId(),
  name: 'cvMaker',
  subtitle: 'Open-source CV builder in React and TypeScript',
  url: 'github.com/yourname/cvmaker',
  startDate: '2026',
  endDate: '',
  current: true,
  highlights: [
    'Built a local-first editor with live preview and reusable resume templates.',
    'Planned exports for PDF and DOCX from a shared document model.',
  ],
})

const makeEducationItem = (): EducationItem => ({
  id: makeId(),
  degree: 'BSc in Computer Science',
  school: 'Example University',
  location: 'City',
  startDate: '2018',
  endDate: '2022',
  details: ['Graduated with a focus on systems, UX, and product engineering.'],
})

const makeSkillGroup = (): SkillGroup => ({
  id: makeId(),
  name: 'Core',
  items: ['TypeScript', 'React', 'Design Systems', 'Accessibility'],
})

const makeLinkItem = (): LinkItem => ({
  id: makeId(),
  label: 'Portfolio',
  url: 'https://portfolio.dev',
})

const makeDatedItem = (title: string, issuer: string): CertificationItem => ({
  id: makeId(),
  title,
  issuer,
  date: '2025',
  url: '',
  details: ['Include a concise note about scope, level, or relevance.'],
})

const makePublicationItem = (): PublicationItem => ({
  id: makeId(),
  title: 'Designing Faster Product Workflows',
  publisher: 'Product Systems Journal',
  date: '2024',
  url: '',
  details: ['Article exploring systems-based collaboration between design and engineering.'],
})

const makeLanguageItem = (name = 'English', level = 'Native'): LanguageItem => ({
  id: makeId(),
  name,
  level,
})

const makeInterestItem = (name = 'Editorial design'): InterestItem => ({
  id: makeId(),
  name,
})

const makeReferenceItem = (): ReferenceItem => ({
  id: makeId(),
  name: 'Jordan Lee',
  relationship: 'Former manager',
  contact: 'jordan.lee@example.com',
  details: 'Available on request or by direct introduction.',
})

const makeCustomItem = (): CustomItem => ({
  id: makeId(),
  title: 'Custom entry',
  subtitle: 'Add your own category details',
  details: ['Use this section for domain-specific experience or credentials.'],
})

const createEmptySectionMap = () => ({
  experience: {
    id: makeId(),
    type: 'experience' as const,
    title: 'Experience',
    visible: true,
    items: [makeTimedHighlightsItem()],
  },
  projects: {
    id: makeId(),
    type: 'projects' as const,
    title: 'Projects',
    visible: true,
    items: [makeProjectItem()],
  },
  education: {
    id: makeId(),
    type: 'education' as const,
    title: 'Education',
    visible: true,
    items: [makeEducationItem()],
  },
  skills: {
    id: makeId(),
    type: 'skills' as const,
    title: 'Skills',
    visible: true,
    groups: [makeSkillGroup()],
  },
  certifications: {
    id: makeId(),
    type: 'certifications' as const,
    title: 'Certifications',
    visible: false,
    items: [makeDatedItem('AWS Certified Cloud Practitioner', 'Amazon Web Services')],
  },
  awards: {
    id: makeId(),
    type: 'awards' as const,
    title: 'Awards',
    visible: false,
    items: [makeDatedItem('Dean\'s List', 'Example University')],
  },
  volunteer: {
    id: makeId(),
    type: 'volunteer' as const,
    title: 'Volunteer Experience',
    visible: false,
    items: [makeTimedHighlightsItem('Mentor', 'Open Learning Collective', 'Remote', '2024')],
  },
  publications: {
    id: makeId(),
    type: 'publications' as const,
    title: 'Publications',
    visible: false,
    items: [makePublicationItem()],
  },
  languages: {
    id: makeId(),
    type: 'languages' as const,
    title: 'Languages',
    visible: false,
    items: [makeLanguageItem()],
  },
  interests: {
    id: makeId(),
    type: 'interests' as const,
    title: 'Interests',
    visible: false,
    items: [makeInterestItem()],
  },
  links: {
    id: makeId(),
    type: 'links' as const,
    title: 'Links',
    visible: true,
    items: [makeLinkItem()],
  },
  references: {
    id: makeId(),
    type: 'references' as const,
    title: 'References',
    visible: false,
    items: [makeReferenceItem()],
  },
  custom: {
    id: makeId(),
    type: 'custom' as const,
    title: 'Custom Section',
    visible: false,
    items: [makeCustomItem()],
  },
})

const normalizeTimedHighlightsItem = (value: UnknownRecord): ExperienceItem => ({
  id: asString(value.id, makeId()),
  role: asString(value.role),
  organization: asString(value.organization, asString(value.company)),
  location: asString(value.location),
  startDate: asString(value.startDate),
  endDate: asString(value.endDate),
  current: asBoolean(value.current),
  highlights: asStringArray(value.highlights),
})

const normalizeProjectItem = (value: UnknownRecord): ProjectItem => ({
  id: asString(value.id, makeId()),
  name: asString(value.name),
  subtitle: asString(value.subtitle),
  url: asString(value.url),
  startDate: asString(value.startDate),
  endDate: asString(value.endDate),
  current: asBoolean(value.current),
  highlights: asStringArray(value.highlights),
})

const normalizeEducationItem = (value: UnknownRecord): EducationItem => ({
  id: asString(value.id, makeId()),
  degree: asString(value.degree),
  school: asString(value.school),
  location: asString(value.location),
  startDate: asString(value.startDate),
  endDate: asString(value.endDate),
  details: asStringArray(value.details),
})

const normalizeSkillGroup = (value: UnknownRecord): SkillGroup => ({
  id: asString(value.id, makeId()),
  name: asString(value.name),
  items: asStringArray(value.items),
})

const normalizeLinkItem = (value: UnknownRecord): LinkItem => ({
  id: asString(value.id, makeId()),
  label: asString(value.label),
  url: asString(value.url),
})

const normalizeDatedItem = (value: UnknownRecord): CertificationItem => ({
  id: asString(value.id, makeId()),
  title: asString(value.title),
  issuer: asString(value.issuer),
  date: asString(value.date),
  url: asString(value.url),
  details: asStringArray(value.details),
})

const normalizePublicationItem = (value: UnknownRecord): PublicationItem => ({
  id: asString(value.id, makeId()),
  title: asString(value.title),
  publisher: asString(value.publisher),
  date: asString(value.date),
  url: asString(value.url),
  details: asStringArray(value.details),
})

const normalizeLanguageItem = (value: UnknownRecord): LanguageItem => ({
  id: asString(value.id, makeId()),
  name: asString(value.name),
  level: asString(value.level),
})

const normalizeInterestItem = (value: UnknownRecord): InterestItem => ({
  id: asString(value.id, makeId()),
  name: asString(value.name),
})

const normalizeReferenceItem = (value: UnknownRecord): ReferenceItem => ({
  id: asString(value.id, makeId()),
  name: asString(value.name),
  relationship: asString(value.relationship),
  contact: asString(value.contact),
  details: asString(value.details),
})

const normalizeCustomItem = (value: UnknownRecord): CustomItem => ({
  id: asString(value.id, makeId()),
  title: asString(value.title),
  subtitle: asString(value.subtitle),
  details: asStringArray(value.details),
})

const normalizeSections = (value: unknown): CvSection[] => {
  const defaults = createEmptySectionMap()
  const sectionRecords = asRecordArray(value)
  const sectionMap = new Map(
    sectionRecords
      .map((section) => [asString(section.type), section] as const)
      .filter(([type]) => type.length > 0),
  )

  const normalizeBase = (type: keyof typeof defaults) => {
    const source = sectionMap.get(type) ?? {}
    return {
      id: asString(source.id, defaults[type].id),
      title: asString(source.title, defaults[type].title),
      visible: asBoolean(source.visible, defaults[type].visible),
    }
  }

  const sections = [
    {
      ...normalizeBase('experience'),
      type: 'experience',
      items: asRecordArray(sectionMap.get('experience')?.items).map(normalizeTimedHighlightsItem),
    },
    {
      ...normalizeBase('projects'),
      type: 'projects',
      items: asRecordArray(sectionMap.get('projects')?.items).map(normalizeProjectItem),
    },
    {
      ...normalizeBase('education'),
      type: 'education',
      items: asRecordArray(sectionMap.get('education')?.items).map(normalizeEducationItem),
    },
    {
      ...normalizeBase('skills'),
      type: 'skills',
      groups: asRecordArray(sectionMap.get('skills')?.groups).map(normalizeSkillGroup),
    },
    {
      ...normalizeBase('certifications'),
      type: 'certifications',
      items: asRecordArray(sectionMap.get('certifications')?.items).map(normalizeDatedItem),
    },
    {
      ...normalizeBase('awards'),
      type: 'awards',
      items: asRecordArray(sectionMap.get('awards')?.items).map(normalizeDatedItem),
    },
    {
      ...normalizeBase('volunteer'),
      type: 'volunteer',
      items: asRecordArray(sectionMap.get('volunteer')?.items).map(normalizeTimedHighlightsItem),
    },
    {
      ...normalizeBase('publications'),
      type: 'publications',
      items: asRecordArray(sectionMap.get('publications')?.items).map(normalizePublicationItem),
    },
    {
      ...normalizeBase('languages'),
      type: 'languages',
      items: asRecordArray(sectionMap.get('languages')?.items).map(normalizeLanguageItem),
    },
    {
      ...normalizeBase('interests'),
      type: 'interests',
      items: asRecordArray(sectionMap.get('interests')?.items).map(normalizeInterestItem),
    },
    {
      ...normalizeBase('links'),
      type: 'links',
      items: asRecordArray(sectionMap.get('links')?.items).map(normalizeLinkItem),
    },
    {
      ...normalizeBase('references'),
      type: 'references',
      items: asRecordArray(sectionMap.get('references')?.items).map(normalizeReferenceItem),
    },
    {
      ...normalizeBase('custom'),
      type: 'custom',
      items: asRecordArray(sectionMap.get('custom')?.items).map(normalizeCustomItem),
    },
  ] as CvSection[]

  return sections.map((section) => {
    if ('items' in section && section.items.length === 0) {
      switch (section.type) {
        case 'experience':
        case 'volunteer':
          return { ...section, items: [makeTimedHighlightsItem()] }
        case 'projects':
          return { ...section, items: [makeProjectItem()] }
        case 'education':
          return { ...section, items: [makeEducationItem()] }
        case 'certifications':
          return { ...section, items: [makeDatedItem('New Certification', 'Issuer')] }
        case 'awards':
          return { ...section, items: [makeDatedItem('New Award', 'Issuer')] }
        case 'publications':
          return { ...section, items: [makePublicationItem()] }
        case 'languages':
          return { ...section, items: [makeLanguageItem()] }
        case 'interests':
          return { ...section, items: [makeInterestItem()] }
        case 'links':
          return { ...section, items: [makeLinkItem()] }
        case 'references':
          return { ...section, items: [makeReferenceItem()] }
        case 'custom':
          return { ...section, items: [makeCustomItem()] }
        default:
          return section
      }
    }

    if (section.type === 'skills' && section.groups.length === 0) {
      return { ...section, groups: [makeSkillGroup()] }
    }

    return section
  }) as CvSection[]
}

const normalizeDocument = (value: unknown) => {
  const timestamp = now()
  const document = isRecord(value) ? value : {}
  const metadata = isRecord(document.metadata) ? document.metadata : {}
  const profile = isRecord(document.profile) ? document.profile : {}
  const theme = isRecord(document.theme) ? document.theme : {}

  return {
    version: CURRENT_DOCUMENT_VERSION,
    metadata: {
      id: asString(metadata.id, makeId()),
      title: asString(metadata.title, 'My CV'),
      createdAt: asString(metadata.createdAt, timestamp),
      updatedAt: asString(metadata.updatedAt, timestamp),
    },
    profile: {
      fullName: asString(profile.fullName, 'Your Name'),
      headline: asString(profile.headline, 'Product-minded builder'),
      email: asString(profile.email, 'you@example.com'),
      phone: asString(profile.phone, '+1 555 0100'),
      location: asString(profile.location, 'City, Country'),
      website: asString(profile.website, 'portfolio.dev'),
      summary: asString(
        profile.summary,
        'Sharp, adaptable professional focused on building clear experiences, shipping quickly, and turning ideas into useful products.',
      ),
    },
    theme: {
      templateId: asEnum(theme.templateId, templateIds, 'minimal'),
      textColor: asString(theme.textColor, asString(theme.accentColor, '#1f1b19')),
      fontFamily: asString(theme.fontFamily, 'Literata'),
      density: asEnum(theme.density, densityOptions, 'comfortable'),
    },
    sections: normalizeSections(document.sections),
  }
}

export const createDefaultDocument = (): CvDocument =>
  CvDocumentSchema.parse({
    version: CURRENT_DOCUMENT_VERSION,
    metadata: {
      id: makeId(),
      title: 'My CV',
      createdAt: now(),
      updatedAt: now(),
    },
    profile: {
      fullName: 'Your Name',
      headline: 'Product-minded builder',
      email: 'you@example.com',
      phone: '+1 555 0100',
      location: 'City, Country',
      website: 'portfolio.dev',
      summary:
        'Sharp, adaptable professional focused on building clear experiences, shipping quickly, and turning ideas into useful products.',
    },
    theme: {
      templateId: 'minimal',
      textColor: '#1f1b19',
      fontFamily: 'Literata',
      density: 'comfortable',
    },
    sections: Object.values(createEmptySectionMap()),
  })

export const createSampleDocument = (): CvDocument =>
  CvDocumentSchema.parse({
    version: CURRENT_DOCUMENT_VERSION,
    metadata: {
      id: makeId(),
      title: 'Amina Patel CV',
      createdAt: now(),
      updatedAt: now(),
    },
    profile: {
      fullName: 'Amina Patel',
      headline: 'Senior Product Designer and Frontend Collaborator',
      email: 'amina.patel@example.com',
      phone: '+44 20 7946 0138',
      location: 'London, UK',
      website: 'aminapatel.design',
      summary:
        'Designer-builder with 7+ years of experience shaping digital products from discovery through delivery, with a strong bias for systems thinking and clean implementation.',
    },
    theme: {
      templateId: 'cambridge',
      textColor: '#111827',
      fontFamily: 'Calibri',
      density: 'comfortable',
    },
    sections: [
      {
        id: makeId(),
        type: 'experience',
        title: 'Experience',
        visible: true,
        items: [
          {
            id: makeId(),
            role: 'Senior Product Designer',
            organization: 'Northstar Health',
            location: 'London',
            startDate: '2022',
            endDate: '',
            current: true,
            highlights: [
              'Led design for a patient workflow platform used across 120+ clinics.',
              'Partnered with frontend engineers to launch a shared component system that reduced implementation drift.',
            ],
          },
          {
            id: makeId(),
            role: 'Product Designer',
            organization: 'Signal Labs',
            location: 'Berlin',
            startDate: '2019',
            endDate: '2022',
            current: false,
            highlights: [
              'Created dashboards and onboarding flows that improved activation for B2B teams.',
              'Ran research and rapid prototyping sprints with product and engineering partners.',
            ],
          },
        ],
      },
      {
        id: makeId(),
        type: 'projects',
        title: 'Projects',
        visible: true,
        items: [
          {
            id: makeId(),
            name: 'Care Pathways Design System',
            subtitle: 'Cross-functional design and implementation program',
            url: 'northstarhealth.design/system',
            startDate: '2023',
            endDate: '',
            current: true,
            highlights: [
              'Created an editorial component language used across product, marketing, and onboarding surfaces.',
              'Introduced shared specs and implementation guidance to speed design-engineering handoff.',
            ],
          },
        ],
      },
      {
        id: makeId(),
        type: 'education',
        title: 'Education',
        visible: true,
        items: [
          {
            id: makeId(),
            degree: 'BA in Interaction Design',
            school: 'University of the Arts London',
            location: 'London',
            startDate: '2014',
            endDate: '2017',
            details: ['Focused on interaction systems, editorial layouts, and human-centered research.'],
          },
        ],
      },
      {
        id: makeId(),
        type: 'skills',
        title: 'Skills',
        visible: true,
        groups: [
          {
            id: makeId(),
            name: 'Design',
            items: ['Product Design', 'Design Systems', 'Prototyping', 'User Research'],
          },
          {
            id: makeId(),
            name: 'Frontend',
            items: ['React', 'TypeScript', 'Storybook', 'Accessibility'],
          },
        ],
      },
      {
        id: makeId(),
        type: 'certifications',
        title: 'Certifications',
        visible: true,
        items: [
          {
            id: makeId(),
            title: 'Professional Scrum Product Owner',
            issuer: 'Scrum.org',
            date: '2024',
            url: '',
            details: ['Applied product discovery and delivery practices in cross-functional teams.'],
          },
        ],
      },
      {
        id: makeId(),
        type: 'awards',
        title: 'Awards',
        visible: true,
        items: [
          {
            id: makeId(),
            title: 'Design Leadership Award',
            issuer: 'Northstar Health',
            date: '2023',
            url: '',
            details: ['Recognized for establishing a reusable product design system across three teams.'],
          },
        ],
      },
      {
        id: makeId(),
        type: 'volunteer',
        title: 'Volunteer Experience',
        visible: true,
        items: [
          {
            id: makeId(),
            role: 'Mentor',
            organization: 'Open Learning Collective',
            location: 'Remote',
            startDate: '2021',
            endDate: '',
            current: true,
            highlights: ['Mentor junior designers building early-career portfolios and case studies.'],
          },
        ],
      },
      {
        id: makeId(),
        type: 'publications',
        title: 'Publications',
        visible: true,
        items: [
          {
            id: makeId(),
            title: 'Designing Faster Product Workflows',
            publisher: 'Product Systems Journal',
            date: '2024',
            url: 'productsystems.example/article',
            details: ['Article on aligning editorial design systems with product delivery teams.'],
          },
        ],
      },
      {
        id: makeId(),
        type: 'languages',
        title: 'Languages',
        visible: true,
        items: [
          makeLanguageItem('English', 'Native'),
          makeLanguageItem('Hindi', 'Professional working proficiency'),
        ],
      },
      {
        id: makeId(),
        type: 'interests',
        title: 'Interests',
        visible: true,
        items: [makeInterestItem('Editorial design'), makeInterestItem('Museums'), makeInterestItem('Running')],
      },
      {
        id: makeId(),
        type: 'links',
        title: 'Links',
        visible: true,
        items: [
          {
            id: makeId(),
            label: 'Portfolio',
            url: 'https://aminapatel.design',
          },
          {
            id: makeId(),
            label: 'LinkedIn',
            url: 'https://linkedin.com/in/aminapatel',
          },
        ],
      },
      {
        id: makeId(),
        type: 'references',
        title: 'References',
        visible: true,
        items: [
          {
            id: makeId(),
            name: 'Jordan Lee',
            relationship: 'Director of Product',
            contact: 'jordan.lee@northstarhealth.com',
            details: 'Former manager and cross-functional design lead.',
          },
        ],
      },
      {
        id: makeId(),
        type: 'custom',
        title: 'Leadership & Activities',
        visible: true,
        items: [
          {
            id: makeId(),
            title: 'Design Community Organizer',
            subtitle: 'Hosted monthly critique sessions for early-career designers',
            details: ['Built an active meetup format for portfolio reviews and peer feedback.'],
          },
        ],
      },
    ],
  })

export const ensureDocument = (value: unknown): CvDocument =>
  CvDocumentSchema.parse(normalizeDocument(value))

export const getSection = <TSection extends CvSection['type']>(
  document: CvDocument,
  type: TSection,
) => {
  const section = document.sections.find((item) => item.type === type)

  if (!section) {
    throw new Error(`Missing section: ${type}`)
  }

  return section as Extract<CvSection, { type: TSection }>
}

export const splitListField = (value: string) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
