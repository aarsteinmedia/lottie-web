import type {
  DynamicProperty,
  Effect,
  ElementInterfaceIntersect, GradientColor, Keyframe, Shape, TextData, TextRangeValue, VectorProperty
} from '@/types'
import type { PropType } from '@/utils/enums'
import type { PropertyGroupFactory } from '@/utils/expressions/PropertyGroupFactory'
import type { TextProperty } from '@/utils/text/TextProperty'

export abstract class DynamicPropertyContainer {
  _isAnimated?: boolean
  _mdf?: undefined | boolean
  container?: ElementInterfaceIntersect | null
  data?:
    | DynamicProperty
    | Shape
    | TextProperty
    | TextData
    | TextRangeValue
    | VectorProperty<Keyframe[]>
    | GradientColor
    | Effect
  dynamicProperties: DynamicPropertyContainer[] = []
  hd?: boolean
  keyframes?: Keyframe[]
  propertyIndex?: undefined | number
  propType?: PropType | false

  addDynamicProperty(prop: DynamicPropertyContainer) {
    if (this.dynamicProperties.includes(prop)) {
      return
    }
    this.dynamicProperties.push(prop)
    this.container?.addDynamicProperty(this)
    this._isAnimated = true
  }

  getValue(_flag?: unknown): unknown {
    throw new Error(`${this.constructor.name}: Method getValue is not implemented`)
  }

  initDynamicPropertyContainer(container: ElementInterfaceIntersect) {
    this.container = container
    this.dynamicProperties = []
    this._mdf = false
    this._isAnimated = false
  }

  iterateDynamicProperties(): unknown {
    this._mdf = false
    const { length } = this.dynamicProperties

    for (let i = 0; i < length; i++) {
      this.dynamicProperties[i]?.getValue()
      if (this.dynamicProperties[i]?._mdf) {
        this._mdf = true
      }
    }

    return 0 // For type compability
  }

  setGroupProperty(_propertyInterface: PropertyGroupFactory) {
    // Pass through
    // throw new Error('Method is not implemented')
  }
}


