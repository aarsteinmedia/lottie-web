/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { ElementInterfaceIntersect, LottieLayer } from '@/types'
import type LayerExpressionInterface from '@/utils/expressions/LayerInterface'

import ExpressionPropertyInterface from '@/utils/expressions/ExpressionValueFactory'
import propertyGroupFactory from '@/utils/expressions/PropertyGroupFactory'
import PropertyInterface from '@/utils/expressions/PropertyInterface'

const EffectsExpressionInterface = (function () {
  const ob = { createEffectsInterface, }

  function createEffectsInterface(elem: ElementInterfaceIntersect,
    propertyGroup: LayerExpressionInterface) {
    if (elem.effectsManager) {
      const effectElements: any[] = [],
        effectsData = elem.data.ef ?? [],
        { length } = elem.effectsManager.effectElements

      for (let i = 0; i < length; i += 1) {
        effectElements.push(createGroupInterface(
          effectsData[i] as unknown as LottieLayer,
          elem.effectsManager.effectElements[i] as any,
          propertyGroup,
          elem
        ))
      }

      const effects = elem.data.ef ?? []
      const groupInterface = (name: string | number) => {
        let i = 0
        const { length: jLen } = effects

        while (i < jLen) {
          if (
            name === effects[i].nm ||
            name === effects[i].mn ||
            name === effects[i].ix
          ) {
            // @ts-nocheck TODO:
            return effectElements[i]
          }
          i += 1
        }

        return null
      }

      Object.defineProperty(
        groupInterface, 'numProperties', {
          get () {
            return effects.length
          },
        }
      )

      return groupInterface
    }

    return null
  }

  function createGroupInterface(
    data: LottieLayer,
    elements: any,
    propertyGroup: LayerExpressionInterface,
    elem: ElementInterfaceIntersect
  ) {
    function groupInterface(name: string | number) {
      const effects = data.ef ?? []
      let i = 0
      const { length: kLen } = effects

      while (i < kLen) {
        if (
          name === effects[i].nm ||
          name === effects[i].mn ||
          name === effects[i].ix
        ) {
          if (effects[i].ty === 5) {
            return effectElements[i]
          }

          return effectElements[i]()
        }
        i++
      }
      throw new Error()
    }
    const _propertyGroup = propertyGroupFactory(groupInterface, propertyGroup),
      effectElements: any[] = []
    const { length } = data.ef ?? []

    for (let i = 0; i < length; i++) {
      if (data.ef?.[i].ty === 5) {
        effectElements.push(createGroupInterface(
          data.ef[i] as unknown as LottieLayer,
          elements.effectElements[i],
          elements.effectElements[i].propertyGroup,
          elem
        ))
      } else {
        effectElements.push(createValueInterface(
          elements.effectElements[i],
          data.ef?.[i].ty as any,
          elem,
          _propertyGroup as any
        ))
      }
    }
    if (data.mn === 'ADBE Color Control') {
      Object.defineProperty(
        groupInterface, 'color', {
          get () {
            return effectElements[0]()
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

    // @ts-nocheck TODO:
    groupInterface.enabled = data.en !== 0
    groupInterface.active = groupInterface.enabled

    return groupInterface
  }

  function createValueInterface(
    element: any,
    type: number,
    elem: ElementInterfaceIntersect,
    propertyGroup: LayerExpressionInterface
  ) {
    const expressionProperty = ExpressionPropertyInterface(element.p)

    function interfaceFunction() {
      if (type === 10) {
        return (elem.comp?.compInterface as any)(element.p.v)
      }

      return (expressionProperty as any)()
    }

    if (element.p.setGroupProperty) {
      element.p.setGroupProperty(new PropertyInterface('', propertyGroup as any))
    }

    return interfaceFunction
  }

  return ob
})()

export default EffectsExpressionInterface

// export default class EffectInterface {
//   effects: Effect[] = []
//   numProperties = 0
//   _name: string
//   // _propertyGroup?: (val?: number) => any
//   constructor(name: string | number, data?: LottieLayer) {
//     if (data?.ef) {
//       this.effects = data.ef
//     }
//     this.numProperties = this.effects.length
//     let i = 0
//     while (i < this.numProperties) {
//       if (
//         name === this.effects[i].nm ||
//         name === this.effects[i].mn ||
//         name === this.effects[i].ix
//       ) {
//         return this.effectElements[i]
//       }
//       i++
//     }
//   }

//   static createEffectsInterface(
//     elem: ElementInterfaceIntersect,
//     propertyGroup: LayerExpressionInterface
//   ) {
//     if (!elem.effectsManager) {
//       return
//     }
//     const effectElements = [],
//       effectsData = elem.data.ef || []
//     const { length } = elem.effectsManager.effectElements
//     for (let i = 0; i < length; i++) {
//       effectElements.push(
//         this.createGroupInterface(
//           effectsData[i],
//           elem.effectsManager.effectElements[i],
//           propertyGroup,
//           elem
//         )
//       )
//     }

//     this.effects = elem.data.ef || []
//   }

//   private static createGroupInterface(data, elements, propertyGroup, elem) {
//     function groupInterface(name) {
//       const effects = data.ef
//       let i = 0
//       const len = effects.length
//       while (i < len) {
//         if (
//           name === effects[i].nm ||
//           name === effects[i].mn ||
//           name === effects[i].ix
//         ) {
//           if (effects[i].ty === 5) {
//             return effectElements[i]
//           }
//           return effectElements[i]()
//         }
//         i++
//       }
//       throw new Error()
//     }
//     const _propertyGroup = propertyGroupFactory(groupInterface, propertyGroup)

//     var effectElements = []
//     let i
//     const len = data.ef.length
//     for (i = 0; i < len; i++) {
//       if (data.ef[i].ty === 5) {
//         effectElements.push(
//           this.createGroupInterface(
//             data.ef[i],
//             elements.effectElements[i],
//             elements.effectElements[i].propertyGroup,
//             elem
//           )
//         )
//       } else {
//         effectElements.push(
//           this.createValueInterface(
//             elements.effectElements[i],
//             data.ef[i].ty,
//             elem,
//             _propertyGroup
//           )
//         )
//       }
//     }

//     if (data.mn === 'ADBE Color Control') {
//       Object.defineProperty(groupInterface, 'color', {
//         get: function () {
//           return this.effectElements[0]()
//         },
//       })
//     }
//     Object.defineProperties(groupInterface, {
//       _name: { value: data.nm },
//       numProperties: {
//         get: function () {
//           return data.np
//         },
//       },
//       propertyGroup: { value: _propertyGroup },
//     })
//     groupInterface.enabled = data.en !== 0
//     groupInterface.active = groupInterface.enabled
//     return groupInterface
//   }

//   createValueInterface(element, type, elem, propertyGroup) {
//     const expressionProperty = ExpressionPropertyInterface(element.p)
//     function interfaceFunction() {
//       if (type === 10) {
//         return elem.comp.compInterface(element.p.v)
//       }
//       return expressionProperty()
//     }

//     if (element.p.setGroupProperty) {
//       element.p.setGroupProperty(new PropertyInterface('', propertyGroup))
//     }

//     return interfaceFunction
//   }
// }
