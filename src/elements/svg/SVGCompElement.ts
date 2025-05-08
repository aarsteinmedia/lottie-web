import type {
  AnimationData,
  CompElementInterface,
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
} from '@/types'
import type { KeyframedValueProperty } from '@/utils/Properties'

import CompElement from '@/elements/CompElement'
import SVGBaseElement from '@/elements/svg/SVGBaseElement'
import SVGRendererBase from '@/renderers/SVGRendererBase'
import { createSizedArray } from '@/utils/helpers/arrays'
import PropertyFactory from '@/utils/PropertyFactory'

export default class SVGCompElement extends SVGBaseElement {
  _debug?: boolean
  completeLayers: boolean
  currentFrame = 0
  elements: ElementInterfaceIntersect[]
  layers: LottieLayer[]
  pendingElements: ElementInterfaceIntersect[]
  renderedFrame = -1
  supports3d: boolean
  tm?: KeyframedValueProperty
  constructor(
    data: LottieLayer,
    globalData: GlobalData,
    comp: CompElementInterface
  ) {
    super()

    const {
        initElement,
        prepareFrame,
        renderInnerContent,
      } = CompElement.prototype,
      {
        addPendingElement,
        // renderFrame,
        appendElementInPos,
        buildAllItems,
        buildElementParenting,
        buildItem,
        checkLayers,
        checkPendingElements,
        configAnimation,
        createAudio,
        createCamera,
        createFootage,
        createImage,
        createItem,
        createNull,
        createShape,
        createSolid,
        createText,
        destroy,
        // updateContainerSize,
        findIndexByInd,
        getElementById,
        getElementByPath,
        hide,
        includeLayers,
        initItems,
        searchExtraCompositions,
        setProjectInterface,
        setupGlobalData,
        show
      } = SVGRendererBase.prototype

    this.initElement = initElement
    this.prepareFrame = prepareFrame
    this.renderInnerContent = renderInnerContent

    this.checkLayers = checkLayers
    this.createItem = createItem
    this.createCamera = createCamera
    this.createAudio = createAudio
    this.createFootage = createFootage
    this.buildAllItems = buildAllItems
    this.includeLayers = includeLayers
    this.setProjectInterface = setProjectInterface
    this.initItems = initItems
    this.buildElementParenting = buildElementParenting
    this.addPendingElement = addPendingElement
    this.searchExtraCompositions = searchExtraCompositions
    this.getElementById = getElementById
    this.getElementByPath = getElementByPath
    this.setupGlobalData = setupGlobalData
    this.createNull = createNull
    this.createShape = createShape
    this.createText = createText
    this.createImage = createImage
    this.createSolid = createSolid
    this.configAnimation = configAnimation
    this.destroy = destroy
    // this.updateContainerSize = updateContainerSize
    this.findIndexByInd = findIndexByInd
    this.buildItem = buildItem
    this.checkPendingElements = checkPendingElements
    // this.renderFrame = renderFrame
    this.appendElementInPos = appendElementInPos
    this.hide = hide
    this.show = show

    this.layers = data.layers ?? []
    this.supports3d = true
    this.completeLayers = false
    this.pendingElements = []
    this.elements = createSizedArray(this.layers.length)
    this.initElement(
      data, globalData, comp
    )
    this.tm = data.tm ? PropertyFactory.getProp(
      this, data.tm, 0, globalData.frameRate, this
    ) : { _placeholder: true }

  }

  addPendingElement(_el: ElementInterfaceIntersect) {
    throw new Error(`${this.constructor.name}: Method addPendingElement not implemented yet`)
  }
  appendElementInPos(_element: ElementInterfaceIntersect, _pos: number) {
    throw new Error(`${this.constructor.name}: Method appendElementInPos not implemented yet`)
  }
  buildAllItems() {
    throw new Error(`${this.constructor.name}: Method buildAllItems not implemented yet`)
  }
  buildElementParenting(_el: ElementInterfaceIntersect) {
    throw new Error(`${this.constructor.name}: Method buildElementParenting not implemented yet`)
  }
  buildItem(_pos: number) {
    throw new Error(`${this.constructor.name}: Method buildItem not implemented yet`)
  }
  checkLayers() {
    throw new Error(`${this.constructor.name}: Method checkLayers not implemented yet`)
  }
  checkPendingElements() {
    throw new Error(`${this.constructor.name}: Method checkPendingElements not implemented yet`)
  }
  configAnimation(_data: AnimationData) {
    throw new Error(`${this.constructor.name}: Method configAnimation not implemented yet`)
  }
  createAudio(_data: LottieLayer) {
    throw new Error(`${this.constructor.name}: Method createAudio not implemented yet`)
  }
  createCamera(_data: LottieLayer) {
    throw new Error(`${this.constructor.name}: Method createCamera not implemented yet`)
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
  createFootage(_data: LottieLayer) {
    throw new Error(`${this.constructor.name}: Method createFootage not implemented yet`)
  }
  createImage(_data: LottieLayer) {
    throw new Error(`${this.constructor.name}: Method createImage not implemented yet`)
  }
  createItem(_data: LottieLayer) {
    throw new Error(`${this.constructor.name}: Method createItem not implemented yet`)
  }
  createNull(_data: LottieLayer) {
    throw new Error(`${this.constructor.name}: Method createNull not implemented yet`)
  }
  createShape(_data: LottieLayer) {
    throw new Error(`${this.constructor.name}: Method createShape not implemented yet`)
  }
  createSolid(_data: LottieLayer) {
    throw new Error(`${this.constructor.name}: Method createSolid not implemented yet`)
  }
  createText(_data: LottieLayer) {
    throw new Error(`${this.constructor.name}: Method createText not implemented yet`)
  }
  findIndexByInd() {
    throw new Error(`${this.constructor.name}: Method findIndexByInd not implemented yet`)
  }
  getElementById(_ind: number) {
    throw new Error(`${this.constructor.name}: Method getElementById not implemented yet`)
  }
  getElementByPath(_path: unknown[]) {
    throw new Error(`${this.constructor.name}: Method getElementByPath not implemented yet`)
  }
  includeLayers(_data: LottieLayer[]) {
    throw new Error(`${this.constructor.name}: Method includeLayers not implemented yet`)
  }
  initItems() {
    throw new Error(`${this.constructor.name}: Method initItems not implemented yet`)
  }
  renderInnerContent() {
    throw new Error(`${this.constructor.name}: Method renderInnerContent not implemented yet`)
  }
  searchExtraCompositions(_assets: LottieLayer[]) {
    throw new Error(`${this.constructor.name}: Method searchExtraCompositions not implemented yet`)
  }
  setProjectInterface(_interface: null | ProjectInterface) {
    throw new Error(`${this.constructor.name}: Method setProjectInterface not implemented yet`)
  }

  setupGlobalData(_animData: AnimationData, _fontsContainer: HTMLElement | SVGDefsElement) {
    throw new Error(`${this.constructor.name}: Method setupGlobalData not implemented yet`)
  }
}