import { ArrayType } from '@/utils/enums'
import { createTypedArray } from '@/utils/helpers/arrays'
import { PoolFactory } from '@/utils/pooling/PoolFactory'

export const pointPool = (() =>
  new PoolFactory(8, () => createTypedArray(ArrayType.Float32, 2) as number[]))()
