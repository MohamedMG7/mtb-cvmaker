import { getSection, splitListField } from '../../../lib/schema/cv'
import { useCvStore } from '../store/useCvStore'
import { editorHints, editorSuggestions } from './editorSuggestions'
import { SectionCard } from './SectionCard'
import { AddItemButton, SuggestionInput } from './SmartField'

export const SkillsEditor = () => {
  const document = useCvStore((state) => state.document)
  const skills = getSection(document, 'skills')
  const updateSkillGroup = useCvStore((state) => state.updateSkillGroup)
  const addSkillGroup = useCvStore((state) => state.addSkillGroup)
  const removeSkillGroup = useCvStore((state) => state.removeSkillGroup)
  const toggleSectionVisibility = useCvStore((state) => state.toggleSectionVisibility)

  return (
    <SectionCard
      title="Skills"
      description="Group skills into readable clusters for scanning."
      action={
        <div className="action-row">
          <button className="ghost-button" onClick={() => toggleSectionVisibility('skills')} type="button">
            {skills.visible ? 'Hide section' : 'Show section'}
          </button>
        </div>
      }
    >
      <div className="stack-list">
        {skills.groups.map((group) => (
          <article key={group.id} className="item-card">
            <div className="item-card__header">
              <strong>{group.name || 'Untitled group'}</strong>
              <button className="ghost-button" onClick={() => removeSkillGroup(group.id)} type="button">
                Remove
              </button>
            </div>
            <div className="field-grid field-grid--two">
              <label className="field">
                <span>Group name</span>
                <SuggestionInput
                  placeholder={editorHints.skillGroup}
                  suggestions={editorSuggestions.skillGroupNames}
                  value={group.name}
                  onChange={(event) => updateSkillGroup(group.id, 'name', event.target.value)}
                />
              </label>
              <label className="field">
                <span>Comma-separated skills</span>
                <SuggestionInput
                  placeholder={editorHints.skillItems}
                  value={group.items.join(', ')}
                  onChange={(event) =>
                    updateSkillGroup(group.id, 'items', splitListField(event.target.value))
                  }
                />
              </label>
            </div>
          </article>
        ))}
      </div>
      <AddItemButton label="Add skill group" onClick={addSkillGroup} />
    </SectionCard>
  )
}
