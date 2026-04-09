import { getSection } from '../../../lib/schema/cv'
import { useCvStore } from '../store/useCvStore'
import { SectionCard } from './SectionCard'

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
          <button className="primary-button" onClick={addExperience} type="button">
            Add role
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
                <input
                  value={item.role}
                  onChange={(event) => updateExperience(item.id, 'role', event.target.value)}
                />
              </label>
              <label className="field">
                <span>Organization</span>
                <input
                  value={item.organization}
                  onChange={(event) => updateExperience(item.id, 'organization', event.target.value)}
                />
              </label>
              <label className="field">
                <span>Location</span>
                <input
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
                <input
                  value={item.startDate}
                  onChange={(event) => updateExperience(item.id, 'startDate', event.target.value)}
                />
              </label>
              <label className="field">
                <span>End date</span>
                <input
                  disabled={item.current}
                  value={item.endDate}
                  onChange={(event) => updateExperience(item.id, 'endDate', event.target.value)}
                />
              </label>
            </div>
            <label className="field field--stacked">
              <span>Highlights</span>
              <textarea
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
          </article>
        ))}
      </div>
    </SectionCard>
  )
}
