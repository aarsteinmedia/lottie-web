const propertyGroupFactory = (
  () =>
    (interfaceFunction: any, parentPropertyGroup: any) =>
      (val = 1) => {
        if (val <= 0) {
          return interfaceFunction
        }

        return parentPropertyGroup(val - 1)
      }
)()

export default propertyGroupFactory
