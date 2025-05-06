import type {
  AnimationData,
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
  VectorProperty,
} from '@/types'
import type { ValueProperty } from '@/utils/Properties'

import CompElement from '@/elements/CompElement'
import HBaseElement from '@/elements/html/HBaseElement'
import SVGCompElement from '@/elements/svg/SVGCompElement'
import HybridRendererBase from '@/renderers/HybridRendererBase'
import { createSizedArray } from '@/utils/helpers/arrays'
import PropertyFactory from '@/utils/PropertyFactory'

export default class HCompElement extends CompElement {
  pendingElements: ElementInterfaceIntersect[]
  supports3d?: boolean
  svgElement?: SVGSVGElement
  threeDElements: any[] = []
  transformedElement?: SVGGElement | HTMLElement
  constructor(
    data: LottieLayer,
    globalData: GlobalData,
    comp: ElementInterfaceIntersect
  ) {
    super()
    this.layers = data.layers as LottieLayer[]
    this.supports3d = !data.hasMask
    this.completeLayers = false
    this.pendingElements = []
    this.elements = createSizedArray(this.layers.length)

    const {
        appendElementInPos,
        build3dContainers,
        checkPendingElements,
        configAnimation,
        createCamera,
        createImage,
        createShape,
        createSolid,
        createText,
        createThreeDContainer,
        getThreeDContainerByPos,
        initItems,
        searchExtraCompositions,
        updateContainerSize,
      } = HybridRendererBase.prototype,
      {
        addEffects,
        checkBlendMode,
        createRenderableComponents,
        destroy,
        initRendererElement,
        renderElement,
        renderFrame,
        setMatte,
      } = HBaseElement.prototype

    this.addEffects = addEffects
    this.appendElementInPos = appendElementInPos
    this.build3dContainers = build3dContainers
    this.checkBlendMode = checkBlendMode
    this.checkPendingElements = checkPendingElements
    this.configAnimation = configAnimation
    this.createCamera = createCamera
    this.createImage = createImage
    this.createRenderableComponents = createRenderableComponents
    this.createShape = createShape
    this.createSolid = createSolid
    this.createText = createText
    this.createThreeDContainer = createThreeDContainer
    this.destroy = destroy
    this.getThreeDContainerByPos = getThreeDContainerByPos
    this.initItems = initItems
    this.initRendererElement = initRendererElement
    this.renderElement = renderElement
    this.renderFrame = renderFrame
    this.searchExtraCompositions = searchExtraCompositions
    this.setMatte = setMatte
    this.updateContainerSize = updateContainerSize

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

    this._createBaseContainerElements = this.createContainerElements
  }

  _createBaseContainerElements() {
    throw new Error(`${this.constructor.name}: Method _createBaseContainerElements is not implemented`)
  }
  addEffects() {
    throw new Error(`${this.constructor.name}: Method addEffects is not implemented`)
  }
  addTo3dContainer(elem: ElementInterfaceIntersect, pos: number) {
    let j = 0,
      nextElement

    while (j < pos) {
      nextElement = this.elements[j].getBaseElement()
      j++
    }
    if (nextElement) {
      this.layerElement?.insertBefore(elem, nextElement)
    } else {
      this.layerElement?.appendChild(elem)
    }
  }

  appendElementInPos(_element: ElementInterfaceIntersect, _pos: number) {
    throw new Error(`${this.constructor.name}: Method appendElementInPos is not implemented`)
  }

  build3dContainers() {
    throw new Error(`${this.constructor.name}: Method build3dContainers is not implemented`)
  }

  buildElementParenting(
    _element: ElementInterfaceIntersect,
    _parentName?: number,
    _hierarchy: ElementInterfaceIntersect[] = []
  ) {
    throw new Error(`${this.constructor.name}: Method buildElementParenting is not implemented`)
  }
  checkBlendMode() {
    throw new Error(`${this.constructor.name}: Method checkBlendMode is not implemented`)
  }
  checkPendingElements() {
    throw new Error(`${this.constructor.name}: Method checkPendingElements is not implemented`)
  }
  configAnimation(_data: AnimationData) {
    throw new Error(`${this.constructor.name}: Method configAnimation is not implemented`)
  }
  createCamera(_data: LottieLayer) {
    throw new Error(`${this.constructor.name}: Method createCamera is not implemented`)
  }
  createComp(data: LottieLayer) {
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData is not implemented`)
    }
    if (!this.supports3d) {
      return new SVGCompElement(
        data,
        this.globalData,
        this as unknown as ElementInterfaceIntersect
      )
    }

    return new HCompElement(
      data,
      this.globalData,
      this as unknown as ElementInterfaceIntersect
    )
  }
  override createContainerElements() {
    this._createBaseContainerElements()
    // divElement.style.clip = 'rect(0px, '+this.data.w+'px, '+this.data.h+'px, 0px)';
    if (this.data?.hasMask) {
      this.svgElement?.setAttribute('width', `${this.data.w}`)
      this.svgElement?.setAttribute('height', `${this.data.h}`)
      this.transformedElement = this.baseElement
    } else {
      this.transformedElement = this.layerElement
    }
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
  createThreeDContainer(_pos: number, _type: string) {
    throw new Error(`${this.constructor.name}: Method createThreeDContainer is not implemented`)
  }
  getThreeDContainerByPos(_pos: number) {
    throw new Error(`${this.constructor.name}: Method getThreeDContainerByPos is not implemented`)
  }
  initItems() {
    throw new Error(`${this.constructor.name}: Method initItems is not implemented`)
  }

  searchExtraCompositions(_assets: LottieLayer[]) {
    throw new Error(`${this.constructor.name}: Method searchExtraCompositions is not implemented`)
  }

  setMatte() {
    throw new Error(`${this.constructor.name}: Method setMatte is not implemented`)
  }

  updateContainerSize() {
    throw new Error(`${this.constructor.name}: Method updateContainerSize is not implemented`)
  }
}
