import type SVGStyleData from '@/elements/helpers/shapes/SVGStyleData'
import type {
  ElementInterfaceIntersect,
  Shape,
  ShapeDataInterface,
  SVGElementInterface,
  Transformer,
  Vector3,
  VectorProperty,
} from '@/types'
import type MultiDimensionalProperty from '@/utils/properties/MultiDimensionalProperty'
import type ValueProperty from '@/utils/properties/ValueProperty'

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
    elem: ElementInterfaceIntersect,
    data: Shape,
    styleObj: SVGStyleData
  ) {
    super()
    this.initDynamicPropertyContainer(elem)
    this.getValue = this.iterateDynamicProperties
    this.o = PropertyFactory.getProp(
      elem,
      data.o,
      0,
      0.01,
      this as unknown as ElementInterfaceIntersect
    ) as ValueProperty
    this.c = PropertyFactory.getProp(
      elem,
      data.c as VectorProperty,
      1,
      255,
      this as unknown as ElementInterfaceIntersect
    ) as MultiDimensionalProperty<Vector3>
    this.style = styleObj
  }
}
