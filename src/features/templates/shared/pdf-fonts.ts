export const initializePdfFonts = () => {
  // The current editor font choices map to the built-in PDF font families.
}

export const getPdfFontFamily = (fontFamily: string) => {
  if (fontFamily === 'Times New Roman' || fontFamily === 'Literata' || fontFamily === 'Spectral') {
    return 'Times-Roman'
  }

  return 'Helvetica'
}
