import type MaskElement from '@/elements/MaskElement'
import type {
  CompElementInterface,
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
  Shape,
  // SVGElementInterface,
} from '@/types'
import type CompExpressionInterface from '@/utils/expressions/CompInterface'

import EffectsManager from '@/effects/EffectsManager'
import { getBlendMode } from '@/utils'
import LayerExpressionInterface from '@/utils/expressions/LayerInterface'
import { createElementID, getExpressionInterfaces } from '@/utils/getterSetter'

export default abstract class BaseElement {
  baseElement?: HTMLElement | SVGGElement
  comp?: CompElementInterface
  compInterface?: CompExpressionInterface
  data?: LottieLayer
  effectsManager?: EffectsManager
  globalData?: GlobalData
  itemsData: ElementInterfaceIntersect[] = []
  layerElement?: SVGGElement | HTMLElement
  layerId?: string
  layerInterface?: LayerExpressionInterface
  maskManager?: MaskElement
  shapesData: Shape[] = []
  type?: unknown
  checkMasks() {
    if (!this.data) {
      throw new Error(
        `${this.constructor.name}: data (LottieLayer) is not initialized`
      )
    }
    if (!this.data.hasMask) {
      return false
    }
    let i = 0
    const { length } = this.data.masksProperties || []
    while (i < length) {
      if (
        this.data.masksProperties?.[i].mode !== 'n' &&
        this.data.masksProperties?.[i].cl !== (false as unknown as string)
      ) {
        return true
      }
      i++
    }
    return false
  }
  getType() {
    return this.type
  }
  initBaseData(
    data: LottieLayer,
    globalData: GlobalData,
    comp: CompElementInterface
  ) {
    this.globalData = globalData
    this.comp = comp
    this.data = data
    this.layerId = createElementID()

    // Stretch factor for old animations missing this property.
    if (!this.data.sr) {
      this.data.sr = 1
    }
    this.effectsManager = new EffectsManager(
      this.data,
      this as unknown as ElementInterfaceIntersect
      // this.dynamicProperties
    )
  }
  initExpressions() {
    if (!this.data) {
      throw new Error(
        `${this.constructor.name}: data (LottieLayer) is not implemented`
      )
    }
    const ExpressionsInterfaces = getExpressionInterfaces()
    if (!ExpressionsInterfaces) {
      return
    }
    const LayerExpressionInterface = new ExpressionsInterfaces('layer'),
      EffectsExpressionInterface = new ExpressionsInterfaces('effects'),
      ShapeExpressionInterface = new ExpressionsInterfaces('shape'),
      TextExpressionInterface = new ExpressionsInterfaces('text'),
      CompExpressionInterface = new ExpressionsInterfaces('comp')
    this.layerInterface = (LayerExpressionInterface as any)(this) // TODO:
    if (this.data.hasMask && this.maskManager) {
      this.layerInterface?.registerMaskInterface?.(this.maskManager)
    }
    const effectsInterface =
      EffectsExpressionInterface.createEffectsInterface?.(
        this,
        this.layerInterface
      )
    this.layerInterface?.registerEffectsInterface?.(effectsInterface)

    if (this.data.ty === 0 || this.data.xt) {
      this.compInterface = (CompExpressionInterface as any)(this)
      return
    }
    if (this.data.ty === 4) {
      this.layerInterface!.shapeInterface = (ShapeExpressionInterface as any)(
        this.shapesData,
        this.itemsData,
        this.layerInterface
      )
      this.layerInterface!.content = this.layerInterface?.shapeInterface
      return
    }
    if (this.data.ty === 5) {
      this.layerInterface!.textInterface = (TextExpressionInterface as any)(
        this
      )
      this.layerInterface!.text = this.layerInterface?.textInterface
    }
  }
  setBlendMode() {
    if (!this.data) {
      throw new Error(
        `${this.constructor.name}: data (LottieLayer) is not implemented`
      )
    }
    const blendModeValue = getBlendMode(this.data.bm),
      elem = this.baseElement || this.layerElement

    if (!elem) {
      throw new Error(
        `${this.constructor.name}: Both baseElement and layerElement are not implemented`
      )
    }
    elem.style.mixBlendMode = blendModeValue
  }
}
