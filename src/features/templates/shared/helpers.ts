import type { CvDocument, CvSection, HeaderLinkDisplayMode } from '../../../lib/schema/cv'

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
