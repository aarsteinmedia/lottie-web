const idPrefix = { current: '' },

  setIDPrefix = (value: string) => {
    idPrefix.current = value
  },
  getIDPrefix = () => idPrefix.current

export {
  getIDPrefix,
  setIDPrefix
}