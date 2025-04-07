import type AnimationItem from '@/animation/AnimationItem'
import type {
  AnimationConfiguration,
  AnimationData,
  AnimationDirection,
  AnimationSettings,
  ExpressionsPlugin,
  LottieAsset,
  LottieManifest,
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
import SVGDropShadowEffect from '@/effects/svg/SVGDropShadowEffect'
import SVGFillFilter from '@/effects/svg/SVGFillFilter'
import SVGGaussianBlurEffect from '@/effects/svg/SVGGaussianBlurEffect'
import SVGMatte3Effect from '@/effects/svg/SVGMatte3Effect'
import SVGProLevelsFilter from '@/effects/svg/SVGProLevelsFilter'
import SVGStrokeEffect from '@/effects/svg/SVGStrokeEffect'
import SVGTintFilter from '@/effects/svg/SVGTintFilter'
import SVGTransformEffect from '@/effects/svg/SVGTransformEffect'
import SVGTritoneFilter from '@/effects/svg/SVGTritoneFilter'
import CVTransformEffect from '@/elements/canvas/effects/CVTransformEffect'
import { RendererType } from '@/enums'
import CanvasRenderer from '@/renderers/CanvasRenderer'
import HybridRenderer from '@/renderers/HybridRenderer'
import SVGRenderer from '@/renderers/SVGRenderer'
import { isServer } from '@/utils'
import Expressions from '@/utils/expressions/Expressions'
import getInterface from '@/utils/expressions/InterfacesProvider'
import {
  registerEffect,
  registerRenderer,
  setExpressionInterfaces,
  setExpressionsPlugin,
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

export function installPlugin(type: string, plugin: ExpressionsPlugin) {
  if (type === 'expressions') {
    setExpressionsPlugin(plugin)
  }
}

export function setSubframeRendering(flag: boolean) {
  setSubframeEnabled(flag)
}

const Lottie = {
  destroy,
  freeze,
  getRegisteredAnimations,
  goToAndStop,
  installPlugin,
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
registerRenderer(RendererType.Canvas, CanvasRenderer)
registerRenderer(RendererType.HTML, HybridRenderer)
registerRenderer(RendererType.SVG, SVGRenderer)

// Registering shape modifiers
registerModifier('tm', TrimModifier)
registerModifier('pb', PuckerAndBloatModifier)
registerModifier('rp', RepeaterModifier)
registerModifier('rd', RoundCornersModifier)
registerModifier('zz', ZigZagModifier)
registerModifier('op', OffsetPathModifier)

// Registering expression plugin
// setExpressionsPlugin(Expressions)
// setExpressionInterfaces(getInterface)
// initialize$1()
// initialize()

// Registering effects
registerEffect(20, SVGTintFilter, true)
registerEffect(21, SVGFillFilter, true)
registerEffect(22, SVGStrokeEffect, false)
registerEffect(23, SVGTritoneFilter, true)
registerEffect(24, SVGProLevelsFilter, true)
registerEffect(25, SVGDropShadowEffect, true)
registerEffect(28, SVGMatte3Effect, false)
registerEffect(29, SVGGaussianBlurEffect, true)
registerEffect(35, SVGTransformEffect, false)
registerEffect(35, CVTransformEffect)

export type {
  AnimationConfiguration,
  AnimationItem,
  AnimationData,
  AnimationDirection,
  AnimationSettings,
  LottieAsset,
  LottieManifest,
  Vector2,
}

// import Lottie from './lottie.min'

export default Lottie
