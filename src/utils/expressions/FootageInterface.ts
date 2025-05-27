const FootageInterface = (function () {
  const outlineInterfaceFactory = function (elem) {
    let currentPropertyName = ''

    let currentProperty = elem.getFootageData()

    function init() {
      currentPropertyName = ''
      currentProperty = elem.getFootageData()

      return searchProperty
    }
    function searchProperty(value) {
      if (currentProperty[value]) {
        currentPropertyName = value
        currentProperty = currentProperty[value]
        if (typeof currentProperty === 'object') {
          return searchProperty
        }

        return currentProperty
      }
      const propertyNameIndex = value.indexOf(currentPropertyName)

      if (propertyNameIndex !== -1) {
        const index = parseInt(value.slice(propertyNameIndex + currentPropertyName.length), 10)

        currentProperty = currentProperty[index]
        if (typeof currentProperty === 'object') {
          return searchProperty
        }

        return currentProperty
      }

      return ''
    }

    return init
  }

  const dataInterfaceFactory = function (elem) {
    function interfaceFunction(value) {
      if (value === 'Outline') {
        return interfaceFunction.outlineInterface()
      }

      return null
    }

    interfaceFunction._name = 'Outline'
    interfaceFunction.outlineInterface = outlineInterfaceFactory(elem)

    return interfaceFunction
  }

  return function (elem) {
    function _interfaceFunction(value) {
      if (value === 'Data') {
        return _interfaceFunction.dataInterface
      }

      return null
    }

    _interfaceFunction._name = 'Data'
    _interfaceFunction.dataInterface = dataInterfaceFactory(elem)

    return _interfaceFunction
  }
}())

export default FootageInterface
