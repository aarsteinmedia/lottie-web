/* eslint-disable @typescript-eslint/naming-convention */
import type {
  CompElementInterface,
  ElementInterfaceIntersect,
  GlobalData,
  Vector2,
  Vector3,
} from '@/types'
import type CompExpressionInterface from '@/utils/expressions/CompInterface'
import type LayerExpressionInterface from '@/utils/expressions/LayerInterface'
import type MaskManager from '@/utils/expressions/MaskInterface'
import type TextExpressionInterface from '@/utils/expressions/TextInterface'
import type TextExpressionSelectorPropFactory from '@/utils/expressions/TextSelectorPropertyDecorator'
import type { BaseProperty, ValueProperty } from '@/utils/Properties'
import type ShapePath from '@/utils/shapes/ShapePath'
import type TextSelectorProperty from '@/utils/text/TextSelectorProperty'

import { ArrayType } from '@/enums'
import { degToRads, isArrayOfNum } from '@/utils'
import { getBezierEasing } from '@/utils/BezierFactory'
import { createTypedArray } from '@/utils/helpers/arrays'
import { newElement } from '@/utils/pooling/ShapePool'

// import seedrandom from '@/utils/SeedRandom'
// import propTypes from '../helpers/propTypes'

export default class ExpressionManager {
  _lottieGlobal = {}
  _needsRandom?: boolean
  $bm_div = this.div
  $bm_mod = this.mod
  $bm_mul = this.mul
  $bm_sub = this.sub
  $bm_sum = this.sum
  // seedrandom(BMMath)

  $bm_transform?: any

  active?: boolean

  anchorPoint?: Vector2
  comp?: CompElementInterface

  content?: typeof LayerExpressionInterface

  data: any
  document = null
  effect?: any
  elem?: ElementInterfaceIntersect
  elemType?: number
  fetch = null
  frameExpressionId?: number

  frames = null

  getValueAtTime: any
  getVelocityAtTime: any
  globalData?: GlobalData
  hasParent?: boolean
  height = 0
  helperLengthArray = [0,
    0,
    0,
    0,
    0,
    0]
  index?: number

  inPoint = 0
  mask?: MaskManager

  name = ''
  needsVelocity?: boolean

  numKeys = 0
  outPoint = 0
  parent?: LayerExpressionInterface
  position?: Vector2
  propType?: string
  pv?: number | number[]
  randSeed = 0

  rotation?: number

  scale?: number

  scoped_bm_rt?: ValueProperty
  selectorValue?: number
  text?: TextExpressionInterface
  textIndex?: number
  textTotal?: number
  thisComp?: CompExpressionInterface
  thisLayer?: LayerExpressionInterface
  time = 0

  transform?: typeof LayerExpressionInterface
  val?: string | number | number[]

  value?: string | number | number[]

  velocity?: number

  width = 0
  /**
   * Const Math = BMMath.
   */
  window = null

  XMLHttpRequest = null
  private propTypes = { SHAPE: 'shape', }

