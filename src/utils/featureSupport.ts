import { inBrowser } from '@/utils/helpers/constants'

class FeatureSupport {
  maskType = true
  offscreenCanvas = typeof OffscreenCanvas !== 'undefined'
  svgLumaHidden = true
  constructor() {
    if (!inBrowser) {
      return
    }
    this.maskType =
      !/MSIE 10/i.test(navigator.userAgent) &&
      !/MSIE 9/i.test(navigator.userAgent) &&
      !/rv:11.0/i.test(navigator.userAgent) &&
      !/Edge\/\d./i.test(navigator.userAgent)
    this.svgLumaHidden = !/firefox/i.test(navigator.userAgent)
  }
}

const featureSupport = new FeatureSupport()

export default featureSupport
