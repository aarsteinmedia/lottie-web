/* eslint-disable unicorn/consistent-destructuring */
/* eslint-disable @typescript-eslint/naming-convention */
import type {
  Cartesian3D,
  ElementInterfaceIntersect, ExpressionProperty, ExpressionReturn, Shape, Vector2,
  Vector3,
  Vector4,
} from '@/types'
import type { CompExpressionInterface } from '@/utils/expressions/CompInterface'
import type { GroupEffectInterface } from '@/utils/expressions/EffectInterface'
import type { LayerExpressionInterface } from '@/utils/expressions/LayerInterface'
import type { ShapeExpressionInterface } from '@/utils/expressions/shapes/ShapeInterface'
import type { TextExpressionInterface } from '@/utils/expressions/TextInterface'
import type { TransformExpressionInterface } from '@/utils/expressions/TransformInterface'
import type { BaseProperty } from '@/utils/properties/BaseProperty'
import type { KeyframedValueProperty } from '@/utils/properties/KeyframedValueProperty'
import type { ValueProperty } from '@/utils/properties/ValueProperty'
import type { ShapePath } from '@/utils/shapes/ShapePath'

import {
  clamp,
  isArray,
  isArrayOfNum
} from '@/utils'
import BezierFactory from '@/utils/BezierFactory'
import BMMath from '@/utils/BMMath'
import { ArrayType, PropType } from '@/utils/enums'
import { createTypedArray } from '@/utils/helpers/arrays'
import { degToRads } from '@/utils/helpers/constants'
import shapePool from '@/utils/pooling/ShapePool'
import seedrandom from '@/utils/seedrandom'

const Math = BMMath,
  window = null,
  document = null,
  XMLHttpRequest = null,
  fetch = null,
  frames = null
let _lottieGlobal = {}

seedrandom(BMMath)

const $bm_div = div,
  $bm_mod = mod,
  $bm_mul = mul,
  $bm_sub = sub,
  $bm_sum = sum,
  degrees_to_radians = radiansToDegrees,
  radians_to_degrees = radiansToDegrees,

  helperLengthArray = [0,
    0,
    0,
    0,
    0,
    0],
  add = sum,

  easeInBez = BezierFactory.getBezierEasing(
    0.333, 0, 0.833, 0.833, 'easeIn'
  ).get,

  easeInOutBez = BezierFactory.getBezierEasing(
    0.33, 0, 0.667, 1, 'easeInOut'
  ).get,

  easeOutBez = BezierFactory.getBezierEasing(
    0.167, 0.167, 0.667, 1, 'easeOut'
  ).get

const hueToRGB = (
    p: number, q: number, tFromProps: number
  ) => {
    let t = tFromProps

    if (t < 0) {
      t++
    }
    if (t > 1) {
      t -= 1
    }
    if (t < 1 / 6) {
      return p + (q - p) * 6 * t
    }
    if (t < 1 / 2) {
      return q
    }
    if (t < 2 / 3) {
      return p + (q - p) * (2 / 3 - t) * 6
    }

    return p
  },

  hslToRgb = (val: number[]): Vector4 => {
    const h = val[0] ?? 0,
      s = val[1] ?? 0,
      l = val[2] ?? 0

    let r, g, b

    if (s === 0) {
      r = l // achromatic
      b = l // achromatic
      g = l // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q

      r = hueToRGB(
        p, q, h + 1 / 3
      )
      g = hueToRGB(
        p, q, h
      )
      b = hueToRGB(
        p, q, h - 1 / 3
      )
    }

    return [r,
      g,
      b,
      val[3] ?? 0]
  },
  rgbToHsl = (val: Vector4) => {
    const r = val[0],
      g = val[1],
      b = val[2],
      max = Math.max(
        r, g, b
      ),
      min = Math.min(
        r, g, b
      )
    let h = 0,
      s
    const l = (max + min) / 2

    if (max === min) {
      h = 0 // achromatic
      s = 0 // achromatic
    } else {
      const d = max - min

      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: {
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        }
        case g: {
          h = (b - r) / d + 2
          break
        }
        case b: {
          h = (r - g) / d + 4
          break
        }
        default: {
          break
        }
      }
      h /= 6
    }

    return [h,
      s,
      l,
      val[3]]
  }

