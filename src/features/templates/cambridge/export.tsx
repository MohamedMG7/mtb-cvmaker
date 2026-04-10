import { renderToStaticMarkup } from 'react-dom/server'
import type { CvDocument } from '../../../lib/schema/cv'
import { printHtmlDocument } from '../../export/print'
import { CambridgePrintDocument } from './print'
import cambridgePrintStyles from './print.css?inline'

const getFileStem = (document: CvDocument) =>
  `${document.metadata.title || 'cv'}`.trim().replace(/\s+/g, '-').toLowerCase()

export const renderCambridgePrintDocument = (document: CvDocument) =>
  renderToStaticMarkup(<CambridgePrintDocument document={document} />)

export const exportCambridgePrintPdf = async (document: CvDocument) => {
  await printHtmlDocument({
    title: `${getFileStem(document)}.pdf`,
    markup: renderCambridgePrintDocument(document),
    styles: [cambridgePrintStyles],
  })
}
