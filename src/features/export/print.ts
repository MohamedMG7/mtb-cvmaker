type PrintHtmlOptions = {
  title: string
  markup: string
  styles: string[]
}

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const buildPrintDocument = ({ title, markup, styles }: PrintHtmlOptions) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>${styles.join('\n')}</style>
  </head>
  <body>${markup}</body>
</html>`

export const printHtmlDocument = async (options: PrintHtmlOptions) => {
  const iframe = window.document.createElement('iframe')
  iframe.setAttribute('aria-hidden', 'true')
  iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden'

  const loadPromise = new Promise<void>((resolve, reject) => {
    iframe.addEventListener('load', () => resolve(), { once: true })
    iframe.addEventListener('error', () => reject(new Error('Could not prepare the print document.')), {
      once: true,
    })
  })

  window.document.body.appendChild(iframe)
  iframe.srcdoc = buildPrintDocument(options)

  try {
    await loadPromise

    const printWindow = iframe.contentWindow
    const printDocument = iframe.contentDocument

    if (!printWindow || !printDocument) {
      throw new Error('Could not access the print document.')
    }

    if ('fonts' in printDocument) {
      await printDocument.fonts.ready
    }

    await new Promise((resolve) => window.setTimeout(resolve, 100))

    await new Promise<void>((resolve) => {
      const cleanup = () => {
        iframe.remove()
        resolve()
      }

      printWindow.addEventListener('afterprint', cleanup, { once: true })
      printWindow.focus()
      printWindow.print()
    })
  } catch (error) {
    iframe.remove()
    throw error
  }
}
