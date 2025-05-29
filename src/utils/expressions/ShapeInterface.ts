import type ShapeGroupData from '@/elements/helpers/shapes/ShapeGroupData'
import type { Shape } from '@/types'
import type { BaseProperty } from '@/utils/Properties'

import { ShapeType } from '@/utils/enums'
import ExpressionPropertyInterface from '@/utils/expressions/ExpressionValueFactory'
import propertyGroupFactory from '@/utils/expressions/PropertyGroupFactory'
import PropertyInterface from '@/utils/expressions/PropertyInterface'
import ShapePathInterface from '@/utils/expressions/shapes/ShapePathInterface'

const ShapeExpressionInterface = (function () {
  function iterateElements(
    shapes: null | Shape[], view: ShapeGroupData, propertyGroup: (val: unknown) => BaseProperty
  ) {
    const arr = [],
      { length } = shapes ?? []

    for (let i = 0; i < length; i++) {
      switch (shapes[i].ty) {
        case ShapeType.Group: {
          arr.push(groupInterfaceFactory(
            shapes[i], view[i], propertyGroup
          ))

          break
        }
        case ShapeType.Fill: {
          arr.push(fillInterfaceFactory(
            shapes[i], view[i], propertyGroup
          ))

          break
        }
        case ShapeType.Stroke: {
          arr.push(strokeInterfaceFactory(
            shapes[i], view[i], propertyGroup
          ))

          break
        }
        case ShapeType.Trim: {
          arr.push(trimInterfaceFactory(
            shapes[i], view[i], propertyGroup
          ))

          break
        }
        case ShapeType.Transform: {
        // arr.push(transformInterfaceFactory(shapes[i],view[i],propertyGroup));

          break
        }
        case ShapeType.Ellipse: {
          arr.push(ellipseInterfaceFactory(
            shapes[i], view[i], propertyGroup
          ))

          break
        }
        case ShapeType.PolygonStar: {
          arr.push(starInterfaceFactory(
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
          arr.push(rectInterfaceFactory(
            shapes[i], view[i], propertyGroup
          ))

          break
        }
        case ShapeType.RoundedCorners: {
          arr.push(roundedInterfaceFactory(
            shapes[i], view[i], propertyGroup
          ))

          break
        }
        case ShapeType.Repeater: {
          arr.push(repeaterInterfaceFactory(
            shapes[i], view[i], propertyGroup
          ))

          break
        }
        case ShapeType.GradientFill: {
          arr.push(gradientFillInterfaceFactory(
            shapes[i], view[i], propertyGroup
          ))

          break
        }
        default: {
          arr.push(defaultInterfaceFactory(
            shapes[i], view[i], propertyGroup
          ))
        }
      }
    }

    return arr
  }

  function contentsInterfaceFactory(
    shape, view, propertyGroup
  ) {
    let interfaces

    const interfaceFunction = function _interfaceFunction(value) {
      let i = 0

      const len = interfaces.length

      while (i < len) {
        if (interfaces[i]._name === value || interfaces[i].mn === value || interfaces[i].propertyIndex === value || interfaces[i].ix === value || interfaces[i].ind === value) {
          return interfaces[i]
        }
        i += 1
      }
      if (typeof value === 'number') {
        return interfaces[value - 1]
      }

      return null
    }

    interfaceFunction.propertyGroup = propertyGroupFactory(interfaceFunction, propertyGroup)
    interfaces = iterateElements(
      shape.it, view.it, interfaceFunction.propertyGroup
    )
    interfaceFunction.numProperties = interfaces.length
    const transformInterface = transformInterfaceFactory(
      shape.it[shape.it.length - 1], view.it[view.it.length - 1], interfaceFunction.propertyGroup
    )

    interfaceFunction.transform = transformInterface
    interfaceFunction.propertyIndex = shape.cix
    interfaceFunction._name = shape.nm

    return interfaceFunction
  }

  function groupInterfaceFactory(
    shape, view, propertyGroup
  ) {
    const interfaceFunction = function _interfaceFunction(value) {
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

    interfaceFunction.propertyGroup = propertyGroupFactory(interfaceFunction, propertyGroup)
    const content = contentsInterfaceFactory(
      shape, view, interfaceFunction.propertyGroup
    )
    const transformInterface = transformInterfaceFactory(
      shape.it[shape.it.length - 1], view.it[view.it.length - 1], interfaceFunction.propertyGroup
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

  function fillInterfaceFactory(
    shape, view, propertyGroup
  ) {
    function interfaceFunction(val) {
      if (val === 'Color' || val === 'color') {
        return interfaceFunction.color
      } if (val === 'Opacity' || val === 'opacity') {
        return interfaceFunction.opacity
      }

      return null
    }
    Object.defineProperties(interfaceFunction, {
      _name: { value: shape.nm },
      color: { get: ExpressionPropertyInterface(view.c) },
      mn: { value: shape.mn },
      opacity: { get: ExpressionPropertyInterface(view.o) },
    })

    view.c.setGroupProperty(PropertyInterface('Color', propertyGroup))
    view.o.setGroupProperty(PropertyInterface('Opacity', propertyGroup))

    return interfaceFunction
  }

  function gradientFillInterfaceFactory(
    shape, view, propertyGroup
  ) {
    function interfaceFunction(val) {
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
      endPoint: { get: ExpressionPropertyInterface(view.e) },
      mn: { value: shape.mn },
      opacity: { get: ExpressionPropertyInterface(view.o) },
      startPoint: { get: ExpressionPropertyInterface(view.s) },
      type: {
        get () {
          return 'a'
        },
      },
    })

    view.s.setGroupProperty(PropertyInterface('Start Point', propertyGroup))
    view.e.setGroupProperty(PropertyInterface('End Point', propertyGroup))
    view.o.setGroupProperty(PropertyInterface('Opacity', propertyGroup))

    return interfaceFunction
  }
  function defaultInterfaceFactory() {
    function interfaceFunction() {
      return null
    }

    return interfaceFunction
  }

  function strokeInterfaceFactory(
    shape, view, propertyGroup
  ) {
    const _propertyGroup = propertyGroupFactory(interfaceFunction, propertyGroup)
    const _dashPropertyGroup = propertyGroupFactory(dashOb, _propertyGroup)

    function addPropertyToDashOb(i) {
      Object.defineProperty(
        dashOb, shape.d[i].nm, { get: ExpressionPropertyInterface(view.d.dataProps[i].p) }
      )
    }
    let i

    const len = shape.d ? shape.d.length : 0

    var dashOb = {}
    for (i = 0; i < len; i += 1) {
      addPropertyToDashOb(i)
      view.d.dataProps[i].p.setGroupProperty(_dashPropertyGroup)
    }

    function interfaceFunction(val) {
      if (val === 'Color' || val === 'color') {
        return interfaceFunction.color
      } if (val === 'Opacity' || val === 'opacity') {
        return interfaceFunction.opacity
      } if (val === 'Stroke Width' || val === 'stroke width') {
        return interfaceFunction.strokeWidth
      }

      return null
    }
    Object.defineProperties(interfaceFunction, {
      _name: { value: shape.nm },
      color: { get: ExpressionPropertyInterface(view.c) },
      dash: {
        get () {
          return dashOb
        },
      },
      mn: { value: shape.mn },
      opacity: { get: ExpressionPropertyInterface(view.o) },
      strokeWidth: { get: ExpressionPropertyInterface(view.w) },
    })

    view.c.setGroupProperty(PropertyInterface('Color', _propertyGroup))
    view.o.setGroupProperty(PropertyInterface('Opacity', _propertyGroup))
    view.w.setGroupProperty(PropertyInterface('Stroke Width', _propertyGroup))

    return interfaceFunction
  }

  function trimInterfaceFactory(
    shape, view, propertyGroup
  ) {
    function interfaceFunction(val) {
      if (val === shape.e.ix || val === 'End' || val === 'end') {
        return interfaceFunction.end
      }
      if (val === shape.s.ix) {
        return interfaceFunction.start
      }
      if (val === shape.o.ix) {
        return interfaceFunction.offset
      }

      return null
    }

    const _propertyGroup = propertyGroupFactory(interfaceFunction, propertyGroup)

    interfaceFunction.propertyIndex = shape.ix

    view.s.setGroupProperty(PropertyInterface('Start', _propertyGroup))
    view.e.setGroupProperty(PropertyInterface('End', _propertyGroup))
    view.o.setGroupProperty(PropertyInterface('Offset', _propertyGroup))
    interfaceFunction.propertyIndex = shape.ix
    interfaceFunction.propertyGroup = propertyGroup

    Object.defineProperties(interfaceFunction, {
      _name: { value: shape.nm },
      end: { get: ExpressionPropertyInterface(view.e) },
      offset: { get: ExpressionPropertyInterface(view.o) },
      start: { get: ExpressionPropertyInterface(view.s) },
    })
    interfaceFunction.mn = shape.mn

    return interfaceFunction
  }

  function transformInterfaceFactory(
    shape, view, propertyGroup
  ) {
    function interfaceFunction(value) {
      if (shape.a.ix === value || value === 'Anchor Point') {
        return interfaceFunction.anchorPoint
      }
      if (shape.o.ix === value || value === 'Opacity') {
        return interfaceFunction.opacity
      }
      if (shape.p.ix === value || value === 'Position') {
        return interfaceFunction.position
      }
      if (shape.r.ix === value || value === 'Rotation' || value === 'ADBE Vector Rotation') {
        return interfaceFunction.rotation
      }
      if (shape.s.ix === value || value === 'Scale') {
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
    const _propertyGroup = propertyGroupFactory(interfaceFunction, propertyGroup)

    view.transform.mProps.o.setGroupProperty(PropertyInterface('Opacity', _propertyGroup))
    view.transform.mProps.p.setGroupProperty(PropertyInterface('Position', _propertyGroup))
    view.transform.mProps.a.setGroupProperty(PropertyInterface('Anchor Point', _propertyGroup))
    view.transform.mProps.s.setGroupProperty(PropertyInterface('Scale', _propertyGroup))
    view.transform.mProps.r.setGroupProperty(PropertyInterface('Rotation', _propertyGroup))
    if (view.transform.mProps.sk) {
      view.transform.mProps.sk.setGroupProperty(PropertyInterface('Skew', _propertyGroup))
      view.transform.mProps.sa.setGroupProperty(PropertyInterface('Skew Angle', _propertyGroup))
    }
    view.transform.op.setGroupProperty(PropertyInterface('Opacity', _propertyGroup))
    Object.defineProperties(interfaceFunction, {
      _name: { value: shape.nm },
      anchorPoint: { get: ExpressionPropertyInterface(view.transform.mProps.a) },
      opacity: { get: ExpressionPropertyInterface(view.transform.mProps.o) },
      position: { get: ExpressionPropertyInterface(view.transform.mProps.p) },
      rotation: { get: ExpressionPropertyInterface(view.transform.mProps.r) },
      scale: { get: ExpressionPropertyInterface(view.transform.mProps.s) },
      skew: { get: ExpressionPropertyInterface(view.transform.mProps.sk) },
      skewAxis: { get: ExpressionPropertyInterface(view.transform.mProps.sa) },
    })
    interfaceFunction.ty = 'tr'
    interfaceFunction.mn = shape.mn
    interfaceFunction.propertyGroup = propertyGroup

    return interfaceFunction
  }

  function ellipseInterfaceFactory(
    shape, view, propertyGroup
  ) {
    function interfaceFunction(value) {
      if (shape.p.ix === value) {
        return interfaceFunction.position
      }
      if (shape.s.ix === value) {
        return interfaceFunction.size
      }

      return null
    }
    const _propertyGroup = propertyGroupFactory(interfaceFunction, propertyGroup)

    interfaceFunction.propertyIndex = shape.ix
    const prop = view.sh.ty === 'tm' ? view.sh.prop : view.sh

    prop.s.setGroupProperty(PropertyInterface('Size', _propertyGroup))
    prop.p.setGroupProperty(PropertyInterface('Position', _propertyGroup))

    Object.defineProperties(interfaceFunction, {
      _name: { value: shape.nm },
      position: { get: ExpressionPropertyInterface(prop.p) },
      size: { get: ExpressionPropertyInterface(prop.s) },
    })
    interfaceFunction.mn = shape.mn

    return interfaceFunction
  }

  function starInterfaceFactory(
    shape, view, propertyGroup
  ) {
    function interfaceFunction(value) {
      if (shape.p.ix === value) {
        return interfaceFunction.position
      }
      if (shape.r.ix === value) {
        return interfaceFunction.rotation
      }
      if (shape.pt.ix === value) {
        return interfaceFunction.points
      }
      if (shape.or.ix === value || value === 'ADBE Vector Star Outer Radius') {
        return interfaceFunction.outerRadius
      }
      if (shape.os.ix === value) {
        return interfaceFunction.outerRoundness
      }
      if (shape.ir && (shape.ir.ix === value || value === 'ADBE Vector Star Inner Radius')) {
        return interfaceFunction.innerRadius
      }
      if (shape.is && shape.is.ix === value) {
        return interfaceFunction.innerRoundness
      }

      return null
    }

    const _propertyGroup = propertyGroupFactory(interfaceFunction, propertyGroup)
    const prop = view.sh.ty === 'tm' ? view.sh.prop : view.sh

    interfaceFunction.propertyIndex = shape.ix
    prop.or.setGroupProperty(PropertyInterface('Outer Radius', _propertyGroup))
    prop.os.setGroupProperty(PropertyInterface('Outer Roundness', _propertyGroup))
    prop.pt.setGroupProperty(PropertyInterface('Points', _propertyGroup))
    prop.p.setGroupProperty(PropertyInterface('Position', _propertyGroup))
    prop.r.setGroupProperty(PropertyInterface('Rotation', _propertyGroup))
    if (shape.ir) {
      prop.ir.setGroupProperty(PropertyInterface('Inner Radius', _propertyGroup))
      prop.is.setGroupProperty(PropertyInterface('Inner Roundness', _propertyGroup))
    }

    Object.defineProperties(interfaceFunction, {
      _name: { value: shape.nm },
      innerRadius: { get: ExpressionPropertyInterface(prop.ir) },
      innerRoundness: { get: ExpressionPropertyInterface(prop.is) },
      outerRadius: { get: ExpressionPropertyInterface(prop.or) },
      outerRoundness: { get: ExpressionPropertyInterface(prop.os) },
      points: { get: ExpressionPropertyInterface(prop.pt) },
      position: { get: ExpressionPropertyInterface(prop.p) },
      rotation: { get: ExpressionPropertyInterface(prop.r) },
    })
    interfaceFunction.mn = shape.mn

    return interfaceFunction
  }

  function rectInterfaceFactory(
    shape, view, propertyGroup
  ) {
    function interfaceFunction(value) {
      if (shape.p.ix === value) {
        return interfaceFunction.position
      }
      if (shape.r.ix === value) {
        return interfaceFunction.roundness
      }
      if (shape.s.ix === value || value === 'Size' || value === 'ADBE Vector Rect Size') {
        return interfaceFunction.size
      }

      return null
    }
    const _propertyGroup = propertyGroupFactory(interfaceFunction, propertyGroup)

    const prop = view.sh.ty === 'tm' ? view.sh.prop : view.sh

    interfaceFunction.propertyIndex = shape.ix
    prop.p.setGroupProperty(PropertyInterface('Position', _propertyGroup))
    prop.s.setGroupProperty(PropertyInterface('Size', _propertyGroup))
    prop.r.setGroupProperty(PropertyInterface('Rotation', _propertyGroup))

    Object.defineProperties(interfaceFunction, {
      _name: { value: shape.nm },
      position: { get: ExpressionPropertyInterface(prop.p) },
      roundness: { get: ExpressionPropertyInterface(prop.r) },
      size: { get: ExpressionPropertyInterface(prop.s) },
    })
    interfaceFunction.mn = shape.mn

    return interfaceFunction
  }

  function roundedInterfaceFactory(
    shape, view, propertyGroup
  ) {
    function interfaceFunction(value) {
      if (shape.r.ix === value || value === 'Round Corners 1') {
        return interfaceFunction.radius
      }

      return null
    }

    const _propertyGroup = propertyGroupFactory(interfaceFunction, propertyGroup)
    const prop = view

    interfaceFunction.propertyIndex = shape.ix
    prop.rd.setGroupProperty(PropertyInterface('Radius', _propertyGroup))

    Object.defineProperties(interfaceFunction, {
      _name: { value: shape.nm },
      radius: { get: ExpressionPropertyInterface(prop.rd) },
    })
    interfaceFunction.mn = shape.mn

    return interfaceFunction
  }

  function repeaterInterfaceFactory(
    shape, view, propertyGroup
  ) {
    function interfaceFunction(value) {
      if (shape.c.ix === value || value === 'Copies') {
        return interfaceFunction.copies
      } if (shape.o.ix === value || value === 'Offset') {
        return interfaceFunction.offset
      }

      return null
    }

    const _propertyGroup = propertyGroupFactory(interfaceFunction, propertyGroup)
    const prop = view

    interfaceFunction.propertyIndex = shape.ix
    prop.c.setGroupProperty(PropertyInterface('Copies', _propertyGroup))
    prop.o.setGroupProperty(PropertyInterface('Offset', _propertyGroup))
    Object.defineProperties(interfaceFunction, {
      _name: { value: shape.nm },
      copies: { get: ExpressionPropertyInterface(prop.c) },
      offset: { get: ExpressionPropertyInterface(prop.o) },
    })
    interfaceFunction.mn = shape.mn

    return interfaceFunction
  }

  return function (
    shapes, view, propertyGroup
  ) {
    let interfaces

    function _interfaceFunction(value) {
      if (typeof value === 'number') {
        value = value === undefined ? 1 : value
        if (value === 0) {
          return propertyGroup
        }

        return interfaces[value - 1]
      }
      let i = 0

      const len = interfaces.length

      while (i < len) {
        if (interfaces[i]._name === value) {
          return interfaces[i]
        }
        i += 1
      }

      return null
    }
    function parentGroupWrapper() {
      return propertyGroup
    }
    _interfaceFunction.propertyGroup = propertyGroupFactory(_interfaceFunction, parentGroupWrapper)
    interfaces = iterateElements(
      shapes, view, _interfaceFunction.propertyGroup
    )
    _interfaceFunction.numProperties = interfaces.length
    _interfaceFunction._name = 'Contents'

    return _interfaceFunction
  }
}())

export default ShapeExpressionInterface