  $bm_isInstanceOfArray(arr: unknown): arr is number[] {
    return arr?.constructor === Array || arr?.constructor === Float32Array
  }
  $bm_neg(a: number | boolean | BaseProperty) {
    const tOfA = typeof a

    if (tOfA === 'number' || a instanceof Number || tOfA === 'boolean') {
      return -a
    }
    if (this.$bm_isInstanceOfArray(a)) {
      const { length } = a
      const retArr = []

      for (let i = 0; i < length; i++) {
        retArr[i] = -a[i]
      }

      return retArr
    }
    if ('propType' in (a as BaseProperty)) {
      return (a as BaseProperty).v
    }

    return -a
  }
  add(_a: number | number[], _b: number | number[]) {
    throw new Error(`${this.constructor.name}: Method add is not implemented`)
  }
  applyEase(
    fn: (val: number) => number,
    tFromProps: number,
    tMin: number,
    tMax: number,
    val1FromProps?: number | number[],
    val2FromProps?: number | number[]
  ) {
    let t = tFromProps,
      val1 = val1FromProps,
      val2 = val2FromProps

    if (val1 === undefined) {
      val1 = tMin
      val2 = tMax
    } else {
      t = (t - tMin) / (tMax - tMin)
    }
    if (t > 1) {
      t = 1
    } else if (t < 0) {
      t = 0
    }
    const mult = fn(t)

    if (this.$bm_isInstanceOfArray(val1) && this.$bm_isInstanceOfArray(val2)) {
      let iKey
      const lenKey = val1.length
      const arr = createTypedArray(ArrayType.Float32, lenKey)

      for (iKey = 0; iKey < lenKey; iKey++) {
        arr[iKey] = (val2[iKey] - val1[iKey]) * mult + val1[iKey]
      }

      return arr
    }
    if (typeof val1 !== 'number' || typeof val2 !== 'number') {
      throw new TypeError(`${this.constructor}: invalid values`)
    }

    return (val2 - val1) * mult + val1
  }
  clamp(
    num: number, minFromProps: number, maxFromProps: number
  ) {
    let min = minFromProps,
      max = maxFromProps

    if (min > max) {
      const mm = max

      max = min
      min = mm
    }

    return Math.min(Math.max(num, min), max)
  }
  createPath(
    points: Vector2[],
    inTangents?: Vector2[],
    outTangents?: Vector2[],
    closed?: boolean
  ) {
    const { length } = points
    const path = newElement<ShapePath>()

    path.setPathData(Boolean(closed), length)
    const arrPlaceholder = [0, 0]
    let inVertexPoint
    let outVertexPoint

    for (let i = 0; i < length; i++) {
      inVertexPoint = inTangents?.[i] ? inTangents[i] : arrPlaceholder
      outVertexPoint = outTangents?.[i] ? outTangents[i] : arrPlaceholder
      path.setTripleAt(
        points[i][0],
        points[i][1],
        outVertexPoint[0] + points[i][0],
        outVertexPoint[1] + points[i][1],
        inVertexPoint[0] + points[i][0],
        inVertexPoint[1] + points[i][1],
        i,
        true
      )
    }

    return path
  }
  degrees_to_radians(_val: number) {
    throw new Error(`${this.constructor.name}: Method degrees_to_radians is not implemented`)
  }
  degreesToRadians(val: number) {
    return val * degToRads
  }
  div(a: number | number[], b: number | number[]) {
    const tOfA = typeof a
    const tOfB = typeof b
    let arr

    if (this.isNumerable(tOfA, a) && this.isNumerable(tOfB, b)) {
      return a / b
    }
    let len

    if (this.$bm_isInstanceOfArray(a) && this.isNumerable(tOfB, b)) {
      len = a.length
      arr = createTypedArray(ArrayType.Float32, len)
      for (let i = 0; i < len; i++) {
        arr[i] = a[i] / b
      }

      return arr
    }
    if (this.isNumerable(tOfA, a) && this.$bm_isInstanceOfArray(b)) {
      len = b.length
      arr = createTypedArray(ArrayType.Float32, len)
      for (let i = 0; i < len; i++) {
        arr[i] = a / b[i]
      }

      return arr
    }

    return 0
  }
  ease(
    t: number,
    tMin: number,
    tMax: number,
    val1?: number | number[],
    val2?: number | number[]
  ) {
    return this.applyEase(
      this.easeInOutBez, t, tMin, tMax, val1, val2
    )
  }
  easeIn(
    t: number,
    tMin: number,
    tMax: number,
    val1?: number | number[],
    val2?: number | number[]
  ) {
    return this.applyEase(
      this.easeInBez, t, tMin, tMax, val1, val2
    )
  }

  easeInBez(_val: number): number {
    throw new Error(`${this.constructor.name}: Method easeInBez is not implemented`)
  }
  easeInOutBez(_val: number): number {
    throw new Error(`${this.constructor.name}: Method easeInOutBez is not implemented`)
  }

  easeOut(
    t: number,
    tMin: number,
    tMax: number,
    val1?: number | number[],
    val2?: number | number[]
  ) {
    return this.applyEase(
      this.easeOutBez, t, tMin, tMax, val1, val2
    )
  }
  easeOutBez(_val: number): number {
    throw new Error(`${this.constructor.name}: Method easeOutBez is not implemented`)
  }

