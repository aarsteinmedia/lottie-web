import type {
  Caching, ElementInterfaceIntersect, ExpressionProperty, Vector3
} from '@/types'
import type { KeyframedValueProperty } from '@/utils/Properties'
import type { ShapeProperty } from '@/utils/shapes/properties/ShapeProperty'
import type ShapePath from '@/utils/shapes/ShapePath'

import { extendPrototype, isArrayOfNum } from '@/utils'
import { ArrayType } from '@/utils/enums'
import expressionHelpers from '@/utils/expressions/expressionHelpers'
import ExpressionManager from '@/utils/expressions/ExpressionManager'
import ShapeExpressions from '@/utils/expressions/ShapeExpressions'
import { createTypedArray } from '@/utils/helpers/arrays'
import { initialDefaultFrame } from '@/utils/helpers/constants'
import Matrix from '@/utils/Matrix'
import shapePool from '@/utils/pooling/ShapePool'
import PropertyFactory from '@/utils/PropertyFactory'
import ShapePropertyFactory from '@/utils/shapes/properties'
import TransformPropertyFactory, { type TransformProperty } from '@/utils/TransformProperty'

function loopOut(
  this: KeyframedValueProperty, typeFromProps: string, durationFromProps: number, durationFlag?: boolean
) {
  if (!this.k || this.keyframes?.length === 0) {
    return this.pv
  }

  let duration = durationFromProps

  const {
    comp, elem, keyframes = [], pv
  } = this

  if (!elem?.comp) {
    throw new Error('Element is not implemented')
  }

  if (!comp) {
    throw new Error('Comp is not implemented')
  }

  const type = typeFromProps ? typeFromProps.toLowerCase() : '',
    currentFrame = comp.renderedFrame ?? 0,
    lastKeyFrame = keyframes[keyframes.length - 1].t,
    { frameRate } = elem.comp.globalData ?? { frameRate: 60 }

  if (currentFrame <= lastKeyFrame) {
    return pv
  }
  let cycleDuration,
    firstKeyFrame = 0

  if (durationFlag) {
    if (duration) {
      cycleDuration = Math.abs(lastKeyFrame - frameRate * duration)

    } else {
      cycleDuration = Math.max(0, lastKeyFrame - elem.data.ip)
    }

  } else {
    // firstKeyFrame = lastKeyFrame - cycleDuration

    if (!duration || duration > keyframes.length - 1) {
      duration = keyframes.length - 1
    }
    firstKeyFrame = keyframes[keyframes.length - 1 - duration].t
    cycleDuration = lastKeyFrame - firstKeyFrame
  }
  let i

  let len
  let ret

  switch (type) {
    case 'pingpong': {
      const iterations = Math.floor((currentFrame - firstKeyFrame) / cycleDuration)

      if (iterations % 2 !== 0) {
        return this.getValueAtTime((cycleDuration - (currentFrame - firstKeyFrame) % cycleDuration + firstKeyFrame) / frameRate, 0)
      }

      break
    }
    case 'offset': {
      const initV = this.getValueAtTime(firstKeyFrame / frameRate, 0),

        endV = this.getValueAtTime(lastKeyFrame / frameRate, 0),
        current = this.getValueAtTime(((currentFrame - firstKeyFrame) % cycleDuration + firstKeyFrame) / frameRate, 0),
        repeats = Math.floor((currentFrame - firstKeyFrame) / cycleDuration)

      if (isArrayOfNum(pv) && isArrayOfNum(initV) && isArrayOfNum(endV) && isArrayOfNum(current)) {
        ret = Array.from({ length: initV.length })
        len = ret.length
        for (i = 0; i < len; i++) {
          ret[i] = (endV[i] - initV[i]) * repeats + current[i]
        }

        return ret as number[]
      }

      return (endV as number - (initV as number)) * repeats + (current as number)
    }
    case 'continue': {
      const lastValue = this.getValueAtTime(lastKeyFrame / frameRate, 0)

      const nextLastValue = this.getValueAtTime((lastKeyFrame - 0.001) / frameRate, 0)

      if (isArrayOfNum(pv) && isArrayOfNum(lastValue) && isArrayOfNum(nextLastValue)) {
        ret = Array.from({ length: lastValue.length })
        len = ret.length
        for (i = 0; i < len; i += 1) {
          ret[i] = lastValue[i] + (lastValue[i] - nextLastValue[i]) * ((currentFrame - lastKeyFrame) / frameRate) / 0.0005
        }

        return ret as number[]
      }

      return lastValue as number + (lastValue as number - (nextLastValue as number)) * ((currentFrame - lastKeyFrame) / 0.001)
    }
    default:
    // Do nothing
  }
  return this.getValueAtTime((((currentFrame - firstKeyFrame) % cycleDuration + firstKeyFrame)) / frameRate, 0); // eslint-disable-line

}

