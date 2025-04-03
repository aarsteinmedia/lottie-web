import type { Vector3 } from '@/types'

import { ArrayType } from '@/enums'
import { createTypedArray } from '@/utils/helpers/arrays'
import { ValueProperty } from '@/utils/Properties'

function ExpressionValue(
  elementProp: ValueProperty<number[] | number>,
  multFromProps: number,
  type: string
) {
  const mult = multFromProps || 1
  let expressionValue

  if (elementProp.k) {
    elementProp.getValue()
  }
  let i
  let len
  let arrValue
  let val
  if (type) {
    if (type === 'color') {
      len = 4
      expressionValue = createTypedArray(ArrayType.Float32, len)
      arrValue = createTypedArray(ArrayType.Float32, len)
      for (i = 0; i < len; i += 1) {
        arrValue[i] = i < 3 ? (elementProp.v as Vector3)[i] * mult : 1
        expressionValue[i] = arrValue[i]
      }
      expressionValue.value = arrValue
    }
  } else if (elementProp.propType === 'unidimensional') {
    val = (elementProp.v as number) * mult
    expressionValue = new Number(val) // eslint-disable-line no-new-wrappers
    expressionValue.value = val
  } else {
    len = elementProp.pv.length
    expressionValue = createTypedArray(ArrayType.Float32, len)
    arrValue = createTypedArray(ArrayType.Float32, len)
    for (i = 0; i < len; i += 1) {
      arrValue[i] = (elementProp.v as number[])[i] * mult
      expressionValue[i] = arrValue[i]
    }
    expressionValue.value = arrValue
  }

  expressionValue.numKeys = elementProp.keyframes
    ? elementProp.keyframes.length
    : 0
  expressionValue.key = (pos: number) => {
    if (!expressionValue.numKeys) {
      return 0
    }
    return elementProp.keyframes[pos - 1].t
  }
  expressionValue.valueAtTime = elementProp.getValueAtTime
  expressionValue.speedAtTime = elementProp.getSpeedAtTime
  expressionValue.velocityAtTime = elementProp.getVelocityAtTime
  expressionValue.propertyGroup = elementProp.propertyGroup
  Object.defineProperty(expressionValue, 'velocity', {
    get: function () {
      return elementProp.getVelocityAtTime(elementProp.comp.currentFrame)
    },
  })
  return expressionValue
}

export default ExpressionValue
