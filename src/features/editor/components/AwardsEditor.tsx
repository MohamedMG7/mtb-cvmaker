import { getSection } from '../../../lib/schema/cv'
import { useCvStore } from '../store/useCvStore'
import { appendSuggestionLine, editorHints, editorSuggestions } from './editorSuggestions'
import { SectionCard } from './SectionCard'
import { AddItemButton, SuggestionChips, SuggestionInput } from './SmartField'

export const AwardsEditor = () => {
  const document = useCvStore((state) => state.document)
  const section = getSection(document, 'awards')
  const updateSectionTitle = useCvStore((state) => state.updateSectionTitle)
  const updateAward = useCvStore((state) => state.updateAward)
  const addAward = useCvStore((state) => state.addAward)
  const removeAward = useCvStore((state) => state.removeAward)
  const toggleSectionVisibility = useCvStore((state) => state.toggleSectionVisibility)

  return (
    <SectionCard
      title="Awards"
      description="Capture scholarships, honors, or recognition relevant to the role."
      action={
        <div className="action-row">
          <button className="ghost-button" onClick={() => toggleSectionVisibility('awards')} type="button">
            {section.visible ? 'Hide section' : 'Show section'}
          </button>
        </div>
      }
    >
      <label className="field">
        <span>Section title</span>
        <SuggestionInput
          placeholder={editorHints.sectionTitle}
          suggestions={['Awards', 'Honors & Awards']}
          value={section.title}
          onChange={(event) => updateSectionTitle('awards', event.target.value)}
        />
      </label>
      <div className="stack-list">
        {section.items.map((item) => (
          <article key={item.id} className="item-card">
            <div className="item-card__header">
              <strong>{item.title || 'Untitled award'}</strong>
              <button className="ghost-button" onClick={() => removeAward(item.id)} type="button">
                Remove
              </button>
            </div>
            <div className="field-grid field-grid--two">
              <label className="field">
                <span>Award</span>
                <SuggestionInput
                  placeholder="Employee of the Year"
                  value={item.title}
                  onChange={(event) => updateAward(item.id, 'title', event.target.value)}
                />
              </label>
              <label className="field">
                <span>Issuer</span>
                <SuggestionInput
                  placeholder="Your company or institution"
                  value={item.issuer}
                  onChange={(event) => updateAward(item.id, 'issuer', event.target.value)}
                />
              </label>
              <label className="field">
                <span>Date</span>
                <SuggestionInput
                  placeholder={editorHints.date}
                  suggestions={editorSuggestions.dates}
                  value={item.date}
                  onChange={(event) => updateAward(item.id, 'date', event.target.value)}
                />
              </label>
              <label className="field">
                <span>URL</span>
                <SuggestionInput
                  placeholder={editorHints.projectUrl}
                  value={item.url}
                  onChange={(event) => updateAward(item.id, 'url', event.target.value)}
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
                  updateAward(
                    item.id,
                    'details',
                    event.target.value.split('\n'),
                  )
                }
              />
            </label>
            <SuggestionChips
              label="Award detail prompts"
              suggestions={editorSuggestions.detailLines}
              onSelect={(suggestion) => updateAward(item.id, 'details', appendSuggestionLine(item.details, suggestion))}
            />
          </article>
        ))}
      </div>
      <AddItemButton label="Add award" onClick={addAward} />
    </SectionCard>
  )
}
