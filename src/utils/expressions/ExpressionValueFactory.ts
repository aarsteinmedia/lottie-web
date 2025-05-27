import { ArrayType, PropType } from '../enums'
import { createTypedArray } from '../helpers/arrays'

const ExpressionPropertyInterface = (function () {
  const defaultUnidimensionalValue = {
    mult: 1,
    pv: 0,
    v: 0
  }
  const defaultMultidimensionalValue = {
    mult: 1,
    pv: [0,
      0,
      0],
    v: [0,
      0,
      0]
  }

  function completeProperty(
    expressionValue, property, type
  ) {
    Object.defineProperty(
      expressionValue, 'velocity', {
        get () {
          return property.getVelocityAtTime(property.comp.currentFrame)
        },
      }
    )
    expressionValue.numKeys = property.keyframes ? property.keyframes.length : 0
    expressionValue.key = function (pos) {
      if (!expressionValue.numKeys) {
        return 0
      }
      let value = ''

      if ('s' in property.keyframes[pos - 1]) {
        value = property.keyframes[pos - 1].s
      } else if ('e' in property.keyframes[pos - 2]) {
        value = property.keyframes[pos - 2].e
      } else {
        value = property.keyframes[pos - 2].s
      }
      const valueProp = type === PropType.UniDimensional ? new Number(value) : { ...value } // eslint-disable-line no-new-wrappers

      valueProp.time = property.keyframes[pos - 1].t / property.elem.comp.globalData.frameRate
      valueProp.value = type === PropType.UniDimensional ? value[0] : value

      return valueProp
    }
    expressionValue.valueAtTime = property.getValueAtTime
    expressionValue.speedAtTime = property.getSpeedAtTime
    expressionValue.velocityAtTime = property.getVelocityAtTime
    expressionValue.propertyGroup = property.propertyGroup
  }

  function UnidimensionalPropertyInterface(property) {
    if (!property || !('pv' in property)) {
      property = defaultUnidimensionalValue
    }
    const mult = 1 / property.mult
    let val = property.pv * mult
    let expressionValue = new Number(val) // eslint-disable-line no-new-wrappers

    expressionValue.value = val
    completeProperty(
      expressionValue, property, PropType.UniDimensional
    )

    return function () {
      if (property.k) {
        property.getValue()
      }
      val = property.v * mult
      if (expressionValue.value !== val) {
        expressionValue = new Number(val) // eslint-disable-line no-new-wrappers
        expressionValue.value = val
        expressionValue[0] = val
        completeProperty(
          expressionValue, property, PropType.UniDimensional
        )
      }

      return expressionValue
    }
  }

  function MultidimensionalPropertyInterface(propertyFromProps) {

    let property = propertyFromProps

    if (!property || !('pv' in property)) {
      property = defaultMultidimensionalValue
    }
    const mult = 1 / property.mult
    const len = property.data?.l || property.pv.length
    const expressionValue = createTypedArray(ArrayType.Float32, len)
    const arrValue = createTypedArray(ArrayType.Float32, len)

    expressionValue.value = arrValue
    completeProperty(
      expressionValue, property, PropType.MultiDimensional
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

  /**
   * TODO: try to avoid using this getter.
   */
  function defaultGetter() {
    return defaultUnidimensionalValue
  }

  return function (property) {
    if (!property) {
      return defaultGetter
    }

    if (property.propType === PropType.UniDimensional) {
      return UnidimensionalPropertyInterface(property)
    }

    return MultidimensionalPropertyInterface(property)
  }
}())

export default ExpressionPropertyInterface