function loopIn(
  this: KeyframedValueProperty, typeFromProps: string, durationFromProps: number, durationFlag?: boolean
) {
  if (!this.k) {
    return this.pv
  }

  let duration = durationFromProps

  const {
    comp, elem, keyframes = [], pv
  } = this

  if (!elem?.comp) {
    throw new Error('Element is not implemented')
  }

  if (!comp) {
    throw new Error('Comp is not implemented')
  }

  const { frameRate } = elem.comp.globalData ?? { frameRate: 60 },
    type = typeFromProps ? typeFromProps.toLowerCase() : '',
    currentFrame = comp.renderedFrame ?? 0,
    firstKeyFrame = keyframes[0].t

  if (currentFrame >= firstKeyFrame) {
    return pv
  }
  let cycleDuration

  let lastKeyFrame

  if (durationFlag) {
    if (duration) {
      cycleDuration = Math.abs(frameRate * duration)
    } else {
      cycleDuration = Math.max(0, elem.data.op - firstKeyFrame)
    }
    lastKeyFrame = firstKeyFrame + cycleDuration
  } else {
    if (!duration || duration > keyframes.length - 1) {
      duration = keyframes.length - 1
    }
    lastKeyFrame = keyframes[duration].t
    cycleDuration = lastKeyFrame - firstKeyFrame
  }
  let i,
    len,
    ret

  switch (type) {
    case 'pingpong': {
      const iterations = Math.floor((firstKeyFrame - currentFrame) / cycleDuration)

      if (iterations % 2 === 0) {
        return this.getValueAtTime(((firstKeyFrame - currentFrame) % cycleDuration + firstKeyFrame) / frameRate, 0)
      }

      break
    }
    case 'offset': {
      const initV = this.getValueAtTime(firstKeyFrame / frameRate, 0),

        endV = this.getValueAtTime(lastKeyFrame / frameRate, 0),
        current = this.getValueAtTime((cycleDuration - (firstKeyFrame - currentFrame) % cycleDuration + firstKeyFrame) / frameRate, 0),
        repeats = Math.floor((firstKeyFrame - currentFrame) / cycleDuration) + 1

      if (isArrayOfNum(pv) && isArrayOfNum(initV) && isArrayOfNum(endV) && isArrayOfNum(current)) {
        ret = Array.from({ length: initV.length })
        len = ret.length
        for (i = 0; i < len; i += 1) {
          ret[i] = current[i] - (endV[i] - initV[i]) * repeats
        }

        return ret as number[]
      }

      return current as number - (endV as number - (initV as number)) * repeats
    }
    case 'continue': {
      const firstValue = this.getValueAtTime(firstKeyFrame / frameRate, 0)

      const nextFirstValue = this.getValueAtTime((firstKeyFrame + 0.001) / frameRate, 0)

      if (isArrayOfNum(pv) && isArrayOfNum(firstValue) && isArrayOfNum(nextFirstValue)) {
        ret = Array.from({ length: firstValue.length })
        len = ret.length
        for (i = 0; i < len; i += 1) {
          ret[i] = firstValue[i] + (firstValue[i] - nextFirstValue[i]) * (firstKeyFrame - currentFrame) / 0.001
        }

        return ret
      }

      return firstValue as number + (firstValue as number - (nextFirstValue as number)) * (firstKeyFrame - currentFrame) / 0.001
    }
    default:
    // Do nothing
  }

  return this.getValueAtTime((cycleDuration - ((firstKeyFrame - currentFrame) % cycleDuration + firstKeyFrame)) / frameRate, 0)

}

