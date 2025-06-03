import type ShapeData from '@/elements/helpers/shapes/ShapeData'
import type { Shape } from '@/types'
import type LayerExpressionInterface from '@/utils/expressions/LayerInterface'
import type { ShapeProperty } from '@/utils/shapes/ShapeProperty'

import PropertyGroupFactory from '@/utils/expressions/PropertyGroupFactory'
import PropertyInterface from '@/utils/expressions/PropertyInterface'

export default class ShapePathInterface {
  _name?: string
  ind?: number
  ix?: number
  mn?: string
  prop: null | ShapeProperty
  propertyGroup: LayerExpressionInterface
  propertyIndex?: number

  get path() {
    if (this.prop?.k) {
      this.prop.getValue()
    }

    return this.prop
  }

  get shape() {
    return this.path
  }

  constructor(
    shape: Shape, view: ShapeData, propertyGroup: LayerExpressionInterface
  ) {
    this.prop = view.sh

    // @ts-expect-error
    const _propertyGroup = new PropertyGroupFactory(this, propertyGroup)

    this.prop?.setGroupProperty(new PropertyInterface('Path', _propertyGroup) as unknown as PropertyGroupFactory)

    this._name = shape.nm
    this.ix = shape.ix
    this.mn = shape.mn
    this.propertyGroup = propertyGroup
    this.propertyIndex = shape.ix

  }

  getInterface(val: string | number) {
    if (val === 'Shape' || val === 'shape' || val === 'Path' || val === 'path' || val === 'ADBE Vector Shape' || val === 2) {
      return this.path
    }

    return null
  }
}
