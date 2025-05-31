import type { TransformProperty } from '@/utils/TransformProperty'

import ExpressionPropertyInterface from '@/utils/expressions/ExpressionValueFactory'

export default class TransformExpressionInterface {
  transform: TransformProperty

  get anchorPoint() {
    return ExpressionPropertyInterface(this.transform.a)
  }


  get opacity() {
    return ExpressionPropertyInterface(this.transform.o)
  }

  get orientation() {
    return ExpressionPropertyInterface(this.transform.or)
  }

  get position() {
    if (this.transform.p) {
      return this._transformFactory?.()
    }

    return [
      this._px?.(),
      this._py?.(),
      this._pz?.() ?? 0]
  }

  get rotation() {
    return ExpressionPropertyInterface(this.transform.r ?? this.transform.rz)
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
    return ExpressionPropertyInterface(this.transform.rz ?? this.transform.r)
  }

  private _px

  private _py

  private _pz

  private _transformFactory

  constructor (transform: TransformProperty) {
    this.transform = transform

    if (transform.p) {
      this._transformFactory = ExpressionPropertyInterface(transform.p)
    } else {
      this._px = ExpressionPropertyInterface(transform.px)
      this._py = ExpressionPropertyInterface(transform.py)
      if (transform.pz) {
        this._pz = ExpressionPropertyInterface(transform.pz)
      }
    }

  }

  getInterface (name: string | number) {
    switch (name) {
      case 'scale':
      case 'Scale':
      case 'ADBE Scale':
      case 6: {
        return this.scale
      }
      case 'rotation':
      case 'Rotation':
      case 'ADBE Rotation':
      case 'ADBE Rotate Z':
      case 10: {
        return this.rotation
      }
      case 'ADBE Rotate X': {
        return this.xRotation
      }
      case 'ADBE Rotate Y': {
        return this.yRotation
      }
      case 'position':
      case 'Position':
      case 'ADBE Position':
      case 2: {
        return this.position
      }
      case 'ADBE Position_0': {
        return this.xPosition
      }
      case 'ADBE Position_1': {
        return this.yPosition
      }
      case 'ADBE Position_2': {
        return this.zPosition
      }
      case 'anchorPoint':
      case 'AnchorPoint':
      case 'Anchor Point':
      case 'ADBE AnchorPoint':
      case 1: {
        return this.anchorPoint
      }
      case 'opacity':
      case 'Opacity':
      case 11: {
        return this.opacity
      }
      default: {
        return null
      }
    }
  }
}
