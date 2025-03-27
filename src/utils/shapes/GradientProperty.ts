import type { ElementInterfaceIntersect, GradientColor } from '@/types'

import { ArrayType } from '@/enums'
import { isArrayOfNum } from '@/utils'
import { createTypedArray } from '@/utils/helpers/arrays'
import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer'
import PropertyFactory from '@/utils/PropertyFactory'

export default class GradientProperty extends DynamicPropertyContainer {
  _cmdf: boolean
  _collapsable: boolean
  _hasOpacity: number
  _omdf: boolean
  c: Uint8ClampedArray
  data: GradientColor
  k?: boolean
  o: Float32Array
  prop: ReturnType<typeof PropertyFactory>
  constructor(
    elem: ElementInterfaceIntersect,
    data: GradientColor,
    container: any
  ) {
    super()
    this.data = data
    this.c = createTypedArray(ArrayType.Uint8c, data.p * 4) as Uint8ClampedArray
    const cLength = data.k.k[0].s
      ? data.k.k[0].s.length - data.p * 4
      : data.k.k.length - data.p * 4
    this.o = createTypedArray(ArrayType.Float32, cLength) as Float32Array
    this._cmdf = false
    this._omdf = false
    this._collapsable = this.checkCollapsable()
    this._hasOpacity = cLength
    this.initDynamicPropertyContainer(container)
    this.prop = PropertyFactory(
      elem,
      data.k,
      1,
      null,
      this as unknown as ElementInterfaceIntersect
    )
    this.k = this.prop.k
    this.getValue(true)
  }

  checkCollapsable() {
    if (this.o.length / 2 !== this.c.length / 4) {
      return false
    }
    if (this.data.k.k[0].s) {
      let i = 0
      const len = this.data.k.k.length
      while (i < len) {
        if (!this.comparePoints(this.data.k.k[i].s, this.data.p)) {
          return false
        }
        i++
      }
    } else if (!this.comparePoints(this.data.k.k as any, this.data.p)) {
      return false
    }
    return true
  }

  comparePoints(values: number[], points: number) {
    let i = 0
    const len = this.o.length / 2
    let diff
    while (i < len) {
      diff = Math.abs(values[i * 4] - values[points * 4 + i * 2])
      if (diff > 0.01) {
        return false
      }
      i++
    }
    return true
  }

  override getValue(forceRender?: boolean) {
    this.prop.getValue()
    this._mdf = false
    this._cmdf = false
    this._omdf = false
    if ((!this.prop._mdf && !forceRender) || !isArrayOfNum(this.prop.v)) {
      return
    }
    const len = this.data.p * 4
    let mult
    let val
    for (let i = 0; i < len; i++) {
      mult = i % 4 === 0 ? 100 : 255
      val = Math.round(this.prop.v[i] * mult)
      if (this.c[i] !== val) {
        this.c[i] = val
        this._cmdf = !forceRender
      }
    }
    if (this.o.length) {
      const { length } = this.prop.v
      for (let i = this.data.p * 4; i < length; i++) {
        mult = i % 2 === 0 ? 100 : 1
        val = i % 2 === 0 ? Math.round(this.prop.v[i] * 100) : this.prop.v[i]
        if (this.o[i - this.data.p * 4] !== val) {
          this.o[i - this.data.p * 4] = val
          this._omdf = !forceRender
        }
      }
    }
    this._mdf = !forceRender
  }
}
