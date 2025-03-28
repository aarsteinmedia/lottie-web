import type {
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
} from '@/types'

import FrameElement from '@/elements/helpers/FrameElement'
import HierarchyElement from '@/elements/helpers/HierarchyElement'
import RenderableDOMElement from '@/elements/helpers/RenderableDOMElement'
import TransformElement from '@/elements/helpers/TransformElement'
import BaseRenderer from '@/renderers/BaseRenderer'
// import SVGRendererBase from '@/renderers/SVGRendererBase'
import { extendPrototype } from '@/utils/functionExtensions'
import { ValueProperty } from '@/utils/Properties'

export default class CompElement extends BaseRenderer {
  // _mdf?: boolean
  createContainerElements: any
  createRenderableComponents: any
  initRendererElement: any
  isInRange?: boolean

  renderedFrame?: number
  tm?: ValueProperty

  // constructor() {
  //   super()
  //   this.initHierarchy = new HierarchyElement().initHierarchy
  // }

  destroy() {
    this.destroyElements()
    this.destroyBaseElement()
  }
  destroyBaseElement() {
    throw new Error(
      `${this.constructor.name}: Method destroyBaseElement is not implemented`
    )
  }
  destroyElements() {
    const { length } = this.layers || []
    for (let i = 0; i < length; i++) {
      if (this.elements?.[i]) {
        this.elements[i].destroy()
      }
    }
  }
  getElements(): ElementInterfaceIntersect[] | undefined {
    return this.elements
  }

  hide() {
    throw new Error(`${this.constructor.name}: Method hide is not implemented`)
  }

  initElement(
    data: LottieLayer,
    globalData: GlobalData,
    comp: ElementInterfaceIntersect
  ) {
    this.initFrame()
    this.initBaseData(data, globalData, comp)
    this.initTransform()
    this.initRenderable()
    this.initHierarchy()
    this.initRendererElement()
    this.createContainerElements()
    this.createRenderableComponents()
    if (this.data?.xt || !globalData.progressiveLoad) {
      this.buildAllItems()
    }
    this.hide()
  }

  initRenderable() {
    throw new Error(
      `${this.constructor.name}: Method initRenderable not implemented`
    )
  }

  prepareFrame(_val: number) {
    throw new Error(
      `${this.constructor.name}: Method prepareFrame not implemented`
    )
  }

  prepareRenderableFrame(_val: number, _?: boolean) {
    throw new Error(
      `${this.constructor.name}: Method prepareRenderableFrame not implemented`
    )
  }

  renderInnerContent() {
    throw new Error(
      `${this.constructor.name}: Method renderInnerContent not implemented`
    )
  }

  setElements(elems: ElementInterfaceIntersect[]) {
    this.elements = elems
  }
}

extendPrototype(
  [TransformElement, HierarchyElement, FrameElement, RenderableDOMElement],
  CompElement
)

CompElement.prototype.prepareFrame = function (val: number) {
  this._mdf = false
  this.prepareRenderableFrame(val)
  this.prepareProperties(val, this.isInRange)
  if (!this.isInRange && !this.data?.xt) {
    return
  }

  if (this.tm?._placeholder) {
    this.renderedFrame = val / Number(this.data?.sr)
  } else {
    let timeRemapped = this.tm?.v
    if (timeRemapped === this.data?.op) {
      timeRemapped = Number(this.data?.op) - 1
    }
    this.renderedFrame = Number(timeRemapped)
  }
  const { length } = this.elements || []
  if (!this.completeLayers) {
    if (!this.checkLayers) {
      throw new Error(
        `${this.constructor.name}: Method checkLayers is not implemented`
      )
    }
    this.checkLayers(this.renderedFrame)
  }
  // This iteration needs to be backwards because of how expressions connect between each other
  for (let i = length - 1; i >= 0; i--) {
    if (this.completeLayers || this.elements?.[i]) {
      this.elements?.[i].prepareFrame?.(
        this.renderedFrame - Number(this.layers?.[i].st)
      )
      if (this.elements?.[i]._mdf) {
        this._mdf = true
      }
    }
  }
}

CompElement.prototype.renderInnerContent = function () {
  const { length } = this.layers || []
  for (let i = 0; i < length; i++) {
    if (this.completeLayers || this.elements?.[i]) {
      this.elements?.[i].renderFrame()
    }
  }
}
