import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { renderToStaticMarkup } from 'react-dom/server'
import type { CvDocument } from '../../lib/schema/cv'
import { CvPreview } from '../preview/components/CvPreview'
import { A4_HEIGHT_PX, PAGE_TOP_PADDING_PX, computePageBreaks } from '../preview/components/pagination'

const getFileStem = (cvDoc: CvDocument) =>
  `${cvDoc.metadata.title || 'cv'}`.trim().replace(/\s+/g, '-').toLowerCase()

const waitForFonts = async () => {
  if ('fonts' in document) {
    await document.fonts.ready
  }
}

export const exportRasterPdf = async (cvDoc: CvDocument) => {
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

  sheet.style.width = '210mm'
  sheet.style.maxWidth = '210mm'
  sheet.style.margin = '0'
  sheet.style.boxShadow = 'none'
  sheet.style.borderRadius = '0'
  sheet.style.background = '#ffffff'
  sheet.style.backgroundImage = 'none'

  try {
    await waitForFonts()

    const breakYs = computePageBreaks(sheet)

    const renderScale = 2
    const a4WidthPx = 210 * (96 / 25.4)
    const a4HeightPx = A4_HEIGHT_PX
    const a4CanvasW = Math.round(a4WidthPx * renderScale)
    const a4CanvasH = Math.round(a4HeightPx * renderScale)

    const canvas = await html2canvas(sheet, {
      scale: renderScale,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
      width: a4WidthPx,
      height: sheet.scrollHeight,
    })

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    })

    const ratio = canvas.width / a4WidthPx
    const breakYsCanvas = breakYs.map((y) => Math.round(y * ratio))
    const sliceStarts = [0, ...breakYsCanvas]

    for (let page = 0; page < sliceStarts.length; page += 1) {
      if (page > 0) pdf.addPage()

      const srcY = sliceStarts[page]
      const srcEnd = page < sliceStarts.length - 1 ? sliceStarts[page + 1] : canvas.height
      const srcHeight = srcEnd - srcY

      const pageCanvas = dom.createElement('canvas')
      pageCanvas.width = a4CanvasW
      pageCanvas.height = a4CanvasH

      const ctx = pageCanvas.getContext('2d')

      if (!ctx) {
        throw new Error('Could not prepare the PDF page canvas.')
      }

      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height)

      const topOffset = page > 0 ? Math.round(PAGE_TOP_PADDING_PX * ratio) : 0
      ctx.drawImage(canvas, 0, srcY, canvas.width, srcHeight, 0, topOffset, canvas.width, srcHeight)

      pdf.addImage(pageCanvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297)
    }

    pdf.save(`${getFileStem(cvDoc)}.pdf`)
  } catch {
    window.alert('Could not export PDF. Please try again.')
  } finally {
    wrapper.remove()
  }
}
