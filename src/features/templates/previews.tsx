import { Fragment } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import type { CvDocument, CvSection } from '../../lib/schema/cv'
import {
  formatRange,
  getHeaderContactItems,
  getHeaderLinkText,
  getHeaderLinks,
  getVisibleSections,
  joinLines,
  nonEmptyLines,
  toExternalUrl,
  type HeaderContactItem,
} from './shared/helpers'

export type CvPreviewProps = {
  document: CvDocument
}

const joinMeta = (...values: string[]) => values.filter(Boolean).join(' - ')

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

const renderHeaderContactLine = (document: CvDocument) => renderHeaderContactItems(getHeaderContactItems(document))

const renderHeaderLinksOnly = (document: CvDocument) =>
  renderHeaderContactItems(
    getHeaderLinks(document).map((item, index) => ({
      key: `header-link-only-${index}`,
      text: getHeaderLinkText(item, index),
      href: toExternalUrl(item.url),
    })),
  )

const hexToRgb = (value: string) => {
  const normalized = value.trim()
  const hex = normalized.startsWith('#') ? normalized.slice(1) : normalized

  if (hex.length === 3) {
    const [r, g, b] = hex.split('')
    return {
      r: Number.parseInt(`${r}${r}`, 16),
      g: Number.parseInt(`${g}${g}`, 16),
      b: Number.parseInt(`${b}${b}`, 16),
    }
  }

  if (hex.length === 6) {
    return {
      r: Number.parseInt(hex.slice(0, 2), 16),
      g: Number.parseInt(hex.slice(2, 4), 16),
      b: Number.parseInt(hex.slice(4, 6), 16),
    }
  }

  return { r: 31, g: 27, b: 25 }
}

