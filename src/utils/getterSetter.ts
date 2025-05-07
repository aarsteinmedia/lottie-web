import type CanvasRenderer from '@/renderers/CanvasRenderer'
import type HybridRenderer from '@/renderers/HybridRenderer'
import type SVGRenderer from '@/renderers/SVGRenderer'
import type {
  EffectElement,
  ExpressionInterface,
  ExpressionInterfaces,
  GetInterface,
} from '@/types'
import type Expressions from '@/utils/expressions/Expressions'

import { RendererType } from '@/utils/enums'

export const initialDefaultFrame = -999999,
  roundCorner = 0.5519

/**
 *
 * Expressions plugin/interface.
 */
const expressions: {
  interface: null | GetInterface
  plugin: null | typeof Expressions
} = {
  interface: null,
  plugin: null,
}

export const setExpressionsPlugin = (value: typeof Expressions) => {
    expressions.plugin = value
  },
  getExpressionsPlugin = () => expressions.plugin,
  setExpressionInterfaces = (getInterface: (type: keyof ExpressionInterfaces) => ExpressionInterface) => {
    expressions.interface = getInterface
  },
  getExpressionInterfaces = () => expressions.interface
/**
 *
 * Curve segments.
 */
const curveSegments = { default: 150, }

export const setDefaultCurveSegments = (value: number) => {
    curveSegments.default = value
  },
  getDefaultCurveSegments = () => curveSegments.default
/**
 *
 * Web worker.
 */
const isWebWorkerActive = { current: false, }

export const setWebWorker = (flag: boolean) => {
    isWebWorkerActive.current = flag
  },
  getWebWorker = () => isWebWorkerActive.current
/**
 *
 * Subframe.
 */
const isSubframeEnabled = { current: true, }

export const setSubframeEnabled = (flag: boolean) => {
    isSubframeEnabled.current = flag
  },
  getSubframeEnabled = () => isSubframeEnabled.current
/**
 *
 * Renderer.
 */
type Renderer =
  | typeof SVGRenderer
  | typeof CanvasRenderer
  | typeof HybridRenderer
const renderers: {
  [key in RendererType]?: Renderer
} = {}

export const registerRenderer = (key: RendererType, value: Renderer) => {
    renderers[key] = value
  },
  getRenderer = (key: RendererType) => {
    if (!renderers[key]) {
      throw new Error('Could not get renderer')
    }

    return renderers[key]
  },
  getRegisteredRenderer = () => {
    // Returns canvas by default for compatibility
    if (renderers.canvas) {
      return RendererType.Canvas
    }
    // Returns any renderer that is registered

    const keys = Object.keys(renderers),
      { length } = keys

    for (let i = 0; i < length; i++) {
      if (renderers[keys[i] as RendererType]) {
        return keys[i] as RendererType
      }
    }

    return RendererType.SVG
  }
/**
 *
 * Location HREF.
 */
const locationHref = { current: '', }

export const setLocationHref = (value: string) => {
    locationHref.current = value
  },
  getLocationHref = () => locationHref.current
/**
 *
 * Effects.
 */
export const registeredEffects: {
    [id: string]: {
      countsAsEffect?: boolean
      effect: EffectElement
    } | undefined
  } = {},
  registerEffect = (
    id: number,
    effect: EffectElement,
    countsAsEffect?: boolean
  ) => {
    registeredEffects[id] = {
      countsAsEffect,
      effect,
    }
  }

/**
 *
 * Quality.
 */
const shouldRoundValues = { current: false, }

export const getShouldRoundValues = () => shouldRoundValues.current,
  setShouldRoundValues = (value: boolean) => {
    shouldRoundValues.current = value
  },
  setQuality = (value: string | number) => {
    if (typeof value === 'string') {
      switch (value) {
        case 'high': {
          setDefaultCurveSegments(200)
          break
        }
        default:
        case 'medium': {
          setDefaultCurveSegments(50)
          break
        }
        case 'low': {
          setDefaultCurveSegments(10)
          break
        }
      }
    } else if (!isNaN(value) && value > 1) {
      setDefaultCurveSegments(value)
    }

    setShouldRoundValues(getDefaultCurveSegments() < 50)
  }
