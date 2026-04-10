import { useEffect, useRef, useState } from 'react'
import type { CvDocument } from '../../../lib/schema/cv'
import { CvPreview } from './CvPreview'
import { A4_HEIGHT_PX, PAGE_TOP_PADDING_PX, computePageBreaks } from './pagination'

type PagedPreviewProps = {
  document: CvDocument
}

export const PagedPreview = ({ document }: PagedPreviewProps) => {
  const measureRef = useRef<HTMLDivElement>(null)
  const [pages, setPages] = useState<{ offsetY: number; clipHeight: number }[]>([
    { offsetY: 0, clipHeight: A4_HEIGHT_PX },
  ])

  useEffect(() => {
    const wrapper = measureRef.current
    if (!wrapper) return

    const sheet = wrapper.querySelector<HTMLElement>('.cv-sheet')
    if (!sheet) return

    const compute = () => {
      const totalHeight = sheet.scrollHeight
      const breaks = computePageBreaks(sheet)
      const allBreaks = [0, ...breaks, totalHeight]
      const result: { offsetY: number; clipHeight: number }[] = []

      for (let i = 0; i < allBreaks.length - 1; i += 1) {
        result.push({
          offsetY: allBreaks[i],
          clipHeight: allBreaks[i + 1] - allBreaks[i],
        })
      }

      setPages(result.length > 0 ? result : [{ offsetY: 0, clipHeight: A4_HEIGHT_PX }])
    }

    const observer = new ResizeObserver(compute)
    observer.observe(sheet)
    compute()

    return () => observer.disconnect()
  }, [document])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
      <div
        ref={measureRef}
        aria-hidden="true"
        style={{ position: 'fixed', left: '-20000px', top: 0, width: '210mm', visibility: 'hidden' }}
      >
        <CvPreview document={document} />
      </div>

      {pages.map((page, index) => {
        const topPad = index > 0 ? PAGE_TOP_PADDING_PX : 0

        return (
          <div
            key={index}
            className="paged-preview__page"
            style={{
              width: '210mm',
              height: `${A4_HEIGHT_PX}px`,
              overflow: 'hidden',
              background: '#fff',
              borderRadius: '4px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.06)',
              flexShrink: 0,
              paddingTop: topPad > 0 ? `${topPad}px` : undefined,
              boxSizing: 'border-box',
            }}
          >
            <div style={{ height: `${page.clipHeight}px`, overflow: 'hidden' }}>
              <div style={{ transform: `translateY(-${page.offsetY}px)` }}>
                <CvPreview document={document} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
