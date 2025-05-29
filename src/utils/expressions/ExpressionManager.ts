/* eslint-disable @typescript-eslint/naming-convention */
import type {
  ElementInterfaceIntersect, ExpressionProperty, Vector2,
} from '@/types'
import type LayerExpressionInterface from '@/utils/expressions/LayerInterface'
import type { KeyframedValueProperty, ValueProperty } from '@/utils/Properties'
import type ShapePath from '@/utils/shapes/ShapePath'

import seedrandom from '@/3rd_party/seedrandom'
import {
  clamp,
  degToRads, hslToRgb, rgbToHsl
} from '@/utils'
import BezierFactory from '@/utils/BezierFactory'
import { BMMath } from '@/utils/BMMath'
import { ArrayType, PropType } from '@/utils/enums'
import { createTypedArray } from '@/utils/helpers/arrays'
import shapePool from '@/utils/pooling/ShapePool'

const Math = BMMath as Math,
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

function $bm_neg(a: unknown) {
  const tOfA = typeof a

  if (tOfA === 'number' || a instanceof Number || tOfA === 'boolean') {
    return -(a as number)
  }
  if ($bm_isInstanceOfArray(a as number[])) {

    const { length: lenA } = a as number[],
      retArr: number[] = []

    for (let i = 0; i < lenA; i++) {
      retArr[i] = -(a as number[])[i]
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
  const path = shapePool.newElement<ShapePath>()

  path.setPathData(Boolean(closed), len)
  const arrPlaceholder = [0, 0]
  let inVertexPoint,
    outVertexPoint

  for (let i = 0; i < len; i++) {
    inVertexPoint = inTangents[i] ?? arrPlaceholder
    outVertexPoint = outTangents[i] ?? arrPlaceholder
    path.setTripleAt(
      points[i][0], points[i][1], outVertexPoint[0] + points[i][0], outVertexPoint[1] + points[i][1], inVertexPoint[0] + points[i][0], inVertexPoint[1] + points[i][1], i, true
    )
  }

  return path
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
  if (!elem.globalData.renderConfig?.runExpressions) {
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

  let transform,
    $bm_transform,
    content,
    effect
  const thisProperty = property

  thisProperty._name = nm
  thisProperty.valueAtTime = thisProperty.getValueAtTime
  Object.defineProperty(
    thisProperty, 'value', {
      get () {
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
  let loopIn: (type: string, duration: number, flag?: boolean) => void,
    loop_in: (type: string, duration: number, flag?: boolean) => void,
    loopOut: (type: string, duration: number, flag?: boolean) => void,
    loop_out: (type: string, duration: number, flag?: boolean) => void,
    smooth: (type: string, duration: number, flag?: boolean) => void,
    toWorld: (type: string, duration: number, flag?: boolean) => void,
    fromWorld: (type: string, duration: number, flag?: boolean) => void,
    fromComp: (type: string, duration: number, flag?: boolean) => void,
    toComp: (type: string, duration: number, flag?: boolean) => void,
    fromCompToSurface: (type: string, duration: number, flag?: boolean) => void,
    // eslint-disable-next-line no-unassigned-vars
    position: (type: string, duration: number, flag?: boolean) => void,
    // eslint-disable-next-line no-unassigned-vars
    rotation: (type: string, duration: number, flag?: boolean) => void,
    anchorPoint: (type: string, duration: number, flag?: boolean) => void,
    // eslint-disable-next-line no-unassigned-vars
    scale: (type: string, duration: number, flag?: boolean) => void,
    thisLayer: undefined | ((type: string, duration: number, flag?: boolean) => void),
    thisComp: (type: string, duration: number, flag?: boolean) => void,
    mask: (type: string, duration: number, flag?: boolean) => void,
    valueAtTime: (type: string, duration: number, flag?: boolean) => void,
    velocityAtTime: number,

    scoped_bm_rt = noOp
    // val = val.replace(/(\\?"|')((http)(s)?(:\/))?\/.*?(\\?"|')/g, "\"\""); // deter potential network calls


  // eslint-disable-next-line no-eval
  const expression_function = eval(/* Javascript */ `[
      function _expression_function() {
        ${val};
        scoped_bm_rt = $bm_rt
      // @ts-expect-error
      }]`)[0]


  // const expression_function = new Function(
  //   'scoped_bm_rt',
  //   'transform',
  //   'loopOut',
  //   /* Javascript */ `
  //   (() => {
  //     ${val};
  //     scoped_bm_rt = $bm_rt;
  //   })()
  //   `
  // )

  let time = 0,
    velocity,
    value: unknown = null,
    text,
    textIndex,
    textTotal,
    selectorValue

  const numKeys = property.kf ? k.length : 0,
    active = !this.data || this.data.hd !== true

  const wiggle = (freqFromProps: number, amp: number) => {
    let freq = freqFromProps
    let iWiggle

    let j
    const lenWiggle = this.pv.length > 0 ? this.pv.length : 1
    const addedAmps = createTypedArray(ArrayType.Float32, lenWiggle)

    freq = 5
    const iterations = Math.floor(time * freq)

    iWiggle = 0
    while (iWiggle < iterations) {
      // var rnd = BMMath.random();
      for (j = 0; j < lenWiggle; j += 1) {
        addedAmps[j] += -amp + amp * 2 * BMMath.random()
        // addedAmps[j] += -amp + amp*2*rnd;
      }
      iWiggle++
    }
    // var rnd2 = BMMath.random();
    const periods = time * freq
    const perc = periods - Math.floor(periods)
    const arr = createTypedArray(ArrayType.Float32, lenWiggle)

    if (lenWiggle > 1) {
      for (j = 0; j < lenWiggle; j += 1) {
        arr[j] = this.pv[j] + addedAmps[j] + (-amp + amp * 2 * BMMath.random()) * perc
        // arr[j] = this.pv[j] + addedAmps[j] + (-amp + amp*2*rnd)*perc;
        // arr[i] = this.pv[i] + addedAmp + amp1*perc + amp2*(1-perc);
      }

      return arr
    }

    return this.pv + addedAmps[0] + (-amp + amp * 2 * BMMath.random()) * perc
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

  if (this.getValueAtTime) {
    valueAtTime = this.getValueAtTime.bind(this)
  }

  if (this.getVelocityAtTime) {
    velocityAtTime = this.getVelocityAtTime.bind(this)
  }

  const comp = elem.comp.globalData.projectInterface.bind(elem.comp.globalData.projectInterface)

  function lookAt(elem1, elem2) {
    const fVec = [elem2[0] - elem1[0],
      elem2[1] - elem1[1],
      elem2[2] - elem1[2]]
    const pitch = Math.atan2(fVec[0], Math.sqrt(fVec[1] * fVec[1] + fVec[2] * fVec[2])) / degToRads
    const yaw = -Math.atan2(fVec[1], fVec[2]) / degToRads

    return [yaw,
      pitch,
      0]
  }

  function easeOut(
    t, tMin, tMax, val1, val2
  ) {
    return applyEase(
      easeOutBez, t, tMin, tMax, val1, val2
    )
  }

  function easeIn(
    t, tMin, tMax, val1, val2
  ) {
    return applyEase(
      easeInBez, t, tMin, tMax, val1, val2
    )
  }

  function ease(
    t, tMin, tMax, val1, val2
  ) {
    return applyEase(
      easeInOutBez, t, tMin, tMax, val1, val2
    )
  }

  function applyEase(
    fn, t, tMin, tMax, val1, val2
  ) {
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

    if ($bm_isInstanceOfArray(val1)) {
      let iKey

      const lenKey = val1.length
      const arr = createTypedArray(ArrayType.Float32, lenKey)

      for (iKey = 0; iKey < lenKey; iKey += 1) {
        arr[iKey] = (val2[iKey] - val1[iKey]) * mult + val1[iKey]
      }

      return arr
    }

    return (val2 - val1) * mult + val1
  }

  function nearestKey(time) {
    let iKey

    const lenKey = data.k.length
    let index
    let keyTime

    if (data.k.length === 0 || typeof data.k[0] === 'number') {
      index = 0
      keyTime = 0
    } else {
      index = -1
      time *= elem.comp.globalData.frameRate
      if (time < data.k[0].t) {
        index = 1
        keyTime = data.k[0].t
      } else {
        for (iKey = 0; iKey < lenKey - 1; iKey += 1) {
          if (time === data.k[iKey].t) {
            index = iKey + 1
            keyTime = data.k[iKey].t
            break
          } else if (time > data.k[iKey].t && time < data.k[iKey + 1].t) {
            if (time - data.k[iKey].t > data.k[iKey + 1].t - time) {
              index = iKey + 2
              keyTime = data.k[iKey + 1].t
            } else {
              index = iKey + 1
              keyTime = data.k[iKey].t
            }
            break
          }
        }
        if (index === -1) {
          index = iKey + 1
          keyTime = data.k[iKey].t
        }
      }
    }
    const obKey = {}

    obKey.index = index
    obKey.time = keyTime / elem.comp.globalData.frameRate

    return obKey
  }

  function key(ind) {
    let obKey

    let iKey
    let lenKey

    if (data.k.length === 0 || typeof data.k[0] === 'number') {
      throw new Error(`The property has no keyframe at index ${  ind}`)
    }
    ind -= 1
    obKey = {
      time: data.k[ind].t / elem.comp.globalData.frameRate,
      value: [],
    }
    const arr = Object.hasOwn(data.k[ind], 's') ? data.k[ind].s : data.k[ind - 1].e

    lenKey = arr.length
    for (iKey = 0; iKey < lenKey; iKey += 1) {
      obKey[iKey] = arr[iKey]
      obKey.value[iKey] = arr[iKey]
    }

    return obKey
  }

  function framesToTime(fr, fps) {
    if (!fps) {
      fps = elem.comp.globalData.frameRate
    }

    return fr / fps
  }

  function timeToFrames(t, fps) {
    if (!t && t !== 0) {
      t = time
    }
    if (!fps) {
      fps = elem.comp.globalData.frameRate
    }

    return t * fps
  }

  function seedRandom(seed) {
    BMMath.seedrandom(randSeed + seed)
  }

  function sourceRectAtTime() {
    return elem.sourceRectAtTime()
  }

  function substring(init, end) {
    if (typeof value === 'string') {
      if (end === undefined) {
        return value.slice(Math.max(0, init))
      }

      return value.substring(init, end)
    }

    return ''
  }

  function substr(init: number, end: number) {
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
    parent: undefined | ReturnType<typeof LayerExpressionInterface>

  const randSeed = Math.floor(Math.random() * 1000000)
  const { globalData } = elem

  function posterizeTime(framesPerSecond) {
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
      textIndex = this.textIndex
      textTotal = this.textTotal
      selectorValue = this.selectorValue
    }
    if (!thisLayer) {
      text = elem.layerInterface.text
      thisLayer = elem.layerInterface
      thisComp = elem.comp.compInterface
      toWorld = thisLayer.toWorld.bind(thisLayer)
      fromWorld = thisLayer.fromWorld.bind(thisLayer)
      fromComp = thisLayer.fromComp.bind(thisLayer)
      toComp = thisLayer.toComp.bind(thisLayer)
      mask = thisLayer.mask ? thisLayer.mask.bind(thisLayer) : null
      fromCompToSurface = fromComp
    }
    if (!transform) {
      transform = elem.layerInterface?.('ADBE Transform Group')
      $bm_transform = transform
      if (transform) {
        anchorPoint = transform.anchorPoint
        /* position = transform.position;
                    rotation = transform.rotation;
                    scale = transform.scale; */
      }
    }

    if (elemType === 4 && !content) {
      content = thisLayer('ADBE Root Vectors Group')
    }
    if (!effect) {
      effect = thisLayer(4)
    }
    hasParent = Boolean(elem.hierarchy?.length)
    if (hasParent && !parent) {
      parent = elem.hierarchy[0].layerInterface
    }
    time = this.comp.renderedFrame / this.comp.globalData.frameRate
    if (_needsRandom) {
      seedRandom(randSeed + time)
    }
    if (needsVelocity) {
      velocity = velocityAtTime(time)
    }
    expression_function(
      // scoped_bm_rt,
      // transform,
      // loopOut,
    )
    this.frameExpressionId = elem.globalData?.frameId

    // TODO: Check if it's possible to return on ShapeInterface the .v value
    // Changed this to a ternary operation because Rollup failed compiling it correctly
    scoped_bm_rt = scoped_bm_rt.propType === PropType.Shape
      ? scoped_bm_rt.v
      : scoped_bm_rt

    return scoped_bm_rt
  }
  // Bundlers will see these as dead code and unless we reference them
  executeExpression.__preventDeadCodeRemoval = [
    $bm_transform,
    anchorPoint,
    time,
    velocity,
    inPoint,
    outPoint,
    width,
    height,
    name,
    loop_in,
    loop_out,
    smooth,
    toComp,
    fromCompToSurface,
    toWorld,
    fromWorld,
    mask,
    position,
    rotation,
    scale,
    thisComp,
    numKeys,
    active,
    wiggle,
    loopInDuration,
    loopOutDuration,
    comp,
    lookAt,
    easeOut,
    easeIn,
    ease,
    nearestKey,
    key,
    text,
    textIndex,
    textTotal,
    selectorValue,
    framesToTime,
    timeToFrames,
    sourceRectAtTime,
    substring,
    substr,
    posterizeTime,
    index,
    globalData]

  return executeExpression
}

function linear(
  t: number, tMin: number, tMax: number, value1?: number, value2?: number
) {
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
  } if (t >= tMax) {
    return value2
  }
  const perc = tMax === tMin ? 0 : (t - tMin) / (tMax - tMin)

  if (value1.length === 0) {
    return value1 + (value2 - value1) * perc
  }
  let i

  const len = value1.length
  const arr = createTypedArray(ArrayType.Float32, len)

  for (i = 0; i < len; i += 1) {
    arr[i] = value1[i] + (value2[i] - value1[i]) * perc
  }

  return arr
}

function normalize(vec: number[]) {
  return div(vec, length(vec))
}

function random(min: number, max?: number) {
  if (max === undefined) {
    if (min === undefined) {
      min = 0
      max = 1
    } else {
      max = min
      min = undefined
    }
  }
  if (max.length > 0) {
    let i

    const len = max.length

    if (!min) {
      min = createTypedArray(ArrayType.Float32, len)
    }
    const arr = createTypedArray(ArrayType.Float32, len)
    const rnd = BMMath.random()

    for (i = 0; i < len; i += 1) {
      arr[i] = min[i] + rnd * (max[i] - min[i])
    }

    return arr
  }
  if (min === undefined) {
    min = 0
  }
  const rndm = BMMath.random()

  return min + rndm * (max - min)
}

function resetFrame() {
  _lottieGlobal = {}
}

function $bm_isInstanceOfArray(arr: unknown[]) {
  return arr.constructor === Array || arr.constructor === Float32Array
}

function degreesToRadians(val: number) {
  return val * degToRads
}

function div(a, b) {
  const tOfA = typeof a
  const tOfB = typeof b
  let arr

  if (isNumerable(tOfA, a) && isNumerable(tOfB, b)) {
    return a / b
  }
  let i

  let len

  if ($bm_isInstanceOfArray(a) && isNumerable(tOfB, b)) {
    len = a.length
    arr = createTypedArray(ArrayType.Float32, len)
    for (i = 0; i < len; i += 1) {
      arr[i] = a[i] / b
    }

    return arr
  }
  if (isNumerable(tOfA, a) && $bm_isInstanceOfArray(b)) {
    len = b.length
    arr = createTypedArray(ArrayType.Float32, len)
    for (i = 0; i < len; i += 1) {
      arr[i] = a / b[i]
    }

    return arr
  }

  return 0
}

function hue2rgb(
  p: number, q: number, t: number
) {
  if (t < 0) {t += 1}
  if (t > 1) {t -= 1}
  if (t < 1 / 6) {return p + (q - p) * 6 * t}
  if (t < 1 / 2) {return q}
  if (t < 2 / 3) {return p + (q - p) * (2 / 3 - t) * 6}

  return p
}

function isNumerable(tOfV: string, v: unknown) {
  return tOfV === 'number' || v instanceof Number || tOfV === 'boolean' || tOfV === 'string'
}

function length(arr1: number | number[], arr2?: number | number[]) {
  if (typeof arr1 === 'number' || arr1 instanceof Number) {
    arr2 = arr2 || 0

    return Math.abs(arr1 - arr2)
  }
  if (!arr2) {
    arr2 = helperLengthArray
  }
  let i

  const len = Math.min(arr1.length, arr2.length)
  let addedLength = 0

  for (i = 0; i < len; i += 1) {
    addedLength += Math.pow(arr2[i] - arr1[i], 2)
  }

  return Math.sqrt(addedLength)
}

function mod(a: number | string, b: number | string) {
  if (typeof a === 'string') {
    a = parseInt(a, 10)
  }
  if (typeof b === 'string') {
    b = parseInt(b, 10)
  }

  return a % b
}

function mul(a, b) {
  const tOfA = typeof a
  const tOfB = typeof b
  let arr

  if (isNumerable(tOfA, a) && isNumerable(tOfB, b)) {
    return a * b
  }

  let i

  let len

  if ($bm_isInstanceOfArray(a) && isNumerable(tOfB, b)) {
    len = a.length
    arr = createTypedArray(ArrayType.Float32, len)
    for (i = 0; i < len; i += 1) {
      arr[i] = a[i] * b
    }

    return arr
  }
  if (isNumerable(tOfA, a) && $bm_isInstanceOfArray(b)) {
    len = b.length
    arr = createTypedArray(ArrayType.Float32, len)
    for (i = 0; i < len; i += 1) {
      arr[i] = a * b[i]
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

function sub(a, b) {
  const tOfA = typeof a
  const tOfB = typeof b

  if (isNumerable(tOfA, a) && isNumerable(tOfB, b)) {
    if (tOfA === 'string') {
      a = parseInt(a, 10)
    }
    if (tOfB === 'string') {
      b = parseInt(b, 10)
    }

    return a - b
  }
  if ($bm_isInstanceOfArray(a) && isNumerable(tOfB, b)) {
    a = [...a]
    a[0] -= b

    return a
  }
  if (isNumerable(tOfA, a) && $bm_isInstanceOfArray(b)) {
    b = [...b]
    b[0] = a - b[0]

    return b
  }
  if ($bm_isInstanceOfArray(a) && $bm_isInstanceOfArray(b)) {
    let i = 0

    const lenA = a.length
    const lenB = b.length
    const retArr = []

    while (i < lenA || i < lenB) {
      if ((typeof a[i] === 'number' || a[i] instanceof Number) && (typeof b[i] === 'number' || b[i] instanceof Number)) {
        retArr[i] = a[i] - b[i]
      } else {
        retArr[i] = b[i] === undefined ? a[i] : a[i] || b[i]
      }
      i += 1
    }

    return retArr
  }

  return 0
}

function sum(a: number, b: number) {
  const tOfA = typeof a
  const tOfB = typeof b

  if (isNumerable(tOfA, a) && isNumerable(tOfB, b) || tOfA === 'string' || tOfB === 'string') {
    return a + b
  }
  if ($bm_isInstanceOfArray(a) && isNumerable(tOfB, b)) {
    a = [...a]
    a[0] += b

    return a
  }
  if (isNumerable(tOfA, a) && $bm_isInstanceOfArray(b)) {
    b = [...b]
    b[0] = a + b[0]

    return b
  }
  if ($bm_isInstanceOfArray(a) && $bm_isInstanceOfArray(b)) {
    let i = 0

    const { length: lenA } = a,
      { length: lenB } = b,
      retArr = []

    while (i < lenA || i < lenB) {
      if ((typeof a[i] === 'number' || a[i] instanceof Number) && (typeof b[i] === 'number' || b[i] instanceof Number)) {
        retArr[i] = a[i] + b[i]
      } else {
        retArr[i] = b[i] === undefined ? a[i] : a[i] || b[i]
      }
      i += 1
    }

    return retArr
  }

  return 0
}

const ExpressionManager = {
  __preventDeadCodeRemoval: [
    window,
    document,
    XMLHttpRequest,
    fetch,
    frames,
    $bm_neg,
    add,
    $bm_sum,
    $bm_sub,
    $bm_mul,
    $bm_div,
    $bm_mod,
    clamp,
    radians_to_degrees,
    degreesToRadians,
    degrees_to_radians,
    normalize,
    rgbToHsl,
    hslToRgb,
    linear,
    random,
    createPath,
    _lottieGlobal
  ],
  initiateExpression,
  resetFrame
}

export default ExpressionManager