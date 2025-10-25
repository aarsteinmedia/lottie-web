import type GroupEffect from '@/effects/GroupEffect'
import type { EffectElement, ElementInterfaceIntersect } from '@/types'

interface RegisteredEffects {
  [id: string]: {
    countsAsEffect?: boolean
    effect: EffectElement
  } | undefined
}

const registeredEffects: RegisteredEffects = {}

export default class CVEffects {
  filters: GroupEffect[]
  constructor(elem: ElementInterfaceIntersect) {
    const { length } = elem.data.ef ?? []

    this.filters = []
    let filterManager

    for (let i = 0; i < length; i++) {
      filterManager = null
      const type = elem.data.ef?.[i]?.ty

      if (type && registeredEffects[type]) {
        /**
         * TODO:.
         */
        const Effect = registeredEffects[type].effect

        // @ts-expect-error: missing container
        filterManager = new Effect(elem.effectsManager?.effectElements[i], elem) as GroupEffect
      }
      if (filterManager) {
        this.filters.push(filterManager)
      }
    }
    if (this.filters.length > 0) {
      elem.addRenderableComponent(this)
    }
  }

  getEffects(type: string): GroupEffect[] {
    const { length } = this.filters,
      effects = []

    for (let i = 0; i < length; i++) {
      const filter = this.filters[i]

      if (filter?.type !== type) {
        continue
      }

      effects.push(filter)
    }

    return effects
  }

  renderFrame(_isFirstFrame?: number) {
    const { length } = this.filters

    for (let i = 0; i < length; i++) {
      this.filters[i]?.renderFrame(_isFirstFrame)
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