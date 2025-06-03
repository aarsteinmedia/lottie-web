// @ts-nocheck TODO:
import type ShapeData from '@/elements/helpers/shapes/ShapeData'
import type ShapeGroupData from '@/elements/helpers/shapes/ShapeGroupData'
import type SVGFillStyleData from '@/elements/helpers/shapes/SVGFillStyleData'
import type SVGGradientFillStyleData from '@/elements/helpers/shapes/SVGGradientFillStyleData'
import type SVGShapeData from '@/elements/helpers/shapes/SVGShapeData'
import type SVGStrokeStyleData from '@/elements/helpers/shapes/SVGStrokeStyleData'
import type SVGTransformData from '@/elements/helpers/shapes/SVGTransformData'
import type { Shape, StrokeData } from '@/types'
import type LayerExpressionInterface from '@/utils/expressions/LayerInterface'
import type RepeaterModifier from '@/utils/shapes/RepeaterModifier'
import type RoundCornersModifier from '@/utils/shapes/RoundCornersModifier'
import type {
  EllShapeProperty, RectShapeProperty, StarShapeProperty
} from '@/utils/shapes/ShapeProperty'
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

import RepeaterInterface from './RepeaterInterface'
import RoundCornersInterface from './RoundCornersInterface'


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
      shape.it ?? null, view.it, ContentInterface.prototype.propertyGroup
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
    const prop: EllShapeProperty = view.sh?.ty === ShapeType.Trim ? view.sh.prop : view.sh


    prop.s.setGroupProperty(new PropertyInterface('Size', _propertyGroup))
    prop.p?.setGroupProperty(new PropertyInterface('Position', _propertyGroup))

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

  getInterface(valueFromProps?: string | number): PropertyGroupFactory {
    let value = valueFromProps

    if (typeof value === 'number') {
      value = valueFromProps ?? 1
      if (value === 0) {
        return propertyGroup as PropertyGroupFactory
      }

      return this.interfaces[value - 1]
    }
    let i = 0

    const { length } = this.interfaces

    while (i < length) {
      if (this.interfaces[i]._name === value) {
        return this.interfaces[i]
      }
      i++
    }

    return null
  }

  gradientFillInterfaceFactory(
    shape: Shape, view: SVGGradientFillStyleData, propertyGroup: PropertyGroupFactory
  ) {

    GradientFillInterface.prototype._name = shape.nm
    GradientFillInterface.prototype.prop = view
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
    shapes: null | Shape[], view: ShapeGroupData | ShapeGroupData[], propertyGroup: PropertyGroupFactory
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
            shapes[i], (view as ShapeGroupData[])[i], propertyGroup
          ))

          break
        }
        case ShapeType.Fill: {
          arr.push(this.fillInterfaceFactory(
            shapes[i], (view as ShapeGroupData[])[i], propertyGroup
          ))

          break
        }
        case ShapeType.Stroke: {
          arr.push(this.strokeInterfaceFactory(
            shapes[i], (view as ShapeGroupData[])[i], propertyGroup
          ))

          break
        }
        case ShapeType.Trim: {
          arr.push(this.trimInterfaceFactory(
            shapes[i], (view as ShapeGroupData[])[i], propertyGroup
          ))

          break
        }
        case ShapeType.Transform: {
          // arr.push(transformInterfaceFactory(shapes[i],view[i],propertyGroup));

          break
        }
        case ShapeType.Ellipse: {
          arr.push(this.ellipseInterfaceFactory(
            shapes[i], (view as ShapeGroupData[])[i], propertyGroup
          ))

          break
        }
        case ShapeType.PolygonStar: {
          arr.push(this.starInterfaceFactory(
            shapes[i], (view as ShapeGroupData[])[i], propertyGroup
          ))

          break
        }
        case ShapeType.Path: {
          arr.push(new ShapePathInterface(
            shapes[i], (view as ShapeGroupData[])[i], propertyGroup
          ))

          break
        }
        case ShapeType.Rectangle: {
          arr.push(this.rectInterfaceFactory(
            shapes[i], (view as ShapeGroupData[])[i], propertyGroup
          ))

          break
        }
        case ShapeType.RoundedCorners: {
          arr.push(this.roundedInterfaceFactory(
            shapes[i], (view as ShapeGroupData[])[i], propertyGroup
          ))

          break
        }
        case ShapeType.Repeater: {
          arr.push(this.repeaterInterfaceFactory(
            shapes[i], (view as ShapeGroupData[])[i], propertyGroup
          ))

          break
        }
        case ShapeType.GradientFill: {
          arr.push(this.gradientFillInterfaceFactory(
            shapes[i], (view as ShapeGroupData[])[i], propertyGroup
          ))

          break
        }
        default: {
          arr.push(this.defaultInterfaceFactory(
            shapes[i], (view as ShapeGroupData[])[i], propertyGroup
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
    const _propertyGroup = new PropertyGroupFactory(RectInterface, propertyGroup),
      prop: RectShapeProperty = view.sh?.ty === ShapeType.Trim ? view.sh.prop : view.sh

    RectInterface.prototype.propertyIndex = shape.ix

    prop.p?.setGroupProperty(new PropertyInterface('Position', _propertyGroup))
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

    RepeaterInterface.prototype.shape = shape
    RepeaterInterface.prototype.propertyIndex = shape.ix
    RepeaterInterface.prototype._name = shape.nm
    RepeaterInterface.prototype.mn = shape.mn

    const _propertyGroup = new PropertyGroupFactory(RepeaterInterface, propertyGroup),
      prop = view

    RepeaterInterface.prototype.prop = prop

    prop.c?.setGroupProperty(new PropertyInterface('Copies', _propertyGroup))
    prop.o?.setGroupProperty(new PropertyInterface('Offset', _propertyGroup))

    return RepeaterInterface.prototype.getInterface
  }

  roundedInterfaceFactory(
    shape: Shape, view: RoundCornersModifier, propertyGroup: PropertyGroupFactory
  ) {

    RoundCornersInterface.prototype.shape = shape
    RoundCornersInterface.prototype._name = shape.nm
    RoundCornersInterface.prototype.propertyIndex = shape.ix
    RoundCornersInterface.prototype.mn = shape.mn

    const _propertyGroup = new PropertyGroupFactory(RoundCornersInterface, propertyGroup as LayerExpressionInterface),
      prop = view

    prop.rd.setGroupProperty(new PropertyInterface('Radius', _propertyGroup))

    return RoundCornersInterface.prototype.getInterface
  }

  starInterfaceFactory(
    shape: Shape, view: ShapeData, propertyGroup: PropertyGroupFactory,
  ) {

    StarInterface.prototype.shape = shape

    const _propertyGroup = new PropertyGroupFactory(StarInterface, propertyGroup),
      prop: StarShapeProperty = view.sh?.ty === ShapeType.Trim ? view.sh.prop : view.sh

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
    const dashOb: Record<PropertyKey, unknown> = {},
      _propertyGroup = new PropertyGroupFactory(StrokeInterface, propertyGroup),
      _dashPropertyGroup = new PropertyGroupFactory(dashOb, _propertyGroup)

    function addPropertyToDashOb(it: number) {
      Object.defineProperty(
        dashOb, (shape.d as StrokeData[] | undefined)?.[it].nm, { get: expressionPropertyFactory(view.d.dataProps[it].p) }
      )
    }

    const { length } = shape.d ?? []

    for (let i = 0; i < length; i++) {
      addPropertyToDashOb(i)
      view.d.dataProps[i].p.setGroupProperty(_dashPropertyGroup)
    }

    StrokeInterface.prototype._name = shape.nm
    StrokeInterface.prototype.mn = shape.mn
    StrokeInterface.prototype.dashOb = dashOb
    StrokeInterface.prototype.prop = view

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
    TransformInterface.prototype.prop = view

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
    TrimInterface.prototype.prop = view
    TrimInterface.prototype.mn = shape.mn

    return TrimInterface.prototype.getInterface
  }

  private noOp() {
    return null
  }
}
