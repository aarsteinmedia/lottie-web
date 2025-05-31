import type TrimModifier from '@/utils/shapes/TrimModifier'

import expressionPropertyFactory from '@/utils/expressions/ExpressionValueFactory'
import BaseInterface from '@/utils/expressions/shapes/BaseInterface'


export default class TrimInterface extends BaseInterface {
  view?: TrimModifier
  get end() {
    return expressionPropertyFactory(this.view?.e)
  }

  get offset() {
    return expressionPropertyFactory(this.view?.o)
  }

  get start() {
    return expressionPropertyFactory(this.view?.s)
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