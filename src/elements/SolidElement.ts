import type {
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
} from '@/types'

import { ImageElement } from '@/elements/ImageElement'
import { createNS } from '@/utils/helpers/svgElements'

export class SolidElement extends ImageElement {
  constructor(
    data: LottieLayer,
    globalData: GlobalData,
    comp: ElementInterfaceIntersect
  ) {
    super(
      data, globalData, comp
    )
    this.initElement(
      data, globalData, comp
    )
  }

  override createContent() {
    if (!this.data) {
      throw new Error(`${this.constructor.name}: data (LottieLayer) is not implemented`)
    }
    const rect = createNS<SVGRectElement>('rect')

    rect.width.baseVal.value = this.data.sw || 0
    rect.height.baseVal.value = this.data.sh || 0
    if (this.data.sc) {
      rect.setAttribute('fill', this.data.sc)
    }
    this.layerElement?.appendChild(rect)
  }
}
