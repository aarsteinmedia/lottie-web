import type { DocumentData } from '@/types'

import ExpressionManager from '@/utils/expressions/ExpressionManager'
import TextProperty from '@/utils/text/TextProperty'

export default function addTextDecorator() {
  function searchExpressions(this: TextProperty): boolean | null {
    if (this.data.d && 'x' in this.data.d) {
      this.calculateExpression = new ExpressionManager().initiateExpression(
        this.elem,
        this.data.d as any,
        this as any
      ) as any // .bind(this)(this.elem, this.data.d, this)
      this.addEffect(this.getExpressionValue.bind(this) as any)

      return true
    }

    return null
  }

  TextProperty.prototype.getExpressionValue = function (currentValue, text) {
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

    return Boolean(this.kf)
  }

  TextProperty.prototype.searchExpressions = searchExpressions
}
