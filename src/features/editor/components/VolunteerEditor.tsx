import { getSection } from '../../../lib/schema/cv'
import { useCvStore } from '../store/useCvStore'
import { SectionCard } from './SectionCard'

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
          <button className="primary-button" onClick={addVolunteer} type="button">
            Add role
          </button>
        </div>
      }
    >
      <label className="field">
        <span>Section title</span>
        <input value={section.title} onChange={(event) => updateSectionTitle('volunteer', event.target.value)} />
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
                <input value={item.role} onChange={(event) => updateVolunteer(item.id, 'role', event.target.value)} />
              </label>
              <label className="field">
                <span>Organization</span>
                <input
                  value={item.organization}
                  onChange={(event) => updateVolunteer(item.id, 'organization', event.target.value)}
                />
              </label>
              <label className="field">
                <span>Location</span>
                <input value={item.location} onChange={(event) => updateVolunteer(item.id, 'location', event.target.value)} />
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
                <input value={item.startDate} onChange={(event) => updateVolunteer(item.id, 'startDate', event.target.value)} />
              </label>
              <label className="field">
                <span>End date</span>
                <input
                  disabled={item.current}
                  value={item.endDate}
                  onChange={(event) => updateVolunteer(item.id, 'endDate', event.target.value)}
                />
              </label>
            </div>
            <label className="field field--stacked">
              <span>Highlights</span>
              <textarea
                rows={4}
                value={item.highlights.join('\n')}
                onChange={(event) =>
                  updateVolunteer(
                    item.id,
                    'highlights',
                    event.target.value.split('\n').map((line) => line.trim()).filter(Boolean),
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
