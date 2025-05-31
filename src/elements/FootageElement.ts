import type {
  ElementInterfaceIntersect,
  GlobalData,
  LottieAsset,
  LottieLayer,
} from '@/types'

import RenderableElement from '@/elements/helpers/RenderableElement'
import { getExpressionInterfaces } from '@/utils/expressions'

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

    const footageInterface = expressionsInterfaces('footage')

    // @ts-expect-error TODO: see if typing can be stronger
    this.layerInterface = new footageInterface(this)
  }

  prepareFrame() {
    /* Pass Through*/
  }

  renderFrame() {
    /* Pass Through*/
  }
}