import { useCvStore } from '../store/useCvStore'
import { SectionCard } from './SectionCard'

export const ProfileEditor = () => {
  const profile = useCvStore((state) => state.document.profile)
  const title = useCvStore((state) => state.document.metadata.title)
  const updateTitle = useCvStore((state) => state.updateTitle)
  const updateProfileField = useCvStore((state) => state.updateProfileField)

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
    </SectionCard>
  )
}
