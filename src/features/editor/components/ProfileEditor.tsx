import { useCvStore } from '../store/useCvStore'
import { editorHints, editorSuggestions } from './editorSuggestions'
import { SectionCard } from './SectionCard'
import { SuggestionChips, SuggestionInput } from './SmartField'

export const ProfileEditor = () => {
  const profile = useCvStore((state) => state.document.profile)
  const title = useCvStore((state) => state.document.metadata.title)
  const updateTitle = useCvStore((state) => state.updateTitle)
  const updateProfileField = useCvStore((state) => state.updateProfileField)

  return (
    <SectionCard
      title="Profile"
      description="Core identity details power every template, preview, and export."
    >
      <div className="field-grid field-grid--two">
        <label className="field">
          <span>Draft title</span>
          <SuggestionInput
            placeholder={editorHints.draftTitle}
            value={title}
            onChange={(event) => updateTitle(event.target.value)}
          />
        </label>
        <label className="field">
          <span>Full name</span>
          <SuggestionInput
            placeholder={editorHints.fullName}
            value={profile.fullName}
            onChange={(event) => updateProfileField('fullName', event.target.value)}
          />
        </label>
        <label className="field">
          <span>Headline</span>
          <SuggestionInput
            placeholder={editorHints.headline}
            suggestions={editorSuggestions.headlines}
            value={profile.headline}
            onChange={(event) => updateProfileField('headline', event.target.value)}
          />
        </label>
        <label className="field">
          <span>Email</span>
          <SuggestionInput
            placeholder={editorHints.email}
            value={profile.email}
            onChange={(event) => updateProfileField('email', event.target.value)}
          />
        </label>
        <label className="field">
          <span>Phone</span>
          <SuggestionInput
            placeholder={editorHints.phone}
            value={profile.phone}
            onChange={(event) => updateProfileField('phone', event.target.value)}
          />
        </label>
        <label className="field">
          <span>Location</span>
          <SuggestionInput
            placeholder={editorHints.location}
            value={profile.location}
            onChange={(event) => updateProfileField('location', event.target.value)}
          />
        </label>
        <label className="field">
          <span>Website</span>
          <SuggestionInput
            placeholder={editorHints.website}
            value={profile.website}
            onChange={(event) => updateProfileField('website', event.target.value)}
          />
        </label>
      </div>
      <label className="field field--stacked">
        <span>Professional summary</span>
        <textarea
          placeholder={editorHints.summary}
          rows={5}
          value={profile.summary}
          onChange={(event) => updateProfileField('summary', event.target.value)}
        />
      </label>
      <SuggestionChips
        label="Summary starters"
        suggestions={editorSuggestions.summaryLines}
        onSelect={(suggestion) => {
          const currentValue = profile.summary.trim()
          const nextValue = currentValue ? `${currentValue}\n${suggestion}` : suggestion
          updateProfileField('summary', nextValue)
        }}
      />
    </SectionCard>
  )
}
