import type {
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
} from '@/types'

import RenderableDOMElement from '@/elements/helpers/RenderableDOMElement'
import HBaseElement from '@/elements/html/HBaseElement'
import createTag from '@/utils/helpers/htmlElements'
import createNS from '@/utils/helpers/svgElements'

export default class HSolidElement extends RenderableDOMElement {
  svgElement?: SVGSVGElement

  constructor(
    data: LottieLayer,
    globalData: GlobalData,
    comp: ElementInterfaceIntersect
  ) {
    super()

    const {
      addEffects,
      checkBlendMode,
      // createContainerElements,
      // createRenderableComponents,
      // destroy,
      // initRendererElement,
      // renderFrame,
      setMatte,
    } = HBaseElement.prototype

    this.addEffects = addEffects
    this.checkBlendMode = checkBlendMode
    // this.createContainerElements = createContainerElements
    // this.createRenderableComponents = createRenderableComponents
    // this.destroy = destroy
    // this.initRendererElement = initRendererElement
    // this.renderFrame = renderFrame
    this.setMatte = setMatte
    this.initElement(
      data, globalData, comp
    )
  }

  addEffects() {
    throw new Error(`${this.constructor.name}: Method addEffects is not implemented`)
  }

  checkBlendMode() {
    throw new Error(`${this.constructor.name}: Method checkBlendMode is not implemented`)
  }

  override createContent() {
    if (!this.data) {
      throw new Error(`${this.constructor.name}: data (LottierLayer) is not implemented`)
    }

    let rect

    if (this.data.hasMask) {
      rect = createNS<SVGRectElement>('rect')
      rect.setAttribute('width', `${this.data.sw}`)
      rect.setAttribute('height', `${this.data.sh}`)
      rect.setAttribute('fill', `${this.data.sc}`)
      this.svgElement?.setAttribute('width', `${this.data.sw}`)
      this.svgElement?.setAttribute('height', `${this.data.sh}`)
    } else {
      rect = createTag<HTMLDivElement>('div')
      rect.style.width = `${this.data.sw}px`
      rect.style.height = `${this.data.sh}px`
      if (this.data.sc) {
        rect.style.backgroundColor = this.data.sc
      }
    }
    this.layerElement?.appendChild(rect)
  }

  setMatte() {
    throw new Error(`${this.constructor.name}: Method setMatte is not implemented`)
  }
}
