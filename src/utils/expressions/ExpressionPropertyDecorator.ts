// import type LayerExpressionInterface from '@/utils/expressions/LayerInterface'

import type ShapeElement from '@/elements/helpers/shapes/ShapeElement'
import type {
  Caching,
  ElementInterfaceIntersect,
  SegmentLength,
  Shape,
  Vector2,
} from '@/types'
import type { BaseProperty } from '@/utils/Properties'
import type ShapePath from '@/utils/shapes/ShapePath'

import { ArrayType } from '@/utils/enums'
import { extendPrototype, isArrayOfNum } from '@/utils'
import { getPointInSegment, getSegmentsLength } from '@/utils/Bezier'
import {
  getSpeedAtTime,
  getStaticValueAtTime,
  getValueAtTime,
  getVelocityAtTime,
  searchExpressions,
  setGroupProperty,
} from '@/utils/expressions/expressionHelpers'
import ExpressionManager from '@/utils/expressions/ExpressionManager'
import { initialDefaultFrame } from '@/utils/getterSetter'
import { createSizedArray, createTypedArray } from '@/utils/helpers/arrays'
import Matrix from '@/utils/Matrix'
import { clone } from '@/utils/pooling/ShapePool'
import PropertyFactory from '@/utils/PropertyFactory'
import ShapePropertyFactory, {
  KeyframedShapeProperty,
  ShapeBaseProperty,
  ShapeProperty,
} from '@/utils/shapes/ShapeProperty'
import { type default as TransformProperty,  TransformPropertyFactory } from '@/utils/TransformProperty'

