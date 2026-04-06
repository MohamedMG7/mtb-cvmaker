import { getSection } from '../../../lib/schema/cv'
import { useCvStore } from '../store/useCvStore'
import { SectionCard } from './SectionCard'

export const ProjectsEditor = () => {
  const document = useCvStore((state) => state.document)
  const projects = getSection(document, 'projects')
  const updateProject = useCvStore((state) => state.updateProject)
  const addProject = useCvStore((state) => state.addProject)
  const removeProject = useCvStore((state) => state.removeProject)
  const toggleSectionVisibility = useCvStore((state) => state.toggleSectionVisibility)

  return (
    <SectionCard
      title="Projects"
      description="Highlight portfolio work, shipped products, or notable side projects."
      action={
        <div className="action-row">
          <button className="ghost-button" onClick={() => toggleSectionVisibility('projects')} type="button">
            {projects.visible ? 'Hide section' : 'Show section'}
          </button>
          <button className="primary-button" onClick={addProject} type="button">
            Add project
          </button>
        </div>
      }
    >
      <div className="stack-list">
        {projects.items.map((item) => (
          <article key={item.id} className="item-card">
            <div className="item-card__header">
              <strong>{item.name || 'Untitled project'}</strong>
              <button className="ghost-button" onClick={() => removeProject(item.id)} type="button">
                Remove
              </button>
            </div>
            <div className="field-grid field-grid--two">
              <label className="field">
                <span>Project name</span>
                <input
                  value={item.name}
                  onChange={(event) => updateProject(item.id, 'name', event.target.value)}
                />
              </label>
              <label className="field">
                <span>Project URL</span>
                <input
                  value={item.url}
                  onChange={(event) => updateProject(item.id, 'url', event.target.value)}
                />
              </label>
              <label className="field field--full">
                <span>Subtitle</span>
                <input
                  value={item.subtitle}
                  onChange={(event) => updateProject(item.id, 'subtitle', event.target.value)}
                />
              </label>
              <label className="field">
                <span>Start date</span>
                <input
                  value={item.startDate}
                  onChange={(event) => updateProject(item.id, 'startDate', event.target.value)}
                />
              </label>
              <label className="field">
                <span>End date</span>
                <input
                  disabled={item.current}
                  value={item.endDate}
                  onChange={(event) => updateProject(item.id, 'endDate', event.target.value)}
                />
              </label>
              <label className="field checkbox-field">
                <input
                  checked={item.current}
                  onChange={(event) => updateProject(item.id, 'current', event.target.checked)}
                  type="checkbox"
                />
                <span>Ongoing project</span>
              </label>
            </div>
            <label className="field field--stacked">
              <span>Highlights</span>
              <textarea
                rows={4}
                value={item.highlights.join('\n')}
                onChange={(event) =>
                  updateProject(
                    item.id,
                    'highlights',
                    event.target.value
                      .split('\n')
                      .map((line) => line.trim())
                      .filter(Boolean),
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
