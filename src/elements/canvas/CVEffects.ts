import type { GroupEffect } from '@/effects/EffectsManager'
import type { ElementInterfaceIntersect } from '@/types'

import { registeredEffects } from '@/utils/getterSetter'

export default class CVEffects {
  filters: GroupEffect[]
  constructor(elem: ElementInterfaceIntersect) {
    const { length } = elem.data.ef ?? []

    this.filters = []
    let filterManager

    for (let i = 0; i < length; i++) {
      filterManager = null
      const type = elem.data.ef?.[i].ty

      if (type && registeredEffects[type]) {
        /**
         * TODO:.
         */
        const Effect = registeredEffects[type].effect as any

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        filterManager = new Effect(elem.effectsManager?.effectElements[i], elem)
      }
      if (filterManager) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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
      if (this.filters[i].type === type) {
        effects.push(this.filters[i])
      }
    }

    return effects
  }

  renderFrame(_isFirstFrame?: number) {
    const { length } = this.filters

    for (let i = 0; i < length; i++) {
      this.filters[i].renderFrame(_isFirstFrame)
    }
  }
}
