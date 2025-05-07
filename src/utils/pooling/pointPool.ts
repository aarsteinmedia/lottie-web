import { ArrayType } from '@/utils/enums'
import { createTypedArray } from '@/utils/helpers/arrays'
import PoolFactory from '@/utils/pooling/PoolFactory'

const pointPool = (() =>
  new PoolFactory(8, () => createTypedArray(ArrayType.Float32, 2)))()

export default pointPool