


// import addPropertyDecorator from '@/utils/expressions/ExpressionPropertyDecorator'
import type Expressions from '@/utils/expressions/Expressions'

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
import { Modifier, RendererType } from '@/enums'
import CanvasRenderer from '@/renderers/CanvasRenderer'
import HybridRenderer from '@/renderers/HybridRenderer'
import SVGRenderer from '@/renderers/SVGRenderer'
import { isServer } from '@/utils'
// import addTextDecorator from '@/utils/expressions/ExpressionTextPropertyDecorator'
// import getInterface from '@/utils/expressions/InterfacesProvider'
import {
  registerEffect,
  registerRenderer,
  // setExpressionInterfaces,
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

export const installPlugin = (type: string, plugin: typeof Expressions) => {
    if (type === 'expressions') {
      setExpressionsPlugin(plugin)
    }
  },

  setSubframeRendering = (flag: boolean) => {
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

const readyStateCheckInterval = setInterval(checkReady, 100)

function checkReady() {
  if (isServer()) {
    return
  }
  if (document.readyState === 'complete') {
     
    clearInterval(readyStateCheckInterval)
    searchAnimations()
  }
}

// Registering renderers
registerRenderer(RendererType.Canvas, CanvasRenderer)
registerRenderer(RendererType.HTML, HybridRenderer)
registerRenderer(RendererType.SVG, SVGRenderer)

// Registering shape modifiers
registerModifier(Modifier.TrimModifier, TrimModifier)
registerModifier(Modifier.PuckerAndBloatModifier, PuckerAndBloatModifier)
registerModifier(Modifier.RepeaterModifier, RepeaterModifier)
registerModifier(Modifier.RoundCornersModifier, RoundCornersModifier)
registerModifier(Modifier.ZigZagModifier, ZigZagModifier)
registerModifier(Modifier.OffsetPathModifier, OffsetPathModifier)

// Registering expression plugin
// setExpressionsPlugin(Expressions)
// setExpressionInterfaces(getInterface)
// addPropertyDecorator()
// addTextDecorator()

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