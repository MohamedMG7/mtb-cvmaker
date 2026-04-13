import { getSection } from '../../../lib/schema/cv'
import { useCvStore } from '../store/useCvStore'
import { appendSuggestionLine, editorHints, editorSuggestions } from './editorSuggestions'
import { SectionCard } from './SectionCard'
import { AddItemButton, SuggestionChips, SuggestionInput } from './SmartField'

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
                <SuggestionInput
                  placeholder={editorHints.projectName}
                  value={item.name}
                  onChange={(event) => updateProject(item.id, 'name', event.target.value)}
                />
              </label>
              <label className="field">
                <span>Project URL</span>
                <SuggestionInput
                  placeholder={editorHints.projectUrl}
                  value={item.url}
                  onChange={(event) => updateProject(item.id, 'url', event.target.value)}
                />
              </label>
              <label className="field field--full">
                <span>Subtitle</span>
                <SuggestionInput
                  placeholder={editorHints.projectSubtitle}
                  suggestions={editorSuggestions.projectTypes}
                  value={item.subtitle}
                  onChange={(event) => updateProject(item.id, 'subtitle', event.target.value)}
                />
              </label>
              <label className="field">
                <span>Start date</span>
                <SuggestionInput
                  placeholder={editorHints.date}
                  suggestions={editorSuggestions.dates}
                  value={item.startDate}
                  onChange={(event) => updateProject(item.id, 'startDate', event.target.value)}
                />
              </label>
              <label className="field">
                <span>End date</span>
                <SuggestionInput
                  disabled={item.current}
                  placeholder="Present or 2026"
                  suggestions={editorSuggestions.dates}
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
                placeholder={editorHints.textarea}
                rows={4}
                value={item.highlights.join('\n')}
                onChange={(event) =>
                  updateProject(
                    item.id,
                    'highlights',
                    event.target.value.split('\n'),
                  )
                }
              />
            </label>
            <SuggestionChips
              label="Project highlight starters"
              suggestions={editorSuggestions.highlightLines}
              onSelect={(suggestion) => updateProject(item.id, 'highlights', appendSuggestionLine(item.highlights, suggestion))}
            />
          </article>
        ))}
      </div>
      <AddItemButton label="Add project" onClick={addProject} />
    </SectionCard>
  )
}
