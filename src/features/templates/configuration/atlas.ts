import type { Density } from '../../../lib/schema/cv'
import { getDensityStyleTokens } from '../shared/helpers'

const REM_PX = 16
const PX_TO_PT = 72 / 96

const remToPx = (value: string) => Number.parseFloat(value) * REM_PX
const chipPaddingToPx = (value: string) => {
  const parts = value.split(' ').map(remToPx)
  return {
    y: parts[0] ?? 0,
    x: parts[1] ?? parts[0] ?? 0,
  }
}
const toPt = (value: number) => value * PX_TO_PT

export const getAtlasPdfMetrics = (density: Density) => {
  const densityTokens = getDensityStyleTokens(density)
  const pagePaddingPx = remToPx(densityTokens.pagePadding)
  const chipPadding = chipPaddingToPx(densityTokens.chipPadding)

  return {
    sidebarWidth: toPt(20 * REM_PX),
    sidebarPaddingY: toPt(pagePaddingPx),
    sidebarPaddingX: toPt(pagePaddingPx * 0.75),
    mainPadding: toPt(pagePaddingPx),
    bodySize: toPt(remToPx(densityTokens.bodySize)),
    bodyLineHeight: Number.parseFloat(densityTokens.bodyLineHeight),
    blockGap: toPt(remToPx(densityTokens.blockGap)),
    listGap: toPt(remToPx(densityTokens.listGap)),
    itemGap: toPt(remToPx(densityTokens.itemGap)),
    chipPaddingY: toPt(chipPadding.y),
    chipPaddingX: toPt(chipPadding.x),
    eyebrowSize: toPt(0.72 * REM_PX),
    eyebrowLetterSpacing: toPt(0.18 * 0.72 * REM_PX),
    eyebrowColor: '#a8a29e',
    titleSize: toPt(2 * REM_PX),
    titleLineHeight: 1,
    titleTopMargin: toPt(0.1 * REM_PX),
    titleBottomMargin: toPt(0.5 * REM_PX),
    headlineSize: toPt(REM_PX),
    summaryMarginTop: toPt(REM_PX),
    panelGap: toPt(0.6 * REM_PX),
    panelMarginTop: toPt(1.5 * REM_PX),
    headingSize: toPt(0.85 * REM_PX),
    headingLetterSpacing: toPt(0.1 * 0.85 * REM_PX),
    headingColor: '#57534e',
    dateWidth: toPt(8 * REM_PX),
    dateSize: toPt(0.85 * REM_PX),
    dateLetterSpacing: toPt(0.08 * 0.85 * REM_PX),
    atlasItemGap: toPt(REM_PX),
    timelineSmallSize: toPt(0.92 * REM_PX),
    listTopMargin: toPt(0.35 * REM_PX),
    listPaddingLeft: toPt(1.2 * REM_PX),
    chipGap: toPt(0.65 * REM_PX),
    chipTextSize: toPt(0.86 * REM_PX),
    softChipGap: toPt(0.35 * REM_PX),
    referenceGap: toPt(0.85 * REM_PX),
    referencePadding: toPt(0.9 * REM_PX),
    referenceCorner: 10,
    referenceDetailGap: toPt(0.2 * REM_PX),
  }
}
