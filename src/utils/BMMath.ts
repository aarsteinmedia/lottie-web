import type { BMMath as BMMathType } from '@/types'

import { isArrayOfNum } from '@/utils'
import { createSizedArray } from '@/utils/helpers/arrays'
import { getShouldRoundValues } from '@/utils/helpers/resolution'

const bmPow = Math.pow,
  bmSqrt = Math.sqrt,
  bmFloor = Math.floor,
  bmMax = Math.max,
  bmMin = Math.min

const BMMath = {} as unknown as BMMathType

(() => {
  const propertyNames: (keyof Math)[] = ['abs',
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

  for (let i = 0; i < length; i += 1) {
    // @ts-expect-error assign to read only
    BMMath[propertyNames[i]] = Math[propertyNames[i]]
  }
})()

BMMath.random = Math.random
BMMath.abs = (val: number | number[]) => {
  if (isArrayOfNum(val)) {
    const absArr = createSizedArray<number>(val.length),
      { length } = val

    for (let i = 0; i < length; i++) {
      absArr[i] = Math.abs(val[i] ?? 0)
    }

    return absArr
  }

  return Math.abs(val)
}

function bmRnd(value: number) {
  if (getShouldRoundValues()) {
    return Math.round(value)
  }

  return value
}

export default BMMath

export {
  bmFloor,
  bmMax,
  bmMin,
  bmPow,
  bmRnd,
  bmSqrt,
}
