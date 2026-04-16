const isSubframeEnabled = { current: true };

const setSubframeEnabled = (flag: boolean) => {
  isSubframeEnabled.current = flag;
};
const getSubframeEnabled = () => isSubframeEnabled.current;


export {
  getSubframeEnabled,
  setSubframeEnabled
};