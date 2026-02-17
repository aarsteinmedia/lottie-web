import type {
  ElementInterfaceIntersect,
  LottieLayer,
} from '@/types'

import { HCompElement } from '@/elements/html/HCompElement'
import { SVGCompElement } from '@/elements/svg/SVGCompElement'
import { HybridRendererBase } from '@/renderers/HybridRendererBase'

export class HybridRenderer extends HybridRendererBase {
  override createComp(data: LottieLayer) {
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: globalData is not implemented`)
    }
    if (!this.supports3d) {
      return new SVGCompElement(
        data,
        this.globalData,
        this as unknown as ElementInterfaceIntersect
      )
    }

    return new HCompElement(
      data,
      this.globalData,
      this as unknown as ElementInterfaceIntersect
    )
  }
}