const rgba = (value: string, alpha: number) => {
  const { r, g, b } = hexToRgb(value)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const densityTokens = {
  comfortable: {
    pagePadding: '2rem',
    blockGap: '1.2rem',
    listGap: '1rem',
    itemGap: '0.35rem',
    bodySize: '1rem',
    bodyLineHeight: '1.58',
    chipPadding: '0.45rem 0.7rem',
  },
  compact: {
    pagePadding: '1.4rem',
    blockGap: '0.85rem',
    listGap: '0.65rem',
    itemGap: '0.22rem',
    bodySize: '0.93rem',
    bodyLineHeight: '1.42',
    chipPadding: '0.32rem 0.55rem',
  },
} as const

const getSheetStyle = (document: CvDocument): CSSProperties => ({
  ['--text-color' as string]: document.theme.textColor,
  ['--muted-color' as string]: rgba(document.theme.textColor, 0.72),
  ['--soft-color' as string]: rgba(document.theme.textColor, 0.54),
  ['--rule-color' as string]: rgba(document.theme.textColor, 0.3),
  ['--chip-bg' as string]: rgba(document.theme.textColor, 0.06),
  ['--page-padding' as string]: densityTokens[document.theme.density].pagePadding,
  ['--block-gap' as string]: densityTokens[document.theme.density].blockGap,
  ['--list-gap' as string]: densityTokens[document.theme.density].listGap,
  ['--item-gap' as string]: densityTokens[document.theme.density].itemGap,
  ['--body-size' as string]: densityTokens[document.theme.density].bodySize,
  ['--body-line-height' as string]: densityTokens[document.theme.density].bodyLineHeight,
  ['--chip-padding' as string]: densityTokens[document.theme.density].chipPadding,
  fontFamily: document.theme.fontFamily,
})

const renderMinimalSection = (section: CvSection): ReactNode => {
  switch (section.type) {
    case 'experience':
    case 'volunteer':
      return (
        <section key={section.type} className="cv-block">
          <h2>{section.title}</h2>
          <div className="timeline-list">
            {section.items.map((item) => (
              <article key={item.id} className="timeline-item">
                <div className="timeline-item__meta">
                  <h3>{item.role}</h3>
                  <p>{joinMeta(item.organization, item.location)}</p>
                </div>
                <span>{formatRange(item.startDate, item.endDate, item.current)}</span>
                <ul>
                  {nonEmptyLines(item.highlights).map((highlight, index) => (
                    <li key={`${item.id}-${index}`}>{highlight}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      )
    case 'projects':
      return (
        <section key={section.type} className="cv-block">
          <h2>{section.title}</h2>
          <div className="timeline-list">
            {section.items.map((item) => (
              <article key={item.id} className="timeline-item">
                <div className="timeline-item__meta">
                  <h3>{item.name}</h3>
                  <p>{item.subtitle}</p>
                </div>
                <span>{formatRange(item.startDate, item.endDate, item.current)}</span>
                {item.url ? <p className="timeline-link">{item.url}</p> : null}
                <ul>
                  {nonEmptyLines(item.highlights).map((highlight, index) => (
                    <li key={`${item.id}-${index}`}>{highlight}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      )
    case 'education':
      return (
        <section key={section.type} className="cv-block">
          <h2>{section.title}</h2>
          <div className="timeline-list">
            {section.items.map((item) => (
              <article key={item.id} className="timeline-item timeline-item--compact">
                <div className="timeline-item__meta">
                  <h3>{item.degree}</h3>
                  <p>{joinMeta(item.school, item.location)}</p>
                </div>
                <span>{formatRange(item.startDate, item.endDate)}</span>
                <ul>
                  {nonEmptyLines(item.details).map((detail, index) => (
                    <li key={`${item.id}-${index}`}>{detail}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      )
    case 'skills':
      return (
        <section key={section.type} className="cv-block">
          <h2>{section.title}</h2>
          <div className="skill-grid">
            {section.groups.map((group) => (
              <article key={group.id} className="skill-group">
                <h3>{group.name}</h3>
                <p>{group.items.join(' • ')}</p>
              </article>
            ))}
          </div>
        </section>
      )
    case 'certifications':
    case 'awards':
      return (
        <section key={section.type} className="cv-block">
          <h2>{section.title}</h2>
          <div className="timeline-list">
            {section.items.map((item) => (
              <article key={item.id} className="timeline-item">
                <div className="timeline-item__meta">
                  <h3>{item.title}</h3>
                  <p>{joinMeta(item.issuer, item.date)}</p>
                </div>
                {item.url ? <p className="timeline-link">{item.url}</p> : null}
                {joinLines(item.details) ? <p className="timeline-copy">{joinLines(item.details)}</p> : null}
              </article>
            ))}
          </div>
        </section>
      )
    case 'publications':
      return (
        <section key={section.type} className="cv-block">
          <h2>{section.title}</h2>
          <div className="timeline-list">
            {section.items.map((item) => (
              <article key={item.id} className="timeline-item">
                <div className="timeline-item__meta">
                  <h3>{item.title}</h3>
                  <p>{joinMeta(item.publisher, item.date)}</p>
                </div>
                {item.url ? <p className="timeline-link">{item.url}</p> : null}
                {joinLines(item.details) ? <p className="timeline-copy">{joinLines(item.details)}</p> : null}
              </article>
            ))}
          </div>
        </section>
      )
    case 'languages':
      return (
        <section key={section.type} className="cv-block">
          <h2>{section.title}</h2>
          <div className="chip-grid">
            {section.items.map((item) => (
              <span key={item.id} className="soft-chip">
                <strong>{item.name}</strong>
                <span>{item.level}</span>
              </span>
            ))}
          </div>
        </section>
      )
    case 'interests':
      return (
        <section key={section.type} className="cv-block">
          <h2>{section.title}</h2>
          <div className="chip-grid">
            {section.items.map((item) => (
              <span key={item.id} className="soft-chip">
                {item.name}
              </span>
            ))}
          </div>
        </section>
      )
    case 'links':
      return (
        <section key={section.type} className="cv-block">
          <h2>{section.title}</h2>
          <div className="chip-grid">
            {section.items.map((item) => (
              <span key={item.id} className="soft-chip">
                <strong>{item.label}</strong>
                <span>{item.url}</span>
              </span>
            ))}
          </div>
        </section>
      )
    case 'references':
      return (
        <section key={section.type} className="cv-block">
          <h2>{section.title}</h2>
          <div className="reference-grid">
            {section.items.map((item) => (
              <article key={item.id} className="reference-card">
                <h3>{item.name}</h3>
                <p>{item.relationship}</p>
                <p>{item.contact}</p>
                {item.details ? <p>{item.details}</p> : null}
              </article>
            ))}
          </div>
        </section>
      )
    case 'custom':
      return (
        <section key={section.type} className="cv-block">
          <h2>{section.title}</h2>
          <div className="timeline-list">
            {section.items.map((item) => (
              <article key={item.id} className="timeline-item">
                <div className="timeline-item__meta">
                  <h3>{item.title}</h3>
                  <p>{item.subtitle}</p>
                </div>
                {item.details.length > 0 ? <p className="timeline-copy">{item.details.join(' ')}</p> : null}
              </article>
            ))}
          </div>
        </section>
      )
  }
}

const renderAtlasSidebarSection = (section: CvSection): ReactNode => {
  switch (section.type) {
    case 'skills':
      return (
        <section key={section.type} className="atlas-skill-panel">
          <h2>{section.title}</h2>
          {section.groups.map((group) => (
            <div key={group.id} className="atlas-skill-group">
              <h3>{group.name}</h3>
              <p>{group.items.join(', ')}</p>
            </div>
          ))}
        </section>
      )
    case 'languages':
      return (
        <section key={section.type} className="atlas-skill-panel">
          <h2>{section.title}</h2>
          {section.items.map((item) => (
            <div key={item.id} className="atlas-skill-group">
              <h3>{item.name}</h3>
              <p>{item.level}</p>
            </div>
          ))}
        </section>
      )
    case 'interests':
      return (
        <section key={section.type} className="atlas-skill-panel">
          <h2>{section.title}</h2>
          <p>{section.items.map((item) => item.name).join(', ')}</p>
        </section>
      )
    case 'links':
      return (
        <section key={section.type} className="atlas-skill-panel">
          <h2>{section.title}</h2>
          {section.items.map((item) => (
            <div key={item.id} className="atlas-skill-group">
              <h3>{item.label}</h3>
              <p>{item.url}</p>
            </div>
          ))}
        </section>
      )
    default:
      return null
  }
}

const renderAtlasMainSection = (section: CvSection): ReactNode => {
  switch (section.type) {
    case 'experience':
    case 'volunteer':
      return (
        <section key={section.type} className="cv-block">
          <h2>{section.title}</h2>
          {section.items.map((item) => (
            <article key={item.id} className="timeline-item atlas-item">
              <span className="atlas-date">{formatRange(item.startDate, item.endDate, item.current)}</span>
              <div>
                <h3>{item.role}</h3>
                <p className="timeline-company">{joinMeta(item.organization, item.location)}</p>
                <ul>
                  {nonEmptyLines(item.highlights).map((highlight, index) => (
                    <li key={`${item.id}-${index}`}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </section>
      )
    case 'projects':
      return (
        <section key={section.type} className="cv-block">
          <h2>{section.title}</h2>
          {section.items.map((item) => (
            <article key={item.id} className="timeline-item atlas-item atlas-item--project">
              <span className="atlas-date">{formatRange(item.startDate, item.endDate, item.current)}</span>
              <div>
                <h3>{item.name}</h3>
                <p className="timeline-company">{item.subtitle}</p>
                {item.url ? <p className="timeline-link">{item.url}</p> : null}
                <ul>
                  {nonEmptyLines(item.highlights).map((highlight, index) => (
                    <li key={`${item.id}-${index}`}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </section>
      )
    case 'education':
      return (
        <section key={section.type} className="cv-block">
          <h2>{section.title}</h2>
          {section.items.map((item) => (
            <article key={item.id} className="timeline-item atlas-item atlas-item--education">
              <span className="atlas-date">{formatRange(item.startDate, item.endDate)}</span>
              <div>
                <h3>{item.degree}</h3>
                <p className="timeline-company">{joinMeta(item.school, item.location)}</p>
                <ul>
                  {nonEmptyLines(item.details).map((detail, index) => (
                    <li key={`${item.id}-${index}`}>{detail}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </section>
      )
    case 'certifications':
    case 'awards':
      return (
        <section key={section.type} className="cv-block">
          <h2>{section.title}</h2>
          {section.items.map((item) => (
            <article key={item.id} className="timeline-item atlas-item atlas-item--education">
              <span className="atlas-date">{item.date}</span>
              <div>
                <h3>{item.title}</h3>
                <p className="timeline-company">{item.issuer}</p>
                {item.url ? <p className="timeline-link">{item.url}</p> : null}
                {joinLines(item.details) ? <p className="timeline-copy">{joinLines(item.details)}</p> : null}
              </div>
            </article>
          ))}
        </section>
      )
    case 'publications':
      return (
        <section key={section.type} className="cv-block">
          <h2>{section.title}</h2>
          {section.items.map((item) => (
            <article key={item.id} className="timeline-item atlas-item atlas-item--education">
              <span className="atlas-date">{item.date}</span>
              <div>
                <h3>{item.title}</h3>
                <p className="timeline-company">{item.publisher}</p>
                {item.url ? <p className="timeline-link">{item.url}</p> : null}
                {joinLines(item.details) ? <p className="timeline-copy">{joinLines(item.details)}</p> : null}
              </div>
            </article>
          ))}
        </section>
      )
    case 'references':
      return (
        <section key={section.type} className="cv-block">
          <h2>{section.title}</h2>
          <div className="reference-grid">
            {section.items.map((item) => (
              <article key={item.id} className="reference-card">
                <h3>{item.name}</h3>
                <p>{item.relationship}</p>
                <p>{item.contact}</p>
                {item.details ? <p>{item.details}</p> : null}
              </article>
            ))}
          </div>
        </section>
      )
    case 'custom':
      return (
        <section key={section.type} className="cv-block">
          <h2>{section.title}</h2>
          {section.items.map((item) => (
            <article key={item.id} className="timeline-item atlas-item atlas-item--education">
              <span className="atlas-date">Detail</span>
              <div>
                <h3>{item.title}</h3>
                <p className="timeline-company">{item.subtitle}</p>
                {joinLines(item.details) ? <p className="timeline-copy">{joinLines(item.details)}</p> : null}
              </div>
            </article>
          ))}
        </section>
      )
    default:
      return null
  }
}

const renderCambridgeSection = (section: CvSection): ReactNode => {
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
                  <span>{item.url}</span>
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
              {item.url ? <p className="cambridge-subline">{item.url}</p> : null}
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
              {item.url ? <p className="cambridge-subline">{item.url}</p> : null}
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
            <p key={item.id} className="cambridge-inline-row">
              <strong>{item.label}:</strong> {item.url}
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

export const MinimalTemplate = ({ document }: CvPreviewProps) => {
  const sections = getVisibleSections(document)

  return (
    <article className="cv-sheet cv-sheet--minimal" style={getSheetStyle(document)}>
      <header className="cv-sheet__header">
        <div>
          <p className="eyebrow">MTB-cvMaker</p>
          <h1>{document.profile.fullName}</h1>
          <p className="headline">{document.profile.headline}</p>
        </div>
        <dl className="identity-list">
          <div>
            <dt>Email</dt>
            <dd>{document.profile.email}</dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>{document.profile.phone}</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{document.profile.location}</dd>
          </div>
          <div>
            <dt>Website</dt>
            <dd>
              {document.profile.website ? (
                <a
                  className="header-contact-link"
                  href={toExternalUrl(document.profile.website)}
                  rel="noreferrer"
                  target="_blank"
                >
                  Website
                </a>
              ) : null}
            </dd>
          </div>
          {getHeaderLinks(document).length > 0 ? (
            <div>
              <dt>Header links</dt>
              <dd>{renderHeaderLinksOnly(document)}</dd>
            </div>
          ) : null}
        </dl>
      </header>

      <section className="cv-block">
        <h2>Profile</h2>
        <p>{document.profile.summary}</p>
      </section>

      {sections.map((section) => renderMinimalSection(section))}
    </article>
  )
}

export const AtlasTemplate = ({ document }: CvPreviewProps) => {
  const sections = getVisibleSections(document)
  const sidebarTypes = new Set<CvSection['type']>(['skills', 'languages', 'interests', 'links'])
  const sidebarSections = sections.filter((section) => sidebarTypes.has(section.type))
  const mainSections = sections.filter((section) => !sidebarTypes.has(section.type))

  return (
    <article className="cv-sheet cv-sheet--atlas" style={getSheetStyle(document)}>
      <aside className="atlas-rail">
        <p className="eyebrow">Profile</p>
        <h1>{document.profile.fullName}</h1>
        <p className="headline">{document.profile.headline}</p>
        <p className="atlas-summary">{document.profile.summary}</p>
        <div className="atlas-contact">
          <p>{renderHeaderContactLine(document)}</p>
        </div>
        {sidebarSections.map((section) => renderAtlasSidebarSection(section))}
      </aside>

      <div className="atlas-main">{mainSections.map((section) => renderAtlasMainSection(section))}</div>
    </article>
  )
}

export const CambridgeTemplate = ({ document }: CvPreviewProps) => {
  const sections = getVisibleSections(document)

  return (
    <article className="cv-sheet cv-sheet--cambridge" style={getSheetStyle(document)}>
      <header className="cambridge-header">
        <h1>{document.profile.fullName}</h1>
        <p className="cambridge-contact-line">{renderHeaderContactLine(document)}</p>
      </header>

      <section className="cambridge-section">
        <div className="cambridge-section__heading">
          <h2>Summary</h2>
        </div>
        <p className="cambridge-body cambridge-body--lead">{document.profile.summary}</p>
      </section>

      {sections.map((section) => renderCambridgeSection(section))}
    </article>
  )
}
