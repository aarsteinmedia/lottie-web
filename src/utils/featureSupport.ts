import { IN_BROWSER } from '@/utils/helpers/constants'

class FeatureSupport {
  maskType = true
  offscreenCanvas = typeof OffscreenCanvas !== 'undefined'
  svgLumaHidden = true
  constructor() {
    if (!IN_BROWSER) {
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

export const featureSupport = new FeatureSupport()
