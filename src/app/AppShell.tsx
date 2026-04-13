import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from 'react'
import { createSampleDocument, ensureDocument } from '../lib/schema/cv'
import { useCvStore } from '../features/editor/store/useCvStore'
import { useDraftPersistence } from '../features/persistence/useDraftPersistence'
import { ProfileEditor } from '../features/editor/components/ProfileEditor'
import { ThemeEditor } from '../features/editor/components/ThemeEditor'
import { ExperienceEditor } from '../features/editor/components/ExperienceEditor'
import { ProjectsEditor } from '../features/editor/components/ProjectsEditor'
import { EducationEditor } from '../features/editor/components/EducationEditor'
import { SkillsEditor } from '../features/editor/components/SkillsEditor'
import { LinksEditor } from '../features/editor/components/LinksEditor'
import { CertificationsEditor } from '../features/editor/components/CertificationsEditor'
import { AwardsEditor } from '../features/editor/components/AwardsEditor'
import { VolunteerEditor } from '../features/editor/components/VolunteerEditor'
import { PublicationsEditor } from '../features/editor/components/PublicationsEditor'
import { LanguagesEditor } from '../features/editor/components/LanguagesEditor'
import { InterestsEditor } from '../features/editor/components/InterestsEditor'
import { ReferencesEditor } from '../features/editor/components/ReferencesEditor'
import { CustomSectionEditor } from '../features/editor/components/CustomSectionEditor'
import { PagedPreview } from '../features/preview/components/PagedPreview'

type StepId = 'basics' | 'career' | 'strengths' | 'proof' | 'extras'

type StepDefinition = {
  id: StepId
  label: string
  title: string
  description: string
  helper: string
  cards: ReactNode[]
}

const stepOrder: StepId[] = ['basics', 'career', 'strengths', 'proof', 'extras']

const createStepRefMap = (): Record<StepId, HTMLElement | null> => ({
  basics: null,
  career: null,
  strengths: null,
  proof: null,
  extras: null,
})

