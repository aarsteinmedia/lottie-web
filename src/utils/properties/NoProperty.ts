import { BaseProperty } from '@/utils/properties/BaseProperty'

export class NoProperty extends BaseProperty {
  constructor() {
    super()
    this.propType = false
  }
}