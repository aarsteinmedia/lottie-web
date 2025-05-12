import type ShapePath from '@/utils/shapes/ShapePath'

import { createSizedArray } from '@/utils/helpers/arrays'
import double from '@/utils/pooling/double'

export default class PoolFactory {
  private _create: (_element?: ShapePath) => void
  private _length = 0
  private _maxLength: number
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  private _release?: <Release = unknown>(el?: Release) => void
  private pool: unknown[]
  constructor(
    initialLength: number,
    _create: (_element?: ShapePath) => unknown,
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
    _release?: <Release = unknown>(el?: Release) => void
  ) {
    this._maxLength = initialLength
    this._create = _create
    this._release = _release
    this.pool = createSizedArray(this._maxLength)

    this.newElement = this.newElement.bind(this)
    this.release = this.release.bind(this)
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  newElement<T = unknown>() {
    let element

    if (this._length) {
      this._length -= 1
      element = this.pool[this._length]
    } else {
      // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
      element = this._create()
    }

    return element as T
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  release<T = unknown>(element?: T) {
    if (this._length === this._maxLength) {
      this.pool = double(this.pool)
      this._maxLength *= 2
    }
    if (this._release) {
      this._release(element)
    }
    this.pool[this._length] = element
    this._length++
  }
}