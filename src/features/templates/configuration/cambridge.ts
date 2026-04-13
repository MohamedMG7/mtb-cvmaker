import type { CSSProperties } from 'react'
import type { Density } from '../../../lib/schema/cv'

const REM_PX = 16
const PX_TO_PT = 72 / 96

type CambridgeTemplateConfig = {
  pagePaddingTopPx: number
  pagePaddingBottomPx: number
  pagePaddingXPx: number
  headerPaddingBottomPx: number
  titleSizePx: number
  titleLineHeight: number
  contactMarginTopPx: number
  contactSizePx: number
  contactGapPx: number
  sectionPaddingTopPx: number
  headingMarginBottomPx: number
  headingSizePx: number
  headingLetterSpacingPx: number
  entryPaddingTopPx: number
  entryPaddingBottomPx: number
  inlineGapPx: number
  bodySizePx: number
  bodyLineHeight: number
  sublineMarginTopPx: number
  leadBodyMarginTopPx: number
  listMarginTopPx: number
  listGapPx: number
  listPaddingLeftPx: number
}

const toPt = (value: number) => value * PX_TO_PT

const cambridgeTemplateConfigByDensity: Record<Density, CambridgeTemplateConfig> = {
  comfortable: {
    pagePaddingTopPx: 32 * 0.7,
    pagePaddingBottomPx: 32 * 0.8,
    pagePaddingXPx: 32 * 0.8,
    headerPaddingBottomPx: 0.85 * REM_PX,
    titleSizePx: 1.9 * REM_PX,
    titleLineHeight: 1,
    contactMarginTopPx: 0.6 * REM_PX,
    contactSizePx: 0.9 * REM_PX,
    contactGapPx: 4,
    sectionPaddingTopPx: 0.45 * REM_PX,
    headingMarginBottomPx: 0.45 * REM_PX,
    headingSizePx: 0.95 * REM_PX,
    headingLetterSpacingPx: 0.08 * 0.95 * REM_PX,
    entryPaddingTopPx: 0.3 * REM_PX,
    entryPaddingBottomPx: 0.4 * REM_PX,
    inlineGapPx: 0.5 * REM_PX,
    bodySizePx: 1 * REM_PX,
    bodyLineHeight: 1.58,
    sublineMarginTopPx: 0.15 * REM_PX,
    leadBodyMarginTopPx: 0.35 * REM_PX,
    listMarginTopPx: 0.3 * REM_PX,
    listGapPx: 0,
    listPaddingLeftPx: 1.1 * REM_PX,
  },
  compact: {
    pagePaddingTopPx: 22.4 * 0.7,
    pagePaddingBottomPx: 22.4 * 0.8,
    pagePaddingXPx: 22.4 * 0.8,
    headerPaddingBottomPx: 0.85 * REM_PX,
    titleSizePx: 1.9 * REM_PX,
    titleLineHeight: 1,
    contactMarginTopPx: 0.6 * REM_PX,
    contactSizePx: 0.9 * REM_PX,
    contactGapPx: 4,
    sectionPaddingTopPx: 0.45 * REM_PX,
    headingMarginBottomPx: 0.45 * REM_PX,
    headingSizePx: 0.95 * REM_PX,
    headingLetterSpacingPx: 0.08 * 0.95 * REM_PX,
    entryPaddingTopPx: 0.3 * REM_PX,
    entryPaddingBottomPx: 0.4 * REM_PX,
    inlineGapPx: 0.5 * REM_PX,
    bodySizePx: 0.93 * REM_PX,
    bodyLineHeight: 1.42,
    sublineMarginTopPx: 0.15 * REM_PX,
    leadBodyMarginTopPx: 0.35 * REM_PX,
    listMarginTopPx: 0.3 * REM_PX,
    listGapPx: 0,
    listPaddingLeftPx: 1.1 * REM_PX,
  },
}

export const getCambridgeTemplateConfig = (density: Density) => cambridgeTemplateConfigByDensity[density]

