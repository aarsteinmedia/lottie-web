import type {
  CompElementInterface,
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
} from '@/types'
import type ValueProperty from '@/utils/properties/ValueProperty'

import RenderableDOMElement from '@/elements/helpers/RenderableDOMElement'

export default abstract class CompElement extends RenderableDOMElement {
  completeLayers?: boolean
  currentFrame = 0
  elements: ElementInterfaceIntersect[] = []
  layers: LottieLayer[] = []
  renderedFrame?: number
  tm?: ValueProperty

  override destroy() {
    this.destroyElements()
    this.destroyBaseElement()
  }

  destroyElements() {
    const { length } = this.layers

    for (let i = 0; i < length; i++) {
      this.elements[i]?.destroy()
    }
  }

  getElements(): ElementInterfaceIntersect[] | undefined {
    return this.elements
  }


  override initElement(
    data: LottieLayer,
    globalData: GlobalData,
    comp: CompElementInterface
  ) {
    this.initFrame()
    this.initBaseData(
      data, globalData, comp
    )
    this.initTransform()
    this.initRenderable()
    this.initHierarchy()
    this.initRendererElement()
    this.createContainerElements()
    this.createRenderableComponents()
    if (!this.data) {
      throw new Error(`${this.constructor.name}: data (LottieLayer) is not implemented`)
    }
    if (this.data.xt || !globalData.progressiveLoad) {
      this.buildAllItems()
    }
    this.hide()
  }

  override prepareFrame(val: number) {
    if (!this.data) {
      throw new Error(`${this.constructor.name}: data (LottieLayer) is not implemented`)
    }

    this._mdf = false
    this.prepareRenderableFrame(val)
    this.prepareProperties(val, this.isInRange)
    if (!this.isInRange && !this.data.xt) {
      return
    }

    if (this.tm?._placeholder) {
      this.renderedFrame = val / Number(this.data.sr)
    } else {
      let timeRemapped = this.tm?.v || 0

      if (timeRemapped === this.data.op) {
        timeRemapped = this.data.op - 1
      }
      this.renderedFrame = timeRemapped
    }
    const { length } = this.elements

    if (!this.completeLayers) {
      // if (!this.checkLayers) {
      //   throw new Error(`${this.constructor.name}: Method checkLayers is not implemented`)
      // }
      this.checkLayers(this.renderedFrame)
    }
    // This iteration needs to be backwards because of how expressions connect between each other
    for (let i = length - 1; i >= 0; i--) {
      if (this.completeLayers || this.elements[i]) {
        this.elements[i]?.prepareFrame(this.renderedFrame - this.layers[i].st)
        if (this.elements[i]?._mdf) {
          this._mdf = true
        }
      }
    }
  }

  override renderInnerContent() {
    const { length } = this.layers

    for (let i = 0; i < length; i++) {
      if (this.completeLayers || this.elements[i]) {
        this.elements[i]?.renderFrame()
      }
    }
  }

  setElements(elems: ElementInterfaceIntersect[]) {
    this.elements = elems
  }
}