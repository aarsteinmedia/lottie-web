import type SVGStrokeStyleData from '@/elements/helpers/shapes/SVGStrokeStyleData'

import expressionPropertyFactory from '@/utils/expressions/ExpressionValueFactory'
import BaseInterface from '@/utils/expressions/shapes/BaseInterface'

export default class StrokeInterface extends BaseInterface {
  dashOb?: any
  view?: SVGStrokeStyleData

  get color() {
    return expressionPropertyFactory(this.view?.c)
  }

  get dash() {
    return this.dashOb
  }

  get opacity() {
    return expressionPropertyFactory(this.view?.o)
  }

  get strokeWidth() {
    return expressionPropertyFactory(this.view?.w)
  }

  override getInterface(val: string | number) {
    if (val === 'Color' || val === 'color') {
      return this.color
    }

    if (val === 'Opacity' || val === 'opacity') {
      return this.opacity
    }

    if (val === 'Stroke Width' || val === 'stroke width') {
      return this.strokeWidth
    }

    return null
  }
}