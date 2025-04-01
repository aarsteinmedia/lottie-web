import type {
  AnimatedProperty,
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
} from '@/types'

import CVBaseElement from '@/elements/canvas/CVBaseElement'
import CompElement from '@/elements/CompElement'
import { createSizedArray } from '@/utils/helpers/arrays'
import { ValueProperty } from '@/utils/Properties'
import PropertyFactory from '@/utils/PropertyFactory'

import CanvasRendererBase from '../../renderers/CanvasRendererBase'

// extendPrototype([CanvasRendererBase, CompElement, CVBaseElement], CVCompElement)

export default class CVCompElement extends CVBaseElement {
  completeLayers: boolean
  elements: ElementInterfaceIntersect[]
  layers: LottieLayer[]
  pendingElements: ElementInterfaceIntersect[]
  tm?: ValueProperty
  constructor(
    data: LottieLayer,
    globalData: GlobalData,
    comp: ElementInterfaceIntersect
  ) {
    super()
    this.completeLayers = false
    this.layers = data.layers || []
    this.pendingElements = []
    this.elements = createSizedArray(this.layers.length)
    this.initElement(data, globalData, comp)
    this.tm = (
      data.tm
        ? PropertyFactory(this, data.tm, 0, globalData.frameRate, this)
        : { _placeholder: true }
    ) as ValueProperty
  }

  createComp(data: LottieLayer) {
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData is not implemented`)
    }
    return new CVCompElement(
      data,
      this.globalData,
      this as unknown as ElementInterfaceIntersect
    )
  }

  override destroy() {
    let i
    const len = this.layers.length
    for (i = len - 1; i >= 0; i -= 1) {
      if (this.elements[i]) {
        this.elements[i].destroy()
      }
    }
    this.layers = null as unknown as LottieLayer[]
    this.elements = null as unknown as ElementInterfaceIntersect[]
  }

  renderInnerContent() {
    const ctx = this.canvasContext
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(this.data.w, 0)
    ctx.lineTo(this.data.w, this.data.h)
    ctx.lineTo(0, this.data.h)
    ctx.lineTo(0, 0)
    ctx.clip()
    const { length } = this.layers
    for (let i = length - 1; i >= 0; i--) {
      if (this.completeLayers || this.elements[i]) {
        this.elements[i].renderFrame()
      }
    }
  }
}
