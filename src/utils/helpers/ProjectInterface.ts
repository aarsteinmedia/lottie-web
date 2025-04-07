import type { CompElementInterface } from '@/types'

import LayerExpressionInterface from '@/utils/expressions/LayerInterface'
import { MaskInterface } from '@/utils/expressions/MaskInterface'
export default class ProjectInterface {
  compositions: CompElementInterface[] = []
  content?: ProjectInterface
  createEffectsInterface?: (
    val: any,
    _interface?: LayerExpressionInterface
  ) => any
  currentFrame = 0
  registerEffectsInterface?: (val: any, _interface?: ProjectInterface) => any
  registerMaskInterface?: (val: any, _interface?: MaskInterface) => any
  shapeInterface?: ProjectInterface
  text?: ProjectInterface
  textInterface?: ProjectInterface
  constructor(name?: string) {
    let i = 0
    const { length } = this.compositions
    while (i < length) {
      if (this.compositions[i].data?.nm !== name) {
        i++
        continue
      }
      if (
        !!this.compositions[i].prepareFrame &&
        this.compositions[i].data?.xt
      ) {
        this.compositions[i].prepareFrame!(this.currentFrame)
      }
      for (const [key, value] of Object.entries(
        this.compositions[i].compInterface as any
      )) {
        ProjectInterface[key as keyof typeof ProjectInterface] = value as any
      }
      break
    }
    i++
  }
  registerComposition(comp: CompElementInterface) {
    this.compositions.push(comp)
  }
}
