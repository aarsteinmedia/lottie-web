import { ArrayType, PropType } from '@/utils/enums'
import { createTypedArray } from '@/utils/helpers/arrays'
import { BaseProperty } from '@/utils/properties/BaseProperty'

export class ExpressionValue extends BaseProperty {
  prop: BaseProperty

  get velocity() {
    return this.prop.getVelocityAtTime(this.prop.comp?.currentFrame ?? 0)
  }

  constructor(
    elementProp: BaseProperty, multFromProps?: number, type?: string
  ) {
    super()
    this.prop = elementProp
    const mult = multFromProps || 1
    let expressionValue

    if (elementProp.k) {
      elementProp.getValue()
    }

    let arrValue,
      val

    if (type) {
      if (type === 'color') {
        const len = 4

        this.value = createTypedArray(ArrayType.Float32, len) as number[]
        arrValue = createTypedArray(ArrayType.Float32, len) as number[]
        for (let i = 0; i < len; i++) {
          arrValue[i] = i < 3 ? Number((elementProp.v as number[] | undefined)?.[i]) * mult : 1
          this.value[i] = arrValue[i] ?? 0
        }
        this.value = arrValue
      }
    } else if (elementProp.propType === PropType.UniDimensional) {
      val = elementProp.v as number * mult
      this.value = new Number(val) as number // eslint-disable-line no-new-wrappers
      this.value = val
    } else {
      const { length } = elementProp.pv as number[]

      expressionValue = createTypedArray(ArrayType.Float32, length)
      arrValue = createTypedArray(ArrayType.Float32, length) as number[]
      for (let i = 0; i < length; i++) {
        arrValue[i] = Number((elementProp.v as number[])[i]) * mult
        expressionValue[i] = arrValue[i] ?? 0
      }
      this.value = arrValue
    }

    this.numKeys = elementProp.keyframes?.length ?? 0

    this.valueAtTime = elementProp.getValueAtTime
    this.speedAtTime = elementProp.getSpeedAtTime
    this.velocityAtTime = elementProp.getVelocityAtTime
    this.propertyGroup = elementProp.propertyGroup
  }

  key(pos: number) {
    if (!this.numKeys) {
      return 0
    }

    const { keyframes = [] } = this

    return keyframes[pos - 1]?.t ?? 0
  }
}
