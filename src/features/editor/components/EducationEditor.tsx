import { getSection } from '../../../lib/schema/cv'
import { useCvStore } from '../store/useCvStore'
import { SectionCard } from './SectionCard'

export const EducationEditor = () => {
  const document = useCvStore((state) => state.document)
  const education = getSection(document, 'education')
  const updateEducation = useCvStore((state) => state.updateEducation)
  const addEducation = useCvStore((state) => state.addEducation)
  const removeEducation = useCvStore((state) => state.removeEducation)
  const toggleSectionVisibility = useCvStore((state) => state.toggleSectionVisibility)

  return (
    <SectionCard
      title="Education"
      description="Capture your degree, school, and standout details."
      action={
        <div className="action-row">
          <button
            className="ghost-button"
            onClick={() => toggleSectionVisibility('education')}
            type="button"
          >
            {education.visible ? 'Hide section' : 'Show section'}
          </button>
          <button className="primary-button" onClick={addEducation} type="button">
            Add education
          </button>
        </div>
      }
    >
      <div className="stack-list">
        {education.items.map((item) => (
          <article key={item.id} className="item-card">
            <div className="item-card__header">
              <strong>{item.degree || 'Untitled education'}</strong>
              <button className="ghost-button" onClick={() => removeEducation(item.id)} type="button">
                Remove
              </button>
            </div>
            <div className="field-grid field-grid--two">
              <label className="field">
                <span>Degree</span>
                <input
                  value={item.degree}
                  onChange={(event) => updateEducation(item.id, 'degree', event.target.value)}
                />
              </label>
              <label className="field">
                <span>School</span>
                <input
                  value={item.school}
                  onChange={(event) => updateEducation(item.id, 'school', event.target.value)}
                />
              </label>
              <label className="field">
                <span>Location</span>
                <input
                  value={item.location}
                  onChange={(event) => updateEducation(item.id, 'location', event.target.value)}
                />
              </label>
              <label className="field">
                <span>Start date</span>
                <input
                  value={item.startDate}
                  onChange={(event) => updateEducation(item.id, 'startDate', event.target.value)}
                />
              </label>
              <label className="field">
                <span>End date</span>
                <input
                  value={item.endDate}
                  onChange={(event) => updateEducation(item.id, 'endDate', event.target.value)}
                />
              </label>
            </div>
            <label className="field field--stacked">
              <span>Details</span>
              <textarea
                rows={3}
                value={item.details.join('\n')}
                onChange={(event) =>
                  updateEducation(
                    item.id,
                    'details',
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
