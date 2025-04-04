import type { GroupEffect } from '@/effects/EffectsManager'
import type { EffectValue, ElementInterfaceIntersect } from '@/types'
import type { ValueProperty } from '@/utils/Properties'

import PropertyFactory from '@/utils/PropertyFactory'

export class SliderEffect {
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

export class AngleEffect {
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

export class ColorEffect {
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

export class PointEffect {
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

export class LayerIndexEffect {
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

export class MaskIndexEffect {
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

export class CheckboxEffect {
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

export class NoValueEffect {
  p: object

  constructor() {
    this.p = {}
  }
}
