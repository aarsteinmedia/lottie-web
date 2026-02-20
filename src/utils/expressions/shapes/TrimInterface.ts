import type { TrimModifier } from '@/utils/shapes/modifiers/TrimModifier'

import expressionPropertyFactory from '@/utils/expressions/ExpressionValueFactory'
import { BaseInterface } from '@/utils/expressions/shapes/BaseInterface'


export class TrimInterface extends BaseInterface {
  override prop?: TrimModifier = undefined
  get end() {
    return expressionPropertyFactory(this.prop?.e)
  }

  get offset() {
    return expressionPropertyFactory(this.prop?.o)
  }

  get start() {
    return expressionPropertyFactory(this.prop?.s)
  }

  override getInterface(val: string | number) {
    if (val === this.shape?.e?.ix || val === 'End' || val === 'end') {
      return this.end
    }
    if (val === this.shape?.s?.ix) {
      return this.start
    }
    if (val === this.shape?.o?.ix) {
      return this.offset
    }

    return null
  }
}