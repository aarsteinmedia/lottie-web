import type { GroupEffect } from '@/effects/GroupEffect'
import type { ElementInterfaceIntersect } from '@/types'

import { BlurDirection } from '@/utils/enums'
import { createNS } from '@/utils/helpers/svgElements'

export class SVGGaussianBlurEffect {
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
      !forceRender && !this.filterManager._mdf
    ) {
      return
    }
    // Empirical value, matching AE's blur appearance.
    const kBlurrinessToSigma = 0.3,
      sigma =
        (this.filterManager.effectElements[0]?.p.v as number) *
        kBlurrinessToSigma,
      // Dimensions mapping:
      dimensions = Number(this.filterManager.effectElements[1]?.p.v) as unknown as BlurDirection,
      sigmaX = dimensions === BlurDirection.Vertical ? 0 : sigma,
      sigmaY = dimensions === BlurDirection.Horizontal ? 0 : sigma


    this.feGaussianBlur.setAttribute('stdDeviation', `${sigmaX} ${sigmaY}`)

    // Repeat edges mapping:
    //
    //   0 -> off -> duplicate
    //   1 -> on  -> wrap
    const edgeMode =
      Number(this.filterManager.effectElements[2]?.p.v) === 1
        ? 'wrap'
        : 'duplicate'

    this.feGaussianBlur.setAttribute('edgeMode', edgeMode)
  }
}
