import type {
  VectorProperty,
  Shape,
  ShapeDataInterface,
  SVGElementInterface,
  Transformer,
} from '@/types'
import type { ShapeType } from '@/utils/enums'

import createNS from '@/utils/helpers/svgElements'

export default class SVGStyleData {
  _mdf: boolean
  closed: boolean
  coOp?: number
  d: string
  data: Shape
  finalTransform?: Transformer
  gr?: SVGGElement
  grd?: CanvasGradient
  hd?: boolean
  it?: ShapeDataInterface[]
  lvl: number
  msElem: null | SVGMaskElement | SVGPathElement
  pElem: SVGPathElement
  prevViewData?: SVGElementInterface[]
  pt?: VectorProperty
  style?: SVGStyleData
  t?: number
  transform?: Transformer
  ty?: ShapeType
  type?: ShapeType
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
