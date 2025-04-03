import expressionHelpers from '@/utils/expressions/expressionHelpers'
import ExpressionManager from '@/utils/expressions/ExpressionManager'
import TextSelectorProp from '@/utils/text/TextSelectorProperty'

const TextExpressionSelectorPropFactory = (function () {
  function getValueProxy(index: number, total: number) {
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
    this.propType = 'textSelector'
    this.textTotal = data.totalChars
    this.selectorValue = 100
    this.lastValue = [1, 1, 1]
    this.k = true
    this.x = true
    this.getValue = ExpressionManager.initiateExpression.bind(this)(
      elem,
      data,
      this
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
})()

const propertyGetTextProp = TextSelectorProp.getTextSelectorProp
TextSelectorProp.getTextSelectorProp = function (elem, data, arr) {
  if (data.t === 1) {
    return new TextExpressionSelectorPropFactory(elem, data, arr)
  }
  return propertyGetTextProp(elem, data, arr)
}

export default TextExpressionSelectorPropFactory
