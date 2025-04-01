import type {
  ShapeDataInterface,
  SVGElementInterface,
  Transformer,
} from '@/types'

import { createNS } from '@/utils'

export default class ShapeGroupData {
  _render?: boolean
  gr: SVGGElement
  it: ShapeDataInterface[]
  prevViewData: SVGElementInterface[]
  transform?: Transformer
  constructor() {
    this.it = []
    this.prevViewData = []
    this.gr = createNS('g')
  }
}
