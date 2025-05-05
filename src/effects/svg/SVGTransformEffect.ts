import type { GroupEffect } from '@/effects/EffectsManager'

import TransformEffect from '@/effects/TransformEffect'

export default class SVGTransformEffect extends TransformEffect {
  constructor(_: SVGFilterElement, filterManager: GroupEffect) {
    super()
    this.init(filterManager)
  }
}
