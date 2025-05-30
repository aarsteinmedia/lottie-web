import type ShapePathInterface from '@/utils/expressions/shapes/ShapePathInterface'

import BaseInterface from '@/utils/expressions/shapes/BaseInterface'


export default class ContentInterface extends BaseInterface {
  interfaces: ShapePathInterface[] = []

  override getInterface(value: string | number) {
    let i = 0

    const { length } = this.interfaces

    while (i < length) {
      if (this.interfaces[i]._name === value || this.interfaces[i].mn === value || this.interfaces[i].propertyIndex === value || this.interfaces[i].ix === value || this.interfaces[i].ind === value) {
        return this.interfaces[i]
      }
      i++
    }
    if (typeof value === 'number') {
      return this.interfaces[value - 1]
    }

    return null
  }
}