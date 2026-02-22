import type {
  VectorProperty,
  Shape,
  ShapeDataInterface,
  SVGElementInterface,
  Transformer,
} from '@/types'
import type { ShapeType } from '@/utils/enums'

import { createNS } from '@/utils/helpers/svgElements'

export class SVGStyleData {
  _mdf: boolean
  closed: boolean
  coOp?: undefined | number
  d: string
  data: Shape
  finalTransform?: undefined | Transformer
  gr?: undefined | SVGGElement
  grd?: undefined | CanvasGradient
  hd?: undefined | boolean
  it?: undefined | ShapeDataInterface[]
  lvl: number
  msElem: null | SVGMaskElement | SVGPathElement
  pElem: SVGPathElement
  prevViewData?: undefined | SVGElementInterface[]
  pt?: undefined | VectorProperty
  style?: undefined | SVGStyleData
  t?: undefined | number
  transform?: undefined | Transformer
  ty?: undefined | ShapeType
  type?: undefined | ShapeType
  constructor(data: Shape, level: number) {
    this.data = data
    this.type = data.ty
    this.d = ''
    this.lvl = level
    this._mdf = false
    this.closed = data.hd === true
    this.pElem = createNS<SVGPathElement>('path')
    this.msElem = null
  }

  reset() {
    this.d = ''
    this._mdf = false
  }
}
