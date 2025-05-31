import type { Shape } from '@/types'

import BaseInterface from '@/utils/expressions/shapes/BaseInterface'

import type PropertyGroupFactory from '../PropertyGroupFactory'
import type ShapePathInterface from './ShapePathInterface'

export default class GroupInterface extends BaseInterface {
  content?: (value: string | number) => ShapePathInterface | null
  propertyGroup?: PropertyGroupFactory
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