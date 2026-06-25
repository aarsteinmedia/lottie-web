import { CVTransformEffect } from '@/effects/canvas/CVTransformEffect'
import { CanvasRenderer } from '@/renderers/CanvasRenderer'
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
  Vector2
} from '@/types'