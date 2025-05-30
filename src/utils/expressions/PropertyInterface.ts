import type { BaseProperty } from '@/utils/Properties'

export default class PropertyInterface {

  _name: string
  propertyGroup: (val: number) => BaseProperty

  constructor(propertyName: string, propertyGroup: (val: number) => BaseProperty) {
    this._name = propertyName
    this.propertyGroup = propertyGroup
  }

  getInterface(val: number) {
    if (val <= 0) {
      return this
    }

    return this.propertyGroup(val - 1)
  }
}
