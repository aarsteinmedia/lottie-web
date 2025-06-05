import type { Vector3 } from '@/types'
import type MultiDimensionalProperty from '@/utils/properties/MultiDimensionalProperty'
import type ValueProperty from '@/utils/properties/ValueProperty'

import expressionPropertyFactory from '@/utils/expressions/ExpressionValueFactory'
import BaseInterface from '@/utils/expressions/shapes/BaseInterface'

export default class FillInterface extends BaseInterface {
  c?: MultiDimensionalProperty<Vector3>
  o?: ValueProperty
  get color() {
    return expressionPropertyFactory(this.c)
  }

  get opacity() {
    return expressionPropertyFactory(this.o)
  }

  override getInterface(val: string | number) {
    if (val === 'Color' || val === 'color') {
      return this.color
    }

    if (val === 'Opacity' || val === 'opacity') {
      return this.opacity
    }

    return null
  }
}