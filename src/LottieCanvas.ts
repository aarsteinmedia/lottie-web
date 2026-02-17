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
import { CVTransformEffect } from '@/effects/canvas/CVTransformEffect'
import { registerEffect } from '@/elements/canvas/CVEffects'
import { registerRenderer } from '@/renderers'
import { CanvasRenderer } from '@/renderers/CanvasRenderer'
import { Modifier, RendererType } from '@/utils/enums'
import {
  setExpressionInterfaces,
  setExpressionsPlugin,
} from '@/utils/expressions'
import addPropertyDecorator from '@/utils/expressions/ExpressionPropertyDecorator'
import Expressions from '@/utils/expressions/Expressions'
import addTextDecorator from '@/utils/expressions/ExpressionTextPropertyDecorator'
import { getInterface } from '@/utils/expressions/InterfacesProvider'
import { isServer } from '@/utils/helpers/constants'
import { setLocationHref } from '@/utils/helpers/locationHref'
import { setIDPrefix as setPrefix } from '@/utils/helpers/prefix'
import { setQuality } from '@/utils/helpers/resolution'
import { setSubframeEnabled } from '@/utils/helpers/subframe'
import { setWebWorker } from '@/utils/helpers/worker'
import { registerModifier } from '@/utils/shapes/modifiers'
import { OffsetPathModifier } from '@/utils/shapes/modifiers/OffsetPathModifier'
import { PuckerAndBloatModifier } from '@/utils/shapes/modifiers/PuckerAndBloatModifier'
import { RepeaterModifier } from '@/utils/shapes/modifiers/RepeaterModifier'
import { RoundCornersModifier } from '@/utils/shapes/modifiers/RoundCornersModifier'
import { TrimModifier } from '@/utils/shapes/modifiers/TrimModifier'
import { ZigZagModifier } from '@/utils/shapes/modifiers/ZigZagModifier'

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
  setLocationHref,
  setPrefix,
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
  if (isServer) {
    return
  }
  if (document.readyState === 'complete') {

    clearInterval(readyStateCheckInterval)
    searchAnimations()
  }
}

// Registering renderers
registerRenderer(RendererType.Canvas, CanvasRenderer)

// Registering shape modifiers
registerModifier(Modifier.TrimModifier, TrimModifier)
registerModifier(Modifier.PuckerAndBloatModifier, PuckerAndBloatModifier)
registerModifier(Modifier.RepeaterModifier, RepeaterModifier)
registerModifier(Modifier.RoundCornersModifier, RoundCornersModifier)
registerModifier(Modifier.ZigZagModifier, ZigZagModifier)
registerModifier(Modifier.OffsetPathModifier, OffsetPathModifier)

// Registering expression plugin
setExpressionsPlugin(Expressions)
setExpressionInterfaces(getInterface)
addPropertyDecorator()
addTextDecorator()

// Registering effects
registerEffect(35, CVTransformEffect)

export { loadAnimation }

export default Lottie

export { type AnimationItem } from '@/animation/AnimationItem'
export type {
  AddAnimationParams,
  AnimationConfiguration,
  AnimationData,
  AnimationDirection,
  Vector2 as AnimationSegment,
  AnimationSettings,
  ConvertParams,
  LottieAnimation,
  LottieAsset,
  LottieManifest,
  Result,
  Vector2
} from '@/types'