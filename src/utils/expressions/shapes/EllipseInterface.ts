import type EllShapeProperty from '@/utils/shapes/properties/EllShapeProperty'

import expressionPropertyFactory from '@/utils/expressions/ExpressionValueFactory'
import BaseInterface from '@/utils/expressions/shapes/BaseInterface'


export default class EllipseInterface extends BaseInterface {
  override prop?: EllShapeProperty

  get position() {
    return expressionPropertyFactory(this.prop?.p)
  }

  get size() {
    return expressionPropertyFactory(this.prop?.s)
  }

  override getInterface(value: string | number) {
    if (this.shape?.p?.ix === value) {
      return this.position
    }
    if (this.shape?.s?.ix === value) {
      return this.size
    }

    return null
  }
}