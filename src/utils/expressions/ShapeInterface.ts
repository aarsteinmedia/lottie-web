import type ShapeGroupData from '@/elements/helpers/shapes/ShapeGroupData'
import type { Shape, StrokeData } from '@/types'
import type LayerExpressionInterface from '@/utils/expressions/LayerInterface'

import ExpressionPropertyInterface from '@/utils/expressions/ExpressionValueFactory'
import propertyGroupFactory from '@/utils/expressions/PropertyGroupFactory'
import PropertyInterface from '@/utils/expressions/PropertyInterface'
import ShapePathInterface from '@/utils/expressions/shapes/ShapePathInterface'

export default class ShapeExpressionInterface {
  _name: string
  numProperties: number
  propertyGroup: any
  private interfaces: ShapePathInterface[]
  constructor(
    shapes: Shape[],
    view: ShapeGroupData[],
    propertyGroup: LayerExpressionInterface
  ) {
    const _interfaceFunction = (valueFromProps?: number) => {
        let value = valueFromProps

        if (typeof value === 'number') {
          value = value ?? 1
          if (value === 0) {
            return this.propertyGroup
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
      },
      parentGroupWrapper = () => propertyGroup

    this.propertyGroup = propertyGroupFactory(_interfaceFunction,
      parentGroupWrapper)
    this.interfaces = this.iterateElements(
      shapes,
      view,
      this.propertyGroup
    ) as ShapePathInterface[]
    this.numProperties = this.interfaces.length
    this._name = 'Contents'
  }

  contentsInterfaceFactory(
    shape: Shape,
    view: ShapeGroupData,
    propertyGroup: (val: any) => any
  ) {
    const interfaceFunction = (value: string | number) => {
      let i = 0
      const { length } = this.interfaces

      while (i < length) {
        if (
          this.interfaces[i]._name === value ||
          this.interfaces[i].mn === value ||
          this.interfaces[i].propertyIndex === value ||
          this.interfaces[i].ix === value ||
          this.interfaces[i].ind === value
        ) {
          return this.interfaces[i]
        }
        i++
      }
      if (typeof value === 'number') {
        return this.interfaces[value - 1]
      }

      return null
    }

    interfaceFunction.propertyGroup = propertyGroupFactory(interfaceFunction,
      propertyGroup)
    this.interfaces = this.iterateElements(
      shape.it ?? null,
      view.it,
      interfaceFunction.propertyGroup
    ) as ShapePathInterface[]
    interfaceFunction.numProperties = this.interfaces.length
    const transformInterface = this.transformInterfaceFactory(
      shape.it?.[Number(shape.it.length) - 1] as Shape,
      view.it[view.it.length - 1],
      interfaceFunction.propertyGroup
    )

    interfaceFunction.transform = transformInterface
    interfaceFunction.propertyIndex = shape.cix
    interfaceFunction._name = shape.nm

    return interfaceFunction
  }

  defaultInterfaceFactory(
    _shape?: Shape, _view?: any, _propertyGroup?: any
  ) {
    const interfaceFunction = () => null

    return interfaceFunction
  }

  ellipseInterfaceFactory(
    shape: Shape, view: any, propertyGroup: any
  ) {
    const interfaceFunction: any = (value: number) => {
      if (shape.p?.ix === value) {
        return interfaceFunction.position
      }
      if (shape.s?.ix === value) {
        return interfaceFunction.size
      }

      return null
    }
    const _propertyGroup = propertyGroupFactory(interfaceFunction,
      propertyGroup)

    interfaceFunction.propertyIndex = shape.ix
    const prop = view.sh.ty === 'tm' ? view.sh.prop : view.sh

    prop.s.setGroupProperty(new PropertyInterface('Size', _propertyGroup))
    prop.p.setGroupProperty(new PropertyInterface('Position', _propertyGroup))

    Object.defineProperties(interfaceFunction, {
      _name: { value: shape.nm },
      position: { get: ExpressionPropertyInterface(prop.p) as any },
      size: { get: ExpressionPropertyInterface(prop.s) as any },
    })
    interfaceFunction.mn = shape.mn

    return interfaceFunction
  }

  fillInterfaceFactory(
    shape: Shape, view: any, propertyGroup: any
  ) {
    const interfaceFunction: any = (val: string) => {
      if (val === 'Color' || val === 'color') {
        return interfaceFunction.color
      }
      if (val === 'Opacity' || val === 'opacity') {
        return interfaceFunction.opacity
      }

      return null
    }

    Object.defineProperties(interfaceFunction, {
      _name: { value: shape.nm },
      color: { get: ExpressionPropertyInterface(view.c) as any },
      mn: { value: shape.mn },
      opacity: { get: ExpressionPropertyInterface(view.o) as any },
    })

    view.c.setGroupProperty(new PropertyInterface('Color', propertyGroup))
    view.o.setGroupProperty(new PropertyInterface('Opacity', propertyGroup))

    return interfaceFunction
  }

  gradientFillInterfaceFactory(
    shape: Shape, view: any, propertyGroup: any
  ) {
    const interfaceFunction: any = (val: string) => {
      if (val === 'Start Point' || val === 'start point') {
        return interfaceFunction.startPoint
      }
      if (val === 'End Point' || val === 'end point') {
        return interfaceFunction.endPoint
      }
      if (val === 'Opacity' || val === 'opacity') {
        return interfaceFunction.opacity
      }

      return null
    }

    Object.defineProperties(interfaceFunction, {
      _name: { value: shape.nm },
      endPoint: { get: ExpressionPropertyInterface(view.e) as any },
      mn: { value: shape.mn },
      opacity: { get: ExpressionPropertyInterface(view.o) as any },
      startPoint: { get: ExpressionPropertyInterface(view.s) as any },
      type: { get: () => 'a' },
    })

    view.s.setGroupProperty(new PropertyInterface('Start Point', propertyGroup))
    view.e.setGroupProperty(new PropertyInterface('End Point', propertyGroup))
    view.o.setGroupProperty(new PropertyInterface('Opacity', propertyGroup))

    return interfaceFunction
  }

  groupInterfaceFactory(
    shape: Shape, view: any, propertyGroup: any
  ) {
    const interfaceFunction = (value: string | number) => {
      switch (value) {
        case 'ADBE Vectors Group':
        case 'Contents':
        case 2: {
          return interfaceFunction.content
        }
        // Not necessary for now. Keeping them here in case a new case appears
        // case 'ADBE Vector Transform Group':
        // case 3:
        default: {
          return interfaceFunction.transform
        }
      }
    }

    interfaceFunction.propertyGroup = propertyGroupFactory(interfaceFunction,
      propertyGroup)
    const content = this.contentsInterfaceFactory(
      shape,
      view,
      interfaceFunction.propertyGroup
    )
    const transformInterface = this.transformInterfaceFactory(
      shape.it?.[shape.it.length - 1] as Shape,
      view.it[view.it.length - 1],
      interfaceFunction.propertyGroup
    )

    interfaceFunction.content = content
    interfaceFunction.transform = transformInterface
    Object.defineProperty(
      interfaceFunction, '_name', {
        get () {
          return shape.nm
        },
      }
    )
    // interfaceFunction.content = interfaceFunction;
    interfaceFunction.numProperties = shape.np
    interfaceFunction.propertyIndex = shape.ix
    interfaceFunction.nm = shape.nm
    interfaceFunction.mn = shape.mn

    return interfaceFunction
  }

  iterateElements(
    shapes: null | Shape[], view: any, propertyGroup: any
  ) {
    const arr = []
    const { length } = shapes || []

    for (let i = 0; i < length; i++) {
      if (!shapes) {
        continue
      }
      switch (shapes[i].ty) {
        case 'gr': {
          arr.push(this.groupInterfaceFactory(
            shapes[i], view[i], propertyGroup
          ))

          break
        }
        case 'fl': {
          arr.push(this.fillInterfaceFactory(
            shapes[i], view[i], propertyGroup
          ))

          break
        }
        case 'st': {
          arr.push(this.strokeInterfaceFactory(
            shapes[i], view[i], propertyGroup
          ))

          break
        }
        case 'tm': {
          arr.push(this.trimInterfaceFactory(
            shapes[i], view[i], propertyGroup
          ))

          break
        }
        case 'tr': {
        // arr.push(transformInterfaceFactory(shapes[i],view[i],propertyGroup));

          break
        }
        case 'el': {
          arr.push(this.ellipseInterfaceFactory(
            shapes[i], view[i], propertyGroup
          ))

          break
        }
        case 'sr': {
          arr.push(this.starInterfaceFactory(
            shapes[i], view[i], propertyGroup
          ))

          break
        }
        case 'sh': {
          arr.push(new ShapePathInterface(
            shapes[i], view[i], propertyGroup
          ))

          break
        }
        case 'rc': {
          arr.push(this.rectInterfaceFactory(
            shapes[i], view[i], propertyGroup
          ))

          break
        }
        case 'rd': {
          arr.push(this.roundedInterfaceFactory(
            shapes[i], view[i], propertyGroup
          ))

          break
        }
        case 'rp': {
          arr.push(this.repeaterInterfaceFactory(
            shapes[i], view[i], propertyGroup
          ))

          break
        }
        case 'gf': {
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

  rectInterfaceFactory(
    shape: Shape, view: any, propertyGroup: any
  ) {
    const interfaceFunction: any = (value: number | string) => {
      if (shape.p?.ix === value) {
        return interfaceFunction.position
      }
      if (shape.r?.ix === value) {
        return interfaceFunction.roundness
      }
      if (
        shape.s?.ix === value ||
        value === 'Size' ||
        value === 'ADBE Vector Rect Size'
      ) {
        return interfaceFunction.size
      }

      return null
    }

    const _propertyGroup = propertyGroupFactory(interfaceFunction,
      propertyGroup)

    const prop = view.sh.ty === 'tm' ? view.sh.prop : view.sh

    interfaceFunction.propertyIndex = shape.ix
    prop.p.setGroupProperty(new PropertyInterface('Position', _propertyGroup))
    prop.s.setGroupProperty(new PropertyInterface('Size', _propertyGroup))
    prop.r.setGroupProperty(new PropertyInterface('Rotation', _propertyGroup))

    Object.defineProperties(interfaceFunction, {
      _name: { value: shape.nm },
      position: { get: ExpressionPropertyInterface(prop.p) as any },
      roundness: { get: ExpressionPropertyInterface(prop.r) as any },
      size: { get: ExpressionPropertyInterface(prop.s) as any },
    })
    interfaceFunction.mn = shape.mn

    return interfaceFunction
  }

  repeaterInterfaceFactory(
    shape: Shape, view: any, propertyGroup: any
  ) {
    const interfaceFunction: any = (value: number | string) => {
      if (shape.c?.ix === value || value === 'Copies') {
        return interfaceFunction.copies
      }
      if (shape.o?.ix === value || value === 'Offset') {
        return interfaceFunction.offset
      }

      return null
    }

    const _propertyGroup = propertyGroupFactory(interfaceFunction,
      propertyGroup)
    const prop = view

    interfaceFunction.propertyIndex = shape.ix
    prop.c.setGroupProperty(new PropertyInterface('Copies', _propertyGroup))
    prop.o.setGroupProperty(new PropertyInterface('Offset', _propertyGroup))
    Object.defineProperties(interfaceFunction, {
      _name: { value: shape.nm },
      copies: { get: ExpressionPropertyInterface(prop.c) as any },
      offset: { get: ExpressionPropertyInterface(prop.o) as any },
    })
    interfaceFunction.mn = shape.mn

    return interfaceFunction
  }

  roundedInterfaceFactory(
    shape: Shape, view: any, propertyGroup: any
  ) {
    const interfaceFunction: any = (value: number | string) => {
      if (shape.r?.ix === value || value === 'Round Corners 1') {
        return interfaceFunction.radius
      }

      return null
    }

    const _propertyGroup = propertyGroupFactory(interfaceFunction,
      propertyGroup)
    const prop = view

    interfaceFunction.propertyIndex = shape.ix
    prop.rd.setGroupProperty(new PropertyInterface('Radius', _propertyGroup))

    Object.defineProperties(interfaceFunction, {
      _name: { value: shape.nm },
      radius: { get: ExpressionPropertyInterface(prop.rd) as any },
    })
    interfaceFunction.mn = shape.mn

    return interfaceFunction
  }

  starInterfaceFactory(
    shape: Shape, view: any, propertyGroup: any
  ) {
    const interfaceFunction: any = (value: number | string) => {
      if (shape.p?.ix === value) {
        return interfaceFunction.position
      }
      if (shape.r?.ix === value) {
        return interfaceFunction.rotation
      }
      if (shape.pt?.ix === value) {
        return interfaceFunction.points
      }
      if (shape.or?.ix === value || value === 'ADBE Vector Star Outer Radius') {
        return interfaceFunction.outerRadius
      }
      if (shape.os?.ix === value) {
        return interfaceFunction.outerRoundness
      }
      if (shape.ir?.ix === value || value === 'ADBE Vector Star Inner Radius') {
        return interfaceFunction.innerRadius
      }
      if (shape.is?.ix === value) {
        return interfaceFunction.innerRoundness
      }

      return null
    }

    const _propertyGroup = propertyGroupFactory(interfaceFunction,
      propertyGroup)
    const prop = view.sh.ty === 'tm' ? view.sh.prop : view.sh

    interfaceFunction.propertyIndex = shape.ix
    prop.or.setGroupProperty(new PropertyInterface('Outer Radius', _propertyGroup))
    prop.os.setGroupProperty(new PropertyInterface('Outer Roundness', _propertyGroup))
    prop.pt.setGroupProperty(new PropertyInterface('Points', _propertyGroup))
    prop.p.setGroupProperty(new PropertyInterface('Position', _propertyGroup))
    prop.r.setGroupProperty(new PropertyInterface('Rotation', _propertyGroup))
    if (shape.ir) {
      prop.ir.setGroupProperty(new PropertyInterface('Inner Radius', _propertyGroup))
      prop.is.setGroupProperty(new PropertyInterface('Inner Roundness', _propertyGroup))
    }

    Object.defineProperties(interfaceFunction, {
      _name: { value: shape.nm },
      innerRadius: { get: ExpressionPropertyInterface(prop.ir) as any },
      innerRoundness: { get: ExpressionPropertyInterface(prop.is) as any },
      outerRadius: { get: ExpressionPropertyInterface(prop.or) as any },
      outerRoundness: { get: ExpressionPropertyInterface(prop.os) as any },
      points: { get: ExpressionPropertyInterface(prop.pt) as any },
      position: { get: ExpressionPropertyInterface(prop.p) as any },
      rotation: { get: ExpressionPropertyInterface(prop.r) as any },
    })
    interfaceFunction.mn = shape.mn

    return interfaceFunction
  }

  strokeInterfaceFactory(
    shape: Shape, view: any, propertyGroup: any
  ) {
    const interfaceFunction: any = (val: string) => {
      if (val === 'Color' || val === 'color') {
        return interfaceFunction.color
      }
      if (val === 'Opacity' || val === 'opacity') {
        return interfaceFunction.opacity
      }
      if (val === 'Stroke Width' || val === 'stroke width') {
        return interfaceFunction.strokeWidth
      }

      return null
    }
    const _propertyGroup = propertyGroupFactory(interfaceFunction,
      propertyGroup)
    let dashOb = {}
    const _dashPropertyGroup = propertyGroupFactory(dashOb, _propertyGroup)
    const addPropertyToDashOb = (i: number) => {
      Object.defineProperty(
        dashOb,
        (shape.d as StrokeData[])[i].nm as PropertyKey,
        { get: ExpressionPropertyInterface(view.d.dataProps[i].p) as any }
      )
    }
    const { length } = (shape.d as StrokeData[]) || []

    dashOb = {}
    for (let i = 0; i < length; i++) {
      addPropertyToDashOb(i)

      view.d.dataProps[i].p.setGroupProperty(_dashPropertyGroup)
    }

    Object.defineProperties(interfaceFunction, {
      _name: { value: shape.nm },
      color: { get: ExpressionPropertyInterface(view.c) as any },
      dash: {
        get () {
          return dashOb
        },
      },
      mn: { value: shape.mn },
      opacity: { get: ExpressionPropertyInterface(view.o) as any },
      strokeWidth: { get: ExpressionPropertyInterface(view.w) as any },
    })

    view.c.setGroupProperty(new PropertyInterface('Color', _propertyGroup))
    view.o.setGroupProperty(new PropertyInterface('Opacity', _propertyGroup))
    view.w.setGroupProperty(new PropertyInterface('Stroke Width', _propertyGroup))

    return interfaceFunction
  }

  transformInterfaceFactory(
    shape: Shape, view: any, propertyGroup: any
  ) {
    const interfaceFunction: any = (value: number | string) => {
      if (shape.a?.ix === value || value === 'Anchor Point') {
        return interfaceFunction.anchorPoint
      }
      if (shape.o?.ix === value || value === 'Opacity') {
        return interfaceFunction.opacity
      }
      if (shape.p?.ix === value || value === 'Position') {
        return interfaceFunction.position
      }
      if (
        shape.r?.ix === value ||
        value === 'Rotation' ||
        value === 'ADBE Vector Rotation'
      ) {
        return interfaceFunction.rotation
      }
      if (shape.s?.ix === value || value === 'Scale') {
        return interfaceFunction.scale
      }
      if (shape.sk && shape.sk.ix === value || value === 'Skew') {
        return interfaceFunction.skew
      }
      if (shape.sa && shape.sa.ix === value || value === 'Skew Axis') {
        return interfaceFunction.skewAxis
      }

      return null
    }
    const _propertyGroup = propertyGroupFactory(interfaceFunction,
      propertyGroup)

    view.transform.mProps.o.setGroupProperty(new PropertyInterface('Opacity', _propertyGroup))
    view.transform.mProps.p.setGroupProperty(new PropertyInterface('Position', _propertyGroup))
    view.transform.mProps.a.setGroupProperty(new PropertyInterface('Anchor Point', _propertyGroup))
    view.transform.mProps.s.setGroupProperty(new PropertyInterface('Scale', _propertyGroup))
    view.transform.mProps.r.setGroupProperty(new PropertyInterface('Rotation', _propertyGroup))
    if (view.transform.mProps.sk) {
      view.transform.mProps.sk.setGroupProperty(new PropertyInterface('Skew', _propertyGroup))
      view.transform.mProps.sa.setGroupProperty(new PropertyInterface('Skew Angle', _propertyGroup))
    }

    view.transform.op.setGroupProperty(new PropertyInterface('Opacity', _propertyGroup))
    Object.defineProperties(interfaceFunction, {
      _name: { value: shape.nm },
      anchorPoint: { get: ExpressionPropertyInterface(view.transform.mProps.a) as any },
      opacity: { get: ExpressionPropertyInterface(view.transform.mProps.o) as any },
      position: { get: ExpressionPropertyInterface(view.transform.mProps.p) as any },
      rotation: { get: ExpressionPropertyInterface(view.transform.mProps.r) as any },
      scale: { get: ExpressionPropertyInterface(view.transform.mProps.s) as any },
      skew: { get: ExpressionPropertyInterface(view.transform.mProps.sk) as any },
      skewAxis: { get: ExpressionPropertyInterface(view.transform.mProps.sa) as any },
    })
    interfaceFunction.ty = 'tr'
    interfaceFunction.mn = shape.mn
    interfaceFunction.propertyGroup = propertyGroup

    return interfaceFunction
  }

  trimInterfaceFactory(
    shape: Shape, view: any, propertyGroup: any
  ) {
    const interfaceFunction: any = (val: string | number) => {
      if (val === shape.e?.ix || val === 'End' || val === 'end') {
        return interfaceFunction.end
      }
      if (val === shape.s?.ix) {
        return interfaceFunction.start
      }
      if (val === shape.o?.ix) {
        return interfaceFunction.offset
      }

      return null
    }

    const _propertyGroup = propertyGroupFactory(interfaceFunction,
      propertyGroup)

    interfaceFunction.propertyIndex = shape.ix

    view.s.setGroupProperty(new PropertyInterface('Start', _propertyGroup))
    view.e.setGroupProperty(new PropertyInterface('End', _propertyGroup))
    view.o.setGroupProperty(new PropertyInterface('Offset', _propertyGroup))
    interfaceFunction.propertyIndex = shape.ix
    interfaceFunction.propertyGroup = propertyGroup

    Object.defineProperties(interfaceFunction, {
      _name: { value: shape.nm },
      end: { get: ExpressionPropertyInterface(view.e) as any },
      offset: { get: ExpressionPropertyInterface(view.o) as any },
      start: { get: ExpressionPropertyInterface(view.s) as any },
    })
    interfaceFunction.mn = shape.mn

    return interfaceFunction
  }
}

// const _ShapeExpressionInterface: (shapes: any, view: any, propertyGroup: any) => {
//   (value: any): any;
//   propertyGroup: (val?: number) => any;
//   numProperties: number;
//   _name: string;
// }
