import type { ElementInterfaceIntersect, ExpressionProperty } from '@/types'
import type LayerExpressionInterface from '@/utils/expressions/LayerInterface'
import type PropertyGroupFactory from '@/utils/expressions/PropertyGroupFactory'
import type { BaseProperty, KeyframedValueProperty } from '@/utils/Properties'

import { isArrayOfNum } from '@/utils'
import { ArrayType } from '@/utils/enums'
import ExpressionManager from '@/utils/expressions/ExpressionManager'
import { createTypedArray } from '@/utils/helpers/arrays'

function searchExpressions(
  elem: ElementInterfaceIntersect, data?: ExpressionProperty, prop?: KeyframedValueProperty
) {
  if (!data?.x || !prop) {
    return
  }
  prop.k = true
  prop.x = true
  prop.initiateExpression = ExpressionManager.initiateExpression

  prop.effectsSequence.push(prop.initiateExpression(
    elem, data, prop
  ).bind(prop))

}

function getValueAtTime(this: BaseProperty, frameNumFromProps: number) {
  let frameNum = frameNumFromProps

  frameNum *= this.elem?.globalData?.frameRate ?? 60
  frameNum -= this.offsetTime
  if (this._cachingAtTime && frameNum !== this._cachingAtTime.lastFrame) {
    this._cachingAtTime.lastIndex = this._cachingAtTime.lastFrame < frameNum ? this._cachingAtTime.lastIndex : 0
    this._cachingAtTime.value = this.interpolateValue(frameNum, this._cachingAtTime)
    this._cachingAtTime.lastFrame = frameNum
  }

  return this._cachingAtTime?.value
}

function getSpeedAtTime(this: BaseProperty, frameNum: number) {
  const delta = -0.01,
    v1 = this.getValueAtTime(frameNum),
    v2 = this.getValueAtTime(frameNum + delta)
  let speed = 0

  if (isArrayOfNum(v1) && isArrayOfNum(v2)) {
    const { length } = v1

    for (let i = 0; i < length; i++) {
      speed += Math.pow(v2[i] - v1[i], 2)
    }
    speed = Math.sqrt(speed) * 100
  } else {
    speed = 0
  }

  return speed
}

function getVelocityAtTime(this: BaseProperty, frameNum: number): number | number[] {
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
    const { length } = v1

    velocity = createTypedArray(ArrayType.Float32, length)

    for (let i = 0; i < length; i++) {
      // removing frameRate
      // if needed, don't add it here
      // velocity[i] = this.elem.globalData.frameRate*((v2[i] - v1[i])/delta);
      velocity[i] = (v2[i] - v1[i]) / delta
    }

    return velocity as number[]
  }
  velocity = (v2 as number - (v1 as number)) / delta

  return velocity
}

function getStaticValueAtTime(
  this: BaseProperty, _time?: number, _num?: number
) {
  return this.pv
}

function setGroupProperty(this: BaseProperty, propertyGroup: PropertyGroupFactory) {
  this.propertyGroup = propertyGroup as unknown as LayerExpressionInterface
}


const expressionHelpers = {
  getSpeedAtTime,
  getStaticValueAtTime,
  getValueAtTime,
  getVelocityAtTime,
  searchExpressions,
  setGroupProperty,
}

export default expressionHelpers