function $bm_neg(a: unknown) {
  const tOfA = typeof a

  if (tOfA === 'number' || a instanceof Number || tOfA === 'boolean') {
    return -(a as number)
  }
  if ($bm_isInstanceOfArray(a as number[])) {

    const { length: lenA } = a as number[],
      retArr: number[] = []

    for (let i = 0; i < lenA; i++) {
      retArr[i] = -Number((a as number[])[i])
    }

    return retArr
  }
  if ((a as ValueProperty).propType) {
    return (a as ValueProperty).v
  }

  return -(a as number)
}

function createPath(
  points: Vector2[], inTangents: Vector2[], outTangents: Vector2[], closed?: boolean
) {

  const { length: len } = points
  const path = shapePool.newElement() as ShapePath

  path.setPathData(Boolean(closed), len)
  const arrPlaceholder = [0, 0]
  let inVertexPoint,
    outVertexPoint

  for (let i = 0; i < len; i++) {
    inVertexPoint = inTangents[i] ?? arrPlaceholder
    outVertexPoint = outTangents[i] ?? arrPlaceholder
    path.setTripleAt(
      points[i]?.[0] ?? 0, points[i]?.[1] ?? 0, (outVertexPoint[0] ?? 0) + (points[i]?.[0] ?? 0), (outVertexPoint[1] ?? 0) + (points[i]?.[1] ?? 0), (inVertexPoint[0] ?? 0) + (points[i]?.[0] ?? 0), (inVertexPoint[1] ?? 0) + (points[i]?.[1] ?? 0), i, true
    )
  }

  return path
}

function applyEase(
  fn: typeof easeInOutBez, tFromProps: number, tMin: number, tMax: number, val1FromProps?: number, val2FromProps?: number
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

  if ($bm_isInstanceOfArray(val1) && $bm_isInstanceOfArray(val2)) {
    let iKey

    const lenKey = val1.length
    const arr = createTypedArray(ArrayType.Float32, lenKey)

    for (iKey = 0; iKey < lenKey; iKey += 1) {
      arr[iKey] = (val2[iKey] as number - (val1[iKey] as number)) * mult + (val1[iKey] as number)
    }

    return arr
  }

  return (val2 as number - val1) * mult + val1
}

function easeOut(
  t: number, tMin: number, tMax: number, val1?: number, val2?: number
) {
  return applyEase(
    easeOutBez, t, tMin, tMax, val1, val2
  )
}

function easeIn(
  t: number, tMin: number, tMax: number, val1?: number, val2?: number
) {
  return applyEase(
    easeInBez, t, tMin, tMax, val1, val2
  )
}

function ease(
  t: number, tMin: number, tMax: number, val1?: number, val2?: number
) {
  return applyEase(
    easeInOutBez, t, tMin, tMax, val1, val2
  )
}

