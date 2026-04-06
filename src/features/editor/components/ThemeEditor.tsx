import { densityOptions, templateIds } from '../../../lib/schema/cv'
import { useCvStore } from '../store/useCvStore'
import { SectionCard } from './SectionCard'

const fontOptions = ['Literata', 'Spectral', 'Alegreya Sans']
const templateLabels: Record<string, string> = {
  minimal: 'Minimal',
  atlas: 'Atlas',
  cambridge: 'Cambridge',
}

const extendedFontOptions = [...fontOptions, 'Calibri']

export const ThemeEditor = () => {
  const theme = useCvStore((state) => state.document.theme)
  const editorMode = useCvStore((state) => state.editorMode)
  const setEditorMode = useCvStore((state) => state.setEditorMode)
  const updateThemeField = useCvStore((state) => state.updateThemeField)

  return (
    <SectionCard
      title="Presentation"
      description="Choose the overall visual direction and editing mode."
      action={
        <div className="segmented-control">
          {(['simple', 'advanced'] as const).map((mode) => (
            <button
              key={mode}
              className={mode === editorMode ? 'is-active' : ''}
              onClick={() => setEditorMode(mode)}
              type="button"
            >
              {mode}
            </button>
          ))}
        </div>
      }
    >
      <div className="field-grid">
        <label className="field">
          <span>Template</span>
          <select
            value={theme.templateId}
            onChange={(event) => updateThemeField('templateId', event.target.value)}
          >
            {templateIds.map((templateId) => (
              <option key={templateId} value={templateId}>
                {templateLabels[templateId] ?? templateId}
              </option>
            ))}
          </select>
        </label>
      </div>
      {editorMode === 'advanced' ? (
        <div className="field-grid field-grid--three">
          <label className="field">
            <span>Font family</span>
            <select
              value={theme.fontFamily}
              onChange={(event) => updateThemeField('fontFamily', event.target.value)}
            >
              {extendedFontOptions.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Font color</span>
            <input
              type="color"
              value={theme.textColor}
              onChange={(event) => updateThemeField('textColor', event.target.value)}
            />
          </label>
          <label className="field">
            <span>Density</span>
            <select
              value={theme.density}
              onChange={(event) => updateThemeField('density', event.target.value)}
            >
              {densityOptions.map((density) => (
                <option key={density} value={density}>
                  {density}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : null}
    </SectionCard>
  )
}
