import type { TransformProperty } from '@/utils/TransformProperty'

import expressionPropertyFactory from '@/utils/expressions/ExpressionValueFactory'

export default class TransformExpressionInterface {
  transform: TransformProperty

  get anchorPoint() {
    return expressionPropertyFactory(this.transform.a)
  }


  get opacity() {
    return expressionPropertyFactory(this.transform.o)
  }

  get orientation() {
    return expressionPropertyFactory(this.transform.or)
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
    return expressionPropertyFactory(this.transform.r ?? this.transform.rz)
  }

  get scale() {
    return expressionPropertyFactory(this.transform.s)
  }

  get skew() {
    return expressionPropertyFactory(this.transform.sk)
  }

  get skewAxis() {
    return expressionPropertyFactory(this.transform.sa)
  }

  get xPosition() {
    return expressionPropertyFactory(this.transform.px)
  }

  get xRotation() {
    return expressionPropertyFactory(this.transform.rx)
  }

  get yPosition() {
    return expressionPropertyFactory(this.transform.py)
  }


  get yRotation() {
    return expressionPropertyFactory(this.transform.ry)
  }

  get zPosition() {
    return expressionPropertyFactory(this.transform.pz)
  }

  get zRotation() {
    return expressionPropertyFactory(this.transform.rz ?? this.transform.r)
  }

  private _px

  private _py

  private _pz

  private _transformFactory

  constructor (transform: TransformProperty) {
    this.transform = transform

    if (transform.p) {
      this._transformFactory = expressionPropertyFactory(transform.p)
    } else {
      this._px = expressionPropertyFactory(transform.px)
      this._py = expressionPropertyFactory(transform.py)
      if (transform.pz) {
        this._pz = expressionPropertyFactory(transform.pz)
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
