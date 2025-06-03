import type SVGGradientFillStyleData from '@/elements/helpers/shapes/SVGGradientFillStyleData'

import expressionPropertyFactory from '@/utils/expressions/ExpressionValueFactory'
import BaseInterface from '@/utils/expressions/shapes/BaseInterface'

export default class GradientFillInterface extends BaseInterface {
  override prop?: SVGGradientFillStyleData

  get endPoint() {
    return expressionPropertyFactory(this.prop?.e)
  }

  get opacity() {
    return expressionPropertyFactory(this.prop?.o)
  }

  get startPoint() {
    return expressionPropertyFactory(this.prop?.s)
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