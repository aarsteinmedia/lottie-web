export const initialDefaultFrame = -999999,
  roundCorner = 0.5519

/**
 *
 * Curve segments.
 */
const curveSegments = { default: 150 }

export const setDefaultCurveSegments = (value: number) => {
    curveSegments.default = value
  },
  getDefaultCurveSegments = () => curveSegments.default
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

/**
 *
 * Quality.
 */
const shouldRoundValues = { current: false }

export const getShouldRoundValues = () => shouldRoundValues.current,
  setShouldRoundValues = (value: boolean) => {
    shouldRoundValues.current = value
  },
  setQuality = (value: string | number) => {
    if (typeof value === 'string') {
      switch (value) {
        case 'high': {
          setDefaultCurveSegments(200)
          break
        }
        default:
        case 'medium': {
          setDefaultCurveSegments(50)
          break
        }
        case 'low': {
          setDefaultCurveSegments(10)
          break
        }
      }
    } else if (!isNaN(value) && value > 1) {
      setDefaultCurveSegments(value)
    }

    setShouldRoundValues(getDefaultCurveSegments() < 50)
  }
