import type { ElementInterfaceIntersect } from '@/types'
import type LayerExpressionInterface from '@/utils/expressions/LayerInterface'
import type { ShapeProperty } from '@/utils/shapes/ShapeProperty'

import ExpressionPropertyInterface from '@/utils/expressions/ExpressionValueFactory'
import propertyGroupFactory from '@/utils/expressions/PropertyGroupFactory'
import PropertyInterface from '@/utils/expressions/PropertyInterface'


function createEffectsInterface(elem: ElementInterfaceIntersect, propertyGroup: LayerExpressionInterface) {
  // console.log(propertyGroup)
  if (elem.effectsManager) {
    const effectElements = []
    const effectsData = elem.data.ef
    let i
    let len = elem.effectsManager.effectElements.length

    for (i = 0; i < len; i += 1) {
      effectElements.push(createGroupInterface(
        effectsData[i], elem.effectsManager.effectElements[i], propertyGroup, elem
      ))
    }

    const effects = elem.data.ef || []
    const groupInterface = function (name: string) {
      i = 0
      len = effects.length
      while (i < len) {
        if (name === effects[i].nm || name === effects[i].mn || name === effects[i].ix) {
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
  data, elements, propertyGroup, elem: ElementInterfaceIntersect
) {
  function groupInterface(name) {
    const effects = data.ef
    let i = 0
    const len = effects.length

    while (i < len) {
      if (name === effects[i].nm || name === effects[i].mn || name === effects[i].ix) {
        if (effects[i].ty === 5) {
          return effectElements[i]
        }

        return effectElements[i]()
      }
      i += 1
    }
    throw new Error()
  }
  const _propertyGroup = propertyGroupFactory(groupInterface, propertyGroup)

  const effectElements = []
  const len = data.ef.length

  for (let i = 0; i < len; i += 1) {
    if (data.ef[i].ty === 5) {
      effectElements.push(createGroupInterface(
        data.ef[i], elements.effectElements[i], elements.effectElements[i].propertyGroup, elem
      ))
    } else {
      effectElements.push(createValueInterface(
        elements.effectElements[i], data.ef[i].ty, elem, _propertyGroup
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
  groupInterface.enabled = data.en !== 0
  groupInterface.active = groupInterface.enabled

  return groupInterface
}

function createValueInterface(
  element: ShapeProperty, type: number, elem: ElementInterfaceIntersect, propertyGroup
) {
  const expressionProperty = ExpressionPropertyInterface(element.p)

  function interfaceFunction() {
    if (type === 10) {
      return elem.comp?.compInterface?.getInterface(element.p.v)
    }

    return expressionProperty()
  }

  if (element.p.setGroupProperty) {
    element.p.setGroupProperty(PropertyInterface('', propertyGroup))
  }

  return interfaceFunction
}

const EffectsExpressionInterface = { createEffectsInterface }

export default EffectsExpressionInterface
