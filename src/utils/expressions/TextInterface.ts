import type { ElementInterfaceIntersect } from '@/types'
import type ExpressionManager from '@/utils/expressions/ExpressionManager'

export default class TextExpressionInterface {
  elem: ElementInterfaceIntersect
  initiateExpression?: typeof ExpressionManager

  get sourceText() {
    this.elem.textProperty?.getValue()
    const stringValue = this.elem.textProperty?.currentData.t

    if (!this._sourceText || stringValue !== this._sourceText.value) {
      this._sourceText = {
        style: { fillColor: this.elem.textProperty?.currentData.fc as number[], },
        value:
          typeof stringValue === 'string'
            ? stringValue
            : stringValue?.toString(),
      }
    }

    return this._sourceText
  }

  private _sourceText?: {
    value?: string
    style?: { fillColor: number[] }
  } = {}

  constructor(elem: ElementInterfaceIntersect) {
    this.elem = elem
  }

  // // Static method to maintain similar interface to original
  // static create(elem: ElementInterfaceIntersect) {
  //   const instance = new TextExpressionInterface(elem)
  //   return instance._thisLayerFunction.bind(instance)
  // }

  public _thisLayerFunction(name: string) {
    if (name === 'ADBE Text Document') {
      return this.sourceText
    }

    return null
  }
}
