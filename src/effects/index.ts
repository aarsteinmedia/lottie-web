import type GroupEffect from '@/effects/GroupEffect'
import type { EffectValue, ElementInterfaceIntersect } from '@/types'
import type ValueProperty from '@/utils/properties/ValueProperty'

import PropertyFactory from '@/utils/PropertyFactory'

abstract class EffectZero {
  p?: ValueProperty
  constructor(
    data: EffectValue,
    elem: ElementInterfaceIntersect,
    container: GroupEffect
  ) {
    this.p = PropertyFactory.getProp(
      elem,
      data.v,
      0,
      0,
      container as unknown as ElementInterfaceIntersect
    ) as ValueProperty
  }
}

abstract class EffectOne {
  p?: ValueProperty

  constructor(
    data: EffectValue,
    elem: ElementInterfaceIntersect,
    container: GroupEffect
  ) {
    this.p = PropertyFactory.getProp(
      elem,
      data.v,
      1,
      0,
      container as unknown as ElementInterfaceIntersect
    ) as ValueProperty
  }
}

export class SliderEffect extends EffectZero { }

export class AngleEffect extends EffectZero { }

export class ColorEffect extends EffectOne { }

export class PointEffect extends EffectOne { }

export class LayerIndexEffect extends EffectZero { }

export class MaskIndexEffect extends EffectZero { }

export class CheckboxEffect extends EffectZero { }

export class NoValueEffect {
  p: object

  constructor() {
    this.p = {}
  }
}
