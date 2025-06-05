import type { GroupEffect } from '@/effects/EffectsManager'
import type { ElementInterfaceIntersect, Vector3 } from '@/types'

import { createElementID } from '@/utils'
import { getLocationHref } from '@/utils/helpers/locationHref'
import createNS from '@/utils/helpers/svgElements'

export default class SVGStrokeEffect {
  elem: ElementInterfaceIntersect
  filterManager: GroupEffect
  initialized: boolean
  masker?: SVGMaskElement
  pathMasker?: SVGGElement
  paths: {
    m: number;
    p: SVGPathElement
  }[]
  constructor(
    _fil: SVGFilterElement,
    filterManager: GroupEffect,
    elem: ElementInterfaceIntersect
  ) {
    this.initialized = false
    this.filterManager = filterManager
    this.elem = elem
    this.paths = []
  }

  initialize() {
    // if (!this.filterManager.effectElements) {
    //   throw new Error(`${this.constructor.name}: Missing Effects Elements`)
    // }
    let elemChildren = [...this.elem.layerElement?.children ??
      this.elem.layerElement?.childNodes ??
      []]
    let path
    let i
    let len

    if (this.filterManager.effectElements[1].p.v === 1) {
      len = this.elem.maskManager?.masksProperties.length || 0
      i = 0
    } else {
      i = (this.filterManager.effectElements[0].p.v as number) - 1
      len = i + 1
    }
    const groupPath = createNS<SVGGElement>('g')

    groupPath.setAttribute('fill', 'none')
    groupPath.setAttribute('stroke-linecap', 'round')
    groupPath.setAttribute('stroke-dashoffset', '1')
    for (i; i < len; i++) {
      path = createNS<SVGPathElement>('path')
      groupPath.appendChild(path)
      this.paths.push({
        m: i,
        p: path
      })
    }
    if (this.filterManager.effectElements[10].p.v === 3) {
      const mask = createNS<SVGMaskElement>('mask'),
        id = createElementID()

      mask.id = id
      mask.setAttribute('mask-type', 'alpha')
      mask.appendChild(groupPath)
      this.elem.globalData?.defs.appendChild(mask)
      const g = createNS<SVGGElement>('g')

      g.setAttribute('mask', `url(${getLocationHref()}#${id})`)
      while (elemChildren[0]) {
        g.appendChild(elemChildren[0])
      }
      this.elem.layerElement?.appendChild(g)
      this.masker = mask
      groupPath.setAttribute('stroke', '#fff')
    } else if (
      this.filterManager.effectElements[10].p.v === 1 ||
      this.filterManager.effectElements[10].p.v === 2
    ) {
      if (this.filterManager.effectElements[10].p.v === 2) {
        elemChildren = [...this.elem.layerElement?.children ??
        this.elem.layerElement?.childNodes ??
        []]
        while (elemChildren.length > 0) {
          this.elem.layerElement?.removeChild(elemChildren[0])
        }
      }
      this.elem.layerElement?.appendChild(groupPath)
      this.elem.layerElement?.removeAttribute('mask')
      groupPath.setAttribute('stroke', '#fff')
    }
    this.initialized = true
    this.pathMasker = groupPath
  }

  renderFrame(forceRender?: boolean) {
    // if (!this.filterManager.effectElements) {
    //   throw new Error(`${this.constructor.name}: Missing Effect element`)
    // }
    if (!this.initialized) {
      this.initialize()
    }
    const { length } = this.paths
    let mask, path

    for (let i = 0; i < length; i++) {
      if (this.paths[i].m === -1) {
        continue
      }
      mask = this.elem.maskManager?.viewData[this.paths[i].m]
      path = this.paths[i].p
      if (
        mask &&
        (forceRender || this.filterManager._mdf || mask.prop?._mdf)
      ) {
        path.setAttribute('d', mask.lastPath)
      }
      if (
        forceRender ||
        this.filterManager.effectElements[9].p._mdf ||
        this.filterManager.effectElements[4].p._mdf ||
        this.filterManager.effectElements[7].p._mdf ||
        this.filterManager.effectElements[8].p._mdf ||
        mask?.prop?._mdf
      ) {
        let dasharrayValue

        if (
          this.filterManager.effectElements[7].p.v !== 0 ||
          this.filterManager.effectElements[8].p.v !== 100
        ) {
          const s =
            Math.min(this.filterManager.effectElements[7].p.v as number,
              this.filterManager.effectElements[8].p.v as number) * 0.01
          const e =
            Math.max(this.filterManager.effectElements[7].p.v as number,
              this.filterManager.effectElements[8].p.v as number) * 0.01
          const l = path.getTotalLength()

          dasharrayValue = `0 0 0 ${l * s} `
          const lineLength = l * (e - s),
            segment =
              1 +
              (this.filterManager.effectElements[4].p.v as number) *
              2 *
              (this.filterManager.effectElements[9].p.v as number) *
              0.01
          const units = Math.floor(lineLength / segment)

          for (let j = 0; j < units; j++) {
            dasharrayValue += `1 ${
              (this.filterManager.effectElements[4].p.v as number) *
              2 *
              (this.filterManager.effectElements[9].p.v as number) *
              0.01
            } `
          }
          dasharrayValue += `0 ${l * 10} 0 0`
        } else {
          dasharrayValue = `1 ${
            (this.filterManager.effectElements[4].p.v as number) *
            2 *
            (this.filterManager.effectElements[9].p.v as number) *
            0.01
          }`
        }
        path.setAttribute('stroke-dasharray', dasharrayValue)
      }
    }
    if (forceRender || this.filterManager.effectElements[4].p._mdf) {
      this.pathMasker?.setAttribute('stroke-width',
        `${(this.filterManager.effectElements[4].p.v as number) * 2}`)
    }

    if (forceRender || this.filterManager.effectElements[6].p._mdf) {
      this.pathMasker?.setAttribute('opacity',
        `${Number(this.filterManager.effectElements[6].p.v)}`)
    }
    if ((this.filterManager.effectElements[10].p.v === 1 ||
      this.filterManager.effectElements[10].p.v === 2) &&
      (forceRender || this.filterManager.effectElements[3].p._mdf)
    ) {
      const color = this.filterManager.effectElements[3].p.v as Vector3

      this.pathMasker?.setAttribute('stroke',
        `rgb(${Math.floor(color[0] * 255)},${Math.floor(color[1] * 255)},${
          color[2] * 255
        })`)
    }
  }
}
