import type { CompElementInterface } from '@/types'

export default class CompExpressionInterface {
  _name?: string
  comp: CompElementInterface
  displayStartTime: number
  frameDuration: number
  height?: number
  layer: CompExpressionInterface
  numLayers?: number
  pixelAspect: number
  width?: number
  constructor (comp: CompElementInterface) {
    this.comp = comp
    this._name = comp.data?.nm
    this.layer = this

    this.height = comp.data?.h || comp.globalData?.compSize?.h
    this.width = comp.data?.w || comp.globalData?.compSize?.w
    this.pixelAspect = 1
    this.frameDuration = 1 / (comp.globalData?.frameRate ?? 60)
    this.displayStartTime = 0
    this.numLayers = comp.layers?.length
  }

  getInterface (name?: string | number | number[]) {
    let i = 0

    const { length } = this.comp.layers ?? []

    while (i < length) {
      if (this.comp.layers?.[i].nm === name || this.comp.layers?.[i].ind === name) {
        return this.comp.elements[i].layerInterface
      }
      i++
    }

    return null
  }
}