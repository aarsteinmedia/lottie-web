import type {
  ElementInterfaceIntersect,
  GlobalData,
  LottieAsset,
  LottieLayer,
} from '@/types'

import RenderableElement from '@/elements/helpers/RenderableElement'
import { getExpressionInterfaces } from '@/utils/BMMath'

export default class FootageElement extends RenderableElement {
  assetData: null | LottieAsset = null
  footageData: null | SVGElement
  constructor(
    data: LottieLayer,
    globalData: GlobalData,
    comp: ElementInterfaceIntersect
  ) {
    super()
    this.initFrame()
    this.initRenderable()
    if (data.refId) {
      this.assetData = globalData.getAssetData(data.refId)
    }
    if (!globalData.imageLoader) {
      throw new Error(`${this.constructor.name}: imageLoader is not implemented in globalData`)
    }
    this.footageData = globalData.imageLoader.getAsset(this.assetData) as SVGElement
    this.initBaseData(
      data, globalData, comp
    )
  }

  override getBaseElement() {
    return null
  }

  getFootageData() {
    return this.footageData
  }

  override initExpressions() {
    const expressionsInterfaces = getExpressionInterfaces()

    if (!expressionsInterfaces) {
      return
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const FootageInterface = new expressionsInterfaces('footage')

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.layerInterface = new FootageInterface(this)
  }

  prepareFrame() {
    /* Pass Through*/
  }

  renderFrame() {
    /* Pass Through*/
  }
}