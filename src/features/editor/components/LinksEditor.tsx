import { getSection } from '../../../lib/schema/cv'
import { useCvStore } from '../store/useCvStore'
import { SectionCard } from './SectionCard'

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
          <button className="primary-button" onClick={addLink} type="button">
            Add link
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
                <input
                  value={item.label}
                  onChange={(event) => updateLink(item.id, 'label', event.target.value)}
                />
              </label>
              <label className="field">
                <span>URL</span>
                <input
                  value={item.url}
                  onChange={(event) => updateLink(item.id, 'url', event.target.value)}
                />
              </label>
            </div>
          </article>
        ))}
      </div>
    </SectionCard>
  )
}