const formatSaveState = (saveState: string, lastSavedAt: string | null) => {
  if (saveState === 'saving') {
    return 'Autosaving...'
  }

  if (saveState === 'error') {
    return 'Save failed'
  }

  if (lastSavedAt) {
    return `Saved ${new Date(lastSavedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  }

  return 'Draft not saved yet'
}

export const App = () => {
  useDraftPersistence()

  const document = useCvStore((state) => state.document)
  const isReady = useCvStore((state) => state.isReady)
  const saveState = useCvStore((state) => state.saveState)
  const lastSavedAt = useCvStore((state) => state.lastSavedAt)
  const replaceDocument = useCvStore((state) => state.replaceDocument)
  const resetDocument = useCvStore((state) => state.resetDocument)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const exportMenuRef = useRef<HTMLDetailsElement>(null)
  const jsonMenuRef = useRef<HTMLDetailsElement>(null)
  const stepRefs = useRef<Record<StepId, HTMLElement | null>>(createStepRefMap())
  const [activeStep, setActiveStep] = useState<StepId>('basics')
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const saveLabel = useMemo(
    () => formatSaveState(saveState, lastSavedAt),
    [lastSavedAt, saveState],
  )

  const steps: StepDefinition[] = [
    {
      id: 'basics',
      label: 'Basics',
      title: 'Start with the essentials',
      description: 'Set the template, personal details, and the summary recruiters read first.',
      helper: 'Profile and presentation',
      cards: [<ThemeEditor key="theme" />, <ProfileEditor key="profile" />],
    },
    {
      id: 'career',
      label: 'Career',
      title: 'Shape your core story',
      description: 'Add your work, projects, and education in a cleaner, less overwhelming pass.',
      helper: 'Experience, projects, education',
      cards: [
        <ExperienceEditor key="experience" />,
        <ProjectsEditor key="projects" />,
        <EducationEditor key="education" />,
      ],
    },
    {
      id: 'strengths',
      label: 'Strengths',
      title: 'Show what supports the application',
      description: 'Keep skills, links, languages, and interests neatly grouped instead of scattered.',
      helper: 'Skills, links, languages',
      cards: [
        <SkillsEditor key="skills" />,
        <LinksEditor key="links" />,
        <LanguagesEditor key="languages" />,
        <InterestsEditor key="interests" />,
      ],
    },
    {
      id: 'proof',
      label: 'Proof',
      title: 'Add credibility only where it helps',
      description: 'Use certifications, awards, publications, and references as supporting proof.',
      helper: 'Credentials and proof',
      cards: [
        <CertificationsEditor key="certifications" />,
        <AwardsEditor key="awards" />,
        <PublicationsEditor key="publications" />,
        <ReferencesEditor key="references" />,
      ],
    },
    {
      id: 'extras',
      label: 'Extras',
      title: 'Finish with optional sections',
      description: 'Volunteer work and custom sections are here when the role needs a little more context.',
      helper: 'Volunteer and custom content',
      cards: [<VolunteerEditor key="volunteer" />, <CustomSectionEditor key="custom" />],
    },
  ]

  const activeStepIndex = stepOrder.indexOf(activeStep)
  const activeStepDetails = steps[activeStepIndex] ?? steps[0]
  const visibleSectionsCount = document.sections.filter((section) => section.visible).length
  const progressPercent = `${((activeStepIndex + 1) / steps.length) * 100}%`

  const closeExportMenu = useCallback(() => {
    if (exportMenuRef.current) {
      exportMenuRef.current.open = false
    }
  }, [])

  const closeJsonMenu = useCallback(() => {
    if (jsonMenuRef.current) {
      jsonMenuRef.current.open = false
    }
  }, [])

  const handleExportJson = () => {
    closeJsonMenu()

    const payload = JSON.stringify(document, null, 2)
    const blob = new Blob([payload], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = window.document.createElement('a')
    link.href = url
    link.download = `${document.metadata.title.replace(/\s+/g, '-').toLowerCase() || 'cv'}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleExportMenuToggle = () => {
    if (exportMenuRef.current?.open) {
      closeJsonMenu()
    }
  }

  const handleJsonMenuToggle = () => {
    if (jsonMenuRef.current?.open) {
      closeExportMenu()
    }
  }

  const handleExportPdf = async () => {
    closeExportMenu()

    try {
      const { exportPdf } = await import('../features/export/pdf')
      await exportPdf(document)
    } catch {
      window.alert('Could not export PDF. Please try again.')
    }
  }

  const handleExportDocx = async () => {
    closeExportMenu()

    try {
      const { exportCambridgeDocx } = await import('../features/export/docx')
      await exportCambridgeDocx(document)
    } catch {
      window.alert('Could not export DOCX. Please try again.')
    }
  }

  const handleImportClick = () => {
    closeJsonMenu()
    fileInputRef.current?.click()
  }

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    try {
      const contents = await file.text()
      const parsed = ensureDocument(JSON.parse(contents))
      replaceDocument(parsed)
    } catch {
      window.alert('Could not import this file. Please use a valid cvMaker JSON export.')
    } finally {
      event.target.value = ''
    }
  }

  const scrollToStep = useCallback((stepId: StepId) => {
    setActiveStep(stepId)
    stepRefs.current[stepId]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  useEffect(() => {
    const elements = stepOrder
      .map((stepId) => stepRefs.current[stepId])
      .filter((element): element is HTMLElement => element !== null)

    if (elements.length === 0) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)

        const currentEntry = visibleEntries[0]
        const stepId = currentEntry?.target.getAttribute('data-step-id') as StepId | null

        if (stepId) {
          setActiveStep(stepId)
        }
      },
      {
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0.15, 0.35, 0.6],
      },
    )

    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isPreviewOpen) {
      return
    }

    closeExportMenu()
    closeJsonMenu()

    const previousOverflow = window.document.body.style.overflow
    window.document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsPreviewOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [closeExportMenu, closeJsonMenu, isPreviewOpen])

  if (!isReady) {
    return (
      <main className="loading-screen">
        <div className="loading-card">
          <div className="brand-lockup brand-lockup--loading">
            <img alt="MTB-cvMaker logo" className="brand-icon brand-icon--large" src="/mtb-cvmaker-icon.png" />
            <p className="eyebrow">MTB-cvMaker</p>
          </div>
          <h1>Preparing your workspace</h1>
          <p>Loading the latest draft from local storage.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <input
        accept="application/json"
        className="visually-hidden"
        onChange={handleImport}
        ref={fileInputRef}
        type="file"
      />

      <header className="hero-band">
        <div className="hero-band__content">
          <div className="brand-lockup">
            <img alt="MTB-cvMaker logo" className="brand-icon" src="/mtb-cvmaker-icon.png" />
            <div>
              <p className="eyebrow">Guided CV builder</p>
              <h1>{document.metadata.title || 'My CV'}</h1>
            </div>
          </div>
          <p className="hero-band__copy">
            A cleaner writing flow with step guidance, calmer forms, and preview only when you need it.
          </p>
        </div>
        <div className="toolbar">
          <span className="status-pill">{saveLabel}</span>
          <button
            aria-pressed={isPreviewOpen}
            className="ghost-button toolbar__preview-button"
            onClick={() => setIsPreviewOpen((current) => !current)}
            type="button"
          >
            <span className={`button-icon button-icon--toggle ${isPreviewOpen ? 'is-active' : ''}`} aria-hidden="true" />
            Preview
          </button>
          <button className="ghost-button" onClick={() => resetDocument(createSampleDocument())} type="button">
            Sample
          </button>
          <button className="ghost-button" onClick={() => resetDocument()} type="button">
            New
          </button>
          <details className="export-menu" onToggle={handleJsonMenuToggle} ref={jsonMenuRef}>
            <summary className="ghost-button export-menu__trigger">JSON</summary>
            <div className="export-menu__content">
              <button className="export-menu__item" onClick={handleExportJson} type="button">
                Export
              </button>
              <button className="export-menu__item" onClick={handleImportClick} type="button">
                Import
              </button>
            </div>
          </details>
          <details className="export-menu" onToggle={handleExportMenuToggle} ref={exportMenuRef}>
            <summary className="primary-button export-menu__trigger">Export</summary>
            <div className="export-menu__content">
              <button className="export-menu__item" onClick={handleExportPdf} type="button">
                PDF
              </button>
              <button className="export-menu__item" onClick={handleExportDocx} type="button">
                DOCX
              </button>
            </div>
          </details>
        </div>
      </header>

      <div className="workspace-shell">
        <aside className="steps-sidebar">
          <div className="steps-sidebar__intro panel-card">
            <p className="eyebrow">Resume flow</p>
            <h2>Build it in smaller passes</h2>
            <p className="steps-sidebar__summary">
              Step {activeStepIndex + 1} of {steps.length}. {visibleSectionsCount} sections are currently visible.
            </p>
            <div className="steps-progress" aria-hidden="true">
              <span className="steps-progress__bar" style={{ width: progressPercent }} />
            </div>
          </div>

          <nav aria-label="CV editor steps" className="steps-nav panel-card">
            {steps.map((step, index) => {
              const isActive = step.id === activeStep

              return (
                <button
                  key={step.id}
                  className={`steps-nav__item ${isActive ? 'is-active' : ''}`}
                  onClick={() => scrollToStep(step.id)}
                  type="button"
                >
                  <span className="steps-nav__index">{index + 1}</span>
                  <span className="steps-nav__body">
                    <strong>{step.label}</strong>
                    <span>{step.helper}</span>
                  </span>
                </button>
              )
            })}
          </nav>

          <div className="steps-sidebar__note panel-card">
            <p className="eyebrow">Current focus</p>
            <h3>{activeStepDetails.label}</h3>
            <p>{activeStepDetails.description}</p>
          </div>
        </aside>

        <section className="editor-stage">
          {steps.map((step, index) => {
            const previousStep = steps[index - 1]
            const nextStep = steps[index + 1]

            return (
              <section
                key={step.id}
                className={`step-section ${step.id === activeStep ? 'is-active' : ''}`}
                data-step-id={step.id}
                ref={(node) => {
                  stepRefs.current[step.id] = node
                }}
              >
                <div className="step-section__header">
                  <div>
                    <p className="step-section__eyebrow">Step {index + 1}</p>
                    <h2>{step.title}</h2>
                    <p>{step.description}</p>
                  </div>
                </div>

                <div className="step-section__cards">{step.cards}</div>

                <div className="step-section__footer">
                  {previousStep ? (
                    <button className="ghost-button" onClick={() => scrollToStep(previousStep.id)} type="button">
                      Previous step
                    </button>
                  ) : (
                    <span />
                  )}
                  {nextStep ? (
                    <button className="primary-button" onClick={() => scrollToStep(nextStep.id)} type="button">
                      Next step
                    </button>
                  ) : (
                    <button className="primary-button" onClick={() => scrollToStep('basics')} type="button">
                      Review from top
                    </button>
                  )}
                </div>
              </section>
            )
          })}
        </section>
      </div>

      <div className={`preview-drawer ${isPreviewOpen ? 'is-open' : ''}`} aria-hidden={!isPreviewOpen}>
        <button
          aria-label="Close preview"
          className="preview-drawer__backdrop"
          onClick={() => setIsPreviewOpen(false)}
          type="button"
        />
        <aside aria-label="Resume preview" className="preview-drawer__panel" role="dialog">
          <div className="preview-drawer__header">
            <div>
              <p className="eyebrow">Preview</p>
              <h2>{document.metadata.title || 'My CV'}</h2>
              <p>Cambridge is the default starting point, while exports still follow the active template setting.</p>
            </div>
            <button className="ghost-button" onClick={() => setIsPreviewOpen(false)} type="button">
              Close
            </button>
          </div>
          <div className={`preview-stage preview-stage--${document.theme.density}`}>
            <PagedPreview document={document} />
          </div>
        </aside>
      </div>
    </main>
  )
}
