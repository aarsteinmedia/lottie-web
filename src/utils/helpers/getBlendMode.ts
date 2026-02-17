interface BlendModeEnums { [key: number]: string }

export function getBlendMode(mode = 16) {
  const blendModeEnums: BlendModeEnums = {
    0: 'source-over',
    1: 'multiply',
    10: 'difference',
    11: 'exclusion',
    12: 'hue',
    13: 'saturation',
    14: 'color',
    15: 'luminosity',
    2: 'screen',
    3: 'overlay',
    4: 'darken',
    5: 'lighten',
    6: 'color-dodge',
    7: 'color-burn',
    8: 'hard-light',
    9: 'soft-light',
  }

  return blendModeEnums[mode] || ''
}