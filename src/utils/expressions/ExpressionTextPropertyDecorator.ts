import type { DocumentData, ExpressionProperty } from '@/types'
import type { KeyframedValueProperty } from '@/utils/Properties'

import ExpressionManager from '@/utils/expressions/ExpressionManager'
import TextProperty from '@/utils/text/TextProperty'

function searchExpressions(this: TextProperty) {
  if (this.data.d?.x) {
    // @ts-expect-error
    this.calculateExpression = ExpressionManager.initiateExpression.bind(this as unknown as KeyframedValueProperty)(
      this.elem, this.data.d as unknown as ExpressionProperty, this as unknown as KeyframedValueProperty
    )
    // @ts-expect-error
    this.addEffect(this.getExpressionValue.bind(this))

    return true
  }

  return null
}

function addDecorator() {

  TextProperty.prototype.getExpressionValue = function (currentValue, text: string) {
    const newValue = this.calculateExpression(text)

    if (currentValue.t !== newValue) {
      const newData = {} as DocumentData

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

    this.kf = Boolean(isKeyframed || hasExpressions)

    return this.kf
  }

  TextProperty.prototype.searchExpressions = searchExpressions
}

function initialize() {
  addDecorator()
}

export default initialize
