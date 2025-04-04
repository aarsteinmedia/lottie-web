import ExpressionManager from '@/utils/expressions/ExpressionManager'
import TextProperty from '@/utils/text/TextProperty'

function addDecorator() {
  function searchExpressions() {
    if (this.data.d.x) {
      this.calculateExpression = new ExpressionManager(
        this.elem,
        this.data.d,
        this
      ) // .bind(this)(this.elem, this.data.d, this)
      this.addEffect(this.getExpressionValue.bind(this))
      return true
    }
    return null
  }

  TextProperty.prototype.getExpressionValue = function (currentValue, text) {
    const newValue = this.calculateExpression(text)
    if (currentValue.t !== newValue) {
      const newData = {}
      this.copyData(newData, currentValue)
      newData.t = newValue.toString()
      newData.__complete = false
      return newData
    }
    return currentValue
  }

  TextProperty.prototype.searchProperty = function () {
    const isKeyframed = this.searchKeyframes()
    const hasExpressions = this.searchExpressions()
    this.kf = isKeyframed || hasExpressions
    return this.kf
  }

  TextProperty.prototype.searchExpressions = searchExpressions
}

function initialize() {
  addDecorator()
}

export default initialize
