import type TransformEffect from '@/effects/TransformEffect'
import type CanvasRenderer from '@/renderers/CanvasRenderer'
import type {
  CompElementInterface,
  CVElement,
  CVStyleElement,
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
  Shape,
  Transformer,
  Vector3,
  VectorProperty,
} from '@/types'
import type {
  MultiDimensionalProperty,
  ValueProperty,
} from '@/utils/Properties'
import type { ShapeProperty } from '@/utils/shapes/ShapeProperty'

import CVBaseElement from '@/elements/canvas/CVBaseElement_'
import CVShapeData from '@/elements/helpers/shapes/CVShapeData'
import ShapeElement from '@/elements/ShapeElement'
import ShapeTransformManager from '@/elements/helpers/shapes/ShapeTransformManager'
import { degToRads, extendPrototype } from '@/utils'
import {
  lineCapEnum, lineJoinEnum, RendererType, ShapeType
} from '@/utils/enums'
import PropertyFactory from '@/utils/PropertyFactory'
import DashProperty from '@/utils/shapes/DashProperty'
import GradientProperty from '@/utils/shapes/GradientProperty'
import { getModifier } from '@/utils/shapes/ShapeModifiers'
import TransformPropertyFactory from '@/utils/TransformProperty'

// import ShapeGroupData from '../helpers/shapes/ShapeGroupData'
import BaseElement from '../BaseElement'
import FrameElement from '../helpers/FrameElement'
import HierarchyElement from '../helpers/HierarchyElement'
import RenderableDOMElement from '../helpers/RenderableDOMElement'
import RenderableElement from '../helpers/RenderableElement'
import TransformElement from '../helpers/TransformElement'

export default function CVShapeElement(
  data, globalData, comp
) {
  this.shapes = []
  this.shapesData = data.shapes
  this.stylesList = []
  this.itemsData = []
  this.prevViewData = []
  this.shapeModifiers = []
  this.processedElements = []
  this.transformsManager = new ShapeTransformManager()
  this.initElement(
    data, globalData, comp
  )
}

extendPrototype([
  BaseElement,
  TransformElement,
  CVBaseElement,
  ShapeElement,
  HierarchyElement,
  FrameElement,
  RenderableElement,
],
CVShapeElement)

CVShapeElement.prototype.initElement =
  RenderableDOMElement.prototype.initElement

CVShapeElement.prototype.transformHelper = {
  _opMdf: false,
  opacity: 1
}

CVShapeElement.prototype.dashResetter = []

CVShapeElement.prototype.createContent = function () {
  this.searchShapes(
    this.shapesData,
    this.itemsData,
    this.prevViewData,
    true,
    []
  )
}

CVShapeElement.prototype.createStyleElement = function (data, transforms) {
  const styleElem = {
    closed: data.hd === true,
    data,
    elements: [],
    preTransforms: this.transformsManager.addTransformSequence(transforms),
    transforms: [],
    type: data.ty,
  }
  const elementData = {}

  if (data.ty === 'fl' || data.ty === 'st') {
    elementData.c = PropertyFactory.getProp(
      this, data.c, 1, 255, this
    )
    if (!elementData.c.k) {
      styleElem.co = `rgb(${Math.floor(elementData.c.v[0])},${Math.floor(elementData.c.v[1])},${Math.floor(elementData.c.v[2])})`
    }
  } else if (data.ty === 'gf' || data.ty === 'gs') {
    elementData.s = PropertyFactory.getProp(
      this, data.s, 1, null, this
    )
    elementData.e = PropertyFactory.getProp(
      this, data.e, 1, null, this
    )
    elementData.h = PropertyFactory.getProp(
      this,
      data.h || { k: 0 },
      0,
      0.01,
      this
    )
    elementData.a = PropertyFactory.getProp(
      this,
      data.a || { k: 0 },
      0,
      degToRads,
      this
    )
    elementData.g = new GradientProperty(
      this, data.g, this
    )
  }
  elementData.o = PropertyFactory.getProp(
    this, data.o, 0, 0.01, this
  )
  if (data.ty === 'st' || data.ty === 'gs') {
    styleElem.lc = lineCapEnum[data.lc || 2]
    styleElem.lj = lineJoinEnum[data.lj || 2]
    if (data.lj == 1) {
      styleElem.ml = data.ml
    }
    elementData.w = PropertyFactory.getProp(
      this, data.w, 0, null, this
    )
    if (!elementData.w.k) {
      styleElem.wi = elementData.w.v
    }
    if (data.d) {
      const d = new DashProperty(
        this, data.d, 'canvas', this
      )

      elementData.d = d
      if (!elementData.d.k) {
        styleElem.da = elementData.d.dashArray
        styleElem.do = elementData.d.dashoffset[0]
      }
    }
  } else {
    styleElem.r = data.r === 2 ? 'evenodd' : 'nonzero'
  }
  this.stylesList.push(styleElem)
  elementData.style = styleElem

  return elementData
}