function initiateExpression(
  this: KeyframedValueProperty,
  elem: ElementInterfaceIntersect,
  data: ExpressionProperty,
  property: KeyframedValueProperty
) {
  /**
     * Bail out if we don't want expressions.
     */
  if (!elem.globalData?.renderConfig?.runExpressions) {
    return noOp
  }

  if (!elem.comp?.globalData) {
    throw new Error('CompElement is not implemented')
  }

  const { k, x: val } = data,
    needsVelocity = /velocity\b/.test(val),
    _needsRandom = val.includes('random'),
    {
      ip, nm, op, sh = 0, sw = 0, ty: elemType
    } = elem.data

  let $bm_transform: undefined | TransformExpressionInterface,
    content: undefined | ShapeExpressionInterface,
    effect: undefined | GroupEffectInterface,
    randSeed = 0,
    transform: undefined | TransformExpressionInterface
  const thisProperty = property

  thisProperty._name = nm
  thisProperty.valueAtTime = thisProperty.getValueAtTime
  Object.defineProperty(
    thisProperty, 'value', {
      get() {
        return thisProperty.v
      },
    }
  )
  elem.comp.frameDuration = 1 / elem.comp.globalData.frameRate
  elem.comp.displayStartTime = 0
  const inPoint = ip / elem.comp.globalData.frameRate,
    outPoint = op / elem.comp.globalData.frameRate,
    width = sw,
    height = sh,
    name = nm
  let
    anchorPoint: null | ((type: string, duration: number, flag?: boolean) => void) = null,
    fromComp: null | ((arr: number[]) => Cartesian3D) = null,
    fromCompToSurface: null | ((arr: number[]) => Cartesian3D) = null,
    fromWorld: null | ((arr: number[], time: number) => Cartesian3D) = null,
    loopIn: (type: string, duration: number, wrap?: boolean) => void,
    loop_in: null | ((type: string, duration: number, wrap?: boolean) => void) = null,
    loopOut: (type: string, duration: number, wrap?: boolean) => void,
    loop_out: null | ((type: string, duration: number, flag?: boolean) => void) = null,
    mask: null | ((type: string, duration: number, flag?: boolean) => void) = null,
    // eslint-disable-next-line prefer-const
    position: null | ((type: string, duration: number, flag?: boolean) => void) = null,
    // eslint-disable-next-line prefer-const
    rotation: null | ((type: string, duration: number, flag?: boolean) => void) = null,
    // eslint-disable-next-line prefer-const
    scale: null | ((type: string, duration: number, flag?: boolean) => void) = null,
    smooth: null | ((width: number, sample: number) => void) = null,
    thisComp: null | CompExpressionInterface = null,
    toComp: null | ((arr: number[], time: number) => void) = null,
    toWorld: null | ((arr: number[], time: number) => number[]) = null,

    thisLayer: null | undefined | LayerExpressionInterface,

    scoped_bm_rt = noOp

  interface ScopedBodymovinReturn { scoped_bm_rt?: ExpressionReturn }

  const obj: ScopedBodymovinReturn = {},
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    expression_function = new Function(
      '_lottieGlobal',
      '$bm_div',
      '$bm_mod',
      '$bm_mul',
      '$bm_neg',
      '$bm_sub',
      '$bm_sum',
      '$bm_transform',
      'active',
      'add',
      'anchorPoint',
      'clamp',
      'comp',
      'content',
      'createPath',
      'degrees_to_radians',
      'degreesToRadians',
      'div',
      'document',
      'ease',
      'easeIn',
      'easeOut',
      'effect',
      'fetch',
      'frames',
      'framesToTime',
      'fromComp',
      'fromCompToSurface',
      'fromWorld',
      'globalData',
      'height',
      'hslToRgb',
      'index',
      'inPoint',
      'key',
      'length',
      'linear',
      'lookAt',
      'loop_in',
      'loop_out',
      'loopIn',
      'loopInDuration',
      'loopOut',
      'loopOutDuration',
      'mask',
      'mod',
      'mul',
      'name',
      'nearestKey',
      'normalize',
      'numKeys',
      'obj',
      'outPoint',
      'position',
      'posterizeTime',
      'propertyIndex',
      'radians_to_degrees',
      'radiansToDegrees',
      'random',
      'randSeed',
      'rgbToHsl',
      'rotation',
      'scale',
      'seedRandom',
      'selectorValue',
      'smooth',
      'sourceRectAtTime',
      'sub',
      'substr',
      'substring',
      'text',
      'textIndex',
      'textTotal',
      'thisComp',
      'thisLayer',
      'thisProperty',
      'time',
      'timeToFrames',
      'toComp',
      'toWorld',
      'transform',
      'value',
      'valueAtTime',
      'velocity',
      'width',
      'wiggle',
      'window',
      'XMLHttpRequest',
      /* JavaScript */ `
      ${val}
      obj.scoped_bm_rt = $bm_rt;`
    )

  let time = 0,
    velocity: number,
    value: unknown = null,
    text: TextExpressionInterface | undefined,
    textIndex: number,
    textTotal: number,
    selectorValue: string | undefined

  const numKeys = property.kf ? k.length : 0,
    propertyIndex = data.ix,
    active = !this.data || (this.data as Shape).hd !== true,

    wiggle = (_freqFromProps: number, amp: number) => {
      // let freq: number
      const { pv: prop } = this,
        lenWiggle = isArrayOfNum(prop) ? prop.length : 1,
        addedAmps = createTypedArray(ArrayType.Float32, lenWiggle),

        freq = 5,
        iterations = Math.floor(time * freq)

      let iWiggle = 0

      while (iWiggle < iterations) {
        // var rnd = BMMath.random();
        for (let j = 0; j < lenWiggle; j++) {
          ; (addedAmps[j] as number) += -amp + amp * 2 * BMMath.random()
          // addedAmps[j] += -amp + amp*2*rnd;
        }
        iWiggle++
      }
      // var rnd2 = BMMath.random();
      const periods = time * freq,
        perc = periods - Math.floor(periods),
        arr = createTypedArray(ArrayType.Float32, lenWiggle)

      if (lenWiggle > 1) {
        for (let j = 0; j < lenWiggle; j++) {
          arr[j] = (prop as number[])[j] as number + (addedAmps[j] as number) + (-amp + amp * 2 * BMMath.random()) * perc
          // arr[j] = this.pv[j] + addedAmps[j] + (-amp + amp*2*rnd)*perc;
          // arr[i] = this.pv[i] + addedAmp + amp1*perc + amp2*(1-perc);
        }

        return arr
      }

      return prop as number + (addedAmps[0] as number) + (-amp + amp * 2 * BMMath.random()) * perc
    }

  if (thisProperty.loopIn) {
    loopIn = thisProperty.loopIn.bind(thisProperty)
    loop_in = loopIn
  }

  if (thisProperty.loopOut) {
    loopOut = thisProperty.loopOut.bind(thisProperty)
    loop_out = loopOut
  }

  if (thisProperty.smooth) {
    smooth = thisProperty.smooth.bind(thisProperty)
  }

  function loopInDuration(type: string, duration: number) {
    loopIn(
      type, duration, true
    )
  }

  function loopOutDuration(type: string, duration: number) {
    loopOut(
      type, duration, true
    )
  }

  const valueAtTime = this.getValueAtTime.bind(this),
    velocityAtTime = this.getVelocityAtTime.bind(this),
    { frameRate, projectInterface: comp } = elem.comp.globalData

  function lookAt(elem1: Vector3, elem2: Vector3) {
    const fVec: Vector3 = [elem2[0] - elem1[0],
      elem2[1] - elem1[1],
      elem2[2] - elem1[2]]
    const pitch = Math.atan2(fVec[0], Math.sqrt(fVec[1] * fVec[1] + fVec[2] * fVec[2])) / degToRads
    const yaw = -Math.atan2(fVec[1], fVec[2]) / degToRads

    return [yaw,
      pitch,
      0]
  }

  function nearestKey(timeFromProps: number) {
    let timeKey = timeFromProps,
      iKey

    const lenKey = k.length
    let timeIndex
    let keyTime

    if (k.length === 0 || typeof k[0] === 'number') {
      timeIndex = 0
      keyTime = 0
    } else {
      timeIndex = -1
      timeKey *= frameRate
      if (timeKey < (k[0]?.t ?? 0)) {
        timeIndex = 1
        keyTime = k[0]?.t ?? 0
      } else {
        for (iKey = 0; iKey < lenKey - 1; iKey += 1) {
          if (timeKey === k[iKey]?.t) {
            timeIndex = iKey + 1
            keyTime = k[iKey]?.t ?? 0
            break
          } else if (timeKey > (k[iKey]?.t ?? 0) && timeKey < (k[iKey + 1]?.t ?? 0)) {
            if (timeKey - (k[iKey]?.t ?? 0) > (k[iKey + 1]?.t ?? 0) - timeKey) {
              timeIndex = iKey + 2
              keyTime = k[iKey + 1]?.t ?? 0
            } else {
              timeIndex = iKey + 1
              keyTime = k[iKey]?.t ?? 0
            }
            break
          }
        }
        if (timeIndex === -1) {
          timeIndex = iKey + 1
          keyTime = data.k[iKey]?.t ?? 0
        }
      }
    }

    return {
      index: timeIndex,
      time: keyTime || 0 / frameRate
    }
  }

  interface ObjectKey {
    [val: number]: number | ShapePath | undefined
    time?: number
    value: (number | ShapePath | undefined)[]
  }

  function key(indFormProps: number) {
    let ind = indFormProps

    if (data.k.length === 0 || typeof data.k[0] === 'number') {
      throw new Error(`The property has no keyframe at index ${ind}`)
    }
    ind -= 1
    const obKey: ObjectKey = {
      time: (data.k[ind]?.t ?? 0) / frameRate,
      value: [],
    }
    const arr = (Object.hasOwn(data.k[ind] ?? {}, 's') ? data.k[ind]?.s : data.k[ind - 1]?.e) ?? [],

      { length: lenKey } = arr


    for (let iKey = 0; iKey < lenKey; iKey += 1) {
      obKey[iKey] = arr[iKey]
      obKey.value[iKey] = arr[iKey]
    }

    return obKey
  }

  function framesToTime(fr: number, fpsFromProps?: number) {
    let fps = fpsFromProps

    if (!fps) {
      fps = frameRate
    }

    return fr / fps
  }

  function timeToFrames(tFromProps: number, fpsFromProps?: number) {
    let t = tFromProps,
      fps = fpsFromProps

    if (!t && t !== 0) {
      t = time
    }
    if (!fps) {
      fps = frameRate
    }

    return t * fps
  }

  function seedRandom(seed: number) {
    BMMath.seedrandom(randSeed + seed)
  }

  function sourceRectAtTime() {
    return elem.sourceRectAtTime()
  }

  function substring(init: number, end?: number) {
    if (typeof value === 'string') {
      if (end === undefined) {
        return value.slice(Math.max(0, init))
      }

      return value.slice(init, end)
    }

    return ''
  }

  function substr(init: number, end?: number) {
    if (typeof value === 'string') {
      if (end === undefined) {
        return value.slice(init)
      }

      return value.slice(init, end)
    }

    return ''
  }

  const index = elem.data.ind
  let hasParent = Boolean(elem.hierarchy?.length),
    parent: null | LayerExpressionInterface = null

  randSeed = Math.floor(Math.random() * 1000000)
  const { globalData } = elem

  function posterizeTime(framesPerSecond: number) {
    time = framesPerSecond === 0 ? 0 : Math.floor(time * framesPerSecond) / framesPerSecond
    value = valueAtTime(time)
  }

  function executeExpression(this: KeyframedValueProperty, _value: number) {
    // globalData.pushExpression();
    value = _value

    if (this.frameExpressionId === globalData.frameId && this.propType !== PropType.TextSelector) {
      return value
    }
    if (this.propType === PropType.TextSelector) {
      textIndex = this.textIndex ?? 0
      textTotal = this.textTotal ?? 0
      selectorValue = this.selectorValue
    }
    if (!thisLayer) {
      text = elem.layerInterface?.text
      thisLayer = elem.layerInterface
      thisComp = elem.comp?.compInterface ?? null
      toWorld = thisLayer?.toWorld.bind(thisLayer) ?? null
      fromWorld = thisLayer?.fromWorld.bind(thisLayer) ?? null
      fromComp = thisLayer?.fromComp.bind(thisLayer) ?? null
      toComp = thisLayer?.toComp.bind(thisLayer) ?? null
      // @ts-expect-error: TODO: This needs testing, but is probably wrong
      mask = thisLayer?.mask ?? null
      fromCompToSurface = fromComp
    }
    if (!transform) {
      transform = elem.layerInterface?.getInterface('ADBE Transform Group') as TransformExpressionInterface | undefined
      $bm_transform = transform
      if (transform) {
        anchorPoint = transform.anchorPoint
        /* position = transform.position;
                    rotation = transform.rotation;
                    scale = transform.scale; */
      }
    }

    if (elemType === 4 && !content) {
      content = thisLayer?.getInterface('ADBE Root Vectors Group') as ShapeExpressionInterface
    }
    effect = effect ?? thisLayer?.getInterface(4) as GroupEffectInterface
    hasParent = Boolean(elem.hierarchy?.length)
    if (hasParent && !parent) {
      parent = elem.hierarchy?.[0]?.layerInterface ?? null
    }
    time = (this.comp?.renderedFrame ?? 0) / (this.comp?.globalData?.frameRate ?? 60)
    if (_needsRandom) {
      seedRandom(randSeed + time)
    }
    if (needsVelocity) {
      velocity = velocityAtTime(time) as number
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    expression_function(
      _lottieGlobal,
      $bm_div,
      $bm_mod,
      $bm_mul,
      $bm_neg,
      $bm_sub,
      $bm_sum,
      $bm_transform,
      active,
      add,
      anchorPoint,
      clamp,
      comp,
      content,
      createPath,
      degrees_to_radians,
      degreesToRadians,
      div,
      document,
      ease,
      easeIn,
      easeOut,
      effect,
      fetch,
      frames,
      framesToTime,
      fromComp,
      fromCompToSurface,
      fromWorld,
      globalData,
      height,
      hslToRgb,
      index,
      inPoint,
      key,
      length,
      linear,
      lookAt,
      loop_in,
      loop_out,
      loopIn,
      loopInDuration,
      loopOut,
      loopOutDuration,
      mask,
      mod,
      mul,
      name,
      nearestKey,
      normalize,
      numKeys,
      obj,
      outPoint,
      position,
      posterizeTime,
      propertyIndex,
      radians_to_degrees,
      radiansToDegrees,
      random,
      randSeed,
      rgbToHsl,
      rotation,
      scale,
      seedRandom,
      selectorValue,
      smooth,
      sourceRectAtTime,
      sub,
      substr,
      substring,
      text,
      textIndex,
      textTotal,
      thisComp,
      thisLayer,
      thisProperty,
      time,
      timeToFrames,
      toComp,
      toWorld,
      transform,
      value,
      valueAtTime,
      velocity,
      width,
      wiggle,
      window,
      XMLHttpRequest,
    )
    this.frameExpressionId = globalData.frameId

    // TODO: Check if it's possible to return on ShapeInterface the .v value
    scoped_bm_rt = ((obj.scoped_bm_rt as BaseProperty | undefined)?.propType === PropType.Shape
      ? (obj.scoped_bm_rt as BaseProperty).v
      : obj.scoped_bm_rt) as (val: unknown) => void

    return scoped_bm_rt
  }

  return executeExpression
}

function linear(
  t: number, tMinFromProps: number, tMaxFromProps: number, value1FromProps?: number | number[], value2FromProps?: number | number[]
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

  if (!isArray(value1) && !isArray(value2)) {
    return value1 + (value2 - value1) * perc
  }

  if (isArray(value1) && isArray(value2)) {
    const { length: len } = value1,
      arr = createTypedArray(ArrayType.Float32, len)

    for (let i = 0; i < len; i += 1) {
      arr[i] = value1[i] ?? 0 + (value2[i] ?? 0 - (value1[i] ?? 0)) * perc
    }

    return arr
  }

  return 0
}

function normalize(vec: number[]) {
  return div(vec, length(vec))
}

function random(minFromProps?: number | number[], maxFormProps?: number | number[]) {
  let min = minFromProps,
    max = maxFormProps

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

    const { length: len } = max

    if (!min) {
      min = createTypedArray(ArrayType.Float32, len) as number[]
    }
    const arr = createTypedArray(ArrayType.Float32, len) as number[],
      rnd = BMMath.random()

    for (let i = 0; i < len; i += 1) {
      arr[i] = (min as number[])[i] ?? 0 + rnd * (max[i] ?? 0 - ((min as number[])[i] ?? 0))
    }

    return arr
  }

  min = min ?? 0
  const rndm = BMMath.random()

  return min as number + rndm * (max - (min as number))
}

