import type ShapeData from '@/elements/helpers/shapes/ShapeData'
import type ShapeGroupData from '@/elements/helpers/shapes/ShapeGroupData'
import type SVGFillStyleData from '@/elements/helpers/shapes/SVGFillStyleData'
import type SVGGradientFillStyleData from '@/elements/helpers/shapes/SVGGradientFillStyleData'
import type SVGShapeData from '@/elements/helpers/shapes/SVGShapeData'
import type SVGStrokeStyleData from '@/elements/helpers/shapes/SVGStrokeStyleData'
import type SVGTransformData from '@/elements/helpers/shapes/SVGTransformData'
import type { Shape } from '@/types'
import type LayerExpressionInterface from '@/utils/expressions/LayerInterface'
import type RepeaterModifier from '@/utils/shapes/RepeaterModifier'
import type TrimModifier from '@/utils/shapes/TrimModifier'

import { ShapeType } from '@/utils/enums'
import expressionPropertyFactory from '@/utils/expressions/ExpressionValueFactory'
import PropertyGroupFactory from '@/utils/expressions/PropertyGroupFactory'
import PropertyInterface from '@/utils/expressions/PropertyInterface'
import ContentInterface from '@/utils/expressions/shapes/ContentInterface'
import EllipseInterface from '@/utils/expressions/shapes/EllipseInterface'
import FillInterface from '@/utils/expressions/shapes/FillInterface'
import GradientFillInterface from '@/utils/expressions/shapes/GradientFillInterface'
import GroupInterface from '@/utils/expressions/shapes/GroupInterface'
import RectInterface from '@/utils/expressions/shapes/RectInterface'
import ShapePathInterface from '@/utils/expressions/shapes/ShapePathInterface'
import StarInterface from '@/utils/expressions/shapes/StarInterface'
import StrokeInterface from '@/utils/expressions/shapes/StrokeInterface'
import TransformInterface from '@/utils/expressions/shapes/TransformInterface'
import TrimInterface from '@/utils/expressions/shapes/TrimInterface'


export default class ShapeExpressionInterface {
  _name: string
  arr = []
  interfaces: ShapePathInterface[]
  numProperties: number
  parentGroup: LayerExpressionInterface
  propertyGroup: PropertyGroupFactory
  constructor(
    shapes: Shape[], view: ShapeGroupData, propertyGroup: LayerExpressionInterface
  ) {
    this.parentGroup = propertyGroup
    this.propertyGroup = new PropertyGroupFactory(this, this.parentGroupWrapper)
    this.interfaces = this.iterateElements(
      shapes, view, this.propertyGroup
    )
    this.numProperties = this.interfaces.length
    this._name = 'Contents'
  }

  contentsInterfaceFactory(
    shape: Shape, view: ShapeGroupData, propertyGroup: PropertyGroupFactory
  ) {

    ContentInterface.prototype.propertyGroup = new PropertyGroupFactory(ContentInterface, propertyGroup)

    this.interfaces = this.iterateElements(
      shape.it, view.it, ContentInterface.prototype.propertyGroup
    )
    ContentInterface.prototype.numProperties = this.interfaces.length
    const transformInterface = this.transformInterfaceFactory(
      shape.it[shape.it.length - 1], view.it[view.it.length - 1], ContentInterface.prototype.propertyGroup
    )

    ContentInterface.prototype.transform = transformInterface
    ContentInterface.prototype.propertyIndex = shape.cix
    ContentInterface.prototype._name = shape.nm

    return ContentInterface.prototype.getInterface
  }

  defaultInterfaceFactory() {
    return this.noOp
  }

  ellipseInterfaceFactory(
    shape: Shape, view: SVGShapeData, propertyGroup: PropertyGroupFactory
  ) {

    const _propertyGroup = new PropertyGroupFactory(EllipseInterface, propertyGroup)

    EllipseInterface.prototype.shape = shape
    EllipseInterface.prototype.propertyIndex = shape.ix
    const prop = view.sh?.ty === ShapeType.Trim ? view.sh.prop : view.sh


    prop.s.setGroupProperty(new PropertyInterface('Size', _propertyGroup))
    prop.p.setGroupProperty(new PropertyInterface('Position', _propertyGroup))

    EllipseInterface.prototype._name = shape.nm
    EllipseInterface.prototype.prop = prop
    EllipseInterface.prototype.mn = shape.mn

    return EllipseInterface.prototype.getInterface
  }

