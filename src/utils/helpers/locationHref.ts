const locationHref = { current: '' }

const setLocationHref = (value: string) => {
    locationHref.current = value
  },
  getLocationHref = () => locationHref.current

export {
  getLocationHref,
  setLocationHref
}