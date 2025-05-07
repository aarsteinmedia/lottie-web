import {
  play,
  pause,
  togglePause,
  setSpeed,
  setDirection,
  stop,
  registerAnimation,
  resize,
  goToAndStop,
  destroy,
  freeze,
  unfreeze,
  setVolume,
  mute,
  unmute,
  getRegisteredAnimations,
  searchAnimations,
  loadAnimation,
} from '@/animation/AnimationManager'
import SVGRenderer from '@/renderers/SVGRenderer'
import { inBrowser, isServer } from '@/utils'
import { Modifier, RendererType } from '@/utils/enums'
import {
  registerRenderer,
  setIDPrefix,
  setLocationHref,
  setQuality,
  setSubframeEnabled,
  setWebWorker,
} from '@/utils/getterSetter'
import OffsetPathModifier from '@/utils/shapes/OffsetPathModifier'
import PuckerAndBloatModifier from '@/utils/shapes/PuckerAndBloatModifier'
import RepeaterModifier from '@/utils/shapes/RepeaterModifier'
import RoundCornersModifier from '@/utils/shapes/RoundCornersModifier'
import { registerModifier } from '@/utils/shapes/ShapeModifiers'
import TrimModifier from '@/utils/shapes/TrimModifier'
import ZigZagModifier from '@/utils/shapes/ZigZagModifier'

const version = '[[BM_VERSION]]'

export const setSubframeRendering = (flag: boolean) => {
  setSubframeEnabled(flag)
}

const Lottie = {
  destroy,
  freeze,
  getRegisteredAnimations,
  goToAndStop,
  inBrowser,
  loadAnimation,
  mute,
  pause,
  play,
  registerAnimation,
  resize,
  setDirection,
  setIDPrefix,
  setLocationHref,
  setQuality,
  setSpeed,
  setSubframeRendering,
  setVolume,
  stop,
  togglePause,
  unfreeze,
  unmute,
  useWebWorker: setWebWorker,
  version,
}

const checkReady = () => {
    if (isServer()) {
      return
    }
    if (document.readyState === 'complete') {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      clearInterval(readyStateCheckInterval)
      searchAnimations()
    }
  },
  readyStateCheckInterval = setInterval(checkReady, 100)

// Registering renderers
registerRenderer(RendererType.SVG, SVGRenderer)

// Registering shape modifiers
registerModifier(Modifier.TrimModifier, TrimModifier)
registerModifier(Modifier.PuckerAndBloatModifier, PuckerAndBloatModifier)
registerModifier(Modifier.RepeaterModifier, RepeaterModifier)
registerModifier(Modifier.RoundCornersModifier, RoundCornersModifier)
registerModifier(Modifier.ZigZagModifier, ZigZagModifier)
registerModifier(Modifier.OffsetPathModifier, OffsetPathModifier)


export default Lottie

export { type default as AnimationItem } from '@/animation/AnimationItem'
export type {
  AnimationConfiguration,
  AnimationData,
  AnimationDirection,
  AnimationSettings,
  LottieAsset,
  LottieManifest,
  Vector2
} from '@/types'