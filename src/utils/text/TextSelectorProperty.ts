import type {
  ElementInterfaceIntersect, TextRangeValue, Vector4
} from '@/types'
import type { ValueProperty } from '@/utils/properties/ValueProperty'

import { getBezierEasing } from '@/utils/BezierFactory'
import { BaseProperty } from '@/utils/properties/BaseProperty'
import PropertyFactory from '@/utils/PropertyFactory'

export class TextSelectorProperty extends BaseProperty {
  _currentTextLength = -1
  a: ValueProperty
  b?: ValueProperty
  override data: TextRangeValue
  override e: ValueProperty | { v: number }
  override elem: ElementInterfaceIntersect
  finalE = 0
  finalS = 0
  ne: ValueProperty
  o: ValueProperty
  rn?: number
  sm: ValueProperty
  t?: string | undefined
  totalChars?: number
  xe: ValueProperty
  constructor(elem: ElementInterfaceIntersect, data: TextRangeValue) {
    super()
    this.k = false
    this.data = data
    this.elem = elem
    this.comp = elem.comp
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
    const ind = indFromProps

    if (
      this._currentTextLength !== this.elem.textProperty?.currentData.l.length
    ) {
      this.getValue()
    }

    let mult = this._handleShapeType(ind)


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

    return mult * this.a.v
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
      o = this.o.v / divisor
    let s = Number(this.s?.v) / divisor + o,
      e = this.e.v / divisor + o

    if (s > e) {
      const _s = s

      s = e
      e = _s
    }
    this.finalS = s
    this.finalE = e

    return 0
  }

  private _getCoordinates(): Vector4 {
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

    return [x1,
      y1,
      x2,
      y2]
  }

  private _handleShapeType(ind: number) {
    const easer = getBezierEasing(...this._getCoordinates()).get

    let mult = 0
    const s = this.finalS,
      e = this.finalE,
      type = this.data.sh

    switch (type) {
      case 2: {
        if (e === s) {
          mult = ind >= e ? 1 : 0
          break
        }
        mult = Math.max(0, Math.min(0.5 / (e - s) + (ind - s) / (e - s), 1))

        break
      }
      case 3: {
        if (e === s) {
          mult = ind >= e ? 0 : 1
          break
        }
        mult =
          1 - Math.max(0, Math.min(0.5 / (e - s) + (ind - s) / (e - s), 1))

        break
      }
      case 4: {
        if (e === s) {
          break
        }
        mult = Math.max(0, Math.min(0.5 / (e - s) + (ind - s) / (e - s), 1))
        if (mult < 0.5) {
          mult *= 2
          break
        }
        mult = 1 - 2 * (mult - 0.5)

        break
      }
      case 5: {
        if (e === s) {
          break
        }
        const tot = e - s

        ind = Math.min(Math.max(0, ind + 0.5 - s), e - s)
        const x = -tot / 2 + ind,
          a = tot / 2

        mult = Math.sqrt(1 - x * x / (a * a))

        break
      }
      case 6: {
        if (e === s) {
          break
        }
        ind = Math.min(Math.max(0, ind + 0.5 - s), e - s)
        mult = (1 + Math.cos(Math.PI + Math.PI * 2 * ind / (e - s))) / 2

        break
      }

      default: {
        if (ind < Math.floor(s)) {
          break
        }
        if (ind - s < 0) {
          mult = Math.max(0, Math.min(Math.min(e, 1) - (s - ind), 1))
          break
        }
        mult = Math.max(0, Math.min(e - ind, 1))
      }
    }

    return easer(mult)
  }
}
