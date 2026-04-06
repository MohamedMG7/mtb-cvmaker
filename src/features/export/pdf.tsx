import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { renderToStaticMarkup } from 'react-dom/server'
import type { CvDocument } from '../../lib/schema/cv'
import { CvPreview, computePageBreaks, A4_HEIGHT_PX, PAGE_TOP_PADDING_PX } from '../preview/components/CvPreview'

const getFileStem = (cvDoc: CvDocument) =>
  `${cvDoc.metadata.title || 'cv'}`.trim().replace(/\s+/g, '-').toLowerCase()

const waitForFonts = async () => {
  if ('fonts' in document) {
    await document.fonts.ready
  }
}

export const exportPdf = async (cvDoc: CvDocument) => {
  const dom = window.document
  const wrapper = dom.createElement('div')
  wrapper.setAttribute('aria-hidden', 'true')
  wrapper.style.cssText = [
    'position:fixed',
    'left:-20000px',
    'top:0',
    'width:210mm',
    'padding:0',
    'margin:0',
    'background:#ffffff',
    'z-index:-1',
  ].join(';')

  wrapper.innerHTML = renderToStaticMarkup(<CvPreview document={cvDoc} />)
  dom.body.appendChild(wrapper)

  const sheet = wrapper.querySelector('.cv-sheet') as HTMLElement | null
  if (!sheet) {
    wrapper.remove()
    window.alert('Could not prepare the PDF export.')
    return
  }

  // Strip preview-only decoration before capturing
  sheet.style.width = '210mm'
  sheet.style.maxWidth = '210mm'
  sheet.style.margin = '0'
  sheet.style.boxShadow = 'none'
  sheet.style.borderRadius = '0'
  sheet.style.background = '#ffffff'
  sheet.style.backgroundImage = 'none'

  try {
    await waitForFonts()

    // Calculate safe break points on the DOM before capturing
    const breakYs = computePageBreaks(sheet)

    const RENDER_SCALE = 2
    // Exact A4 dimensions in CSS pixels
    const a4WidthPx = 210 * (96 / 25.4)  // ≈ 793.7
    const a4HeightPx = A4_HEIGHT_PX       // ≈ 1122.5
    // Canvas pixel dimensions at render scale
    const a4CanvasW = Math.round(a4WidthPx * RENDER_SCALE)
    const a4CanvasH = Math.round(a4HeightPx * RENDER_SCALE)

    // Capture the entire sheet as one tall canvas, forcing exact A4 width
    const canvas = await html2canvas(sheet, {
      scale: RENDER_SCALE,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
      width: a4WidthPx,
      height: sheet.scrollHeight,
    })

    const a4WidthMm = 210
    const a4HeightMm = 297

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    })

    // Ratio from CSS px to canvas px
    const ratio = canvas.width / a4WidthPx

    // Build page slices from break points
    const breakYsCanvas = breakYs.map((y) => Math.round(y * ratio))
    const sliceStarts = [0, ...breakYsCanvas]

    for (let page = 0; page < sliceStarts.length; page++) {
      if (page > 0) pdf.addPage()

      const srcY = sliceStarts[page]
      const srcEnd = page < sliceStarts.length - 1 ? sliceStarts[page + 1] : canvas.height
      const srcHeight = srcEnd - srcY

      // Each page canvas has exact A4 proportions
      const pageCanvas = dom.createElement('canvas')
      pageCanvas.width = a4CanvasW
      pageCanvas.height = a4CanvasH

      const ctx = pageCanvas.getContext('2d')!
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height)

      // Non-first pages get a top margin so content doesn't start flush at the edge
      const topOffset = page > 0 ? Math.round(PAGE_TOP_PADDING_PX * ratio) : 0
      ctx.drawImage(canvas, 0, srcY, canvas.width, srcHeight, 0, topOffset, canvas.width, srcHeight)

      pdf.addImage(pageCanvas.toDataURL('image/png'), 'PNG', 0, 0, a4WidthMm, a4HeightMm)
    }

    pdf.save(`${getFileStem(cvDoc)}.pdf`)
  } catch {
    window.alert('Could not export PDF. Please try again.')
  } finally {
    wrapper.remove()
  }
}