  executeExpression<T extends number | number[] | string = number>(_value?: T): T {
    // globalData.pushExpression();
    this.value = _value
    if (
      this.frameExpressionId === this.elem?.globalData.frameId &&
      this.propType !== 'textSelector'
    ) {
      return this.value as T
    }
    // if (this.propType === 'textSelector') {
    //   this.textIndex = this.textIndex
    //   this.textTotal = this.textTotal
    //   this.selectorValue = this.selectorValue
    // }
    if (!this.thisLayer) {
      if (!this.elem?.layerInterface) {
        throw new Error(`${this.constructor.name}: elem->layerInterface is not implemented`)
      }
      this.text = this.elem.layerInterface.text
      this.thisLayer = this.elem.layerInterface
      this.thisComp = this.elem.comp?.compInterface
      this.toWorld = this.thisLayer.toWorld.bind(this.thisLayer)
      this.fromWorld = this.thisLayer.fromWorld.bind(this.thisLayer)
      this.fromComp = this.thisLayer.fromComp.bind(this.thisLayer)
      this.toComp = this.thisLayer.toComp.bind(this.thisLayer)
      this.mask = this.thisLayer.mask
        ? (this.thisLayer.mask as any).bind(this.thisLayer)
        : null
      this.fromCompToSurface = this.fromComp
    }
    if (!this.transform) {
      this.transform = (this.elem?.layerInterface as any)('ADBE Transform Group')
      this.$bm_transform = this.transform
      if (this.transform) {
        this.anchorPoint = (this.transform as any).anchorPoint
        /* position = transform.position;
                rotation = transform.rotation;
                scale = transform.scale; */
      }
    }

    if (this.elemType === 4 && !this.content) {
      this.content = (this.thisLayer as any)('ADBE Root Vectors Group')
    }
    if (!this.effect) {
      this.effect = (this.thisLayer as any)(4)
    }
    this.hasParent = Boolean(this.elem?.hierarchy?.length)
    if (this.hasParent && !parent) {
      this.parent = this.elem?.hierarchy?.[0].layerInterface
    }
    if (!this.comp) {
      throw new Error(`${this.constructor.name}: comp is not implemented`)
    }
    this.time =
      (this.comp.renderedFrame || -1) / (this.comp.globalData?.frameRate || 60)
    if (this._needsRandom) {
      this.seedRandom(this.randSeed + this.time)
    }
    if (this.needsVelocity) {
      this.velocity = this.velocityAtTime(this.time)
    }
    this.expression_function()
    this.frameExpressionId = this.elem?.globalData.frameId

    // TODO: Check if it's possible to return on ShapeInterface the .v value
    // Changed this to a ternary operation because Rollup failed compiling it correctly
    this.scoped_bm_rt =
      this.scoped_bm_rt?.propType === this.propTypes.SHAPE
        ? (this.scoped_bm_rt.v as unknown as ValueProperty)
        : this.scoped_bm_rt

    return this.scoped_bm_rt as unknown as T
  }

  expression_function() {
    throw new Error(`${this.constructor.name}: Method expression_function is not implemented`)
  }

  framesToTime(fr: number, fpsFromProps?: number) {
    let fps = fpsFromProps

    if (!fps) {
      fps = this.elem?.comp?.globalData?.frameRate || 60
    }

    return fr / fps
  }

  fromComp(_arr: number[], _time?: number): void {
    throw new Error(`${this.constructor.name}: Method fromComp is not implemented`)
  }

  fromCompToSurface(_arr: number[], _time?: number): void {
    throw new Error(`${this.constructor.name}: Method fromCompToSurface is not implemented`)
  }

  fromWorld(_arr: number[], _time?: number): void {
    throw new Error(`${this.constructor.name}: Method fromWorld is not implemented`)
  }

