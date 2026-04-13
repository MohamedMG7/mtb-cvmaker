import { getSection } from '../../../lib/schema/cv'
import { useCvStore } from '../store/useCvStore'
import { appendSuggestionLine, editorHints, editorSuggestions } from './editorSuggestions'
import { SectionCard } from './SectionCard'
import { AddItemButton, SuggestionChips, SuggestionInput } from './SmartField'

export const CustomSectionEditor = () => {
  const document = useCvStore((state) => state.document)
  const section = getSection(document, 'custom')
  const updateSectionTitle = useCvStore((state) => state.updateSectionTitle)
  const updateCustomItem = useCvStore((state) => state.updateCustomItem)
  const addCustomItem = useCvStore((state) => state.addCustomItem)
  const removeCustomItem = useCvStore((state) => state.removeCustomItem)
  const toggleSectionVisibility = useCvStore((state) => state.toggleSectionVisibility)

  return (
    <SectionCard
      title="Custom Section"
      description="Use this for domain-specific categories like leadership, teaching, or speaking."
      action={
        <div className="action-row">
          <button className="ghost-button" onClick={() => toggleSectionVisibility('custom')} type="button">
            {section.visible ? 'Hide section' : 'Show section'}
          </button>
        </div>
      }
    >
      <label className="field">
        <span>Section title</span>
        <SuggestionInput
          placeholder={editorHints.sectionTitle}
          suggestions={editorSuggestions.customTitles}
          value={section.title}
          onChange={(event) => updateSectionTitle('custom', event.target.value)}
        />
      </label>
      <div className="stack-list">
        {section.items.map((item) => (
          <article key={item.id} className="item-card">
            <div className="item-card__header">
              <strong>{item.title || 'Custom entry'}</strong>
              <button className="ghost-button" onClick={() => removeCustomItem(item.id)} type="button">
                Remove
              </button>
            </div>
            <div className="field-grid field-grid--two">
              <label className="field">
                <span>Title</span>
                <SuggestionInput
                  placeholder={editorHints.customTitle}
                  suggestions={editorSuggestions.customTitles}
                  value={item.title}
                  onChange={(event) => updateCustomItem(item.id, 'title', event.target.value)}
                />
              </label>
              <label className="field">
                <span>Subtitle</span>
                <SuggestionInput
                  placeholder={editorHints.customSubtitle}
                  value={item.subtitle}
                  onChange={(event) => updateCustomItem(item.id, 'subtitle', event.target.value)}
                />
              </label>
            </div>
            <label className="field field--stacked">
              <span>Details</span>
              <textarea
                placeholder={editorHints.textarea}
                rows={3}
                value={item.details.join('\n')}
                onChange={(event) =>
                  updateCustomItem(
                    item.id,
                    'details',
                    event.target.value.split('\n'),
                  )
                }
              />
            </label>
            <SuggestionChips
              label="Custom section prompts"
              suggestions={editorSuggestions.detailLines}
              onSelect={(suggestion) => updateCustomItem(item.id, 'details', appendSuggestionLine(item.details, suggestion))}
            />
          </article>
        ))}
      </div>
      <AddItemButton label="Add custom item" onClick={addCustomItem} />
    </SectionCard>
  )
}
