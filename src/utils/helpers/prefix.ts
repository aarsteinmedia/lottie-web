const idPrefix = { current: '' };

const setIDPrefix = (value: string) => {
  idPrefix.current = value;
};
const getIDPrefix = () => idPrefix.current;

export {
  getIDPrefix,
  setIDPrefix
};
