import type {
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
} from '@/types'

import RenderableElement from '@/elements/helpers/RenderableElement'
import BaseRenderer from '@/renderers/BaseRenderer'
import { extendPrototype } from '@/utils/functionExtensions'

// TODO: This is a mixin mess
export default abstract class RenderableDOMElement extends RenderableElement {
  createContainerElements: any

  initRendererElement: any

  innerElem?: SVGElement | null

  renderElement: any

  constructor() {
    super()
    const { addPendingElement, checkLayers, createItem } = new BaseRenderer()
    this.checkLayers = checkLayers
    this.createItem = createItem
    this.addPendingElement = addPendingElement
  }
  addPendingElement(_element: ElementInterfaceIntersect) {
    throw new Error(
      `${this.constructor.name}: Method addPendingElement is not implemented`
    )
  }
  createContent() {
    /** Fallback */
  }
  createItem(_data: LottieLayer) {
    throw new Error(
      `${this.constructor.name}: Method createItem is not implemented`
    )
  }
  createRenderableComponents() {
    // throw new Error()
  }
  destroy() {
    this.innerElem = null
    this.destroyBaseElement()
  }
  destroyBaseElement() {
    throw new Error(
      `${this.constructor.name}: Method destroyBaseElement is not implemented`
    )
  }
  hide() {
    if (!this.hidden && (!this.isInRange || this.isTransparent)) {
      const elem = this.baseElement || this.layerElement
      if (elem) {
        elem.style.display = 'none'
      }

      this.hidden = true
    }
  }
  initElement(
    data: LottieLayer,
    globalData: GlobalData,
    comp: ElementInterfaceIntersect
  ) {
    this.initFrame()
    this.initBaseData(data, globalData, comp)
    this.initTransform()
    this.initHierarchy()
    this.initRenderable()
    this.initRendererElement()
    this.createContainerElements()
    this.createRenderableComponents()
    this.createContent()
    this.hide()
  }
  // initFrame() {
  //   throw new Error('RenderableDOMElement: Method initFrame in not implemented')
  // }
  prepareFrame(num: number) {
    this._mdf = false
    this.prepareRenderableFrame(num)
    this.prepareProperties(num, this.isInRange)
    this.checkTransparency()
  }
  renderFrame(_frame?: number | null) {
    // If it is exported as hidden (data.hd === true) no need to render
    // If it is not visible no need to render
    if (this.data?.hd || this.hidden) {
      return
    }
    this.renderTransform()
    this.renderRenderable()
    this.renderLocalTransform()
    if (!this.renderElement) {
      throw new Error(
        `${this.constructor.name}: Method renderElement is not implemented`
      )
    }
    this.renderElement()
    this.renderInnerContent()
    if (this._isFirstFrame) {
      this._isFirstFrame = false
    }
  }
  renderInnerContent() {
    // throw new Error()
  }
}

// TODO: TextElement needs this mixin

extendPrototype([RenderableElement], RenderableDOMElement)
