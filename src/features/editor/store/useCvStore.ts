import { create } from 'zustand'
import {
  createDefaultDocument,
  makeId,
  type AwardItem,
  type CertificationItem,
  type CustomItem,
  type CvDocument,
  type Density,
  type EducationItem,
  type ExperienceItem,
  type InterestItem,
  type LanguageItem,
  type LinkItem,
  type ProjectItem,
  type PublicationItem,
  type ReferenceItem,
  type SkillGroup,
  type TemplateId,
  type VolunteerItem,
} from '../../../lib/schema/cv'

type EditorMode = 'simple' | 'advanced'
type SaveState = 'idle' | 'saving' | 'saved' | 'error'
type SectionType = CvDocument['sections'][number]['type']

type CvStore = {
  document: CvDocument
  isReady: boolean
  editorMode: EditorMode
  saveState: SaveState
  lastSavedAt: string | null
  initialize: (document: CvDocument) => void
  replaceDocument: (document: CvDocument) => void
  resetDocument: (document?: CvDocument) => void
  setEditorMode: (mode: EditorMode) => void
  updateTitle: (title: string) => void
  updateProfileField: (field: keyof CvDocument['profile'], value: string) => void
  updateThemeField: (
    field: keyof CvDocument['theme'],
    value: string | Density | TemplateId,
  ) => void
  updateSectionTitle: (type: SectionType, title: string) => void
  updateExperience: (id: string, field: keyof ExperienceItem, value: string | boolean | string[]) => void
  addExperience: () => void
  removeExperience: (id: string) => void
  updateProject: (id: string, field: keyof ProjectItem, value: string | boolean | string[]) => void
  addProject: () => void
  removeProject: (id: string) => void
  updateEducation: (id: string, field: keyof EducationItem, value: string | string[]) => void
  addEducation: () => void
  removeEducation: (id: string) => void
  updateSkillGroup: (id: string, field: keyof SkillGroup, value: string | string[]) => void
  addSkillGroup: () => void
  removeSkillGroup: (id: string) => void
  updateCertification: (id: string, field: keyof CertificationItem, value: string | string[]) => void
  addCertification: () => void
  removeCertification: (id: string) => void
  updateAward: (id: string, field: keyof AwardItem, value: string | string[]) => void
  addAward: () => void
  removeAward: (id: string) => void
  updateVolunteer: (id: string, field: keyof VolunteerItem, value: string | boolean | string[]) => void
  addVolunteer: () => void
  removeVolunteer: (id: string) => void
  updatePublication: (id: string, field: keyof PublicationItem, value: string | string[]) => void
  addPublication: () => void
  removePublication: (id: string) => void
  updateLanguage: (id: string, field: keyof LanguageItem, value: string) => void
  addLanguage: () => void
  removeLanguage: (id: string) => void
  updateInterest: (id: string, value: string) => void
  addInterest: () => void
  removeInterest: (id: string) => void
  updateLink: (id: string, field: keyof LinkItem, value: string) => void
  addLink: () => void
  removeLink: (id: string) => void
  updateReference: (id: string, field: keyof ReferenceItem, value: string) => void
  addReference: () => void
  removeReference: (id: string) => void
  updateCustomItem: (id: string, field: keyof CustomItem, value: string | string[]) => void
  addCustomItem: () => void
  removeCustomItem: (id: string) => void
  toggleSectionVisibility: (type: SectionType) => void
  reorderSections: (fromType: SectionType, toType: SectionType) => void
  markSaving: () => void
  markSaved: (timestamp: string) => void
  markSaveError: () => void
}

const touch = (document: CvDocument) => ({
  ...document,
  metadata: {
    ...document.metadata,
    updatedAt: new Date().toISOString(),
  },
})

const updateSection = (
  document: CvDocument,
  type: SectionType,
  updater: (section: CvDocument['sections'][number]) => CvDocument['sections'][number],
) => ({
  ...document,
  sections: document.sections.map((section) =>
    section.type === type ? updater(section) : section,
  ),
})

