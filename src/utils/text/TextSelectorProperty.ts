import type { ElementInterfaceIntersect, TextRangeValue } from '@/types'
import type ValueProperty from '@/utils/properties/ValueProperty'

import { getBezierEasing } from '@/utils/BezierFactory'
import BaseProperty from '@/utils/properties/BaseProperty'
import PropertyFactory from '@/utils/PropertyFactory'

export default class TextSelectorProperty extends BaseProperty {
  _currentTextLength: number
  a: ValueProperty
  b?: ValueProperty
  override data: TextRangeValue
  override e: ValueProperty | { v: number }
  override elem: ElementInterfaceIntersect
  finalE: number
  finalS: number
  ne: ValueProperty
  o: ValueProperty
  rn?: number
  sm: ValueProperty
  totalChars?: number
  xe: ValueProperty
  constructor(elem: ElementInterfaceIntersect, data: TextRangeValue) {
    super()
    this._currentTextLength = -1
    this.k = false
    this.data = data
    this.elem = elem
    this.comp = elem.comp
    this.finalS = 0
    this.finalE = 0
    this.initDynamicPropertyContainer(elem)
    this.s = PropertyFactory.getProp(
      elem,
      data.s ?? {
        a: 0,
        k: 0
      },
      0,
      0,
      this as unknown as ElementInterfaceIntersect
    ) as ValueProperty
    if ('e' in data) {
      this.e = PropertyFactory.getProp(
        elem,
        data.e,
        0,
        0,
        this as unknown as ElementInterfaceIntersect
      ) as ValueProperty
    } else {
      this.e = { v: 100 }
    }
    this.o = PropertyFactory.getProp(
      elem,
      data.o ?? {
        a: 0,
        k: 0
      },
      0,
      0,
      this as unknown as ElementInterfaceIntersect
    ) as ValueProperty
    this.xe = PropertyFactory.getProp(
      elem,
      data.xe ?? {
        a: 0,
        k: 0
      },
      0,
      0,
      this as unknown as ElementInterfaceIntersect
    ) as ValueProperty
    this.ne = PropertyFactory.getProp(
      elem,
      data.ne ?? {
        a: 0,
        k: 0
      },
      0,
      0,
      this as unknown as ElementInterfaceIntersect
    ) as ValueProperty
    this.sm = PropertyFactory.getProp(
      elem,
      data.sm ?? {
        a: 0,
        k: 100
      },
      0,
      0,
      this as unknown as ElementInterfaceIntersect
    ) as ValueProperty
    this.a = PropertyFactory.getProp(
      elem,
      data.a,
      0,
      0.01,
      this as unknown as ElementInterfaceIntersect
    ) as ValueProperty

    if (this.dynamicProperties.length === 0) {
      this.getValue()
    }
  }

  getMult(indFromProps: number, _val?: number): number | number[] {
    let ind = indFromProps

    if (
      this._currentTextLength !== this.elem.textProperty?.currentData.l.length
    ) {
      this.getValue()
    }
    let x1 = 0,
      y1 = 0,
      x2 = 1,
      y2 = 1

    if (this.ne.v > 0) {
      x1 = this.ne.v / 100.0
    } else {
      y1 = -this.ne.v / 100.0
    }
    if (this.xe.v > 0) {
      x2 = 1.0 - this.xe.v / 100.0
    } else {
      y2 = 1.0 + this.xe.v / 100.0
    }
    const easer = getBezierEasing(
      x1, y1, x2, y2
    ).get

    let mult = 0
    const s = this.finalS,
      e = this.finalE,
      type = this.data.sh

    switch (type) {
      case 2: {
        if (e === s) {
          mult = ind >= e ? 1 : 0
        } else {
          mult = Math.max(0, Math.min(0.5 / (e - s) + (ind - s) / (e - s), 1))
        }
        mult = easer(mult)
        break
      }
      case 3: {
        if (e === s) {
          mult = ind >= e ? 0 : 1
        } else {
          mult =
            1 - Math.max(0, Math.min(0.5 / (e - s) + (ind - s) / (e - s), 1))
        }

        mult = easer(mult)
        break
      }
      case 4: {
        if (e === s) {
          mult = 0
        } else {
          mult = Math.max(0, Math.min(0.5 / (e - s) + (ind - s) / (e - s), 1))
          if (mult < 0.5) {
            mult *= 2
          } else {
            mult = 1 - 2 * (mult - 0.5)
          }
        }
        mult = easer(mult)
        break
      }
      case 5: {
        if (e === s) {
          mult = 0
        } else {
          const tot = e - s

          /* ind += 0.5;
                  mult = -4/(tot*tot)*(ind*ind)+(4/tot)*ind; */
          ind = Math.min(Math.max(0, ind + 0.5 - s), e - s)
          const x = -tot / 2 + ind
          const a = tot / 2

          mult = Math.sqrt(1 - x * x / (a * a))
        }
        mult = easer(mult)
        break
      }
      case 6: {
        if (e === s) {
          mult = 0
        } else {
          ind = Math.min(Math.max(0, ind + 0.5 - s), e - s)
          mult = (1 + Math.cos(Math.PI + Math.PI * 2 * ind / (e - s))) / 2
        }
        mult = easer(mult)
        break
      }

      default: {
        if (ind >= Math.floor(s)) {
          if (ind - s < 0) {
            mult = Math.max(0, Math.min(Math.min(e, 1) - (s - ind), 1))
          } else {
            mult = Math.max(0, Math.min(e - ind, 1))
          }
        }
        mult = easer(mult)
      }
    }
    // Smoothness implementation.
    // The smoothness represents a reduced range of the original [0; 1] range.
    // if smoothness is 25%, the new range will be [0.375; 0.625]
    // Steps are:
    // - find the lower value of the new range (threshold)
    // - if multiplier is smaller than that value, floor it to 0
    // - if it is larger,
    //     - subtract the threshold
    //     - divide it by the smoothness (this will return the range to [0; 1])
    // Note: If it doesn't work on some scenarios, consider applying it before the easer.
    if (this.sm.v !== 100) {
      let smoothness = this.sm.v * 0.01

      if (smoothness === 0) {
        smoothness = 0.00000001
      }
      const threshold = 0.5 - smoothness * 0.5

      if (mult < threshold) {
        mult = 0
      } else {
        mult = (mult - threshold) / smoothness
        if (mult > 1) {
          mult = 1
        }
      }
    }

    return mult * Number(this.a.v)
  }

  getTextSelectorProp(
    _elem: ElementInterfaceIntersect, _data: TextRangeValue, _arr: unknown[]
  ) {
    throw new Error('Method not implemented')
  }

  override getValue(newCharsFlag?: boolean) {
    this.iterateDynamicProperties()
    this._mdf = newCharsFlag || this._mdf
    this._currentTextLength = this.elem.textProperty?.currentData.l.length || 0
    if (newCharsFlag && this.data.r === 2 && this.e.v) {
      this.e.v = this._currentTextLength
    }
    const divisor = this.data.r === 2 ? 1 : 100 / this.data.totalChars,
      o = Number(this.o.v) / divisor
    let s = Number(this.s?.v) / divisor + o,
      e = Number(this.e.v) / divisor + o

    if (s > e) {
      const _s = s

      s = e
      e = _s
    }
    this.finalS = s
    this.finalE = e

    return 0
  }
}