CVShapeElement.prototype.createGroupElement = function () {
  const elementData = {
    it: [],
    prevViewData: [],
  }

  return elementData
}

CVShapeElement.prototype.createTransformElement = function (data) {
  const elementData = {
    transform: {
      _opMdf: false,
      key: this.transformsManager.getNewKey(),
      mProps: TransformPropertyFactory.getTransformProperty(
        this, data, this
      ),
      op: PropertyFactory.getProp(
        this, data.o, 0, 0.01, this
      ),
      opacity: 1,
    },
  }

  return elementData
}

CVShapeElement.prototype.createShapeElement = function (data) {
  const elementData = new CVShapeData(
    this,
    data,
    this.stylesList,
    this.transformsManager
  )

  this.shapes.push(elementData)
  this.addShapeToModifiers(elementData)

  return elementData
}

CVShapeElement.prototype.reloadShapes = function () {
  this._isFirstFrame = true
  let i
  let len = this.itemsData.length

  for (i = 0; i < len; i += 1) {
    this.prevViewData[i] = this.itemsData[i]
  }
  this.searchShapes(
    this.shapesData,
    this.itemsData,
    this.prevViewData,
    true,
    []
  )
  len = this.dynamicProperties.length
  for (i = 0; i < len; i += 1) {
    this.dynamicProperties[i].getValue()
  }
  this.renderModifiers()
  this.transformsManager.processSequences(this._isFirstFrame)
}

CVShapeElement.prototype.addTransformToStyleList = function (transform) {
  let i
  const len = this.stylesList.length

  for (i = 0; i < len; i += 1) {
    if (!this.stylesList[i].closed) {
      this.stylesList[i].transforms.push(transform)
    }
  }
}

CVShapeElement.prototype.removeTransformFromStyleList = function () {
  let i
  const len = this.stylesList.length

  for (i = 0; i < len; i += 1) {
    if (!this.stylesList[i].closed) {
      this.stylesList[i].transforms.pop()
    }
  }
}

CVShapeElement.prototype.closeStyles = function (styles) {
  let i
  const len = styles.length

  for (i = 0; i < len; i += 1) {
    styles[i].closed = true
  }
}