export const getCambridgePreviewStyleVars = (density: Density): CSSProperties => {
  const config = getCambridgeTemplateConfig(density)

  return {
    ['--cambridge-page-padding-top' as string]: `${config.pagePaddingTopPx / REM_PX}rem`,
    ['--cambridge-page-padding-bottom' as string]: `${config.pagePaddingBottomPx / REM_PX}rem`,
    ['--cambridge-page-padding-x' as string]: `${config.pagePaddingXPx / REM_PX}rem`,
    ['--cambridge-header-padding-bottom' as string]: `${config.headerPaddingBottomPx / REM_PX}rem`,
    ['--cambridge-title-size' as string]: `${config.titleSizePx / REM_PX}rem`,
    ['--cambridge-title-line-height' as string]: `${config.titleLineHeight}`,
    ['--cambridge-contact-margin-top' as string]: `${config.contactMarginTopPx / REM_PX}rem`,
    ['--cambridge-contact-size' as string]: `${config.contactSizePx / REM_PX}rem`,
    ['--cambridge-section-padding-top' as string]: `${config.sectionPaddingTopPx / REM_PX}rem`,
    ['--cambridge-heading-margin-bottom' as string]: `${config.headingMarginBottomPx / REM_PX}rem`,
    ['--cambridge-heading-size' as string]: `${config.headingSizePx / REM_PX}rem`,
    ['--cambridge-heading-letter-spacing' as string]: `${config.headingLetterSpacingPx / REM_PX}rem`,
    ['--cambridge-entry-padding-top' as string]: `${config.entryPaddingTopPx / REM_PX}rem`,
    ['--cambridge-entry-padding-bottom' as string]: `${config.entryPaddingBottomPx / REM_PX}rem`,
    ['--cambridge-inline-gap' as string]: `${config.inlineGapPx / REM_PX}rem`,
    ['--cambridge-body-size' as string]: `${config.bodySizePx / REM_PX}rem`,
    ['--cambridge-subline-margin-top' as string]: `${config.sublineMarginTopPx / REM_PX}rem`,
    ['--cambridge-lead-body-margin-top' as string]: `${config.leadBodyMarginTopPx / REM_PX}rem`,
    ['--cambridge-list-margin-top' as string]: `${config.listMarginTopPx / REM_PX}rem`,
    ['--cambridge-list-padding-left' as string]: `${config.listPaddingLeftPx / REM_PX}rem`,
  }
}

export const getCambridgePdfMetrics = (density: Density) => {
  const config = getCambridgeTemplateConfig(density)

  return {
    pagePaddingTop: toPt(config.pagePaddingTopPx),
    pagePaddingBottom: toPt(config.pagePaddingBottomPx),
    pagePaddingX: toPt(config.pagePaddingXPx),
    headerPaddingBottom: toPt(config.headerPaddingBottomPx),
    titleSize: toPt(config.titleSizePx),
    titleLineHeight: config.titleLineHeight,
    contactMarginTop: toPt(config.contactMarginTopPx),
    contactSize: toPt(config.contactSizePx),
    contactGap: toPt(config.contactGapPx),
    sectionPaddingTop: toPt(config.sectionPaddingTopPx),
    headingMarginBottom: toPt(config.headingMarginBottomPx),
    headingSize: toPt(config.headingSizePx),
    headingLetterSpacing: toPt(config.headingLetterSpacingPx),
    entryPaddingTop: toPt(config.entryPaddingTopPx),
    entryPaddingBottom: toPt(config.entryPaddingBottomPx),
    inlineGap: toPt(config.inlineGapPx),
    bodySize: toPt(config.bodySizePx),
    bodyLineHeight: config.bodyLineHeight,
    sublineMarginTop: toPt(config.sublineMarginTopPx),
    leadBodyMarginTop: toPt(config.leadBodyMarginTopPx),
    listMarginTop: toPt(config.listMarginTopPx),
    listGap: toPt(config.listGapPx),
    listPaddingLeft: toPt(config.listPaddingLeftPx),
  }
}
