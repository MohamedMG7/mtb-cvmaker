import { Document, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import type { ReactNode } from 'react'
import type { CvDocument, CvSection } from '../../../lib/schema/cv'
import { getAtlasPdfMetrics } from '../configuration/atlas'
import {
  formatRange,
  getHeaderContactItems,
  getVisibleSections,
  joinLines,
  nonEmptyLines,
  toExternalUrl,
  withAlpha,
} from '../shared/helpers'
import { getPdfFontFamily } from '../shared/pdf-fonts'

const joinMeta = (...values: string[]) => values.filter(Boolean).join(' - ')

const createStyles = (document: CvDocument) => {
  const metrics = getAtlasPdfMetrics(document.theme.density)
  const textColor = document.theme.textColor
  const mutedColor = withAlpha(textColor, 0.72)
  const ruleColor = withAlpha(textColor, 0.3)
  const chipBackground = withAlpha(textColor, 0.06)

  return StyleSheet.create({
    page: {
      color: textColor,
      fontFamily: getPdfFontFamily(document.theme.fontFamily),
      fontSize: metrics.bodySize,
      lineHeight: metrics.bodyLineHeight,
      backgroundColor: '#ffffff',
    },
    shell: {
      flexDirection: 'row',
      minHeight: '100%',
    },
    rail: {
      width: metrics.sidebarWidth,
      paddingVertical: metrics.sidebarPaddingY,
      paddingHorizontal: metrics.sidebarPaddingX,
      backgroundColor: chipBackground,
      borderRightWidth: 1,
      borderRightStyle: 'solid',
      borderRightColor: ruleColor,
    },
    main: {
      flex: 1,
      padding: metrics.mainPadding,
    },
    eyebrow: {
      marginBottom: 0,
      fontSize: metrics.eyebrowSize,
      textTransform: 'uppercase',
      letterSpacing: metrics.eyebrowLetterSpacing,
      color: metrics.eyebrowColor,
    },
    title: {
      marginTop: metrics.titleTopMargin,
      marginBottom: metrics.titleBottomMargin,
      fontSize: metrics.titleSize,
      lineHeight: metrics.titleLineHeight,
      fontWeight: 700,
    },
    headline: {
      color: mutedColor,
    },
    summary: {
      marginTop: metrics.summaryMarginTop,
      color: mutedColor,
      lineHeight: metrics.bodyLineHeight,
    },
    contactPanel: {
      marginTop: metrics.panelMarginTop,
    },
    panelTitle: {
      marginBottom: metrics.panelGap,
      fontSize: metrics.headingSize,
      textTransform: 'uppercase',
      letterSpacing: metrics.headingLetterSpacing,
      color: metrics.headingColor,
      fontWeight: 600,
    },
    contactLine: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      lineHeight: metrics.bodyLineHeight,
    },
    contactPiece: {
      marginRight: 4,
      marginBottom: 2,
    },
    contactLink: {
      color: textColor,
      textDecoration: 'underline',
    },
    sidebarPanel: {
      marginTop: metrics.panelMarginTop,
    },
    sidebarGroup: {
      marginBottom: metrics.panelGap,
    },
    sidebarGroupTitle: {
      fontWeight: 700,
      marginBottom: 2,
    },
    sidebarGroupBody: {
      color: mutedColor,
      lineHeight: metrics.bodyLineHeight,
    },
    sidebarLink: {
      color: textColor,
      textDecoration: 'underline',
      lineHeight: metrics.bodyLineHeight,
    },
    section: {
      paddingTop: metrics.blockGap,
    },
    sectionHeading: {
      marginBottom: metrics.listGap / 2,
      fontSize: metrics.headingSize,
      textTransform: 'uppercase',
      letterSpacing: metrics.headingLetterSpacing,
      color: metrics.headingColor,
      fontWeight: 600,
    },
    atlasItem: {
      flexDirection: 'row',
      gap: metrics.atlasItemGap,
      marginBottom: metrics.listGap,
    },
    atlasDate: {
      width: metrics.dateWidth,
      fontSize: metrics.dateSize,
      textTransform: 'uppercase',
      letterSpacing: metrics.dateLetterSpacing,
      color: textColor,
      lineHeight: 1.25,
    },
    atlasContent: {
      flex: 1,
      minWidth: 0,
    },
    timelineTitle: {
      fontWeight: 700,
      lineHeight: 1.25,
    },
    timelineCompany: {
      color: mutedColor,
      lineHeight: metrics.bodyLineHeight,
    },
    timelineLink: {
      color: textColor,
      fontSize: metrics.timelineSmallSize,
      textDecoration: 'underline',
      lineHeight: metrics.bodyLineHeight,
      marginTop: 2,
    },
    timelineCopy: {
      color: textColor,
      fontSize: metrics.timelineSmallSize,
      lineHeight: metrics.bodyLineHeight,
      marginTop: 2,
    },
    bulletList: {
      marginTop: metrics.listTopMargin,
      paddingLeft: metrics.listPaddingLeft,
    },
    bulletRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: metrics.itemGap,
    },
    bullet: {
      width: 9,
      marginRight: 5,
    },
    bulletText: {
      flex: 1,
      lineHeight: metrics.bodyLineHeight,
    },
    referenceGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -metrics.referenceGap / 2,
    },
    referenceCard: {
      width: '50%',
      paddingHorizontal: metrics.referenceGap / 2,
      paddingBottom: metrics.referenceGap,
    },
    referenceCardInner: {
      padding: metrics.referencePadding,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: ruleColor,
      borderRadius: metrics.referenceCorner,
      backgroundColor: '#fcfcfb',
    },
    referenceTitle: {
      fontWeight: 700,
      marginBottom: metrics.referenceDetailGap,
    },
    referenceLine: {
      marginTop: metrics.referenceDetailGap,
      lineHeight: metrics.bodyLineHeight,
    },
  })
}

