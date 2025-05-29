import type { CompElementInterface } from '@/types'

const CompExpressionInterface = (function () {
  return function (comp: CompElementInterface) {
    function _thisLayerFunction(name: string) {
      let i = 0

      const { length } = comp.layers ?? []

      while (i < length) {
        if (comp.layers?.[i].nm === name || comp.layers?.[i].ind as unknown as string === name) {
          return comp.elements[i].layerInterface
        }
        i++
      }

      return null
      // return {active:false};
    }
    Object.defineProperty(
      _thisLayerFunction, '_name', { value: comp.data?.nm }
    )
    _thisLayerFunction.layer = _thisLayerFunction
    _thisLayerFunction.pixelAspect = 1
    _thisLayerFunction.height = comp.data?.h || comp.globalData?.compSize?.h
    _thisLayerFunction.width = comp.data?.w || comp.globalData?.compSize?.w
    _thisLayerFunction.pixelAspect = 1
    _thisLayerFunction.frameDuration = 1 / (comp.globalData?.frameRate ?? 60)
    _thisLayerFunction.displayStartTime = 0
    _thisLayerFunction.numLayers = comp.layers?.length

    return _thisLayerFunction
  }
}())

export default CompExpressionInterface
