const locationHref = { current: '' };

const setLocationHref = (value: string) => {
  locationHref.current = value;
};
const getLocationHref = () => locationHref.current;

export {
  getLocationHref,
  setLocationHref
};