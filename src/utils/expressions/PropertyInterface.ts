const PropertyInterface = (function () {
  return function (propertyName: string, propertyGroup) {
    const interfaceFunction = { _name: propertyName }

    function _propertyGroup(val = 1) {

      if (val <= 0) {
        return interfaceFunction
      }

      return propertyGroup(val - 1)
    }

    return _propertyGroup
  }
}())

export default PropertyInterface