CVShapeElement.prototype.searchShapes = function (
  arr,
  itemsData,
  prevViewData,
  shouldRender,
  transforms
) {
  let i
  let len = arr.length - 1
  let j
  let jLen
  const ownStyles = []
  const ownModifiers = []
  let processedPos
  let modifier
  let currentTransform
  const ownTransforms = [transforms].flat()

  for (i = len; i >= 0; i -= 1) {
    processedPos = this.searchProcessedElement(arr[i])
    if (!processedPos) {
      arr[i]._shouldRender = shouldRender
    } else {
      itemsData[i] = prevViewData[processedPos - 1]
    }
    switch (arr[i].ty) {
      case 'fl':
      case 'st':
      case 'gf':
      case 'gs': {
        if (!processedPos) {
          itemsData[i] = this.createStyleElement(arr[i], ownTransforms)
        } else {
          itemsData[i].style.closed = false
        }

        ownStyles.push(itemsData[i].style)

        break
      }
      case 'gr': {
        if (!processedPos) {
          itemsData[i] = this.createGroupElement(arr[i])
        } else {
          jLen = itemsData[i].it.length
          for (j = 0; j < jLen; j += 1) {
            itemsData[i].prevViewData[j] = itemsData[i].it[j]
          }
        }
        this.searchShapes(
          arr[i].it,
          itemsData[i].it,
          itemsData[i].prevViewData,
          shouldRender,
          ownTransforms
        )

        break
      }
      case 'tr': {
        if (!processedPos) {
          currentTransform = this.createTransformElement(arr[i])
          itemsData[i] = currentTransform
        }
        ownTransforms.push(itemsData[i])
        this.addTransformToStyleList(itemsData[i])

        break
      }
      case 'sh':
      case 'rc':
      case 'el':
      case 'sr': {
        if (!processedPos) {
          itemsData[i] = this.createShapeElement(arr[i])
        }

        break
      }
      case 'tm':
      case 'rd':
      case 'pb':
      case 'zz':
      case 'op': {
        if (!processedPos) {
          modifier = getModifier(arr[i].ty)
          modifier.init(this, arr[i])
          itemsData[i] = modifier
          this.shapeModifiers.push(modifier)
        } else {
          modifier = itemsData[i]
          modifier.closed = false
        }
        ownModifiers.push(modifier)

        break
      }
      case 'rp': {
        if (!processedPos) {
          modifier = getModifier(arr[i].ty)
          itemsData[i] = modifier
          modifier.init(
            this, arr, i, itemsData
          )
          this.shapeModifiers.push(modifier)
          shouldRender = false
        } else {
          modifier = itemsData[i]
          modifier.closed = true
        }
        ownModifiers.push(modifier)

        break
      }
      default:
    // Do nothing
    }
    this.addProcessedElement(arr[i], i + 1)
  }
  this.removeTransformFromStyleList()
  this.closeStyles(ownStyles)
  len = ownModifiers.length
  for (i = 0; i < len; i += 1) {
    ownModifiers[i].closed = true
  }
}

CVShapeElement.prototype.renderInnerContent = function () {
  this.transformHelper.opacity = 1
  this.transformHelper._opMdf = false
  this.renderModifiers()
  this.transformsManager.processSequences(this._isFirstFrame)
  this.renderShape(
    this.transformHelper, this.shapesData, this.itemsData, true
  )
}

CVShapeElement.prototype.renderShapeTransform = function (parentTransform,
  groupTransform) {
  if (parentTransform._opMdf || groupTransform.op._mdf || this._isFirstFrame) {
    groupTransform.opacity = parentTransform.opacity
    groupTransform.opacity *= groupTransform.op.v
    groupTransform._opMdf = true
  }
}

CVShapeElement.prototype.drawLayer = function () {
  let i
  const len = this.stylesList.length
  let j
  let jLen
  let k
  let kLen
  let elems
  let nodes
  const { renderer } = this.globalData
  const ctx = this.globalData.canvasContext
  let type
  let currentStyle

  for (i = 0; i < len; i += 1) {
    currentStyle = this.stylesList[i]
    type = currentStyle.type

    // Skipping style when
    // Stroke width equals 0
    // style should not be rendered (extra unused repeaters)
    // current opacity equals 0
    // global opacity equals 0
    if (
      !(
        (type === 'st' || type === 'gs') && currentStyle.wi === 0 ||
        !currentStyle.data._shouldRender ||
        currentStyle.coOp === 0 ||
        this.globalData.currentGlobalAlpha === 0
      )
    ) {
      renderer.save()
      elems = currentStyle.elements
      if (type === 'st' || type === 'gs') {
        renderer.ctxStrokeStyle(type === 'st' ? currentStyle.co : currentStyle.grd)
        // ctx.strokeStyle = type === 'st' ? currentStyle.co : currentStyle.grd;
        renderer.ctxLineWidth(currentStyle.wi)
        // ctx.lineWidth = currentStyle.wi;
        renderer.ctxLineCap(currentStyle.lc)
        // ctx.lineCap = currentStyle.lc;
        renderer.ctxLineJoin(currentStyle.lj)
        // ctx.lineJoin = currentStyle.lj;
        renderer.ctxMiterLimit(currentStyle.ml || 0)
        // ctx.miterLimit = currentStyle.ml || 0;
      } else {
        renderer.ctxFillStyle(type === 'fl' ? currentStyle.co : currentStyle.grd)
        // ctx.fillStyle = type === 'fl' ? currentStyle.co : currentStyle.grd;
      }
      renderer.ctxOpacity(currentStyle.coOp)
      if (type !== 'st' && type !== 'gs') {
        ctx.beginPath()
      }
      renderer.ctxTransform(currentStyle.preTransforms.finalTransform.props)
      jLen = elems.length
      for (j = 0; j < jLen; j += 1) {
        if (type === 'st' || type === 'gs') {
          ctx.beginPath()
          if (currentStyle.da) {
            ctx.setLineDash(currentStyle.da)
            ctx.lineDashOffset = currentStyle.do
          }
        }
        nodes = elems[j].trNodes
        kLen = nodes.length

        for (k = 0; k < kLen; k += 1) {
          if (nodes[k].t === 'm') {
            ctx.moveTo(nodes[k].p[0], nodes[k].p[1])
          } else if (nodes[k].t === 'c') {
            ctx.bezierCurveTo(
              nodes[k].pts[0],
              nodes[k].pts[1],
              nodes[k].pts[2],
              nodes[k].pts[3],
              nodes[k].pts[4],
              nodes[k].pts[5]
            )
          } else {
            ctx.closePath()
          }
        }
        if (type === 'st' || type === 'gs') {
          // ctx.stroke();
          renderer.ctxStroke()
          if (currentStyle.da) {
            ctx.setLineDash(this.dashResetter)
          }
        }
      }
      if (type !== 'st' && type !== 'gs') {
        // ctx.fill(currentStyle.r);
        this.globalData.renderer.ctxFill(currentStyle.r)
      }
      renderer.restore()
    }
  }
}

