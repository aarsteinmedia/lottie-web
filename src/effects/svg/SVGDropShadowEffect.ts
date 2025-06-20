import type GroupEffect from '@/effects/GroupEffect'
import type {
  ElementInterfaceIntersect,
  SVGRendererConfig,
  Vector3,
} from '@/types'

import SVGComposableEffect from '@/effects/svg/SVGComposableEffect'
import { rgbToHex } from '@/utils'
import { degToRads } from '@/utils/helpers/constants'
import createNS from '@/utils/helpers/svgElements'

export default class SVGDropShadowEffect extends SVGComposableEffect {
  feFlood: SVGFEFloodElement
  feGaussianBlur: SVGFEGaussianBlurElement
  feOffset: SVGFEOffsetElement
  filterManager: GroupEffect
  constructor(
    filter: SVGFilterElement,
    filterManager: GroupEffect,
    _elem: ElementInterfaceIntersect,
    id: string,
    source: string
  ) {
    super()
    const globalFilterSize = (
      filterManager.container?.globalData?.renderConfig as SVGRendererConfig
    ).filterSize
    const filterSize = filterManager.data?.fs ??
      globalFilterSize ?? {
      height: '100%',
      width: '100%',
      x: '0%',
      y: '0%',
    }

    filter.setAttribute('x', filterSize.x)
    filter.setAttribute('y', filterSize.y)
    filter.setAttribute('width', filterSize.width)
    filter.setAttribute('height', filterSize.height)
    this.filterManager = filterManager

    const feGaussianBlur = createNS<SVGFEGaussianBlurElement>('feGaussianBlur')

    feGaussianBlur.setAttribute('in', 'SourceAlpha')
    feGaussianBlur.setAttribute('result', `${id}_drop_shadow_1`)
    feGaussianBlur.setAttribute('stdDeviation', '0')
    this.feGaussianBlur = feGaussianBlur
    filter.appendChild(feGaussianBlur)

    const feOffset = createNS<SVGFEOffsetElement>('feOffset')

    feOffset.dx.baseVal = 25
    feOffset.dy.baseVal = 0
    feOffset.setAttribute('in', `${id}_drop_shadow_1`)
    feOffset.setAttribute('result', `${id}_drop_shadow_2`)
    this.feOffset = feOffset
    filter.appendChild(feOffset)
    const feFlood = createNS<SVGFEFloodElement>('feFlood')

    feFlood.setAttribute('flood-color', '#00ff00')
    feFlood.setAttribute('flood-opacity', '1')
    feFlood.setAttribute('result', `${id}_drop_shadow_3`)
    this.feFlood = feFlood
    filter.appendChild(feFlood)

    const feComposite = createNS<SVGFECompositeElement>('feComposite')

    feComposite.setAttribute('in', `${id}_drop_shadow_3`)
    feComposite.in2.baseVal = `${id}_drop_shadow_2`
    feComposite.setAttribute('operator', 'in')
    feComposite.result.baseVal = `${id}_drop_shadow_4`
    filter.appendChild(feComposite)

    const feMerge = this.createMergeNode(id, [`${id}_drop_shadow_4`, source])

    filter.appendChild(feMerge)
  }

  renderFrame(forceRender?: boolean) {
    if (
      !forceRender && !this.filterManager._mdf
    ) {
      return
    }
    if (forceRender || this.filterManager.effectElements[4].p._mdf) {
      const stdDeviation = (this.filterManager.effectElements[4].p.v as number) / 4

      this.feGaussianBlur.setStdDeviation(stdDeviation, stdDeviation)

    }
    if (forceRender || this.filterManager.effectElements[0].p._mdf) {
      const col = this.filterManager.effectElements[0].p.v as Vector3

      this.feFlood.setAttribute('flood-color',
        rgbToHex(
          Math.round(col[0] * 255),
          Math.round(col[1] * 255),
          Math.round(col[2] * 255)
        ))
    }
    if (forceRender || this.filterManager.effectElements[1].p._mdf) {
      this.feFlood.setAttribute('flood-opacity',
        `${(this.filterManager.effectElements[1].p.v as number) / 255}`)
    }
    if (
      forceRender ||
      this.filterManager.effectElements[2].p._mdf ||
      this.filterManager.effectElements[3].p._mdf
    ) {
      const distance = this.filterManager.effectElements[3].p.v as number
      const angle =
        ((this.filterManager.effectElements[2].p.v as number) - 90) * degToRads
      const x = distance * Math.cos(angle)
      const y = distance * Math.sin(angle)

      this.feOffset.dx.baseVal = x
      this.feOffset.dy.baseVal = y
    }
  }
}