  initiateExpression(
    elem: ElementInterfaceIntersect,
    data: TextSelectorProperty,
    property: TextExpressionSelectorPropFactory
  ) {
    if (!elem.globalData.renderConfig?.runExpressions) {
      return this.noOp
    }

    if (!elem.comp) {
      throw new Error(`${this.constructor.name}: elem->comp is not implemented`)
    }

    if (!elem.comp.globalData) {
      throw new Error(`${this.constructor.name}: elem->comp->globalData is not implemented`)
    }

    this.elem = elem

    this.add = this.sum
    this.radians_to_degrees = this.radiansToDegrees
    this.degrees_to_radians = this.degreesToRadians

    this.easeInBez = getBezierEasing(
      0.333, 0, 0.833, 0.833, 'easeIn'
    ).get
    this.easeOutBez = getBezierEasing(
      0.167, 0.167, 0.667, 1, 'easeOut'
    ).get
    this.easeInOutBez = getBezierEasing(
      0.33, 0, 0.667, 1, 'easeInOut'
    ).get

    this.val = data.x as unknown as string
    this.needsVelocity = /velocity\b/.test(this.val)
    this._needsRandom = this.val?.indexOf('random') !== -1
    this.elemType = elem.data.ty
    const thisProperty = property as any

    thisProperty.valueAtTime = thisProperty.getValueAtTime
    thisProperty.value = thisProperty.v
    elem.comp.frameDuration = 1 / elem.comp.globalData.frameRate
    elem.comp.displayStartTime = 0
    this.inPoint = elem.data.ip / elem.comp.globalData.frameRate
    this.outPoint = elem.data.op / elem.comp.globalData.frameRate
    this.width = elem.data.sw ? elem.data.sw : 0
    this.height = elem.data.sh ? elem.data.sh : 0
    this.name = elem.data.nm

    // TODO: Eval alternative

    this.expression_function = new Function(`
      function _expression_function() {
        ${this.val};
        scoped_bm_rt = $bm_rt;
      }
      return _expression_function;
      `)()
    // this.expression_function = eval(
    //   `[function _expression_function(){${this.val};scoped_bm_rt=$bm_rt}]`
    // )[0]
    this.numKeys = property.kf ? (data.k as unknown as number[])?.length : 0

    this.active = !this.data || this.data.hd !== true

    this.wiggle = this.wiggle.bind(this)

    if (thisProperty.loopIn) {
      this.loopIn = thisProperty.loopIn.bind(thisProperty)
      this.loop_in = this.loopIn
    }

    if (thisProperty.loopOut) {
      this.loopOut = thisProperty.loopOut.bind(thisProperty)
      this.loop_out = this.loopOut
    }

    if (thisProperty.smooth) {
      this.smooth = thisProperty.smooth.bind(thisProperty)
    }

    if (this.getValueAtTime) {
      this.valueAtTime = this.getValueAtTime.bind(this)
    }

    if (this.getVelocityAtTime) {
      this.velocityAtTime = this.getVelocityAtTime.bind(this)
    }

    this.comp = (elem.comp.globalData.projectInterface as any).bind(elem.comp.globalData.projectInterface)

    this.index = elem.data.ind
    this.hasParent = Boolean(elem.hierarchy?.length)

    this.randSeed = Math.floor(Math.random() * 1000000)
    this.globalData = elem.globalData

    return this.executeExpression
  }

  isNumerable(tOfV: string, v: unknown): v is number {
    return (
      tOfV === 'number' ||
      v instanceof Number ||
      tOfV === 'boolean' ||
      tOfV === 'string'
    )
  }

  key(indFromProps: number) {
    let ind = indFromProps

    if (this.data.k.length === 0 || typeof this.data.k[0] === 'number') {
      throw new Error(`The property has no keyframe at index ${ind}`)
    }
    ind -= 1
    const obKey: {
      time: number
      value: any[]
      [key: number]: any
    } = {
      time: this.data.k[ind].t / (this.elem?.comp?.globalData?.frameRate || 60),
      value: [],
    }
    const arr = Object.hasOwn(this.data.k[ind], 's')
      ? this.data.k[ind].s
      : this.data.k[ind - 1].e

    const lenKey = arr.length

    for (let iKey = 0; iKey < lenKey; iKey++) {
      obKey[iKey] = arr[iKey]
      obKey.value[iKey] = arr[iKey]
    }

    return obKey
  }

  length(arr1: number | number[], arr2FromProps?: number | number[]) {
    let arr2 = arr2FromProps

    if (typeof arr1 === 'number' || arr1 instanceof Number) {
      arr2 = arr2 || 0

      return Math.abs((arr1 as number) - (arr2 as number))
    }
    if (!arr2) {
      arr2 = this.helperLengthArray
    }
    const len = Math.min(arr1.length, (arr2 as number[]).length)
    let addedLength = 0

    for (let i = 0; i < len; i++) {
      addedLength += Math.pow((arr2 as number[])[i] - arr1[i], 2)
    }

    return Math.sqrt(addedLength)
  }

