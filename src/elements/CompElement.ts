import type {
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
} from '@/types'

import FrameElement from '@/elements/helpers/FrameElement'
import RenderableElement from '@/elements/helpers/RenderableElement'
import SVGBaseElement from '@/elements/svg/SVGBaseElement'
// import FrameElement from '@/elements/helpers/FrameElement'
// import HierarchyElement from '@/elements/helpers/HierarchyElement'
// import RenderableDOMElement from '@/elements/helpers/RenderableDOMElement'
// import TransformElement from '@/elements/helpers/TransformElement'
// import { extendPrototype } from '@/utils/functionExtensions'
import { ValueProperty } from '@/utils/Properties'

export default class CompElement extends FrameElement {
  completeLayers?: boolean

  elements?: ElementInterfaceIntersect[]

  isInRange?: boolean
  layers?: LottieLayer[]

  renderedFrame?: number

  tm?: ValueProperty

  constructor() {
    super()
    const {
      createContainerElements,
      createRenderableComponents,
      initRendererElement,
    } = new SVGBaseElement()
    this.initRendererElement = initRendererElement
    this.createContainerElements = createContainerElements
    this.createRenderableComponents = createRenderableComponents
    const { prepareRenderableFrame } = new RenderableElement()
    this.prepareRenderableFrame = prepareRenderableFrame
  }

  buildAllItems() {
    throw new Error(
      `${this.constructor.name}: Method buildAllItems not implemented`
    )
  }

  checkLayerLimits(_num: number) {
    throw new Error(
      `${this.constructor.name}: Method checkLayerLimits not implemented`
    )
  }

  checkLayers(_frame: number) {
    throw new Error(
      `${this.constructor.name}: Method checkLayers not implemented`
    )
  }

  createContainerElements() {
    throw new Error(
      `${this.constructor.name}: Method createContainerElements not implemented`
    )
  }

  createRenderableComponents(_data: LottieLayer, _globalData: GlobalData) {
    throw new Error(
      `${this.constructor.name}: Method createRenderableComponents not implemented`
    )
  }
  destroy() {
    this.destroyElements()
    this.destroyBaseElement()
  }

  destroyBaseElement() {
    throw new Error(
      `${this.constructor.name}: Method destroyBaseElement not implemented`
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

  // prepareFrame(_val: number) {
  //   throw new Error('CompElement: Method prepareFrame not implemented')
  // }

  getElements(): ElementInterfaceIntersect[] | undefined {
    return this.elements
  }

  hide() {
    throw new Error(`${this.constructor.name}: Method hide not implemented`)
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
    this.createRenderableComponents(data, globalData)
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

  initRendererElement() {
    throw new Error(
      `${this.constructor.name}: Method initRendererElement not implemented`
    )
  }

  prepareFrame(val: number) {
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
  prepareRenderableFrame(_val: number, _?: boolean) {
    throw new Error(
      `${this.constructor.name}: Method prepareRenderableFrame not implemented`
    )
  }

  renderInnerContent() {
    const { length } = this.layers || []
    for (let i = 0; i < length; i++) {
      if (this.completeLayers || this.elements?.[i]) {
        this.elements?.[i].renderFrame()
      }
    }
  }

  setElements(elems: ElementInterfaceIntersect[]) {
    this.elements = elems
  }
}

// extendPrototype(
//   [TransformElement, HierarchyElement, FrameElement, RenderableDOMElement],
//   CompElement
// )