  fillInterfaceFactory(
    shape: Shape, view: SVGFillStyleData, propertyGroup: PropertyGroupFactory
  ) {

    FillInterface.prototype._name = shape.nm
    FillInterface.prototype.c = view.c
    FillInterface.prototype.mn = shape.mn
    FillInterface.prototype.o = view.o

    view.c?.setGroupProperty(new PropertyInterface('Color', propertyGroup))
    view.o?.setGroupProperty(new PropertyInterface('Opacity', propertyGroup))

    return FillInterface.prototype.getInterface
  }

  getInterface(valueFromProps: string | number) {
    let value = valueFromProps

    if (typeof value === 'number') {
      value = valueFromProps === undefined ? 1 : valueFromProps
      if (value === 0) {
        return propertyGroup
      }

      return this.interfaces[value - 1]
    }
    let i = 0

    const len = this.interfaces.length

    while (i < len) {
      if (this.interfaces[i]._name === value) {
        return this.interfaces[i]
      }
      i += 1
    }

    return null
  }

  gradientFillInterfaceFactory(
    shape: Shape, view: SVGGradientFillStyleData, propertyGroup: PropertyGroupFactory
  ) {

    GradientFillInterface.prototype._name = shape.nm
    GradientFillInterface.prototype.view = view
    GradientFillInterface.prototype.mn = shape.mn


    view.s?.setGroupProperty(new PropertyInterface('Start Point', propertyGroup))
    view.e?.setGroupProperty(new PropertyInterface('End Point', propertyGroup))
    view.o?.setGroupProperty(new PropertyInterface('Opacity', propertyGroup))

    return GradientFillInterface.prototype.getInterface
  }

  groupInterfaceFactory(
    shape: Shape, view: ShapeGroupData, propertyGroup: PropertyGroupFactory
  ) {


    GroupInterface.prototype.propertyGroup = new PropertyGroupFactory(GroupInterface, propertyGroup)
    const content = this.contentsInterfaceFactory(
      shape, view, GroupInterface.prototype.propertyGroup
    )
    const transformInterface = this.transformInterfaceFactory(
      shape.it[shape.it.length - 1], view.it[view.it.length - 1], GroupInterface.prototype.propertyGroup
    )

    GroupInterface.prototype.content = content
    GroupInterface.prototype.transform = transformInterface
    GroupInterface.prototype.shape = shape
    // interfaceFunction.content = interfaceFunction;
    GroupInterface.prototype.numProperties = shape.np
    GroupInterface.prototype.propertyIndex = shape.ix
    GroupInterface.prototype.nm = shape.nm
    GroupInterface.prototype.mn = shape.mn

    return GroupInterface.prototype.getInterface
  }

  iterateElements(
    shapes: null | Shape[], view: ShapeGroupData[], propertyGroup: PropertyGroupFactory
  ) {
    const arr: ShapePathInterface[] = [],
      { length } = shapes ?? []

    for (let i = 0; i < length; i++) {
      if (!shapes) {
        continue
      }
      switch (shapes[i].ty) {
        case ShapeType.Group: {
          arr.push(this.groupInterfaceFactory(
            shapes[i], view[i], propertyGroup
          ))

          break
        }
        case ShapeType.Fill: {
          arr.push(this.fillInterfaceFactory(
            shapes[i], view[i], propertyGroup
          ))

          break
        }
        case ShapeType.Stroke: {
          arr.push(this.strokeInterfaceFactory(
            shapes[i], view[i], propertyGroup
          ))

          break
        }
        case ShapeType.Trim: {
          arr.push(this.trimInterfaceFactory(
            shapes[i], view[i], propertyGroup
          ))

          break
        }
        case ShapeType.Transform: {
          // arr.push(transformInterfaceFactory(shapes[i],view[i],propertyGroup));

          break
        }
        case ShapeType.Ellipse: {
          arr.push(this.ellipseInterfaceFactory(
            shapes[i], view[i], propertyGroup
          ))

          break
        }
        case ShapeType.PolygonStar: {
          arr.push(this.starInterfaceFactory(
            shapes[i], view[i], propertyGroup
          ))

          break
        }
        case ShapeType.Path: {
          arr.push(new ShapePathInterface(
            shapes[i], view[i], propertyGroup
          ))

          break
        }
        case ShapeType.Rectangle: {
          arr.push(this.rectInterfaceFactory(
            shapes[i], view[i], propertyGroup
          ))

          break
        }
        case ShapeType.RoundedCorners: {
          arr.push(this.roundedInterfaceFactory(
            shapes[i], view[i], propertyGroup
          ))

          break
        }
        case ShapeType.Repeater: {
          arr.push(this.repeaterInterfaceFactory(
            shapes[i], view[i], propertyGroup
          ))

          break
        }
        case ShapeType.GradientFill: {
          arr.push(this.gradientFillInterfaceFactory(
            shapes[i], view[i], propertyGroup
          ))

          break
        }
        default: {
          arr.push(this.defaultInterfaceFactory(
            shapes[i], view[i], propertyGroup
          ))
        }
      }
    }

    return arr
  }

