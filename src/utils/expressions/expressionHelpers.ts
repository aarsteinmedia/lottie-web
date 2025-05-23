import type { ElementInterfaceIntersect } from '@/types'
import type LayerExpressionInterface from '@/utils/expressions/LayerInterface'
import type { BaseProperty } from '@/utils/Properties'
import type {
  ShapeBaseProperty,
  ShapeProperty,
} from '@/utils/shapes/ShapeProperty'
import type TextSelectorProperty from '@/utils/text/TextSelectorProperty'

import { isArrayOfNum } from '@/utils'
import { ArrayType } from '@/utils/enums'
import ExpressionManager from '@/utils/expressions/ExpressionManager'
import { createTypedArray } from '@/utils/helpers/arrays'

export function getSpeedAtTime(this: BaseProperty, frameNum: number) {
  const delta = -0.01,
    v1 = this.getValueAtTime(frameNum),
    v2 = this.getValueAtTime(frameNum + delta)
  let speed = 0

  if (isArrayOfNum(v1) && isArrayOfNum(v2)) {
    for (const [i, element] of v1.entries()) {
      speed += Math.pow(v2[i] - element, 2)
    }
    speed = Math.sqrt(speed) * 100
  } else {
    speed = 0
  }

  return speed
}

export function getValueAtTime(this: TextSelectorProperty,
  frameNumFromProps: number) {
  // if (!this.elem.globalData) {
  //   throw new Error(`${this.constructor.name} elem->globalData is not implemented`)
  // }
  let frameNum = frameNumFromProps

  frameNum *= this.elem.globalData.frameRate
  frameNum -= this.offsetTime
  if (this._cachingAtTime && frameNum !== this._cachingAtTime.lastFrame) {
    this._cachingAtTime.lastIndex =
      this._cachingAtTime.lastFrame < frameNum
        ? this._cachingAtTime.lastIndex
        : 0
    this._cachingAtTime.value = this.interpolateValue(frameNum,
      this._cachingAtTime)
    this._cachingAtTime.lastFrame = frameNum
  }

  return this._cachingAtTime?.value
}

export function getVelocityAtTime(this: BaseProperty, frameNum: number) {
  if (this.vel !== undefined) {
    return this.vel
  }
  const delta = -0.001,
    /**
     * FrameNum += this.elem.data.st;.
     */
    v1 = this.getValueAtTime(frameNum),
    v2 = this.getValueAtTime(frameNum + delta)
  let velocity

  if (isArrayOfNum(v1) && isArrayOfNum(v2)) {
    velocity = createTypedArray(ArrayType.Float32, v1.length)
    for (const [i, element] of v1.entries()) {
      // removing frameRate
      // if needed, don't add it here
      // velocity[i] = this.elem.globalData.frameRate*((v2[i] - v1[i])/delta);
      velocity[i] = (v2[i] - element) / delta
    }
  } else if (!isArrayOfNum(v1) && !isArrayOfNum(v2)) {
    velocity = (v2 - v1) / delta
  }

  return velocity as number | number[]
}

export function getStaticValueAtTime(this: ShapeBaseProperty) {
  return this.pv
}

export function searchExpressions(
  elem: ElementInterfaceIntersect,
  data: TextSelectorProperty,
  prop: TextSelectorProperty | ShapeProperty
) {
  if (!data.x) {
    return
  }
  prop.k = true
  prop.x = true
  prop.initiateExpression = ExpressionManager.prototype
    .initiateExpression as any

  prop.effectsSequence.push((prop.initiateExpression as any)(
    elem, data, prop
  ).bind(prop))
}

export function setGroupProperty(this: BaseProperty,
  propertyGroup: LayerExpressionInterface) {
  this.propertyGroup = propertyGroup
}
