import type { CompElementInterface } from '@/types'

export class ProjectInterface {
  compositions: CompElementInterface[] = []
  currentFrame = 0
  getComposition(name?: string) {
    let i = 0

    const { length } = this.compositions

    while (i < length) {
      if (this.compositions[i]?.data && this.compositions[i]?.data?.nm === name) {
        if (this.compositions[i]?.data?.xt) {
          this.compositions[i]?.prepareFrame(this.currentFrame)
        }

        return this.compositions[i]?.compInterface
      }
      i++
    }

    return null

  }

  registerComposition(comp: CompElementInterface) {
    this.compositions.push(comp)
  }
}
