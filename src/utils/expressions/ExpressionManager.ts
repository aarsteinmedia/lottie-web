import { ArrayType } from '@/enums'
import { degToRads } from '@/utils'
import { getBezierEasing } from '@/utils/BezierFactory'
import { createTypedArray } from '@/utils/helpers/arrays'
import { newElement } from '@/utils/pooling/ShapePool'

// import seedrandom from '@/utils/SeedRandom'
// import propTypes from '../helpers/propTypes'

const propTypes = {
  SHAPE: 'shape',
}

const ExpressionManager = (function () {
  const ob = {}
  // const Math = BMMath
  const window = null
  const document = null
  const XMLHttpRequest = null
  const fetch = null
  const frames = null
  let _lottieGlobal = {}
  // seedrandom(BMMath)

  function resetFrame() {
    _lottieGlobal = {}
  }

  function $bm_isInstanceOfArray(arr) {
    return arr.constructor === Array || arr.constructor === Float32Array
  }

  function isNumerable(tOfV, v) {
    return (
      tOfV === 'number' ||
      v instanceof Number ||
      tOfV === 'boolean' ||
      tOfV === 'string'
    )
  }

  function $bm_neg(a) {
    const tOfA = typeof a
    if (tOfA === 'number' || a instanceof Number || tOfA === 'boolean') {
      return -a
    }
    if ($bm_isInstanceOfArray(a)) {
      let i
      const lenA = a.length
      const retArr = []
      for (i = 0; i < lenA; i++) {
        retArr[i] = -a[i]
      }
      return retArr
    }
    if (a.propType) {
      return a.v
    }
    return -a
  }

  const easeInBez = getBezierEasing(0.333, 0, 0.833, 0.833, 'easeIn').get
  const easeOutBez = getBezierEasing(0.167, 0.167, 0.667, 1, 'easeOut').get
  const easeInOutBez = getBezierEasing(0.33, 0, 0.667, 1, 'easeInOut').get

  function sum(a, b) {
    const tOfA = typeof a
    const tOfB = typeof b
    if (
      (isNumerable(tOfA, a) && isNumerable(tOfB, b)) ||
      tOfA === 'string' ||
      tOfB === 'string'
    ) {
      return a + b
    }
    if ($bm_isInstanceOfArray(a) && isNumerable(tOfB, b)) {
      a = a.slice(0)
      a[0] += b
      return a
    }
    if (isNumerable(tOfA, a) && $bm_isInstanceOfArray(b)) {
      b = b.slice(0)
      b[0] = a + b[0]
      return b
    }
    if ($bm_isInstanceOfArray(a) && $bm_isInstanceOfArray(b)) {
      let i = 0
      const lenA = a.length
      const lenB = b.length
      const retArr = []
      while (i < lenA || i < lenB) {
        if (
          (typeof a[i] === 'number' || a[i] instanceof Number) &&
          (typeof b[i] === 'number' || b[i] instanceof Number)
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
  const add = sum

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
      a = a.slice(0)
      a[0] -= b
      return a
    }
    if (isNumerable(tOfA, a) && $bm_isInstanceOfArray(b)) {
      b = b.slice(0)
      b[0] = a - b[0]
      return b
    }
    if ($bm_isInstanceOfArray(a) && $bm_isInstanceOfArray(b)) {
      let i = 0
      const lenA = a.length
      const lenB = b.length
      const retArr = []
      while (i < lenA || i < lenB) {
        if (
          (typeof a[i] === 'number' || a[i] instanceof Number) &&
          (typeof b[i] === 'number' || b[i] instanceof Number)
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
      for (i = 0; i < len; i++) {
        arr[i] = a[i] * b
      }
      return arr
    }
    if (isNumerable(tOfA, a) && $bm_isInstanceOfArray(b)) {
      len = b.length
      arr = createTypedArray(ArrayType.Float32, len)
      for (i = 0; i < len; i++) {
        arr[i] = a * b[i]
      }
      return arr
    }
    return 0
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
      for (i = 0; i < len; i++) {
        arr[i] = a[i] / b
      }
      return arr
    }
    if (isNumerable(tOfA, a) && $bm_isInstanceOfArray(b)) {
      len = b.length
      arr = createTypedArray(ArrayType.Float32, len)
      for (i = 0; i < len; i++) {
        arr[i] = a / b[i]
      }
      return arr
    }
    return 0
  }
  function mod(a, b) {
    if (typeof a === 'string') {
      a = parseInt(a, 10)
    }
    if (typeof b === 'string') {
      b = parseInt(b, 10)
    }
    return a % b
  }
  const $bm_sum = sum
  const $bm_sub = sub
  const $bm_mul = mul
  const $bm_div = div
  const $bm_mod = mod

  function clamp(num, min, max) {
    if (min > max) {
      const mm = max
      max = min
      min = mm
    }
    return Math.min(Math.max(num, min), max)
  }

  function radiansToDegrees(val) {
    return val / degToRads
  }
  const radians_to_degrees = radiansToDegrees

  function degreesToRadians(val) {
    return val * degToRads
  }
  const degrees_to_radians = radiansToDegrees

  const helperLengthArray = [0, 0, 0, 0, 0, 0]

  function length(arr1, arr2) {
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
    for (i = 0; i < len; i++) {
      addedLength += Math.pow(arr2[i] - arr1[i], 2)
    }
    return Math.sqrt(addedLength)
  }

  function normalize(vec) {
    return div(vec, length(vec))
  }

  function rgbToHsl(val) {
    const r = val[0]
    const g = val[1]
    const b = val[2]
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h
    let s
    const l = (max + min) / 2

    if (max === min) {
      h = 0 // achromatic
      s = 0 // achromatic
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
        default:
          break
      }
      h /= 6
    }

    return [h, s, l, val[3]]
  }

  function hue2rgb(p, q, t) {
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
  }

  function hslToRgb(val) {
    const h = val[0]
    const s = val[1]
    const l = val[2]

    let r
    let g
    let b

    if (s === 0) {
      r = l // achromatic
      b = l // achromatic
      g = l // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    return [r, g, b, val[3]]
  }

  function linear(t, tMin, tMax, value1, value2) {
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
    if (!value1.length) {
      return value1 + (value2 - value1) * perc
    }
    let i
    const len = value1.length
    const arr = createTypedArray(ArrayType.Float32, len)
    for (i = 0; i < len; i++) {
      arr[i] = value1[i] + (value2[i] - value1[i]) * perc
    }
    return arr
  }
  function random(min, max) {
    if (max === undefined) {
      if (min === undefined) {
        min = 0
        max = 1
      } else {
        max = min
        min = undefined
      }
    }
    if (max.length) {
      let i
      const len = max.length
      if (!min) {
        min = createTypedArray(ArrayType.Float32, len)
      }
      const arr = createTypedArray(ArrayType.Float32, len)
      const rnd = Math.random()
      for (i = 0; i < len; i++) {
        arr[i] = min[i] + rnd * (max[i] - min[i])
      }
      return arr
    }
    if (min === undefined) {
      min = 0
    }
    const rndm = Math.random()
    return min + rndm * (max - min)
  }

  function createPath(points, inTangents, outTangents, closed) {
    let i
    const len = points.length
    const path = newElement()
    path.setPathData(!!closed, len)
    const arrPlaceholder = [0, 0]
    let inVertexPoint
    let outVertexPoint
    for (i = 0; i < len; i++) {
      inVertexPoint =
        inTangents && inTangents[i] ? inTangents[i] : arrPlaceholder
      outVertexPoint =
        outTangents && outTangents[i] ? outTangents[i] : arrPlaceholder
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

  function initiateExpression(elem, data, property) {
    // Bail out if we don't want expressions
    function noOp(_value) {
      return _value
    }
    if (!elem.globalData.renderConfig.runExpressions) {
      return noOp
    }

    const val = data.x
    const needsVelocity = /velocity(?![\w\d])/.test(val)
    const _needsRandom = val.indexOf('random') !== -1
    const elemType = elem.data.ty
    let transform
    let $bm_transform
    let content
    let effect
    const thisProperty = property
    thisProperty.valueAtTime = thisProperty.getValueAtTime
    Object.defineProperty(thisProperty, 'value', {
      get: function () {
        return thisProperty.v
      },
    })
    elem.comp.frameDuration = 1 / elem.comp.globalData.frameRate
    elem.comp.displayStartTime = 0
    const inPoint = elem.data.ip / elem.comp.globalData.frameRate
    const outPoint = elem.data.op / elem.comp.globalData.frameRate
    const width = elem.data.sw ? elem.data.sw : 0
    const height = elem.data.sh ? elem.data.sh : 0
    const name = elem.data.nm
    let loopIn
    let loop_in
    let loopOut
    let loop_out
    let smooth
    let toWorld
    let fromWorld
    let fromComp
    let toComp
    let fromCompToSurface
    let position
    let rotation
    let anchorPoint
    let scale
    let thisLayer
    let thisComp
    let mask
    let valueAtTime
    let velocityAtTime

    let scoped_bm_rt
    // val = val.replace(/(\\?"|')((http)(s)?(:\/))?\/.*?(\\?"|')/g, "\"\""); // deter potential network calls
    const expression_function = eval(
      `[function _expression_function(){${val};scoped_bm_rt=$bm_rt}]`
    )[0]
    const numKeys = property.kf ? data.k.length : 0

    const active = !this.data || this.data.hd !== true

    const wiggle = function wiggle(freq, amp) {
      let iWiggle
      let j
      const lenWiggle = this.pv.length ? this.pv.length : 1
      const addedAmps = createTypedArray(ArrayType.Float32, lenWiggle)
      freq = 5
      const iterations = Math.floor(time * freq)
      iWiggle = 0
      j = 0
      while (iWiggle < iterations) {
        // var rnd = BMMath.random();
        for (j = 0; j < lenWiggle; j++) {
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
        for (j = 0; j < lenWiggle; j++) {
          arr[j] =
            this.pv[j] + addedAmps[j] + (-amp + amp * 2 * Math.random()) * perc
          // arr[j] = this.pv[j] + addedAmps[j] + (-amp + amp*2*rnd)*perc;
          // arr[i] = this.pv[i] + addedAmp + amp1*perc + amp2*(1-perc);
        }
        return arr
      }
      return this.pv + addedAmps[0] + (-amp + amp * 2 * Math.random()) * perc
    }.bind(this)

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

    function loopInDuration(type, duration) {
      return loopIn(type, duration, true)
    }

    function loopOutDuration(type, duration) {
      return loopOut(type, duration, true)
    }

    if (this.getValueAtTime) {
      valueAtTime = this.getValueAtTime.bind(this)
    }

    if (this.getVelocityAtTime) {
      velocityAtTime = this.getVelocityAtTime.bind(this)
    }

    const comp = elem.comp.globalData.projectInterface.bind(
      elem.comp.globalData.projectInterface
    )

    function lookAt(elem1, elem2) {
      const fVec = [
        elem2[0] - elem1[0],
        elem2[1] - elem1[1],
        elem2[2] - elem1[2],
      ]
      const pitch =
        Math.atan2(fVec[0], Math.sqrt(fVec[1] * fVec[1] + fVec[2] * fVec[2])) /
        degToRads
      const yaw = -Math.atan2(fVec[1], fVec[2]) / degToRads
      return [yaw, pitch, 0]
    }

    function easeOut(t, tMin, tMax, val1, val2) {
      return applyEase(easeOutBez, t, tMin, tMax, val1, val2)
    }

    function easeIn(t, tMin, tMax, val1, val2) {
      return applyEase(easeInBez, t, tMin, tMax, val1, val2)
    }

    function ease(t, tMin, tMax, val1, val2) {
      return applyEase(easeInOutBez, t, tMin, tMax, val1, val2)
    }

    function applyEase(fn, t, tMin, tMax, val1, val2) {
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
        for (iKey = 0; iKey < lenKey; iKey++) {
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
      if (!data.k.length || typeof data.k[0] === 'number') {
        index = 0
        keyTime = 0
      } else {
        index = -1
        time *= elem.comp.globalData.frameRate
        if (time < data.k[0].t) {
          index = 1
          keyTime = data.k[0].t
        } else {
          for (iKey = 0; iKey < lenKey - 1; iKey++) {
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
      if (!data.k.length || typeof data.k[0] === 'number') {
        throw new Error(`The property has no keyframe at index ${ind}`)
      }
      ind -= 1
      obKey = {
        time: data.k[ind].t / elem.comp.globalData.frameRate,
        value: [],
      }
      const arr = Object.prototype.hasOwnProperty.call(data.k[ind], 's')
        ? data.k[ind].s
        : data.k[ind - 1].e

      lenKey = arr.length
      for (iKey = 0; iKey < lenKey; iKey++) {
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

    function seedRandom(seed: number) {
      // BMMath.seedrandom(randSeed + seed)
      Math.random(randSeed + seed)
    }

    function sourceRectAtTime() {
      return elem.sourceRectAtTime()
    }

    function substring(init, end) {
      if (typeof value === 'string') {
        if (end === undefined) {
          return value.substring(init)
        }
        return value.substring(init, end)
      }
      return ''
    }

    function substr(init, end) {
      if (typeof value === 'string') {
        if (end === undefined) {
          return value.substr(init)
        }
        return value.substr(init, end)
      }
      return ''
    }

    function posterizeTime(framesPerSecond) {
      time =
        framesPerSecond === 0
          ? 0
          : Math.floor(time * framesPerSecond) / framesPerSecond
      value = valueAtTime(time)
    }

    let time
    let velocity
    let value
    let text
    let textIndex
    let textTotal
    let selectorValue
    const index = elem.data.ind
    let hasParent = !!(elem.hierarchy && elem.hierarchy.length)
    let parent
    var randSeed = Math.floor(Math.random() * 1000000)
    const globalData = elem.globalData

    function executeExpression(_value) {
      // globalData.pushExpression();
      value = _value
      if (
        this.frameExpressionId === elem.globalData.frameId &&
        this.propType !== 'textSelector'
      ) {
        return value
      }
      if (this.propType === 'textSelector') {
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
        transform = elem.layerInterface('ADBE Transform Group')
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
      hasParent = !!(elem.hierarchy && elem.hierarchy.length)
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
      expression_function()
      this.frameExpressionId = elem.globalData.frameId

      // TODO: Check if it's possible to return on ShapeInterface the .v value
      // Changed this to a ternary operation because Rollup failed compiling it correctly
      scoped_bm_rt =
        scoped_bm_rt.propType === propTypes.SHAPE
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
      globalData,
    ]
    return executeExpression
  }

  ob.initiateExpression = initiateExpression
  ob.__preventDeadCodeRemoval = [
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
    _lottieGlobal,
  ]
  ob.resetFrame = resetFrame
  return ob
})()

export default ExpressionManager
