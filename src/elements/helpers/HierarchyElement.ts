/**
 * Handles AE's layer parenting property.
 *
 */

import type { ElementInterfaceIntersect } from '@/types'

import TransformElement from '@/elements/helpers/TransformElement'

export default abstract class HierarchyElement extends TransformElement {
  _isParent?: boolean

  checkParenting() {
    if (!this.data) {
      throw new Error(`${this.constructor.name}: data (LottieLayer) is not implemented`)
    }
    if (!this.comp) {
      throw new Error(`${this.constructor.name}: comp (ElementInterface) is not implemented`)
    }
    if (this.data.parent === undefined) {
      return
    }

    this.comp.buildElementParenting(
      this as unknown as ElementInterfaceIntersect,
      this.data.parent,
      []
    )
  }

  initHierarchy() {
    // element's parent list
    this.hierarchy = []
    // if element is parent of another layer _isParent will be true
    this._isParent = false
    this.checkParenting()
  }

  setAsParent() {
    this._isParent = true
  }

  setHierarchy(hierarchy: ElementInterfaceIntersect[]) {
    this.hierarchy = hierarchy
  }
}