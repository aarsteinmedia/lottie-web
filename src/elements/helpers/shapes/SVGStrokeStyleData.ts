import type SVGStyleData from '@/elements/helpers/shapes/SVGStyleData'
import type {
  ElementInterfaceIntersect,
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
import { RendererType } from '@/utils/enums'
import PropertyFactory from '@/utils/PropertyFactory'
import DashProperty from '@/utils/shapes/properties/DashProperty'

export default class SVGStrokeStyleData extends SVGFillStyleData {
  d?: DashProperty
  constructor(
    elem: ElementInterfaceIntersect,
    data: Shape,
    styleObj: SVGStyleData
  ) {
    super(
      elem, data, styleObj
    )
    this.initDynamicPropertyContainer(elem)
    this.getValue = this.iterateDynamicProperties
    this.o = PropertyFactory.getProp(
      elem,
      data.o,
      0,
      0.01,
      this as unknown as ElementInterfaceIntersect
    ) as ValueProperty
    this.w = PropertyFactory.getProp(
      elem,
      data.w,
      0,
      null,
      this as unknown as ElementInterfaceIntersect
    ) as ValueProperty
    this.d = new DashProperty(
      elem,
      (data.d || []) as StrokeData[],
      RendererType.SVG,
      this as unknown as ElementInterfaceIntersect
    )
    this.c = PropertyFactory.getProp(
      elem,
      data.c as VectorProperty,
      1,
      255,
      this as unknown as ElementInterfaceIntersect
    ) as MultiDimensionalProperty<Vector3>
    this.style = styleObj
    this._isAnimated = Boolean(this._isAnimated)
  }
}
