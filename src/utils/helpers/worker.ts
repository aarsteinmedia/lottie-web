const isWebWorkerActive = { current: false };

const setWebWorker = (flag: boolean) => {
  isWebWorkerActive.current = flag;
};
const getWebWorker = () => isWebWorkerActive.current;

export {
  getWebWorker,
  setWebWorker
};