const renderBullets = (values: string[], styles: ReturnType<typeof createStyles>) => (
  <View style={styles.bulletList}>
    {nonEmptyLines(values).map((value, index) => (
      <View key={index} style={styles.bulletRow}>
        <Text style={styles.bullet}>-</Text>
        <Text style={styles.bulletText}>{value}</Text>
      </View>
    ))}
  </View>
)

const renderSidebarSection = (section: CvSection, styles: ReturnType<typeof createStyles>): ReactNode => {
  switch (section.type) {
    case 'skills':
      return (
        <View key={section.type} style={styles.sidebarPanel} wrap={false}>
          <Text style={styles.panelTitle}>{section.title}</Text>
          {section.groups.map((group) => (
            <View key={group.id} style={styles.sidebarGroup}>
              <Text style={styles.sidebarGroupTitle}>{group.name}</Text>
              <Text style={styles.sidebarGroupBody}>{group.items.join(', ')}</Text>
            </View>
          ))}
        </View>
      )
    case 'languages':
      return (
        <View key={section.type} style={styles.sidebarPanel} wrap={false}>
          <Text style={styles.panelTitle}>{section.title}</Text>
          {section.items.map((item) => (
            <View key={item.id} style={styles.sidebarGroup}>
              <Text style={styles.sidebarGroupTitle}>{item.name}</Text>
              <Text style={styles.sidebarGroupBody}>{item.level}</Text>
            </View>
          ))}
        </View>
      )
    case 'interests':
      return (
        <View key={section.type} style={styles.sidebarPanel} wrap={false}>
          <Text style={styles.panelTitle}>{section.title}</Text>
          <Text style={styles.sidebarGroupBody}>{section.items.map((item) => item.name).join(', ')}</Text>
        </View>
      )
    case 'links':
      return (
        <View key={section.type} style={styles.sidebarPanel} wrap={false}>
          <Text style={styles.panelTitle}>{section.title}</Text>
          {section.items.map((item) => (
            <View key={item.id} style={styles.sidebarGroup}>
              <Text style={styles.sidebarGroupTitle}>{item.label}</Text>
              <Link src={toExternalUrl(item.url)} style={styles.sidebarLink}>
                {item.url}
              </Link>
            </View>
          ))}
        </View>
      )
    default:
      return null
  }
}

