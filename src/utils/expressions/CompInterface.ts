import type { CompElementInterface, GlobalData } from '@/types'

export default class CompExpressionInterface {
  public _name?: string
  public comp: CompElementInterface
  public displayStartTime: number
  public frameDuration: number
  public globalData?: GlobalData
  public height: number
  public numLayers: number
  public pixelAspect: number
  public width: number
  constructor(comp: CompElementInterface) {
    this.comp = comp
    this._name = comp.data?.nm
    this.pixelAspect = 1
    this.height = comp.data?.h || comp.globalData?.compSize?.h || 0
    this.width = comp.data?.w || comp.globalData?.compSize?.w || 0
    this.frameDuration = 1 / (comp.globalData?.frameRate || 60)
    this.displayStartTime = 0
    this.numLayers = comp.layers.length
  }
  public layer(name: string | number) {
    let i = 0
    const { length } = this.comp.layers

    while (i < length) {
      if (this.comp.layers[i].nm === name || this.comp.layers[i].ind === name) {
        return this.comp.elements[i].layerInterface
      }
      i++
    }

    return null
  }
}
