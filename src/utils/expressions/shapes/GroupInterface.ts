import type { ShapePathInterface } from '@/utils/expressions/shapes/ShapePathInterface'

import { BaseInterface } from '@/utils/expressions/shapes/BaseInterface'

// @ts-expect-error: incompatible type _name
export class GroupInterface extends BaseInterface {
  content?: (value: string | number) => ShapePathInterface | null
  // @ts-expect-error: incompatible type
  override get _name() {
    return this.shape?.nm
  }

  override getInterface(value: string | number) {
    switch (value) {
      case 'ADBE Vectors Group':
      case 'Contents':
      case 2: {
        return this.content
      }
      // Not necessary for now. Keeping them here in case a new case appears
      // case 'ADBE Vector Transform Group':
      // case 3:
      default: {
        return this.transform
      }
    }
  }
}