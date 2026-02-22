import type { SVGStyleData } from '@/elements/helpers/shapes/SVGStyleData'
import type {
  ElementInterfaceIntersect,
  Shape,
  StrokeData,
  Vector3,
} from '@/types'
import type { MultiDimensionalProperty } from '@/utils/properties/MultiDimensionalProperty'
import type { ValueProperty } from '@/utils/properties/ValueProperty'

import { SVGGradientFillStyleData } from '@/elements/helpers/shapes/SVGGradientFillStyleData'
import { RendererType } from '@/utils/enums'
import PropertyFactory from '@/utils/PropertyFactory'
import { DashProperty } from '@/utils/shapes/properties/DashProperty'

export class SVGGradientStrokeStyleData extends SVGGradientFillStyleData {
  c?: undefined | MultiDimensionalProperty<Vector3>
  d: DashProperty
  w?: undefined | ValueProperty
  constructor(
    elem: ElementInterfaceIntersect,
    data: Shape,
    styleData: SVGStyleData
  ) {
    super(
      elem, data, styleData
    )
    this.initDynamicPropertyContainer(elem)
    this.getValue = this.iterateDynamicProperties
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
    ) // TODO
    this.initGradientData(
      elem, data, styleData
    )
    this._isAnimated = Boolean(this._isAnimated)
  }
}
