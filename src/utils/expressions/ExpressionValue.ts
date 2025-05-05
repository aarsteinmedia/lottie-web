import type { Vector3 } from '@/types'
import type LayerExpressionInterface from '@/utils/expressions/LayerInterface'
import type { ValueProperty } from '@/utils/Properties'

import { ArrayType } from '@/enums'
import { createTypedArray } from '@/utils/helpers/arrays'

export default class ExpressionValue {
  key?: (pos: number) => number
  numKeys = 0
  propertyGroup?: LayerExpressionInterface
  value
  velocity: number
  constructor(
    elementProp: ValueProperty<number[] | number>,
    mult = 1,
    type: string
  ) {
    if (elementProp.k) {
      elementProp.getValue()
    }
    if (type) {
      if (type === 'color') {
        const len = 4
        const arrValue = createTypedArray(ArrayType.Float32, len)

        for (let i = 0; i < len; i++) {
          arrValue[i] = i < 3 ? (elementProp.v as Vector3)[i] * mult : 1
        }
        this.value = arrValue
      }
    } else if (elementProp.propType === 'unidimensional') {
      this.value = Number(elementProp.v) * mult
    } else {
      const { length } = elementProp.pv as number[]
      const arrValue = createTypedArray(ArrayType.Float32, length)

      for (let i = 0; i < length; i++) {
        arrValue[i] = (elementProp.v as number[])[i] * mult
      }
      this.value = arrValue
    }

    this.numKeys = elementProp.keyframes ? elementProp.keyframes.length : 0
    this.key = (pos: number) => {
      if (!this.numKeys) {
        return 0
      }

      return elementProp.keyframes[pos - 1].t
    }
    const {
      getSpeedAtTime, getValueAtTime, getVelocityAtTime, propertyGroup
    } =
      elementProp

    this.valueAtTime = getValueAtTime
    this.speedAtTime = getSpeedAtTime
    this.velocityAtTime = getVelocityAtTime
    this.propertyGroup = propertyGroup

    this.velocity = getVelocityAtTime(elementProp.comp?.currentFrame || 0)
  }
  speedAtTime(_frameNum: number) {
    throw new Error(`${this.constructor.name}: Method speedAtTime is not implemented`)
  }
  valueAtTime<T extends number | number[] = number>(_a: number,
    _b?: number): T {
    throw new Error(`${this.constructor.name}: Method valueAtTime is not implemented`)
  }
  velocityAtTime(_frameNum: number): number {
    throw new Error(`${this.constructor.name}: Method velocityAtTime is not implemented`)
  }
}
