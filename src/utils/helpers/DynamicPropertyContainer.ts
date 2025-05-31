import type {
  ElementInterfaceIntersect, GradientColor, Shape, TextData, TextRangeValue, VectorProperty
} from '@/types'
import type { PropType } from '@/utils/enums'
import type PropertyInterface from '@/utils/expressions/PropertyInterface'

import type TextProperty from '../text/TextProperty'

export default abstract class DynamicPropertyContainer {
  _isAnimated?: boolean
  _mdf?: boolean
  container?: ElementInterfaceIntersect | null
  data?:
    { hd?: boolean } &
    (VectorProperty<number | number[] | Keyframe[]>
      | Shape
      | TextProperty
      | TextData
      | TextRangeValue
      | VectorProperty<Keyframe[]>
      | GradientColor)
  dynamicProperties: DynamicPropertyContainer[] = []
  propType?: PropType | false

  addDynamicProperty(prop: DynamicPropertyContainer) {
    if (this.dynamicProperties.includes(prop)) {
      return
    }
    this.dynamicProperties.push(prop)
    this.container?.addDynamicProperty(this)
    this._isAnimated = true
  }

  getValue(_flag?: boolean): number | number[] {
    throw new Error(`${this.constructor.name}: Method getValue is not implemented`)
  }

  initDynamicPropertyContainer(container: ElementInterfaceIntersect) {
    this.container = container
    this.dynamicProperties = []
    this._mdf = false
    this._isAnimated = false
  }

  iterateDynamicProperties() {
    this._mdf = false
    const { length } = this.dynamicProperties

    for (let i = 0; i < length; i++) {
      this.dynamicProperties[i].getValue()
      if (this.dynamicProperties[i]._mdf) {
        this._mdf = true
      }
    }

    return 0 // For type compability
  }

  setGroupProperty(_propertyInterface: PropertyInterface) {
    // Pass through
    // throw new Error('Method is not implemented')
  }
}