function smooth(
  this: KeyframedValueProperty, widthFromProps: number, samplesFromProps: number
) {

  const {
    comp, k: shouldProcess, pv
  } = this

  if (!shouldProcess) {
    return pv
  }

  const { renderedFrame = 0 } = comp ?? { renderedFrame: 0 },
    { frameRate } = comp?.globalData ?? { frameRate: 60 }

  const width = (widthFromProps || 0.4) * 0.5,
    samples = Math.floor(samplesFromProps || 5)

  if (samples <= 1) {
    return pv
  }
  const currentTime = renderedFrame / frameRate
  const initFrame = currentTime - width
  const endFrame = currentTime + width
  const sampleFrequency = samples > 1 ? (endFrame - initFrame) / (samples - 1) : 1
  let i = 0,
    j,
    value

  if (isArrayOfNum(pv)) {
    value = createTypedArray(ArrayType.Float32, pv.length)
  } else {
    value = 0
  }
  let sampleValue

  while (i < samples) {
    sampleValue = this.getValueAtTime(initFrame + i * sampleFrequency)
    if (isArrayOfNum(pv) && isArrayOfNum(value) && isArrayOfNum(sampleValue)) {
      for (j = 0; j < pv.length; j++) {
        value[j] += sampleValue[j]
      }
      i++
      continue
    }
    (value as number) += (sampleValue as number)
    i++
  }
  if (isArrayOfNum(pv) && isArrayOfNum(value)) {
    for (j = 0; j < pv.length; j += 1) {
      value[j] /= samples
    }

    return value
  }

  (value as number) /= samples

  return value
}

function getTransformValueAtTime(this: TransformProperty, time: number) {
  this._transformCachingAtTime = this._transformCachingAtTime ?? { v: new Matrix() }

  const { v: matrix } = this._transformCachingAtTime,
    { mult: aMult = 1 } = this.a ?? { mult: 1 },
    { mult: sMult = 1 } = this.s ?? { mult: 1 }

  matrix.cloneFromProps(this.pre.props)
  if (this.appliedTransformations < 1) {
    const anchor = this.a?.getValueAtTime(time) as Vector3 | undefined ?? [0,
      0,
      0]

    matrix.translate(
      -anchor[0] * aMult,
      -anchor[1] * aMult,
      anchor[2] * aMult
    )
  }
  if (this.appliedTransformations < 2) {
    const scale = this.s?.getValueAtTime(time) as Vector3 | undefined ?? [0,
      0,
      0]

    matrix.scale(
      scale[0] * sMult,
      scale[1] * sMult,
      scale[2] * sMult
    )
  }
  if (this.sk && this.appliedTransformations < 3) {
    const skew = this.sk.getValueAtTime(time) as number,
      skewAxis = this.sa?.getValueAtTime(time) as number | undefined ?? 0

    matrix.skewFromAxis(-skew * (this.sk.mult ?? 1), skewAxis * (this.sa?.mult ?? 1))
  }
  if (this.r && this.appliedTransformations < 4) {
    const rotation = this.r.getValueAtTime(time) as number

    matrix.rotate(-rotation * (this.r.mult ?? 1))
  } else if (!this.r && this.appliedTransformations < 4) {
    const rotationZ = Number(this.rz?.getValueAtTime(time)),
      rotationY = Number(this.ry?.getValueAtTime(time)),
      rotationX = Number(this.rx?.getValueAtTime(time)),
      orientation = this.or?.getValueAtTime(time) as number[] | undefined ?? []

    matrix.rotateZ(-rotationZ * (this.rz?.mult ?? 1))
      .rotateY(rotationY * (this.ry?.mult ?? 1))
      .rotateX(rotationX * (this.rx?.mult ?? 1))
      .rotateZ(-orientation[2] * (this.or?.mult ?? 1))
      .rotateY(orientation[1] * (this.or?.mult ?? 1))
      .rotateX(orientation[0] * (this.or?.mult ?? 1))
  }
  if (this.data.p?.s) {
    const positionX = this.px?.getValueAtTime(time) as number,
      positionY = this.py?.getValueAtTime(time) as number

    if (this.data.p.z) {
      const positionZ = this.pz?.getValueAtTime(time) as number

      matrix.translate(
        positionX * (this.px?.mult ?? 1),
        positionY * (this.py?.mult ?? 1),
        -positionZ * (this.pz?.mult ?? 1)
      )
    } else {
      matrix.translate(
        positionX * (this.px?.mult ?? 1), positionY * (this.py?.mult ?? 1), 0
      )
    }
  } else {
    const position = this.p?.getValueAtTime(time) as Vector3 | undefined ?? [0,
      0,
      0]

    matrix.translate(
      position[0] * (this.p?.mult ?? 1),
      position[1] * (this.p?.mult ?? 1),
      -position[2] * (this.p?.mult ?? 1)
    )
  }

  return matrix
  /// /
}

function getTransformStaticValueAtTime(this: TransformProperty) {
  return this.v.clone(new Matrix())
}

