import type {
  Audio,
  ElementInterfaceIntersect,
  GlobalData,
  LottieAsset,
  LottieLayer,
  VectorProperty,
} from '@/types'
import type MultiDimensionalProperty from '@/utils/properties/MultiDimensionalProperty'
import type ValueProperty from '@/utils/properties/ValueProperty'

import RenderableElement from '@/elements/helpers/RenderableElement'
import PropertyFactory from '@/utils/PropertyFactory'

export default class AudioElement extends RenderableElement {
  _canPlay: boolean
  _currentTime: number
  _isPlaying: boolean
  _previousVolume: number | null
  _volume: number
  _volumeMultiplier?: number
  assetData: null | LottieAsset
  audio: Audio
  lv: MultiDimensionalProperty
  tm: ValueProperty

  constructor(
    data: LottieLayer,
    globalData: GlobalData,
    comp: ElementInterfaceIntersect
  ) {
    super()
    this.initFrame()
    this.initRenderable()
    this.assetData = globalData.getAssetData(data.refId) ?? null
    this.initBaseData(
      data, globalData, comp
    )
    this._isPlaying = false
    this._canPlay = false
    const assetPath = this.globalData?.getAssetsPath(this.assetData)

    this.audio = this.globalData?.audioController?.createAudio(assetPath)
    this._currentTime = 0
    this.globalData?.audioController?.addAudio(this)
    this._volumeMultiplier = 1
    this._volume = 1
    this._previousVolume = null
    this.tm = (
      data.tm
        ? PropertyFactory.getProp(
          this as unknown as ElementInterfaceIntersect,
          data.tm,
          0,
          globalData.frameRate,
          this as unknown as ElementInterfaceIntersect
        )
        : { _placeholder: true }
    ) as ValueProperty
    this.lv = PropertyFactory.getProp(
      this as unknown as ElementInterfaceIntersect,
      (data.au?.lv ?? { k: [100] }) as VectorProperty<
        number[]
      >,
      1,
      0.01,
      this as unknown as ElementInterfaceIntersect
    ) as MultiDimensionalProperty
  }

  override getBaseElement() {
    return null
  }

  override hide() {
    this.audio.pause()
    this._isPlaying = false
  }

  override initExpressions() {
    // Pass through
  }

  pause() {
    this.audio.pause()
    this._isPlaying = false
    this._canPlay = false
  }

  prepareFrame(num: number) {
    if (!this.data) {
      throw new Error(`${this.constructor.name}: data (LottieLayer) is not implemented`)
    }
    this.prepareRenderableFrame(num, true)
    this.prepareProperties(num, true)
    if (this.tm._placeholder) {
      this._currentTime = num / Number(this.data.sr)
    } else {
      this._currentTime = this.tm.v
    }
    this._volume = Number(this.lv.v[0])
    const totalVolume = this._volume * Number(this._volumeMultiplier)

    if (this._previousVolume !== totalVolume) {
      this._previousVolume = totalVolume
      this.audio.volume(totalVolume)
    }
  }

  renderFrame(_val?: number) {
    if (!this.isInRange || !this._canPlay) {
      return
    }
    if (!this._isPlaying) {
      this.audio.play()
      this.audio.seek(this._currentTime / Number(this.globalData?.frameRate))
      this._isPlaying = true

      return
    }

    if (
      !this.audio.playing() ||
      Math.abs(this._currentTime / Number(this.globalData?.frameRate) -
        this.audio.seek()) > 0.1
    ) {
      this.audio.seek(this._currentTime / Number(this.globalData?.frameRate))
    }
  }

  resume() {
    this._canPlay = true
  }

  setRate(rateValue: number) {
    this.audio.rate(rateValue)
  }

  override show() {
    // Pass through
    // this.audio.play()
  }

  override sourceRectAtTime() {
    return null
  }

  volume(volumeValue: number) {
    this._volumeMultiplier = volumeValue
    this._previousVolume = volumeValue * this._volume
    this.audio.volume(this._previousVolume)
  }
}
