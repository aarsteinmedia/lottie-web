import { BlendMode } from '@/utils/enums'

interface BlendModeEnums { [key: number]: string }

export function getBlendMode(mode = 0, isCanvas = false) {
  const blendModeEnums: BlendModeEnums = {
    [BlendMode.Add]: isCanvas ? 'lighter' : 'add',
    [BlendMode.Color]: 'color',
    [BlendMode.ColorBurn]: 'color-burn',
    [BlendMode.ColorDodge]: 'color-dodge',
    [BlendMode.Darken]: 'darken',
    [BlendMode.Difference]: 'difference',
    [BlendMode.Exclusion]: 'exclusion',
    [BlendMode.HardLight]: 'hard-light',
    [BlendMode.HardMix]: 'hard-mix',
    [BlendMode.Hue]: 'hue',
    [BlendMode.Lighten]: 'lighten',
    [BlendMode.Luminosity]: 'luminosity',
    [BlendMode.Multiply]: 'multiply',
    [BlendMode.Normal]: isCanvas ? 'source-over' : 'normal',
    [BlendMode.Overlay]: 'overlay',
    [BlendMode.Saturation]: 'saturation',
    [BlendMode.Screen]: 'screen',
    [BlendMode.SoftLight]: 'soft-light',
  }

  return blendModeEnums[mode] ?? 'normal'
}