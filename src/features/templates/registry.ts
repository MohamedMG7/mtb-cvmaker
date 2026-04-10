import type { ComponentType } from 'react'
import { templateIds, type CvDocument, type TemplateId } from '../../lib/schema/cv'
import { CambridgePrintDocument } from './cambridge/print'
import { AtlasTemplate, CambridgeTemplate, MinimalTemplate, type CvPreviewProps } from './previews'

export type TemplateDefinition = {
  id: TemplateId
  label: string
  PreviewComponent: ComponentType<CvPreviewProps>
  PrintComponent?: ComponentType<CvPreviewProps>
  loadPdfExporter?: () => Promise<(document: CvDocument) => Promise<void>>
  supportsPdfExport: boolean
}

const templateDefinitionMap: Record<TemplateId, TemplateDefinition> = {
  cambridge: {
    id: 'cambridge',
    label: 'Cambridge',
    PreviewComponent: CambridgeTemplate,
    PrintComponent: CambridgePrintDocument,
    loadPdfExporter: async () => (await import('./cambridge/export')).exportCambridgePdf,
    supportsPdfExport: true,
  },
  minimal: {
    id: 'minimal',
    label: 'Minimal',
    PreviewComponent: MinimalTemplate,
    loadPdfExporter: async () => (await import('./minimal/export')).exportMinimalPdf,
    supportsPdfExport: true,
  },
  atlas: {
    id: 'atlas',
    label: 'Atlas',
    PreviewComponent: AtlasTemplate,
    loadPdfExporter: async () => (await import('./atlas/export')).exportAtlasPdf,
    supportsPdfExport: true,
  },
}

export const templateRegistry = templateIds.map((templateId) => templateDefinitionMap[templateId])

export const getTemplateDefinition = (templateId: TemplateId) => templateDefinitionMap[templateId]
