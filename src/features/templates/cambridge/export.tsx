import { pdf } from '@react-pdf/renderer'
import type { CvDocument } from '../../../lib/schema/cv'
import { CambridgePdfDocument } from './pdf'
import { initializeCambridgePdfFonts } from './pdf-fonts'

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

export const exportCambridgePdf = async (document: CvDocument) => {
  initializeCambridgePdfFonts()
  const blob = await pdf(<CambridgePdfDocument document={document} />).toBlob()
  saveBlob(blob, `${getFileStem(document)}.pdf`)
}
