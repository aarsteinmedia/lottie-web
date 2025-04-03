import MaskElement from '@/elements/MaskElement'
import { ElementInterfaceIntersect, Vector4 } from '@/types'
import MaskManager from '@/utils/expressions/MaskInterface'
import TransformExpressionInterface from '@/utils/expressions/TransformInterface'
// import {
//   getDescriptor,
// } from '../functionExtensions';
import Matrix from '@/utils/Matrix'

export default class LayerExpressionInterface {
  _elem: ElementInterfaceIntersect
  _name: string

  active?: boolean

  hasParent: boolean

  height?: number

  index?: number

  inPoint: number

  mask?: MaskManager

  opacity: any

  outPoint: number

  parent?: LayerExpressionInterface

  source?: string

  startTime: number
  transformInterface?: TransformExpressionInterface

  width?: number

  constructor(elem: ElementInterfaceIntersect) {
    this._elem = elem
    this.toComp = this.toWorld
    this.sourceRectAtTime = elem.sourceRectAtTime.bind(elem)

    if (elem.finalTransform?.mProp) {
      this.transformInterface = new TransformExpressionInterface(
        elem.finalTransform.mProp
      )
    }

    const { anchorPoint, opacity, position, rotation, scale } =
      TransformExpressionInterface.prototype

    this.anchorPointDescriptor = anchorPoint

    this.startTime = elem.data.st
    this.index = elem.data.ind
    this.source = elem.data.refId
    this.height = elem.data.ty === 0 ? elem.data.h : 100
    this.width = elem.data.ty === 0 ? elem.data.w : 100
    this.inPoint = elem.data.ip / (elem.comp?.globalData.frameRate || 60)
    this.outPoint = elem.data.op / (elem.comp?.globalData.frameRate || 60)
    this._name = elem.data.nm

    this.anchor_point = this.anchorPointDescriptor
    this.anchorPoint = this.anchorPointDescriptor

    this.hasParent = !!elem.hierarchy?.length
    this.active = this._elem.isInRange

    this.opacity = opacity
    this.parent = elem.hierarchy?.[0].layerInterface
    this.position = position
    this.rotation = rotation
    this.scale = scale
    this.transform = this.transformInterface
  }

  anchorPointDescriptor() {
    throw new Error(
      `${this.constructor.name}: Method anchorPointDescriptor is not implemented`
    )
  }

  public applyPoint(matrix: Matrix, arr: number[]) {
    if (this._elem.hierarchy && this._elem.hierarchy.length) {
      const { length } = this._elem.hierarchy
      for (let i = 0; i < length; i += 1) {
        this._elem.hierarchy[i].finalTransform?.mProp.applyToMatrix(matrix)
      }
    }
    return matrix.applyToPointArray(arr[0], arr[1], arr[2] || 0)
  }

  public fromComp(arr: number[]) {
    const toWorldMat = new Matrix()
    toWorldMat.reset()
    this._elem.finalTransform?.mProp.applyToMatrix(toWorldMat)
    if (this._elem.hierarchy && this._elem.hierarchy.length) {
      const { length } = this._elem.hierarchy
      for (let i = 0; i < length; i += 1) {
        this._elem.hierarchy[i].finalTransform?.mProp.applyToMatrix(toWorldMat)
      }
      return toWorldMat.inversePoint(arr)
    }
    return toWorldMat.inversePoint(arr)
  }
  public fromWorld(arr: number[], time?: number) {
    const toWorldMat = this.getMatrix(time)
    return this.invertPoint(toWorldMat, arr)
  }
  public fromWorldVec(arr: number[], time?: number) {
    const toWorldMat = this.getMatrix(time)
    toWorldMat.props[12] = 0
    toWorldMat.props[13] = 0
    toWorldMat.props[14] = 0
    return this.invertPoint(toWorldMat, arr)
  }
  public getMatrix(time?: number) {
    const toWorldMat = new Matrix()
    if (time !== undefined) {
      const propMatrix = this._elem.finalTransform?.mProp.getValueAtTime(time)
      propMatrix.clone(toWorldMat)
    } else {
      const transformMat = this._elem.finalTransform?.mProp
      transformMat?.applyToMatrix(toWorldMat)
    }
    return toWorldMat
  }
  public invertPoint(matrix: Matrix, arr: number[]) {
    if (this._elem.hierarchy && this._elem.hierarchy.length) {
      let i
      const len = this._elem.hierarchy.length
      for (i = 0; i < len; i += 1) {
        this._elem.hierarchy[i].finalTransform?.mProp.applyToMatrix(matrix)
      }
    }
    return matrix.inversePoint(arr)
  }
  registerEffectsInterface(effects) {
    this.effect = effects
  }
  registerMaskInterface(maskManager: MaskElement) {
    this.mask = new MaskManager(maskManager)
  }
  public sampleImage(): Vector4 {
    return [1, 1, 1, 1]
  }

  sourceRectAtTime() {
    throw new Error(
      `${this.constructor.name}: Method sourceRectAtTime is not implemented`
    )
  }
  public toComp(_arr: number[], _time?: number) {
    throw new Error(
      `${this.constructor.name}: Method toComp is not implemented`
    )
  }
  public toWorld(arr: number[], time?: number) {
    const toWorldMat = this.getMatrix(time)
    return this.applyPoint(toWorldMat, arr)
  }
  public toWorldVec(arr: number[], time?: number) {
    const toWorldMat = this.getMatrix(time)
    toWorldMat.props[12] = 0
    toWorldMat.props[13] = 0
    toWorldMat.props[14] = 0
    return this.applyPoint(toWorldMat, arr)
  }
}

// const LayerInterfaceFactory = (name: string | number, elem: ElementInterfaceIntersect) => {
//   switch (name) {
//     case 'ADBE Root Vectors Group':
//     case 'Contents':
//     case 2:
//       return new LayerExpressionInterface(elem).shapeInterface
//     case 1:
//     case 6:
//     case 'Transform':
//     case 'transform':
//     case 'ADBE Transform Group':
//       return this.transformInterface
//     case 4:
//     case 'ADBE Effect Parade':
//     case 'effects':
//     case 'Effects':
//       return _thisLayerFunction.effect
//     case 'ADBE Text Properties':
//       return _thisLayerFunction.textInterface
//     default:
//       return null
//   }
// }
