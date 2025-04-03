import type SVGShapeData from '@/elements/helpers/shapes/SVGShapeData'

import { Shape } from '@/types'
import propertyGroupFactory from '@/utils/expressions/PropertyGroupFactory'
import PropertyInterface from '@/utils/expressions/PropertyInterface'
import { ShapeProperty } from '@/utils/shapes/ShapeProperty'

export default class ShapePathInterface {
  _name: { value?: string }
  _propertyGroup
  ix: { value?: number }

  mn: { value?: string }
  path: { get(): ShapeProperty }
  prop: ShapeProperty
  propertyGroup: { value?: unknown }
  propertyIndex: { value?: number }
  shape: { get(): ShapeProperty }
  constructor(shape: Shape, view: SVGShapeData, propertyGroup: unknown) {
    this.prop = view.sh

    this._propertyGroup = propertyGroupFactory(
      this.interfaceFunction,
      propertyGroup
    )
    this.prop.setGroupProperty(PropertyInterface('Path', this._propertyGroup))
    this.path = {
      get: () => {
        if (this.prop.k) {
          this.prop.getValue()
        }
        return this.prop
      },
    }
    this.shape = {
      get: () => {
        if (this.prop.k) {
          this.prop.getValue()
        }
        return this.prop
      },
    }
    this._name = { value: shape.nm }
    this.ix = { value: shape.ix }
    this.propertyIndex = { value: shape.ix }
    this.mn = { value: shape.mn }
    this.propertyGroup = { value: propertyGroup }
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