  linear(
    t: number,
    tMinFromProps: number,
    tMaxFromProps: number,
    value1FromProps: number | number[],
    value2FromProps: number | number[]
  ) {
    let tMin = tMinFromProps,
      tMax = tMaxFromProps,
      value1 = value1FromProps,
      value2 = value2FromProps

    if (value1 === undefined || value2 === undefined) {
      value1 = tMin
      value2 = tMax
      tMin = 0
      tMax = 1
    }
    if (tMax < tMin) {
      const _tMin = tMax

      tMax = tMin
      tMin = _tMin
    }
    if (t <= tMin) {
      return value1
    }
    if (t >= tMax) {
      return value2
    }
    const perc = tMax === tMin ? 0 : (t - tMin) / (tMax - tMin)

    if (!isArrayOfNum(value1) && !isArrayOfNum(value2)) {
      return value1 + (value2 - value1) * perc
    }
    if (!isArrayOfNum(value1) || !isArrayOfNum(value2)) {
      throw new Error(`${this.constructor.name}: Invalid value`)
    }
    const len = value1.length
    const arr = createTypedArray(ArrayType.Float32, len)

    for (let i = 0; i < len; i++) {
      arr[i] = value1[i] + (value2[i] - value1[i]) * perc
    }

    return arr
  }

  lookAt(elem1: number[], elem2: number[]): Vector3 {
    const fVec = [
        elem2[0] - elem1[0],
        elem2[1] - elem1[1],
        elem2[2] - elem1[2],
      ],
      pitch =
        Math.atan2(fVec[0], Math.sqrt(fVec[1] * fVec[1] + fVec[2] * fVec[2])) /
        degToRads,
      yaw = -Math.atan2(fVec[1], fVec[2]) / degToRads

    return [yaw,
      pitch,
      0]
  }

  loop_in(
    _type?: string, _duration?: number, _flag?: boolean
  ) {
    throw new Error(`${this.constructor.name}: Method loop_in is not implemented`)
  }

  loop_out(
    _type?: string, _duration?: number, _flag?: boolean
  ) {
    throw new Error(`${this.constructor.name}: Method loop_out is not implemented`)
  }

  loopIn(
    _type?: string, _duration?: number, _flag?: boolean
  ) {
    throw new Error(`${this.constructor.name}: Method loopIn is not implemented`)
  }
  loopInDuration(type: string, duration: number) {
    this.loopIn(
      type, duration, true
    )
  }

  loopOut(
    _type?: string, _duration?: number, _flag?: boolean
  ) {
    throw new Error(`${this.constructor.name}: Method loopOut is not implemented`)
  }

  loopOutDuration(type: string, duration: number) {
    this.loopOut(
      type, duration, true
    )
  }

  mod(aFromProps: string | number, bFromProps: string | number) {
    let a = aFromProps,
      b = bFromProps

    if (typeof a === 'string') {
      a = parseInt(a, 10)
    }
    if (typeof b === 'string') {
      b = parseInt(b, 10)
    }

    return a % b
  }

  mul(a: number | number[], b: number | number[]): number | number[] {
    const tOfA = typeof a
    const tOfB = typeof b
    let arr

    if (this.isNumerable(tOfA, a) && this.isNumerable(tOfB, b)) {
      return a * b
    }

    if (this.$bm_isInstanceOfArray(a) && this.isNumerable(tOfB, b)) {
      const { length } = a

      arr = createTypedArray(ArrayType.Float32, length)
      for (let i = 0; i < length; i++) {
        arr[i] = a[i] * b
      }

      return arr as number[]
    }
    if (this.isNumerable(tOfA, a) && this.$bm_isInstanceOfArray(b)) {
      const { length } = b

      arr = createTypedArray(ArrayType.Float32, length)
      for (let i = 0; i < length; i++) {
        arr[i] = a * b[i]
      }

      return arr as number[]
    }

    return 0
  }

