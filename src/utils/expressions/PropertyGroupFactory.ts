import type LayerExpressionInterface from '@/utils/expressions/LayerInterface'
import type { BaseProperty } from '@/utils/Properties'

export default class PropertyGroupFactory {

  interfaceFunction: (val: string | number) => BaseProperty
  parentPropertyGroup: LayerExpressionInterface
  constructor(interfaceFunction: (val: number | string) => BaseProperty, parentPropertyGroup: LayerExpressionInterface) {
    this.interfaceFunction = interfaceFunction
    this.parentPropertyGroup = parentPropertyGroup
  }

  getInterface(val = 1) {
    if (val <= 0) {
      return this.interfaceFunction
    }

    return this.parentPropertyGroup(val - 1)
  }
}
