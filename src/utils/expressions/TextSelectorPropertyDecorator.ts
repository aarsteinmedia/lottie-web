import type {
  ElementInterfaceIntersect, ExpressionProperty, TextRangeValue,
  Vector3
} from '@/types'
import type KeyframedValueProperty from '@/utils/properties/KeyframedValueProperty'

import { PropType } from '@/utils/enums'
import expressionHelpers from '@/utils/expressions/expressionHelpers'
import ExpressionManager from '@/utils/expressions/ExpressionManager'
import BaseProperty from '@/utils/properties/BaseProperty'
import TextSelectorProp from '@/utils/text/TextSelectorProperty'

const notImplemented = 'Method not implemented'

export default class TextExpressionSelectorPropFactory extends BaseProperty {
  lastValue: Vector3
  selectorValue: number

  constructor (
    elem: ElementInterfaceIntersect, data: TextRangeValue & ExpressionProperty, _arr?: unknown[]
  ) {
    super()
    this.pv = 1
    this.comp = elem.comp
    this.elem = elem
    this.mult = 0.01
    this.propType = PropType.TextSelector
    this.textTotal = data.totalChars
    this.selectorValue = 100
    this.lastValue = [1,
      1,
      1]
    this.k = true
    this.x = true
    this.getValue = ExpressionManager.initiateExpression.bind(this as unknown as KeyframedValueProperty)(
      elem, data, this as unknown as KeyframedValueProperty
    )
    this.getMult = this.getValueProxy
    this.getVelocityAtTime = expressionHelpers.getVelocityAtTime
    if (this.kf) {
      this.getValueAtTime = expressionHelpers.getValueAtTime.bind(this)
    } else {
      this.getValueAtTime = expressionHelpers.getStaticValueAtTime.bind(this)
    }
    this.setGroupProperty = expressionHelpers.setGroupProperty
  }

  getMult(_index: number, _total: number) {
    throw new Error(notImplemented)
  }

  getTextSelectorProp(
    _elem: ElementInterfaceIntersect, _data: TextRangeValue, _arr: unknown[]
  ): KeyframedValueProperty {
    throw new Error(notImplemented)
  }

  getValueProxy(index: number, total: number) {
    this.textIndex = index + 1
    this.textTotal = total
    this.v = this.getValue() as number * (this.mult ?? 1)

    return this.v
  }
}

const propertyGetTextProp = TextSelectorProp.prototype.getTextSelectorProp

TextSelectorProp.prototype.getTextSelectorProp = function (
  elem: ElementInterfaceIntersect, data: TextRangeValue & ExpressionProperty, arr: unknown[]
) {
  if (data.t === 1) {
    return new TextExpressionSelectorPropFactory(
      elem, data, arr
    )
  }

  propertyGetTextProp(
    elem, data, arr
  )

  return null
}

