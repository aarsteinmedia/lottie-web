import type { ElementInterfaceIntersect, VectorProperty } from '@/types'

import { PropType } from '@/utils/enums'
import { BaseProperty } from '@/utils/properties/BaseProperty'

export class ValueProperty<
  T extends number | number[] = number,
> extends BaseProperty {
  override pv: T
  override v: T
  constructor(
    elem: ElementInterfaceIntersect,
    data: VectorProperty,
    mult: null | number = null,
    container: ElementInterfaceIntersect | null = null
  ) {
    super()
    this.propType = PropType.UniDimensional
    this.mult = mult || 1
    this.data = data
    this.v = (data.k * (mult || 1)) as T
    this.pv = data.k as T
    this._mdf = false
    this.elem = elem
    this.container = container
    this.comp = elem.comp
    this.k = false
    this.kf = false
    this.vel = 0
    this.effectsSequence = []
    this._isFirstFrame = true
    this.getValue = this.processEffectsSequence
  }
}