import { extendPrototype } from '@/utils'
import { initialDefaultFrame } from '@/utils/getterSetter'
import Matrix from '@/utils/Matrix'

import bez from '../Bezier'
import {
  createSizedArray,
  createTypedArray,
} from '../helpers/arrays'
import { clone } from '../pooling/ShapePool'
import PropertyFactory from '../PropertyFactory'
import ShapePropertyFactory from '../shapes/ShapeProperty'
import TransformPropertyFactory from '../TransformProperty'
import expressionHelpers from './expressionHelpers'
import ExpressionManager from './ExpressionManager'

function addPropertyDecorator() {
  function loopOut(
    type, duration, durationFlag
  ) {
    if (!this.k || !this.keyframes) {
      return this.pv
    }
    type = type ? type.toLowerCase() : ''
    const currentFrame = this.comp.renderedFrame
    const { keyframes } = this
    const lastKeyFrame = keyframes[keyframes.length - 1].t

    if (currentFrame <= lastKeyFrame) {
      return this.pv
    }
    let cycleDuration

    let firstKeyFrame

    if (!durationFlag) {
      if (!duration || duration > keyframes.length - 1) {
        duration = keyframes.length - 1
      }
      firstKeyFrame = keyframes[keyframes.length - 1 - duration].t
      cycleDuration = lastKeyFrame - firstKeyFrame
    } else {
      if (!duration) {
        cycleDuration = Math.max(0, lastKeyFrame - this.elem.data.ip)
      } else {
        cycleDuration = Math.abs(lastKeyFrame - this.elem.comp.globalData.frameRate * duration)
      }
      firstKeyFrame = lastKeyFrame - cycleDuration
    }
    let i

    let len
    let ret

    switch (type) {
      case 'pingpong': {
        const iterations = Math.floor((currentFrame - firstKeyFrame) / cycleDuration)

        if (iterations % 2 !== 0) {
          return this.getValueAtTime(((cycleDuration - (currentFrame - firstKeyFrame) % cycleDuration + firstKeyFrame)) / this.comp.globalData.frameRate, 0); // eslint-disable-line
        }

        break
      }
      case 'offset': {
        const initV = this.getValueAtTime(firstKeyFrame / this.comp.globalData.frameRate, 0)

        const endV = this.getValueAtTime(lastKeyFrame / this.comp.globalData.frameRate, 0)
        var current = this.getValueAtTime(((currentFrame - firstKeyFrame) % cycleDuration + firstKeyFrame) / this.comp.globalData.frameRate, 0); // eslint-disable-line
        const repeats = Math.floor((currentFrame - firstKeyFrame) / cycleDuration)

        if (this.pv.length > 0) {
          ret = Array.from({ length: initV.length })
          len = ret.length
          for (i = 0; i < len; i += 1) {
            ret[i] = (endV[i] - initV[i]) * repeats + current[i]
          }

          return ret
        }

        return (endV - initV) * repeats + current
      }
      case 'continue': {
        const lastValue = this.getValueAtTime(lastKeyFrame / this.comp.globalData.frameRate, 0)

        const nextLastValue = this.getValueAtTime((lastKeyFrame - 0.001) / this.comp.globalData.frameRate, 0)

        if (this.pv.length > 0) {
          ret = Array.from({ length: lastValue.length })
          len = ret.length
          for (i = 0; i < len; i += 1) {
            ret[i] = lastValue[i] + (lastValue[i] - nextLastValue[i]) * ((currentFrame - lastKeyFrame) / this.comp.globalData.frameRate) / 0.0005; // eslint-disable-line
          }

          return ret
        }

        return lastValue + (lastValue - nextLastValue) * ((currentFrame - lastKeyFrame) / 0.001)
      }
      default:
    // Do nothing
    }
      return this.getValueAtTime((((currentFrame - firstKeyFrame) % cycleDuration + firstKeyFrame)) / this.comp.globalData.frameRate, 0); // eslint-disable-line

  }

  function loopIn(
    type, duration, durationFlag
  ) {
    if (!this.k) {
      return this.pv
    }
    type = type ? type.toLowerCase() : ''
    const currentFrame = this.comp.renderedFrame
    const { keyframes } = this
    const firstKeyFrame = keyframes[0].t

    if (currentFrame >= firstKeyFrame) {
      return this.pv
    }
    let cycleDuration

    let lastKeyFrame

    if (!durationFlag) {
      if (!duration || duration > keyframes.length - 1) {
        duration = keyframes.length - 1
      }
      lastKeyFrame = keyframes[duration].t
      cycleDuration = lastKeyFrame - firstKeyFrame
    } else {
      if (!duration) {
        cycleDuration = Math.max(0, this.elem.data.op - firstKeyFrame)
      } else {
        cycleDuration = Math.abs(this.elem.comp.globalData.frameRate * duration)
      }
      lastKeyFrame = firstKeyFrame + cycleDuration
    }
    let i

    let len
    let ret

    switch (type) {
      case 'pingpong': {
        const iterations = Math.floor((firstKeyFrame - currentFrame) / cycleDuration)

        if (iterations % 2 === 0) {
          return this.getValueAtTime((((firstKeyFrame - currentFrame) % cycleDuration + firstKeyFrame)) / this.comp.globalData.frameRate, 0); // eslint-disable-line
        }

        break
      }
      case 'offset': {
        const initV = this.getValueAtTime(firstKeyFrame / this.comp.globalData.frameRate, 0)

        const endV = this.getValueAtTime(lastKeyFrame / this.comp.globalData.frameRate, 0)
        const current = this.getValueAtTime((cycleDuration - (firstKeyFrame - currentFrame) % cycleDuration + firstKeyFrame) / this.comp.globalData.frameRate, 0)
        const repeats = Math.floor((firstKeyFrame - currentFrame) / cycleDuration) + 1

        if (this.pv.length > 0) {
          ret = Array.from({ length: initV.length })
          len = ret.length
          for (i = 0; i < len; i += 1) {
            ret[i] = current[i] - (endV[i] - initV[i]) * repeats
          }

          return ret
        }

        return current - (endV - initV) * repeats
      }
      case 'continue': {
        const firstValue = this.getValueAtTime(firstKeyFrame / this.comp.globalData.frameRate, 0)

        const nextFirstValue = this.getValueAtTime((firstKeyFrame + 0.001) / this.comp.globalData.frameRate, 0)

        if (this.pv.length > 0) {
          ret = Array.from({ length: firstValue.length })
          len = ret.length
          for (i = 0; i < len; i += 1) {
            ret[i] = firstValue[i] + (firstValue[i] - nextFirstValue[i]) * (firstKeyFrame - currentFrame) / 0.001
          }

          return ret
        }

        return firstValue + (firstValue - nextFirstValue) * (firstKeyFrame - currentFrame) / 0.001
      }
      default:
    // Do nothing
    }
      return this.getValueAtTime(((cycleDuration - ((firstKeyFrame - currentFrame) % cycleDuration + firstKeyFrame))) / this.comp.globalData.frameRate, 0); // eslint-disable-line

  }

  function smooth(width, samples) {
    if (!this.k) {
      return this.pv
    }
    width = (width || 0.4) * 0.5
    samples = Math.floor(samples || 5)
    if (samples <= 1) {
      return this.pv
    }
    const currentTime = this.comp.renderedFrame / this.comp.globalData.frameRate
    const initFrame = currentTime - width
    const endFrame = currentTime + width
    const sampleFrequency = samples > 1 ? (endFrame - initFrame) / (samples - 1) : 1
    let i = 0
    let j = 0
    let value

    if (this.pv.length > 0) {
      value = createTypedArray('float32', this.pv.length)
    } else {
      value = 0
    }
    let sampleValue

    while (i < samples) {
      sampleValue = this.getValueAtTime(initFrame + i * sampleFrequency)
      if (this.pv.length > 0) {
        for (j = 0; j < this.pv.length; j += 1) {
          value[j] += sampleValue[j]
        }
      } else {
        value += sampleValue
      }
      i += 1
    }
    if (this.pv.length > 0) {
      for (j = 0; j < this.pv.length; j += 1) {
        value[j] /= samples
      }
    } else {
      value /= samples
    }

    return value
  }

  function getTransformValueAtTime(time) {
    if (!this._transformCachingAtTime) {
      this._transformCachingAtTime = { v: new Matrix() }
    }
    /// /
    const matrix = this._transformCachingAtTime.v

    matrix.cloneFromProps(this.pre.props)
    if (this.appliedTransformations < 1) {
      const anchor = this.a.getValueAtTime(time)

      matrix.translate(
        -anchor[0] * this.a.mult,
        -anchor[1] * this.a.mult,
        anchor[2] * this.a.mult
      )
    }
    if (this.appliedTransformations < 2) {
      const scale = this.s.getValueAtTime(time)

      matrix.scale(
        scale[0] * this.s.mult,
        scale[1] * this.s.mult,
        scale[2] * this.s.mult
      )
    }
    if (this.sk && this.appliedTransformations < 3) {
      const skew = this.sk.getValueAtTime(time)
      const skewAxis = this.sa.getValueAtTime(time)

      matrix.skewFromAxis(-skew * this.sk.mult, skewAxis * this.sa.mult)
    }
    if (this.r && this.appliedTransformations < 4) {
      const rotation = this.r.getValueAtTime(time)

      matrix.rotate(-rotation * this.r.mult)
    } else if (!this.r && this.appliedTransformations < 4) {
      const rotationZ = this.rz.getValueAtTime(time)
      const rotationY = this.ry.getValueAtTime(time)
      const rotationX = this.rx.getValueAtTime(time)
      const orientation = this.or.getValueAtTime(time)

      matrix.rotateZ(-rotationZ * this.rz.mult)
        .rotateY(rotationY * this.ry.mult)
        .rotateX(rotationX * this.rx.mult)
        .rotateZ(-orientation[2] * this.or.mult)
        .rotateY(orientation[1] * this.or.mult)
        .rotateX(orientation[0] * this.or.mult)
    }
    if (this.data.p?.s) {
      const positionX = this.px.getValueAtTime(time)
      const positionY = this.py.getValueAtTime(time)

      if (this.data.p.z) {
        const positionZ = this.pz.getValueAtTime(time)

        matrix.translate(
          positionX * this.px.mult,
          positionY * this.py.mult,
          -positionZ * this.pz.mult
        )
      } else {
        matrix.translate(
          positionX * this.px.mult, positionY * this.py.mult, 0
        )
      }
    } else {
      const position = this.p.getValueAtTime(time)

      matrix.translate(
        position[0] * this.p.mult,
        position[1] * this.p.mult,
        -position[2] * this.p.mult
      )
    }

    return matrix
    /// /
  }

  function getTransformStaticValueAtTime() {
    return this.v.clone(new Matrix())
  }

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
    prop.numKeys = data.a === 1 ? data.k.length : 0
    prop.propertyIndex = data.ix
    let value = 0

    if (type !== 0) {
      value = createTypedArray('float32', data.a === 1 ? data.k[0].s.length : data.k.length)
    }
    prop._cachingAtTime = {
      lastFrame: initialDefaultFrame,
      lastIndex: 0,
      value,
    }
    expressionHelpers.searchExpressions(
      elem, data, prop
    )
    if (prop.k) {
      container.addDynamicProperty(prop)
    }

    return prop
  }

  function getShapeValueAtTime(frameNum) {
    // For now this caching object is created only when needed instead of creating it when the shape is initialized.
    if (!this._cachingAtTime) {
      this._cachingAtTime = {
        lastIndex: 0,
        lastTime: initialDefaultFrame,
        shapeValue: clone(this.pv),
      }
    }

    frameNum *= this.elem.globalData.frameRate
    frameNum -= this.offsetTime
    if (frameNum !== this._cachingAtTime.lastTime) {
      this._cachingAtTime.lastIndex = this._cachingAtTime.lastTime < frameNum ? this._caching.lastIndex : 0
      this._cachingAtTime.lastTime = frameNum
      this.interpolateShape(
        frameNum, this._cachingAtTime.shapeValue, this._cachingAtTime
      )
    }

    return this._cachingAtTime.shapeValue
  }

  const ShapePropertyConstructorFunction = ShapePropertyFactory.getConstructorFunction()
  const KeyframedShapePropertyConstructorFunction = ShapePropertyFactory.getKeyframedConstructorFunction()

  function ShapeExpressions() {}
  ShapeExpressions.prototype = {
    getValueAtTime: expressionHelpers.getStaticValueAtTime,
    inTangents (time) {
      return this.vertices('i', time)
    },
    isClosed () {
      return this.v.c
    },
    normalOnPath (perc, time) {
      return this.vectorOnPath(
        perc, time, 'normal'
      )
    },
    outTangents (time) {
      return this.vertices('o', time)
    },
    pointOnPath (perc, time) {
      let shapePath = this.v

      if (time !== undefined) {
        shapePath = this.getValueAtTime(time, 0)
      }
      if (!this._segmentsLength) {
        this._segmentsLength = bez.getSegmentsLength(shapePath)
      }

      const segmentsLength = this._segmentsLength
      const { lengths } = segmentsLength
      const lengthPos = segmentsLength.totalLength * perc

      let i = 0
      const len = lengths.length
      let accumulatedLength = 0
      let pt

      while (i < len) {
        if (accumulatedLength + lengths[i].addedLength > lengthPos) {
          const initIndex = i
          const endIndex = shapePath.c && i === len - 1 ? 0 : i + 1
          const segmentPerc = (lengthPos - accumulatedLength) / lengths[i].addedLength

          pt = bez.getPointInSegment(
            shapePath.v[initIndex], shapePath.v[endIndex], shapePath.o[initIndex], shapePath.i[endIndex], segmentPerc, lengths[i]
          )
          break
        } else {
          accumulatedLength += lengths[i].addedLength
        }
        i += 1
      }
      if (!pt) {
        pt = shapePath.c ? [shapePath.v[0][0], shapePath.v[0][1]] : [shapePath.v[shapePath._length - 1][0], shapePath.v[shapePath._length - 1][1]]
      }

      return pt
    },
    points (time) {
      return this.vertices('v', time)
    },
    setGroupProperty: expressionHelpers.setGroupProperty,
    tangentOnPath (perc, time) {
      return this.vectorOnPath(
        perc, time, 'tangent'
      )
    },
    vectorOnPath (
      perc, time, vectorType
    ) {
      // perc doesn't use triple equality because it can be a Number object as well as a primitive.
      if (perc == 1) { // eslint-disable-line eqeqeq
        perc = this.v.c
      } else if (perc == 0) { // eslint-disable-line eqeqeq
        perc = 0.999
      }
      const pt1 = this.pointOnPath(perc, time)
      const pt2 = this.pointOnPath(perc + 0.001, time)
      const xLength = pt2[0] - pt1[0]
      const yLength = pt2[1] - pt1[1]
      const magnitude = Math.sqrt(Math.pow(xLength, 2) + Math.pow(yLength, 2))

      if (magnitude === 0) {
        return [0, 0]
      }
      const unitVector = vectorType === 'tangent' ? [xLength / magnitude, yLength / magnitude] : [-yLength / magnitude, xLength / magnitude]

      return unitVector
    },
    vertices (prop, time) {
      if (this.k) {
        this.getValue()
      }
      let shapePath = this.v

      if (time !== undefined) {
        shapePath = this.getValueAtTime(time, 0)
      }
      let i

      const len = shapePath._length
      const vertices = shapePath[prop]
      const points = shapePath.v
      const arr = createSizedArray(len)

      for (i = 0; i < len; i += 1) {
        if (prop === 'i' || prop === 'o') {
          arr[i] = [vertices[i][0] - points[i][0], vertices[i][1] - points[i][1]]
        } else {
          arr[i] = [vertices[i][0], vertices[i][1]]
        }
      }

      return arr
    },
  }
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

    prop.propertyIndex = data.ix
    prop.lock = false
    if (type === 3) {
      expressionHelpers.searchExpressions(
        elem, data.pt, prop
      )
    } else if (type === 4) {
      expressionHelpers.searchExpressions(
        elem, data.ks, prop
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
