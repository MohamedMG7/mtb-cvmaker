import { useState, type KeyboardEvent, type PropsWithChildren, type ReactNode } from 'react'

type SectionCardProps = PropsWithChildren<{
  title: string
  description?: string
  action?: ReactNode
  defaultExpanded?: boolean
}>

export const SectionCard = ({
  title,
  description,
  action,
  children,
  defaultExpanded = true,
}: SectionCardProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  const toggle = () => {
    setIsExpanded((current) => !current)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggle()
    }
  }

  return (
    <section className={`panel-card section-card ${isExpanded ? '' : 'section-card--collapsed'}`}>
      <div
        aria-expanded={isExpanded}
        className="section-card__header"
        onClick={toggle}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
      >
        <div className="section-card__heading">
          <h2>{title}</h2>
          {!isExpanded && description ? <p className="section-card__subtitle">{description}</p> : null}
        </div>
        {action ? (
          <div
            className="section-card__actions"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            {action}
          </div>
        ) : null}
      </div>
      {isExpanded ? (
        <>
          {description ? <p className="section-card__description">{description}</p> : null}
          <div className="section-card__body">{children}</div>
        </>
      ) : null}
    </section>
  )
}
