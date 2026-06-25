import { CVTransformEffect } from '@/effects/canvas/CVTransformEffect'
import { SVGDropShadowEffect } from '@/effects/svg/SVGDropShadowEffect'
import { SVGFillFilter } from '@/effects/svg/SVGFillFilter'
import { SVGGaussianBlurEffect } from '@/effects/svg/SVGGaussianBlurEffect'
import { SVGMatte3Effect } from '@/effects/svg/SVGMatte3Effect'
import { SVGProLevelsFilter } from '@/effects/svg/SVGProLevelsFilter'
import { SVGStrokeEffect } from '@/effects/svg/SVGStrokeEffect'
import { SVGTintFilter } from '@/effects/svg/SVGTintFilter'
import { SVGTransformEffect } from '@/effects/svg/SVGTransformEffect'
import { SVGTritoneFilter } from '@/effects/svg/SVGTritoneFilter'
import { CanvasRenderer } from '@/renderers/CanvasRenderer'
import { SVGRenderer } from '@/renderers/SVGRenderer'
import { createLottie } from '@/utils/createLottie'
import { RendererType } from '@/utils/enums'
import {
  setExpressionInterfaces,
  setExpressionsPlugin,
} from '@/utils/expressions'
import addPropertyDecorator from '@/utils/expressions/ExpressionPropertyDecorator'
import Expressions from '@/utils/expressions/Expressions'
import addTextDecorator from '@/utils/expressions/ExpressionTextPropertyDecorator'
import { getInterface } from '@/utils/expressions/InterfacesProvider'

export const installPlugin = (type: string, plugin: typeof Expressions) => {
  if (type === 'expressions') {
    setExpressionsPlugin(plugin)
  }
}

const { Lottie, setSubframeRendering } = createLottie({
  effects: [
    {
      countsAsEffect: true,
      effect: SVGTintFilter,
      id: 20
    },
    {
      countsAsEffect: true,
      effect: SVGFillFilter,
      id: 21
    },
    {
      effect: SVGStrokeEffect,
      id: 21,
    },
    {
      countsAsEffect: true,
      effect: SVGTritoneFilter,
      id: 23
    },
    {
      countsAsEffect: true,
      effect: SVGProLevelsFilter,
      id: 24
    },
    {
      countsAsEffect: true,
      effect: SVGDropShadowEffect,
      id: 25
    },
    {
      effect: SVGMatte3Effect,
      id: 28,
    },
    {
      countsAsEffect: true,
      effect: SVGGaussianBlurEffect,
      id: 29
    },
    {
      effect: SVGTransformEffect,
      id: 35,
    },
    {
      effect: CVTransformEffect,
      id: 35,
      isCanvas: true
    }
  ],
  expressions: {
    installPlugin,
    registerExpressions: () => {
      setExpressionsPlugin(Expressions)
      setExpressionInterfaces(getInterface)
      addPropertyDecorator()
      addTextDecorator()
    }
  },
  renderers: [{
    renderer: SVGRenderer,
    rendererType: RendererType.SVG
  }, {
    renderer: CanvasRenderer,
    rendererType: RendererType.Canvas
  }
  ]
})

// eslint-disable-next-line import/no-default-export
export default Lottie

export { setSubframeRendering }
export { type AnimationItem } from '@/animation/AnimationItem'
export { loadAnimation } from '@/animation/AnimationManager'
export type {
  AddAnimationParams,
  AnimationConfiguration,
  AnimationData,
  AnimationDirection,
  Vector2 as AnimationSegment,
  AnimationSettings,
  CanvasRendererConfig,
  ConvertParams,
  HTMLBooleanAttribute,
  HTMLRendererConfig,
  LottieAnimation,
  LottieAsset,
  LottieManifest,
  Result,
  SVGRendererConfig,
  Vector2
} from '@/types'