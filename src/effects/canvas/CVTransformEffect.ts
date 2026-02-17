import type { GroupEffect } from '@/effects/GroupEffect'

import { TransformEffect } from '@/effects/TransformEffect'

export class CVTransformEffect extends TransformEffect {
  constructor(effectsManager: GroupEffect) {
    super()
    this.init(effectsManager)
  }
}
