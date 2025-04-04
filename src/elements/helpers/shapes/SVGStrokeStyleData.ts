import type {
  ElementInterfaceIntersect,
  ElementInterfaceUnion,
  Shape,
  StrokeData,
  Vector3,
  VectorProperty,
} from '@/types'
import type {
  MultiDimensionalProperty,
  ValueProperty,
} from '@/utils/Properties'

import SVGFillStyleData from '@/elements/helpers/shapes/SVGFillStyleData'
import SVGStyleData from '@/elements/helpers/shapes/SVGStyleData'
import { RendererType } from '@/enums'
import PropertyFactory from '@/utils/PropertyFactory'
import DashProperty from '@/utils/shapes/DashProperty'

export default class SVGStrokeStyleData extends SVGFillStyleData {
  d: DashProperty
  constructor(
    elem: ElementInterfaceUnion,
    data: Shape,
    styleObj: SVGStyleData
  ) {
    super(elem, data, styleObj)
    this.initDynamicPropertyContainer(elem as ElementInterfaceIntersect)
    this.getValue = this.iterateDynamicProperties
    this.o = PropertyFactory.getProp(
      elem as ElementInterfaceIntersect,
      data.o,
      0,
      0.01,
      this as unknown as ElementInterfaceIntersect
    ) as ValueProperty
    this.w = PropertyFactory.getProp(
      elem as ElementInterfaceIntersect,
      data.w,
      0,
      null,
      this as unknown as ElementInterfaceIntersect
    ) as ValueProperty
    this.d = new DashProperty(
      elem as ElementInterfaceIntersect,
      (data.d || []) as StrokeData[],
      RendererType.SVG,
      this as unknown as ElementInterfaceIntersect
    )
    this.c = PropertyFactory.getProp(
      elem as ElementInterfaceIntersect,
      data.c as VectorProperty,
      1,
      255,
      this as unknown as ElementInterfaceIntersect
    ) as MultiDimensionalProperty<Vector3>
    this.style = styleObj
    this._isAnimated = !!this._isAnimated
  }
}
