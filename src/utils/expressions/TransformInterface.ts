import type TransformProperty from '@/utils/TransformProperty'

import ExpressionPropertyInterface from '@/utils/expressions/ExpressionValueFactory'

export default class TransformExpressionInterface {
  _px?: ReturnType<typeof ExpressionPropertyInterface>
  _py?: ReturnType<typeof ExpressionPropertyInterface>
  _pz?: ReturnType<typeof ExpressionPropertyInterface>
  _transformFactory?: ReturnType<typeof ExpressionPropertyInterface>
  anchorPoint: ReturnType<typeof ExpressionPropertyInterface>
  opacity: ReturnType<typeof ExpressionPropertyInterface>
  orientation: ReturnType<typeof ExpressionPropertyInterface>
  rotation: ReturnType<typeof ExpressionPropertyInterface>
  scale: ReturnType<typeof ExpressionPropertyInterface>
  skew: ReturnType<typeof ExpressionPropertyInterface>
  skewAxis: ReturnType<typeof ExpressionPropertyInterface>
  transform: TransformProperty
  xRotation: ReturnType<typeof ExpressionPropertyInterface>
  yRotation: ReturnType<typeof ExpressionPropertyInterface>
  zRotation: ReturnType<typeof ExpressionPropertyInterface>
  get position() {
    if (this.transform.p) {
      return this._transformFactory?.()
    }
    return [this._px?.() || 0, this._py?.() || 0, this._pz?.() || 0]
  }

  get xPosition() {
    return ExpressionPropertyInterface(this.transform.px)
  }

  get yPosition() {
    return ExpressionPropertyInterface(this.transform.py)
  }

  get zPosition() {
    return ExpressionPropertyInterface(this.transform.pz)
  }

  constructor(transform: TransformProperty) {
    this.transform = transform

    this.rotation = ExpressionPropertyInterface(
      this.transform.r || this.transform.rz
    )
    this.zRotation = ExpressionPropertyInterface(
      this.transform.rz || this.transform.r
    )
    this.xRotation = ExpressionPropertyInterface(this.transform.rx)
    this.yRotation = ExpressionPropertyInterface(this.transform.ry)
    this.scale = ExpressionPropertyInterface(this.transform.s)
    this.anchorPoint = ExpressionPropertyInterface(this.transform.a)
    this.opacity = ExpressionPropertyInterface(this.transform.o)
    this.skew = ExpressionPropertyInterface(this.transform.sk)
    this.skewAxis = ExpressionPropertyInterface(this.transform.sa)
    this.orientation = ExpressionPropertyInterface(this.transform.or)

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
