/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import type { CanvasRenderer } from '@/renderers/CanvasRenderer'
import type {
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
} from '@/types'

import { CVBaseElement } from '@/elements/canvas/CVBaseElement'
import { ImageElement } from '@/elements/ImageElement'
import { SVGShapeElement } from '@/elements/svg/SVGShapeElement'
import { mixin } from '@/utils/functionExtensions'

const svgShapeMethods = ['initElement'] as const satisfies readonly (keyof SVGShapeElement)[],
  imageMethods = ['prepareFrame'] as const satisfies readonly (keyof ImageElement)[]

export interface CVSolidElement
  extends Pick<SVGShapeElement, typeof svgShapeMethods[number]>,
  Pick<ImageElement, typeof imageMethods[number]> {}

export class CVSolidElement extends CVBaseElement {

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

  override renderInnerContent() {
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


mixin(
  CVSolidElement, SVGShapeElement, svgShapeMethods
)

mixin(
  CVSolidElement, ImageElement, imageMethods
)