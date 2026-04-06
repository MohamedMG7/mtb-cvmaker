import { getSection } from '../../../lib/schema/cv'
import { useCvStore } from '../store/useCvStore'
import { SectionCard } from './SectionCard'

export const LanguagesEditor = () => {
  const document = useCvStore((state) => state.document)
  const section = getSection(document, 'languages')
  const updateSectionTitle = useCvStore((state) => state.updateSectionTitle)
  const updateLanguage = useCvStore((state) => state.updateLanguage)
  const addLanguage = useCvStore((state) => state.addLanguage)
  const removeLanguage = useCvStore((state) => state.removeLanguage)
  const toggleSectionVisibility = useCvStore((state) => state.toggleSectionVisibility)

  return (
    <SectionCard
      title="Languages"
      description="List spoken languages and your level of fluency."
      action={
        <div className="action-row">
          <button className="ghost-button" onClick={() => toggleSectionVisibility('languages')} type="button">
            {section.visible ? 'Hide section' : 'Show section'}
          </button>
          <button className="primary-button" onClick={addLanguage} type="button">
            Add language
          </button>
        </div>
      }
    >
      <label className="field">
        <span>Section title</span>
        <input value={section.title} onChange={(event) => updateSectionTitle('languages', event.target.value)} />
      </label>
      <div className="stack-list">
        {section.items.map((item) => (
          <article key={item.id} className="item-card">
            <div className="item-card__header">
              <strong>{item.name || 'Untitled language'}</strong>
              <button className="ghost-button" onClick={() => removeLanguage(item.id)} type="button">
                Remove
              </button>
            </div>
            <div className="field-grid field-grid--two">
              <label className="field">
                <span>Language</span>
                <input value={item.name} onChange={(event) => updateLanguage(item.id, 'name', event.target.value)} />
              </label>
              <label className="field">
                <span>Level</span>
                <input value={item.level} onChange={(event) => updateLanguage(item.id, 'level', event.target.value)} />
              </label>
            </div>
          </article>
        ))}
      </div>
    </SectionCard>
  )
}
