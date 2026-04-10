// One CSS px = 1/96 inch; 1mm = 1/25.4 inch -> 1mm = 96/25.4 px
export const A4_HEIGHT_PX = 297 * (96 / 25.4)
// Top margin for continuation pages (about 15mm)
export const PAGE_TOP_PADDING_PX = 15 * (96 / 25.4)

export const findSafeBreakY = (sheet: HTMLElement, targetY: number): number => {
  const sheetRect = sheet.getBoundingClientRect()
  const elements = Array.from(
    sheet.querySelectorAll<HTMLElement>(
      'p, li, h1, h2, h3, h4, h5, h6, dt, dd, span, article, .timeline-item, .cambridge-entry, .skill-group, .atlas-skill-group, .reference-card, .soft-chip',
    ),
  )

  let bestBreak = targetY

  for (const element of elements) {
    const rect = element.getBoundingClientRect()
    const top = rect.top - sheetRect.top
    const bottom = rect.bottom - sheetRect.top

    if (top < targetY && bottom > targetY) {
      bestBreak = Math.min(bestBreak, top)
    }
  }

  return bestBreak
}

export const computePageBreaks = (sheet: HTMLElement): number[] => {
  const totalHeight = sheet.scrollHeight

  if (totalHeight <= A4_HEIGHT_PX) {
    return []
  }

  const usableHeight = A4_HEIGHT_PX - PAGE_TOP_PADDING_PX
  const breaks: number[] = []
  let nextTarget = A4_HEIGHT_PX

  while (nextTarget < totalHeight) {
    const safeY = findSafeBreakY(sheet, nextTarget)

    if (breaks.length > 0 && safeY <= breaks[breaks.length - 1]) {
      break
    }

    breaks.push(safeY)
    nextTarget = safeY + usableHeight
  }

  return breaks
}
