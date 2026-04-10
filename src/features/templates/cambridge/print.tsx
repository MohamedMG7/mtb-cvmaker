import { Fragment } from 'react'
import type { CvDocument, CvSection } from '../../../lib/schema/cv'
import {
  formatRange,
  getDocumentStyle,
  getHeaderContactItems,
  getVisibleSections,
  joinLines,
  nonEmptyLines,
  toExternalUrl,
  type HeaderContactItem,
} from '../shared/helpers'

type CambridgePrintProps = {
  document: CvDocument
}

const renderHeaderContactItems = (items: HeaderContactItem[]) =>
  items.map((item, index) => (
    <Fragment key={item.key}>
      {index > 0 ? ' - ' : null}
      {item.href ? (
        <a className="header-contact-link" href={item.href} rel="noreferrer" target="_blank">
          {item.text}
        </a>
      ) : (
        item.text
      )}
    </Fragment>
  ))

const renderLink = (url: string, label = url) => (
  <a className="cambridge-link" href={toExternalUrl(url)} rel="noreferrer" target="_blank">
    {label}
  </a>
)

const renderCambridgePrintSection = (section: CvSection) => {
  switch (section.type) {
    case 'experience':
    case 'volunteer':
      return (
        <section key={section.type} className="cambridge-section">
          <div className="cambridge-section__heading">
            <h2>{section.title}</h2>
          </div>
          {section.items.map((item) => (
            <article key={item.id} className="cambridge-entry">
              <div className="cambridge-entry__line">
                <div>
                  <strong>{item.organization}</strong>
                  <span>{item.location}</span>
                </div>
                <span>{formatRange(item.startDate, item.endDate, item.current)}</span>
              </div>
              <p className="cambridge-subline">{item.role}</p>
              <ul className="cambridge-list">
                {nonEmptyLines(item.highlights).map((highlight, index) => (
                  <li key={`${item.id}-${index}`}>{highlight}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      )
    case 'projects':
      return (
        <section key={section.type} className="cambridge-section">
          <div className="cambridge-section__heading">
            <h2>{section.title}</h2>
          </div>
          {section.items.map((item) => (
            <article key={item.id} className="cambridge-entry">
              <div className="cambridge-entry__line">
                <div>
                  <strong>{item.name}</strong>
                  {item.url ? renderLink(item.url) : null}
                </div>
                <span>{formatRange(item.startDate, item.endDate, item.current)}</span>
              </div>
              <p className="cambridge-subline">{item.subtitle}</p>
              <ul className="cambridge-list">
                {nonEmptyLines(item.highlights).map((highlight, index) => (
                  <li key={`${item.id}-${index}`}>{highlight}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      )
    case 'education':
      return (
        <section key={section.type} className="cambridge-section">
          <div className="cambridge-section__heading">
            <h2>{section.title}</h2>
          </div>
          {section.items.map((item) => (
            <article key={item.id} className="cambridge-entry">
              <div className="cambridge-entry__line">
                <div>
                  <strong>{item.school}</strong>
                  <span>{item.location}</span>
                </div>
                <span>{formatRange(item.startDate, item.endDate)}</span>
              </div>
              <p className="cambridge-subline">{item.degree}</p>
              {joinLines(item.details) ? <p className="cambridge-body">{joinLines(item.details)}</p> : null}
            </article>
          ))}
        </section>
      )
    case 'certifications':
    case 'awards':
      return (
        <section key={section.type} className="cambridge-section">
          <div className="cambridge-section__heading">
            <h2>{section.title}</h2>
          </div>
          {section.items.map((item) => (
            <article key={item.id} className="cambridge-entry">
              <div className="cambridge-entry__line">
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.issuer}</span>
                </div>
                <span>{item.date}</span>
              </div>
              {item.url ? <p className="cambridge-subline">{renderLink(item.url)}</p> : null}
              {joinLines(item.details) ? <p className="cambridge-body">{joinLines(item.details)}</p> : null}
            </article>
          ))}
        </section>
      )
    case 'publications':
      return (
        <section key={section.type} className="cambridge-section">
          <div className="cambridge-section__heading">
            <h2>{section.title}</h2>
          </div>
          {section.items.map((item) => (
            <article key={item.id} className="cambridge-entry">
              <div className="cambridge-entry__line">
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.publisher}</span>
                </div>
                <span>{item.date}</span>
              </div>
              {item.url ? <p className="cambridge-subline">{renderLink(item.url)}</p> : null}
              {joinLines(item.details) ? <p className="cambridge-body">{joinLines(item.details)}</p> : null}
            </article>
          ))}
        </section>
      )
    case 'skills':
      return (
        <section key={section.type} className="cambridge-section">
          <div className="cambridge-section__heading">
            <h2>{section.title}</h2>
          </div>
          {section.groups.map((group) => (
            <p key={group.id} className="cambridge-inline-row">
              <strong>{group.name}:</strong> {group.items.join(', ')}
            </p>
          ))}
        </section>
      )
    case 'languages':
      return (
        <section key={section.type} className="cambridge-section">
          <div className="cambridge-section__heading">
            <h2>{section.title}</h2>
          </div>
          {section.items.map((item) => (
            <p key={item.id} className="cambridge-inline-row">
              <strong>{item.name}:</strong> {item.level}
            </p>
          ))}
        </section>
      )
    case 'interests':
      return (
        <section key={section.type} className="cambridge-section">
          <div className="cambridge-section__heading">
            <h2>{section.title}</h2>
          </div>
          <p className="cambridge-inline-row">{section.items.map((item) => item.name).join(', ')}</p>
        </section>
      )
    case 'links':
      return (
        <section key={section.type} className="cambridge-section">
          <div className="cambridge-section__heading">
            <h2>{section.title}</h2>
          </div>
          {section.items.map((item) => (
            <p key={item.id} className="cambridge-inline-row cambridge-link-row">
              <strong>{item.label}:</strong>
              {renderLink(item.url)}
            </p>
          ))}
        </section>
      )
    case 'references':
      return (
        <section key={section.type} className="cambridge-section">
          <div className="cambridge-section__heading">
            <h2>{section.title}</h2>
          </div>
          {section.items.map((item) => (
            <article key={item.id} className="cambridge-entry">
              <div className="cambridge-entry__line">
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.relationship}</span>
                </div>
                <span>{item.contact}</span>
              </div>
              {item.details ? <p className="cambridge-body">{item.details}</p> : null}
            </article>
          ))}
        </section>
      )
    case 'custom':
      return (
        <section key={section.type} className="cambridge-section">
          <div className="cambridge-section__heading">
            <h2>{section.title}</h2>
          </div>
          {section.items.map((item) => (
            <article key={item.id} className="cambridge-entry">
              <div className="cambridge-entry__line">
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.subtitle}</span>
                </div>
              </div>
              {joinLines(item.details) ? <p className="cambridge-body">{joinLines(item.details)}</p> : null}
            </article>
          ))}
        </section>
      )
  }
}

export const CambridgePrintDocument = ({ document }: CambridgePrintProps) => {
  const sections = getVisibleSections(document)

  return (
    <main className="cambridge-print-shell">
      <article className="cv-sheet cv-sheet--cambridge" style={getDocumentStyle(document)}>
        <header className="cambridge-header">
          <h1>{document.profile.fullName}</h1>
          <p className="cambridge-contact-line">{renderHeaderContactItems(getHeaderContactItems(document))}</p>
        </header>

        <section className="cambridge-section">
          <div className="cambridge-section__heading">
            <h2>Summary</h2>
          </div>
          <p className="cambridge-body cambridge-body--lead">{document.profile.summary}</p>
        </section>

        {sections.map((section) => renderCambridgePrintSection(section))}
      </article>
    </main>
  )
}
