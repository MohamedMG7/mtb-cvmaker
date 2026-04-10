import { Document, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer'
import type { ReactNode } from 'react'
import type { CvDocument, CvSection } from '../../../lib/schema/cv'
import { getMinimalPdfMetrics } from '../configuration/minimal'
import {
  formatRange,
  getHeaderLinkText,
  getHeaderLinks,
  getVisibleSections,
  joinLines,
  nonEmptyLines,
  toExternalUrl,
  withAlpha,
} from '../shared/helpers'
import { getPdfFontFamily } from '../shared/pdf-fonts'

const createStyles = (document: CvDocument) => {
  const metrics = getMinimalPdfMetrics(document.theme.density)
  const textColor = document.theme.textColor
  const mutedColor = withAlpha(textColor, 0.72)
  const ruleColor = withAlpha(textColor, 0.3)
  const chipBackground = withAlpha(textColor, 0.06)

  return StyleSheet.create({
    page: {
      padding: metrics.pagePadding,
      color: textColor,
      fontFamily: getPdfFontFamily(document.theme.fontFamily),
      fontSize: metrics.bodySize,
      lineHeight: metrics.bodyLineHeight,
      backgroundColor: '#ffffff',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: metrics.headerGap,
      paddingBottom: metrics.headerPaddingBottom,
      borderBottomWidth: 1.5,
      borderBottomColor: ruleColor,
      borderBottomStyle: 'solid',
      alignItems: 'flex-start',
    },
    headerMain: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
      paddingRight: metrics.headerGap / 2,
    },
    headerSide: {
      width: 170,
      flexShrink: 0,
    },
    eyebrow: {
      marginBottom: 4,
      fontSize: metrics.headingSize,
      textTransform: 'uppercase',
      letterSpacing: metrics.headingLetterSpacing,
      color: mutedColor,
    },
    title: {
      marginTop: metrics.titleTopMargin,
      marginBottom: metrics.titleBottomMargin,
      fontSize: metrics.titleSize,
      lineHeight: 1,
      fontWeight: 700,
    },
    headline: {
      fontSize: metrics.headlineSize,
      color: mutedColor,
    },
    identityGroup: {
      marginBottom: metrics.identityGap,
      alignItems: 'flex-end',
    },
    identityLabel: {
      fontSize: metrics.identityLabelSize,
      textTransform: 'uppercase',
      letterSpacing: metrics.identityLabelLetterSpacing,
      color: textColor,
      fontWeight: 700,
    },
    identityValue: {
      marginTop: metrics.identityValueTopMargin,
      textAlign: 'right',
      color: textColor,
    },
    identityLink: {
      marginTop: metrics.identityValueTopMargin,
      textAlign: 'right',
      color: textColor,
      textDecoration: 'underline',
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
    paragraph: {
      color: textColor,
      lineHeight: metrics.bodyLineHeight,
    },
    timelineList: {
      gap: metrics.listGap,
    },
    timelineItem: {
      gap: metrics.itemGap,
    },
    timelineRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: metrics.headerGap / 2,
      alignItems: 'flex-start',
    },
    timelineMeta: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
    },
    timelineTitle: {
      fontSize: metrics.timelineMetaSize,
      fontWeight: 700,
      lineHeight: 1.2,
    },
    timelineSub: {
      color: mutedColor,
    },
    timelineDate: {
      color: textColor,
      textAlign: 'right',
      flexShrink: 0,
    },
    timelineLink: {
      color: textColor,
      fontSize: metrics.timelineSmallSize,
      textDecoration: 'underline',
    },
    timelineCopy: {
      color: textColor,
      fontSize: metrics.timelineSmallSize,
      lineHeight: metrics.bodyLineHeight,
    },
    bulletList: {
      marginTop: metrics.listTopMargin,
      paddingLeft: metrics.listPaddingLeft,
    },
    bulletRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: metrics.itemGap,
      paddingRight: 4,
    },
    bullet: {
      width: 9,
      marginRight: 5,
    },
    bulletText: {
      flex: 1,
      lineHeight: metrics.bodyLineHeight,
    },
    skillGroup: {
      marginBottom: metrics.listGap,
    },
    chipGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: metrics.chipGap,
    },
    softChip: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: metrics.linkChipGap,
      paddingVertical: metrics.chipPaddingY,
      paddingHorizontal: metrics.chipPaddingX,
      borderWidth: 1,
      borderColor: ruleColor,
      borderStyle: 'solid',
      borderRadius: 999,
      backgroundColor: chipBackground,
      fontSize: metrics.chipTextSize,
      color: textColor,
      marginBottom: metrics.chipGap,
      marginRight: metrics.chipGap,
    },
    softChipStrong: {
      fontWeight: 700,
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
      borderColor: ruleColor,
      borderStyle: 'solid',
      borderRadius: metrics.referenceCorner,
      backgroundColor: '#fcfcfb',
      gap: metrics.referenceDetailGap,
    },
    referenceTitle: {
      fontSize: metrics.timelineMetaSize,
      fontWeight: 700,
    },
    linkList: {
      marginTop: metrics.listTopMargin,
    },
  })
}

