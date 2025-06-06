import type RepeaterModifier from '@/utils/shapes/modifiers/RepeaterModifier'

import expressionPropertyFactory from '@/utils/expressions/ExpressionValueFactory'
import BaseInterface from '@/utils/expressions/shapes/BaseInterface'

export default class RepeaterInterface extends BaseInterface {
  override prop?: RepeaterModifier

  get copies() {
    return expressionPropertyFactory(this.prop?.c)
  }

  get offset() {
    return expressionPropertyFactory(this.prop?.o)
  }

  override getInterface(value: string | number) {
    if (this.shape?.c?.ix === value || value === 'Copies') {
      return this.copies
    }

    if (this.shape?.o?.ix === value || value === 'Offset') {
      return this.offset
    }

    return null
  }
}