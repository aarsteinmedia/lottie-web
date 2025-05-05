import type SVGShapeData from '@/elements/helpers/shapes/SVGShapeData'
import type { Shape } from '@/types'
import type { ShapeProperty } from '@/utils/shapes/ShapeProperty'

import propertyGroupFactory from '@/utils/expressions/PropertyGroupFactory'
import PropertyInterface from '@/utils/expressions/PropertyInterface'

export default class ShapePathInterface {
  _name?: string
  _propertyGroup
  ind?: number
  ix?: number
  mn?: string
  path: ShapeProperty
  prop: ShapeProperty
  propertyGroup?: unknown
  propertyIndex?: number
  shape: ShapeProperty
  constructor(
    shape: Shape, view: SVGShapeData, propertyGroup: unknown
  ) {
    this.prop = view.sh

    this._propertyGroup = propertyGroupFactory(this.interfaceFunction,
      propertyGroup)
    this.prop.setGroupProperty(new PropertyInterface('Path', this._propertyGroup))

    if (this.prop.k) {
      this.prop.getValue()
    }
    this.path = this.prop
    if (this.prop.k) {
      this.prop.getValue()
    }
    this.shape = this.prop
    this._name = shape.nm
    this.ix = shape.ix
    this.propertyIndex = shape.ix
    this.mn = shape.mn
    this.propertyGroup = propertyGroup
  }

  interfaceFunction(val: string | number) {
    if (
      val === 'Shape' ||
      val === 'shape' ||
      val === 'Path' ||
      val === 'path' ||
      val === 'ADBE Vector Shape' ||
      val === 2
    ) {
      return this.path
    }

    return null
  }
}
