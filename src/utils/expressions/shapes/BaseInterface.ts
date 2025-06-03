import type SVGFillStyleData from '@/elements/helpers/shapes/SVGFillStyleData'
import type SVGGradientFillStyleData from '@/elements/helpers/shapes/SVGGradientFillStyleData'
import type SVGStrokeStyleData from '@/elements/helpers/shapes/SVGStrokeStyleData'
import type SVGTransformData from '@/elements/helpers/shapes/SVGTransformData'
import type { Shape, Transformer } from '@/types'
import type PropertyGroupFactory from '@/utils/expressions/PropertyGroupFactory'
import type RepeaterModifier from '@/utils/shapes/RepeaterModifier'
import type RoundCornersModifier from '@/utils/shapes/RoundCornersModifier'
import type {
  EllShapeProperty, RectShapeProperty, StarShapeProperty
} from '@/utils/shapes/ShapeProperty'
import type TrimModifier from '@/utils/shapes/TrimModifier'

export default abstract class BaseInterface {
  _name?: string
  mn?: string
  nm?: string
  numProperties?: number
  prop?: StarShapeProperty | RectShapeProperty | EllShapeProperty | RoundCornersModifier | RepeaterModifier | TrimModifier | SVGGradientFillStyleData | SVGStrokeStyleData | SVGFillStyleData | SVGTransformData
  propertyGroup?: PropertyGroupFactory
  propertyIndex?: number
  shape?: Shape
  transform?: Transformer

  getInterface(_value: string | number) {
    throw new Error('Method not implemented')
  }
}
