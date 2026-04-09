import type {
  ShapeDataInterface,
  SVGElementInterface,
  Transformer,
} from '@/types'

import { createNS } from '@/utils/helpers/svgElements'

export class ShapeGroupData {
  _shouldRender?: boolean
  closed?: boolean
  gr = createNS<SVGGElement>('g')
  it: ShapeDataInterface[] = []
  prevViewData: SVGElementInterface[] = []
  transform?: Transformer
}
