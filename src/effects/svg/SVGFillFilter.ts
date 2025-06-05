import type GroupEffect from '@/effects/GroupEffect'
import type { ElementInterfaceIntersect, Vector3 } from '@/types'

import createNS from '@/utils/helpers/svgElements'

export default class SVGFillFilter {
  filterManager: GroupEffect
  matrixFilter: SVGFEColorMatrixElement
  constructor(
    filter: SVGFilterElement,
    filterManager: GroupEffect,
    _elem: ElementInterfaceIntersect,
    id: string
  ) {
    this.filterManager = filterManager
    const feColorMatrix = createNS<SVGFEColorMatrixElement>('feColorMatrix')

    feColorMatrix.setAttribute('type', 'matrix')
    feColorMatrix.setAttribute('color-interpolation-filters', 'sRGB')
    feColorMatrix.setAttribute('values',
      '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0')
    feColorMatrix.setAttribute('result', id)
    filter.appendChild(feColorMatrix)
    this.matrixFilter = feColorMatrix
  }

  renderFrame(forceRender?: boolean) {
    if (
      !forceRender && !this.filterManager._mdf
    ) {
      return
    }
    const color = this.filterManager.effectElements[2].p.v as Vector3
    const opacity = this.filterManager.effectElements[6].p.v as number

    this.matrixFilter.setAttribute('values',
      `0 0 0 0 ${color[0]} 0 0 0 0 ${color[1]} 0 0 0 0 ${color[2]} 0 0 0 ${
        opacity
      } 0`)
  }
}
