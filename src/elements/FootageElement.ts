import type {
  ElementInterfaceIntersect,
  GlobalData,
  LottieAsset,
  LottieLayer,
} from '@/types'

import RenderableElement from '@/elements/helpers/RenderableElement'
import { getExpressionInterfaces } from '@/utils/getterSetter'
export default class FootageElement extends RenderableElement {
  assetData: null | LottieAsset = null
  footageData: SVGElement
  constructor(
    data: LottieLayer,
    globalData: GlobalData,
    comp: ElementInterfaceIntersect
  ) {
    super()
    this.initFrame()
    this.initRenderable()
    if (data.refId && globalData?.getAssetData) {
      this.assetData = globalData.getAssetData(data.refId)
    }
    this.footageData = globalData?.imageLoader.getAsset(this.assetData)
    this.initBaseData(data, globalData, comp)
  }

  getBaseElement(): SVGGElement | null {
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
    const FootageInterface = new expressionsInterfaces('footage')
    this.layerInterface = (FootageInterface as any)(this)
  }

  setMatte(_id: string) {
    throw new Error(
      `${this.constructor.name}: Method setMatte is not implemented`
    )
  }
}
