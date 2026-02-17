import type { GroupEffect } from '@/effects/GroupEffect'
import type {
  EffectElement, EffectValue, ElementInterfaceIntersect
} from '@/types'
import type { EffectTypes } from '@/utils/enums'

import { createElementID } from '@/utils'
import FiltersFactory from '@/utils/FiltersFactory'
import { getLocationHref } from '@/utils/helpers/locationHref'

interface RegisteredEffects {
  [id: string]: {
    countsAsEffect?: boolean
    effect: EffectElement
  } | undefined
}

const idPrefix = 'filter_result_',
  registeredEffects: RegisteredEffects = {}

export class SVGEffects {
  filters: GroupEffect[]
  constructor(elem: ElementInterfaceIntersect) {
    let source = 'SourceGraphic'

    const filId = createElementID(),
      fil = FiltersFactory.createFilter(filId, true)

    let count = 0

    this.filters = []
    let filterManager: null | GroupEffect
    const { length } = elem.data.ef ?? []

    for (let i = 0; i < length; i++) {
      filterManager = null

      const { ty } = elem.data.ef?.[i] ?? { ty: null },
        Effect = ty === null || !registeredEffects[ty] ? null : registeredEffects[ty].effect

      if (Effect && ty && elem.effectsManager) {
        filterManager = new Effect(
          fil as SVGFilterElement & EffectValue & GroupEffect,
          // @ts-expect-error: TODO: fix typing
          elem.effectsManager.effectElements[i],
          elem,
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
      elem.globalData?.defs.appendChild(fil)
      elem.layerElement?.setAttribute('filter',
        `url(${getLocationHref()}#${filId})`)
    }
    if (this.filters.length > 0) {
      elem.addRenderableComponent(this)
    }
  }

  getEffects(type: EffectTypes) {
    const { length } = this.filters,
      effects = []

    for (let i = 0; i < length; i++) {
      if (this.filters[i]?.type === type) {
        effects.push(this.filters[i])
      }
    }

    return effects
  }

  renderFrame(frame?: number | null) {
    const { length } = this.filters

    for (let i = 0; i < length; i++) {
      this.filters[i]?.renderFrame(frame)
    }
  }
}

export const registerEffect = (
  id: number,
  effect: EffectElement,
  countsAsEffect?: boolean,
) => {
  registeredEffects[id] = {
    countsAsEffect,
    effect,
  }
}