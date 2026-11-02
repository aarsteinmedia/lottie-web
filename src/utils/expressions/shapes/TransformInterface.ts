import type { SVGFillStyleData } from '@/elements/helpers/shapes/SVGFillStyleData'
import type { SVGTransformData } from '@/elements/helpers/shapes/SVGTransformData'
import type { ShapeType } from '@/utils/enums'

import { expressionPropertyFactory } from '@/utils/expressions/ExpressionPropertyFactory'
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
    const normalizedValue = String(value).toLowerCase().trim()

    if (this.shape?.a?.ix === value || normalizedValue === 'anchor point') {
      return this.anchorPoint
    }
    if (this.shape?.o?.ix === value || normalizedValue === 'opacity') {
      return this.opacity
    }
    if (this.shape?.p?.ix === value || normalizedValue === 'position') {
      return this.position
    }
    if (this.shape?.r?.ix === value || normalizedValue.endsWith('rotation')) {
      return this.rotation
    }
    if (this.shape?.s?.ix === value || normalizedValue === 'scale') {
      return this.scale
    }
    if (this.shape?.sk?.ix === value || normalizedValue === 'skew') {
      return this.skew
    }
    if (this.shape?.sa?.ix === value || normalizedValue === 'skew axis') {
      return this.skewAxis
    }

    return null
  }
}