CVShapeElement.prototype.renderShape = function (
  parentTransform,
  items,
  data,
  isMain
) {
  let i
  const len = items.length - 1
  let groupTransform

  groupTransform = parentTransform
  for (i = len; i >= 0; i -= 1) {
    switch (items[i].ty) {
      case 'tr': {
        groupTransform = data[i].transform
        this.renderShapeTransform(parentTransform, groupTransform)

        break
      }
      case 'sh':
      case 'el':
      case 'rc':
      case 'sr': {
        this.renderPath(items[i], data[i])

        break
      }
      case 'fl': {
        this.renderFill(
          items[i], data[i], groupTransform
        )

        break
      }
      case 'st': {
        this.renderStroke(
          items[i], data[i], groupTransform
        )

        break
      }
      case 'gf':
      case 'gs': {
        this.renderGradientFill(
          items[i], data[i], groupTransform
        )

        break
      }
      case 'gr': {
        this.renderShape(
          groupTransform, items[i].it, data[i].it
        )

        break
      }
      case 'tm': {
      //

        break
      }
      default:
    // Do nothing
    }
  }
  if (isMain) {
    this.drawLayer()
  }
}

CVShapeElement.prototype.renderStyledShape = function (styledShape, shape) {
  if (this._isFirstFrame || shape._mdf || styledShape.transforms._mdf) {
    const shapeNodes = styledShape.trNodes
    const { paths } = shape
    let i
    let len
    let j
    const jLen = paths._length

    shapeNodes.length = 0
    const groupTransformMat = styledShape.transforms.finalTransform

    for (j = 0; j < jLen; j += 1) {
      const pathNodes = paths.shapes[j]

      if (pathNodes?.v) {
        len = pathNodes._length
        for (i = 1; i < len; i += 1) {
          if (i === 1) {
            shapeNodes.push({
              p: groupTransformMat.applyToPointArray(
                pathNodes.v[0][0],
                pathNodes.v[0][1],
                0
              ),
              t: 'm',
            })
          }
          shapeNodes.push({
            pts: groupTransformMat.applyToTriplePoints(
              pathNodes.o[i - 1],
              pathNodes.i[i],
              pathNodes.v[i]
            ),
            t: 'c',
          })
        }
        if (len === 1) {
          shapeNodes.push({
            p: groupTransformMat.applyToPointArray(
              pathNodes.v[0][0],
              pathNodes.v[0][1],
              0
            ),
            t: 'm',
          })
        }
        if (pathNodes.c && len) {
          shapeNodes.push({
            pts: groupTransformMat.applyToTriplePoints(
              pathNodes.o[i - 1],
              pathNodes.i[0],
              pathNodes.v[0]
            ),
            t: 'c',
          }, { t: 'z', })
        }
      }
    }
    styledShape.trNodes = shapeNodes
  }
}