  nearestKey(timeFromProps: number) {
    let time = timeFromProps
    let iKey
    const lenKey = this.data.k.length
    let index
    let keyTime

    if (this.data.k.length === 0 || typeof this.data.k[0] === 'number') {
      index = 0
      keyTime = 0
    } else {
      index = -1
      time *= this.elem?.comp?.globalData?.frameRate || 60
      if (time < this.data.k[0].t) {
        index = 1
        keyTime = this.data.k[0].t
      } else {
        for (iKey = 0; iKey < lenKey - 1; iKey++) {
          if (time === this.data.k[iKey].t) {
            index = iKey + 1
            keyTime = this.data.k[iKey].t
            break
          }
          if (!(time > this.data.k[iKey].t && time < this.data.k[iKey + 1].t)) {
            break
          }
          if (time - this.data.k[iKey].t > this.data.k[iKey + 1].t - time) {
            index = iKey + 2
            keyTime = this.data.k[iKey + 1].t
          } else {
            index = iKey + 1
            keyTime = this.data.k[iKey].t
          }
          break
        }
        if (index === -1) {
          index = iKey + 1
          keyTime = this.data.k[iKey].t
        }
      }
    }

    return {
      index,
      time: keyTime / (this.elem?.comp?.globalData?.frameRate || 60),
    }
  }

  normalize(vec: number[]) {
    return this.div(vec, this.length(vec))
  }

  posterizeTime(framesPerSecond: number) {
    this.time =
      framesPerSecond === 0
        ? 0
        : Math.floor(this.time * framesPerSecond) / framesPerSecond
    this.value = this.valueAtTime(this.time)
  }

  radians_to_degrees(_val: number) {
    throw new Error(`${this.constructor.name}: Method radians_to_degrees is not implemented`)
  }

  radiansToDegrees(val: number) {
    return val / degToRads
  }

  random(minFromProps?: number | number[], maxFromProps?: number | number[]) {
    let min = minFromProps,
      max = maxFromProps

    if (max === undefined) {
      if (min === undefined) {
        min = 0
        max = 1
      } else {
        max = min
        min = undefined
      }
    }
    if (isArrayOfNum(max)) {
      const len = max.length

      if (!min) {
        min = createTypedArray(ArrayType.Float32, len) as number[]
      }
      const arr = createTypedArray(ArrayType.Float32, len),
        rnd = Math.random()

      for (let i = 0; i < len; i++) {
        arr[i] = (min as number[])[i] + rnd * (max[i] - (min as number[])[i])
      }

      return arr
    }
    if (min === undefined) {
      min = 0
    }
    const rndm = Math.random()

    return (min as number) + rndm * (max - (min as number))
  }

  resetFrame() {
    this._lottieGlobal = {}
  }

  // scoped_bm_rt() {
  //   throw new Error(
  //     `${this.constructor.name}: Method scoped_bm_rt is not implemented`
  //   )
  // }

  seedRandom(_seed: number) {
    throw new Error(`${this.constructor.name}: seedRandom is not implemented`)
    // BMMath.seedrandom(randSeed + seed)
  }

  smooth() {
    throw new Error(`${this.constructor.name}: Method smooth is not implemented`)
  }

  sourceRectAtTime() {
    return this.elem?.sourceRectAtTime()
  }

  sub(aFromProps: string | number | number[],
    bFromProps: string | number | number[]) {
    let a = aFromProps,
      b = bFromProps
    const tOfA = typeof a
    const tOfB = typeof b

    if (this.isNumerable(tOfA, a) && this.isNumerable(tOfB, b)) {
      if (tOfA === 'string') {
        a = parseInt(a as unknown as string, 10)
      }
      if (tOfB === 'string') {
        b = parseInt(b as unknown as string, 10)
      }

      return a - b
    }
    if (this.$bm_isInstanceOfArray(a) && this.isNumerable(tOfB, b)) {
      a = [...a]
      a[0] -= b

      return a
    }
    if (this.isNumerable(tOfA, a) && this.$bm_isInstanceOfArray(b)) {
      b = [...b]
      b[0] = a - b[0]

      return b
    }
    if (this.$bm_isInstanceOfArray(a) && this.$bm_isInstanceOfArray(b)) {
      let i = 0
      const lenA = a.length
      const lenB = b.length
      const retArr = []

      while (i < lenA || i < lenB) {
        if (
          (typeof a[i] === 'number' || (a as any)[i] instanceof Number) &&
          (typeof b[i] === 'number' || (b as any)[i] instanceof Number)
        ) {
          retArr[i] = a[i] - b[i]
        } else {
          retArr[i] = b[i] === undefined ? a[i] : a[i] || b[i]
        }
        i++
      }

      return retArr
    }

    return 0
  }

