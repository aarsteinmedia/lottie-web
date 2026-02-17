import type { RectShapeProperty } from '@/utils/shapes/properties/RectShapeProperty'

import expressionPropertyFactory from '@/utils/expressions/ExpressionValueFactory'
import { BaseInterface } from '@/utils/expressions/shapes/BaseInterface'

export class RectInterface extends BaseInterface {
  override prop?: RectShapeProperty
  get position() {
    return expressionPropertyFactory(this.prop?.p)
  }

  get roundness() {
    return expressionPropertyFactory(this.prop?.r)
  }

  get size() {
    return expressionPropertyFactory(this.prop?.s)
  }

  override getInterface(value: string | number) {
    if (this.shape?.p?.ix === value) {
      return this.position
    }
    if (this.shape?.r?.ix === value) {
      return this.roundness
    }
    if (this.shape?.s?.ix === value || value === 'Size' || value === 'ADBE Vector Rect Size') {
      return this.size
    }

    return null
  }
}