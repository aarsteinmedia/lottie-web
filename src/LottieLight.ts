import {
  play,
  pause,
  togglePause,
  setSpeed,
  setDirection,
  stop,
  registerAnimation,
  resize,
  goToAndStop,
  destroy,
  freeze,
  unfreeze,
  setVolume,
  mute,
  unmute,
  getRegisteredAnimations,
  searchAnimations,
  loadAnimation,
} from '@/animation/AnimationManager'
import { registerRenderer } from '@/renderers'
import SVGRenderer from '@/renderers/SVGRenderer'
import { inBrowser } from '@/utils'
import { Modifier, RendererType } from '@/utils/enums'
import { _isServer } from '@/utils/helpers/constants'
import { setLocationHref } from '@/utils/helpers/locationHref'
import { setIDPrefix as setPrefix } from '@/utils/helpers/prefix'
import { setQuality } from '@/utils/helpers/resolution'
import { setSubframeEnabled } from '@/utils/helpers/subframe'
import { setWebWorker } from '@/utils/helpers/worker'
import { registerModifier } from '@/utils/shapes/modifiers'
import OffsetPathModifier from '@/utils/shapes/modifiers/OffsetPathModifier'
import PuckerAndBloatModifier from '@/utils/shapes/modifiers/PuckerAndBloatModifier'
import RepeaterModifier from '@/utils/shapes/modifiers/RepeaterModifier'
import RoundCornersModifier from '@/utils/shapes/modifiers/RoundCornersModifier'
import TrimModifier from '@/utils/shapes/modifiers/TrimModifier'
import ZigZagModifier from '@/utils/shapes/modifiers/ZigZagModifier'

const version = '[[BM_VERSION]]'

export const setSubframeRendering = (flag: boolean) => {
  setSubframeEnabled(flag)
}

const Lottie = {
  destroy,
  freeze,
  getRegisteredAnimations,
  goToAndStop,
  inBrowser,
  loadAnimation,
  mute,
  pause,
  play,
  registerAnimation,
  resize,
  setDirection,
  setLocationHref,
  setPrefix,
  setQuality,
  setSpeed,
  setSubframeRendering,
  setVolume,
  stop,
  togglePause,
  unfreeze,
  unmute,
  useWebWorker: setWebWorker,
  version,
}

const checkReady = () => {
    if (_isServer) {
      return
    }
    if (document.readyState === 'complete') {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      clearInterval(readyStateCheckInterval)
      searchAnimations()
    }
  },
  readyStateCheckInterval = setInterval(checkReady, 100)

// Registering renderers
registerRenderer(RendererType.SVG, SVGRenderer)

// Registering shape modifiers
registerModifier(Modifier.TrimModifier, TrimModifier)
registerModifier(Modifier.PuckerAndBloatModifier, PuckerAndBloatModifier)
registerModifier(Modifier.RepeaterModifier, RepeaterModifier)
registerModifier(Modifier.RoundCornersModifier, RoundCornersModifier)
registerModifier(Modifier.ZigZagModifier, ZigZagModifier)
registerModifier(Modifier.OffsetPathModifier, OffsetPathModifier)

export { loadAnimation }

export default Lottie