import { getSection } from '../../../lib/schema/cv'
import { useCvStore } from '../store/useCvStore'
import { appendSuggestionLine, editorHints, editorSuggestions } from './editorSuggestions'
import { SectionCard } from './SectionCard'
import { AddItemButton, SuggestionChips, SuggestionInput } from './SmartField'

export const ExperienceEditor = () => {
  const document = useCvStore((state) => state.document)
  const experience = getSection(document, 'experience')
  const updateExperience = useCvStore((state) => state.updateExperience)
  const addExperience = useCvStore((state) => state.addExperience)
  const removeExperience = useCvStore((state) => state.removeExperience)
  const toggleSectionVisibility = useCvStore((state) => state.toggleSectionVisibility)

  return (
    <SectionCard
      title="Experience"
      description="Add roles, dates, and concise impact bullets."
      action={
        <div className="action-row">
          <button
            className="ghost-button"
            onClick={() => toggleSectionVisibility('experience')}
            type="button"
          >
            {experience.visible ? 'Hide section' : 'Show section'}
          </button>
        </div>
      }
    >
      <div className="stack-list">
        {experience.items.map((item) => (
          <article key={item.id} className="item-card">
            <div className="item-card__header">
              <strong>{item.role || 'Untitled role'}</strong>
              <button className="ghost-button" onClick={() => removeExperience(item.id)} type="button">
                Remove
              </button>
            </div>
            <div className="field-grid field-grid--two">
              <label className="field">
                <span>Role</span>
                <SuggestionInput
                  placeholder={editorHints.role}
                  suggestions={editorSuggestions.roles}
                  value={item.role}
                  onChange={(event) => updateExperience(item.id, 'role', event.target.value)}
                />
              </label>
              <label className="field">
                <span>Organization</span>
                <SuggestionInput
                  placeholder={editorHints.organization}
                  suggestions={editorSuggestions.organizations}
                  value={item.organization}
                  onChange={(event) => updateExperience(item.id, 'organization', event.target.value)}
                />
              </label>
              <label className="field">
                <span>Location</span>
                <SuggestionInput
                  placeholder={editorHints.locationShort}
                  value={item.location}
                  onChange={(event) => updateExperience(item.id, 'location', event.target.value)}
                />
              </label>
              <label className="field checkbox-field">
                <input
                  checked={item.current}
                  onChange={(event) => updateExperience(item.id, 'current', event.target.checked)}
                  type="checkbox"
                />
                <span>Current role</span>
              </label>
              <label className="field">
                <span>Start date</span>
                <SuggestionInput
                  placeholder={editorHints.date}
                  suggestions={editorSuggestions.dates}
                  value={item.startDate}
                  onChange={(event) => updateExperience(item.id, 'startDate', event.target.value)}
                />
              </label>
              <label className="field">
                <span>End date</span>
                <SuggestionInput
                  disabled={item.current}
                  placeholder="Present or 2026"
                  suggestions={editorSuggestions.dates}
                  value={item.endDate}
                  onChange={(event) => updateExperience(item.id, 'endDate', event.target.value)}
                />
              </label>
            </div>
            <label className="field field--stacked">
              <span>Highlights</span>
              <textarea
                placeholder={editorHints.textarea}
                rows={4}
                value={item.highlights.join('\n')}
                onChange={(event) =>
                  updateExperience(
                    item.id,
                    'highlights',
                    event.target.value.split('\n'),
                  )
                }
              />
            </label>
            <SuggestionChips
              label="Impact bullet starters"
              suggestions={editorSuggestions.highlightLines}
              onSelect={(suggestion) => updateExperience(item.id, 'highlights', appendSuggestionLine(item.highlights, suggestion))}
            />
          </article>
        ))}
      </div>
      <AddItemButton label="Add experience role" onClick={addExperience} />
    </SectionCard>
  )
}
