import type {
  AnimationData,
  CompElementInterface,
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
  VectorProperty,
} from '@/types'
import type { ValueProperty } from '@/utils/Properties'

import CVBaseElement from '@/elements/canvas/CVBaseElement'
import CompElement from '@/elements/CompElement'
import CanvasRendererBase from '@/renderers/CanvasRendererBase'
import { createSizedArray } from '@/utils/helpers/arrays'
import PropertyFactory from '@/utils/PropertyFactory'

export default class CVCompElement extends CompElement {
  canvasContext?: CanvasRenderingContext2D
  pendingElements: ElementInterfaceIntersect[]
  constructor(
    data: LottieLayer,
    globalData: GlobalData,
    comp: CompElementInterface
  ) {
    super()
    this.completeLayers = false
    this.layers = data.layers ?? []
    this.pendingElements = []
    this.elements = createSizedArray(this.layers.length)

    const {
        buildItem,
        checkPendingElements,
        configAnimation,
        createImage,
        createShape,
        createSolid,
        createText,
        ctxFill,
        ctxFillRect,
        ctxFillStyle,
        ctxLineCap,
        ctxLineJoin,
        ctxLineWidth,
        ctxMiterLimit,
        ctxOpacity,
        ctxStroke,
        ctxStrokeStyle,
        ctxTransform,
        hide,
        reset,
        restore,
        save,
        show,
        updateContainerSize,
      } = CanvasRendererBase.prototype,
      {
        clearCanvas,
        createContainerElements,
        createContent,
        createElements,
        createRenderableComponents,
        destroy,
        exitLayer,
        hideElement,
        // initRendererElement,
        prepareLayer,
        renderFrame,
        setBlendMode,
        showElement,
      } = CVBaseElement.prototype

    this.buildItem = buildItem
    this.checkPendingElements = checkPendingElements
    this.configAnimation = configAnimation
    this.createImage = createImage
    this.createShape = createShape
    this.createSolid = createSolid
    this.createText = createText
    this.ctxFill = ctxFill
    this.ctxFillRect = ctxFillRect
    this.ctxFillStyle = ctxFillStyle
    this.ctxLineCap = ctxLineCap
    this.ctxLineJoin = ctxLineJoin
    this.ctxLineWidth = ctxLineWidth
    this.ctxMiterLimit = ctxMiterLimit
    this.ctxOpacity = ctxOpacity
    this.ctxStroke = ctxStroke
    this.ctxStrokeStyle = ctxStrokeStyle
    this.ctxTransform = ctxTransform
    this.hide = hide
    this.reset = reset
    this.restore = restore
    this.save = save
    this.show = show
    this.updateContainerSize = updateContainerSize
    this.clearCanvas = clearCanvas
    this.createContainerElements = createContainerElements
    this.createContent = createContent
    this.createElements = createElements
    this.createRenderableComponents = createRenderableComponents
    this.destroy = destroy
    this.exitLayer = exitLayer
    this.hideElement = hideElement
    // this.initRendererElement = initRendererElement
    this.prepareLayer = prepareLayer
    this.renderFrame = renderFrame
    this.setBlendMode = setBlendMode
    this.showElement = showElement

    this.initElement(
      data, globalData, comp
    )
    this.tm = (
      data.tm
        ? PropertyFactory.getProp(
          this as unknown as ElementInterfaceIntersect,
          data.tm as VectorProperty,
          0,
          globalData.frameRate,
          this as unknown as ElementInterfaceIntersect
        )
        : { _placeholder: true }
    ) as ValueProperty
  }

  buildElementParenting(
    _element: ElementInterfaceIntersect,
    _parentName?: number,
    _hierarchy: ElementInterfaceIntersect[] = []
  ) {
    throw new Error(`${this.constructor.name}: Method buildElementParenting is not implemented`)
  }

  buildItem(_pos: number) {
    throw new Error(`${this.constructor.name}: Method buildItem is not implemented`)
  }

  checkPendingElements() {
    throw new Error(`${this.constructor.name}: Method checkPendingElements is not implemented`)
  }

  clearCanvas(_canvasContext?:
      | CanvasRenderingContext2D
      | OffscreenCanvasRenderingContext2D
      | null) {
    throw new Error(`${this.constructor.name}: Method clearCanvas is not implemented`)
  }

  configAnimation(_data: AnimationData) {
    throw new Error(`${this.constructor.name}: Method configAnimation is not implemented`)
  }

