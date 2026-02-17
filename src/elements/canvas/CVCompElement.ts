import type {
  CompElementInterface,
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
} from '@/types'
import type { ValueProperty } from '@/utils/properties/ValueProperty'

import { CVBaseElement } from '@/elements/canvas/CVBaseElement'
import { CompElement } from '@/elements/CompElement'
import { CanvasRendererBase } from '@/renderers/CanvasRendererBase'
import { createSizedArray } from '@/utils/helpers/arrays'
import PropertyFactory from '@/utils/PropertyFactory'

export class CVCompElement extends CompElement {
  addPendingElement = CanvasRendererBase.prototype.addPendingElement
  override buildAllItems = CanvasRendererBase.prototype.buildAllItems
  buildElementParenting = CanvasRendererBase.prototype.buildElementParenting
  buildItem = CanvasRendererBase.prototype.buildItem
  canvasContext?: CanvasRenderingContext2D
  override checkLayers = CanvasRendererBase.prototype.checkLayers
  checkPendingElements = CanvasRendererBase.prototype.checkPendingElements
  clearCanvas = CVBaseElement.prototype.clearCanvas
  configAnimation = CanvasRendererBase.prototype.configAnimation
  createAudio = CanvasRendererBase.prototype.createAudio
  createCamera = CanvasRendererBase.prototype.createCamera
  override createContainerElements = CVBaseElement.prototype.createContainerElements
  override createContent = CVBaseElement.prototype.createContent
  createElements = CVBaseElement.prototype.createElements
  createFootage = CanvasRendererBase.prototype.createFootage
  createImage = CanvasRendererBase.prototype.createImage
  createItem = CanvasRendererBase.prototype.createItem
  createNull = CanvasRendererBase.prototype.createNull
  override createRenderableComponents = CVBaseElement.prototype.createRenderableComponents
  createShape = CanvasRendererBase.prototype.createShape
  createSolid = CanvasRendererBase.prototype.createSolid
  createText = CanvasRendererBase.prototype.createText
  ctxFill = CanvasRendererBase.prototype.ctxFill
  ctxFillRect = CanvasRendererBase.prototype.ctxFillRect
  ctxFillStyle = CanvasRendererBase.prototype.ctxFillStyle
  ctxLineCap = CanvasRendererBase.prototype.ctxLineCap
  ctxLineJoin = CanvasRendererBase.prototype.ctxLineJoin
  ctxLineWidth = CanvasRendererBase.prototype.ctxLineWidth
  ctxMiterLimit = CanvasRendererBase.prototype.ctxMiterLimit
  ctxOpacity = CanvasRendererBase.prototype.ctxOpacity
  ctxStroke = CanvasRendererBase.prototype.ctxStroke
  ctxStrokeStyle = CanvasRendererBase.prototype.ctxStrokeStyle
  ctxTransform = CanvasRendererBase.prototype.ctxTransform
  exitLayer = CVBaseElement.prototype.exitLayer
  getElementById = CanvasRendererBase.prototype.getElementById
  getElementByPath = CanvasRendererBase.prototype.getElementByPath
  override hide = CVBaseElement.prototype.hide
  hideElement = CVBaseElement.prototype.hideElement
  includeLayers = CanvasRendererBase.prototype.includeLayers
  initItems = CanvasRendererBase.prototype.initItems
  override initRendererElement = CVBaseElement.prototype.initRendererElement
  pendingElements: ElementInterfaceIntersect[]
  prepareLayer = CVBaseElement.prototype.prepareLayer
  override renderFrame = CVBaseElement.prototype.renderFrame
  reset = CanvasRendererBase.prototype.reset
  restore = CanvasRendererBase.prototype.restore
  save = CanvasRendererBase.prototype.save
  searchExtraCompositions = CanvasRendererBase.prototype.searchExtraCompositions
  override setBlendMode = CVBaseElement.prototype.setBlendMode
  setProjectInterface = CanvasRendererBase.prototype.setProjectInterface
  setupGlobalData = CanvasRendererBase.prototype.setupGlobalData
  override show = CVBaseElement.prototype.show
  showElement = CVBaseElement.prototype.showElement
  updateContainerSize = CanvasRendererBase.prototype.updateContainerSize

  constructor(
    data: LottieLayer,
    globalData: GlobalData,
    comp: CompElementInterface
  ) {
    super()
    this.completeLayers = false
    this.layers = data.layers as LottieLayer[]
    this.pendingElements = []
    this.elements = createSizedArray(this.layers.length)
    this.initElement(
      data, globalData, comp
    )
    this.tm = (
      data.tm
        ? PropertyFactory.getProp(
          this as unknown as ElementInterfaceIntersect,
          data.tm,
          0,
          globalData.frameRate,
          this as unknown as ElementInterfaceIntersect
        )
        : { _placeholder: true }
    ) as ValueProperty
  }

  createComp(data: LottieLayer) {
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData is not implemented`)
    }

    return new CVCompElement(
      data, this.globalData, this
    )
  }

  override destroy() {
    const { length } = this.layers

    for (let i = length - 1; i >= 0; i--) {
      this.elements[i]?.destroy()
    }
    this.layers = null as unknown as LottieLayer[]
    this.elements = null as unknown as ElementInterfaceIntersect[]
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
        elements[i]?.renderFrame()
      }
    }
  }
}
