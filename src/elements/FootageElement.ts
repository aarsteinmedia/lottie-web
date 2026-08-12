import type {
  ElementInterfaceIntersect,
  GlobalData,
  LottieAsset,
  LottieLayer,
} from '@/types'
import type { FootageInterface } from '@/utils/expressions/FootageInterface'
import type { LayerExpressionInterface } from '@/utils/expressions/LayerInterface'

import { RenderableElement } from '@/elements/helpers/RenderableElement'
import { getExpressionInterfaces } from '@/utils/expressions'

export class FootageElement extends RenderableElement {
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
      this.assetData = globalData.getAssetData(data.refId) ?? null
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

    const Footage = expressionsInterfaces('footage') as typeof FootageInterface

    // Footage layers expose FootageInterface via layerInterface (same slot as LayerExpressionInterface).
    this.layerInterface = new Footage(this) as unknown as LayerExpressionInterface
  }

  prepareFrame() {
    /* Pass Through*/
  }

  renderFrame() {
    /* Pass Through*/
  }
}
