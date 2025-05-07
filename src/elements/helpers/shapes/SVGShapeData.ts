import type SVGStyleData from '@/elements/helpers/shapes/SVGStyleData'
import type {
  ShapeDataInterface,
  SVGElementInterface,
  Transformer,
} from '@/types'
import type { ShapeType } from '@/utils/enums'
import type ShapeCollection from '@/utils/shapes/ShapeCollection'
import type ShapePath from '@/utils/shapes/ShapePath'
import type { ShapeProperty } from '@/utils/shapes/ShapeProperty'

export default class SVGShapeData {
  _isAnimated: boolean
  _length?: number
  caches: string[]
  data?: SVGShapeData
  gr?: SVGGElement
  hd?: boolean
  it: ShapeDataInterface[] = []
  localShapeCollection?: ShapeCollection
  lStr: string
  lvl: number
  pathsData: ShapePath[] = []
  prevViewData: SVGElementInterface[] = []
  sh: ShapeProperty
  shape?: ShapeProperty
  style?: SVGStyleData
  styles: SVGStyleData[]
  transform?: Transformer
  transformers: Transformer[]
  ty?: ShapeType
  constructor(
    transformers: Transformer[],
    level: number,
    shape: ShapeProperty
  ) {
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
  setAsAnimated() {
    this._isAnimated = true
  }
}