export default function addPropertyDecorator() {
  function loopOut(
    this: BaseProperty,
    typeFromProps?: string,
    durationFromProps?: number,
    durationFlag?: boolean
  ) {
    if (!this.k || !this.keyframes) {
      return this.pv
    }
    let duration = durationFromProps
    const type = typeFromProps?.toLowerCase() || '',
      currentFrame = this.comp?.renderedFrame || -1,
      { keyframes } = this,
      lastKeyFrame = keyframes[keyframes.length - 1].t,
      frameRate = this.comp?.globalData?.frameRate ?? 60

    if (currentFrame <= lastKeyFrame) {
      return this.pv
    }
    let cycleDuration
    let firstKeyFrame

    if (durationFlag) {
      if (duration) {
        cycleDuration = Math.abs(lastKeyFrame - frameRate * duration)
      } else {
        cycleDuration = Math.max(0, lastKeyFrame - (this.elem?.data.ip || 0))
      }
      firstKeyFrame = lastKeyFrame - cycleDuration
    } else {
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
          return this.getValueAtTime((cycleDuration -
            (currentFrame - firstKeyFrame) % cycleDuration +
            firstKeyFrame) /
            frameRate,
          0)
        }

        break
      }
      case 'offset': {
        const initV: number | number[] = this.getValueAtTime(firstKeyFrame / frameRate,
          0)
        const endV: number | number[] = this.getValueAtTime(lastKeyFrame / frameRate,
          0),
          current: number | number[] = this.getValueAtTime(((currentFrame - firstKeyFrame) % cycleDuration + firstKeyFrame) /
            frameRate,
          0)
        const repeats = Math.floor((currentFrame - firstKeyFrame) / cycleDuration)

        if (isArrayOfNum(this.pv) && isArrayOfNum(initV)) {
          ret = Array.from({ length: initV.length })
          len = ret.length
          for (i = 0; i < len; i++) {
            ret[i] =
            ((endV as number[])[i] - initV[i]) * repeats +
            (current as number[])[i]
          }

          return ret
        }

        return (
          ((endV as number) - (initV as number)) * repeats + (current as number)
        )
      }
      case 'continue': {
        const lastValue: number | number[] = this.getValueAtTime(lastKeyFrame / frameRate,
          0),
          nextLastValue: number | number[] = this.getValueAtTime((lastKeyFrame - 0.001) / frameRate,
            0)

        if (isArrayOfNum(this.pv)) {
          ret = Array.from({ length: (lastValue as number[]).length })
          len = ret.length
          for (i = 0; i < len; i++) {
            ret[i] =
            (lastValue as number[])[i] +
            ((lastValue as number[])[i] - (nextLastValue as number[])[i]) *
              ((currentFrame - lastKeyFrame) / frameRate) /
              0.0005
          }

          return ret
        }

        return (
          (lastValue as number) +
        ((lastValue as number) - (nextLastValue as number)) *
          ((currentFrame - lastKeyFrame) / 0.001)
        )
      }
      default:
    // Do nothing
    }

    return this.getValueAtTime(((currentFrame - firstKeyFrame) % cycleDuration + firstKeyFrame) /
        frameRate,
    0)
  }

  function loopIn(
    this: BaseProperty,
    typeFromProps?: string,
    durationFromProps?: number,
    durationFlag?: boolean
  ) {
    if (!this.k) {
      return this.pv
    }
    let duration = durationFromProps
    const type = typeFromProps?.toLowerCase() || '',
      frameRate = this.comp?.globalData?.frameRate ?? 60,
      currentFrame = this.comp?.renderedFrame || -1,
      { keyframes } = this,
      firstKeyFrame = keyframes[0].t

    if (currentFrame >= firstKeyFrame) {
      return this.pv
    }
    let cycleDuration
    let lastKeyFrame

    if (durationFlag) {
      if (duration) {
        cycleDuration = Math.abs(frameRate * duration)
      } else {
        cycleDuration = Math.max(0, (this.elem?.data.op || 0) - firstKeyFrame)
      }
      lastKeyFrame = firstKeyFrame + cycleDuration
    } else {
      if (!duration || duration > keyframes.length - 1) {
        duration = keyframes.length - 1
      }
      lastKeyFrame = keyframes[duration].t
      cycleDuration = lastKeyFrame - firstKeyFrame
    }
    let i
    let len
    let ret

    switch (type) {
      case 'pingpong': {
        const iterations = Math.floor((firstKeyFrame - currentFrame) / cycleDuration)

        if (iterations % 2 === 0) {
          return this.getValueAtTime(((firstKeyFrame - currentFrame) % cycleDuration + firstKeyFrame) /
            frameRate,
          0)
        }

        break
      }
      case 'offset': {
        const initV: number | number[] = this.getValueAtTime(firstKeyFrame / frameRate,
          0),
          endV: number | number[] = this.getValueAtTime(lastKeyFrame / frameRate,
            0),
          current: number | number[] = this.getValueAtTime((cycleDuration -
            (firstKeyFrame - currentFrame) % cycleDuration +
            firstKeyFrame) /
            frameRate,
          0)
        const repeats =
        Math.floor((firstKeyFrame - currentFrame) / cycleDuration) + 1

        if (isArrayOfNum(this.pv)) {
          ret = Array.from({ length: (initV as number[]).length })
          len = ret.length
          for (i = 0; i < len; i++) {
            ret[i] =
            (current as number[])[i] -
            ((endV as number[])[i] - (initV as number[])[i]) * repeats
          }

          return ret
        }

        return (
          (current as number) - ((endV as number) - (initV as number)) * repeats
        )
      }
      case 'continue': {
        const firstValue: number | number[] = this.getValueAtTime(firstKeyFrame / frameRate,
          0),
          nextFirstValue: number | number[] = this.getValueAtTime((firstKeyFrame + 0.001) / frameRate,
            0)

        if (isArrayOfNum(this.pv)) {
          ret = Array.from({ length: (firstValue as number[]).length })
          len = ret.length
          for (i = 0; i < len; i++) {
            ret[i] =
            (firstValue as number[])[i] +
            ((firstValue as number[])[i] - (nextFirstValue as number[])[i]) *
              (firstKeyFrame - currentFrame) /
              0.001
          }

          return ret
        }

        return (
          (firstValue as number) +
        ((firstValue as number) - (nextFirstValue as number)) *
          (firstKeyFrame - currentFrame) /
          0.001
        )
      }
      default:
    // Do nothing
    }

    return this.getValueAtTime((cycleDuration -
        ((firstKeyFrame - currentFrame) % cycleDuration + firstKeyFrame)) /
        frameRate,
    0)
  }

  function smooth(
    this: BaseProperty,
    widthFromProps?: number,
    samplesFromProps?: number
  ) {
    if (!this.k) {
      return this.pv
    }
    const width = (widthFromProps || 0.4) * 0.5,
      samples = Math.floor(samplesFromProps || 5),
      frameRate = this.comp?.globalData?.frameRate ?? 60

    if (samples <= 1) {
      return this.pv
    }
    const currentTime = (this.comp?.renderedFrame || 0) / frameRate
    const initFrame = currentTime - width
    const endFrame = currentTime + width
    const sampleFrequency =
      samples > 1 ? (endFrame - initFrame) / (samples - 1) : 1
    let i = 0
    let j = 0
    let value

    if (isArrayOfNum(this.pv)) {
      value = createTypedArray(ArrayType.Float32, this.pv.length)
    } else {
      value = 0
    }
    let sampleValue: number | number[]

    while (i < samples) {
      sampleValue = this.getValueAtTime(initFrame + i * sampleFrequency)
      if (isArrayOfNum(this.pv)) {
        for (j = 0; j < this.pv.length; j++) {
          ;(value as number[])[j] += (sampleValue as number[])[j]
        }
      } else {
        ;(value as number) += sampleValue as number
      }
      i++
    }
    if (isArrayOfNum(this.pv)) {
      for (j = 0; j < this.pv.length; j++) {
        ;(value as number[])[j] /= samples
      }
    } else {
      ;(value as number) /= samples
    }

    return value
  }

  function getTransformValueAtTime(this: TransformProperty, time: number) {
    if (!this._transformCachingAtTime) {
      this._transformCachingAtTime = { v: new Matrix(), }
    }
    // / /
    const matrix = this._transformCachingAtTime.v

    matrix.cloneFromProps(this.pre.props)
    if (this.appliedTransformations < 1) {
      const anchor: number[] = this.a?.getValueAtTime(time) || [],
        mult = this.a?.mult ?? 1

      matrix.translate(
        -anchor[0] * mult, -anchor[1] * mult, anchor[2] * mult
      )
    }
    if (this.appliedTransformations < 2) {
      const scale: number[] = this.s?.getValueAtTime(time) || [],
        mult = this.s?.mult ?? 1

      matrix.scale(
        scale[0] * mult, scale[1] * mult, scale[2] * mult
      )
    }
    if (this.sk && this.appliedTransformations < 3) {
      const skew = this.sk.getValueAtTime(time),
        skewAxis = this.sa?.getValueAtTime(time) ?? 0,
        skMult = this.sk.mult ?? 1,
        saMult = this.sa?.mult ?? 1

      matrix.skewFromAxis(-skew * skMult, skewAxis * saMult)
    }
    if (this.r && this.appliedTransformations < 4) {
      const rotation = this.r.getValueAtTime(time),
        mult = this.r.mult ?? 1

      matrix.rotate(-rotation * mult)
    } else if (!this.r && this.appliedTransformations < 4) {
      const rotationZ = this.rz?.getValueAtTime(time) || 0,
        rotationY = this.ry?.getValueAtTime(time) || 0,
        rotationX = this.rx?.getValueAtTime(time) || 0,
        orientation: number[] = this.or?.getValueAtTime(time) || [],
        rzMult = this.rz?.mult ?? 1,
        ryMult = this.ry?.mult ?? 1,
        rxMult = this.rx?.mult ?? 1,
        orMult = this.or?.mult ?? 1

      matrix
        .rotateZ(-rotationZ * rzMult)
        .rotateY(rotationY * ryMult)
        .rotateX(rotationX * rxMult)
        .rotateZ(-orientation[2] * orMult)
        .rotateY(orientation[1] * orMult)
        .rotateX(orientation[0] * orMult)
    }
    if (this.data.p && 's' in this.data.p) {
      const positionX = this.px?.getValueAtTime(time) || 0,
        positionY = this.py?.getValueAtTime(time) || 0,
        pxMult = this.px?.mult ?? 1,
        pyMult = this.py?.mult ?? 1

      if ('z' in this.data.p) {
        const positionZ = this.pz?.getValueAtTime(time) || 0,
          pzMult = this.pz?.mult ?? 1

        matrix.translate(
          positionX * pxMult,
          positionY * pyMult,
          -positionZ * pzMult
        )
      } else {
        matrix.translate(
          positionX * pxMult, positionY * pyMult, 0
        )
      }
    } else {
      const position: number[] = this.p?.getValueAtTime(time) || [],
        pMult = this.p?.mult ?? 1

      matrix.translate(
        position[0] * pMult,
        position[1] * pMult,
        -position[2] * pMult
      )
    }

    return matrix
    // / /
  }

  function getTransformStaticValueAtTime(this: TransformProperty) {
    return this.v.clone(new Matrix())
  }

  const { getTransformProperty } = TransformPropertyFactory

  TransformPropertyFactory.getTransformProperty = (
    elem: ElementInterfaceIntersect,
    data: Shape,
    container: ElementInterfaceIntersect
  ) => {
    const prop = getTransformProperty(
      elem, data, container
    )

    if (prop.dynamicProperties.length > 0) {
      prop.getValueAtTime = getTransformValueAtTime.bind(prop) as any
    } else {
      prop.getValueAtTime = getTransformStaticValueAtTime.bind(prop) as any
    }
    prop.setGroupProperty = setGroupProperty

    return prop
  }

  const propertyGetProp = PropertyFactory.getProp

  PropertyFactory.getProp = (
    elem, data, type, mult, container
  ) => {
    const prop: any = propertyGetProp(
      elem, data, type, mult, container
    )

    // prop.getVelocityAtTime = getVelocityAtTime;
    // prop.loopOut = loopOut;
    // prop.loopIn = loopIn;
    if (prop.kf) {
      prop.getValueAtTime = getValueAtTime.bind(prop) as any
    } else {
      prop.getValueAtTime = getStaticValueAtTime.bind(prop) as any
    }
    prop.setGroupProperty = setGroupProperty
    prop.loopOut = loopOut
    prop.loopIn = loopIn
    prop.smooth = smooth
    prop.getVelocityAtTime = getVelocityAtTime.bind(prop) as any
    prop.getSpeedAtTime = getSpeedAtTime.bind(prop)
    prop.numKeys = data?.a === 1 ? (data.k as number[]).length : 0
    prop.propertyIndex = data?.ix || 0
    let value: number | number[] = 0

    if (type !== 0) {
      value = createTypedArray(ArrayType.Float32,
        data?.a === 1
          ? (data?.k as any[])[0].s.length
          : (data?.k as any[]).length) as number[]
    }
    prop._cachingAtTime = {
      lastFrame: initialDefaultFrame,
      lastIndex: 0,
      value,
    } as Caching
    searchExpressions(
      elem, data as any, prop
    )
    if (prop.k) {
      container?.addDynamicProperty(prop)
    }

    return prop
  }

  function getShapeValueAtTime(this: KeyframedShapeProperty,
    frameNumFromProps: number): ShapePath {
    if (!this.pv) {
      throw new Error(`${this.constructor.name}: pv (ShapePath) is not set`)
    }

    let frameNum = frameNumFromProps

    // For now this caching object is created only when needed instead of creating it when the shape is initialized.
    if (!this._cachingAtTime) {
      this._cachingAtTime = {
        lastIndex: 0,
        lastTime: initialDefaultFrame,
        shapeValue: clone(this.pv),
      } as Caching
    }

    frameNum *= this.elem?.globalData?.frameRate ?? 60
    frameNum -= this.offsetTime
    if (frameNum !== this._cachingAtTime?.lastTime) {
      this._cachingAtTime.lastIndex =
        this._cachingAtTime.lastTime < frameNum
          ? this._caching?.lastIndex ?? 0
          : 0
      this._cachingAtTime.lastTime = frameNum
      this.interpolateShape(
        frameNum,
        this._cachingAtTime.shapeValue,
        this._cachingAtTime
      )
    }

    return this._cachingAtTime.shapeValue
  }

  class ShapeExpressions extends ShapeBaseProperty {
    _segmentsLength?: SegmentLength

    get setGroupProperty() {
      return setGroupProperty
    }
    override getValueAtTime(_time: number, _pos?: number) {
      return getStaticValueAtTime as any
    }

    inTangents(time: number) {
      return this.vertices('i', time)
    }
    isClosed() {
      return this.v?.c
    }
    normalOnPath(perc: number, time: number) {
      return this.vectorOnPath(
        perc, time, 'normal'
      )
    }
    outTangents(time: number) {
      return this.vertices('o', time)
    }
    pointOnPath(perc: number, time: number) {
      let shapePath = this.v

      if (time !== undefined) {
        shapePath = (this.getValueAtTime as any)(time, 0) as ShapePath
      }
      if (!this._segmentsLength && shapePath) {
        this._segmentsLength = getSegmentsLength(shapePath)
      }

      const segmentsLength = this._segmentsLength,
        lengths = segmentsLength?.lengths || [],
        lengthPos = (segmentsLength?.totalLength || 0) * perc
      let i = 0
      const { length } = lengths
      let accumulatedLength = 0
      let pt

      while (i < length) {
        if (accumulatedLength + lengths[i].addedLength > lengthPos) {
          if (!shapePath) {
            break
          }
          const initIndex = i,
            endIndex = shapePath.c && i === length - 1 ? 0 : i + 1,
            segmentPerc =
              (lengthPos - accumulatedLength) / lengths[i].addedLength

          pt = getPointInSegment(
            shapePath.v[initIndex],
            shapePath.v[endIndex],
            shapePath.o[initIndex],
            shapePath.i[endIndex],
            segmentPerc,
            lengths[i]
          )
          break
        } else {
          accumulatedLength += lengths[i].addedLength
        }
        i++
      }
      if (!pt && shapePath) {
        pt = shapePath.c
          ? [shapePath.v[0][0], shapePath.v[0][1]]
          : [
            shapePath.v[shapePath._length - 1][0], shapePath.v[shapePath._length - 1][1],
          ]
      }

      return pt
    }
    points(time: number) {
      return this.vertices('v', time)
    }
    // setGroupProperty(_propertyGroup: LayerExpressionInterface) {
    //   throw new Error(
    //     `${this.constructor.name}: Method setGroupProperty is not inmplemented`
    //   )
    /**
     * }.
     */
    tangentOnPath(perc: number, time: number) {
      return this.vectorOnPath(
        perc, time, 'tangent'
      )
    }
    vectorOnPath(
      percFromProps: number, time: number, vectorType: string
    ) {
      // perc doesn't use triple equality because it can be a Number object as well as a primitive.
      let perc = percFromProps

      if (Number(perc) === 1) {
        // TODO: This might be boolint
        perc = this.v?.c as unknown as number
      } else if (Number(perc) === 0) {
        perc = 0.999
      }
      const pt1 = this.pointOnPath(perc, time) || []
      const pt2 = this.pointOnPath(perc + 0.001, time) || []
      const xLength = pt2[0] - pt1[0]
      const yLength = pt2[1] - pt1[1]
      const magnitude = Math.sqrt(Math.pow(xLength, 2) + Math.pow(yLength, 2))

      if (magnitude === 0) {
        return [0, 0]
      }
      const unitVector =
        vectorType === 'tangent'
          ? [xLength / magnitude, yLength / magnitude]
          : [-yLength / magnitude, xLength / magnitude]

      return unitVector
    }
    vertices(prop: string, time: number) {
      if (this.k) {
        this.getValue()
      }
      let shapePath = this.v

      if (time !== undefined) {
        shapePath = (this.getValueAtTime as any)(time,
          0) as unknown as ShapePath
      }
      if (!shapePath) {
        return
      }
      const len = shapePath._length,
        vertices = shapePath[prop as keyof ShapePath] as Vector2[],
        points = shapePath.v,
        arr = createSizedArray(len)

      for (let i = 0; i < len; i++) {
        if (prop === 'i' || prop === 'o') {
          arr[i] = [
            vertices[i][0] - points[i][0], vertices[i][1] - points[i][1],
          ]
        } else {
          arr[i] = [vertices[i][0], vertices[i][1]]
        }
      }

      return arr
    }
  }
  extendPrototype([ShapeExpressions], ShapeProperty)
  extendPrototype([ShapeExpressions], KeyframedShapeProperty)
  KeyframedShapeProperty.prototype.getValueAtTime = getShapeValueAtTime
  KeyframedShapeProperty.prototype.initiateExpression = ExpressionManager
    .prototype.initiateExpression as any

  const propertyGetShapeProp = ShapePropertyFactory.getShapeProp

  ShapePropertyFactory.getShapeProp = function (
    elem: ShapeElement,
    data: Shape,
    type: number,
    arr: any[],
    trims: any
  ) {
    const prop = propertyGetShapeProp(
      elem, data, type, arr, trims
    )

    if (prop) {
      ;(prop as ShapeProperty).propertyIndex = data.ix
      prop.lock = false
    }

    if (type === 3) {
      searchExpressions(
        elem as ElementInterfaceIntersect,
        data.pt as any,
        prop as ShapeProperty
      )
    } else if (type === 4) {
      searchExpressions(
        elem as ElementInterfaceIntersect,
        data.ks as any,
        prop as ShapeProperty
      )
    }
    if (prop?.k) {
      elem.addDynamicProperty(prop)
    }

    return prop
  } as any
}
