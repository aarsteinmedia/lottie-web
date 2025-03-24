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
import { RendererType } from '@/enums'
import SVGRenderer from '@/renderers/SVGRenderer'
import { inBrowser, isServer } from '@/utils'
import {
  createElementID,
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

export {
  createElementID,
  inBrowser,
  setIDPrefix,
  setLocationHref,
  setQuality,
  setWebWorker as useWebWorker,
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
  loadAnimation,
  version,
}
/**
 *
 */
export function setSubframeRendering(flag: boolean) {
  setSubframeEnabled(flag)
}

const LottieLight = {
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
      clearInterval(readyStateCheckInterval)
      searchAnimations()
    }
  },
  readyStateCheckInterval = setInterval(checkReady, 100)

// Registering renderers
registerRenderer(RendererType.SVG, SVGRenderer)

// Registering shape modifiers
registerModifier('tm', TrimModifier)
registerModifier('pb', PuckerAndBloatModifier)
registerModifier('rp', RepeaterModifier)
registerModifier('rd', RoundCornersModifier)
registerModifier('zz', ZigZagModifier)
registerModifier('op', OffsetPathModifier)

export default LottieLight
