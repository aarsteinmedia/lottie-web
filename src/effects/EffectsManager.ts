import type {
  AngleEffect,
  CheckboxEffect,
  ColorEffect,
  LayerIndexEffect,
  MaskIndexEffect,
  NoValueEffect,
  PointEffect,
  SliderEffect,
} from '@/effects'
import type {
  ElementInterfaceIntersect,
  LottieLayer,
} from '@/types'
import type DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer'

import GroupEffect from '@/effects/GroupEffect'

export default class EffectsManager {
  _mdf?: boolean
  effectElements: EffectInterface[]
  constructor(
    data: LottieLayer, element: ElementInterfaceIntersect, _dynamicProperties?: DynamicPropertyContainer[]
  ) {
    const effects = data.ef ?? []

    this.effectElements = []
    const { length } = effects

    for (let i = 0; i < length; i++) {
      const effectItem = new GroupEffect(
        effects[i], element, data
      )

      this.effectElements.push(effectItem)
    }
  }
}

export type EffectInterface =
  | GroupEffect
  | EffectsManager
  | SliderEffect
  | AngleEffect
  | ColorEffect
  | PointEffect
  | CheckboxEffect
  | LayerIndexEffect
  | MaskIndexEffect
  | NoValueEffect
