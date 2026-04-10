import type { CvDocument } from '../../lib/schema/cv'
import { getTemplateDefinition } from '../templates/registry'
import { exportRasterPdf } from './pdf-raster'

export const exportPdf = async (document: CvDocument) => {
  const template = getTemplateDefinition(document.theme.templateId)

  if (template.supportsPrintPdf && template.exportPrintPdf) {
    await template.exportPrintPdf(document)
    return
  }

  await exportRasterPdf(document)
}
