import type CVMaskElement from '@/elements/canvas/CVMaskElement'
import type ShapeGroupData from '@/elements/helpers/shapes/ShapeGroupData'
import type MaskElement from '@/elements/MaskElement'
import type {
  CompElementInterface,
  ElementInterfaceIntersect,
  // ExpressionInterface,
  GlobalData,
  LottieLayer,
  Shape,
  // SVGElementInterface,
} from '@/types'
import type CompExpressionInterface from '@/utils/expressions/CompInterface'
import type EffectsExpressionInterface from '@/utils/expressions/EffectInterface'
// import EffectsExpressionInterface from '@/utils/expressions/EffectInterface'
import type LayerExpressionInterface from '@/utils/expressions/LayerInterface'
import type ShapeExpressionInterface from '@/utils/expressions/shapes/ShapeInterface'
import type TextExpressionInterface from '@/utils/expressions/TextInterface'
import type DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer'

import EffectsManager from '@/effects/EffectsManager'
import { createElementID } from '@/utils'
import { getExpressionInterfaces } from '@/utils/expressions'
import getBlendMode from '@/utils/helpers/getBlendMode'

export default abstract class BaseElement {
  baseElement?: HTMLElement | SVGGElement
  comp?: CompElementInterface
  compInterface?: CompExpressionInterface
  data?: LottieLayer
  dynamicProperties: DynamicPropertyContainer[] = []
  effectsManager?: EffectsManager
  frameDuration = 1
  globalData?: GlobalData
  itemsData: ShapeGroupData[] = []
  layerElement?: SVGGElement | HTMLElement
  layerId?: string
  layerInterface?: null | LayerExpressionInterface = null
  maskManager?: MaskElement | CVMaskElement
  shapesData: Shape[] = []
  type?: unknown

  buildAllItems() {
    throw new Error(`${this.constructor.name}: Method buildAllItems is not implemented`)
  }

  checkLayers(_frame?: number) {
    throw new Error(`${this.constructor.name}: Method checkLayers is not implemented`)
  }

  checkMasks() {
    if (!this.data) {
      throw new Error(`${this.constructor.name}: data (LottieLayer) is not initialized`)
    }
    if (!this.data.hasMask) {
      return false
    }
    let i = 0
    const { length } = this.data.masksProperties ?? []

    while (i < length) {
      if (
        this.data.masksProperties?.[i]?.mode !== 'n' &&
        this.data.masksProperties?.[i]?.cl !== (false as unknown as string)
      ) {
        return true
      }
      i++
    }

    return false
  }

  destroy() {
    /**
     * If method is not implemented, it probably shouldn't throw an error
     * Pass through.
     */
  }

  destroyBaseElement() {
    throw new Error(`${this.constructor.name}: Method destroyBaseElement is not implemented`)
  }

  getBaseElement(): SVGElement | HTMLElement | null {
    throw new Error(`${this.constructor.name}: Method getBaseElement is not implemented`)
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
      this as unknown as ElementInterfaceIntersect,
      this.dynamicProperties
    )
  }

  initExpressions() {
    try {
      if (!this.data) {
        throw new Error(`${this.constructor.name}: data (LottieLayer) is not implemented`)
      }
      const expressionsInterfaces = getExpressionInterfaces()

      if (!expressionsInterfaces) {
        return
      }
      const layerExpressionInterface = expressionsInterfaces('layer') as typeof LayerExpressionInterface,
        effectsExpressionInterface = expressionsInterfaces('effects') as typeof EffectsExpressionInterface,
        shapeExpressionInterface = expressionsInterfaces('shape') as typeof ShapeExpressionInterface,
        textExpressionInterface = expressionsInterfaces('text') as typeof TextExpressionInterface,
        compExpressionInterface = expressionsInterfaces('comp') as typeof CompExpressionInterface

      this.layerInterface = new layerExpressionInterface(this as unknown as ElementInterfaceIntersect)

      // if (!this.layerInterface) {
      //   throw new Error(`${this.constructor.name}: Could not set layerInterface`)
      // }

      if (this.data.hasMask && this.maskManager) {
        this.layerInterface.registerMaskInterface(this.maskManager)
      }
      const effectsInterface = new effectsExpressionInterface().createEffectsInterface(this, this.layerInterface)

      this.layerInterface.registerEffectsInterface(effectsInterface)

      if (this.data.ty === 0 || this.data.xt) {
        this.compInterface = new compExpressionInterface(this as unknown as ElementInterfaceIntersect)

        return
      }
      if (this.data.ty === 4) {
        this.layerInterface.shapeInterface = new shapeExpressionInterface(
          this.shapesData,
          this.itemsData as unknown as ShapeGroupData,
          this.layerInterface
        )
        this.layerInterface.content = this.layerInterface.shapeInterface

        return
      }
      if (this.data.ty === 5) {
        this.layerInterface.textInterface = new textExpressionInterface(this as unknown as ElementInterfaceIntersect)
        this.layerInterface.text = this.layerInterface.textInterface
      }
    } catch (error) {
      console.error(this.constructor.name, error)
    }
  }

  setBlendMode() {
    if (!this.data) {
      throw new Error(`${this.constructor.name}: data (LottieLayer) is not implemented`)
    }
    const blendModeValue = getBlendMode(this.data.bm),
      elem = this.baseElement ?? this.layerElement

    if (!elem) {
      throw new Error(`${this.constructor.name}: Both baseElement and layerElement are not implemented`)
    }
    elem.style.mixBlendMode = blendModeValue
  }

  sourceRectAtTime() {
    throw new Error(`${this.constructor.name}: Method sourceRectAtTime is not implemented`)
  }
}