import type { ComponentType } from 'react'
import { templateIds, type CvDocument, type TemplateId } from '../../lib/schema/cv'
import { CambridgePrintDocument } from './cambridge/print'
import { exportCambridgePrintPdf } from './cambridge/export'
import { AtlasTemplate, CambridgeTemplate, MinimalTemplate, type CvPreviewProps } from './previews'

export type TemplateDefinition = {
  id: TemplateId
  label: string
  PreviewComponent: ComponentType<CvPreviewProps>
  PrintComponent?: ComponentType<CvPreviewProps>
  exportPrintPdf?: (document: CvDocument) => Promise<void>
  supportsPrintPdf: boolean
}

const templateDefinitionMap: Record<TemplateId, TemplateDefinition> = {
  cambridge: {
    id: 'cambridge',
    label: 'Cambridge',
    PreviewComponent: CambridgeTemplate,
    PrintComponent: CambridgePrintDocument,
    exportPrintPdf: exportCambridgePrintPdf,
    supportsPrintPdf: true,
  },
  minimal: {
    id: 'minimal',
    label: 'Minimal',
    PreviewComponent: MinimalTemplate,
    supportsPrintPdf: false,
  },
  atlas: {
    id: 'atlas',
    label: 'Atlas',
    PreviewComponent: AtlasTemplate,
    supportsPrintPdf: false,
  },
}

export const templateRegistry = templateIds.map((templateId) => templateDefinitionMap[templateId])

export const getTemplateDefinition = (templateId: TemplateId) => templateDefinitionMap[templateId]
