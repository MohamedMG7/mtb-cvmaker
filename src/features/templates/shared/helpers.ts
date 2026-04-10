import type { CSSProperties } from 'react'
import type { CvDocument, CvSection, Density, HeaderLinkDisplayMode } from '../../../lib/schema/cv'

export type HeaderLink = {
  label: string
  url: string
  headerDisplay: HeaderLinkDisplayMode
}

export type HeaderContactItem = {
  key: string
  text: string
  href?: string
}

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

export const withAlpha = (value: string, alpha: number) => {
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

export const getDensityStyleTokens = (density: Density) => densityTokens[density]

export const formatRange = (startDate: string, endDate: string, current?: boolean) => {
  const endLabel = current ? 'Present' : endDate
  return [startDate, endLabel].filter(Boolean).join(' - ')
}

export const nonEmptyLines = (values: string[]) => values.filter((value) => value.trim().length > 0)

export const joinLines = (values: string[]) => nonEmptyLines(values).join(' ')

export const toExternalUrl = (value: string) => (/^https?:\/\//i.test(value) ? value : `https://${value}`)

export const getVisibleSections = (document: CvDocument) => document.sections.filter((section) => section.visible)

export const getHeaderLinks = (document: CvDocument): HeaderLink[] => {
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

export const getHeaderLinkText = (link: HeaderLink, index: number) =>
  link.headerDisplay === 'url' ? link.url : link.label.trim() || `Link ${index + 1}`

export const getHeaderContactItems = (document: CvDocument): HeaderContactItem[] => {
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

export const getVisibleSectionTypes = (document: CvDocument) => getVisibleSections(document).map((section) => section.type)

export const filterSectionsByType = (sections: CvSection[], allowedTypes: Set<CvSection['type']>) =>
  sections.filter((section) => allowedTypes.has(section.type))

export const getDocumentStyle = (document: CvDocument): CSSProperties => ({
  ['--text-color' as string]: document.theme.textColor,
  ['--muted-color' as string]: withAlpha(document.theme.textColor, 0.72),
  ['--soft-color' as string]: withAlpha(document.theme.textColor, 0.54),
  ['--rule-color' as string]: withAlpha(document.theme.textColor, 0.3),
  ['--chip-bg' as string]: withAlpha(document.theme.textColor, 0.06),
  ['--page-padding' as string]: getDensityStyleTokens(document.theme.density).pagePadding,
  ['--block-gap' as string]: getDensityStyleTokens(document.theme.density).blockGap,
  ['--list-gap' as string]: getDensityStyleTokens(document.theme.density).listGap,
  ['--item-gap' as string]: getDensityStyleTokens(document.theme.density).itemGap,
  ['--body-size' as string]: getDensityStyleTokens(document.theme.density).bodySize,
  ['--body-line-height' as string]: getDensityStyleTokens(document.theme.density).bodyLineHeight,
  ['--chip-padding' as string]: getDensityStyleTokens(document.theme.density).chipPadding,
  ['--page-font-family' as string]: document.theme.fontFamily,
  fontFamily: document.theme.fontFamily,
})
