// export const initialDefaultFrame = -999999,
//   roundCorner = 0.5519

/**
 *
 * Web worker.
 */
const isWebWorkerActive = { current: false }

export const setWebWorker = (flag: boolean) => {
    isWebWorkerActive.current = flag
  },
  getWebWorker = () => isWebWorkerActive.current
/**
 *
 * Subframe.
 */
const isSubframeEnabled = { current: true }

export const setSubframeEnabled = (flag: boolean) => {
    isSubframeEnabled.current = flag
  },
  getSubframeEnabled = () => isSubframeEnabled.current

/**
 *
 * Location HREF.
 */
const locationHref = { current: '' }

export const setLocationHref = (value: string) => {
    locationHref.current = value
  },
  getLocationHref = () => locationHref.current

const idPrefix = { current: '' }

export const setIDPrefix = (value: string) => {
    idPrefix.current = value
  },
  getIDPrefix = () => idPrefix.current

