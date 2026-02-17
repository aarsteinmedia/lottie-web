import type { SVGStyleData } from '@/elements/helpers/shapes/SVGStyleData'
import type {
  ElementInterfaceIntersect,
  ShapeDataInterface,
  SVGElementInterface,
  Transformer,
} from '@/types'
import type { TransformProperty } from '@/utils/properties/TransformProperty'
import type { ValueProperty } from '@/utils/properties/ValueProperty'

export class SVGTransformData {
  _isAnimated: boolean
  elements: ElementInterfaceIntersect[]
  gr?: SVGGElement
  it?: ShapeDataInterface[]
  prevViewData?: SVGElementInterface[]
  style?: SVGStyleData
  transform: Transformer
  constructor(
    mProps: TransformProperty,
    op: ValueProperty,
    container: SVGGElement
  ) {
    this.transform = {
      container,
      mProps,
      op,
    } as Transformer
    this.elements = []
    this._isAnimated = this.transform.mProps.dynamicProperties.length > 0 ||
      this.transform.op.effectsSequence.length > 0
  }
}