CVShapeElement.prototype.renderPath = function (pathData, itemData) {
  if (pathData.hd !== true && pathData._shouldRender) {
    let i
    const len = itemData.styledShapes.length

    for (i = 0; i < len; i += 1) {
      this.renderStyledShape(itemData.styledShapes[i], itemData.sh)
    }
  }
}

CVShapeElement.prototype.renderFill = function (
  styleData,
  itemData,
  groupTransform
) {
  const styleElem = itemData.style

  if (itemData.c._mdf || this._isFirstFrame) {
    styleElem.co = `rgb(${Math.floor(itemData.c.v[0])},${Math.floor(itemData.c.v[1])},${Math.floor(itemData.c.v[2])})`
  }
  if (itemData.o._mdf || groupTransform._opMdf || this._isFirstFrame) {
    styleElem.coOp = itemData.o.v * groupTransform.opacity
  }
}

CVShapeElement.prototype.renderGradientFill = function (
  styleData,
  itemData,
  groupTransform
) {
  const styleElem = itemData.style
  let grd

  if (
    !styleElem.grd ||
    itemData.g._mdf ||
    itemData.s._mdf ||
    itemData.e._mdf ||
    styleData.t !== 1 && (itemData.h._mdf || itemData.a._mdf)
  ) {
    const ctx = this.globalData.canvasContext
    const pt1 = itemData.s.v
    const pt2 = itemData.e.v

    if (styleData.t === 1) {
      grd = ctx.createLinearGradient(
        pt1[0], pt1[1], pt2[0], pt2[1]
      )
    } else {
      const rad = Math.sqrt(Math.pow(pt1[0] - pt2[0], 2) + Math.pow(pt1[1] - pt2[1], 2))
      const ang = Math.atan2(pt2[1] - pt1[1], pt2[0] - pt1[0])

      let percent = itemData.h.v

      if (percent >= 1) {
        percent = 0.99
      } else if (percent <= -1) {
        percent = -0.99
      }
      const dist = rad * percent
      const x = Math.cos(ang + itemData.a.v) * dist + pt1[0]
      const y = Math.sin(ang + itemData.a.v) * dist + pt1[1]

      grd = ctx.createRadialGradient(
        x, y, 0, pt1[0], pt1[1], rad
      )
    }

    let i
    const len = styleData.g.p
    const cValues = itemData.g.c
    let opacity = 1

    for (i = 0; i < len; i += 1) {
      if (itemData.g._hasOpacity && itemData.g._collapsable) {
        opacity = itemData.g.o[i * 2 + 1]
      }
      grd.addColorStop(cValues[i * 4] / 100,
        `rgba(${cValues[i * 4 + 1]},${cValues[i * 4 + 2]},${
          cValues[i * 4 + 3]
        },${opacity})`)
    }
    styleElem.grd = grd
  }
  styleElem.coOp = itemData.o.v * groupTransform.opacity
}

CVShapeElement.prototype.renderStroke = function (
  styleData,
  itemData,
  groupTransform
) {
  const styleElem = itemData.style
  const { d } = itemData

  if (d && (d._mdf || this._isFirstFrame)) {
    styleElem.da = d.dashArray
    styleElem.do = d.dashoffset[0]
  }
  if (itemData.c._mdf || this._isFirstFrame) {
    styleElem.co = `rgb(${Math.floor(itemData.c.v[0])},${Math.floor(itemData.c.v[1])},${Math.floor(itemData.c.v[2])})`
  }
  if (itemData.o._mdf || groupTransform._opMdf || this._isFirstFrame) {
    styleElem.coOp = itemData.o.v * groupTransform.opacity
  }
  if (itemData.w._mdf || this._isFirstFrame) {
    styleElem.wi = itemData.w.v
  }
}

CVShapeElement.prototype.destroy = function () {
  this.shapesData = null
  this.globalData = null
  this.canvasContext = null
  this.stylesList.length = 0
  this.itemsData.length = 0
}
