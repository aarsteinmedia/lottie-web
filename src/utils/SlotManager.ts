import type {
  DocumentData, LottieAsset, LottieLayer
} from '@/types'

export class SlotManager {
  animationData: LottieLayer
  constructor(animationData: LottieLayer) {
    this.animationData = animationData
  }

  getProp(data: DocumentData | LottieLayer | LottieAsset) {
    const { sid } = data as LottieAsset

    if (
      sid &&
      this.animationData.slots?.[sid]
    ) {

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return Object.assign(data,
        this.animationData.slots[sid].p)
    }

    return data
  }
}

export default function slotFactory(animationData: LottieLayer) {
  return new SlotManager(animationData)
}