// @ts-nocheck
import type BaseProperty from '@/utils/properties/BaseProperty'

import { ArrayType, PropType } from '@/utils/enums'
import { createTypedArray } from '@/utils/helpers/arrays'

export class ExpressionPropertyInterface {
  defaultMultidimensionalValue = {
    mult: 1,
    pv: [0,
      0,
      0],
    v: [0,
      0,
      0]
  }
  defaultUnidimensionalValue = {
    mult: 1,
    pv: 0,
    v: 0
  }

  completeProperty(
    expressionValue: BaseProperty & { key: (pos: number) => unknown }, property: BaseProperty, type: PropType
  ) {
    Object.defineProperty(
      expressionValue, 'velocity', {
        get () {
          return property.getVelocityAtTime(property.comp?.currentFrame ?? 0)
        },
      }
    )
    expressionValue.numKeys = property.keyframes?.length ?? 0
    expressionValue.key = function (pos: number) {
      if (!expressionValue.numKeys) {
        return 0
      }
      let value

      if (property.keyframes) {
        if ('s' in property.keyframes[pos - 1]) {
          value = property.keyframes[pos - 1].s
        } else if ('e' in property.keyframes[pos - 2]) {
          value = property.keyframes[pos - 2].e
        } else {
          value = property.keyframes[pos - 2].s
        }
      }

      // @ts-expect-error
      const valueProp: {
        time: number
        value: unknown
      // eslint-disable-next-line @typescript-eslint/no-misused-spread
      } = type === PropType.UniDimensional ? new Number(value) : { ...value } // eslint-disable-line no-new-wrappers

      valueProp.time = Number(property.keyframes?.[pos - 1].t) / (property.elem?.comp?.globalData?.frameRate ?? 60)
      valueProp.value = type === PropType.UniDimensional ? (value as number[])[0] : value

      return valueProp
    }
    expressionValue.valueAtTime = property.getValueAtTime
    expressionValue.speedAtTime = property.getSpeedAtTime
    expressionValue.velocityAtTime = property.getVelocityAtTime
    expressionValue.propertyGroup = property.propertyGroup
  }

  /**
   * TODO: try to avoid using this getter.
   */
  defaultGetter() {
    return this.defaultUnidimensionalValue
  }

  getInterface (property?: BaseProperty) {
    if (!property) {
      return this.defaultGetter
    }

    if (property.propType === PropType.UniDimensional) {
      return this.UnidimensionalPropertyInterface(property)
    }

    return this.MultidimensionalPropertyInterface(property)
  }

  MultidimensionalPropertyInterface(propertyFromProps: null | BaseProperty) {
    let property = propertyFromProps

    if (!property || !('pv' in property)) {
      property = this.defaultMultidimensionalValue
    }
    const mult = 1 / property?.mult
    const len: number = property.data?.l ?? (property.pv as number[]).length
    const expressionValue = createTypedArray(ArrayType.Float32, len)
    const arrValue = createTypedArray(ArrayType.Float32, len)

    expressionValue.value = arrValue
    this.completeProperty(
      expressionValue, property, 'multidimensional'
    )

    return function () {
      if (property.k) {
        property.getValue()
      }
      for (let i = 0; i < len; i += 1) {
        arrValue[i] = property.v[i] * mult
        expressionValue[i] = arrValue[i]
      }

      return expressionValue
    }
  }

  UnidimensionalPropertyInterface(propertyFromProps: null | BaseProperty) {
    let property = propertyFromProps

    if (!property || !('pv' in property)) {
      property = this.defaultUnidimensionalValue
    }
    const mult = 1 / property.mult
    let val = property.pv * mult
    let expressionValue = new Number(val) // eslint-disable-line no-new-wrappers

    expressionValue.value = val
    this.completeProperty(
      expressionValue, property, PropType.UniDimensional
    )

    return () => {
      if (property.k) {
        property.getValue()
      }
      val = property.v * mult
      if (expressionValue.value !== val) {
        expressionValue = new Number(val) // eslint-disable-line no-new-wrappers
        expressionValue.value = val
        expressionValue[0] = val
        this.completeProperty(
          expressionValue, property, PropType.UniDimensional
        )
      }

      return expressionValue
    }
  }
}

export default function expressionPropertyFactory(property?: BaseProperty) {
  return new ExpressionPropertyInterface().getInterface(property)
}
