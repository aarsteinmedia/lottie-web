import type CVMaskElement from '@/elements/canvas/CVMaskElement'
import type MaskElement from '@/elements/MaskElement'
import type {
  ElementInterfaceIntersect, Shape, ViewData
} from '@/types'

import { createSizedArray } from '@/utils/helpers/arrays'

class MaskInterface {
  _data: Shape
  _mask: ViewData
  get maskOpacity() {
    if (this._mask.op.k) {
      this._mask.op.getValue()
    }

    return this._mask.op.v * 100
  }

  get maskPath() {
    if (this._mask.prop?.k) {
      this._mask.prop.getValue()
    }

    return this._mask.prop
  }

  constructor(mask: ViewData, data: Shape) {
    this._mask = mask
    this._data = data
  }
}


export default class MaskManagerInterface {
  _masksInterfaces: MaskInterface[]
  maskManager: MaskElement | CVMaskElement

  constructor (maskManager: MaskElement | CVMaskElement, _elem?: ElementInterfaceIntersect) {
    this.maskManager = maskManager
    this._masksInterfaces = createSizedArray(maskManager.viewData.length)
    const { length } = maskManager.viewData

    for (let i = 0; i < length; i++) {
      this._masksInterfaces[i] = new MaskInterface(maskManager.viewData[i], maskManager.masksProperties[i])
    }
  }

  getInterface (name: string) {
    let i = 0

    while (i < length) {
      if (this.maskManager.masksProperties[i].nm === name) {
        return this._masksInterfaces[i]
      }
      i++
    }

    return null
  }

}
