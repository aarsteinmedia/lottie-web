import type LayerExpressionInterface from '@/utils/expressions/LayerInterface'
import type BaseProperty from '@/utils/properties/BaseProperty'

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

    // @ts-expect-error: TODO:
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.parentPropertyGroup(val - 1)
  }
}
