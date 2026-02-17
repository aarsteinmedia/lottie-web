// @ts-nocheck
import type { EffectsManager } from '@/effects/EffectsManager'
import type { BaseElement } from '@/elements/BaseElement'
import type {
  Effect, ElementInterfaceIntersect, LottieLayer
} from '@/types'
import type { LayerExpressionInterface } from '@/utils/expressions/LayerInterface'
import type { BaseProperty } from '@/utils/properties/BaseProperty'
import type { ShapeProperty } from '@/utils/shapes/properties/ShapeProperty'

import expressionPropertyFactory from '@/utils/expressions/ExpressionValueFactory'
import { PropertyGroupFactory } from '@/utils/expressions/PropertyGroupFactory'
import { PropertyInterface } from '@/utils/expressions/PropertyInterface'

export class GroupEffectInterface {
  effectElements: Effect[]
  effects: Effect[]
  get numProperties() {
    return this.effects.length
  }

  constructor(effects: Effect[], effectElements: Effect[]) {
    this.effects = effects
    this.effectElements = effectElements
  }

  getInterface(name: string | number) {
    let i = 0
    const { length } = this.effects

    while (i < length) {
      if (name === this.effects[i].nm || name === this.effects[i].mn || name === this.effects[i].ix) {
        return this.effectElements[i]
      }
      i++
    }

    return null
  }
}

export default class EffectsExpressionInterface {
  effectElements: Effect[] = []
  effects: Effect[] = []
  effectsData: Effect[] = []

  public createEffectsInterface(elem: BaseElement, propertyGroup: LayerExpressionInterface) {
    if (elem.effectsManager) {
      this.effectsData = elem.data?.ef ?? []
      const { length: len } = elem.effectsManager.effectElements

      for (let i = 0; i < len; i++) {
        this.effectElements.push(this.createGroupInterface(
          this.effectsData[i], elem.effectsManager.effectElements[i], propertyGroup, elem
        ))
      }

      this.effects = elem.data?.ef ?? []

      return new GroupEffectInterface(this.effects, this.effectElements)
    }

    return null
  }

  private createGroupInterface(
    data: LottieLayer, elements: EffectsManager, propertyGroup: (val: number | string) => BaseProperty, elem: ElementInterfaceIntersect
  ) {


    // class GroupInterface {
    //   getInterface(name: string) {
    //     const effects = data.ef ?? []
    //     let i = 0
    //     const { length: jLen } = effects

    //     while (i < jLen) {
    //       if (name === effects[i].nm || name === effects[i].mn || name === effects[i].ix) {
    //         if (effects[i].ty === 5) {
    //           return effectElements[i]
    //         }

    //         return effectElements[i]()
    //       }
    //       i++
    //     }
    //     throw new Error()
    //   }
    // }


    const groupInterface = (name: string | number) => {
      const effects = data.ef ?? []
      let i = 0
      const { length: jLen } = effects

      while (i < jLen) {
        if (name === effects[i].nm || name === effects[i].mn || name === effects[i].ix) {
          if (effects[i].ty === 5) {
            return this.effectElements[i]
          }

          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return this.effectElements[i]()
        }
        i++
      }
      throw new Error()
    }
    const _propertyGroup = new PropertyGroupFactory(groupInterface, propertyGroup),
      { length } = data.ef ?? []

    for (let i = 0; i < length; i += 1) {
      if (data.ef?.[i].ty === 5) {
        this.effectElements.push(this.createGroupInterface(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          data.ef[i], elements.effectElements[i], elements.effectElements[i].propertyGroup, elem
        ))
      } else {
        this.effectElements.push(this.createValueInterface(
          elements.effectElements[i], data.ef[i].ty, elem, _propertyGroup
        ))
      }
    }

    if (data.mn === 'ADBE Color Control') {
      Object.defineProperty(
        groupInterface, 'color', {
          get () {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            return this.effectElements[0]()
          },
        }
      )
    }
    Object.defineProperties(groupInterface, {
      _name: { value: data.nm },
      numProperties: {
        get () {
          return data.np
        },
      },
      propertyGroup: { value: _propertyGroup },
    })
    groupInterface.enabled = data.en !== 0
    groupInterface.active = groupInterface.enabled

    return groupInterface
  }

  private createValueInterface(
    element: ShapeProperty, type: number, elem: ElementInterfaceIntersect, propertyGroup: PropertyGroupFactory
  ) {
    const expressionProperty = expressionPropertyFactory(element.p)

    function interfaceFunction() {
      if (type === 10) {
        return elem.comp?.compInterface?.getInterface(element.p?.v)
      }

      return expressionProperty()
    }

    element.p?.setGroupProperty(new PropertyInterface('', propertyGroup))

    return interfaceFunction
  }
}

// const EffectsExpressionInterface = { createEffectsInterface }

// export default EffectsExpressionInterface
