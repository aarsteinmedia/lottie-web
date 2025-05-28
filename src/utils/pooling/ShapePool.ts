import type { Vector2 } from '@/types'

import pointPool from '@/utils/pooling/pointPool'
import PoolFactory from '@/utils/pooling/PoolFactory'
import ShapePath from '@/utils/shapes/ShapePath'

const _factory = new PoolFactory(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  4, _create, _release as any
)

export const { newElement } = _factory,
  { release } = _factory

export function clone(shape: ShapePath) {
  const cloned = newElement<ShapePath>(),
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    len = shape._length ?? shape.v.length

  cloned.setLength(len)
  cloned.c = shape.c

  for (let i = 0; i < len; i++) {
    cloned.setTripleAt(
      shape.v[i][0],
      shape.v[i][1],
      shape.o[i][0],
      shape.o[i][1],
      shape.i[i][0],
      shape.i[i][1],
      i
    )
  }

  return cloned
}

function _create() {
  return new ShapePath()
}

function _release(shapePath: ShapePath) {
  const len = shapePath._length

  for (let i = 0; i < len; i++) {
    pointPool.release(shapePath.v[i])
    pointPool.release(shapePath.i[i])
    pointPool.release(shapePath.o[i])
    shapePath.v[i] = null as unknown as Vector2
    shapePath.i[i] = null as unknown as Vector2
    shapePath.o[i] = null as unknown as Vector2
  }
  shapePath._length = 0
  shapePath.c = false
}

const ShapePool = {
  clone,
  newElement
}

export default ShapePool