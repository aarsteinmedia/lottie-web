// @ts-nocheck
import type TransformEffect from '@/effects/TransformEffect'
import type ShapeGroupData from '@/elements/helpers/shapes/ShapeGroupData'
import type SVGGradientFillStyleData from '@/elements/helpers/shapes/SVGGradientFillStyleData'
import type CanvasRenderer from '@/renderers/CanvasRenderer'
import type {
  CanvasItem,
  CompElementInterface, CVElement, CVStyleElement, ElementInterfaceIntersect, GlobalData, LottieLayer,
  Shape,
  Transformer,
  TransformSequence,
  Vector3,
  VectorProperty
} from '@/types'
import type MultiDimensionalProperty from '@/utils/properties/MultiDimensionalProperty'
import type ValueProperty from '@/utils/properties/ValueProperty'
import type { ShapeProperty } from '@/utils/shapes/properties/ShapeProperty'
import type ShapeCollection from '@/utils/shapes/ShapeCollection'

import CVBaseElement from '@/elements/canvas/CVBaseElement'
import CVShapeData from '@/elements/helpers/shapes/CVShapeData'
import ShapeTransformManager from '@/elements/helpers/shapes/ShapeTransformManager'
import ShapeElement from '@/elements/ShapeElement'
import {
  lineCapEnum,
  lineJoinEnum,
  RendererType,
  ShapeType,
} from '@/utils/enums'
import { degToRads } from '@/utils/helpers/constants'
import PropertyFactory from '@/utils/PropertyFactory'
import { getModifier, type ShapeModifierInterface } from '@/utils/shapes/modifiers'
import DashProperty from '@/utils/shapes/properties/DashProperty'
import GradientProperty from '@/utils/shapes/properties/GradientProperty'
import TransformPropertyFactory from '@/utils/TransformProperty'

export default class CVShapeElement extends ShapeElement {
  canvasContext?: CanvasRenderingContext2D
  clearCanvas = CVBaseElement.prototype.clearCanvas
  override createContainerElements = CVBaseElement.prototype.createContainerElements
  override createRenderableComponents = CVBaseElement.prototype.createRenderableComponents
  dashResetter: number[] = []
  exitLayer = CVBaseElement.prototype.exitLayer
  override hide = CVBaseElement.prototype.hide
  override initRendererElement = CVBaseElement.prototype.initRendererElement
  prepareLayer = CVBaseElement.prototype.prepareLayer
  prevViewData: ShapeGroupData[]
  override renderFrame = CVBaseElement.prototype.renderFrame
  override setBlendMode = CVBaseElement.prototype.setBlendMode
  override show = CVBaseElement.prototype.show
  stylesList: CVStyleElement[]
  transformHelper = {
    _opMdf: false,
    opacity: 1,
  } as Transformer
  transformsManager: ShapeTransformManager

