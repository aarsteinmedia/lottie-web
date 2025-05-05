import type FootageElement from '@/elements/FootageElement'

class OutlineInterface {
  private currentProperty: any
  private currentPropertyName: string
  private elem: FootageElement

  constructor(elem: FootageElement) {
    this.elem = elem
    this.currentPropertyName = ''
    this.currentProperty = elem.getFootageData()
  }

  init = () => {
    this.currentPropertyName = ''
    this.currentProperty = this.elem.getFootageData()

    return this.searchProperty
  }

  searchProperty = (value: keyof typeof this.currentProperty) => {
    if (this.currentProperty?.[value]) {
      this.currentPropertyName = value as string
      this.currentProperty = this.currentProperty[value]
      if (typeof this.currentProperty === 'object') {
        return this.searchProperty
      }

      return this.currentProperty
    }

    const propertyNameIndex = (value as string).indexOf(this.currentPropertyName)

    if (propertyNameIndex !== -1) {
      const index = parseInt((value as string).slice(Math.max(0, propertyNameIndex + this.currentPropertyName.length)),
        10)

      this.currentProperty = (this.currentProperty as unknown as unknown[])?.[
        index
      ]
      if (typeof this.currentProperty === 'object') {
        return this.searchProperty
      }

      return this.currentProperty
    }

    return ''
  }
}

class DataInterface {
  public _name: string
  public elem: FootageElement
  public outlineInterface: OutlineInterface

  constructor(elem: FootageElement) {
    this.elem = elem
    this._name = 'Outline'
    this.outlineInterface = new OutlineInterface(elem)
  }

  interfaceFunction = (value: string) => {
    if (value === 'Outline') {
      return this.outlineInterface.init()
    }

    return null
  }
}

export default class FootageInterface {
  public _name: string
  public dataInterface: DataInterface
  public elem: FootageElement

  constructor(elem: FootageElement) {
    this.elem = elem
    this._name = 'Data'
    this.dataInterface = new DataInterface(elem)
  }

  interfaceFunction = (value: string) => {
    if (value === 'Data') {
      return this.dataInterface
    }

    return null
  }
}
