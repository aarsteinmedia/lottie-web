import type {
  Caching,
  ElementInterfaceIntersect, Keyframe, VectorProperty
} from '@/types'

import { PropType } from '@/utils/enums'
import { BaseProperty } from '@/utils/properties/BaseProperty'

export class KeyframedValueProperty extends BaseProperty {
  override pv: number | number[]
  selectorValue?: string
  override v: number
  constructor(
    elem: ElementInterfaceIntersect,
    data: VectorProperty<Keyframe[]>,
    mult: null | number = null,
    container: ElementInterfaceIntersect | null = null
  ) {
    super()
    this.propType = PropType.UniDimensional
    this.keyframes = data.k
    this.keyframesMetadata = []
    this.offsetTime = elem.data.st
    this.frameId = -1
    this._caching = {
      _lastKeyframeIndex: -1,
      lastFrame: this.initFrame,
      lastIndex: 0,
      value: 0,
    } as Caching
    this.k = true
    this.kf = true
    this.data = data
    this.mult = mult || 1
    this.elem = elem
    this.container = container
    this.comp = elem.comp
    this.v = this.initFrame
    this.pv = this.initFrame
    this._isFirstFrame = true
    this.getValue = this.processEffectsSequence
    this.effectsSequence = [this.getValueAtCurrentTime.bind(this)]
  }
}