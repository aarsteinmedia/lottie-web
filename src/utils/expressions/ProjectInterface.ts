import type { CompElementInterface } from '@/types'
<<<<<<< HEAD
import type LayerExpressionInterface from '@/utils/expressions/LayerInterface'
import type { MaskInterface } from '@/utils/expressions/MaskInterface'

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
        Boolean(this.compositions[i].prepareFrame) &&
        this.compositions[i].data?.xt
      ) {
        this.compositions[i].prepareFrame(this.currentFrame)
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      for (const [key, value] of Object.entries(this.compositions[i].compInterface as any)) {
        ProjectInterface[key as keyof typeof ProjectInterface] = value as any
      }
      break
    }
    // i++
=======

export default class ProjectInterface {
  compositions: CompElementInterface[] = []
  currentFrame = 0
  getComposition(name?: string) {
    let i = 0

    const { length } = this.compositions

    while (i < length) {
      if (this.compositions[i].data && this.compositions[i].data?.nm === name) {
        if (this.compositions[i].data?.xt) {
          this.compositions[i].prepareFrame(this.currentFrame)
        }

        return this.compositions[i].compInterface
      }
      i++
    }

    return null

>>>>>>> expressions
  }

  registerComposition(comp: CompElementInterface) {
    this.compositions.push(comp)
  }
}
