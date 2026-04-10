import type { ComponentType } from 'react'
import { templateIds, type TemplateId } from '../../lib/schema/cv'
import { AtlasTemplate, CambridgeTemplate, MinimalTemplate, type CvPreviewProps } from './previews'

export type TemplateDefinition = {
  id: TemplateId
  label: string
  PreviewComponent: ComponentType<CvPreviewProps>
  supportsPrintPdf: boolean
}

const templateDefinitionMap: Record<TemplateId, TemplateDefinition> = {
  cambridge: {
    id: 'cambridge',
    label: 'Cambridge',
    PreviewComponent: CambridgeTemplate,
    supportsPrintPdf: false,
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