function getShapeValueAtTime(
  this: ShapeProperty, frameNumFromProps: number, _num?: number
) {
  // For now this caching object is created only when needed instead of creating it when the shape is initialized.
  this._cachingAtTime = this._cachingAtTime ?? {
    lastIndex: 0,
    lastTime: initialDefaultFrame,
    shapeValue: shapePool.clone(this.pv as ShapePath),
  } as Caching

  let frameNum = frameNumFromProps

  frameNum *= this.elem?.globalData?.frameRate ?? 60
  frameNum -= this.offsetTime
  if (frameNum !== this._cachingAtTime.lastTime) {
    this._cachingAtTime.lastIndex = this._cachingAtTime.lastTime < frameNum ? this._caching?.lastIndex ?? 0 : 0
    this._cachingAtTime.lastTime = frameNum
    this.interpolateShape(
      frameNum, this._cachingAtTime.shapeValue as ShapePath, this._cachingAtTime
    )
  }

  return this._cachingAtTime.shapeValue
}

function addPropertyDecorator() {

  const { getTransformProperty } = TransformPropertyFactory

  TransformPropertyFactory.getTransformProperty = function (
    elem, data, container
  ) {
    const prop = getTransformProperty(
      elem, data, container
    )

    if (prop.dynamicProperties.length > 0) {
      prop.getValueAtTime = getTransformValueAtTime.bind(prop)
    } else {
      prop.getValueAtTime = getTransformStaticValueAtTime.bind(prop)
    }
    prop.setGroupProperty = expressionHelpers.setGroupProperty

    return prop
  }

  const propertyGetProp = PropertyFactory.getProp

  PropertyFactory.getProp = function (
    elem, data, type, mult, container
  ) {
    const prop = propertyGetProp(
      elem, data, type, mult, container
    )

    // prop.getVelocityAtTime = getVelocityAtTime;
    // prop.loopOut = loopOut;
    // prop.loopIn = loopIn;
    if (prop.kf) {
      prop.getValueAtTime = expressionHelpers.getValueAtTime.bind(prop)
    } else {
      prop.getValueAtTime = expressionHelpers.getStaticValueAtTime.bind(prop)
    }
    prop.setGroupProperty = expressionHelpers.setGroupProperty
    prop.loopOut = loopOut
    prop.loopIn = loopIn
    prop.smooth = smooth
    prop.getVelocityAtTime = expressionHelpers.getVelocityAtTime.bind(prop)
    prop.getSpeedAtTime = expressionHelpers.getSpeedAtTime.bind(prop)
    prop.numKeys = data?.a === 1 ? (data.k as unknown[]).length : 0
    prop.propertyIndex = data?.ix
    let value: number | number[] = 0

    if (type !== 0) {
      value = (createTypedArray(ArrayType.Float32, data?.a === 1 ? (data.k as unknown as { s: number[] }[])[0].s.length : (data?.k as number[]).length) as number[])
    }
    prop._cachingAtTime = {
      lastFrame: initialDefaultFrame,
      lastIndex: 0,
      value,
    } as Caching
    expressionHelpers.searchExpressions(
      elem, data as ExpressionProperty, prop as KeyframedValueProperty
    )
    if (prop.k) {
      container?.addDynamicProperty(prop)
    }

    return prop
  }

  const ShapePropertyConstructorFunction = ShapePropertyFactory.getConstructorFunction()
  const KeyframedShapePropertyConstructorFunction = ShapePropertyFactory.getKeyframedConstructorFunction()

  extendPrototype([ShapeExpressions], ShapePropertyConstructorFunction)
  extendPrototype([ShapeExpressions], KeyframedShapePropertyConstructorFunction)
  KeyframedShapePropertyConstructorFunction.prototype.getValueAtTime = getShapeValueAtTime
  KeyframedShapePropertyConstructorFunction.prototype.initiateExpression = ExpressionManager.initiateExpression

  const propertyGetShapeProp = ShapePropertyFactory.getShapeProp

  ShapePropertyFactory.getShapeProp = function (
    elem, data, type, arr, trims
  ) {
    const prop = propertyGetShapeProp(
      elem, data, type, arr, trims
    )

    if (!prop) {
      return prop
    }

    prop.propertyIndex = data.ix
    prop.lock = false
    if (type === 3) {
      expressionHelpers.searchExpressions(
        elem as ElementInterfaceIntersect, data.pt as unknown as ExpressionProperty, prop as unknown as KeyframedValueProperty
      )
    } else if (type === 4) {
      expressionHelpers.searchExpressions(
        elem as ElementInterfaceIntersect, data.ks as unknown as ExpressionProperty, prop as unknown as KeyframedValueProperty
      )
    }
    if (prop.k) {
      elem.addDynamicProperty(prop)
    }

    return prop
  }
}

function initialize() {
  addPropertyDecorator()
}

export default initialize
