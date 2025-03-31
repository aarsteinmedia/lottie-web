import type {
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
} from '@/types'

import RenderableElement from '@/elements/helpers/RenderableElement'
import BaseRenderer from '@/renderers/BaseRenderer'
export default abstract class RenderableDOMElement extends RenderableElement {
  innerElem?: SVGElement | null

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
  createContainerElements() {
    throw new Error(
      `${this.constructor.name}: Method createContainerElements is not implemented`
    )
  }
  createContent() {
    throw new Error(
      `${this.constructor.name}: Method createContent is not implemented`
    )
  }
  createItem(_data: LottieLayer) {
    throw new Error(
      `${this.constructor.name}: Method createItem is not implemented`
    )
  }
  createRenderableComponents() {
    throw new Error(
      `${this.constructor.name}: Method createRenderableComponents is not implemented`
    )
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
  override hide() {
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
  initRendererElement() {
    throw new Error(
      `${this.constructor.name}: Method initRendererElement is not implemented`
    )
  }
  prepareFrame(num: number) {
    this._mdf = false
    this.prepareRenderableFrame(num)
    this.prepareProperties(num, this.isInRange)
    this.checkTransparency()
  }
  renderElement() {
    throw new Error(
      `${this.constructor.name}: Method renderElement is not implemented`
    )
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
    throw new Error(
      `${this.constructor.name}: Method renderInnerContent is not implemented`
    )
  }
  override show() {
    if (!this.data) {
      throw new Error(
        `${this.constructor.name}: data (LottieLayer) is not implemented`
      )
    }
    if (!this.isInRange && this.isTransparent) {
      return
    }
    if (!this.data.hd) {
      const elem = this.baseElement || this.layerElement
      if (!elem) {
        throw new Error(
          `${this.constructor.name}: Neither baseElement or layerElement is implemented`
        )
      }
      elem.style.display = 'block'
    }
    this.hidden = false
    this._isFirstFrame = true
  }
}

// const props = Object.getOwnPropertyNames(RenderableElement.prototype),
//   sorted = props.sort((a, b) => {
//     if (a < b) {
//       return -1
//     }
//     if (a > b) {
//       return 1
//     }
//     return 0
//   })

// for (const s of sorted) {
//   if (s === 'constructor') {
//     continue
//   }
//   console.log(s)
// }
