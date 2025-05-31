import expressionPropertyFactory from '@/utils/expressions/ExpressionValueFactory'
import BaseInterface from '@/utils/expressions/shapes/BaseInterface'

export default class GradientFillInterface extends BaseInterface {
  view?: unknown

  get endPoint() {
    return expressionPropertyFactory(this.view.e)
  }

  get opacity() {
    return expressionPropertyFactory(this.view.o)
  }

  get startPoint() {
    return expressionPropertyFactory(this.view.s)
  }

  get type() {
    return 'a'
  }

  override getInterface(val: string | number) {
    if (val === 'Start Point' || val === 'start point') {
      return this.startPoint
    }
    if (val === 'End Point' || val === 'end point') {
      return this.endPoint
    }
    if (val === 'Opacity' || val === 'opacity') {
      return this.opacity
    }

    return null
  }
}