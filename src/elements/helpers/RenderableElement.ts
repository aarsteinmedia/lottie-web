import type {
  ElementInterfaceIntersect,
  SourceRect,
  SVGRendererConfig,
} from '@/types'

import FrameElement from '@/elements/helpers/FrameElement'
export default class RenderableElement extends FrameElement {
  hidden?: boolean
  isInRange?: boolean
  isTransparent?: boolean
  private renderableComponents: ElementInterfaceIntersect[] = []

  addRenderableComponent(component: ElementInterfaceIntersect) {
    if (this.renderableComponents.indexOf(component) === -1) {
      this.renderableComponents.push(component)
    }
  }

  checkLayerLimits(num: number) {
    if (!this.data || !this.globalData) {
      return
    }
    if (
      this.data.ip - this.data.st <= num &&
      this.data.op - this.data.st > num
    ) {
      if (this.isInRange !== true) {
        this.globalData._mdf = true
        this._mdf = true
        this.isInRange = true
        this.show()
      }
    } else if (this.isInRange !== false) {
      this.globalData._mdf = true
      this.isInRange = false
      this.hide()
    }
  }

  checkLayers(_val?: number) {
    throw new Error(
      `${this.constructor.name}: Method checkLayers is not implemented`
    )
  }

  checkTransparency() {
    if (!this.finalTransform) {
      throw new Error(
        `${this.constructor.name}: finalTransform is not implemented`
      )
    }
    if (Number(this.finalTransform.mProp.o?.v) <= 0) {
      if (
        !this.isTransparent &&
        (this.globalData?.renderConfig as SVGRendererConfig)?.hideOnTransparent
      ) {
        this.isTransparent = true
        this.hide()
      }
      return
    }

    if (this.isTransparent) {
      this.isTransparent = false
      this.show()
    }
  }

  getLayerSize() {
    if (!this.data) {
      throw new Error(
        `${this.constructor.name}: data (LottieLayer) is not implemented`
      )
    }
    if (this.data.ty === 5) {
      return {
        h: Number(this.data.textData?.height),
        w: Number(this.data.textData?.width),
      }
    }
    return { h: Number(this.data.height), w: Number(this.data.width) }
  }

  hide() {
    throw new Error(`${this.constructor.name}: Method hide not implemented yet`)
  }

  initRenderable() {
    // layer's visibility related to inpoint and outpoint. Rename isVisible to isInRange
    this.isInRange = false
    // layer's display state
    this.hidden = false
    // If layer's transparency equals 0, it can be hidden
    this.isTransparent = false
    // list of animated components
    this.renderableComponents = []
  }
  prepareRenderableFrame(num: number, _?: boolean) {
    this.checkLayerLimits(num)
  }
  removeRenderableComponent(component: ElementInterfaceIntersect) {
    if (this.renderableComponents.indexOf(component) !== -1) {
      this.renderableComponents.splice(
        this.renderableComponents.indexOf(component),
        1
      )
    }
  }
  renderRenderable() {
    const { length } = this.renderableComponents
    for (let i = 0; i < length; i++) {
      this.renderableComponents[i].renderFrame(Number(this._isFirstFrame))
    }
    /* this.maskManager.renderFrame(this.finalTransform.mat);
      this.renderableEffectsManager.renderFrame(this._isFirstFrame); */
  }

  show() {
    throw new Error(`${this.constructor.name}: Method show not implemented yet`)
  }

  sourceRectAtTime(): SourceRect | null {
    return {
      height: 100,
      left: 0,
      top: 0,
      width: 100,
    }
  }
}
