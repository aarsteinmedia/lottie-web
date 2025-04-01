import type { ShapeType } from '@/enums'
import type {
  AnimatedProperty,
  Shape,
  ShapeDataInterface,
  SVGElementInterface,
  Transformer,
} from '@/types'

import { createNS } from '@/utils'

export default class SVGStyleData {
  _mdf: boolean
  closed: boolean
  d: string
  data: Shape
  gr?: SVGGElement
  hd?: boolean
  it?: ShapeDataInterface[]
  lvl: number
  msElem: null | SVGMaskElement | SVGPathElement
  pElem: SVGPathElement
  prevViewData?: SVGElementInterface[]
  pt?: AnimatedProperty
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
