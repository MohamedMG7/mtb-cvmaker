import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'
import type { ReactNode } from 'react'
import type { CvDocument, CvSection, Density } from '../../../lib/schema/cv'
import {
  formatRange,
  getHeaderContactItems,
  getVisibleSections,
  joinLines,
  nonEmptyLines,
  toExternalUrl,
} from '../shared/helpers'
import { getCambridgePdfFontFamily } from './pdf-fonts'

const getFileStem = (document: CvDocument) =>
  `${document.metadata.title || 'cv'}`.trim().replace(/\s+/g, '-').toLowerCase()

const getDensityTokens = (density: Density) =>
  density === 'compact'
    ? {
        pagePaddingTop: 11.8,
        pagePaddingBottom: 13.4,
        pagePaddingX: 13.4,
        headerGap: 10.2,
        sectionGap: 5.4,
        headingGap: 5.4,
        entryPaddingTop: 3.6,
        entryPaddingBottom: 4.8,
        bodySize: 11.2,
        bodyLineHeight: 1.42,
        headingSize: 11.4,
        titleSize: 22.8,
        titleLineHeight: 1,
        contactSize: 10.8,
        sectionLetterSpacing: 1.1,
        listGap: 3,
        listMarginTop: 3.6,
        listPaddingLeft: 13.2,
        inlineGap: 6,
        contactGap: 3,
      }
    : {
        pagePaddingTop: 16.8,
        pagePaddingBottom: 19.2,
        pagePaddingX: 19.2,
        headerGap: 10.2,
        sectionGap: 5.4,
        headingGap: 5.4,
        entryPaddingTop: 3.6,
        entryPaddingBottom: 4.8,
        bodySize: 12,
        bodyLineHeight: 1.58,
        headingSize: 11.4,
        titleSize: 22.8,
        titleLineHeight: 1,
        contactSize: 10.8,
        sectionLetterSpacing: 1.2,
        listGap: 3.6,
        listMarginTop: 3.6,
        listPaddingLeft: 13.2,
        inlineGap: 6,
        contactGap: 3,
      }

const createStyles = (document: CvDocument) => {
  const fontFamily = getCambridgePdfFontFamily(document.theme.fontFamily)
  const tokens = getDensityTokens(document.theme.density)

  return StyleSheet.create({
    page: {
      paddingTop: tokens.pagePaddingTop,
      paddingBottom: tokens.pagePaddingBottom,
      paddingHorizontal: tokens.pagePaddingX,
      color: document.theme.textColor,
      fontFamily,
      fontSize: tokens.bodySize,
      lineHeight: tokens.bodyLineHeight,
      backgroundColor: '#ffffff',
    },
    header: {
      paddingBottom: tokens.headerGap,
      textAlign: 'center',
      alignItems: 'center',
    },
    title: {
      marginBottom: 0,
      fontSize: tokens.titleSize,
      fontWeight: 700,
      lineHeight: tokens.titleLineHeight,
    },
    contactLine: {
      marginTop: 2.4,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      fontSize: tokens.contactSize,
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginRight: tokens.contactGap,
      marginBottom: 1.5,
    },
    contactText: {
      fontSize: tokens.contactSize,
    },
    contactLink: {
      fontSize: tokens.contactSize,
      color: document.theme.textColor,
      textDecoration: 'underline',
    },
    section: {
      paddingTop: tokens.sectionGap,
    },
    headingRule: {
      marginBottom: tokens.headingGap,
      borderBottomWidth: 1,
      borderBottomColor: document.theme.textColor,
      borderBottomStyle: 'solid',
    },
    headingText: {
      fontSize: tokens.headingSize,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: tokens.sectionLetterSpacing,
    },
    body: {
      marginTop: 3,
      fontSize: tokens.bodySize,
      lineHeight: tokens.bodyLineHeight,
    },
    leadBody: {
      marginTop: 4,
      fontSize: tokens.bodySize,
      lineHeight: tokens.bodyLineHeight,
    },
    entry: {
      paddingTop: tokens.entryPaddingTop,
      paddingBottom: tokens.entryPaddingBottom,
    },
    entryLine: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    entryLineLeft: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
    },
    inlinePiece: {
      marginRight: tokens.inlineGap,
      marginBottom: 2,
    },
    entryPrimary: {
      fontSize: tokens.bodySize,
      fontWeight: 700,
      lineHeight: tokens.bodyLineHeight,
    },
    entrySecondary: {
      fontSize: tokens.bodySize,
      lineHeight: tokens.bodyLineHeight,
    },
    entryDate: {
      fontSize: tokens.bodySize,
      textAlign: 'right',
      flexShrink: 0,
      lineHeight: tokens.bodyLineHeight,
    },
    subline: {
      marginTop: 2,
      fontSize: tokens.bodySize,
      lineHeight: tokens.bodyLineHeight,
    },
    linkText: {
      color: document.theme.textColor,
      textDecoration: 'underline',
    },
    list: {
      marginTop: tokens.listMarginTop,
      paddingLeft: tokens.listPaddingLeft,
    },
    listItem: {
      flexDirection: 'row',
      marginBottom: tokens.listGap,
      paddingRight: 8,
    },
    bullet: {
      width: 8,
      fontSize: tokens.bodySize,
      marginRight: 6,
    },
    listText: {
      flex: 1,
      fontSize: tokens.bodySize,
      lineHeight: tokens.bodyLineHeight,
    },
    inlineRow: {
      marginTop: 2,
      fontSize: tokens.bodySize,
      lineHeight: tokens.bodyLineHeight,
    },
    inlineRowStrong: {
      fontWeight: 700,
    },
    linkRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 2,
      alignItems: 'baseline',
    },
  })
}

