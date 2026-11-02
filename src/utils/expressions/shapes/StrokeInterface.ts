import type { SVGStrokeStyleData } from '@/elements/helpers/shapes/SVGStrokeStyleData'

import { expressionPropertyFactory } from '@/utils/expressions/ExpressionPropertyFactory'
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
    switch (String(val).toLowerCase()) {
      case 'color':
      case 'colour': {
        return this.color
      }
      case 'opacity': {
        return this.opacity
      }
      case 'stroke width': {
        return this.strokeWidth
      }
      default: {
        return null
      }
    }
  }
}