/**
 *
 * Web worker.
 */
const isWebWorkerActive = { current: false },

  setWebWorker = (flag: boolean) => {
    isWebWorkerActive.current = flag
  },
  getWebWorker = () => isWebWorkerActive.current

export {
  getWebWorker,
  setWebWorker
}