const joinMeta = (...values: string[]) => values.filter(Boolean).join(' - ')

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

const renderMinimalSection = (section: CvSection, styles: ReturnType<typeof createStyles>): ReactNode => {
  switch (section.type) {
    case 'experience':
    case 'volunteer':
      return (
        <View key={section.type} style={styles.section}>
          <Text style={styles.sectionHeading}>{section.title}</Text>
          <View style={styles.timelineList}>
            {section.items.map((item) => (
              <View key={item.id} style={styles.timelineItem} wrap={false}>
                <View style={styles.timelineRow}>
                  <View style={styles.timelineMeta}>
                    <Text style={styles.timelineTitle}>{item.role}</Text>
                    <Text style={styles.timelineSub}>{joinMeta(item.organization, item.location)}</Text>
                  </View>
                  <Text style={styles.timelineDate}>{formatRange(item.startDate, item.endDate, item.current)}</Text>
                </View>
                {renderBullets(item.highlights, styles)}
              </View>
            ))}
          </View>
        </View>
      )
    case 'projects':
      return (
        <View key={section.type} style={styles.section}>
          <Text style={styles.sectionHeading}>{section.title}</Text>
          <View style={styles.timelineList}>
            {section.items.map((item) => (
              <View key={item.id} style={styles.timelineItem} wrap={false}>
                <View style={styles.timelineRow}>
                  <View style={styles.timelineMeta}>
                    <Text style={styles.timelineTitle}>{item.name}</Text>
                    <Text style={styles.timelineSub}>{item.subtitle}</Text>
                  </View>
                  <Text style={styles.timelineDate}>{formatRange(item.startDate, item.endDate, item.current)}</Text>
                </View>
                {item.url ? (
                  <Link src={toExternalUrl(item.url)} style={styles.timelineLink}>
                    {item.url}
                  </Link>
                ) : null}
                {renderBullets(item.highlights, styles)}
              </View>
            ))}
          </View>
        </View>
      )
    case 'education':
      return (
        <View key={section.type} style={styles.section}>
          <Text style={styles.sectionHeading}>{section.title}</Text>
          <View style={styles.timelineList}>
            {section.items.map((item) => (
              <View key={item.id} style={styles.timelineItem} wrap={false}>
                <View style={styles.timelineRow}>
                  <View style={styles.timelineMeta}>
                    <Text style={styles.timelineTitle}>{item.degree}</Text>
                    <Text style={styles.timelineSub}>{joinMeta(item.school, item.location)}</Text>
                  </View>
                  <Text style={styles.timelineDate}>{formatRange(item.startDate, item.endDate)}</Text>
                </View>
                {renderBullets(item.details, styles)}
              </View>
            ))}
          </View>
        </View>
      )
    case 'skills':
      return (
        <View key={section.type} style={styles.section}>
          <Text style={styles.sectionHeading}>{section.title}</Text>
          <View style={styles.timelineList}>
            {section.groups.map((group) => (
              <View key={group.id} style={styles.skillGroup} wrap={false}>
                <Text style={styles.timelineTitle}>{group.name}</Text>
                <Text style={styles.timelineSub}>{group.items.join(' • ')}</Text>
              </View>
            ))}
          </View>
        </View>
      )
    case 'certifications':
    case 'awards':
      return (
        <View key={section.type} style={styles.section}>
          <Text style={styles.sectionHeading}>{section.title}</Text>
          <View style={styles.timelineList}>
            {section.items.map((item) => (
              <View key={item.id} style={styles.timelineItem} wrap={false}>
                <View style={styles.timelineMeta}>
                  <Text style={styles.timelineTitle}>{item.title}</Text>
                  <Text style={styles.timelineSub}>{joinMeta(item.issuer, item.date)}</Text>
                </View>
                {item.url ? (
                  <Link src={toExternalUrl(item.url)} style={styles.timelineLink}>
                    {item.url}
                  </Link>
                ) : null}
                {joinLines(item.details) ? <Text style={styles.timelineCopy}>{joinLines(item.details)}</Text> : null}
              </View>
            ))}
          </View>
        </View>
      )
    case 'publications':
      return (
        <View key={section.type} style={styles.section}>
          <Text style={styles.sectionHeading}>{section.title}</Text>
          <View style={styles.timelineList}>
            {section.items.map((item) => (
              <View key={item.id} style={styles.timelineItem} wrap={false}>
                <View style={styles.timelineMeta}>
                  <Text style={styles.timelineTitle}>{item.title}</Text>
                  <Text style={styles.timelineSub}>{joinMeta(item.publisher, item.date)}</Text>
                </View>
                {item.url ? (
                  <Link src={toExternalUrl(item.url)} style={styles.timelineLink}>
                    {item.url}
                  </Link>
                ) : null}
                {joinLines(item.details) ? <Text style={styles.timelineCopy}>{joinLines(item.details)}</Text> : null}
              </View>
            ))}
          </View>
        </View>
      )
    case 'languages':
      return (
        <View key={section.type} style={styles.section}>
          <Text style={styles.sectionHeading}>{section.title}</Text>
          <View style={styles.chipGrid}>
            {section.items.map((item) => (
              <View key={item.id} style={styles.softChip} wrap={false}>
                <Text style={styles.softChipStrong}>{item.name}</Text>
                <Text>{item.level}</Text>
              </View>
            ))}
          </View>
        </View>
      )
    case 'interests':
      return (
        <View key={section.type} style={styles.section}>
          <Text style={styles.sectionHeading}>{section.title}</Text>
          <View style={styles.chipGrid}>
            {section.items.map((item) => (
              <View key={item.id} style={styles.softChip} wrap={false}>
                <Text>{item.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )
    case 'links':
      return (
        <View key={section.type} style={styles.section}>
          <Text style={styles.sectionHeading}>{section.title}</Text>
          <View style={styles.chipGrid}>
            {section.items.map((item) => (
              <View key={item.id} style={styles.softChip} wrap={false}>
                <Text style={styles.softChipStrong}>{item.label}</Text>
                <Link src={toExternalUrl(item.url)} style={styles.timelineLink}>
                  {item.url}
                </Link>
              </View>
            ))}
          </View>
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
                  <Text>{item.relationship}</Text>
                  <Text>{item.contact}</Text>
                  {item.details ? <Text>{item.details}</Text> : null}
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
          <View style={styles.timelineList}>
            {section.items.map((item) => (
              <View key={item.id} style={styles.timelineItem} wrap={false}>
                <View style={styles.timelineMeta}>
                  <Text style={styles.timelineTitle}>{item.title}</Text>
                  {item.subtitle ? <Text style={styles.timelineSub}>{item.subtitle}</Text> : null}
                </View>
                {item.details.length > 0 ? <Text style={styles.timelineCopy}>{item.details.join(' ')}</Text> : null}
              </View>
            ))}
          </View>
        </View>
      )
  }
}

export const MinimalPdfDocument = ({ document }: { document: CvDocument }) => {
  const styles = createStyles(document)
  const sections = getVisibleSections(document)
  const headerLinks = getHeaderLinks(document)

  return (
    <Document title={`${document.metadata.title || 'cv'}.pdf`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerMain}>
            <Text style={styles.eyebrow}>MTB-cvMaker</Text>
            <Text style={styles.title}>{document.profile.fullName}</Text>
            <Text style={styles.headline}>{document.profile.headline}</Text>
          </View>

          <View style={styles.headerSide}>
            {document.profile.email ? (
              <View style={styles.identityGroup}>
                <Text style={styles.identityLabel}>Email</Text>
                <Text style={styles.identityValue}>{document.profile.email}</Text>
              </View>
            ) : null}
            {document.profile.phone ? (
              <View style={styles.identityGroup}>
                <Text style={styles.identityLabel}>Phone</Text>
                <Text style={styles.identityValue}>{document.profile.phone}</Text>
              </View>
            ) : null}
            {document.profile.location ? (
              <View style={styles.identityGroup}>
                <Text style={styles.identityLabel}>Location</Text>
                <Text style={styles.identityValue}>{document.profile.location}</Text>
              </View>
            ) : null}
            {document.profile.website ? (
              <View style={styles.identityGroup}>
                <Text style={styles.identityLabel}>Website</Text>
                <Link src={toExternalUrl(document.profile.website)} style={styles.identityLink}>
                  Website
                </Link>
              </View>
            ) : null}
            {headerLinks.length > 0 ? (
              <View style={styles.identityGroup}>
                <Text style={styles.identityLabel}>Header links</Text>
                <View style={styles.linkList}>
                  {headerLinks.map((item, index) => (
                    <Link key={item.url} src={toExternalUrl(item.url)} style={styles.identityLink}>
                      {getHeaderLinkText(item, index)}
                    </Link>
                  ))}
                </View>
              </View>
            ) : null}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Profile</Text>
          <Text style={styles.paragraph}>{document.profile.summary}</Text>
        </View>

        {sections.map((section) => renderMinimalSection(section, styles))}
      </Page>
    </Document>
  )
}
