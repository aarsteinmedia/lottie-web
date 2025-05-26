import type CanvasRenderer from '@/renderers/CanvasRenderer'
import type {
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
} from '@/types'

import RenderableElement from '@/elements/helpers/RenderableElement'
import ImageElement from '@/elements/ImageElement'
import SVGShapeElement from '@/elements/svg/SVGShapeElement'

export default class CVSolidElement extends RenderableElement {
  initElement = SVGShapeElement.prototype.initElement
  prepareFrame = ImageElement.prototype.prepareFrame

  constructor(
    data: LottieLayer,
    globalData: GlobalData,
    comp: ElementInterfaceIntersect
  ) {
    super()
    this.initElement(
      data, globalData, comp
    )
  }

  renderInnerContent() {
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData it not implemented`)
    }
    if (!this.data) {
      throw new Error(`${this.constructor.name}: data (LottieLayer) it not implemented`)
    }
    if (!this.globalData.renderer) {
      throw new Error(`${this.constructor.name}: globalData.renderer it not implemented`)
    }

    // var ctx = this.canvasContext;
    ; (this.globalData.renderer as CanvasRenderer).ctxFillStyle(this.data.sc)
    // ctx.fillStyle = this.data.sc;
    ; (this.globalData.renderer as CanvasRenderer).ctxFillRect(
      0,
      0,
      this.data.sw || 0,
      this.data.sh || 0
    )
    // ctx.fillRect(0, 0, this.data.sw, this.data.sh);
    //
  }
}
// extendPrototype([BaseElement, TransformElement, CVBaseElement, HierarchyElement, FrameElement, RenderableElement], CVSolidElement);
