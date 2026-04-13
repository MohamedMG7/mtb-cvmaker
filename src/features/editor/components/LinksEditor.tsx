import { getSection } from '../../../lib/schema/cv'
import { useCvStore } from '../store/useCvStore'
import { editorHints, editorSuggestions } from './editorSuggestions'
import { SectionCard } from './SectionCard'
import { AddItemButton, SuggestionInput } from './SmartField'

export const LinksEditor = () => {
  const document = useCvStore((state) => state.document)
  const links = getSection(document, 'links')
  const updateLink = useCvStore((state) => state.updateLink)
  const addLink = useCvStore((state) => state.addLink)
  const removeLink = useCvStore((state) => state.removeLink)
  const toggleSectionVisibility = useCvStore((state) => state.toggleSectionVisibility)

  return (
    <SectionCard
      title="Links"
      description="Keep portfolio, GitHub, LinkedIn, or academic profile links handy."
      action={
        <div className="action-row">
          <button className="ghost-button" onClick={() => toggleSectionVisibility('links')} type="button">
            {links.visible ? 'Hide section' : 'Show section'}
          </button>
        </div>
      }
    >
      <div className="stack-list">
        {links.items.map((item) => (
          <article key={item.id} className="item-card">
            <div className="item-card__header">
              <strong>{item.label || 'Untitled link'}</strong>
              <button className="ghost-button" onClick={() => removeLink(item.id)} type="button">
                Remove
              </button>
            </div>
            <div className="field-grid field-grid--two">
              <label className="field">
                <span>Label</span>
                <SuggestionInput
                  placeholder={editorHints.linkLabel}
                  suggestions={editorSuggestions.linkLabels}
                  value={item.label}
                  onChange={(event) => updateLink(item.id, 'label', event.target.value)}
                />
              </label>
              <label className="field">
                <span>URL</span>
                <SuggestionInput
                  placeholder={editorHints.projectUrl}
                  value={item.url}
                  onChange={(event) => updateLink(item.id, 'url', event.target.value)}
                />
              </label>
            </div>
            <div className="field">
              <span>Header display</span>
              <div className="segmented-control">
                {([
                  ['label', 'Show label'],
                  ['url', 'Show link'],
                ] as const).map(([mode, text]) => (
                  <button
                    key={mode}
                    className={item.headerDisplay === mode ? 'is-active' : ''}
                    onClick={() => updateLink(item.id, 'headerDisplay', mode)}
                    type="button"
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
      <AddItemButton label="Add link" onClick={addLink} />
    </SectionCard>
  )
}
