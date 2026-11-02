import type { RoundCornersModifier } from '@/utils/shapes/modifiers/RoundCornersModifier'

import { expressionPropertyFactory } from '@/utils/expressions/ExpressionPropertyFactory'
import { BaseInterface } from '@/utils/expressions/shapes/BaseInterface'


export class RoundCornersInterface extends BaseInterface {
  override prop?: RoundCornersModifier = undefined

  get radius() {
    return expressionPropertyFactory(this.prop?.rd)
  }

  override getInterface(value: string | number) {
    const normalizedValue = String(value).toLowerCase().trim()

    if (this.shape?.r?.ix === value || normalizedValue.startsWith('round corners')) {
      return this.radius
    }

    return null
  }
}