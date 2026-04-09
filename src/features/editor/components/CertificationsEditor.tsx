import { getSection } from '../../../lib/schema/cv'
import { useCvStore } from '../store/useCvStore'
import { SectionCard } from './SectionCard'

export const CertificationsEditor = () => {
  const document = useCvStore((state) => state.document)
  const section = getSection(document, 'certifications')
  const updateSectionTitle = useCvStore((state) => state.updateSectionTitle)
  const updateCertification = useCvStore((state) => state.updateCertification)
  const addCertification = useCvStore((state) => state.addCertification)
  const removeCertification = useCvStore((state) => state.removeCertification)
  const toggleSectionVisibility = useCvStore((state) => state.toggleSectionVisibility)

  return (
    <SectionCard
      title="Certifications"
      description="Add licenses, certifications, or formal credentials."
      action={
        <div className="action-row">
          <button className="ghost-button" onClick={() => toggleSectionVisibility('certifications')} type="button">
            {section.visible ? 'Hide section' : 'Show section'}
          </button>
          <button className="primary-button" onClick={addCertification} type="button">
            Add item
          </button>
        </div>
      }
    >
      <label className="field">
        <span>Section title</span>
        <input value={section.title} onChange={(event) => updateSectionTitle('certifications', event.target.value)} />
      </label>
      <div className="stack-list">
        {section.items.map((item) => (
          <article key={item.id} className="item-card">
            <div className="item-card__header">
              <strong>{item.title || 'Untitled certification'}</strong>
              <button className="ghost-button" onClick={() => removeCertification(item.id)} type="button">
                Remove
              </button>
            </div>
            <div className="field-grid field-grid--two">
              <label className="field">
                <span>Title</span>
                <input value={item.title} onChange={(event) => updateCertification(item.id, 'title', event.target.value)} />
              </label>
              <label className="field">
                <span>Issuer</span>
                <input value={item.issuer} onChange={(event) => updateCertification(item.id, 'issuer', event.target.value)} />
              </label>
              <label className="field">
                <span>Date</span>
                <input value={item.date} onChange={(event) => updateCertification(item.id, 'date', event.target.value)} />
              </label>
              <label className="field">
                <span>URL</span>
                <input value={item.url} onChange={(event) => updateCertification(item.id, 'url', event.target.value)} />
              </label>
            </div>
            <label className="field field--stacked">
              <span>Details</span>
              <textarea
                rows={3}
                value={item.details.join('\n')}
                onChange={(event) =>
                  updateCertification(
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
