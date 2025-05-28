import type { ElementInterfaceIntersect, ExpressionProperty } from '@/types'
import type { KeyframedValueProperty } from '@/utils/Properties'

import ExpressionManager from '@/utils/expressions/ExpressionManager'
import { createTypedArray } from '@/utils/helpers/arrays'

const expressionHelpers = (function () {
  function searchExpressions(
    elem: ElementInterfaceIntersect,
    data: ExpressionProperty,
    prop: KeyframedValueProperty
  ) {
    if (!data.x) {
      return
    }

    prop.k = true
    prop.x = true
    prop.initiateExpression = ExpressionManager.initiateExpression
    prop.effectsSequence.push(prop.initiateExpression(
      elem, data, prop
    ).bind(prop))
  }

  function getValueAtTime(frameNum) {
    frameNum *= this.elem.globalData.frameRate
    frameNum -= this.offsetTime
    if (frameNum !== this._cachingAtTime.lastFrame) {
      this._cachingAtTime.lastIndex = this._cachingAtTime.lastFrame < frameNum ? this._cachingAtTime.lastIndex : 0
      this._cachingAtTime.value = this.interpolateValue(frameNum, this._cachingAtTime)
      this._cachingAtTime.lastFrame = frameNum
    }

    return this._cachingAtTime.value
  }

  function getSpeedAtTime(frameNum) {
    const delta = -0.01
    const v1 = this.getValueAtTime(frameNum)
    const v2 = this.getValueAtTime(frameNum + delta)
    let speed = 0

    if (v1.length > 0) {
      let i

      for (i = 0; i < v1.length; i += 1) {
        speed += Math.pow(v2[i] - v1[i], 2)
      }
      speed = Math.sqrt(speed) * 100
    } else {
      speed = 0
    }

    return speed
  }

  function getVelocityAtTime(frameNum) {
    if (this.vel !== undefined) {
      return this.vel
    }
    const delta = -0.001
    // frameNum += this.elem.data.st;
    const v1 = this.getValueAtTime(frameNum)
    const v2 = this.getValueAtTime(frameNum + delta)
    let velocity

    if (v1.length > 0) {
      velocity = createTypedArray('float32', v1.length)
      let i

      for (i = 0; i < v1.length; i += 1) {
        // removing frameRate
        // if needed, don't add it here
        // velocity[i] = this.elem.globalData.frameRate*((v2[i] - v1[i])/delta);
        velocity[i] = (v2[i] - v1[i]) / delta
      }
    } else {
      velocity = (v2 - v1) / delta
    }

    return velocity
  }

  function getStaticValueAtTime() {
    return this.pv
  }

  function setGroupProperty(propertyGroup) {
    this.propertyGroup = propertyGroup
  }

  return {
    getSpeedAtTime,
    getStaticValueAtTime,
    getValueAtTime,
    getVelocityAtTime,
    searchExpressions,
    setGroupProperty,
  }
}())

export default expressionHelpers
