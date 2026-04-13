import type { CvDocument } from '../../lib/schema/cv'
import { getTemplateDefinition } from '../templates/registry'

export const exportPdf = async (document: CvDocument) => {
  const template = getTemplateDefinition(document.theme.templateId)

  if (template.loadPdfExporter) {
    const exportPdfForTemplate = await template.loadPdfExporter()
    await exportPdfForTemplate(document)
    return
  }

  window.alert('This template does not have a PDF exporter yet.')
}
