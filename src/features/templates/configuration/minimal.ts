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

export const getMinimalPdfMetrics = (density: Density) => {
  const densityTokens = getDensityStyleTokens(density)
  const chipPadding = chipPaddingToPx(densityTokens.chipPadding)

  return {
    pagePadding: toPt(remToPx(densityTokens.pagePadding)),
    blockGap: toPt(remToPx(densityTokens.blockGap)),
    listGap: toPt(remToPx(densityTokens.listGap)),
    itemGap: toPt(remToPx(densityTokens.itemGap)),
    bodySize: toPt(remToPx(densityTokens.bodySize)),
    bodyLineHeight: Number.parseFloat(densityTokens.bodyLineHeight),
    chipPaddingY: toPt(chipPadding.y),
    chipPaddingX: toPt(chipPadding.x),
    headerGap: toPt(REM_PX),
    headerPaddingBottom: toPt(1.4 * REM_PX),
    headingSize: toPt(0.85 * REM_PX),
    headingLetterSpacing: toPt(0.1 * 0.85 * REM_PX),
    headingColor: '#57534e',
    titleSize: toPt(2 * REM_PX),
    titleTopMargin: toPt(0.1 * REM_PX),
    titleBottomMargin: toPt(0.5 * REM_PX),
    headlineSize: toPt(REM_PX),
    identityGap: toPt(0.6 * REM_PX),
    identityLabelSize: toPt(0.74 * REM_PX),
    identityLabelLetterSpacing: toPt(0.12 * 0.74 * REM_PX),
    identityValueTopMargin: toPt(0.1 * REM_PX),
    timelineMetaSize: toPt(1.05 * REM_PX),
    timelineSmallSize: toPt(0.92 * REM_PX),
    listTopMargin: toPt(0.35 * REM_PX),
    listPaddingLeft: toPt(1.2 * REM_PX),
    chipGap: toPt(0.65 * REM_PX),
    chipTextSize: toPt(0.86 * REM_PX),
    linkChipGap: toPt(0.35 * REM_PX),
    referenceGap: toPt(0.85 * REM_PX),
    referencePadding: toPt(0.9 * REM_PX),
    referenceCorner: 10,
    referenceDetailGap: toPt(0.2 * REM_PX),
  }
}
