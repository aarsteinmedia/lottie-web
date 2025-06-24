import type {
  ElementInterfaceIntersect, Vector2, VectorProperty
} from '@/types'

import { ArrayType, PropType } from '@/utils/enums'
import { createTypedArray } from '@/utils/helpers/arrays'
import BaseProperty from '@/utils/properties/BaseProperty'

export default class MultiDimensionalProperty<
  T extends number[] = Vector2,
> extends BaseProperty {
  override v: T
  constructor(
    elem: ElementInterfaceIntersect,
    data: VectorProperty<T>,
    mult: null | number = null,
    container: ElementInterfaceIntersect | null = null
  ) {
    super()
    this.propType = PropType.MultiDimensional
    this.mult = mult || 1
    this.data = data
    this._mdf = false
    this.elem = elem
    this.container = container
    this.comp = elem.comp
    this.k = false
    this.kf = false
    this.frameId = -1
    const { length } = data.k

    this.v = createTypedArray(ArrayType.Float32, length) as T
    this.pv = createTypedArray(ArrayType.Float32, length) as T
    this.vel = createTypedArray(ArrayType.Float32, length) as T
    for (let i = 0; i < length; i++) {
      this.v[i] = (data.k[i] ?? 0) * this.mult
      this.pv[i] = data.k[i] ?? 0
    }
    this._isFirstFrame = true
    this.effectsSequence = []
    this.getValue = this.processEffectsSequence
  }
}