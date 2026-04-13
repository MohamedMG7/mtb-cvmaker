import { getSection } from '../../../lib/schema/cv'
import { useCvStore } from '../store/useCvStore'
import { editorHints, editorSuggestions } from './editorSuggestions'
import { SectionCard } from './SectionCard'
import { AddItemButton, SuggestionInput } from './SmartField'

export const ReferencesEditor = () => {
  const document = useCvStore((state) => state.document)
  const section = getSection(document, 'references')
  const updateSectionTitle = useCvStore((state) => state.updateSectionTitle)
  const updateReference = useCvStore((state) => state.updateReference)
  const addReference = useCvStore((state) => state.addReference)
  const removeReference = useCvStore((state) => state.removeReference)
  const toggleSectionVisibility = useCvStore((state) => state.toggleSectionVisibility)

  return (
    <SectionCard
      title="References"
      description="Add references only when they meaningfully support the application."
      action={
        <div className="action-row">
          <button className="ghost-button" onClick={() => toggleSectionVisibility('references')} type="button">
            {section.visible ? 'Hide section' : 'Show section'}
          </button>
        </div>
      }
    >
      <label className="field">
        <span>Section title</span>
        <SuggestionInput
          placeholder={editorHints.sectionTitle}
          suggestions={['References', 'Professional References']}
          value={section.title}
          onChange={(event) => updateSectionTitle('references', event.target.value)}
        />
      </label>
      <div className="stack-list">
        {section.items.map((item) => (
          <article key={item.id} className="item-card">
            <div className="item-card__header">
              <strong>{item.name || 'Reference'}</strong>
              <button className="ghost-button" onClick={() => removeReference(item.id)} type="button">
                Remove
              </button>
            </div>
            <div className="field-grid field-grid--two">
              <label className="field">
                <span>Name</span>
                <SuggestionInput
                  placeholder={editorHints.referenceName}
                  value={item.name}
                  onChange={(event) => updateReference(item.id, 'name', event.target.value)}
                />
              </label>
              <label className="field">
                <span>Relationship</span>
                <SuggestionInput
                  placeholder={editorHints.relationship}
                  suggestions={editorSuggestions.relationships}
                  value={item.relationship}
                  onChange={(event) => updateReference(item.id, 'relationship', event.target.value)}
                />
              </label>
              <label className="field field--full">
                <span>Contact</span>
                <SuggestionInput
                  placeholder={editorHints.contact}
                  value={item.contact}
                  onChange={(event) => updateReference(item.id, 'contact', event.target.value)}
                />
              </label>
            </div>
            <label className="field field--stacked">
              <span>Details</span>
              <textarea
                placeholder="Optional note about how this person knows your work."
                rows={2}
                value={item.details}
                onChange={(event) => updateReference(item.id, 'details', event.target.value)}
              />
            </label>
          </article>
        ))}
      </div>
      <AddItemButton label="Add reference" onClick={addReference} />
    </SectionCard>
  )
}
