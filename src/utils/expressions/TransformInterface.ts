import type { Vector2 } from '@/types'
import type TransformProperty from '@/utils/TransformProperty'

import ExpressionPropertyInterface from '@/utils/expressions/ExpressionValueFactory'

import { MultiDimensionalProperty, ValueProperty } from '../Properties'

export default class TransformExpressionInterface {
  transform: TransformProperty
  get anchorPoint() {
    return ExpressionPropertyInterface(this.transform.a) as unknown as Vector2
  }
  get opacity() {
    return ExpressionPropertyInterface(this.transform.o)
  }
  get orientation() {
    return ExpressionPropertyInterface(this.transform.or)
  }
  get position() {
    if (this.transform.p) {
      return this._transformFactory()
    }
    return [this._px(), this._py(), this._pz()]
  }
  get rotation() {
    return ExpressionPropertyInterface(this.transform.r || this.transform.rz)
  }
  get scale() {
    return ExpressionPropertyInterface(this.transform.s)
  }

  get skew() {
    return ExpressionPropertyInterface(this.transform.sk)
  }

  get skewAxis() {
    return ExpressionPropertyInterface(this.transform.sa)
  }

  get xPosition() {
    return ExpressionPropertyInterface(this.transform.px)
  }

  get xRotation() {
    return ExpressionPropertyInterface(this.transform.rx)
  }
  get yPosition() {
    return ExpressionPropertyInterface(this.transform.py)
  }
  get yRotation() {
    return ExpressionPropertyInterface(this.transform.ry)
  }
  get zPosition() {
    return ExpressionPropertyInterface(this.transform.pz)
  }
  get zRotation() {
    return ExpressionPropertyInterface(this.transform.rz || this.transform.r)
  }
  constructor(transform: TransformProperty) {
    this.transform = transform

    if (this.transform.p) {
      this._transformFactory = ExpressionPropertyInterface(this.transform.p)
    } else {
      this._px = ExpressionPropertyInterface(this.transform.px)
      this._py = ExpressionPropertyInterface(this.transform.py)
      if (this.transform.pz) {
        this._pz = ExpressionPropertyInterface(this.transform.pz)
      }
    }
  }

  _px() {
    throw new Error(`${this.constructor.name}: Method _px is not implemented`)
  }
  _py() {
    throw new Error(`${this.constructor.name}: Method _py is not implemented`)
  }
  _pz() {
    throw new Error(`${this.constructor.name}: Method _pz is not implemented`)
  }

  _transformFactory(): ValueProperty | MultiDimensionalProperty<number[]> {
    throw new Error(
      `${this.constructor.name}: Method _transformFactory is not implemented`
    )
  }

  getProperty(name: string | number) {
    switch (name) {
      case 'scale':
      case 'Scale':
      case 'ADBE Scale':
      case 6:
        return this.scale
      case 'rotation':
      case 'Rotation':
      case 'ADBE Rotation':
      case 'ADBE Rotate Z':
      case 10:
        return this.rotation
      case 'ADBE Rotate X':
        return this.xRotation
      case 'ADBE Rotate Y':
        return this.yRotation
      case 'position':
      case 'Position':
      case 'ADBE Position':
      case 2:
        return this.position
      case 'ADBE Position_0':
        return this.xPosition
      case 'ADBE Position_1':
        return this.yPosition
      case 'ADBE Position_2':
        return this.zPosition
      case 'anchorPoint':
      case 'AnchorPoint':
      case 'Anchor Point':
      case 'ADBE AnchorPoint':
      case 1:
        return this.anchorPoint
      case 'opacity':
      case 'Opacity':
      case 11:
        return this.opacity
      default:
        return null
    }
  }
}
