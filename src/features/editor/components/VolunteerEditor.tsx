import { getSection } from '../../../lib/schema/cv'
import { useCvStore } from '../store/useCvStore'
import { appendSuggestionLine, editorHints, editorSuggestions } from './editorSuggestions'
import { SectionCard } from './SectionCard'
import { AddItemButton, SuggestionChips, SuggestionInput } from './SmartField'

export const VolunteerEditor = () => {
  const document = useCvStore((state) => state.document)
  const section = getSection(document, 'volunteer')
  const updateSectionTitle = useCvStore((state) => state.updateSectionTitle)
  const updateVolunteer = useCvStore((state) => state.updateVolunteer)
  const addVolunteer = useCvStore((state) => state.addVolunteer)
  const removeVolunteer = useCvStore((state) => state.removeVolunteer)
  const toggleSectionVisibility = useCvStore((state) => state.toggleSectionVisibility)

  return (
    <SectionCard
      title="Volunteer"
      description="Add service, mentoring, or community involvement that strengthens your profile."
      action={
        <div className="action-row">
          <button className="ghost-button" onClick={() => toggleSectionVisibility('volunteer')} type="button">
            {section.visible ? 'Hide section' : 'Show section'}
          </button>
        </div>
      }
    >
      <label className="field">
        <span>Section title</span>
        <SuggestionInput
          placeholder={editorHints.sectionTitle}
          suggestions={['Volunteer Experience', 'Community Work']}
          value={section.title}
          onChange={(event) => updateSectionTitle('volunteer', event.target.value)}
        />
      </label>
      <div className="stack-list">
        {section.items.map((item) => (
          <article key={item.id} className="item-card">
            <div className="item-card__header">
              <strong>{item.role || 'Untitled volunteer role'}</strong>
              <button className="ghost-button" onClick={() => removeVolunteer(item.id)} type="button">
                Remove
              </button>
            </div>
            <div className="field-grid field-grid--two">
              <label className="field">
                <span>Role</span>
                <SuggestionInput
                  placeholder="Mentor or Community Lead"
                  suggestions={['Mentor', 'Volunteer Coordinator', 'Community Lead', 'Teaching Assistant']}
                  value={item.role}
                  onChange={(event) => updateVolunteer(item.id, 'role', event.target.value)}
                />
              </label>
              <label className="field">
                <span>Organization</span>
                <SuggestionInput
                  placeholder={editorHints.organization}
                  value={item.organization}
                  onChange={(event) => updateVolunteer(item.id, 'organization', event.target.value)}
                />
              </label>
              <label className="field">
                <span>Location</span>
                <SuggestionInput
                  placeholder={editorHints.locationShort}
                  value={item.location}
                  onChange={(event) => updateVolunteer(item.id, 'location', event.target.value)}
                />
              </label>
              <label className="field checkbox-field">
                <input
                  checked={item.current}
                  onChange={(event) => updateVolunteer(item.id, 'current', event.target.checked)}
                  type="checkbox"
                />
                <span>Current</span>
              </label>
              <label className="field">
                <span>Start date</span>
                <SuggestionInput
                  placeholder={editorHints.date}
                  suggestions={editorSuggestions.dates}
                  value={item.startDate}
                  onChange={(event) => updateVolunteer(item.id, 'startDate', event.target.value)}
                />
              </label>
              <label className="field">
                <span>End date</span>
                <SuggestionInput
                  disabled={item.current}
                  placeholder="Present or 2026"
                  suggestions={editorSuggestions.dates}
                  value={item.endDate}
                  onChange={(event) => updateVolunteer(item.id, 'endDate', event.target.value)}
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
                  updateVolunteer(
                    item.id,
                    'highlights',
                    event.target.value.split('\n'),
                  )
                }
              />
            </label>
            <SuggestionChips
              label="Volunteer impact starters"
              suggestions={editorSuggestions.highlightLines}
              onSelect={(suggestion) => updateVolunteer(item.id, 'highlights', appendSuggestionLine(item.highlights, suggestion))}
            />
          </article>
        ))}
      </div>
      <AddItemButton label="Add volunteer role" onClick={addVolunteer} />
    </SectionCard>
  )
}
