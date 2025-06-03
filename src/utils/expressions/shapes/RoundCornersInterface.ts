import type RoundCornersModifier from '@/utils/shapes/RoundCornersModifier'

import expressionPropertyFactory from '@/utils/expressions/ExpressionValueFactory'
import BaseInterface from '@/utils/expressions/shapes/BaseInterface'


export default class RoundCornersInterface extends BaseInterface {
  override prop?: RoundCornersModifier

  get radius() {
    return expressionPropertyFactory(this.prop?.rd)
  }

  override getInterface(value: string | number) {
    if (this.shape?.r?.ix === value || value === 'Round Corners 1') {
      return this.radius
    }

    return null
  }
}