import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type ComponentType } from 'react'
import { createSampleDocument, ensureDocument, type CvDocument } from '../lib/schema/cv'
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
import { PagedPreview } from '../features/preview/components/CvPreview'

type SectionType = CvDocument['sections'][number]['type']

const sectionEditorMap: Record<SectionType, ComponentType> = {
  experience: ExperienceEditor,
  projects: ProjectsEditor,
  education: EducationEditor,
  skills: SkillsEditor,
  certifications: CertificationsEditor,
  awards: AwardsEditor,
  volunteer: VolunteerEditor,
  publications: PublicationsEditor,
  languages: LanguagesEditor,
  interests: InterestsEditor,
  links: LinksEditor,
  references: ReferencesEditor,
  custom: CustomSectionEditor,
}

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
  const reorderSections = useCvStore((state) => state.reorderSections)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const exportMenuRef = useRef<HTMLDetailsElement>(null)
  const jsonMenuRef = useRef<HTMLDetailsElement>(null)
  const sectionListRef = useRef<HTMLDivElement>(null)
  const editorPanelRef = useRef<HTMLElement>(null)
  const [draggingSection, setDraggingSection] = useState<SectionType | null>(null)
  const [dragTargetIndex, setDragTargetIndex] = useState<number | null>(null)
  const dragStartY = useRef(0)
  const dragOffsetY = useRef(0)
  const dragElRef = useRef<HTMLDivElement | null>(null)
  const autoScrollRaf = useRef(0)
  const pointerClientY = useRef(0)

  const saveLabel = useMemo(
    () => formatSaveState(saveState, lastSavedAt),
    [lastSavedAt, saveState],
  )

  const handleExportJson = () => {
    if (jsonMenuRef.current) {
      jsonMenuRef.current.open = false
    }

    const payload = JSON.stringify(document, null, 2)
    const blob = new Blob([payload], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = window.document.createElement('a')
    link.href = url
    link.download = `${document.metadata.title.replace(/\s+/g, '-').toLowerCase() || 'cv'}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const closeExportMenu = () => {
    if (exportMenuRef.current) {
      exportMenuRef.current.open = false
    }
  }

  const closeJsonMenu = () => {
    if (jsonMenuRef.current) {
      jsonMenuRef.current.open = false
    }
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
    try {
      closeExportMenu()
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

  const stopAutoScroll = useCallback(() => {
    if (autoScrollRaf.current) {
      cancelAnimationFrame(autoScrollRaf.current)
      autoScrollRaf.current = 0
    }
  }, [])

  const startAutoScroll = useCallback(() => {
    const EDGE_SIZE = 60 // px from top/bottom edge to trigger scroll
    const MAX_SPEED = 12 // px per frame at the very edge

    const tick = () => {
      const panel = editorPanelRef.current
      if (!panel || !draggingSection) return

      const rect = panel.getBoundingClientRect()
      const y = pointerClientY.current

      let speed = 0
      if (y < rect.top + EDGE_SIZE) {
        // Scrolling up — faster the closer to the edge
        const ratio = 1 - Math.max(0, y - rect.top) / EDGE_SIZE
        speed = -MAX_SPEED * ratio
      } else if (y > rect.bottom - EDGE_SIZE) {
        // Scrolling down
        const ratio = 1 - Math.max(0, rect.bottom - y) / EDGE_SIZE
        speed = MAX_SPEED * ratio
      }

      if (speed !== 0) {
        panel.scrollTop += speed
      }

      autoScrollRaf.current = requestAnimationFrame(tick)
    }

    stopAutoScroll()
    autoScrollRaf.current = requestAnimationFrame(tick)
  }, [draggingSection, stopAutoScroll])

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>, type: SectionType) => {
      // Only start drag from the grip handle
      const grip = (event.target as HTMLElement).closest('.editor-panel__section-grip')
      if (!grip) return

      event.preventDefault()
      const shell = event.currentTarget
      shell.setPointerCapture(event.pointerId)

      dragStartY.current = event.clientY
      dragOffsetY.current = 0
      pointerClientY.current = event.clientY
      dragElRef.current = shell
      setDraggingSection(type)

      const sections = document.sections
      const idx = sections.findIndex((s) => s.type === type)
      setDragTargetIndex(idx)
    },
    [document.sections],
  )

  // Start auto-scroll once draggingSection is set
  useEffect(() => {
    if (draggingSection) {
      startAutoScroll()
    } else {
      stopAutoScroll()
    }
    return stopAutoScroll
  }, [draggingSection, startAutoScroll, stopAutoScroll])

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingSection || !dragElRef.current || !sectionListRef.current) return

      pointerClientY.current = event.clientY
      const deltaY = event.clientY - dragStartY.current
      dragOffsetY.current = deltaY
      dragElRef.current.style.transform = `translateY(${deltaY}px)`
      dragElRef.current.style.zIndex = '100'

      // Find which section we're hovering over
      const shells = Array.from(
        sectionListRef.current.querySelectorAll<HTMLElement>('.editor-panel__section-shell'),
      )
      const dragIdx = document.sections.findIndex((s) => s.type === draggingSection)

      for (let i = 0; i < shells.length; i++) {
        if (i === dragIdx) continue
        const rect = shells[i].getBoundingClientRect()
        const midY = rect.top + rect.height / 2
        if (event.clientY >= rect.top && event.clientY <= rect.bottom) {
          // Determine if we should place before or after this element
          const targetIdx = event.clientY < midY ? i : i + 1
          setDragTargetIndex((prev) => (prev !== targetIdx ? targetIdx : prev))
          break
        }
      }
    },
    [draggingSection, document.sections],
  )

  const handlePointerUp = useCallback(() => {
    if (!draggingSection) return

    if (dragElRef.current) {
      dragElRef.current.style.transform = ''
      dragElRef.current.style.zIndex = ''
    }

    const dragIdx = document.sections.findIndex((s) => s.type === draggingSection)
    if (dragTargetIndex !== null && dragTargetIndex !== dragIdx && dragTargetIndex !== dragIdx + 1) {
      // Map target index to the section type at the drop position
      const adjustedIdx = dragTargetIndex > dragIdx ? dragTargetIndex - 1 : dragTargetIndex
      const targetType = document.sections[adjustedIdx]?.type
      if (targetType) {
        reorderSections(draggingSection, targetType)
      }
    }

    dragElRef.current = null
    setDraggingSection(null)
    setDragTargetIndex(null)
  }, [draggingSection, dragTargetIndex, document.sections, reorderSections])

  // Clean up on pointer cancel
  useEffect(() => {
    const handleCancel = () => {
      if (dragElRef.current) {
        dragElRef.current.style.transform = ''
        dragElRef.current.style.zIndex = ''
      }
      dragElRef.current = null
      setDraggingSection(null)
      setDragTargetIndex(null)
    }
    window.addEventListener('pointercancel', handleCancel)
    return () => window.removeEventListener('pointercancel', handleCancel)
  }, [])

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

      <div className="hero-band">
        <div className="brand-lockup">
          <img alt="MTB-cvMaker logo" className="brand-icon" src="/mtb-cvmaker-icon.png" />
          <h1>MTB-cvMaker</h1>
        </div>
        <div className="toolbar">
          <span className="status-pill">{saveLabel}</span>
          <button className="ghost-button" onClick={() => resetDocument(createSampleDocument())} type="button">
            Sample
          </button>
          <button className="ghost-button" onClick={() => resetDocument()} type="button">
            New
          </button>
          <details className="export-menu" onToggle={handleJsonMenuToggle} ref={jsonMenuRef}>
            <summary className="primary-button export-menu__trigger">JSON</summary>
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
      </div>

      <div className="workspace-grid">
        <section className="editor-panel" ref={editorPanelRef}>
          <ThemeEditor />
          <ProfileEditor />
          <div className="editor-panel__hint">
            Drag section cards to reorder your CV. Click a card header to collapse or expand it.
          </div>
          <div ref={sectionListRef}>
          {document.sections.map((section, index) => {
            const EditorComponent = sectionEditorMap[section.type]
            const isDragged = draggingSection === section.type
            const dragIdx = draggingSection ? document.sections.findIndex((s) => s.type === draggingSection) : -1
            const showDropBefore =
              draggingSection &&
              dragTargetIndex !== null &&
              dragTargetIndex === index &&
              index !== dragIdx &&
              index !== dragIdx + 1
            const showDropAfter =
              draggingSection &&
              dragTargetIndex !== null &&
              dragTargetIndex === document.sections.length &&
              index === document.sections.length - 1 &&
              dragIdx !== index

            return (
              <div
                key={section.type}
                className={`editor-panel__section-shell ${isDragged ? 'is-dragging' : ''}`}
                onPointerDown={(event) => handlePointerDown(event, section.type)}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
              >
                {showDropBefore ? <div className="drop-indicator drop-indicator--before" /> : null}
                <div className="editor-panel__section-grip" aria-hidden="true" title="Drag to reorder sections">
                  ⋮⋮
                </div>
                <EditorComponent />
                {showDropAfter ? <div className="drop-indicator drop-indicator--after" /> : null}
              </div>
            )
          })}
          </div>
        </section>
        <section className="preview-panel">
          <div className="preview-panel__header">
            <div>
              <h2>Preview</h2>
            </div>
          </div>
          <div className={`preview-stage preview-stage--${document.theme.density}`}>
            <PagedPreview document={document} />
          </div>
        </section>
      </div>
    </main>
  )
}
