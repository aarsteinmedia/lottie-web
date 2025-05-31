import type { Transformer } from '@/types'
import type { ShapeProperty } from '@/utils/shapes/ShapeProperty'

import ShapeData from '@/elements/helpers/shapes/ShapeData'

export default class SVGShapeData extends ShapeData {
  constructor(
    transformers: Transformer[],
    level: number,
    shape: ShapeProperty
  ) {
    super()
    this.caches = []
    this.styles = []
    this.transformers = transformers
    this.lStr = ''
    this.sh = shape
    this.lvl = level
    // TODO: find if there are some cases where _isAnimated can be false.
    // For now, since shapes add up with other shapes. They have to be calculated every time.
    // One way of finding out is checking if all styles associated to this shape depend only of this shape
    this._isAnimated = Boolean(shape.k)
    // TODO: commenting this for now since all shapes are animated
    let i = 0
    const { length } = transformers

    while (i < length) {
      if (transformers[i].mProps.dynamicProperties.length > 0) {
        this._isAnimated = true
        break
      }
      i++
    }
  }
}
