import type { StarShapeProperty } from '@/utils/shapes/properties/StarShapeProperty'

import expressionPropertyFactory from '@/utils/expressions/ExpressionValueFactory'
import { BaseInterface } from '@/utils/expressions/shapes/BaseInterface'


export class StarInterface extends BaseInterface {
  override prop?: StarShapeProperty

  get innerRadius() {
    return expressionPropertyFactory(this.prop?.ir)
  }

  get innerRoundness() {
    return expressionPropertyFactory(this.prop?.is)
  }

  get outerRadius() {
    return expressionPropertyFactory(this.prop?.or)
  }

  get outerRoundness() {
    return expressionPropertyFactory(this.prop?.os)
  }

  get points() {
    return expressionPropertyFactory(this.prop?.pt)
  }

  get position() {
    return expressionPropertyFactory(this.prop?.p)
  }

  get rotation() {
    return expressionPropertyFactory(this.prop?.r)
  }

  override getInterface(value: string | number) {
    if (this.shape?.p?.ix === value) {
      return this.position
    }
    if (this.shape?.r?.ix === value) {
      return this.rotation
    }
    if (this.shape?.pt?.ix === value) {
      return this.points
    }
    if (this.shape?.or?.ix === value || value === 'ADBE Vector Star Outer Radius') {
      return this.outerRadius
    }
    if (this.shape?.os?.ix === value) {
      return this.outerRoundness
    }
    if (this.shape?.ir?.ix === value || value === 'ADBE Vector Star Inner Radius') {
      return this.innerRadius
    }
    if (this.shape?.is?.ix === value) {
      return this.innerRoundness
    }

    return null
  }
}