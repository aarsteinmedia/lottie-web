import type { PoolElement } from '@/types'

import { isShapePath } from '@/utils'
import { bezierLengthPool } from '@/utils/pooling/bezierLengthPool'
import { PoolFactory } from '@/utils/pooling/PoolFactory'

export const segmentsLengthPool = (() =>
  new PoolFactory(
    8,
    () => ({
      lengths: [],
      totalLength: 0,
    }),
    (element: PoolElement) => {

      if (!isShapePath(element)) {
        return
      }

      const { length } = element.lengths

      for (let i = 0; i < length; i++) {
        bezierLengthPool.release(element.lengths[i] as PoolElement)
      }
      element.lengths.length = 0
    }
  ))()