const renderMainSection = (section: CvSection, styles: ReturnType<typeof createStyles>): ReactNode => {
  switch (section.type) {
    case 'experience':
    case 'volunteer':
      return (
        <View key={section.type} style={styles.section}>
          <Text style={styles.sectionHeading}>{section.title}</Text>
          {section.items.map((item) => (
            <View key={item.id} style={styles.atlasItem} wrap={false}>
              <Text style={styles.atlasDate}>{formatRange(item.startDate, item.endDate, item.current)}</Text>
              <View style={styles.atlasContent}>
                <Text style={styles.timelineTitle}>{item.role}</Text>
                <Text style={styles.timelineCompany}>{joinMeta(item.organization, item.location)}</Text>
                {renderBullets(item.highlights, styles)}
              </View>
            </View>
          ))}
        </View>
      )
    case 'projects':
      return (
        <View key={section.type} style={styles.section}>
          <Text style={styles.sectionHeading}>{section.title}</Text>
          {section.items.map((item) => (
            <View key={item.id} style={styles.atlasItem} wrap={false}>
              <Text style={styles.atlasDate}>{formatRange(item.startDate, item.endDate, item.current)}</Text>
              <View style={styles.atlasContent}>
                <Text style={styles.timelineTitle}>{item.name}</Text>
                <Text style={styles.timelineCompany}>{item.subtitle}</Text>
                {item.url ? (
                  <Link src={toExternalUrl(item.url)} style={styles.timelineLink}>
                    {item.url}
                  </Link>
                ) : null}
                {renderBullets(item.highlights, styles)}
              </View>
            </View>
          ))}
        </View>
      )
    case 'education':
      return (
        <View key={section.type} style={styles.section}>
          <Text style={styles.sectionHeading}>{section.title}</Text>
          {section.items.map((item) => (
            <View key={item.id} style={styles.atlasItem} wrap={false}>
              <Text style={styles.atlasDate}>{formatRange(item.startDate, item.endDate)}</Text>
              <View style={styles.atlasContent}>
                <Text style={styles.timelineTitle}>{item.degree}</Text>
                <Text style={styles.timelineCompany}>{joinMeta(item.school, item.location)}</Text>
                {renderBullets(item.details, styles)}
              </View>
            </View>
          ))}
        </View>
      )
    case 'certifications':
    case 'awards':
      return (
        <View key={section.type} style={styles.section}>
          <Text style={styles.sectionHeading}>{section.title}</Text>
          {section.items.map((item) => (
            <View key={item.id} style={styles.atlasItem} wrap={false}>
              <Text style={styles.atlasDate}>{item.date}</Text>
              <View style={styles.atlasContent}>
                <Text style={styles.timelineTitle}>{item.title}</Text>
                <Text style={styles.timelineCompany}>{item.issuer}</Text>
                {item.url ? (
                  <Link src={toExternalUrl(item.url)} style={styles.timelineLink}>
                    {item.url}
                  </Link>
                ) : null}
                {joinLines(item.details) ? <Text style={styles.timelineCopy}>{joinLines(item.details)}</Text> : null}
              </View>
            </View>
          ))}
        </View>
      )
    case 'publications':
      return (
        <View key={section.type} style={styles.section}>
          <Text style={styles.sectionHeading}>{section.title}</Text>
          {section.items.map((item) => (
            <View key={item.id} style={styles.atlasItem} wrap={false}>
              <Text style={styles.atlasDate}>{item.date}</Text>
              <View style={styles.atlasContent}>
                <Text style={styles.timelineTitle}>{item.title}</Text>
                <Text style={styles.timelineCompany}>{item.publisher}</Text>
                {item.url ? (
                  <Link src={toExternalUrl(item.url)} style={styles.timelineLink}>
                    {item.url}
                  </Link>
                ) : null}
                {joinLines(item.details) ? <Text style={styles.timelineCopy}>{joinLines(item.details)}</Text> : null}
              </View>
            </View>
          ))}
        </View>
      )
    case 'references':
      return (
        <View key={section.type} style={styles.section}>
          <Text style={styles.sectionHeading}>{section.title}</Text>
          <View style={styles.referenceGrid}>
            {section.items.map((item) => (
              <View key={item.id} style={styles.referenceCard} wrap={false}>
                <View style={styles.referenceCardInner}>
                  <Text style={styles.referenceTitle}>{item.name}</Text>
                  <Text style={styles.referenceLine}>{item.relationship}</Text>
                  <Text style={styles.referenceLine}>{item.contact}</Text>
                  {item.details ? <Text style={styles.referenceLine}>{item.details}</Text> : null}
                </View>
              </View>
            ))}
          </View>
        </View>
      )
    case 'custom':
      return (
        <View key={section.type} style={styles.section}>
          <Text style={styles.sectionHeading}>{section.title}</Text>
          {section.items.map((item) => (
            <View key={item.id} style={styles.atlasItem} wrap={false}>
              <Text style={styles.atlasDate}>Detail</Text>
              <View style={styles.atlasContent}>
                <Text style={styles.timelineTitle}>{item.title}</Text>
                {item.subtitle ? <Text style={styles.timelineCompany}>{item.subtitle}</Text> : null}
                {joinLines(item.details) ? <Text style={styles.timelineCopy}>{joinLines(item.details)}</Text> : null}
              </View>
            </View>
          ))}
        </View>
      )
    default:
      return null
  }
}

export const AtlasPdfDocument = ({ document }: { document: CvDocument }) => {
  const styles = createStyles(document)
  const sections = getVisibleSections(document)
  const sidebarTypes = new Set<CvSection['type']>(['skills', 'languages', 'interests', 'links'])
  const sidebarSections = sections.filter((section) => sidebarTypes.has(section.type))
  const mainSections = sections.filter((section) => !sidebarTypes.has(section.type))
  const headerItems = getHeaderContactItems(document)

  return (
    <Document title={`${document.metadata.title || 'cv'}.pdf`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.shell}>
          <View style={styles.rail}>
            <Text style={styles.eyebrow}>Profile</Text>
            <Text style={styles.title}>{document.profile.fullName}</Text>
            <Text style={styles.headline}>{document.profile.headline}</Text>
            <Text style={styles.summary}>{document.profile.summary}</Text>

            <View style={styles.contactPanel}>
              <View style={styles.contactLine}>
                {headerItems.map((item, index) => (
                  <View key={item.key} style={styles.contactPiece}>
                    {index > 0 ? <Text>{' - '}</Text> : null}
                    {item.href ? (
                      <Link src={item.href} style={styles.contactLink}>
                        {item.text}
                      </Link>
                    ) : (
                      <Text>{item.text}</Text>
                    )}
                  </View>
                ))}
              </View>
            </View>

            {sidebarSections.map((section) => renderSidebarSection(section, styles))}
          </View>

          <View style={styles.main}>{mainSections.map((section) => renderMainSection(section, styles))}</View>
        </View>
      </Page>
    </Document>
  )
}
