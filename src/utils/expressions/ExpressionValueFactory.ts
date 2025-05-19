// @ts-nocheck
import type { Vector2 } from '@/types'
import type {
  BaseProperty,
  MultiDimensionalProperty,
  ValueProperty,
} from '@/utils/Properties'

import { ArrayType } from '@/utils/enums'
import { createTypedArray } from '@/utils/helpers/arrays'

const ExpressionPropertyInterface = (() => {
  const defaultUnidimensionalValue = {
      mult: 1,
      pv: 0,
      v: 0
    },
    defaultMultidimensionalValue = {
      mult: 1,
      pv: [0,
        0,
        0],
      v: [0,
        0,
        0]
    }

  function completeProperty(
    expressionValue: any,
    property: BaseProperty,
    type: string
  ) {
    Object.defineProperty(
      expressionValue, 'velocity', {
        get () {
          return property.getVelocityAtTime(property.comp?.currentFrame || 0)
        },
      }
    )
    expressionValue.numKeys = property.keyframes ? property.keyframes.length : 0
    expressionValue.key = (pos: number) => {
      if (!expressionValue.numKeys) {
        return 0
      }
      let value: string | Vector2 = ''

      if ('s' in property.keyframes[pos - 1]) {
        value = property.keyframes[pos - 1].s
      } else if ('e' in property.keyframes[pos - 2]) {
        value = property.keyframes[pos - 2].e
      } else {
        value = property.keyframes[pos - 2].s
      }
      const valueProp =
        type === 'unidimensional' ? new Number(value) : { ...(value as any) } // eslint-disable-line no-new-wrappers

      valueProp.time =
        property.keyframes[pos - 1].t /
        (property.elem?.comp?.globalData?.frameRate ?? 60)
      valueProp.value = type === 'unidimensional' ? value[0] : value

      return valueProp
    }
    expressionValue.valueAtTime = property.getValueAtTime
    expressionValue.speedAtTime = property.getSpeedAtTime
    expressionValue.velocityAtTime = property.getVelocityAtTime
    expressionValue.propertyGroup = property.propertyGroup
  }

  function UnidimensionalPropertyInterface(propertyFromProps: BaseProperty) {
    let property = propertyFromProps

    if (!property || !('pv' in property)) {
      property = defaultUnidimensionalValue as BaseProperty
    }
    const mult = 1 / (property.mult ?? 1)
    let val = (property.pv as number) * mult,
      expressionValue = new Number(val) as any // eslint-disable-line no-new-wrappers

    expressionValue.value = val
    completeProperty(
      expressionValue, property, 'unidimensional'
    )

    return function () {
      if (property.k) {
        property.getValue()
      }
      val = (property.v as number) * mult
      if (expressionValue.value !== val) {
        expressionValue = new Number(val) // eslint-disable-line no-new-wrappers
        expressionValue.value = val
        completeProperty(
          expressionValue, property, 'unidimensional'
        )
      }

      return expressionValue
    }
  }

  function MultidimensionalPropertyInterface(propertyFromProps: BaseProperty) {
    let property = propertyFromProps

    if (!property || !('pv' in property)) {
      property = defaultMultidimensionalValue as BaseProperty
    }
    const mult = 1 / (property.mult ?? 1),
      len: number =
        ((property.data as any)?.l || (property.pv as number[])?.length) ?? 0,
      expressionValue = createTypedArray(ArrayType.Float32, len) as any,
      arrValue = createTypedArray(ArrayType.Float32, len)

    expressionValue.value = arrValue
    completeProperty(
      expressionValue, property, 'multidimensional'
    )

    return function () {
      if (property.k) {
        property.getValue()
      }
      for (let i = 0; i < len; i++) {
        arrValue[i] = (property.v as number[])[i] * mult
        expressionValue[i] = arrValue[i]
      }

      return expressionValue
    }
  }

  /**
   * TODO: try to avoid using this getter.
   */
  function defaultGetter() {
    return defaultUnidimensionalValue
  }

  return function (property?: ValueProperty | MultiDimensionalProperty<number[]>) {
    if (!property) {
      return defaultGetter
    }
    if (property.propType === 'unidimensional') {
      return UnidimensionalPropertyInterface(property) as unknown as ValueProperty
    }

    return MultidimensionalPropertyInterface(property) as unknown as MultiDimensionalProperty
  }
})()

export default ExpressionPropertyInterface
