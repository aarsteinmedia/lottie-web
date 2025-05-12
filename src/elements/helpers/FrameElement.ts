import type DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer'

import HierarchyElement from '@/elements/helpers/HierarchyElement'

/**
 * Handles element's layer frame update.
 * Checks layer in point and out point.
 *
 */

export default abstract class FrameElement extends HierarchyElement {
  _mdf?: boolean
  displayStartTime = 0

  addDynamicProperty(prop: DynamicPropertyContainer) {
    if (!this.dynamicProperties.includes(prop)) {
      this.dynamicProperties.push(prop)
    }
  }

  initFrame() {
    // set to true when inpoint is rendered
    this._isFirstFrame = false
    // list of animated properties
    this.dynamicProperties = []
    // If layer has been modified in current tick this will be true
    this._mdf = false
  }

  prepareProperties(_number: number, isVisible?: boolean) {
    const { length } = this.dynamicProperties

    for (let i = 0; i < length; i++) {
      if (
        !isVisible &&
        !(this._isParent && this.dynamicProperties[i].propType === 'transform')
      ) {
        continue
      }
      this.dynamicProperties[i].getValue()
      if (!this.globalData || !this.dynamicProperties[i]._mdf) {
        continue
      }
      this.globalData._mdf = true
      this._mdf = true
    }
  }
}
