import type {
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
} from '@/types'

import FrameElement from '@/elements/helpers/FrameElement'
export default class NullElement extends FrameElement {
  constructor(
    data: LottieLayer,
    globalData: GlobalData,
    comp: ElementInterfaceIntersect
  ) {
    super()
    this.initFrame()
    this.initBaseData(data, globalData, comp)
    this.initTransform()
    this.initHierarchy()
  }

  destroy() {
    // Pass Through
  }

  getBaseElement(): SVGGElement | null {
    return null
  }

  hide() {
    // Pass Through
  }

  prepareFrame(num: number) {
    this.prepareProperties(num, true)
  }

  renderFrame(_frame?: number | null) {
    // Pass Through
  }
  sourceRectAtTime() {
    // Pass Through
  }
}
