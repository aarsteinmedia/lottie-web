import type MaskElement from '@/elements/MaskElement'
import type { Shape, ViewData } from '@/types'

import { createSizedArray } from '@/utils/helpers/arrays'

export class MaskInterface {
  _data: Shape
  _mask: ViewData
  constructor(mask: ViewData, data: Shape) {
    this._mask = mask
    this._data = data
  }
  maskOpacity() {
    if (this._mask.op.k) {
      this._mask.op.getValue()
    }

    return this._mask.op.v * 100
  }
  maskPath() {
    if (this._mask.prop?.k) {
      this._mask.prop.getValue()
    }

    return this._mask.prop
  }
}

export default class MaskManager {
  private _maskManager: MaskElement
  private _masksInterfaces: MaskInterface[]
  constructor(maskManager: MaskElement) {
    this._maskManager = maskManager
    this._masksInterfaces = createSizedArray(this._maskManager.viewData.length)
    const { length } = this._maskManager.viewData

    for (let i = 0; i < length; i++) {
      this._masksInterfaces[i] = new MaskInterface(this._maskManager.viewData[i],
        this._maskManager.masksProperties[i])
    }
  }

  public getMaskInterface(name: string) {
    let i = 0

    while (i < length) {
      if (this._maskManager.masksProperties[i].nm === name) {
        return this._masksInterfaces[i]
      }
      i++
    }

    return null
  }
}
