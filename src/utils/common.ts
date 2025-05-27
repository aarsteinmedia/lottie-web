import { createSizedArray } from './helpers/arrays'

let _shouldRoundValues = false
const bmPow = Math.pow
const bmSqrt = Math.sqrt
const bmFloor = Math.floor
const bmMax = Math.max
const bmMin = Math.min

const BMMath = {};

(function () {
  const propertyNames = [
    'abs',
    'acos',
    'acosh',
    'asin',
    'asinh',
    'atan',
    'atanh',
    'atan2',
    'ceil',
    'cbrt',
    'expm1',
    'clz32',
    'cos',
    'cosh',
    'exp',
    'floor',
    'fround',
    'hypot',
    'imul',
    'log',
    'log1p',
    'log2',
    'log10',
    'max',
    'min',
    'pow',
    'random',
    'round',
    'sign',
    'sin',
    'sinh',
    'sqrt',
    'tan',
    'tanh',
    'trunc',
    'E',
    'LN10',
    'LN2',
    'LOG10E',
    'LOG2E',
    'PI',
    'SQRT1_2',
    'SQRT2']
  const { length } = propertyNames

  for (let i = 0; i < length; i++) {
    BMMath[propertyNames[i]] = Math[propertyNames[i]]
  }
}())

function ProjectInterface() { return {} }
BMMath.random = Math.random
BMMath.abs = function (val: number | number[]) {
  const tOfVal = typeof val

  if (tOfVal === 'object' && val.length > 0) {
    const absArr = createSizedArray(val.length)
    let i
    const { length: len } = val

    for (i = 0; i < len; i += 1) {
      absArr[i] = Math.abs(val[i])
    }

    return absArr
  }

  return Math.abs(val as number)
}

function roundValues(flag?: boolean ) {
  _shouldRoundValues = Boolean(flag)
}

function bmRnd(value: number) {
  if (_shouldRoundValues) {
    return Math.round(value)
  }

  return value
}

let expressionsPlugin = null
let expressionsInterfaces = null

const setExpressionsPlugin = (value) => { expressionsPlugin = value }
const getExpressionsPlugin = () => expressionsPlugin
const setExpressionInterfaces = (value) => { expressionsInterfaces = value }
const getExpressionInterfaces = () => expressionsInterfaces

export {
  bmFloor,
  BMMath,
  bmMax,
  bmMin,
  bmPow,
  bmRnd,
  bmSqrt,
  getExpressionInterfaces,
  getExpressionsPlugin,
  ProjectInterface,
  roundValues,
  setExpressionInterfaces,
  setExpressionsPlugin,
}
