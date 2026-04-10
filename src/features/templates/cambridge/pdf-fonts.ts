import { Font } from '@react-pdf/renderer'
import alegreyaSans400 from '@fontsource/alegreya-sans/files/alegreya-sans-latin-400-normal.woff'
import alegreyaSans500 from '@fontsource/alegreya-sans/files/alegreya-sans-latin-500-normal.woff'
import alegreyaSans700 from '@fontsource/alegreya-sans/files/alegreya-sans-latin-700-normal.woff'
import literata400 from '@fontsource/literata/files/literata-latin-400-normal.woff'
import literata500 from '@fontsource/literata/files/literata-latin-500-normal.woff'
import literata700 from '@fontsource/literata/files/literata-latin-700-normal.woff'
import spectral400 from '@fontsource/spectral/files/spectral-latin-400-normal.woff'
import spectral500 from '@fontsource/spectral/files/spectral-latin-500-normal.woff'
import spectral700 from '@fontsource/spectral/files/spectral-latin-700-normal.woff'

let fontsRegistered = false

export const initializeCambridgePdfFonts = () => {
  if (fontsRegistered) {
    return
  }

  Font.register({
    family: 'Literata',
    fonts: [
      { src: literata400, fontWeight: 400 },
      { src: literata500, fontWeight: 500 },
      { src: literata700, fontWeight: 700 },
    ],
  })

  Font.register({
    family: 'Spectral',
    fonts: [
      { src: spectral400, fontWeight: 400 },
      { src: spectral500, fontWeight: 500 },
      { src: spectral700, fontWeight: 700 },
    ],
  })

  Font.register({
    family: 'Alegreya Sans',
    fonts: [
      { src: alegreyaSans400, fontWeight: 400 },
      { src: alegreyaSans500, fontWeight: 500 },
      { src: alegreyaSans700, fontWeight: 700 },
    ],
  })

  fontsRegistered = true
}

export const getCambridgePdfFontFamily = (fontFamily: string) => {
  if (fontFamily === 'Alegreya Sans' || fontFamily === 'Literata' || fontFamily === 'Spectral') {
    return fontFamily
  }

  if (fontFamily === 'Calibri') {
    return 'Alegreya Sans'
  }

  return 'Literata'
}
