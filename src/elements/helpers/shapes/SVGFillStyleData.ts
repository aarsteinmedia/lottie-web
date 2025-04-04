import type SVGStyleData from '@/elements/helpers/shapes/SVGStyleData'
import type {
  ElementInterfaceIntersect,
  ElementInterfaceUnion,
  Shape,
  ShapeDataInterface,
  SVGElementInterface,
  Transformer,
  Vector3,
  VectorProperty,
} from '@/types'
import type {
  MultiDimensionalProperty,
  ValueProperty,
} from '@/utils/Properties'

import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer'
import PropertyFactory from '@/utils/PropertyFactory'

export default class SVGFillStyleData extends DynamicPropertyContainer {
  c?: MultiDimensionalProperty<Vector3>
  gr?: SVGGElement
  it: ShapeDataInterface[] = []
  o?: ValueProperty
  prevViewData: SVGElementInterface[] = []
  style: SVGStyleData
  transform?: Transformer
  w?: ValueProperty
  constructor(
    elem: ElementInterfaceUnion,
    data: Shape,
    styleObj: SVGStyleData
  ) {
    super()
    this.initDynamicPropertyContainer(elem as ElementInterfaceIntersect)
    this.getValue = this.iterateDynamicProperties
    this.o = PropertyFactory.getProp(
      elem as ElementInterfaceIntersect,
      data.o,
      0,
      0.01,
      this as unknown as ElementInterfaceIntersect
    ) as ValueProperty
    this.c = PropertyFactory.getProp(
      elem as ElementInterfaceIntersect,
      data.c as VectorProperty,
      1,
      255,
      this as unknown as ElementInterfaceIntersect
    ) as MultiDimensionalProperty<Vector3>
    this.style = styleObj
  }
}
