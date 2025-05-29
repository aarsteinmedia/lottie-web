import type { LottieLayer } from '@/types'

import { createSizedArray } from '@/utils/helpers/arrays'

class MaskInterface {
  _data
  _mask
  get maskOpacity() {
    if (this._mask.op.k) {
      this._mask.op.getValue()
    }

    return this._mask.op.v * 100
  }

  get maskPath() {
    if (this._mask.prop.k) {
      this._mask.prop.getValue()
    }

    return this._mask.prop
  }

  constructor(mask: LottieLayer, data: LottieLayer) {
    this._mask = mask
    this._data = data
  }
}


const MaskManagerInterface = (function () {
  const MaskManager = function (maskManager) {
    const _masksInterfaces = createSizedArray(maskManager.viewData.length)
    let i
    const { length } = maskManager.viewData

    for (i = 0; i < length; i++) {
      _masksInterfaces[i] = new MaskInterface(maskManager.viewData[i], maskManager.masksProperties[i])
    }

    const maskFunction = function (name) {
      i = 0
      while (i < length) {
        if (maskManager.masksProperties[i].nm === name) {
          return _masksInterfaces[i]
        }
        i++
      }

      return null
    }

    return maskFunction
  }

  return MaskManager
}())

export default MaskManagerInterface
