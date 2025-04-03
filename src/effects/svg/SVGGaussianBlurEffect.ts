import type { GroupEffect } from '@/effects/EffectsManager'
import type { ElementInterfaceIntersect } from '@/types'

import { createNS } from '@/utils'

export default class SVGGaussianBlurEffect {
  feGaussianBlur: SVGFEGaussianBlurElement
  filterManager: GroupEffect
  constructor(
    filter: SVGFilterElement,
    filterManager: GroupEffect,
    _elem: ElementInterfaceIntersect,
    id: string
  ) {
    // Outset the filter region by 100% on all sides to accommodate blur expansion.
    filter.setAttribute('x', '-100%')
    filter.setAttribute('y', '-100%')
    filter.setAttribute('width', '300%')
    filter.setAttribute('height', '300%')

    this.filterManager = filterManager
    const feGaussianBlur = createNS<SVGFEGaussianBlurElement>('feGaussianBlur')
    feGaussianBlur.setAttribute('result', id)
    filter.appendChild(feGaussianBlur)
    this.feGaussianBlur = feGaussianBlur
  }

  renderFrame(forceRender?: boolean) {
    if (
      (!forceRender && !this.filterManager._mdf) ||
      !this.filterManager.effectElements
    ) {
      return
    }
    // Empirical value, matching AE's blur appearance.
    const kBlurrinessToSigma = 0.3,
      sigma =
        (this.filterManager.effectElements[0].p.v as number) *
        kBlurrinessToSigma,
      // Dimensions mapping:
      //
      //   1 -> horizontal & vertical
      //   2 -> horizontal only
      //   3 -> vertical only
      //
      dimensions = Number(this.filterManager.effectElements[1].p.v),
      sigmaX = dimensions === 3 ? 0 : sigma,
      sigmaY = dimensions === 2 ? 0 : sigma

    this.feGaussianBlur.setAttribute('stdDeviation', `${sigmaX} ${sigmaY}`)

    // Repeat edges mapping:
    //
    //   0 -> off -> duplicate
    //   1 -> on  -> wrap
    const edgeMode =
      Number(this.filterManager.effectElements[2].p.v) === 1
        ? 'wrap'
        : 'duplicate'
    this.feGaussianBlur.setAttribute('edgeMode', edgeMode)
  }
}
