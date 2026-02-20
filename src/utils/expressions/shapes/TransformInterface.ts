import type { SVGFillStyleData } from '@/elements/helpers/shapes/SVGFillStyleData'
import type { SVGTransformData } from '@/elements/helpers/shapes/SVGTransformData'
import type { ShapeType } from '@/utils/enums'

import expressionPropertyFactory from '@/utils/expressions/ExpressionValueFactory'
import { BaseInterface } from '@/utils/expressions/shapes/BaseInterface'

export class TransformInterface extends BaseInterface {
  override prop?: SVGTransformData | SVGFillStyleData = undefined
  ty?: ShapeType

  get anchorPoint() {
    return expressionPropertyFactory(this.prop?.transform?.mProps.a)
  }

  get opacity() {
    return expressionPropertyFactory(this.prop?.transform?.mProps.o)
  }

  get position() {
    return expressionPropertyFactory(this.prop?.transform?.mProps.p)
  }

  get rotation() {
    return expressionPropertyFactory(this.prop?.transform?.mProps.r)
  }

  get scale() {
    return expressionPropertyFactory(this.prop?.transform?.mProps.s)
  }

  get skew() {
    return expressionPropertyFactory(this.prop?.transform?.mProps.sk)
  }

  get skewAxis() {
    return expressionPropertyFactory(this.prop?.transform?.mProps.sa)
  }

  override getInterface(value: string | number) {
    if (this.shape?.a?.ix === value || value === 'Anchor Point') {
      return this.anchorPoint
    }
    if (this.shape?.o?.ix === value || value === 'Opacity') {
      return this.opacity
    }
    if (this.shape?.p?.ix === value || value === 'Position') {
      return this.position
    }
    if (this.shape?.r?.ix === value || value === 'Rotation' || value === 'ADBE Vector Rotation') {
      return this.rotation
    }
    if (this.shape?.s?.ix === value || value === 'Scale') {
      return this.scale
    }
    if (this.shape?.sk?.ix === value || value === 'Skew') {
      return this.skew
    }
    if (this.shape?.sa?.ix === value || value === 'Skew Axis') {
      return this.skewAxis
    }

    return null
  }
}