import type {
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
  Transformer,
} from '@/types'

import CVEffects from '@/elements/canvas/CVEffects'
import MaskElement from '@/elements/MaskElement'
import SVGBaseElement from '@/elements/svg/SVGBaseElement'
import BaseRenderer from '@/renderers/BaseRenderer'
import {
  createNS, createTag, styleDiv
} from '@/utils'

export default class HBaseElement {
  _isFirstFrame?: boolean
  baseElement?: SVGGElement | HTMLElement
  data?: LottieLayer
  finalTransform?: Transformer
  globalData?: GlobalData
  hidden?: boolean
  layerElement?: SVGGElement | HTMLElement
  maskedElement?: SVGGElement | HTMLElement
  maskManager?: MaskElement
  matteElement?: SVGGElement | HTMLElement
  renderableEffectsManager?: CVEffects
  svgElement?: SVGSVGElement
  transformedElement?: SVGGElement | HTMLElement
  constructor() {
    const { getBaseElement } = SVGBaseElement.prototype,
      { buildElementParenting } = BaseRenderer.prototype

    this.getBaseElement = getBaseElement
    this.destroyBaseElement = this.destroy
    this.buildElementParenting = buildElementParenting
  }

  addEffects() {
    // TODO: Pass Through
  }

  buildElementParenting(
    _element: ElementInterfaceIntersect,
    _parentName?: number,
    _hierarchy?: ElementInterfaceIntersect[]
  ) {
    throw new Error(`${this.constructor.name}: Method buildElementParenting is not implemented`)
  }

  checkBlendMode() {
    // TODO: Pass Through
  }

  createContainerElements() {
    this.renderableEffectsManager = new CVEffects(this as unknown as ElementInterfaceIntersect)
    this.transformedElement = this.baseElement
    this.maskedElement = this.layerElement
    if (this.data?.ln) {
      this.layerElement?.setAttribute('id', this.data.ln)
    }
    if (this.data?.cl) {
      this.layerElement?.setAttribute('class', this.data.cl)
    }
    if (this.data?.bm !== 0) {
      this.setBlendMode()
    }
  }

  createRenderableComponents() {
    if (!this.data || !this.globalData) {
      throw new Error(`${this.constructor.name}: data or globalData is not implemented`)
    }
    this.maskManager = new MaskElement(
      this.data, this as unknown as ElementInterfaceIntersect, this.globalData
    )
  }

  destroy() {
    this.layerElement = null as unknown as SVGGElement
    this.transformedElement = null as unknown as SVGGElement
    if (this.matteElement) {
      this.matteElement = null as unknown as SVGGElement
    }
    if (this.maskManager) {
      this.maskManager.destroy()
      this.maskManager = null as unknown as MaskElement
    }
  }

  destroyBaseElement() {
    throw new Error(`${this.constructor.name}: Method destroyBaseElement is not implemented`)
  }

  getBaseElement(): null | HTMLElement | SVGGElement {
    throw new Error(`${this.constructor.name}: Method getBaseElement is not implemented`)
  }

  initRendererElement() {
    this.baseElement = createTag(this.data?.tg || 'div')
    if (this.data?.hasMask) {
      this.svgElement = createNS('svg')
      this.layerElement = createNS<SVGGElement>('g')
      this.maskedElement = this.layerElement
      this.svgElement.appendChild(this.layerElement)
      this.baseElement.appendChild(this.svgElement)
    } else {
      this.layerElement = this.baseElement
    }
    styleDiv(this.baseElement)
  }

  renderElement() {
    const transformedElementStyle = this.transformedElement
      ? this.transformedElement.style
      : ({} as CSSStyleDeclaration)

    if (this.finalTransform?._matMdf) {
      const matrixValue = this.finalTransform.mat.toCSS()

      transformedElementStyle.transform = matrixValue
    }
    if (this.finalTransform?._opMdf) {
      transformedElementStyle.opacity = `${this.finalTransform.mProp.o?.v}`
    }
  }

  renderFrame(_val?: number) {
    // If it is exported as hidden (data.hd === true) no need to render
    // If it is not visible no need to render
    if (this.data?.hd || this.hidden) {
      return
    }
    this.renderTransform()
    this.renderRenderable()
    this.renderElement()
    this.renderInnerContent()
    if (this._isFirstFrame) {
      this._isFirstFrame = false
    }
  }

  renderInnerContent() {
    throw new Error(`${this.constructor.name}: Method renderInnerContent is not implemented`)
  }

  renderRenderable() {
    throw new Error(`${this.constructor.name}: Method renderRenderable is not implemented`)
  }

  renderTransform() {
    throw new Error(`${this.constructor.name}: Method renderTransform is not implemented`)
  }

  setBlendMode() {
    throw new Error(`${this.constructor.name}: Method setBlendMode is not implemented`)
  }

  setMatte() {
    // TODO: Pass Through
  }
}