  constructor(
    data: LottieLayer, globalData: GlobalData, comp: CompElementInterface
  ) {
    super()
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

  addTransformToStyleList(transform: Transformer) {
    const { length } = this.stylesList

    for (let i = 0; i < length; i++) {
      if (!this.stylesList[i].closed) {
        this.stylesList[i].transforms.push(transform)
      }
    }
  }

  closeStyles(styles: CVStyleElement[]) {
    const { length } = styles

    for (let i = 0; i < length; i++) {
      styles[i].closed = true
    }
  }

  override createContent() {
    this.searchShapes(
      this.shapesData,
      this.itemsData as unknown as CanvasItem[],
      this.prevViewData as unknown as CVShapeElement[],
      true,
      []
    )
  }

  createGroupElement(_data?: Shape) {
    const elementData = {
      it: [],
      prevViewData: [],
    }

    return elementData
  }

  createShapeElement(data: Shape) {
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

  createStyleElement(data: Shape, transforms: { transform: Transformer }[]) {
    try {
      const styleElem: CVStyleElement = {
          closed: data.hd === true,
          data,
          elements: [],
          preTransforms: this.transformsManager.addTransformSequence(transforms) as unknown as TransformSequence,
          transforms: [],
          type: data.ty,
        },
        elementData = {} as unknown as CVElement

      switch (data.ty) {
        case ShapeType.Fill:
        case ShapeType.Stroke: {
          elementData.c = PropertyFactory.getProp(
            this as unknown as ElementInterfaceIntersect,
            data.c as VectorProperty<Vector3>,
            1,
            255,
            this as unknown as ElementInterfaceIntersect
          ) as MultiDimensionalProperty<number[]>
          if (!elementData.c.k) {
            styleElem.co = `rgb(${Math.floor(elementData.c.v[0])},${Math.floor(elementData.c.v[1])},${Math.floor(elementData.c.v[2])})`
          }
          break
        }
        case ShapeType.GradientFill:
        case ShapeType.GradientStroke: {
          elementData.s = PropertyFactory.getProp(
            this as unknown as ElementInterfaceIntersect,
            data.s,
            1,
            null,
            this as unknown as ElementInterfaceIntersect
          ) as MultiDimensionalProperty
          elementData.e = PropertyFactory.getProp(
            this as unknown as ElementInterfaceIntersect,
            data.e,
            1,
            null,
            this as unknown as ElementInterfaceIntersect
          ) as MultiDimensionalProperty
          elementData.h = PropertyFactory.getProp(
            this as unknown as ElementInterfaceIntersect,
            (data.h ?? { k: 0 }) as VectorProperty,
            0,
            0.01,
            this as unknown as ElementInterfaceIntersect
          ) as ValueProperty
          elementData.a = PropertyFactory.getProp(
            this as unknown as ElementInterfaceIntersect,
            (data.a ?? { k: 0 }) as VectorProperty,
            0,
            degToRads,
            this as unknown as ElementInterfaceIntersect
          ) as ValueProperty
          if (data.g) {
            elementData.g = new GradientProperty(
              this as unknown as ElementInterfaceIntersect,
              data.g,
              this as unknown as ElementInterfaceIntersect
            )
          }

          break
        }
        default:
      }

      elementData.o = PropertyFactory.getProp(
        this as unknown as ElementInterfaceIntersect,
        data.o,
        0,
        0.01,
        this as unknown as ElementInterfaceIntersect
      ) as ValueProperty

      if (data.ty === ShapeType.Stroke || data.ty === ShapeType.GradientStroke) {
        styleElem.lc = lineCapEnum[data.lc || 2]
        styleElem.lj = lineJoinEnum[data.lj || 2]
        if (data.lj === 1) {
          styleElem.ml = data.ml
        }
        elementData.w = PropertyFactory.getProp(
          this as unknown as ElementInterfaceIntersect,
          data.w,
          0,
          null,
          this as unknown as ElementInterfaceIntersect
        ) as ValueProperty
        if (!elementData.w.k) {
          styleElem.wi = elementData.w.v
        }
        if (data.d && typeof data.d === 'object') {
          const d = new DashProperty(
            this as unknown as ElementInterfaceIntersect,
            data.d,
            RendererType.Canvas,
            this as unknown as ElementInterfaceIntersect
          )

          elementData.d = d
          if (!elementData.d.k) {
            styleElem.da = elementData.d.dashArray
            styleElem.do = elementData.d.dashoffset[0]
          }
        }
      } else {
        styleElem.r = data.r === (2 as any) ? 'evenodd' : 'nonzero'
      }
      this.stylesList.push(styleElem)
      elementData.style = styleElem

      // if (data.ty === ShapeType.GradientFill) {
      //   console.log(elementData)
      // }

      return elementData

    } catch (error) {
      console.error(this.constructor.name, error)

      return null
    }
  }

  createTransformElement(data: Shape) {
    const elementData = {
      transform: {
        _opMdf: false,
        key: this.transformsManager.getNewKey(),
        mProps: TransformPropertyFactory.getTransformProperty(
          this as unknown as ElementInterfaceIntersect,
          data,
          this as unknown as ElementInterfaceIntersect
        ),
        op: PropertyFactory.getProp(
          this as unknown as ElementInterfaceIntersect,
          data.o,
          0,
          0.01,
          this as unknown as ElementInterfaceIntersect
        ),
        opacity: 1,
      } as Transformer,
    }

    return elementData
  }

  override destroy() {
    this.shapesData = null as unknown as Shape[]
    this.globalData = null as unknown as GlobalData
    this.canvasContext = null as unknown as CanvasRenderingContext2D
    this.stylesList.length = 0
    this.itemsData.length = 0
  }

  drawLayer() {
    try {
      if (!this.globalData) {
        throw new Error(`${this.constructor.name} globalData is not implemented`)
      }
      if (!this.globalData.renderer) {
        throw new Error(`${this.constructor.name} renderer is not implemented`)
      }

      const { length } = this.stylesList,
        { renderer } = this.globalData as { renderer: CanvasRenderer },
        ctx = this.globalData.canvasContext
      let currentStyle

      for (let i = 0; i < length; i++) {
        currentStyle = this.stylesList[i]
        const {
            co, coOp, da, data, elements, grd, lc, lj, ml, preTransforms, r, type, wi
          } = currentStyle,
          isStroke =
          type === ShapeType.Stroke || type === ShapeType.GradientStroke

        // Skipping style when
        // Stroke width equals 0
        // style should not be rendered (extra unused repeaters)
        // current opacity equals 0
        // global opacity equals 0
        if (
          isStroke && wi === 0 ||
          !data._shouldRender ||
          coOp === 0 ||
          this.globalData.currentGlobalAlpha === 0
        ) {
          continue
        }
        renderer.save()
        const elems = elements

        if (isStroke) {
          renderer.ctxStrokeStyle(type === ShapeType.Stroke ? co : grd)
          renderer.ctxLineWidth(wi || 0)

          if (lc) {
            renderer.ctxLineCap(lc)
          }

          if (lj) {
            renderer.ctxLineJoin(lj)
          }

          renderer.ctxMiterLimit(ml || 0)
        } else {
          renderer.ctxFillStyle(type === ShapeType.Fill ? co : grd)
        // ctx.fillStyle = type === 'fl' ? currentStyle.co : currentStyle.grd;
        }
        renderer.ctxOpacity(coOp)
        if (type !== ShapeType.Stroke && type !== ShapeType.GradientStroke) {
          ctx?.beginPath()
        }

        renderer.ctxTransform(preTransforms.finalTransform?.props as Float32Array)
        const { length: jLen } = elems

        for (let j = 0; j < jLen; j++) {
          if (type === ShapeType.Stroke || type === ShapeType.GradientStroke) {
            ctx?.beginPath()
            if (ctx && da) {
              ctx.setLineDash(da)
              ctx.lineDashOffset = currentStyle.do || 0
            }
          }
          const nodes = elems[j].trNodes,
            { length: kLen } = nodes

          for (let k = 0; k < kLen; k++) {
            const { p: point = [], pts: points = [] } = nodes[k]

            if (nodes[k].t === 'm') {
              ctx?.moveTo(point[0], point[1])
            } else if (nodes[k].t === 'c') {
              ctx?.bezierCurveTo(
                points[0],
                points[1],
                points[2],
                points[3],
                points[4],
                points[5]
              )
            } else {
              ctx?.closePath()
            }
          }
          if (isStroke) {
          // ctx.stroke();
            renderer.ctxStroke()
            if (da) {
              ctx?.setLineDash(this.dashResetter)
            }
          }
        }
        if (!isStroke) {
        // ctx.fill(currentStyle.r);
          ; (this.globalData.renderer as CanvasRenderer).ctxFill(r)
        }
        renderer.restore()
      }
    } catch (error) {
      console.error(this.constructor.name, error)
    }
  }

  reloadShapes() {
    this._isFirstFrame = true
    const { length } = this.itemsData

    for (let i = 0; i < length; i++) {
      this.prevViewData[i] = this.itemsData[i]
    }
    this.searchShapes(
      this.shapesData,
      this.itemsData as unknown as CanvasItem[],
      this.prevViewData as unknown as CVShapeElement[],
      true,
      []
    )
    const { length: len } = this.dynamicProperties

    for (let i = 0; i < len; i++) {
      this.dynamicProperties[i].getValue()
    }
    this.renderModifiers()
    this.transformsManager.processSequences(this._isFirstFrame)
  }

  removeTransformFromStyleList() {
    const { length } = this.stylesList

    for (let i = 0; i < length; i++) {
      if (!this.stylesList[i].closed) {
        this.stylesList[i].transforms.pop()
      }
    }
  }

  renderFill(
    _styleData: any, itemData: CanvasItem, groupTransform: TransformEffect
  ) {
    const styleElem = itemData.style

    if (itemData.c._mdf || this._isFirstFrame) {
      styleElem.co = `rgb(${Math.floor(itemData.c.v[0])},${Math.floor(itemData.c.v[1])},${Math.floor(itemData.c.v[2])})`
    }
    if (itemData.o._mdf || groupTransform._opMdf || this._isFirstFrame) {
      styleElem.coOp = itemData.o.v * groupTransform.opacity
    }
  }

  renderGradientFill(
    styleData: Shape,
    itemData: SVGGradientFillStyleData,
    groupTransform: TransformEffect
  ) {
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData is not implemented`)
    }
    const styleElem = itemData.style
    let grd: CanvasGradient | undefined

    if (
      !styleElem?.grd ||
      itemData.g?._mdf ||
      itemData.s?._mdf ||
      itemData.e?._mdf ||
      styleData.t !== 1 && (itemData.h?._mdf || itemData.a?._mdf)
    ) {
      const ctx = this.globalData.canvasContext,
        pt1 = itemData.s?.v ?? [0, 0],
        pt2 = itemData.e?.v ?? [0, 0]

      if (styleData.t === 1) {
        grd = ctx?.createLinearGradient(
          pt1[0], pt1[1], pt2[0], pt2[1]
        )
      } else {
        const rad = Math.sqrt(Math.pow(pt1[0] - pt2[0], 2) + Math.pow(pt1[1] - pt2[1], 2)),
          ang = Math.atan2(pt2[1] - pt1[1], pt2[0] - pt1[0])

        let percent = itemData.h?.v ?? 0

        if (percent >= 1) {
          percent = 0.99
        } else if (percent <= -1) {
          percent = -0.99
        }
        const dist = rad * percent,
          aValue = itemData.a?.v ?? 0,
          x = Math.cos(ang + aValue) * dist + pt1[0],
          y = Math.sin(ang + aValue) * dist + pt1[1]

        grd = ctx?.createRadialGradient(
          x, y, 0, pt1[0], pt1[1], rad
        )
      }

      const len = styleData.g?.p ?? 0,
        cValues = itemData.g?.c ?? []
      let opacity = 1

      for (let i = 0; i < len; i++) {
        if (itemData.g?._hasOpacity && itemData.g._collapsable) {
          opacity = itemData.g.o[i * 2 + 1]
        }
        grd?.addColorStop(cValues[i * 4] / 100,
          `rgba(${cValues[i * 4 + 1]},${cValues[i * 4 + 2]},${cValues[i * 4 + 3]
          },${opacity})`)
      }
      if (styleElem) {
        styleElem.grd = grd
      }

    }
    if (styleElem) {
      styleElem.coOp = (itemData.o?.v ?? 0) * groupTransform.opacity
    }
  }

  override renderInnerContent() {
    this.transformHelper.opacity = 1
    this.transformHelper._opMdf = false
    this.renderModifiers()
    this.transformsManager.processSequences(this._isFirstFrame)
    this.renderShape(
      this.transformHelper,
      this.shapesData,
      this.itemsData,
      true
    )
  }

  renderPath(pathData: Shape, itemData: CVShapeData) {
    if (pathData.hd === true || !pathData._shouldRender || !itemData.sh) {
      return
    }
    const { length } = itemData.styledShapes

    for (let i = 0; i < length; i++) {
      this.renderStyledShape(itemData.styledShapes[i], itemData.sh)
    }
  }

  renderShape(
    parentTransform: Transformer,
    items: Shape[],
    data: ShapeGroupData[],
    isMain?: boolean
  ) {
    try {
      const len = items.length - 1
      let groupTransform: undefined | Transformer

      groupTransform = parentTransform
      for (let i = len; i >= 0; i--) {
        switch (items[i].ty) {
          case ShapeType.Transform: {
            groupTransform = data[i].transform
            if (groupTransform) {
              this.renderShapeTransform(parentTransform,
                groupTransform)
            }

            break
          }
          case ShapeType.Path:
          case ShapeType.Ellipse:
          case ShapeType.Rectangle:
          case ShapeType.PolygonStar: {
            this.renderPath(items[i], data[i] as CVShapeData)
            break
          }
          case ShapeType.Fill: {
            this.renderFill(
              items[i], data[i], groupTransform
            )
            break
          }
          case ShapeType.Stroke: {
            this.renderStroke(
              items[i], data[i], groupTransform
            )
            break
          }
          case ShapeType.GradientFill:
          case ShapeType.GradientStroke: {
            this.renderGradientFill(
              items[i],
              data[i],
              groupTransform
            )
            break
          }
          case ShapeType.Group: {
            this.renderShape(
              groupTransform, items[i].it ?? [], data[i].it
            )
            break
          }
          case ShapeType.Trim:
          default:
          // Do nothing
        }
      }
      if (isMain) {
        this.drawLayer()
      }
    } catch (error) {
      console.error(this.constructor.name, error)
    }
  }

  renderShapeTransform(parentTransform: Transformer,
    groupTransform: Transformer) {
    if (
      !parentTransform._opMdf &&
      !groupTransform.op._mdf &&
      !this._isFirstFrame
    ) {
      return
    }
    groupTransform.opacity = parentTransform.opacity
    groupTransform.opacity *= groupTransform.op.v
    groupTransform._opMdf = true
  }

  renderStroke(
    _styleData: Shape,
    itemData: CanvasItem,
    groupTransform: TransformEffect
  ) {
    const styleElem = itemData.style,
      {
        c, d, o, w
      } = itemData

    if (d && (d._mdf || this._isFirstFrame)) {
      styleElem.da = d.dashArray
      styleElem.do = d.dashoffset[0]
    }
    if (c._mdf || this._isFirstFrame) {
      styleElem.co = `rgb(${Math.floor(c.v[0])},${Math.floor(c.v[1])},${Math.floor(c.v[2])})`
    }
    if (o._mdf || groupTransform._opMdf || this._isFirstFrame) {
      styleElem.coOp = o.v * groupTransform.opacity
    }
    if (w._mdf || this._isFirstFrame) {
      styleElem.wi = w.v
    }
  }

  renderStyledShape(styledShape: CVShapeData, shape: ShapeProperty) {
    if (!this._isFirstFrame && !shape._mdf && !styledShape.transforms._mdf) {
      return
    }

    const { transforms, trNodes: shapeNodes } = styledShape,
      { paths } = shape as { paths?: ShapeCollection }
    let i,
      len,
      j
    const jLen = paths?._length || 0

    shapeNodes.length = 0
    const groupTransformMat = transforms?.finalTransform

    for (j = 0; j < jLen; j++) {
      const pathNodes = paths?.shapes[j]

      if (!pathNodes?.v) {
        continue
      }
      len = pathNodes._length
      for (i = 1; i < len; i++) {
        if (i === 1) {
          shapeNodes.push({
            p: groupTransformMat?.applyToPointArray(
              pathNodes.v[0][0],
              pathNodes.v[0][1],
              0
            ),
            t: 'm',
          })
        }
        shapeNodes.push({
          pts: groupTransformMat?.applyToTriplePoints(
            pathNodes.o[i - 1],
            pathNodes.i[i],
            pathNodes.v[i]
          ) as unknown as number[],
          t: 'c',
        })
      }
      if (len === 1) {
        shapeNodes.push({
          p: groupTransformMat?.applyToPointArray(
            pathNodes.v[0][0],
            pathNodes.v[0][1],
            0
          ),
          t: 'm',
        })
      }
      if (pathNodes.c && len) {
        shapeNodes.push({
          pts: groupTransformMat?.applyToTriplePoints(
            pathNodes.o[i - 1],
            pathNodes.i[0],
            pathNodes.v[0]
          ) as unknown as number[],
          t: 'c',
        }, { t: 'z' })
      }
    }
    styledShape.trNodes = shapeNodes
  }

  searchShapes(
    arr: Shape[],
    itemsData: CanvasItem[],
    prevViewData: CVShapeElement[],
    shouldRenderFromProps: boolean,
    transforms: Transformer[]
  ) {
    let shouldRender = shouldRenderFromProps
    const len = arr.length - 1,
      ownStyles: CVStyleElement[] = [],
      ownModifiers: ShapeModifierInterface[] = []
    let modifier, currentTransform
    const ownTransforms = [...transforms]

    for (let i = len; i >= 0; i--) {
      const processedPos = this.searchProcessedElement(arr[i])

      if (processedPos) {
        itemsData[i] = prevViewData[processedPos - 1]
      } else {
        arr[i]._shouldRender = shouldRender
      }

      switch (arr[i].ty) {
        case ShapeType.Fill:
        case ShapeType.Stroke:
        case ShapeType.GradientFill:
        case ShapeType.GradientStroke: {
          if (processedPos) {
            itemsData[i].style.closed = false
          } else {
            itemsData[i] = this.createStyleElement(arr[i], ownTransforms)
          }

          ownStyles.push(itemsData[i].style)
          break
        }
        case ShapeType.Group: {
          if (processedPos) {
            const { length: jLen } = itemsData[i].it

            for (let j = 0; j < jLen; j++) {
              itemsData[i].prevViewData[j] = itemsData[i].it[j]
            }
          } else {
            itemsData[i] = this.createGroupElement(arr[i])
          }
          this.searchShapes(
            arr[i].it ?? [],
            itemsData[i].it,
            itemsData[i].prevViewData,
            shouldRender,
            ownTransforms
          )
          break
        }
        case ShapeType.Transform: {
          if (!processedPos) {
            currentTransform = this.createTransformElement(arr[i])
            itemsData[i] = currentTransform as unknown as CVElement
          }
          ownTransforms.push(itemsData[i])
          this.addTransformToStyleList(itemsData[i])
          break
        }
        case ShapeType.Path:
        case ShapeType.Rectangle:
        case ShapeType.Ellipse:
        case ShapeType.PolygonStar: {
          if (!processedPos) {
            itemsData[i] = this.createShapeElement(arr[i])
          }
          break
        }
        case ShapeType.Trim:
        case ShapeType.RoundedCorners:
        case ShapeType.PuckerBloat:
        case ShapeType.ZigZag:
        case ShapeType.OffsetPath: {
          if (processedPos) {
            modifier = itemsData[i]
            modifier.closed = false
          } else {
            modifier = getModifier(arr[i].ty)
            modifier.init(this as unknown as ElementInterfaceIntersect, arr[i])
            itemsData[i] = modifier
            this.shapeModifiers.push(modifier)
          }
          ownModifiers.push(modifier)
          break
        }
        case ShapeType.Repeater: {
          if (processedPos) {
            modifier = itemsData[i]
            modifier.closed = true
          } else {
            modifier = getModifier(arr[i].ty)
            itemsData[i] = modifier
            modifier.init(
              this as unknown as ElementInterfaceIntersect,
              arr,
              i,
              itemsData
            )
            this.shapeModifiers.push(modifier)
            shouldRender = false
          }
          ownModifiers.push(modifier)
          break
        }
        default:
      }
      this.addProcessedElement(arr[i] as unknown as ElementInterfaceIntersect,
        i + 1)
    }

    this.removeTransformFromStyleList()
    this.closeStyles(ownStyles)
    const { length } = ownModifiers

    for (let i = 0; i < length; i++) {
      ownModifiers[i].closed = true
    }
  }
}
