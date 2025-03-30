import type { DocumentData, LottieAsset, LottieLayer } from '@/types'

export default class SlotManager {
  animationData: LottieLayer
  constructor(animationData: LottieLayer) {
    this.animationData = animationData
  }
  getProp(data: DocumentData | LottieLayer | LottieAsset) {
    if (
      (data as LottieAsset).sid &&
      this.animationData.slots &&
      this.animationData.slots[(data as LottieAsset).sid!]
    ) {
      return Object.assign(
        data,
        this.animationData.slots[(data as LottieAsset).sid!].p
      )
    }
    return data
  }
}
