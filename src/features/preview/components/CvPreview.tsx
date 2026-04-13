import { getTemplateDefinition } from '../../templates/registry'
import type { CvPreviewProps } from '../../templates/previews'

export const CvPreview = ({ document }: CvPreviewProps) => {
  const { PreviewComponent } = getTemplateDefinition(document.theme.templateId)
  return <PreviewComponent document={document} />
}
