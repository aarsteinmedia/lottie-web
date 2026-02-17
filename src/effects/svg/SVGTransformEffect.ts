import type { GroupEffect } from '@/effects/GroupEffect'

import { TransformEffect } from '@/effects/TransformEffect'

export class SVGTransformEffect extends TransformEffect {
  constructor(_: SVGFilterElement, filterManager: GroupEffect) {
    super()
    this.init(filterManager)
  }
}
