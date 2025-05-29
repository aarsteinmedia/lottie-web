import type { ElementInterfaceIntersect } from '@/types'

import { getDescriptor } from '@/utils'
import MaskManagerInterface from '@/utils/expressions/MaskInterface'
import TransformExpressionInterface from '@/utils/expressions/TransformInterface'
import Matrix from '@/utils/Matrix'

export default class LayerExpressionInterface {
  _elem: ElementInterfaceIntersect

  get active() {
    return this._elem.isInRange
  }

  get hasParent() {
    return Boolean(this._elem.hierarchy?.length)
  }

  get parent() {
    return this._elem.hierarchy?.[0].layerInterface
  }

  get transform() {
    return this.transformInterface
  }

  constructor (elem: ElementInterfaceIntersect) {
    this.sourceRectAtTime = elem.sourceRectAtTime.bind(elem)
    this._elem = elem
    this.transformInterface = TransformExpressionInterface(elem.finalTransform.mProp)
    const anchorPointDescriptor = getDescriptor(this.transformInterface, 'anchorPoint')

    this.anchor_point = anchorPointDescriptor
    this.anchorPoint = anchorPointDescriptor
    this.opacity = getDescriptor(this.transformInterface, 'opacity')
    this.position = getDescriptor(this.transformInterface, 'position')
    this.rotation = getDescriptor(this.transformInterface, 'rotation')
    this.scale = getDescriptor(this.transformInterface, 'scale')

    this.toComp = this.toWorld

    this.startTime = elem.data.st
    this.index = elem.data.ind
    this.source = elem.data.refId
    this.height = elem.data.ty === 0 ? elem.data.h : 100
    this.width = elem.data.ty === 0 ? elem.data.w : 100
    this.inPoint = elem.data.ip / elem.comp.globalData.frameRate
    this.outPoint = elem.data.op / elem.comp.globalData.frameRate
    this._name = elem.data.nm
  }

  applyPoint(matrix, arr) {
    if (this._elem.hierarchy?.length) {
      let i

      const len = this._elem.hierarchy.length

      for (i = 0; i < len; i += 1) {
        this._elem.hierarchy[i].finalTransform.mProp.applyToMatrix(matrix)
      }
    }

    return matrix.applyToPointArray(
      arr[0], arr[1], arr[2] || 0
    )
  }

  fromComp(arr) {
    const toWorldMat = new Matrix()

    toWorldMat.reset()
    this._elem.finalTransform.mProp.applyToMatrix(toWorldMat)
    if (this._elem.hierarchy?.length) {
      let i

      const len = this._elem.hierarchy.length

      for (i = 0; i < len; i += 1) {
        this._elem.hierarchy[i].finalTransform.mProp.applyToMatrix(toWorldMat)
      }

      return toWorldMat.inversePoint(arr)
    }

    return toWorldMat.inversePoint(arr)
  }

  fromWorld(arr, time) {
    const toWorldMat = this.getMatrix(time)

    return this.invertPoint(toWorldMat, arr)
  }

  fromWorldVec(arr, time) {
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
      const transformMat = this._elem.finalTransform.mProp

      transformMat.applyToMatrix(toWorldMat)

    } else {
      const propMatrix = this._elem.finalTransform.mProp.getValueAtTime(time)

      propMatrix.clone(toWorldMat)
    }

    return toWorldMat
  }

  invertPoint(matrix, arr) {
    if (this._elem.hierarchy?.length) {
      let i

      const len = this._elem.hierarchy.length

      for (i = 0; i < len; i += 1) {
        this._elem.hierarchy[i].finalTransform.mProp.applyToMatrix(matrix)
      }
    }

    return matrix.inversePoint(arr)
  }

  registerEffectsInterface(effects) {
    this.effect = effects
  }

  registerMaskInterface(maskManager) {
    this.mask = new MaskManagerInterface(maskManager, elem)
  }

  sampleImage() {
    return [1,
      1,
      1,
      1]
  }

  toComp(_arr, _time) {
    throw new Error('Method is not implemented')
  }

  toWorld(arr, time) {
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
