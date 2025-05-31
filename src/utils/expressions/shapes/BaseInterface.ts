import type { Shape } from '@/types'
import type PropertyGroupFactory from '@/utils/expressions/PropertyGroupFactory'

export default abstract class BaseInterface {
  _name?: string
  mn?: string
  nm?: string
  numProperties?: number
  prop?: any
  propertyGroup?: PropertyGroupFactory
  propertyIndex?: number
  shape?: Shape
  transform?: any

  getInterface(_value: string | number) {
    throw new Error('Method not implemented')
  }
}
