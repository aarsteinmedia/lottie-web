import { getDescriptor } from '@/utils'
import Matrix from '@/utils/Matrix'

import MaskManagerInterface from './MaskInterface'
import TransformExpressionInterface from './TransformInterface'

const LayerExpressionInterface = (function () {
  function getMatrix(time) {
    const toWorldMat = new Matrix()

    if (time !== undefined) {
      const propMatrix = this._elem.finalTransform.mProp.getValueAtTime(time)

      propMatrix.clone(toWorldMat)
    } else {
      const transformMat = this._elem.finalTransform.mProp

      transformMat.applyToMatrix(toWorldMat)
    }

    return toWorldMat
  }

  function toWorldVec(arr, time) {
    const toWorldMat = this.getMatrix(time)

    toWorldMat.props[12] = 0
    toWorldMat.props[13] = 0
    toWorldMat.props[14] = 0

    return this.applyPoint(toWorldMat, arr)
  }

  function toWorld(arr, time) {
    const toWorldMat = this.getMatrix(time)

    return this.applyPoint(toWorldMat, arr)
  }

  function fromWorldVec(arr, time) {
    const toWorldMat = this.getMatrix(time)

    toWorldMat.props[12] = 0
    toWorldMat.props[13] = 0
    toWorldMat.props[14] = 0

    return this.invertPoint(toWorldMat, arr)
  }

  function fromWorld(arr, time) {
    const toWorldMat = this.getMatrix(time)

    return this.invertPoint(toWorldMat, arr)
  }

  function applyPoint(matrix, arr) {
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

  function invertPoint(matrix, arr) {
    if (this._elem.hierarchy?.length) {
      let i

      const len = this._elem.hierarchy.length

      for (i = 0; i < len; i += 1) {
        this._elem.hierarchy[i].finalTransform.mProp.applyToMatrix(matrix)
      }
    }

    return matrix.inversePoint(arr)
  }

  function fromComp(arr) {
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

  function sampleImage() {
    return [1,
      1,
      1,
      1]
  }

  return function (elem) {
    let transformInterface

    function _registerMaskInterface(maskManager) {
      _thisLayerFunction.mask = new MaskManagerInterface(maskManager, elem)
    }
    function _registerEffectsInterface(effects) {
      _thisLayerFunction.effect = effects
    }

    function _thisLayerFunction(name) {
      switch (name) {
        case 'ADBE Root Vectors Group':
        case 'Contents':
        case 2: {
          return _thisLayerFunction.shapeInterface
        }
        case 1:
        case 6:
        case 'Transform':
        case 'transform':
        case 'ADBE Transform Group': {
          return transformInterface
        }
        case 4:
        case 'ADBE Effect Parade':
        case 'effects':
        case 'Effects': {
          return _thisLayerFunction.effect
        }
        case 'ADBE Text Properties': {
          return _thisLayerFunction.textInterface
        }
        default: {
          return null
        }
      }
    }
    _thisLayerFunction.getMatrix = getMatrix
    _thisLayerFunction.invertPoint = invertPoint
    _thisLayerFunction.applyPoint = applyPoint
    _thisLayerFunction.toWorld = toWorld
    _thisLayerFunction.toWorldVec = toWorldVec
    _thisLayerFunction.fromWorld = fromWorld
    _thisLayerFunction.fromWorldVec = fromWorldVec
    _thisLayerFunction.toComp = toWorld
    _thisLayerFunction.fromComp = fromComp
    _thisLayerFunction.sampleImage = sampleImage
    _thisLayerFunction.sourceRectAtTime = elem.sourceRectAtTime.bind(elem)
    _thisLayerFunction._elem = elem
    transformInterface = TransformExpressionInterface(elem.finalTransform.mProp)
    const anchorPointDescriptor = getDescriptor(transformInterface, 'anchorPoint')

    Object.defineProperties(_thisLayerFunction, {
      active: {
        get () {
          return elem.isInRange
        },
      },
      anchor_point: anchorPointDescriptor,
      anchorPoint: anchorPointDescriptor,
      hasParent: {
        get () {
          return elem.hierarchy.length
        },
      },
      opacity: getDescriptor(transformInterface, 'opacity'),
      parent: {
        get () {
          return elem.hierarchy[0].layerInterface
        },
      },
      position: getDescriptor(transformInterface, 'position'),
      rotation: getDescriptor(transformInterface, 'rotation'),
      scale: getDescriptor(transformInterface, 'scale'),
      transform: {
        get () {
          return transformInterface
        },
      },
    })

    _thisLayerFunction.startTime = elem.data.st
    _thisLayerFunction.index = elem.data.ind
    _thisLayerFunction.source = elem.data.refId
    _thisLayerFunction.height = elem.data.ty === 0 ? elem.data.h : 100
    _thisLayerFunction.width = elem.data.ty === 0 ? elem.data.w : 100
    _thisLayerFunction.inPoint = elem.data.ip / elem.comp.globalData.frameRate
    _thisLayerFunction.outPoint = elem.data.op / elem.comp.globalData.frameRate
    _thisLayerFunction._name = elem.data.nm

    _thisLayerFunction.registerMaskInterface = _registerMaskInterface
    _thisLayerFunction.registerEffectsInterface = _registerEffectsInterface

    return _thisLayerFunction
  }
}())

export default LayerExpressionInterface
