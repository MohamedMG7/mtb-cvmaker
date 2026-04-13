import {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  type IParagraphOptions,
  type IRunOptions,
  Packer,
  Paragraph,
  TabStopPosition,
  TabStopType,
  TextRun,
  UnderlineType,
} from 'docx'
import type { CvDocument, CvSection } from '../../lib/schema/cv'
import { formatRange, getHeaderContactItems, getVisibleSections, nonEmptyLines, toExternalUrl } from '../templates/shared/helpers'

const getFileStem = (document: CvDocument) =>
  `${document.metadata.title || 'cv'}`.trim().replace(/\s+/g, '-').toLowerCase()

const saveBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob)
  const link = window.document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

export const exportCambridgeDocx = async (document: CvDocument) => {
  const font = document.theme.fontFamily
  const color = document.theme.textColor.replace('#', '').toUpperCase()

  const makeRun = (text: string, options: Partial<IRunOptions> = {}) =>
    new TextRun({
      text,
      font,
      color,
      size: 20,
      ...options,
    })

  const paragraph = (text: string, options: IParagraphOptions = {}) =>
    new Paragraph({
      ...options,
      children: options.children ?? [makeRun(text)],
    })

  const sectionHeading = (title: string) =>
    paragraph(title, {
      spacing: { before: 220, after: 120 },
      border: {
        bottom: { color, size: 6, style: BorderStyle.SINGLE },
      },
      children: [makeRun(title.toUpperCase(), { bold: true })],
    })

  const leftRightLine = (leftPrimary: string, leftSecondary: string, rightText: string, bold = true) =>
    new Paragraph({
      tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
      spacing: { after: 40 },
      children: [
        makeRun(leftPrimary, { bold }),
        makeRun(leftSecondary ? ` ${leftSecondary}` : ''),
        makeRun('\t'),
        makeRun(rightText),
      ],
    })

  const bodyLine = (text: string) =>
    paragraph(text, {
      spacing: { after: 50 },
      children: [makeRun(text)],
    })

  const bulletLine = (text: string) =>
    new Paragraph({
      bullet: { level: 0 },
      spacing: { after: 20 },
      children: [makeRun(text)],
    })

  const hyperlinkParagraph = (label: string, url: string) =>
    new Paragraph({
      spacing: { after: 40 },
      children: [
        makeRun(`${label}: `, { bold: true }),
        new ExternalHyperlink({
          link: toExternalUrl(url),
          children: [makeRun(url, { underline: { type: UnderlineType.SINGLE } })],
        }),
      ],
    })

  const makeHeaderLineChildren = () => {
    const items = getHeaderContactItems(document)

    if (items.length === 0) {
      return []
    }

    return items.flatMap((item, index) => {
      const prefix = index > 0 ? [makeRun(' - ')] : []

      if (!item.href) {
        return [...prefix, makeRun(item.text)]
      }

      return [
        ...prefix,
        new ExternalHyperlink({
          link: item.href,
          children: [makeRun(item.text, { underline: { type: UnderlineType.SINGLE } })],
        }),
      ]
    })
  }

  const children: Paragraph[] = []

  if (document.profile.fullName.trim()) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [makeRun(document.profile.fullName, { bold: true, size: 30 })],
      }),
    )
  }

  const headerChildren = makeHeaderLineChildren()

  if (headerChildren.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: headerChildren,
      }),
    )
  }

  if (document.profile.summary.trim()) {
    children.push(sectionHeading('Summary'))
    children.push(bodyLine(document.profile.summary))
  }

  const pushSection = (section: CvSection) => {
    if (!section.visible) {
      return
    }

    switch (section.type) {
      case 'education':
        children.push(sectionHeading(section.title))
        section.items.forEach((item) => {
          children.push(leftRightLine(item.school, item.location, formatRange(item.startDate, item.endDate)))
          children.push(bodyLine(item.degree))
          nonEmptyLines(item.details).forEach((detail) => children.push(bodyLine(detail)))
        })
        break
      case 'experience':
      case 'volunteer':
        children.push(sectionHeading(section.title))
        section.items.forEach((item) => {
          children.push(leftRightLine(item.organization, item.location, formatRange(item.startDate, item.endDate, item.current)))
          children.push(bodyLine(item.role))
          nonEmptyLines(item.highlights).forEach((highlight) => children.push(bulletLine(highlight)))
        })
        break
      case 'projects':
        children.push(sectionHeading(section.title))
        section.items.forEach((item) => {
          children.push(leftRightLine(item.name, item.url, formatRange(item.startDate, item.endDate, item.current)))
          children.push(bodyLine(item.subtitle))
          nonEmptyLines(item.highlights).forEach((highlight) => children.push(bulletLine(highlight)))
        })
        break
      case 'certifications':
      case 'awards':
        children.push(sectionHeading(section.title))
        section.items.forEach((item) => {
          children.push(leftRightLine(item.title, item.issuer, item.date))
          if (item.url) {
            children.push(bodyLine(item.url))
          }
          nonEmptyLines(item.details).forEach((detail) => children.push(bodyLine(detail)))
        })
        break
      case 'publications':
        children.push(sectionHeading(section.title))
        section.items.forEach((item) => {
          children.push(leftRightLine(item.title, item.publisher, item.date))
          if (item.url) {
            children.push(bodyLine(item.url))
          }
          nonEmptyLines(item.details).forEach((detail) => children.push(bodyLine(detail)))
        })
        break
      case 'skills':
        children.push(sectionHeading(section.title))
        section.groups.forEach((group) => children.push(bodyLine(`${group.name}: ${group.items.join(', ')}`)))
        break
      case 'languages':
        children.push(sectionHeading(section.title))
        section.items.forEach((item) => children.push(bodyLine(`${item.name}: ${item.level}`)))
        break
      case 'interests':
        children.push(sectionHeading(section.title))
        if (section.items.length > 0) {
          children.push(bodyLine(section.items.map((item) => item.name).join(', ')))
        }
        break
      case 'links':
        children.push(sectionHeading(section.title))
        section.items.forEach((item) => {
          if (item.url) {
            children.push(hyperlinkParagraph(item.label, item.url))
          }
        })
        break
      case 'references':
        children.push(sectionHeading(section.title))
        section.items.forEach((item) => {
          children.push(leftRightLine(item.name, item.relationship, item.contact, true))
          if (item.details) {
            children.push(bodyLine(item.details))
          }
        })
        break
      case 'custom':
        children.push(sectionHeading(section.title))
        section.items.forEach((item) => {
          children.push(leftRightLine(item.title, item.subtitle, '', true))
          nonEmptyLines(item.details).forEach((detail) => children.push(bodyLine(detail)))
        })
        break
    }
  }

  getVisibleSections(document).forEach(pushSection)

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, right: 720, bottom: 720, left: 720 },
          },
        },
        children,
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  saveBlob(blob, `${getFileStem(document)}-cambridge.docx`)
}
