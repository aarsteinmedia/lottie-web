import {
  afterEach, beforeAll, describe, expect, test
} from 'vitest'
import 'vitest-canvas-mock'

import { namespaceSVG } from '@/utils/helpers/constants'

interface AnimatedLength {
  animVal: { value: number }
  baseVal: { value: number }
}

const defineAnimatedLengthProperty = (proto: object, key: 'x' | 'y' | 'width' | 'height' | 'rx' | 'ry') => {
    Object.defineProperty(
      proto, key, {
        configurable: true,
        get() {
          const storeKey = `__mock_${key}`

          if (!(storeKey in this)) {
            Object.defineProperty(
              this, storeKey, {
                configurable: true,
                value: {
                  animVal: { value: 0 },
                  baseVal: { value: 0 },
                } satisfies AnimatedLength,
              }
            )
          }

          return (this as Record<string, AnimatedLength>)[storeKey]
        },
      }
    )
  },
  defineNumericBaseValProperty = (proto: object, key: 'dx' | 'dy') => {
    Object.defineProperty(
      proto, key, {
        configurable: true,
        get() {
          const storeKey = `__mock_${key}`

          if (!(storeKey in this)) {
            Object.defineProperty(
              this, storeKey, {
                configurable: true,
                value: { baseVal: 0 },
              }
            )
          }

          return (this as Record<string, { baseVal: number }>)[storeKey]
        },
      }
    )
  },
  defineStringBaseValProperty = (proto: object, key: 'in2' | 'result') => {
    Object.defineProperty(
      proto, key, {
        configurable: true,
        get() {
          const storeKey = `__mock_${key}`

          if (!(storeKey in this)) {
            Object.defineProperty(
              this, storeKey, {
                configurable: true,
                value: { baseVal: '' },
              }
            )
          }

          return (this as Record<string, { baseVal: string }>)[storeKey]
        },
      }
    )
  },
  defineHrefBaseVal = (proto: object) => {
    Object.defineProperty(
      proto, 'href', {
        configurable: true,
        get() {
          if (!('__mock_href' in this)) {
            Object.defineProperty(
              this, '__mock_href', {
                configurable: true,
                value: {
                  animVal: '',
                  baseVal: '',
                },
              }
            )
          }

          return (this as Record<string, {
            baseVal: string
            animVal: string
          }>).__mock_href
        },
      }
    )
  }

describe('setup', () => {
  beforeAll(() => {
    // JSDOM creates SVG nodes via createElementNS but does not expose subtype
    // globals (SVGRectElement, etc.) or animated length properties (baseVal).
    // All SVG elements share the generic SVGElement prototype, so patch that.
    const svgProto = Object.getPrototypeOf(document.createElementNS(namespaceSVG, 'rect')) as object

    defineAnimatedLengthProperty(svgProto, 'x')
    defineAnimatedLengthProperty(svgProto, 'y')
    defineAnimatedLengthProperty(svgProto, 'width')
    defineAnimatedLengthProperty(svgProto, 'height')
    defineNumericBaseValProperty(svgProto, 'dx')
    defineNumericBaseValProperty(svgProto, 'dy')
    defineStringBaseValProperty(svgProto, 'in2')
    defineStringBaseValProperty(svgProto, 'result')
    defineHrefBaseVal(svgProto)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  test('polyfills SVG animated properties for JSDOM', () => {
    const rect = document.createElementNS(namespaceSVG, 'rect')

    rect.width.baseVal.value = 10
    expect(rect.width.baseVal.value).toBe(10)
  })
})