type SectionRendererProps = {
  section: CvSection
  styles: ReturnType<typeof createStyles>
}

const renderBullets = (values: string[], styles: ReturnType<typeof createStyles>) =>
  nonEmptyLines(values).map((value, index) => (
    <View key={index} style={styles.listItem}>
      <Text style={styles.bullet}>-</Text>
      <Text style={styles.listText}>{value}</Text>
    </View>
  ))

const renderSectionHeading = (title: string, styles: ReturnType<typeof createStyles>) => (
  <View style={styles.headingRule}>
    <Text style={styles.headingText}>{title}</Text>
  </View>
)

const renderSection = ({ section, styles }: SectionRendererProps): ReactNode => {
  switch (section.type) {
    case 'experience':
    case 'volunteer':
      return (
        <View key={section.type} style={styles.section}>
          {renderSectionHeading(section.title, styles)}
          {section.items.map((item) => (
            <View key={item.id} style={styles.entry} wrap={false}>
              <View style={styles.entryLine}>
                <View style={styles.entryLineLeft}>
                  <Text style={[styles.entryPrimary, styles.inlinePiece]}>{item.organization}</Text>
                  {item.location ? <Text style={[styles.entrySecondary, styles.inlinePiece]}>{item.location}</Text> : null}
                </View>
                <Text style={styles.entryDate}>{formatRange(item.startDate, item.endDate, item.current)}</Text>
              </View>
              <Text style={styles.subline}>{item.role}</Text>
              <View style={styles.list}>{renderBullets(item.highlights, styles)}</View>
            </View>
          ))}
        </View>
      )
    case 'projects':
      return (
        <View key={section.type} style={styles.section}>
          {renderSectionHeading(section.title, styles)}
          {section.items.map((item) => (
            <View key={item.id} style={styles.entry} wrap={false}>
              <View style={styles.entryLine}>
                <View style={styles.entryLineLeft}>
                  <Text style={[styles.entryPrimary, styles.inlinePiece]}>{item.name}</Text>
                  {item.url ? (
                    <Link src={toExternalUrl(item.url)} style={[styles.linkText, styles.inlinePiece]}>
                      {item.url}
                    </Link>
                  ) : null}
                </View>
                <Text style={styles.entryDate}>{formatRange(item.startDate, item.endDate, item.current)}</Text>
              </View>
              <Text style={styles.subline}>{item.subtitle}</Text>
              <View style={styles.list}>{renderBullets(item.highlights, styles)}</View>
            </View>
          ))}
        </View>
      )
    case 'education':
      return (
        <View key={section.type} style={styles.section}>
          {renderSectionHeading(section.title, styles)}
          {section.items.map((item) => (
            <View key={item.id} style={styles.entry} wrap={false}>
              <View style={styles.entryLine}>
                <View style={styles.entryLineLeft}>
                  <Text style={[styles.entryPrimary, styles.inlinePiece]}>{item.school}</Text>
                  {item.location ? <Text style={[styles.entrySecondary, styles.inlinePiece]}>{item.location}</Text> : null}
                </View>
                <Text style={styles.entryDate}>{formatRange(item.startDate, item.endDate)}</Text>
              </View>
              <Text style={styles.subline}>{item.degree}</Text>
              {joinLines(item.details) ? <Text style={styles.body}>{joinLines(item.details)}</Text> : null}
            </View>
          ))}
        </View>
      )
    case 'certifications':
    case 'awards':
      return (
        <View key={section.type} style={styles.section}>
          {renderSectionHeading(section.title, styles)}
          {section.items.map((item) => (
            <View key={item.id} style={styles.entry} wrap={false}>
              <View style={styles.entryLine}>
                <View style={styles.entryLineLeft}>
                  <Text style={[styles.entryPrimary, styles.inlinePiece]}>{item.title}</Text>
                  {item.issuer ? <Text style={[styles.entrySecondary, styles.inlinePiece]}>{item.issuer}</Text> : null}
                </View>
                <Text style={styles.entryDate}>{item.date}</Text>
              </View>
              {item.url ? (
                <Link src={toExternalUrl(item.url)} style={[styles.subline, styles.linkText]}>
                  {item.url}
                </Link>
              ) : null}
              {joinLines(item.details) ? <Text style={styles.body}>{joinLines(item.details)}</Text> : null}
            </View>
          ))}
        </View>
      )
    case 'publications':
      return (
        <View key={section.type} style={styles.section}>
          {renderSectionHeading(section.title, styles)}
          {section.items.map((item) => (
            <View key={item.id} style={styles.entry} wrap={false}>
              <View style={styles.entryLine}>
                <View style={styles.entryLineLeft}>
                  <Text style={[styles.entryPrimary, styles.inlinePiece]}>{item.title}</Text>
                  {item.publisher ? <Text style={[styles.entrySecondary, styles.inlinePiece]}>{item.publisher}</Text> : null}
                </View>
                <Text style={styles.entryDate}>{item.date}</Text>
              </View>
              {item.url ? (
                <Link src={toExternalUrl(item.url)} style={[styles.subline, styles.linkText]}>
                  {item.url}
                </Link>
              ) : null}
              {joinLines(item.details) ? <Text style={styles.body}>{joinLines(item.details)}</Text> : null}
            </View>
          ))}
        </View>
      )
    case 'skills':
      return (
        <View key={section.type} style={styles.section}>
          {renderSectionHeading(section.title, styles)}
          {section.groups.map((group) => (
            <Text key={group.id} style={styles.inlineRow}>
              <Text style={styles.inlineRowStrong}>{group.name}: </Text>
              {group.items.join(', ')}
            </Text>
          ))}
        </View>
      )
    case 'languages':
      return (
        <View key={section.type} style={styles.section}>
          {renderSectionHeading(section.title, styles)}
          {section.items.map((item) => (
            <Text key={item.id} style={styles.inlineRow}>
              <Text style={styles.inlineRowStrong}>{item.name}: </Text>
              {item.level}
            </Text>
          ))}
        </View>
      )
    case 'interests':
      return (
        <View key={section.type} style={styles.section}>
          {renderSectionHeading(section.title, styles)}
          <Text style={styles.inlineRow}>{section.items.map((item) => item.name).join(', ')}</Text>
        </View>
      )
    case 'links':
      return (
        <View key={section.type} style={styles.section}>
          {renderSectionHeading(section.title, styles)}
          {section.items.map((item) => (
            <View key={item.id} style={styles.linkRow}>
              <Text style={[styles.inlineRowStrong, styles.inlinePiece]}>{item.label}:</Text>
              <Link src={toExternalUrl(item.url)} style={styles.linkText}>
                {item.url}
              </Link>
            </View>
          ))}
        </View>
      )
    case 'references':
      return (
        <View key={section.type} style={styles.section}>
          {renderSectionHeading(section.title, styles)}
          {section.items.map((item) => (
            <View key={item.id} style={styles.entry} wrap={false}>
              <View style={styles.entryLine}>
                <View style={styles.entryLineLeft}>
                  <Text style={[styles.entryPrimary, styles.inlinePiece]}>{item.name}</Text>
                  {item.relationship ? <Text style={[styles.entrySecondary, styles.inlinePiece]}>{item.relationship}</Text> : null}
                </View>
                <Text style={styles.entryDate}>{item.contact}</Text>
              </View>
              {item.details ? <Text style={styles.body}>{item.details}</Text> : null}
            </View>
          ))}
        </View>
      )
    case 'custom':
      return (
        <View key={section.type} style={styles.section}>
          {renderSectionHeading(section.title, styles)}
          {section.items.map((item) => (
            <View key={item.id} style={styles.entry} wrap={false}>
              <View style={styles.entryLine}>
                <View style={styles.entryLineLeft}>
                  <Text style={[styles.entryPrimary, styles.inlinePiece]}>{item.title}</Text>
                  {item.subtitle ? <Text style={[styles.entrySecondary, styles.inlinePiece]}>{item.subtitle}</Text> : null}
                </View>
              </View>
              {joinLines(item.details) ? <Text style={styles.body}>{joinLines(item.details)}</Text> : null}
            </View>
          ))}
        </View>
      )
  }
}

export const CambridgePdfDocument = ({ document }: { document: CvDocument }) => {
  const styles = createStyles(document)
  const sections = getVisibleSections(document)
  const headerItems = getHeaderContactItems(document)

  return (
    <Document title={`${getFileStem(document)}.pdf`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{document.profile.fullName}</Text>
          <View style={styles.contactLine}>
            {headerItems.map((item, index) => (
              <View key={item.key} style={styles.contactItem}>
                {index > 0 ? <Text style={styles.contactText}> - </Text> : null}
                {item.href ? (
                  <Link src={item.href} style={styles.contactLink}>
                    {item.text}
                  </Link>
                ) : (
                  <Text style={styles.contactText}>{item.text}</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          {renderSectionHeading('Summary', styles)}
          <Text style={styles.leadBody}>{document.profile.summary}</Text>
        </View>

        {sections.map((section) => renderSection({ section, styles }))}
      </Page>
    </Document>
  )
}
