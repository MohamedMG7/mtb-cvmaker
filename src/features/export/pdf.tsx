import type { CvDocument } from '../../lib/schema/cv'
import { getTemplateDefinition } from '../templates/registry'
import { exportRasterPdf } from './pdf-raster'

export const exportPdf = async (document: CvDocument) => {
  const template = getTemplateDefinition(document.theme.templateId)

  if (template.supportsPdfExport && template.loadPdfExporter) {
    const exportPdfForTemplate = await template.loadPdfExporter()
    await exportPdfForTemplate(document)
    return
  }

  await exportRasterPdf(document)
}