const createTimedItem = (role: string, organization: string): ExperienceItem => ({
  id: makeId(),
  role,
  organization,
  location: 'Remote',
  startDate: '2024',
  endDate: '',
  current: true,
  highlights: ['Describe the outcome, scope, or impact of your work.'],
})

const createProject = (): ProjectItem => ({
  id: makeId(),
  name: 'New Project',
  subtitle: 'Short description or product context',
  url: 'project-url.com',
  startDate: '2024',
  endDate: '',
  current: true,
  highlights: ['Describe what you built, improved, or launched.'],
})

const createEducation = (): EducationItem => ({
  id: makeId(),
  degree: 'New Degree',
  school: 'School',
  location: 'City',
  startDate: '2020',
  endDate: '2024',
  details: ['Add coursework, honors, or standout achievements.'],
})

const createSkillGroup = (): SkillGroup => ({
  id: makeId(),
  name: 'New Group',
  items: ['Skill A', 'Skill B'],
})

const createDatedItem = (title: string, issuer: string): CertificationItem => ({
  id: makeId(),
  title,
  issuer,
  date: '2025',
  url: '',
  details: ['Add a concise note about relevance or scope.'],
})

const createPublication = (): PublicationItem => ({
  id: makeId(),
  title: 'New Publication',
  publisher: 'Publisher',
  date: '2025',
  url: '',
  details: ['Summarize the publication or presentation.'],
})

const createLanguage = (): LanguageItem => ({
  id: makeId(),
  name: 'Language',
  level: 'Professional working proficiency',
})

const createInterest = (): InterestItem => ({
  id: makeId(),
  name: 'Interest',
})

const createLink = (): LinkItem => ({
  id: makeId(),
  label: 'New Link',
  url: 'https://example.com',
  headerDisplay: 'label',
})

const createReference = (): ReferenceItem => ({
  id: makeId(),
  name: 'Reference Name',
  relationship: 'Relationship',
  contact: 'email@example.com',
  details: 'Available upon request.',
})

const createCustomItem = (): CustomItem => ({
  id: makeId(),
  title: 'Custom entry',
  subtitle: 'Describe the entry',
  details: ['Add relevant context, accomplishments, or notes.'],
})

