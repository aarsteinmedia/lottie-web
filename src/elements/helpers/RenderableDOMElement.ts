import type {
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
} from '@/types'

import CompElement from '@/elements/CompElement'
import RenderableElement from '@/elements/helpers/RenderableElement'
import SVGBaseElement from '@/elements/svg/SVGBaseElement'
// import TransformElement from './TransformElement'
// import { extendPrototype } from '@/utils/functionExtensions'

export default class RenderableDOMElement extends RenderableElement {
  innerElem?: SVGElement | null

  constructor() {
    super()
    this.renderInnerContent = new CompElement().renderInnerContent
    const {
      createContainerElements,
      createRenderableComponents,
      initRendererElement,
      renderElement,
    } = new SVGBaseElement()
    this.renderElement = renderElement
    this.initRendererElement = initRendererElement
    this.createContainerElements = createContainerElements
    this.createRenderableComponents = createRenderableComponents

    // this.renderFrame = this.renderFrame.bind(this)
  }

  createContainerElements() {
    throw new Error(
      'RenderableDOMElement: Method createContainerElements in not implemented'
    )
  }

  createContent() {
    throw new Error(
      'RenderableDOMElement: Method createContent in not implemented'
    )
  }

  createRenderableComponents(_data: LottieLayer, _globalData: GlobalData) {
    throw new Error(
      'RenderableDOMElement: Method createRenderableComponents in not implemented'
    )
  }
  destroy() {
    this.innerElem = null
    this.destroyBaseElement()
  }
  destroyBaseElement() {
    throw new Error(
      'RenderableDOMElement: Method destroyBaseElement in not implemented'
    )
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
    this.createRenderableComponents(data, globalData)
    this.createContent()
    this.hide()
  }
  initRendererElement() {
    throw new Error(
      'RenderableDOMElement: Method initRendererElement in not implemented'
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
      'RenderableDOMElement: Method renderElement is not implemented'
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
    this.renderElement()
    this.renderInnerContent()
    if (this._isFirstFrame) {
      this._isFirstFrame = false
    }
  }

  renderInnerContent() {
    throw new Error(
      'RenderableDOMElement: Method renderInnerContent is not implemented'
    )
  }
}

// TODO: TextElement needs this mixin

// extendPrototype([RenderableElement], RenderableDOMElement)