  parentGroupWrapper() {
    return this.parentGroup
  }

  rectInterfaceFactory(
    shape: Shape, view: SVGShapeData, propertyGroup: PropertyGroupFactory
  ) {

    RectInterface.prototype.shape = shape
    const _propertyGroup = new PropertyGroupFactory(RectInterface, propertyGroup)

    const prop = view.sh?.ty === ShapeType.Trim ? view.sh.prop : view.sh

    RectInterface.prototype.propertyIndex = shape.ix

    prop.p.setGroupProperty(new PropertyInterface('Position', _propertyGroup))
    prop.s.setGroupProperty(new PropertyInterface('Size', _propertyGroup))
    prop.r.setGroupProperty(new PropertyInterface('Rotation', _propertyGroup))

    RectInterface.prototype.prop = prop
    RectInterface.prototype._name = shape.nm
    RectInterface.prototype.mn = shape.mn

    return RectInterface.prototype.getInterface
  }

  repeaterInterfaceFactory(
    shape: Shape, view: RepeaterModifier, propertyGroup: LayerExpressionInterface
  ) {
    function interfaceFunction(value: number | string) {
      if (shape.c?.ix === value || value === 'Copies') {
        return interfaceFunction.copies
      } if (shape.o.ix === value || value === 'Offset') {
        return interfaceFunction.offset
      }

      return null
    }

    const _propertyGroup = new PropertyGroupFactory(interfaceFunction, propertyGroup)
    const prop = view

    interfaceFunction.propertyIndex = shape.ix

    prop.c?.setGroupProperty(new PropertyInterface('Copies', _propertyGroup))
    prop.o?.setGroupProperty(new PropertyInterface('Offset', _propertyGroup))
    Object.defineProperties(interfaceFunction, {
      _name: { value: shape.nm },
      copies: { get: expressionPropertyFactory(prop.c) },
      offset: { get: expressionPropertyFactory(prop.o) },
    })
    interfaceFunction.mn = shape.mn

    return interfaceFunction
  }

  roundedInterfaceFactory(
    shape: Shape, view, propertyGroup
  ) {
    function interfaceFunction(value) {
      if (shape.r.ix === value || value === 'Round Corners 1') {
        return interfaceFunction.radius
      }

      return null
    }

    const _propertyGroup = new PropertyGroupFactory(interfaceFunction, propertyGroup)
    const prop = view

    interfaceFunction.propertyIndex = shape.ix
    prop.rd.setGroupProperty(new PropertyInterface('Radius', _propertyGroup))

    Object.defineProperties(interfaceFunction, {
      _name: { value: shape.nm },
      radius: { get: expressionPropertyFactory(prop.rd) },
    })
    interfaceFunction.mn = shape.mn

    return interfaceFunction
  }

  starInterfaceFactory(
    shape: Shape, view: ShapeData, propertyGroup: PropertyGroupFactory,
  ) {

    StarInterface.prototype.shape = shape

    const _propertyGroup = new PropertyGroupFactory(StarInterface, propertyGroup)
    const prop = view.sh?.ty === ShapeType.Trim ? view.sh.prop : view.sh

    StarInterface.prototype.propertyIndex = shape.ix
    prop.or.setGroupProperty(new PropertyInterface('Outer Radius', _propertyGroup))
    prop.os.setGroupProperty(new PropertyInterface('Outer Roundness', _propertyGroup))
    prop.pt.setGroupProperty(new PropertyInterface('Points', _propertyGroup))
    prop.p.setGroupProperty(new PropertyInterface('Position', _propertyGroup))
    prop.r.setGroupProperty(new PropertyInterface('Rotation', _propertyGroup))
    if (shape.ir) {
      prop.ir.setGroupProperty(new PropertyInterface('Inner Radius', _propertyGroup))
      prop.is.setGroupProperty(new PropertyInterface('Inner Roundness', _propertyGroup))
    }

    StarInterface.prototype._name = shape.nm
    StarInterface.prototype.prop = prop
    StarInterface.prototype.mn = shape.mn

    return StarInterface.prototype.getInterface
  }

