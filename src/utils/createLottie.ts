import type { EffectElement } from '@/types'
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
import { registerEffect as registerCanvasEffect } from '@/elements/canvas/CVEffects'
import { registerEffect } from '@/elements/svg/SVGEffects'
import { registerRenderer, type Renderer } from '@/renderers'
import { type RendererType, Modifier } from '@/utils/enums'
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

const version = '[[BM_VERSION]]',
  setSubframeRendering = (flag: boolean) => {
    setSubframeEnabled(flag)
  }

interface RendererParams {
  renderer: Renderer
  rendererType: RendererType
}
interface ExpressionParams {
  installPlugin: (type: string, plugin: typeof Expressions) => void
  registerExpressions: () => void
}
interface EffectParams {
  countsAsEffect?: boolean
  effect: EffectElement
  id: number
  isCanvas?: boolean
}
interface CreateLottie {
  effects: EffectParams[]
  expressions?: ExpressionParams
  renderers: RendererParams[]
}

(function checkReady() {
  if (isServer) {
    return
  }
  if (document.readyState === 'complete') {
    searchAnimations()
  } else {
    addEventListener(
      'DOMContentLoaded', () => {
        searchAnimations()
      }, { once: true }
    )
  }
})()

export function createLottie({
  effects,
  expressions,
  renderers
}: CreateLottie) {
  const Lottie = {
    destroy,
    freeze,
    getRegisteredAnimations,
    goToAndStop,
    installPlugin: expressions?.installPlugin,
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

  // Registering renderers
  renderers.forEach(({ renderer, rendererType }) => {
    registerRenderer(rendererType, renderer)
  })

  // Registering shape modifiers
  registerModifier(Modifier.TrimModifier, TrimModifier)
  registerModifier(Modifier.PuckerAndBloatModifier, PuckerAndBloatModifier)
  registerModifier(Modifier.RepeaterModifier, RepeaterModifier)
  registerModifier(Modifier.RoundCornersModifier, RoundCornersModifier)
  registerModifier(Modifier.ZigZagModifier, ZigZagModifier)
  registerModifier(Modifier.OffsetPathModifier, OffsetPathModifier)

  // Registering expression plugin
  expressions?.registerExpressions()

  // Registering effects
  effects.forEach(({
    countsAsEffect, effect, id, isCanvas
  }) => {
    if (isCanvas) {
      registerCanvasEffect(id, effect)
    } else {
      registerEffect(
        id, effect, countsAsEffect
      )
    }
  })

  return {
    installPlugin: expressions?.installPlugin,
    Lottie,
    setSubframeRendering
  }
}