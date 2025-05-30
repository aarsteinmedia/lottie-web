import type FootageElement from '@/elements/FootageElement'

export default class FootageInterface {
  _name: string
  currentProperty?: SVGElement | null
  currentPropertyName = ''
  dataInterface: FootageInterface
  elem: FootageElement

  constructor (elem: FootageElement) {
    this.elem = elem
    this._name = 'Data'
    this.dataInterface = this.dataInterfaceFactory(elem)
  }

  dataInterfaceFactory(elem: FootageElement) {
    this._name = 'Outline'
    this.outlineInterface = this.outlineInterfaceFactory(elem)

    return this
  }

  getInterface(value: number | string) {
    if (value === 'Data') {
      return this.dataInterface
    }
    if (value === 'Outline') {
      this.outlineInterface()

      return
    }

    return null
  }

  init() {
    this.currentPropertyName = ''
    this.currentProperty = this.elem.getFootageData()

    return this.searchProperty
  }

  outlineInterface(_elem?: FootageElement) {
    throw new Error('Method is not implemented')
  }

  outlineInterfaceFactory(elem: FootageElement) {
    this.currentPropertyName = ''

    this.currentProperty = elem.getFootageData()

    this.elem = elem

    return this.init
  }

  searchProperty(value: keyof SVGElement) {
    if (this.currentProperty?.[value]) {
      this.currentPropertyName = value
      this.currentProperty = this.currentProperty[value]
      if (typeof this.currentProperty === 'object') {
        return this.searchProperty
      }

      return this.currentProperty
    }
    const propertyNameIndex = value.indexOf(this.currentPropertyName)

    if (propertyNameIndex !== -1) {
      const index = parseInt(value.slice(propertyNameIndex + this.currentPropertyName.length), 10)

      this.currentProperty = this.currentProperty?.[index as unknown as keyof SVGElement]
      if (typeof this.currentProperty === 'object') {
        return this.searchProperty
      }

      return this.currentProperty
    }

    return ''
  }
}
