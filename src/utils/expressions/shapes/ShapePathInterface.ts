import propertyGroupFactory from '../PropertyGroupFactory'
import PropertyInterface from '../PropertyInterface'

const ShapePathInterface = (

  function () {
    return function pathInterfaceFactory(
      shape, view, propertyGroup
    ) {
      const prop = view.sh

      function interfaceFunction(val) {
        if (val === 'Shape' || val === 'shape' || val === 'Path' || val === 'path' || val === 'ADBE Vector Shape' || val === 2) {
          return interfaceFunction.path
        }

        return null
      }

      const _propertyGroup = propertyGroupFactory(interfaceFunction, propertyGroup)

      prop.setGroupProperty(PropertyInterface('Path', _propertyGroup))
      Object.defineProperties(interfaceFunction, {
        _name: { value: shape.nm },
        ix: { value: shape.ix },
        mn: { value: shape.mn },
        path: {
          get () {
            if (prop.k) {
              prop.getValue()
            }

            return prop
          },
        },
        propertyGroup: { value: propertyGroup },
        propertyIndex: { value: shape.ix },
        shape: {
          get () {
            if (prop.k) {
              prop.getValue()
            }

            return prop
          },
        },
      })

      return interfaceFunction
    }
  }()
)

export default ShapePathInterface
