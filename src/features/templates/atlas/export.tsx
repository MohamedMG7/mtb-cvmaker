import { pdf } from '@react-pdf/renderer'
import type { CvDocument } from '../../../lib/schema/cv'
import { initializePdfFonts } from '../shared/pdf-fonts'
import { AtlasPdfDocument } from './pdf'

const getFileStem = (document: CvDocument) =>
  `${document.metadata.title || 'cv'}`.trim().replace(/\s+/g, '-').toLowerCase()

const saveBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob)
  const link = window.document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

export const exportAtlasPdf = async (document: CvDocument) => {
  initializePdfFonts()
  const blob = await pdf(<AtlasPdfDocument document={document} />).toBlob()
  saveBlob(blob, `${getFileStem(document)}.pdf`)
}
