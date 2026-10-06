import type {
  CompElementInterface,
  GlobalData,
  LottieLayer,
} from '@/types'

import { RenderableElement } from '@/elements/helpers/RenderableElement'

export abstract class RenderableDOMElement extends RenderableElement {
  innerElem: SVGGraphicsElement | HTMLElement | null = null

  abstract createContainerElements(): void

  abstract createContent(): void

  abstract createRenderableComponents(): void

  override destroy() {
    this.innerElem = null
    this.destroyBaseElement()
  }

  /** Called by destroy() to tear down this layer's DOM nodes. */
  abstract destroyBaseElement(): void

  override hide() {
    if (this.hidden || this.isInRange && !this.isTransparent) {
      return
    }
    const elem = this.baseElement ?? this.layerElement

    if (elem) {
      elem.style.display = 'none'
    }

    this.hidden = true
  }

  initElement(
    data: LottieLayer,
    globalData: GlobalData,
    comp: CompElementInterface
  ) {
    this.initFrame()
    this.initBaseData(
      data, globalData, comp
    )
    this.initTransform()
    this.initHierarchy()
    this.initRenderable()
    this.initRendererElement()
    this.createContainerElements()
    this.createRenderableComponents()
    this.createContent()
    this.hide()
  }

  abstract initRendererElement(): void

  prepareFrame(num: number) {
    this._mdf = false
    this.prepareRenderableFrame(num)
    this.prepareProperties(num, this.isInRange)
    this.checkTransparency()
  }

  abstract renderElement(): void

  renderFrame(_val?: number) {
    if (!this.data) {
      throw new Error(`${this.constructor.name}: data (LottieLayer) is not implemented`)
    }
    // If it is exported as hidden (data.hd === true) no need to render
    // If it is not visible no need to render
    if (this.data.hd || this.hidden) {
      return
    }
    this.renderTransform()
    this.renderRenderable()
    this.renderLocalTransform()
    this.renderElement()
    this.renderInnerContent()
    if (this._isFirstFrame) {
      this._isFirstFrame = false
    }
  }

  abstract renderInnerContent(): void

  override show() {
    if (!this.data) {
      throw new Error(`${this.constructor.name}: data (LottieLayer) is not implemented`)
    }
    if (!this.isInRange && this.isTransparent) {
      return
    }
    if (!this.data.hd) {
      const elem = this.baseElement ?? this.layerElement

      if (!elem) {
        throw new Error(`${this.constructor.name}: Neither baseElement or layerElement is implemented`)
      }
      elem.style.display = 'block'
    }
    this.hidden = false
    this._isFirstFrame = true
  }
}
