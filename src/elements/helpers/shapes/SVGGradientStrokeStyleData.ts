import type SVGStyleData from '@/elements/helpers/shapes/SVGStyleData'
import type {
  ElementInterfaceIntersect,
  ElementInterfaceUnion,
  Shape,
  StrokeData,
  Vector3,
} from '@/types'
import type {
  MultiDimensionalProperty,
  ValueProperty,
} from '@/utils/Properties'

import SVGGradientFillStyleData from '@/elements/helpers/shapes/SVGGradientFillStyleData'
import { RendererType } from '@/utils/enums'
import PropertyFactory from '@/utils/PropertyFactory'
import DashProperty from '@/utils/shapes/DashProperty'

export default class SVGGradientStrokeStyleData extends SVGGradientFillStyleData {
  c?: MultiDimensionalProperty<Vector3>
  d: DashProperty
  w?: ValueProperty
  constructor(
    elem: ElementInterfaceUnion,
    data: Shape,
    styleData: SVGStyleData
  ) {
    super(
      elem, data, styleData
    )
    this.initDynamicPropertyContainer(elem as ElementInterfaceIntersect)
    this.getValue = this.iterateDynamicProperties
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
    ) // TODO
    this.initGradientData(
      elem, data, styleData
    )
    this._isAnimated = Boolean(this._isAnimated)
  }
}
