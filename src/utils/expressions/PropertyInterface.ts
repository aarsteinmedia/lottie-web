export default class PropertyInterface {
  _name: string

  constructor(
    propertyName: string,
    private propertyGroup: (val: number) => unknown
  ) {
    this._name = propertyName
  }

  public _propertyGroup(valFromProps?: number): unknown {
    const val = valFromProps === undefined ? 1 : valFromProps
    if (val <= 0) {
      return { _name: this._name }
    }
    return this.propertyGroup(val - 1)
  }
}
