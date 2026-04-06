import { getSection } from '../../../lib/schema/cv'
import { useCvStore } from '../store/useCvStore'
import { SectionCard } from './SectionCard'

export const PublicationsEditor = () => {
  const document = useCvStore((state) => state.document)
  const section = getSection(document, 'publications')
  const updateSectionTitle = useCvStore((state) => state.updateSectionTitle)
  const updatePublication = useCvStore((state) => state.updatePublication)
  const addPublication = useCvStore((state) => state.addPublication)
  const removePublication = useCvStore((state) => state.removePublication)
  const toggleSectionVisibility = useCvStore((state) => state.toggleSectionVisibility)

  return (
    <SectionCard
      title="Publications"
      description="Add papers, talks, articles, or notable written work."
      action={
        <div className="action-row">
          <button className="ghost-button" onClick={() => toggleSectionVisibility('publications')} type="button">
            {section.visible ? 'Hide section' : 'Show section'}
          </button>
          <button className="primary-button" onClick={addPublication} type="button">
            Add item
          </button>
        </div>
      }
    >
      <label className="field">
        <span>Section title</span>
        <input value={section.title} onChange={(event) => updateSectionTitle('publications', event.target.value)} />
      </label>
      <div className="stack-list">
        {section.items.map((item) => (
          <article key={item.id} className="item-card">
            <div className="item-card__header">
              <strong>{item.title || 'Untitled publication'}</strong>
              <button className="ghost-button" onClick={() => removePublication(item.id)} type="button">
                Remove
              </button>
            </div>
            <div className="field-grid field-grid--two">
              <label className="field">
                <span>Title</span>
                <input value={item.title} onChange={(event) => updatePublication(item.id, 'title', event.target.value)} />
              </label>
              <label className="field">
                <span>Publisher</span>
                <input
                  value={item.publisher}
                  onChange={(event) => updatePublication(item.id, 'publisher', event.target.value)}
                />
              </label>
              <label className="field">
                <span>Date</span>
                <input value={item.date} onChange={(event) => updatePublication(item.id, 'date', event.target.value)} />
              </label>
              <label className="field">
                <span>URL</span>
                <input value={item.url} onChange={(event) => updatePublication(item.id, 'url', event.target.value)} />
              </label>
            </div>
            <label className="field field--stacked">
              <span>Details</span>
              <textarea
                rows={3}
                value={item.details.join('\n')}
                onChange={(event) =>
                  updatePublication(
                    item.id,
                    'details',
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
