import type ShapePath from '@/utils/shapes/ShapePath'

import bezierLengthPool from '@/utils/pooling/bezierLengthPool'
import PoolFactory from '@/utils/pooling/PoolFactory'

const segmentsLengthPool = (() =>
  new PoolFactory(
    8,
    () => ({
      lengths: [],
      totalLength: 0,
    }),
    // @ts-expect-error: TODO:
    (element: ShapePath) => {
      const { length } = element.lengths

      for (let i = 0; i < length; i++) {
        bezierLengthPool.release(element.lengths[i])
      }
      element.lengths.length = 0
    }
  ))()

export default segmentsLengthPool