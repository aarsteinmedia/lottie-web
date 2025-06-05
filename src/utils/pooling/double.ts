import type { PoolElement } from '@/types'

import { createSizedArray } from '@/utils/helpers/arrays'

export default function double(arr: PoolElement[]) {
  return [...arr, ...createSizedArray(arr.length)] as PoolElement[]
}