export const useCvStore = create<CvStore>((set) => ({
  document: createDefaultDocument(),
  isReady: false,
  editorMode: 'simple',
  saveState: 'idle',
  lastSavedAt: null,
  initialize: (document) =>
    set({
      document,
      isReady: true,
      saveState: 'idle',
      lastSavedAt: document.metadata.updatedAt,
    }),
  replaceDocument: (document) =>
    set({
      document: touch(document),
      saveState: 'idle',
    }),
  resetDocument: (document) =>
    set({
      document: document ?? createDefaultDocument(),
      saveState: 'idle',
      lastSavedAt: null,
    }),
  setEditorMode: (mode) => set({ editorMode: mode }),
  updateTitle: (title) =>
    set((state) => ({
      document: touch({
        ...state.document,
        metadata: {
          ...state.document.metadata,
          title,
        },
      }),
    })),
  updateProfileField: (field, value) =>
    set((state) => ({
      document: touch({
        ...state.document,
        profile: {
          ...state.document.profile,
          [field]: value,
        },
      }),
    })),
  updateThemeField: (field, value) =>
    set((state) => ({
      document: touch({
        ...state.document,
        theme: {
          ...state.document.theme,
          [field]: value,
        },
      }),
    })),
  updateSectionTitle: (type, title) =>
    set((state) => ({
      document: touch(
        updateSection(state.document, type, (section) => ({
          ...section,
          title,
        })),
      ),
    })),
  updateExperience: (id, field, value) =>
    set((state) => ({
      document: touch(
        updateSection(state.document, 'experience', (section) =>
          section.type !== 'experience'
            ? section
            : {
                ...section,
                items: section.items.map((item) =>
                  item.id === id ? { ...item, [field]: value } : item,
                ),
              },
        ),
      ),
    })),
  addExperience: () =>
    set((state) => ({
      document: touch(
        updateSection(state.document, 'experience', (section) =>
          section.type !== 'experience'
            ? section
            : { ...section, items: [...section.items, createTimedItem('New Role', 'Company')] },
        ),
      ),
    })),
  removeExperience: (id) =>
    set((state) => ({
      document: touch(
        updateSection(state.document, 'experience', (section) =>
          section.type !== 'experience'
            ? section
            : { ...section, items: section.items.filter((item) => item.id !== id) },
        ),
      ),
    })),
  updateProject: (id, field, value) =>
    set((state) => ({
      document: touch(
        updateSection(state.document, 'projects', (section) =>
          section.type !== 'projects'
            ? section
            : {
                ...section,
                items: section.items.map((item) =>
                  item.id === id ? { ...item, [field]: value } : item,
                ),
              },
        ),
      ),
    })),
  addProject: () =>
    set((state) => ({
      document: touch(
        updateSection(state.document, 'projects', (section) =>
          section.type !== 'projects'
            ? section
            : { ...section, items: [...section.items, createProject()] },
        ),
      ),
    })),
  removeProject: (id) =>
    set((state) => ({
      document: touch(
        updateSection(state.document, 'projects', (section) =>
          section.type !== 'projects'
            ? section
            : { ...section, items: section.items.filter((item) => item.id !== id) },
        ),
      ),
    })),
  updateEducation: (id, field, value) =>
    set((state) => ({
      document: touch(
        updateSection(state.document, 'education', (section) =>
          section.type !== 'education'
            ? section
            : {
                ...section,
                items: section.items.map((item) =>
                  item.id === id ? { ...item, [field]: value } : item,
                ),
              },
        ),
      ),
    })),
  addEducation: () =>
    set((state) => ({
      document: touch(
        updateSection(state.document, 'education', (section) =>
          section.type !== 'education'
            ? section
            : { ...section, items: [...section.items, createEducation()] },
        ),
      ),
    })),
  removeEducation: (id) =>
    set((state) => ({
      document: touch(
        updateSection(state.document, 'education', (section) =>
          section.type !== 'education'
            ? section
            : { ...section, items: section.items.filter((item) => item.id !== id) },
        ),
      ),
    })),
  updateSkillGroup: (id, field, value) =>
    set((state) => ({
      document: touch(
        updateSection(state.document, 'skills', (section) =>
          section.type !== 'skills'
            ? section
            : {
                ...section,
                groups: section.groups.map((group) =>
                  group.id === id ? { ...group, [field]: value } : group,
                ),
              },
        ),
      ),
    })),
  addSkillGroup: () =>
    set((state) => ({
      document: touch(
        updateSection(state.document, 'skills', (section) =>
          section.type !== 'skills'
            ? section
            : { ...section, groups: [...section.groups, createSkillGroup()] },
        ),
      ),
    })),
  removeSkillGroup: (id) =>
    set((state) => ({
      document: touch(
        updateSection(state.document, 'skills', (section) =>
          section.type !== 'skills'
            ? section
            : { ...section, groups: section.groups.filter((group) => group.id !== id) },
        ),
      ),
    })),
  updateCertification: (id, field, value) =>
    set((state) => ({
      document: touch(
        updateSection(state.document, 'certifications', (section) =>
          section.type !== 'certifications'
            ? section
            : {
                ...section,
                items: section.items.map((item) =>
                  item.id === id ? { ...item, [field]: value } : item,
                ),
              },
        ),
      ),
    })),
  addCertification: () =>
    set((state) => ({
      document: touch(
        updateSection(state.document, 'certifications', (section) =>
          section.type !== 'certifications'
            ? section
            : {
                ...section,
                items: [...section.items, createDatedItem('New Certification', 'Issuer')],
              },
        ),
      ),
    })),
  removeCertification: (id) =>
    set((state) => ({
      document: touch(
        updateSection(state.document, 'certifications', (section) =>
          section.type !== 'certifications'
            ? section
            : { ...section, items: section.items.filter((item) => item.id !== id) },
        ),
      ),
    })),
  updateAward: (id, field, value) =>
    set((state) => ({
      document: touch(
        updateSection(state.document, 'awards', (section) =>
          section.type !== 'awards'
            ? section
            : {
                ...section,
                items: section.items.map((item) =>
                  item.id === id ? { ...item, [field]: value } : item,
                ),
              },
        ),
      ),
    })),
  addAward: () =>
    set((state) => ({
      document: touch(
        updateSection(state.document, 'awards', (section) =>
          section.type !== 'awards'
            ? section
            : { ...section, items: [...section.items, createDatedItem('New Award', 'Issuer')] },
        ),
      ),
    })),
  removeAward: (id) =>
    set((state) => ({
      document: touch(
        updateSection(state.document, 'awards', (section) =>
          section.type !== 'awards'
            ? section
            : { ...section, items: section.items.filter((item) => item.id !== id) },
        ),
      ),
    })),
  updateVolunteer: (id, field, value) =>
    set((state) => ({
      document: touch(
        updateSection(state.document, 'volunteer', (section) =>
          section.type !== 'volunteer'
            ? section
            : {
                ...section,
                items: section.items.map((item) =>
                  item.id === id ? { ...item, [field]: value } : item,
                ),
              },
        ),
      ),
    })),
  addVolunteer: () =>
    set((state) => ({
      document: touch(
        updateSection(state.document, 'volunteer', (section) =>
          section.type !== 'volunteer'
            ? section
            : { ...section, items: [...section.items, createTimedItem('Volunteer Role', 'Organization')] },
        ),
      ),
    })),
  removeVolunteer: (id) =>
    set((state) => ({
      document: touch(
        updateSection(state.document, 'volunteer', (section) =>
          section.type !== 'volunteer'
            ? section
            : { ...section, items: section.items.filter((item) => item.id !== id) },
        ),
      ),
    })),
  updatePublication: (id, field, value) =>
    set((state) => ({
      document: touch(
        updateSection(state.document, 'publications', (section) =>
          section.type !== 'publications'
            ? section
            : {
                ...section,
                items: section.items.map((item) =>
                  item.id === id ? { ...item, [field]: value } : item,
                ),
              },
        ),
      ),
    })),
  addPublication: () =>
    set((state) => ({
      document: touch(
        updateSection(state.document, 'publications', (section) =>
          section.type !== 'publications'
            ? section
            : { ...section, items: [...section.items, createPublication()] },
        ),
      ),
    })),
  removePublication: (id) =>
    set((state) => ({
      document: touch(
        updateSection(state.document, 'publications', (section) =>
          section.type !== 'publications'
            ? section
            : { ...section, items: section.items.filter((item) => item.id !== id) },
        ),
      ),
    })),
  updateLanguage: (id, field, value) =>
    set((state) => ({
      document: touch(
        updateSection(state.document, 'languages', (section) =>
          section.type !== 'languages'
            ? section
            : {
                ...section,
                items: section.items.map((item) =>
                  item.id === id ? { ...item, [field]: value } : item,
                ),
              },
        ),
      ),
    })),
  addLanguage: () =>
    set((state) => ({
      document: touch(
        updateSection(state.document, 'languages', (section) =>
          section.type !== 'languages'
            ? section
            : { ...section, items: [...section.items, createLanguage()] },
        ),
      ),
    })),
  removeLanguage: (id) =>
    set((state) => ({
      document: touch(
        updateSection(state.document, 'languages', (section) =>
          section.type !== 'languages'
            ? section
            : { ...section, items: section.items.filter((item) => item.id !== id) },
        ),
      ),
    })),
  updateInterest: (id, value) =>
    set((state) => ({
      document: touch(
        updateSection(state.document, 'interests', (section) =>
          section.type !== 'interests'
            ? section
            : {
                ...section,
                items: section.items.map((item) => (item.id === id ? { ...item, name: value } : item)),
              },
        ),
      ),
    })),
  addInterest: () =>
    set((state) => ({
      document: touch(
        updateSection(state.document, 'interests', (section) =>
          section.type !== 'interests'
            ? section
            : { ...section, items: [...section.items, createInterest()] },
        ),
      ),
    })),
  removeInterest: (id) =>
    set((state) => ({
      document: touch(
        updateSection(state.document, 'interests', (section) =>
          section.type !== 'interests'
            ? section
            : { ...section, items: section.items.filter((item) => item.id !== id) },
        ),
      ),
    })),
  updateLink: (id, field, value) =>
    set((state) => ({
      document: touch(
        updateSection(state.document, 'links', (section) =>
          section.type !== 'links'
            ? section
            : {
                ...section,
                items: section.items.map((item) =>
                  item.id === id ? { ...item, [field]: value } : item,
                ),
              },
        ),
      ),
    })),
  addLink: () =>
    set((state) => ({
      document: touch(
        updateSection(state.document, 'links', (section) =>
          section.type !== 'links'
            ? section
            : { ...section, items: [...section.items, createLink()] },
        ),
      ),
    })),
  removeLink: (id) =>
    set((state) => ({
      document: touch(
        updateSection(state.document, 'links', (section) =>
          section.type !== 'links'
            ? section
            : { ...section, items: section.items.filter((item) => item.id !== id) },
        ),
      ),
    })),
  updateReference: (id, field, value) =>
    set((state) => ({
      document: touch(
        updateSection(state.document, 'references', (section) =>
          section.type !== 'references'
            ? section
            : {
                ...section,
                items: section.items.map((item) =>
                  item.id === id ? { ...item, [field]: value } : item,
                ),
              },
        ),
      ),
    })),
  addReference: () =>
    set((state) => ({
      document: touch(
        updateSection(state.document, 'references', (section) =>
          section.type !== 'references'
            ? section
            : { ...section, items: [...section.items, createReference()] },
        ),
      ),
    })),
  removeReference: (id) =>
    set((state) => ({
      document: touch(
        updateSection(state.document, 'references', (section) =>
          section.type !== 'references'
            ? section
            : { ...section, items: section.items.filter((item) => item.id !== id) },
        ),
      ),
    })),
  updateCustomItem: (id, field, value) =>
    set((state) => ({
      document: touch(
        updateSection(state.document, 'custom', (section) =>
          section.type !== 'custom'
            ? section
            : {
                ...section,
                items: section.items.map((item) =>
                  item.id === id ? { ...item, [field]: value } : item,
                ),
              },
        ),
      ),
    })),
  addCustomItem: () =>
    set((state) => ({
      document: touch(
        updateSection(state.document, 'custom', (section) =>
          section.type !== 'custom'
            ? section
            : { ...section, items: [...section.items, createCustomItem()] },
        ),
      ),
    })),
  removeCustomItem: (id) =>
    set((state) => ({
      document: touch(
        updateSection(state.document, 'custom', (section) =>
          section.type !== 'custom'
            ? section
            : { ...section, items: section.items.filter((item) => item.id !== id) },
        ),
      ),
    })),
  toggleSectionVisibility: (type) =>
    set((state) => ({
      document: touch(
        updateSection(state.document, type, (section) => ({
          ...section,
          visible: !section.visible,
        })),
      ),
    })),
  reorderSections: (fromType, toType) =>
    set((state) => {
      if (fromType === toType) {
        return state
      }

      const sections = [...state.document.sections]
      const fromIndex = sections.findIndex((section) => section.type === fromType)
      const toIndex = sections.findIndex((section) => section.type === toType)

      if (fromIndex === -1 || toIndex === -1) {
        return state
      }

      const [movedSection] = sections.splice(fromIndex, 1)
      sections.splice(toIndex, 0, movedSection)

      return {
        document: touch({
          ...state.document,
          sections,
        }),
      }
    }),
  markSaving: () => set({ saveState: 'saving' }),
  markSaved: (timestamp) => set({ saveState: 'saved', lastSavedAt: timestamp }),
  markSaveError: () => set({ saveState: 'error' }),
}))