  substr(init: number, end?: number) {
    if (typeof this.value === 'string') {
      if (end === undefined) {
        return this.value.slice(Math.max(0, init))
      }

      return this.value.substring(init, end)
    }

    return ''
  }

  substring(init: number, end?: number) {
    if (typeof this.value === 'string') {
      if (end === undefined) {
        return this.value.slice(Math.max(0, init))
      }

      return this.value.substring(init, end)
    }

    return ''
  }

  sum(aFromProps: number | number[], bFromProps: number | number[]) {
    let a = aFromProps,
      b = bFromProps
    const tOfA = typeof a,
      tOfB = typeof b

    if (
      this.isNumerable(tOfA, a) && this.isNumerable(tOfB, b) ||
      tOfA === 'string' ||
      tOfB === 'string'
    ) {
      return (a as number) + (b as number)
    }
    if (this.$bm_isInstanceOfArray(a) && this.isNumerable(tOfB, b)) {
      a = [...a]
      a[0] += b

      return a
    }
    if (this.isNumerable(tOfA, a) && this.$bm_isInstanceOfArray(b)) {
      b = [...b]
      b[0] = a + b[0]

      return b
    }
    if (this.$bm_isInstanceOfArray(a) && this.$bm_isInstanceOfArray(b)) {
      let i = 0
      const lenA = a.length
      const lenB = b.length
      const retArr = []

      while (i < lenA || i < lenB) {
        if (
          (typeof a[i] === 'number' || (a as any)[i] instanceof Number) &&
          (typeof b[i] === 'number' || (b as any)[i] instanceof Number)
        ) {
          retArr[i] = a[i] + b[i]
        } else {
          retArr[i] = b[i] === undefined ? a[i] : a[i] || b[i]
        }
        i++
      }

      return retArr
    }

    return 0
  }

  timeToFrames(tFromProps?: number, fpsFromProps?: number) {
    let t = tFromProps,
      fps = fpsFromProps

    if (!t && t !== 0) {
      t = this.time
    }
    if (!fps) {
      fps = this.elem?.comp?.globalData?.frameRate || 60
    }

    return t * fps
  }

  toComp(_arr: number[], _time?: number): void {
    throw new Error(`${this.constructor.name}: Method toComp is not implemented`)
  }

  toWorld(_arr: number[], _time?: number): number[] {
    throw new Error(`${this.constructor.name}: Method toWorld is not implemented`)
  }

  valueAtTime(_num: number): string | number | number[] {
    throw new Error(`${this.constructor.name}: Method valueAtTime is not implemented`)
  }

  velocityAtTime(_num: number): number {
    throw new Error(`${this.constructor.name}: Method velocityAtTime is not implemented`)
  }

  wiggle(freqFromProps: number, amp: number) {
    let freq = freqFromProps
    let iWiggle
    const lenWiggle = isArrayOfNum(this.pv) ? this.pv.length : 1
    const addedAmps = createTypedArray(ArrayType.Float32, lenWiggle)

    freq = 5
    const iterations = Math.floor(this.time * freq)

    iWiggle = 0
    let j = 0

    while (iWiggle < iterations) {
      // var rnd = BMMath.random();
      for (j = 0; j < lenWiggle; j++) {
        addedAmps[j] += -amp + amp * 2 * Math.random()
        // addedAmps[j] += -amp + amp*2*rnd;
      }
      iWiggle++
    }
    // var rnd2 = BMMath.random();
    const periods = this.time * freq
    const perc = periods - Math.floor(periods)
    const arr = createTypedArray(ArrayType.Float32, lenWiggle)

    if (lenWiggle > 1) {
      for (j = 0; j < lenWiggle; j++) {
        arr[j] =
          (this.pv as number[])[j] +
          addedAmps[j] +
          (-amp + amp * 2 * Math.random()) * perc
        // arr[j] = this.pv[j] + addedAmps[j] + (-amp + amp*2*rnd)*perc;
        // arr[i] = this.pv[i] + addedAmp + amp1*perc + amp2*(1-perc);
      }

      return arr
    }

    return (
      (this.pv as number) +
      addedAmps[0] +
      (-amp + amp * 2 * Math.random()) * perc
    )
  }

  /**
   * Bail out if we don't want expressions.
   */
  private noOp(_value?: unknown) {
    return _value
  }
}
