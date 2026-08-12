import type { LayerExpressionInterface } from '@/utils/expressions/LayerInterface'
import type { BaseProperty } from '@/utils/properties/BaseProperty'

type ParentPropertyGroup = LayerExpressionInterface | PropertyGroupFactory

export class PropertyGroupFactory {

  interfaceFunction: (val: string | number) => BaseProperty
  parentPropertyGroup: ParentPropertyGroup
  constructor(interfaceFunction: (val: number | string) => BaseProperty, parentPropertyGroup: ParentPropertyGroup) {
    this.interfaceFunction = interfaceFunction
    this.parentPropertyGroup = parentPropertyGroup
  }

  // Expression property groups are dynamically nested; keep this permissive.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getInterface(val = 1): any {
    if (val <= 0) {
      return this.interfaceFunction
    }

    return this.parentPropertyGroup.getInterface(val - 1)
  }
}
