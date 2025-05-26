import type {
  RenderableComponent,
  SourceRect,
  SVGRendererConfig,
} from '@/types'

import FrameElement from '@/elements/helpers/FrameElement'

export default abstract class RenderableElement extends FrameElement {
  hidden?: boolean
  isInRange?: boolean
  isTransparent?: boolean
  renderableComponents: RenderableComponent[] = []

  addRenderableComponent(component: RenderableComponent) {
    if (!this.renderableComponents.includes(component)) {
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

  checkTransparency() {
    if (!this.finalTransform) {
      throw new Error(`${this.constructor.name}: finalTransform is not implemented`)
    }
    if (Number(this.finalTransform.mProp.o?.v) <= 0) {
      if (
        !this.isTransparent &&
        (this.globalData?.renderConfig as SVGRendererConfig).hideOnTransparent
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
      throw new Error(`${this.constructor.name}: data (LottieLayer) is not implemented`)
    }
    if (this.data.ty === 5) {
      return {
        h: Number(this.data.textData?.height),
        w: Number(this.data.textData?.width),
      }
    }

    return {
      h: Number(this.data.height),
      w: Number(this.data.width)
    }
  }

  hide() {
    // Pass through? TODO:
    // throw new Error(`${this.constructor.name}: Method hide is not implemented`)
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

  removeRenderableComponent(component: RenderableComponent) {
    if (this.renderableComponents.includes(component)) {
      this.renderableComponents.splice(this.renderableComponents.indexOf(component),
        1)
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
    throw new Error(`${this.constructor.name}: Method show is not implemented`)
  }

  override sourceRectAtTime(): SourceRect | null {
    return {
      height: 100,
      left: 0,
      top: 0,
      width: 100,
    }
  }
}
