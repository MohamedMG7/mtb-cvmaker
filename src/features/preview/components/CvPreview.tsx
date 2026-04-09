import { Fragment, useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import type { CvDocument, CvSection } from '../../../lib/schema/cv'

type CvPreviewProps = {
  document: CvDocument
}

type HeaderLink = {
  label: string
  url: string
  headerDisplay: 'label' | 'url'
}

type HeaderContactItem = {
  key: string
  text: string
  href?: string
}

const formatRange = (startDate: string, endDate: string, current?: boolean) => {
  const finalDate = current ? 'Present' : endDate
  return [startDate, finalDate].filter(Boolean).join(' - ')
}

const joinMeta = (...values: string[]) => values.filter(Boolean).join(' - ')

const toExternalUrl = (value: string) => (/^https?:\/\//i.test(value) ? value : `https://${value}`)

const getHeaderLinks = (document: CvDocument): HeaderLink[] => {
  const section = document.sections.find((item) => item.type === 'links')

  if (!section || section.type !== 'links') {
    return []
  }

  return section.items
    .map((item, index) => ({
      label: item.label.trim() || `Link ${index + 1}`,
      url: item.url.trim(),
      headerDisplay: item.headerDisplay,
    }))
    .filter((item) => item.url)
}

const getHeaderLinkText = (link: HeaderLink, index: number) =>
  link.headerDisplay === 'url' ? link.url : link.label.trim() || `Link ${index + 1}`

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

const getHeaderContactItems = (document: CvDocument): HeaderContactItem[] => {
  const items: HeaderContactItem[] = []
  const seen = new Set<string>()

  const pushText = (value: string, key: string) => {
    const trimmed = value.trim()

    if (!trimmed) {
      return
    }

    const cacheKey = `text:${trimmed.toLowerCase()}`

    if (seen.has(cacheKey)) {
      return
    }

    seen.add(cacheKey)
    items.push({ key, text: trimmed })
  }

  const pushLink = (text: string, url: string, key: string) => {
    const trimmedUrl = url.trim()

    if (!trimmedUrl) {
      return
    }

    const href = toExternalUrl(trimmedUrl)
    const cacheKey = `link:${href.toLowerCase()}`

    if (seen.has(cacheKey)) {
      return
    }

    seen.add(cacheKey)
    items.push({ key, text: text.trim(), href })
  }

  pushText(document.profile.location, 'location')
  pushText(document.profile.email, 'email')
  pushText(document.profile.phone, 'phone')
  pushLink('Website', document.profile.website, 'website')

  getHeaderLinks(document).forEach((item, index) => {
    pushLink(getHeaderLinkText(item, index), item.url, `header-link-${index}`)
  })

  return items
}

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

const visibleSections = (document: CvDocument) => document.sections.filter((section) => section.visible)

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
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
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
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
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
                  {item.details.map((detail) => (
                    <li key={detail}>{detail}</li>
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
                {item.details.length > 0 ? <p className="timeline-copy">{item.details.join(' ')}</p> : null}
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
                {item.details.length > 0 ? <p className="timeline-copy">{item.details.join(' ')}</p> : null}
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
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
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
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
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
                  {item.details.map((detail) => (
                    <li key={detail}>{detail}</li>
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
                {item.details.length > 0 ? <p className="timeline-copy">{item.details.join(' ')}</p> : null}
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
                {item.details.length > 0 ? <p className="timeline-copy">{item.details.join(' ')}</p> : null}
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
                {item.details.length > 0 ? <p className="timeline-copy">{item.details.join(' ')}</p> : null}
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
                {item.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
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
                {item.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
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
              {item.details.length > 0 ? <p className="cambridge-body">{item.details.join(' ')}</p> : null}
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
              {item.details.length > 0 ? <p className="cambridge-body">{item.details.join(' ')}</p> : null}
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
              {item.details.length > 0 ? <p className="cambridge-body">{item.details.join(' ')}</p> : null}
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
              {item.details.length > 0 ? <p className="cambridge-body">{item.details.join(' ')}</p> : null}
            </article>
          ))}
        </section>
      )
  }
}

const MinimalTemplate = ({ document }: CvPreviewProps) => {
  const sections = visibleSections(document)

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

const AtlasTemplate = ({ document }: CvPreviewProps) => {
  const sections = visibleSections(document)
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
  const sections = visibleSections(document)

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

export const CvPreview = ({ document }: CvPreviewProps) => {
  if (document.theme.templateId === 'atlas') {
    return <AtlasTemplate document={document} />
  }

  if (document.theme.templateId === 'cambridge') {
    return <CambridgeTemplate document={document} />
  }

  return <MinimalTemplate document={document} />
}

// One CSS px = 1/96 inch; 1mm = 1/25.4 inch → 1mm = 96/25.4 px
export const A4_HEIGHT_PX = 297 * (96 / 25.4) // ≈ 1122.5 px
// Top margin for continuation pages (≈ 15mm)
export const PAGE_TOP_PADDING_PX = 15 * (96 / 25.4) // ≈ 56.7 px

/**
 * Finds the nearest safe vertical position to place a page break.
 * If a text element straddles `targetY`, the break is pushed to just before
 * that element so no line of text is cut horizontally.
 */
export const findSafeBreakY = (sheet: HTMLElement, targetY: number): number => {
  const sheetRect = sheet.getBoundingClientRect()
  const els = Array.from(
    sheet.querySelectorAll<HTMLElement>('p, li, h1, h2, h3, h4, h5, h6, dt, dd, span, article, .timeline-item, .cambridge-entry, .skill-group, .atlas-skill-group, .reference-card, .soft-chip'),
  )

  let bestBreak = targetY

  for (const el of els) {
    const r = el.getBoundingClientRect()
    const top = r.top - sheetRect.top
    const bottom = r.bottom - sheetRect.top

    if (top < targetY && bottom > targetY) {
      // Element straddles the break — push break to just before this element
      bestBreak = Math.min(bestBreak, top)
    }
  }

  return bestBreak
}

/**
 * Calculate all page break Y-positions for a rendered sheet.
 * Page 1 gets full A4 height; subsequent pages lose PAGE_TOP_PADDING_PX
 * to the top margin, so their usable content height is shorter.
 */
export const computePageBreaks = (sheet: HTMLElement): number[] => {
  const totalHeight = sheet.scrollHeight
  if (totalHeight <= A4_HEIGHT_PX) return []

  const usableHeight = A4_HEIGHT_PX - PAGE_TOP_PADDING_PX

  const breaks: number[] = []
  let nextTarget = A4_HEIGHT_PX // first page uses the full height

  while (nextTarget < totalHeight) {
    const safeY = findSafeBreakY(sheet, nextTarget)
    // Prevent infinite loop: ensure we always advance by at least 1px
    if (breaks.length > 0 && safeY <= breaks[breaks.length - 1]) break
    breaks.push(safeY)
    nextTarget = safeY + usableHeight // subsequent pages have less room
  }

  return breaks
}

export const PagedPreview = ({ document }: CvPreviewProps) => {
  const measureRef = useRef<HTMLDivElement>(null)
  const [pages, setPages] = useState<{ offsetY: number; clipHeight: number }[]>([
    { offsetY: 0, clipHeight: A4_HEIGHT_PX },
  ])

  useEffect(() => {
    const wrapper = measureRef.current
    if (!wrapper) return

    const sheet = wrapper.querySelector<HTMLElement>('.cv-sheet')
    if (!sheet) return

    const compute = () => {
      const totalHeight = sheet.scrollHeight
      const breaks = computePageBreaks(sheet)

      // Build pages with offsetY and the actual content height to clip at
      const allBreaks = [0, ...breaks, totalHeight]
      const result: { offsetY: number; clipHeight: number }[] = []
      for (let i = 0; i < allBreaks.length - 1; i++) {
        result.push({
          offsetY: allBreaks[i],
          clipHeight: allBreaks[i + 1] - allBreaks[i],
        })
      }
      setPages(result.length > 0 ? result : [{ offsetY: 0, clipHeight: A4_HEIGHT_PX }])
    }

    const observer = new ResizeObserver(compute)
    observer.observe(sheet)
    compute()

    return () => observer.disconnect()
  }, [document])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
      {/* Hidden measurer — renders once off-screen for height calculation */}
      <div
        ref={measureRef}
        aria-hidden="true"
        style={{ position: 'fixed', left: '-20000px', top: 0, width: '210mm', visibility: 'hidden' }}
      >
        <CvPreview document={document} />
      </div>

      {/* Visible pages — each is a full A4-height frame */}
      {pages.map((page, i) => {
        const topPad = i > 0 ? PAGE_TOP_PADDING_PX : 0
        return (
          <div
            key={i}
            className="paged-preview__page"
            style={{
              width: '210mm',
              height: `${A4_HEIGHT_PX}px`,
              overflow: 'hidden',
              background: '#fff',
              borderRadius: '4px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.06)',
              flexShrink: 0,
              paddingTop: topPad > 0 ? `${topPad}px` : undefined,
              boxSizing: 'border-box',
            }}
          >
            {/* Inner clip: only show content up to the next break point */}
            <div style={{ height: `${page.clipHeight}px`, overflow: 'hidden' }}>
              <div style={{ transform: `translateY(-${page.offsetY}px)` }}>
                <CvPreview document={document} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
