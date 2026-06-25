import { SVGRenderer } from '@/renderers/SVGRenderer'
import { createLottie } from '@/utils/createLottie'
import { RendererType } from '@/utils/enums'

const { Lottie, setSubframeRendering } = createLottie({
  effects: [],
  renderers: [{
    renderer: SVGRenderer,
    rendererType: RendererType.SVG
  }]
})

export { setSubframeRendering }
export { loadAnimation } from '@/animation/AnimationManager'

// eslint-disable-next-line import/no-default-export
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
  HTMLBooleanAttribute,
  HTMLRendererConfig,
  LottieAnimation,
  LottieAsset,
  LottieManifest,
  Result,
  SVGRendererConfig,
  Vector2
} from '@/types'