function resetFrame() {
  _lottieGlobal = {}
}

function $bm_isInstanceOfArray(arr: unknown): arr is number[] {
  return typeof arr === 'object' && arr !== null && (arr.constructor === Array || arr.constructor === Float32Array)
}

function degreesToRadians(val: number) {
  return val * degToRads
}

function div(a: unknown, b: unknown) {
  const tOfA = typeof a,
    tOfB = typeof b
  let arr

  if (isNumerable(tOfA, a) && isNumerable(tOfB, b)) {
    return Number(a) / Number(b)
  }
  let i

  let len

  if ($bm_isInstanceOfArray(a) && isNumerable(tOfB, b)) {
    len = a.length
    arr = createTypedArray(ArrayType.Float32, len)
    for (i = 0; i < len; i += 1) {
      arr[i] = (a[i] ?? 0) / Number(b)
    }

    return arr
  }
  if (isNumerable(tOfA, a) && $bm_isInstanceOfArray(b)) {
    len = b.length
    arr = createTypedArray(ArrayType.Float32, len)
    for (i = 0; i < len; i += 1) {
      arr[i] = Number(a) / (b[i] ?? 0)
    }

    return arr
  }

  return 0
}

function isNumerable(tOfV: string, v: unknown): v is (number | string) {
  return tOfV === 'number' || v instanceof Number || tOfV === 'boolean' || tOfV === 'string'
}

