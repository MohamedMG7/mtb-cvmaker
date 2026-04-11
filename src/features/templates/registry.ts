import type { ComponentType } from 'react'
import { templateIds, type CvDocument, type TemplateId } from '../../lib/schema/cv'
import { AtlasTemplate, CambridgeTemplate, MinimalTemplate, type CvPreviewProps } from './previews'

export type TemplateDefinition = {
  id: TemplateId
  label: string
  PreviewComponent: ComponentType<CvPreviewProps>
  loadPdfExporter?: () => Promise<(document: CvDocument) => Promise<void>>
}

const templateDefinitionMap: Record<TemplateId, TemplateDefinition> = {
  cambridge: {
    id: 'cambridge',
    label: 'Cambridge',
    PreviewComponent: CambridgeTemplate,
    loadPdfExporter: async () => (await import('./cambridge/export')).exportCambridgePdf,
  },
  minimal: {
    id: 'minimal',
    label: 'Minimal',
    PreviewComponent: MinimalTemplate,
    loadPdfExporter: async () => (await import('./minimal/export')).exportMinimalPdf,
  },
  atlas: {
    id: 'atlas',
    label: 'Atlas',
    PreviewComponent: AtlasTemplate,
    loadPdfExporter: async () => (await import('./atlas/export')).exportAtlasPdf,
  },
}

export const templateRegistry = templateIds.map((templateId) => templateDefinitionMap[templateId])

export const getTemplateDefinition = (templateId: TemplateId) => templateDefinitionMap[templateId]
