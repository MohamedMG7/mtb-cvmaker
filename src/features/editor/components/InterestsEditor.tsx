import { getSection } from '../../../lib/schema/cv'
import { useCvStore } from '../store/useCvStore'
import { editorHints, editorSuggestions } from './editorSuggestions'
import { SectionCard } from './SectionCard'
import { AddItemButton, SuggestionInput } from './SmartField'

export const InterestsEditor = () => {
  const document = useCvStore((state) => state.document)
  const section = getSection(document, 'interests')
  const updateSectionTitle = useCvStore((state) => state.updateSectionTitle)
  const updateInterest = useCvStore((state) => state.updateInterest)
  const addInterest = useCvStore((state) => state.addInterest)
  const removeInterest = useCvStore((state) => state.removeInterest)
  const toggleSectionVisibility = useCvStore((state) => state.toggleSectionVisibility)

  return (
    <SectionCard
      title="Interests"
      description="Keep this human and concise to spark relevant conversation."
      action={
        <div className="action-row">
          <button className="ghost-button" onClick={() => toggleSectionVisibility('interests')} type="button">
            {section.visible ? 'Hide section' : 'Show section'}
          </button>
        </div>
      }
    >
      <label className="field">
        <span>Section title</span>
        <SuggestionInput
          placeholder={editorHints.sectionTitle}
          suggestions={['Interests', 'Personal Interests']}
          value={section.title}
          onChange={(event) => updateSectionTitle('interests', event.target.value)}
        />
      </label>
      <div className="stack-list">
        {section.items.map((item) => (
          <article key={item.id} className="item-card">
            <div className="item-card__header">
              <strong>{item.name || 'Interest'}</strong>
              <button className="ghost-button" onClick={() => removeInterest(item.id)} type="button">
                Remove
              </button>
            </div>
            <label className="field">
              <span>Interest</span>
              <SuggestionInput
                placeholder={editorHints.interest}
                suggestions={editorSuggestions.interests}
                value={item.name}
                onChange={(event) => updateInterest(item.id, event.target.value)}
              />
            </label>
          </article>
        ))}
      </div>
      <AddItemButton label="Add interest" onClick={addInterest} />
    </SectionCard>
  )
}
