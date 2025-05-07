import { ArrayType } from '@/utils/enums'
import { getDefaultCurveSegments } from '@/utils/getterSetter'
import { createTypedArray } from '@/utils/helpers/arrays'
import PoolFactory from '@/utils/pooling/PoolFactory'

const bezierLengthPool = (() =>
  new PoolFactory(8, () => ({
    addedLength: 0,
    lengths: createTypedArray(ArrayType.Float32, getDefaultCurveSegments()),
    percents: createTypedArray(ArrayType.Float32, getDefaultCurveSegments()),
  })))()

export default bezierLengthPool