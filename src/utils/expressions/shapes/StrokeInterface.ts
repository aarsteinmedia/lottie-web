import type { SVGStrokeStyleData } from '@/elements/helpers/shapes/SVGStrokeStyleData'

import expressionPropertyFactory from '@/utils/expressions/ExpressionValueFactory'
import { BaseInterface } from '@/utils/expressions/shapes/BaseInterface'

export class StrokeInterface extends BaseInterface {
  dashOb?: Record<PropertyKey, unknown>
  override prop?: SVGStrokeStyleData = undefined

  get color() {
    return expressionPropertyFactory(this.prop?.c)
  }

  get dash() {
    return this.dashOb
  }

  get opacity() {
    return expressionPropertyFactory(this.prop?.o)
  }

  get strokeWidth() {
    return expressionPropertyFactory(this.prop?.w)
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