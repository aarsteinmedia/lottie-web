import type GroupEffect from '@/effects/GroupEffect'
import type { ElementInterfaceIntersect, Vector3 } from '@/types'

import SVGComposableEffect from '@/effects/svg/SVGComposableEffect'
import createNS from '@/utils/helpers/svgElements'

const linearFilterValue =
  '0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0'

export default class SVGTintFilter extends SVGComposableEffect {
  filterManager: GroupEffect
  linearFilter: SVGFEColorMatrixElement
  matrixFilter: SVGFEColorMatrixElement
  constructor(
    filter: SVGFilterElement,
    filterManager: GroupEffect,
    _elem: ElementInterfaceIntersect,
    id: string,
    source: string
  ) {
    super()
    this.filterManager = filterManager
    let feColorMatrix = createNS<SVGFEColorMatrixElement>('feColorMatrix')

    feColorMatrix.setAttribute('type', 'matrix')
    feColorMatrix.setAttribute('color-interpolation-filters', 'linearRGB')
    feColorMatrix.setAttribute('values', `${linearFilterValue} 1 0`)
    this.linearFilter = feColorMatrix
    feColorMatrix.setAttribute('result', `${id}_tint_1`)
    filter.appendChild(feColorMatrix)
    feColorMatrix = createNS<SVGFEColorMatrixElement>('feColorMatrix')
    feColorMatrix.setAttribute('type', 'matrix')
    feColorMatrix.setAttribute('color-interpolation-filters', 'sRGB')
    feColorMatrix.setAttribute('values',
      '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0')
    feColorMatrix.setAttribute('result', `${id}_tint_2`)
    filter.appendChild(feColorMatrix)
    this.matrixFilter = feColorMatrix

    const feMerge = this.createMergeNode(id, [
      source,
      `${id}_tint_1`,
      `${id}_tint_2`,
    ])

    filter.appendChild(feMerge)
  }

  renderFrame(forceRender?: boolean) {
    if (
      !forceRender && !this.filterManager._mdf
      // !this.filterManager.effectElements
    ) {
      return
    }
    const colorBlack = this.filterManager.effectElements[0].p.v as Vector3
    const colorWhite = this.filterManager.effectElements[1].p.v as Vector3
    const opacity = (this.filterManager.effectElements[2].p.v as number) / 100

    this.linearFilter.setAttribute('values',
      `${linearFilterValue} ${opacity} 0`)
    this.matrixFilter.setAttribute('values',
      `${colorWhite[0] - colorBlack[0]} 0 0 0 ${colorBlack[0]} ${
        colorWhite[1] - colorBlack[1]
      } 0 0 0 ${colorBlack[1]} ${colorWhite[2] - colorBlack[2]} 0 0 0 ${
        colorBlack[2]
      } 0 0 0 1 0`)
  }
}