function length(arr1: number | number[], arr2FromProps?: number | number[]) {
  let arr2 = arr2FromProps


  if (typeof arr1 === 'number' || arr1 instanceof Number) {
    arr2 = arr2 || 0

    return Math.abs(Number(arr1) - Number(arr2))
  }
  if (!arr2) {
    arr2 = helperLengthArray
  }
  let i

  const len = Math.min(arr1.length, (arr2 as number[]).length)
  let addedLength = 0

  for (i = 0; i < len; i += 1) {
    addedLength += Math.pow(((arr2 as number[])[i] ?? 0) - (arr1[i] ?? 0), 2)
  }

  return Math.sqrt(addedLength)
}

function mod(aFromProps: number | string, bFromProps: number | string) {
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

function mul(a: unknown, b: unknown) {
  const tOfA = typeof a
  const tOfB = typeof b
  let arr

  if (isNumerable(tOfA, a) && isNumerable(tOfB, b)) {
    return Number(a) * Number(b)
  }

  let i

  let len

  if ($bm_isInstanceOfArray(a) && isNumerable(tOfB, b)) {
    len = a.length
    arr = createTypedArray(ArrayType.Float32, len)
    for (i = 0; i < len; i += 1) {
      arr[i] = (a[i] ?? 0) * Number(b)
    }

    return arr
  }
  if (isNumerable(tOfA, a) && $bm_isInstanceOfArray(b)) {
    len = b.length
    arr = createTypedArray(ArrayType.Float32, len)
    for (i = 0; i < len; i++) {
      arr[i] = Number(a) * (b[i] ?? 0)
    }

    return arr
  }

  return 0
}

function noOp(_value?: unknown) {
  return _value
}

function radiansToDegrees(val: number) {
  return val / degToRads
}

function sub(aFromProps: unknown, bFromProps: unknown) {
  let a = aFromProps,
    b = bFromProps
  const tOfA = typeof a,
    tOfB = typeof b

  if (isNumerable(tOfA, a) && isNumerable(tOfB, b)) {
    if (tOfA === 'string') {
      a = parseInt(a as string, 10)
    }
    if (tOfB === 'string') {
      b = parseInt(b as string, 10)
    }

    return a as number - (b as number)
  }
  if ($bm_isInstanceOfArray(a) && isNumerable(tOfB, b)) {
    a = [...a]
    ; ((a as number[])[0] as number) -= Number(b)

    return a
  }
  if (isNumerable(tOfA, a) && $bm_isInstanceOfArray(b)) {
    b = [...b]
    ; (b as number[])[0] = Number(a) - ((b as number[])[0] as number)

    return b
  }
  if ($bm_isInstanceOfArray(a) && $bm_isInstanceOfArray(b)) {
    let i = 0

    const lenA = a.length,
      lenB = b.length,
      retArr: number[] = []

    while (i < lenA || i < lenB) {
      if ((typeof a[i] === 'number' || (a as unknown[])[i] instanceof Number) && (typeof b[i] === 'number' || (b as unknown[])[i] instanceof Number)) {
        retArr[i] = (a[i] ?? 0) - (b[i] ?? 0)
        i++
        continue
      }
      retArr[i] = ((b as unknown[])[i] === undefined ? a[i] : a[i] || b[i]) ?? 0
      i++
    }

    return retArr
  }

  return 0
}

function sum(aFromProps: unknown, bFromProps: unknown) {
  let a = aFromProps,
    b = bFromProps

  const tOfA = typeof a,
    tOfB = typeof b

  if (isNumerable(tOfA, a) && isNumerable(tOfB, b) || tOfA === 'string' || tOfB === 'string') {
    return Number(a) + Number(b)
  }
  if ($bm_isInstanceOfArray(a) && isNumerable(tOfB, b)) {
    a = [...a]
    ; ((a as number[])[0] as number) += Number(b)

    return a
  }
  if (isNumerable(tOfA, a) && $bm_isInstanceOfArray(b)) {
    b = [...b]
    ; (b as number[])[0] = a as number + ((b as number[])[0] as number)

    return b
  }
  if ($bm_isInstanceOfArray(a) && $bm_isInstanceOfArray(b)) {
    let i = 0

    const { length: lenA } = a,
      { length: lenB } = b,
      retArr = []

    while (i < lenA || i < lenB) {
      if ((typeof a[i] === 'number' || (a as unknown[])[i] instanceof Number) && (typeof b[i] === 'number' || (b as unknown[])[i] instanceof Number)) {
        retArr[i] = a[i] ?? 0 + (b[i] ?? 0)
        i++
        continue
      }
      retArr[i] = (b as unknown[])[i] === undefined ? a[i] : a[i] || b[i]
      i++
    }

    return retArr
  }

  return 0
}

const ExpressionManager = {
  initiateExpression,
  resetFrame
}

export default ExpressionManager