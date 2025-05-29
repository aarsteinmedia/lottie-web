import type { ElementInterfaceIntersect } from '@/types'

export default class TextExpressionInterface {

  _sourceText?: { value: string }

  elem: ElementInterfaceIntersect

  get sourceText() {
    this.elem.textProperty?.getValue()
    const stringValue = this.elem.textProperty?.currentData.t

    if (!this._sourceText || stringValue !== this._sourceText.value) {
      this._sourceText = new String(stringValue) // eslint-disable-line no-new-wrappers
      // If stringValue is an empty string, eval returns undefined, so it has to be returned as a String primitive
      this._sourceText.value = stringValue || new String(stringValue) // eslint-disable-line no-new-wrappers
      Object.defineProperty(
        this._sourceText, 'style', {
          get() {
            return { fillColor: this.elem.textProperty.currentData.fc }
          },
        }
      )
    }

    return this._sourceText
  }

  constructor(elem: ElementInterfaceIntersect) {

    this.elem = elem
  }

  getInterface (name: string) {
    // eslint-disable-next-line sonarjs/no-small-switch
    switch (name) {
      case 'ADBE Text Document': {
        return this.sourceText
      }
      default: {
        return null
      }
    }
  }
}
