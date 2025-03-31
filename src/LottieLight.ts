import type AnimationItem from '@/animation/AnimationItem'
import type {
  AnimationConfiguration,
  AnimationData,
  AnimationDirection,
  AnimationSettings,
  Vector2,
} from '@/types'

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

export function setSubframeRendering(flag: boolean) {
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

export type {
  AnimationConfiguration,
  AnimationItem,
  AnimationData,
  AnimationDirection,
  AnimationSettings,
  Vector2,
}

export default Lottie
