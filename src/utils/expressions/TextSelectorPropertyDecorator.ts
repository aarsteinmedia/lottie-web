import type {
  CompElementInterface,
  ElementInterfaceIntersect,
  Vector3,
} from '@/types'

import {
  getStaticValueAtTime,
  getValueAtTime,
  getVelocityAtTime,
  setGroupProperty,
} from '@/utils/expressions/expressionHelpers'
import ExpressionManager from '@/utils/expressions/ExpressionManager'
import ShapePath from '@/utils/shapes/ShapePath'
import TextSelectorProperty from '@/utils/text/TextSelectorProperty'

export default class TextExpressionSelectorPropFactory {
  comp?: CompElementInterface
  elem: ElementInterfaceIntersect
  initiateExpression?: typeof ExpressionManager
  k: boolean
  kf?: boolean
  lastValue: Vector3
  mult: number
  propType: string
  pv: ShapePath | number
  selectorValue: number
  textIndex?: number
  textTotal: number
  v?: number
  x: boolean
  constructor(elem: ElementInterfaceIntersect, data: TextSelectorProperty) {
    this.pv = 1
    this.comp = elem.comp
    this.elem = elem
    this.mult = 0.01
    this.propType = 'textSelector'
    this.textTotal = data.totalChars || 0
    this.selectorValue = 100
    this.lastValue = [1, 1, 1]
    this.k = true
    this.x = true
    this.getValue = ExpressionManager.prototype.executeExpression

    this.getMult = this.getValueProxy
    this.getVelocityAtTime = getVelocityAtTime
    if (this.kf) {
      this.getValueAtTime = getValueAtTime.bind(this)
    } else {
      this.getValueAtTime = getStaticValueAtTime.bind(this)
    }
    this.setGroupProperty = setGroupProperty
  }
  getMult(_index: number, _total: number) {
    throw new Error(
      `${this.constructor.name}: Method getMult is not implemented`
    )
  }
  getValue(_val?: number): number {
    throw new Error(
      `${this.constructor.name}: Method getValue is not implemented`
    )
  }
  getValueAtTime(_frameNum: number) {
    throw new Error(
      `${this.constructor.name}: Method getValueAtTime is not implemented`
    )
  }
  getValueProxy(index: number, total: number) {
    this.textIndex = index + 1
    this.textTotal = total
    this.v = this.getValue() * this.mult
    return this.v
  }
  getVelocityAtTime(_frameNum: number) {
    throw new Error(
      `${this.constructor.name}: Method getVelocityAtTime is not implemented`
    )
  }
  setGroupProperty(_propertyGroup: any) {
    throw new Error(
      `${this.constructor.name}: Method getValueAtTime is not implemented`
    )
  }
}

// TODO: Fix this
// const propertyGetTextProp = TextSelectorProperty.prototype.getTextSelectorProp
// TextSelectorProperty.prototype.getTextSelectorProp = function (
//   elem,
//   data,
//   arr
// ) {
//   if (data.t === 1) {
//     return new TextExpressionSelectorPropFactory(elem, data, arr)
//   }
//   return propertyGetTextProp(elem, data, arr)
// }
