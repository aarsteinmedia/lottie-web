import type {
  Effect, EFXElement, ElementInterfaceIntersect, LottieLayer
} from '@/types'

import {
  AngleEffect, CheckboxEffect, ColorEffect, LayerIndexEffect, MaskIndexEffect, NoValueEffect, PointEffect, SliderEffect
} from '@/effects'
import EffectsManager from '@/effects/EffectsManager'
import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer'

export default class GroupEffect extends DynamicPropertyContainer {
  override data?: Effect
  effectElements: EFXElement[] = []
  override getValue = this.iterateDynamicProperties
  type?: string
  constructor(
    data: Effect,
    element: ElementInterfaceIntersect,
    layer: LottieLayer
  ) {
    super()
    this.init(
      data, element, layer
    )
  }

  init(
    data: Effect, element: ElementInterfaceIntersect, layer: LottieLayer
  ) {
    this.data = data
    this.effectElements = []
    this.initDynamicPropertyContainer(element)
    let eff
    const effects = this.data.ef,
      { length } = effects

    for (let i = 0; i < length; i++) {
      // eff = null
      switch (effects[i].ty) {
        case 0: {
          eff = new SliderEffect(
            effects[i], element, this
          )
          break
        }
        case 1: {
          eff = new AngleEffect(
            effects[i], element, this
          )
          break
        }
        case 2: {
          eff = new ColorEffect(
            effects[i], element, this
          )
          break
        }
        case 3: {
          eff = new PointEffect(
            effects[i], element, this
          )
          break
        }
        case 4:
        case 7: {
          eff = new CheckboxEffect(
            effects[i], element, this
          )
          break
        }
        case 10: {
          eff = new LayerIndexEffect(
            effects[i], element, this
          )
          break
        }
        case 11: {
          eff = new MaskIndexEffect(
            effects[i], element, this
          )
          break
        }
        case 5: {
          eff = new EffectsManager(layer, element)
          break
        }
        default: {
          eff = new NoValueEffect()
          break
        }
      }
      this.effectElements.push(eff as EFXElement)
    }
  }

  renderFrame(_frame?: number | null) {
    throw new Error(`${this.constructor.name}: Method renderFrame is not implemented yet`)
  }
}