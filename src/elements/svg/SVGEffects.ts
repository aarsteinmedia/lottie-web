/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { GroupEffect } from '@/effects/EffectsManager'
import type { ElementInterfaceIntersect } from '@/types'

import { createFilter } from '@/utils/FiltersFactory'
import {
  createElementID,
  getLocationHref,
  registeredEffects,
} from '@/utils/getterSetter'

const idPrefix = 'filter_result_'

export default class SVGEffects {
  filters: GroupEffect[]
  constructor(elem: ElementInterfaceIntersect) {
    let source = 'SourceGraphic'

    const filId = createElementID(),
      fil = createFilter(filId, true)

    let count = 0

    this.filters = []
    let filterManager: null | GroupEffect
    const { length } = elem.data.ef ?? []

    for (let i = 0; i < length; i++) {
      filterManager = null

      const { ty } = elem.data.ef?.[i] ?? { ty: null },
        Effect = ty !== null && registeredEffects[ty]?.effect

      if (Effect && ty) {
        filterManager = new Effect(
          fil as any,
          elem.effectsManager?.effectElements[i] as any,
          elem as any,
          `${idPrefix}${count}`,
          source
        ) as GroupEffect
        source = `${idPrefix}${count}`
        if (registeredEffects[ty]?.countsAsEffect) {
          count++
        }
      }
      if (filterManager) {
        this.filters.push(filterManager)
      }
    }
    if (count) {
      elem.globalData.defs.appendChild(fil)
      elem.layerElement?.setAttribute('filter',
        `url(${getLocationHref()}#${filId})`)
    }
    if (this.filters.length > 0) {
      elem.addRenderableComponent(this)
    }
  }

  getEffects(type: string) {
    const { length } = this.filters,
      effects = []

    for (let i = 0; i < length; i++) {
      if (this.filters[i].type === type) {
        effects.push(this.filters[i])
      }
    }

    return effects
  }

  renderFrame(frame?: number | null) {
    const { length } = this.filters

    for (let i = 0; i < length; i++) {
      this.filters[i].renderFrame(frame)
    }
  }
}
