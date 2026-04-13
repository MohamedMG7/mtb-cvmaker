import { useId, type ButtonHTMLAttributes, type InputHTMLAttributes } from 'react'

type SuggestionInputProps = InputHTMLAttributes<HTMLInputElement> & {
  suggestions?: readonly string[]
}

type SuggestionChipsProps = {
  label?: string
  onSelect: (suggestion: string) => void
  suggestions?: readonly string[]
}

type AddItemButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string
}

export const SuggestionInput = ({ suggestions = [], ...props }: SuggestionInputProps) => {
  const suggestionId = useId()
  const normalizedSuggestions = suggestions.filter(Boolean)
  const hasSuggestions = normalizedSuggestions.length > 0

  return (
    <>
      <input {...props} list={hasSuggestions ? suggestionId : props.list} />
      {hasSuggestions ? (
        <datalist id={suggestionId}>
          {normalizedSuggestions.map((suggestion) => (
            <option key={suggestion} value={suggestion} />
          ))}
        </datalist>
      ) : null}
    </>
  )
}

export const SuggestionChips = ({
  label = 'Smart suggestions',
  onSelect,
  suggestions = [],
}: SuggestionChipsProps) => {
  const normalizedSuggestions = suggestions.filter(Boolean)

  if (normalizedSuggestions.length === 0) {
    return null
  }

  return (
    <div className="field__assist">
      <span className="field__assist-label">{label}</span>
      <div className="suggestion-row">
        {normalizedSuggestions.map((suggestion) => (
          <button
            key={suggestion}
            className="suggestion-chip"
            onClick={() => onSelect(suggestion)}
            type="button"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  )
}

export const AddItemButton = ({ label, ...props }: AddItemButtonProps) => (
  <button {...props} className={`add-item-button ${props.className ?? ''}`.trim()} type="button">
    <span className="add-item-button__icon" aria-hidden="true">
      +
    </span>
    <span>{label}</span>
  </button>
)
