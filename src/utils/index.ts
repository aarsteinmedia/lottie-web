import type {
  PoolElement,
  Vector2,
} from '@/types'
import type ShapePath from '@/utils/shapes/ShapePath'

import { getIDPrefix } from '@/utils/helpers/prefix'

/**
 * Exported functions that are also used locally.
 */
export const floatEqual = (a: number, b: number) =>
    Math.abs(a - b) * 100000 <= Math.min(Math.abs(a), Math.abs(b)),

  floatZero = (f: number) => Math.abs(f) <= 0.00001,

  isServer = () => !(typeof window !== 'undefined' && document),

  pointEqual = (p1: Vector2, p2: Vector2) =>
    floatEqual(p1[0], p2[0]) && floatEqual(p1[1], p2[1]),

  createElementID = (() => {
    let _count = 0

    return () => {
      _count++

      return `${getIDPrefix()}__lottie_element_${_count}`
    }
  })(),

  clamp = (
    n: number, minFromProps = 0, maxFromProps = 100
  ) => {
    let min = minFromProps,
      max = maxFromProps

    if (min > max) {
      const mm = max

      max = min
      min = mm
    }

    return Math.min(Math.max(n, min), max)
  },

  inBrowser = () => typeof navigator !== 'undefined',

  isArray = <T>(input: unknown): input is T[] => {
    return Symbol.iterator in Object(input) && (input as unknown[]).length > 0
  },

  /** Check if value is array. Made to work with typed arrays as well as regular. */
  isArrayOfNum = (input: unknown): input is number[] => {
    return isArray(input) &&
      typeof input[0] === 'number'
  },

  isDeclaration = (str: string) => {
    return str === 'var' || str === 'let' || str === 'const'
  },

  isShapePath =(el?: PoolElement): el is ShapePath => {

    if (!el || isArray(el)) {
      return false
    }

    return el.constructor.name === 'ShapePath'

  },

  isSafari = (): boolean => {
    const isTrue = inBrowser()
      ? /^(?:(?!chrome|android).)*safari/i.test(navigator.userAgent)
      : false

    return isTrue
  },

  rgbToHex = (
    rVal: number, gVal: number, bVal: number
  ) => {
    const colorMap: string[] = []
    let hex

    for (let i = 0; i < 256; i++) {
      hex = i.toString(16)
      colorMap[i] = hex.length === 1 ? `0${hex}` : hex
    }

    let r = rVal,
      g = gVal,
      b = bVal

    if (rVal < 0) {
      r = 0
    }
    if (gVal < 0) {
      g = 0
    }
    if (bVal < 0) {
      b = 0
    }

    return `#${colorMap[r]}${colorMap[g]}${colorMap[b]}`
  },

  styleDiv = (element: HTMLElement | SVGSVGElement) => {
    element.style.position = 'absolute'
    element.style.top = '0'
    element.style.left = '0'
    element.style.display = 'block'
    element.style.transformOrigin = '0 0'
    element.style.backfaceVisibility = 'visible'
    element.style.transformStyle = 'preserve-3d'
  }
