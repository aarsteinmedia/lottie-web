import { createSizedArray } from '../helpers/arrays'

const MaskManagerInterface = (function () {
  function MaskInterface(mask, data) {
    this._mask = mask
    this._data = data
  }
  Object.defineProperty(
    MaskInterface.prototype, 'maskPath', {
      get () {
        if (this._mask.prop.k) {
          this._mask.prop.getValue()
        }

        return this._mask.prop
      },
    }
  )
  Object.defineProperty(
    MaskInterface.prototype, 'maskOpacity', {
      get () {
        if (this._mask.op.k) {
          this._mask.op.getValue()
        }

        return this._mask.op.v * 100
      },
    }
  )

  const MaskManager = function (maskManager) {
    const _masksInterfaces = createSizedArray(maskManager.viewData.length)
    let i
    const len = maskManager.viewData.length

    for (i = 0; i < len; i += 1) {
      _masksInterfaces[i] = new MaskInterface(maskManager.viewData[i], maskManager.masksProperties[i])
    }

    const maskFunction = function (name) {
      i = 0
      while (i < len) {
        if (maskManager.masksProperties[i].nm === name) {
          return _masksInterfaces[i]
        }
        i += 1
      }

      return null
    }

    return maskFunction
  }

  return MaskManager
}())

export default MaskManagerInterface
