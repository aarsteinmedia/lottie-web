import type { GroupEffect } from '@/effects/EffectsManager'
import type { ElementInterfaceIntersect } from '@/types'

import { registeredEffects } from '@/utils/getterSetter'

export default class CVEffects {
  filters: GroupEffect[]
  constructor(elem: ElementInterfaceIntersect) {
    const { length } = elem.data.ef || []
    this.filters = []
    let filterManager
    for (let i = 0; i < length; i += 1) {
      filterManager = null
      const type = elem.data.ef?.[i].ty
      if (type && registeredEffects[type]) {
        const Effect = registeredEffects[type].effect
        filterManager = new Effect(
          elem.effectsManager.effectElements[i],
          elem
        ) as GroupEffect
      }
      if (filterManager) {
        this.filters.push(filterManager)
      }
    }
    if (this.filters.length) {
      elem.addRenderableComponent(this as unknown as ElementInterfaceIntersect)
    }
  }

  getEffects(type: string): GroupEffect[] {
    const { length } = this.filters,
      effects = []
    for (let i = 0; i < length; i += 1) {
      if (this.filters[i].type === type) {
        effects.push(this.filters[i])
      }
    }
    return effects
  }

  renderFrame(_isFirstFrame?: number) {
    const { length } = this.filters
    for (let i = 0; i < length; i += 1) {
      this.filters[i].renderFrame(_isFirstFrame)
    }
  }
}
