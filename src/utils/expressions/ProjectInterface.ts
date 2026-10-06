import type { CompElementInterface } from '@/types'

export class ProjectInterface {
  compositions: CompElementInterface[] = []
  currentFrame = 0
  getComposition(name?: string) {
    let i = 0

    const { length } = this.compositions

    while (i < length) {
      const comp = this.compositions[i]

      // The root renderer is registered too, but has no layer data, so it never matches here
      if (comp.data && comp.data.nm === name) {
        if (comp.data.xt && 'prepareFrame' in comp) {
          comp.prepareFrame(this.currentFrame)
        }

        return comp.compInterface
      }
      i++
    }

    return null

  }

  registerComposition(comp: CompElementInterface) {
    this.compositions.push(comp)
  }
}
