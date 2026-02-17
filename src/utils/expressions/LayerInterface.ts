/* eslint-disable @typescript-eslint/naming-convention */
import type { CVMaskElement } from '@/elements/canvas/CVMaskElement'
import type { MaskElement } from '@/elements/MaskElement'
import type {
  ElementInterfaceIntersect, ExpressionInterface, SourceRect
} from '@/types'
import type { GroupEffectInterface } from '@/utils/expressions/EffectInterface'
import type { ShapeExpressionInterface } from '@/utils/expressions/shapes/ShapeInterface'
import type { TextExpressionInterface } from '@/utils/expressions/TextInterface'

import { MaskManagerInterface } from '@/utils/expressions/MaskInterface'
import { TransformExpressionInterface } from '@/utils/expressions/TransformInterface'
import { Matrix } from '@/utils/Matrix'

export class LayerExpressionInterface {
  _elem: ElementInterfaceIntersect
  _name?: string
  anchor_point: ExpressionInterface
  anchorPoint: ExpressionInterface
  content?: ShapeExpressionInterface
  effect: ExpressionInterface
  height?: number
  index?: number
  inPoint: number
  mask?: MaskManagerInterface
  opacity: ExpressionInterface
  outPoint: number
  position: ExpressionInterface
  rotation: ExpressionInterface
  scale: ExpressionInterface
  shapeInterface?: ShapeExpressionInterface
  source?: string
  sourceRectAtTime: () => SourceRect | null
  startTime: number
  text?: TextExpressionInterface
  textInterface?: TextExpressionInterface
  transformInterface: TransformExpressionInterface
  width?: number

  get active() {
    return this._elem.isInRange
  }

  get hasParent() {
    return Boolean(this._elem.hierarchy?.length)
  }

  get parent(): LayerExpressionInterface | null {
    return this._elem.hierarchy?.[0]?.layerInterface ?? null
  }

  get transform() {
    return this.transformInterface
  }

  constructor(elem: ElementInterfaceIntersect) {
    this.sourceRectAtTime = elem.sourceRectAtTime.bind(elem)
    this._elem = elem

    if (!elem.finalTransform) {
      throw new Error(`FinalTransform is not iplemented in ${elem.constructor.name}`)
    }

    this.transformInterface = new TransformExpressionInterface(elem.finalTransform.mProp)
    const {
      anchorPoint, opacity, position, rotation, scale
    } = this.transformInterface

    this.anchor_point = anchorPoint
    this.anchorPoint = anchorPoint
    this.opacity = opacity
    this.position = position
    this.rotation = rotation
    this.scale = scale

    this.toComp = this.toWorld

    const { frameRate } = elem.comp?.globalData ?? { frameRate: 60 }

    this.startTime = elem.data.st
    this.index = elem.data.ind
    this.source = elem.data.refId
    this.height = elem.data.ty === 0 ? elem.data.h : 100
    this.width = elem.data.ty === 0 ? elem.data.w : 100
    this.inPoint = elem.data.ip / frameRate
    this.outPoint = elem.data.op / frameRate
    this._name = elem.data.nm
  }

  applyPoint(matrix: Matrix, arr: number[]) {
    if (this._elem.hierarchy?.length) {

      const { length } = this._elem.hierarchy

      for (let i = 0; i < length; i++) {
        this._elem.hierarchy[i]?.finalTransform?.mProp.applyToMatrix(matrix)
      }
    }

    return matrix.applyToPointArray(
      arr[0] ?? 0, arr[1] ?? 0, arr[2] ?? 0
    )
  }

  fromComp(arr: number[]) {
    const toWorldMat = new Matrix()

    toWorldMat.reset()
    this._elem.finalTransform?.mProp.applyToMatrix(toWorldMat)
    if (this._elem.hierarchy?.length) {
      let i

      const len = this._elem.hierarchy.length

      for (i = 0; i < len; i += 1) {
        this._elem.hierarchy[i]?.finalTransform?.mProp.applyToMatrix(toWorldMat)
      }

      return toWorldMat.inversePoint(arr)
    }

    return toWorldMat.inversePoint(arr)
  }

  fromWorld(arr: number[], time: number) {
    const toWorldMat = this.getMatrix(time)

    return this.invertPoint(toWorldMat, arr)
  }

  fromWorldVec(arr: number[], time: number) {
    const toWorldMat = this.getMatrix(time)

    toWorldMat.props[12] = 0
    toWorldMat.props[13] = 0
    toWorldMat.props[14] = 0

    return this.invertPoint(toWorldMat, arr)
  }

  getInterface(name: string | number) {
    switch (name) {
      case 'ADBE Root Vectors Group':
      case 'Contents':
      case 2: {
        return this.shapeInterface
      }
      case 1:
      case 6:
      case 'Transform':
      case 'transform':
      case 'ADBE Transform Group': {
        return this.transformInterface
      }
      case 4:
      case 'ADBE Effect Parade':
      case 'effects':
      case 'Effects': {
        return this.effect
      }
      case 'ADBE Text Properties': {
        return this.textInterface
      }
      default: {
        return null
      }
    }
  }

  getMatrix(time?: number) {
    const toWorldMat = new Matrix()

    if (time === undefined) {
      const transformMat = this._elem.finalTransform?.mProp

      transformMat?.applyToMatrix(toWorldMat)

    } else {
      const propMatrix = this._elem.finalTransform?.mProp.getValueAtTime(time) as Matrix

      propMatrix.clone(toWorldMat)
    }

    return toWorldMat
  }

  invertPoint(matrix: Matrix, arr: number[]) {
    if (this._elem.hierarchy?.length) {

      const { length } = this._elem.hierarchy

      for (let i = 0; i < length; i++) {
        this._elem.hierarchy[i]?.finalTransform?.mProp.applyToMatrix(matrix)
      }
    }

    return matrix.inversePoint(arr)
  }

  registerEffectsInterface(effects: null | GroupEffectInterface) {
    this.effect = effects
  }

  registerMaskInterface(maskManager: MaskElement | CVMaskElement) {
    this.mask = new MaskManagerInterface(maskManager, this._elem)
  }

  sampleImage() {
    return [1,
      1,
      1,
      1]
  }

  toComp(_arr: number[], _time: number) {
    throw new Error('Method is not implemented')
  }

  toWorld(arr: number[], time: number) {
    const toWorldMat = this.getMatrix(time)

    return this.applyPoint(toWorldMat, arr)
  }

  toWorldVec(arr: number[], time?: number) {
    const toWorldMat = this.getMatrix(time)

    toWorldMat.props[12] = 0
    toWorldMat.props[13] = 0
    toWorldMat.props[14] = 0

    return this.applyPoint(toWorldMat, arr)
  }
}
