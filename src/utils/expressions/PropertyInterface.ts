import type { PropertyGroupFactory } from '@/utils/expressions/PropertyGroupFactory'

export class PropertyInterface {

  _name: string
  propertyGroup: PropertyGroupFactory

  constructor(propertyName: string, propertyGroup: PropertyGroupFactory) {
    this._name = propertyName
    this.propertyGroup = propertyGroup
  }

  getInterface(val: number) {
    if (val <= 0) {
      return this
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.propertyGroup.getInterface(val - 1)
  }
}
