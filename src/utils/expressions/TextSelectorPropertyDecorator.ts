import { PropType } from '../enums'
import TextSelectorProp from '../text/TextSelectorProperty'
import expressionHelpers from './expressionHelpers'
import ExpressionManager from './ExpressionManager'

const TextExpressionSelectorPropFactory = (function () {
  function getValueProxy(index, total) {
    this.textIndex = index + 1
    this.textTotal = total
    this.v = this.getValue() * this.mult

    return this.v
  }

  return function (elem, data) {
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
    this.getValue = ExpressionManager.initiateExpression.bind(this)(
      elem, data, this
    )
    this.getMult = getValueProxy
    this.getVelocityAtTime = expressionHelpers.getVelocityAtTime
    if (this.kf) {
      this.getValueAtTime = expressionHelpers.getValueAtTime.bind(this)
    } else {
      this.getValueAtTime = expressionHelpers.getStaticValueAtTime.bind(this)
    }
    this.setGroupProperty = expressionHelpers.setGroupProperty
  }
}())

const propertyGetTextProp = TextSelectorProp.getTextSelectorProp

TextSelectorProp.getTextSelectorProp = function (
  elem, data, arr
) {
  if (data.t === 1) {
    return new TextExpressionSelectorPropFactory(
      elem, data, arr
    )
  }

  return propertyGetTextProp(
    elem, data, arr
  )
}

export default TextExpressionSelectorPropFactory
