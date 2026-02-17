import type {
  ShapeDataInterface,
  SVGElementInterface,
  Transformer,
} from '@/types'

import { createNS } from '@/utils/helpers/svgElements'

export class ShapeGroupData {
  _shouldRender?: boolean
  closed?: boolean
  gr: SVGGElement
  it: ShapeDataInterface[]
  prevViewData: SVGElementInterface[]
  transform?: Transformer
  constructor() {
    this.it = []
    this.prevViewData = []
    this.gr = createNS<SVGGElement>('g')
  }
}
