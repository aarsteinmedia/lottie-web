// @ts-nocheck
import type { BaseProperty } from '@/utils/properties/BaseProperty'

import { ArrayType, PropType } from '@/utils/enums'
import { createTypedArray } from '@/utils/helpers/arrays'

/**
 * Stand-in for a boxed Number: coerces to its numeric payload in arithmetic,
 * comparisons and string contexts, while carrying the members After Effects
 * exposes on a unidimensional property (value, numKeys, key(), velocity, …).
 */
export class NumericValue {
  [index: number]: number

  value: number

  constructor(value: number) {
    this.value = value
    this[0] = value
  }

  set(value: number) {
    this.value = value
    this[0] = value

    return this
  }

  [Symbol.toPrimitive](hint: string) {
    return hint === 'string' ? `${this.value}` : this.value
  }

  toExponential(...args: Parameters<number['toExponential']>) {
    return Number.prototype.toExponential.apply(this.value, args)
  }

  toFixed(...args: Parameters<number['toFixed']>) {
    return Number.prototype.toFixed.apply(this.value, args)
  }

  toJSON() {
    return this.value
  }

  toLocaleString(...args: Parameters<number['toLocaleString']>) {
    return Number.prototype.toLocaleString.apply(this.value, args)
  }

  toPrecision(...args: Parameters<number['toPrecision']>) {
    return Number.prototype.toPrecision.apply(this.value, args)
  }

  toString(...args: Parameters<number['toString']>) {
    return Number.prototype.toString.apply(this.value, args)
  }

  valueOf() {
    return this.value
  }
}

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
    expressionValue: NumericValue | number[], property: BaseProperty, type: PropType
  ) {
    Object.defineProperty(
      expressionValue, 'velocity', {
        get () {
          return property.getVelocityAtTime(property.comp?.currentFrame ?? 0)
        },
      }
    )
    expressionValue.numKeys = property.keyframes?.length ?? 0
    expressionValue.key = (pos: number) => {
      if (!expressionValue.numKeys) {
        return 0
      }

      const keyframes = property.keyframes ?? []
      let value

      if ('s' in keyframes[pos - 1]) {
        value = keyframes[pos - 1].s
      } else if ('e' in keyframes[pos - 2]) {
        value = keyframes[pos - 2].e
      } else {
        value = keyframes[pos - 2].s
      }

      const time = keyframes[pos - 1].t / (property.elem?.comp?.globalData?.frameRate ?? 60)

      if (type === PropType.UniDimensional) {
        return Object.assign(new NumericValue(Array.isArray(value) ? value[0] : value), { time })
      }

      return Object.assign(
        {}, value, {
          time,
          value
        }
      )
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
      return () => this.defaultGetter()
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
    const mult = 1 / property?.mult,
      len: number = property.data?.l ?? (property.pv as number[]).length,
      expressionValue = createTypedArray(ArrayType.Float32, len),
      arrValue = createTypedArray(ArrayType.Float32, len)

    expressionValue.value = arrValue
    this.completeProperty(
      expressionValue, property, PropType.MultiDimensional
    )

    return () => {
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
    const mult = 1 / property.mult,
      expressionValue = new NumericValue(property.pv * mult)

    this.completeProperty(
      expressionValue, property, PropType.UniDimensional
    )

    return () => {
      if (property.k) {
        property.getValue()
      }

      return expressionValue.set(property.v * mult)
    }
  }
}

export function expressionPropertyFactory(property?: BaseProperty) {
  return new ExpressionPropertyInterface().getInterface(property)
}