  strokeInterfaceFactory(
    shape: Shape, view: SVGStrokeStyleData, propertyGroup: PropertyGroupFactory
  ) {
    const dashOb = {}
    const _propertyGroup = new PropertyGroupFactory(StrokeInterface, propertyGroup)
    const _dashPropertyGroup = new PropertyGroupFactory(dashOb, _propertyGroup)

    function addPropertyToDashOb(it: number) {
      Object.defineProperty(
        dashOb, shape.d?.[it].nm, { get: expressionPropertyFactory(view.d.dataProps[it].p) }
      )
    }
    let i

    const len = shape.d ? shape.d.length : 0

    for (i = 0; i < len; i += 1) {
      addPropertyToDashOb(i)
      view.d.dataProps[i].p.setGroupProperty(_dashPropertyGroup)
    }

    StrokeInterface.prototype._name = shape.nm
    StrokeInterface.prototype.mn = shape.mn
    StrokeInterface.prototype.dashOb = dashOb
    StrokeInterface.prototype.view = view

    view.c?.setGroupProperty(new PropertyInterface('Color', _propertyGroup))
    view.o?.setGroupProperty(new PropertyInterface('Opacity', _propertyGroup))
    view.w?.setGroupProperty(new PropertyInterface('Stroke Width', _propertyGroup))

    return StrokeInterface.prototype.getInterface
  }

  transformInterfaceFactory(
    shape: Shape, view: SVGTransformData | SVGFillStyleData, propertyGroup: PropertyGroupFactory
  ) {

    TransformInterface.prototype.shape = shape
    const _propertyGroup = new PropertyGroupFactory(TransformInterface, propertyGroup)

    view.transform?.mProps.o?.setGroupProperty(new PropertyInterface('Opacity', _propertyGroup))
    view.transform?.mProps.p?.setGroupProperty(new PropertyInterface('Position', _propertyGroup))
    view.transform?.mProps.a?.setGroupProperty(new PropertyInterface('Anchor Point', _propertyGroup))
    view.transform?.mProps.s?.setGroupProperty(new PropertyInterface('Scale', _propertyGroup))
    view.transform?.mProps.r?.setGroupProperty(new PropertyInterface('Rotation', _propertyGroup))
    if (view.transform?.mProps.sk) {
      view.transform.mProps.sk.setGroupProperty(new PropertyInterface('Skew', _propertyGroup))
      view.transform.mProps.sa?.setGroupProperty(new PropertyInterface('Skew Angle', _propertyGroup))
    }
    view.transform?.op.setGroupProperty(new PropertyInterface('Opacity', _propertyGroup))

    TransformInterface.prototype._name = shape.nm
    TransformInterface.prototype.view = view

    TransformInterface.prototype.ty = ShapeType.Transform
    TransformInterface.prototype.mn = shape.mn
    TransformInterface.prototype.propertyGroup = propertyGroup

    return TransformInterface.prototype.getInterface
  }

  trimInterfaceFactory(
    shape: Shape, view: TrimModifier, propertyGroup: PropertyGroupFactory
  ) {

    TrimInterface.prototype.shape = shape
    const _propertyGroup = new PropertyGroupFactory(TrimInterface, propertyGroup)

    TrimInterface.prototype.propertyIndex = shape.ix

    view.s?.setGroupProperty(new PropertyInterface('Start', _propertyGroup))
    view.e?.setGroupProperty(new PropertyInterface('End', _propertyGroup))
    view.o?.setGroupProperty(new PropertyInterface('Offset', _propertyGroup))

    TrimInterface.prototype.propertyIndex = shape.ix
    TrimInterface.prototype.propertyGroup = propertyGroup
    TrimInterface.prototype._name = shape.nm
    TrimInterface.prototype.view = view
    TrimInterface.prototype.mn = shape.mn

    return TrimInterface.prototype.getInterface
  }

  private noOp() {
    return null
  }
}