  createComp(data: LottieLayer) {
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData is not implemented`)
    }

    return new CVCompElement(
      data, this.globalData, this
    )
  }

  createElements() {
    throw new Error(`${this.constructor.name}: Method createElements is not implemented`)
  }

  createImage(_data: LottieLayer) {
    throw new Error(`${this.constructor.name}: Method createImage is not implemented`)
  }

  createShape(_data: LottieLayer) {
    throw new Error(`${this.constructor.name}: Method createShape is not implemented`)
  }

  createSolid(_data: LottieLayer) {
    throw new Error(`${this.constructor.name}: Method createSolid is not implemented`)
  }

  createText(_data: LottieLayer) {
    throw new Error(`${this.constructor.name}: Method createText is not implemented`)
  }

  ctxFill(_rule?: CanvasFillRule) {
    throw new Error(`${this.constructor.name}: Method ctxFill is not implemented`)
  }

  ctxFillRect(
    _x: number, _y: number, _w: number, _h: number
  ) {
    throw new Error(`${this.constructor.name}: Method ctxFillRect is not implemented`)
  }

  ctxFillStyle(_val: string) {
    throw new Error(`${this.constructor.name}: Method ctxFillStyle is not implemented`)
  }

  ctxLineCap(_value: CanvasLineCap) {
    throw new Error(`${this.constructor.name}: Method ctxLineCap is not implemented`)
  }

  ctxLineJoin(_value: CanvasLineJoin) {
    throw new Error(`${this.constructor.name}: Method ctxLineJoin is not implemented`)
  }

  ctxLineWidth(_value: number) {
    throw new Error(`${this.constructor.name}: Method ctxLineWidth is not implemented`)
  }

  ctxMiterLimit(_value: number) {
    throw new Error(`${this.constructor.name}: Method ctxMiterLimit is not implemented`)
  }

  ctxOpacity(_value: number) {
    throw new Error(`${this.constructor.name}: Method ctxOpacity is not implemented`)
  }

  ctxStroke(_value: number) {
    throw new Error(`${this.constructor.name}: Method ctxStroke is not implemented`)
  }

  ctxStrokeStyle(_value: string) {
    throw new Error(`${this.constructor.name}: Method ctxStrokeStyle is not implemented`)
  }

  ctxTransform(_value: Float32Array) {
    throw new Error(`${this.constructor.name}: Method ctxTransform is not implemented`)
  }

  override destroy() {
    const { length } = this.layers

    for (let i = length - 1; i >= 0; i--) {
      if (this.elements[i]) {
        this.elements[i].destroy()
      }
    }
    this.layers = null as unknown as LottieLayer[]
    this.elements = null as unknown as ElementInterfaceIntersect[]
  }

  exitLayer() {
    throw new Error(`${this.constructor.name}: Method exitLayer is not implemented`)
  }

  hideElement() {
    throw new Error(`${this.constructor.name}: Method hideElement is not implemented`)
  }

  prepareLayer() {
    throw new Error(`${this.constructor.name}: Method prepareLayer is not implemented`)
  }

  override renderInnerContent() {
    if (!this.data?.w || !this.data.h) {
      throw new Error(`${this.constructor.name} data (LottieLayer) is not implemented`)
    }

    const {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      canvasContext: ctx, completeLayers, data, elements, layers
    } = this

    if (!ctx) {
      throw new Error(`${this.constructor.name}: canvasContext is not implemented`)
    }
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(data.w || 0, 0)
    ctx.lineTo(data.w || 0, data.h || 0)
    ctx.lineTo(0, data.h || 0)
    ctx.lineTo(0, 0)
    ctx.clip()
    const { length } = layers

    for (let i = length - 1; i >= 0; i--) {
      if (completeLayers || elements[i]) {
        elements[i].renderFrame()
      }
    }
  }

  reset() {
    throw new Error(`${this.constructor.name}: Method reset is not implemented`)
  }

  restore(_flag?: boolean) {
    throw new Error(`${this.constructor.name}: Method restore is not implemented`)
  }

  save(_flag?: boolean) {
    throw new Error(`${this.constructor.name}: Method save is not implemented`)
  }

  showElement(_pos: number) {
    throw new Error(`${this.constructor.name}: Method showElement is not implemented`)
  }

  updateContainerSize(_width?: number, _height?: number) {
    throw new Error(`${this.constructor.name}: Method updateContainerSize is not implemented`)
  }
}
