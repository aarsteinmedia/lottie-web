import type { SVGShapeData } from '@/elements/helpers/shapes/SVGShapeData'
import type { SVGStyleData } from '@/elements/helpers/shapes/SVGStyleData'
import type {
  ElementInterfaceIntersect,
  ShapeDataInterface,
  SVGElementInterface,
  Transformer,
} from '@/types'

import { DynamicPropertyContainer } from '@/utils/helpers/DynamicPropertyContainer'

export class SVGNoStyleData extends DynamicPropertyContainer {
  gr?: undefined | SVGGElement
  it: ShapeDataInterface[] = []
  prevViewData: SVGElementInterface[] = []
  style: SVGStyleData
  transform?: undefined | Transformer
  constructor(
    elem: ElementInterfaceIntersect,
    _data: SVGShapeData,
    styleObj: SVGStyleData
  ) {
    super()
    this.initDynamicPropertyContainer(elem)
    this.getValue = this.iterateDynamicProperties
    this.style = styleObj
  }
}
