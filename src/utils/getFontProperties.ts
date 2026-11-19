import type { FontList } from '@/types'

export function getFontProperties(fontData: FontList) {
  const styles = fontData.fStyle ? fontData.fStyle.split(' ') : []

  let fWeight = 'normal',
    fStyle = 'normal'

  for (let i = 0; i < styles.length; i++) {
    switch (styles[i]?.toLowerCase()) {
      case 'italic': {
        fStyle = 'italic'
        break
      }
      case 'bold': {
        fWeight = '700'
        break
      }
      case 'black': {
        fWeight = '900'
        break
      }
      case 'medium': {
        fWeight = '500'
        break
      }
      case 'regular':
      case 'normal': {
        fWeight = '400'
        break
      }
      case 'light':
      case 'thin': {
        fWeight = '200'
        break
      }
      default: {
        break
      }
    }
  }

  return {
    style: fStyle,
    weight: fontData.fWeight || fWeight,
  }
}
