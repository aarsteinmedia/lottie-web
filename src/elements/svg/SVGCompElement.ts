import type {
  CompElementInterface,
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
} from '@/types'
import type { KeyframedValueProperty } from '@/utils/properties/KeyframedValueProperty'

import { CompElement } from '@/elements/CompElement'
import { SVGBaseElement } from '@/elements/svg/SVGBaseElement'
import { SVGRendererBase } from '@/renderers/SVGRendererBase'
import { createSizedArray } from '@/utils/helpers/arrays'
import PropertyFactory from '@/utils/PropertyFactory'

export class SVGCompElement extends SVGBaseElement {
  _debug?: boolean
  addPendingElement = SVGRendererBase.prototype.addPendingElement
  appendElementInPos = SVGRendererBase.prototype.appendElementInPos
  override buildAllItems = SVGRendererBase.prototype.buildAllItems
  buildElementParenting = SVGRendererBase.prototype.buildElementParenting
  buildItem = SVGRendererBase.prototype.buildItem
  override checkLayers = SVGRendererBase.prototype.checkLayers
  checkPendingElements = SVGRendererBase.prototype.checkPendingElements
  completeLayers: boolean
  configAnimation = SVGRendererBase.prototype.configAnimation
  createAudio = SVGRendererBase.prototype.createAudio
  createCamera = SVGRendererBase.prototype.createCamera
  createFootage = SVGRendererBase.prototype.createFootage
  createImage = SVGRendererBase.prototype.createImage
  createItem = SVGRendererBase.prototype.createItem
  createNull = SVGRendererBase.prototype.createNull
  createShape = SVGRendererBase.prototype.createShape
  createSolid = SVGRendererBase.prototype.createSolid
  createText = SVGRendererBase.prototype.createText
  currentFrame = 0
  override destroy = CompElement.prototype.destroy
  destroyElements = CompElement.prototype.destroyElements
  elements: ElementInterfaceIntersect[]
  findIndexByInd = SVGRendererBase.prototype.findIndexByInd
  getElementById = SVGRendererBase.prototype.getElementById
  getElementByPath = SVGRendererBase.prototype.getElementByPath
  getElements = CompElement.prototype.getElements
  override hide = CompElement.prototype.hide
  includeLayers = SVGRendererBase.prototype.includeLayers
  override initElement = CompElement.prototype.initElement
  initItems = SVGRendererBase.prototype.initItems
  layers?: LottieLayer[]
  pendingElements: ElementInterfaceIntersect[]
  override prepareFrame = CompElement.prototype.prepareFrame
  renderedFrame = -1
  override renderFrame = CompElement.prototype.renderFrame
  override renderInnerContent = CompElement.prototype.renderInnerContent
  searchExtraCompositions = SVGRendererBase.prototype.searchExtraCompositions
  setElements = CompElement.prototype.setElements
  setProjectInterface = SVGRendererBase.prototype.setProjectInterface
  setupGlobalData = SVGRendererBase.prototype.setupGlobalData
  override show = CompElement.prototype.show
  supports3d: boolean
  tm?: KeyframedValueProperty
  updateContainerSize = SVGRendererBase.prototype.updateContainerSize

  constructor(
    data: LottieLayer,
    globalData: GlobalData,
    comp: CompElementInterface
  ) {
    super()
    this.layers = data.layers as LottieLayer[] | undefined
    this.supports3d = true
    this.completeLayers = false
    this.pendingElements = []
    this.elements = this.layers ? createSizedArray(this.layers.length) : []

    this.initElement(
      data, globalData, comp
    )
    this.tm = (data.tm ? PropertyFactory.getProp(
      this as unknown as ElementInterfaceIntersect, data.tm, 0, globalData.frameRate, this as unknown as ElementInterfaceIntersect
    ) : { _placeholder: true }) as KeyframedValueProperty
  }

  createComp(data: LottieLayer) {
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: Cannot access global data`)
    }

    return new SVGCompElement(
      data,
      this.globalData,
      this as unknown as ElementInterfaceIntersect
    )
  }
}