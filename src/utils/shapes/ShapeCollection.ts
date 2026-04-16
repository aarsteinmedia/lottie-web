import type { PoolElement } from '@/types';
import type { ShapePath } from '@/utils/shapes/ShapePath';

import { createSizedArray } from '@/utils/helpers/arrays';
import { release } from '@/utils/pooling/ShapePool';

export class ShapeCollection {
  public _length = 0;
  public _maxLength = 4;
  public shapes: ShapePath[];
  constructor() {
    this.shapes = createSizedArray(this._maxLength);
  }

  addShape(shapeData: ShapePath) {
    if (this._length === this._maxLength) {
      this.shapes = [...this.shapes, ...createSizedArray(this._maxLength)] as ShapePath[];
      this._maxLength *= 2;
    }
    this.shapes[this._length] = shapeData;
    this._length++;
  }

  releaseShapes() {
    for (let i = 0; i < this._length; i++) {
      release(this.shapes[i] as PoolElement);
    }
    this._length = 0;
  }
}
