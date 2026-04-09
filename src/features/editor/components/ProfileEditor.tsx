import { getSection } from '../../../lib/schema/cv'
import { useCvStore } from '../store/useCvStore'
import { SectionCard } from './SectionCard'

export const ProfileEditor = () => {
  const document = useCvStore((state) => state.document)
  const profile = useCvStore((state) => state.document.profile)
  const links = getSection(document, 'links')
  const title = useCvStore((state) => state.document.metadata.title)
  const updateTitle = useCvStore((state) => state.updateTitle)
  const updateProfileField = useCvStore((state) => state.updateProfileField)
  const updateLink = useCvStore((state) => state.updateLink)
  const addLink = useCvStore((state) => state.addLink)
  const removeLink = useCvStore((state) => state.removeLink)

  return (
    <SectionCard
      title="Profile"
      description="Core identity details power every template and export."
    >
      <div className="field-grid field-grid--two">
        <label className="field">
          <span>Draft title</span>
          <input value={title} onChange={(event) => updateTitle(event.target.value)} />
        </label>
        <label className="field">
          <span>Full name</span>
          <input
            value={profile.fullName}
            onChange={(event) => updateProfileField('fullName', event.target.value)}
          />
        </label>
        <label className="field">
          <span>Headline</span>
          <input
            value={profile.headline}
            onChange={(event) => updateProfileField('headline', event.target.value)}
          />
        </label>
        <label className="field">
          <span>Email</span>
          <input
            value={profile.email}
            onChange={(event) => updateProfileField('email', event.target.value)}
          />
        </label>
        <label className="field">
          <span>Phone</span>
          <input
            value={profile.phone}
            onChange={(event) => updateProfileField('phone', event.target.value)}
          />
        </label>
        <label className="field">
          <span>Location</span>
          <input
            value={profile.location}
            onChange={(event) => updateProfileField('location', event.target.value)}
          />
        </label>
        <label className="field">
          <span>Website</span>
          <input
            value={profile.website}
            onChange={(event) => updateProfileField('website', event.target.value)}
          />
        </label>
      </div>
      <label className="field field--stacked">
        <span>Professional summary</span>
        <textarea
          rows={5}
          value={profile.summary}
          onChange={(event) => updateProfileField('summary', event.target.value)}
        />
      </label>
      <div className="stack-list">
        <div className="item-card__header">
          <strong>Header links</strong>
          <button className="primary-button" onClick={addLink} type="button">
            Add link
          </button>
        </div>
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
                  placeholder="GitHub, LinkedIn, Portfolio"
                  value={item.label}
                  onChange={(event) => updateLink(item.id, 'label', event.target.value)}
                />
              </label>
              <label className="field">
                <span>URL</span>
                <input
                  placeholder="https://..."
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
    </SectionCard>
  )
}
