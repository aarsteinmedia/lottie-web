import type { PoolElement } from '@/types'
import type { ShapePath } from '@/utils/shapes/ShapePath'

import { createSizedArray } from '@/utils/helpers/arrays'
import { double } from '@/utils/pooling/double'

export class PoolFactory {
  private _create: (_element?: ShapePath) => PoolElement
  private _length = 0
  private _maxLength: number
  private _release?: ((el: PoolElement) => void) | undefined
  private pool: PoolElement[]
  constructor(
    initialLength: number,
    _create: (_element?: PoolElement) => PoolElement,
    _release?: (el: PoolElement) => void
  ) {
    this._maxLength = initialLength
    this._create = _create
    this._release = _release
    this.pool = createSizedArray(this._maxLength)

    this.newElement = this.newElement.bind(this)
    this.release = this.release.bind(this)
  }

  newElement() {
    let element: PoolElement

    if (this._length) {
      this._length -= 1
      element = this.pool[this._length] as PoolElement
    } else {
      element = this._create()
    }

    return element
  }

  release(element: PoolElement) {
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