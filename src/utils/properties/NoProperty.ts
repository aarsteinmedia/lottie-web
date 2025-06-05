import BaseProperty from '@/utils/properties/BaseProperty'

export default class NoProperty extends BaseProperty {
  constructor() {
    super()
    this.propType = false
  }
}