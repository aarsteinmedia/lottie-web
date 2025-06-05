import type GroupEffect from '@/effects/GroupEffect'

import TransformEffect from '@/effects/TransformEffect'

export default class SVGTransformEffect extends TransformEffect {
  constructor(_: SVGFilterElement, filterManager: GroupEffect) {
    super()
    this.init(filterManager)
  }
}
