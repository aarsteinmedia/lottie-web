import type { CVBaseElement } from '@/elements/canvas/CVBaseElement'
import type { CVShapeElement } from '@/elements/canvas/CVShapeElement'
import type {
  ElementInterfaceIntersect,
  LottieLayer,
  Shape,
} from '@/types'
import type { ValueProperty } from '@/utils/properties/ValueProperty'
import type { ShapeProperty } from '@/utils/shapes/properties/ShapeProperty'

import { createSizedArray } from '@/utils/helpers/arrays'
import AssetManager from '@/utils/helpers/AssetManager'
import { emitShapePath } from '@/utils/helpers/emitShapePath'
import PropertyFactory from '@/utils/PropertyFactory'
import ShapePropertyFactory from '@/utils/shapes/properties'

const modeOps: Record<string, GlobalCompositeOperation> = {
  a: 'source-over',
  d: 'source-over',
  f: 'xor',
  i: 'destination-in',
  l: 'source-over',
  s: 'destination-out',
}

/**
 * True when every active mask is add-only at full opacity with no invert —
 * safe to use a fast ctx.clip() instead of an alpha buffer.
 */
export function isSimpleMaskStack(masks: Shape[] | undefined) {
  if (!masks?.length) {
    return true
  }

  for (const mask of masks) {
    if (mask.mode === 'n') {
      continue
    }
    if (mask.mode !== 'a' || mask.inv) {
      return false
    }
    if (mask.o?.x) {
      return false
    }
    const k = mask.o?.k

    if (typeof k === 'number') {
      if (k !== 100) {
        return false
      }
    } else if (Array.isArray(k)) {
      return false
    }
  }

  return true
}

export function needsMaskIsolation(masks: Shape[] | undefined) {
  if (!masks?.length) {
    return false
  }

  for (const mask of masks) {
    if (mask.mode !== 'n') {
      return !isSimpleMaskStack(masks)
    }
  }

  return false
}

export class CVMaskElement {
  _isFirstFrame: number | boolean = false
  data: LottieLayer
  element: CVShapeElement | CVBaseElement
  hasMasks: boolean
  /** Fast clip() path — only add masks at full opacity. */
  isSimple: boolean

  masksProperties: Shape[]
  opacityData: ValueProperty[] = []
  viewData: ShapeProperty[]

  private maskBuffer: HTMLCanvasElement | OffscreenCanvas | null = null
  private pathBuffer: HTMLCanvasElement | OffscreenCanvas | null = null

  constructor(data: LottieLayer, element: CVShapeElement | CVBaseElement) {
    this.data = data
    this.element = element
    this.masksProperties = this.data.masksProperties ?? []
    this.viewData = createSizedArray(this.masksProperties.length)
    this.opacityData = createSizedArray(this.masksProperties.length)
    const { length } = this.masksProperties
    let hasMasks = false
    const elem = this.element as unknown as ElementInterfaceIntersect

    for (let i = 0; i < length; i++) {
      if (this.masksProperties[i]?.mode !== 'n') {
        hasMasks = true
      }
      this.viewData[i] = ShapePropertyFactory.getShapeProp(
        this.element as CVShapeElement,
        this.masksProperties[i],
        3
      ) as ShapeProperty
      this.opacityData[i] = PropertyFactory.getProp(
        elem,
        this.masksProperties[i]?.o,
        0,
        0.01,
        elem
      ) as ValueProperty
    }
    this.hasMasks = hasMasks
    this.isSimple = isSimpleMaskStack(this.masksProperties)
  }

  /**
   * Compose mask modes into an alpha buffer and apply with destination-in.
   * Must run while the layer is isolated on the main canvas (no prior layers)
   * and after content has been drawn under localMat.
   */
  applyMasks() {
    if (!this.hasMasks || this.isSimple) {
      return
    }
    const ctx = this.element.canvasContext

    if (!ctx) {
      return
    }
    if (!this.element.globalData?.compSize) {
      throw new Error(`${this.constructor.name}: element->globalData->compSize is not implemented`)
    }

    const { canvas } = ctx,
      { h: compH, w: compW } = this.element.globalData.compSize,
      maskCtx = this.ensureBufferCtx(
        canvas.width, canvas.height, 'mask'
      ),
      pathCtx = this.ensureBufferCtx(
        canvas.width, canvas.height, 'path'
      ),
      currentTransform = ctx.getTransform(),
      { length } = this.masksProperties

    maskCtx.setTransform(
      1, 0, 0, 1, 0, 0
    )
    maskCtx.clearRect(
      0, 0, canvas.width, canvas.height
    )
    maskCtx.setTransform(currentTransform)

    const firstMode = this.firstActiveMode()

    if (firstMode === 's' || firstMode === 'i') {
      maskCtx.globalCompositeOperation = 'source-over'
      maskCtx.fillStyle = '#ffffff'
      maskCtx.fillRect(
        0, 0, compW, compH
      )
    }

    for (let i = 0; i < length; i++) {
      const mask = this.masksProperties[i]

      if (mask.mode === 'n') {
        continue
      }

      const data = this.viewData[i]?.v

      if (!data) {
        continue
      }

      const opacity = this.opacityData[i]?.v ?? 1,
        mode = mask.mode ?? 'a',
        isInv = Boolean(mask.inv)

      pathCtx.setTransform(
        1, 0, 0, 1, 0, 0
      )
      pathCtx.clearRect(
        0, 0, canvas.width, canvas.height
      )
      pathCtx.setTransform(currentTransform)
      pathCtx.globalCompositeOperation = 'source-over'
      pathCtx.beginPath()
      if (isInv) {
        pathCtx.rect(
          0, 0, compW, compH
        )
      }
      emitShapePath(pathCtx, data)
      pathCtx.fillStyle = `rgba(255,255,255,${opacity})`
      pathCtx.fill(isInv ? 'evenodd' : 'nonzero')

      maskCtx.setTransform(
        1, 0, 0, 1, 0, 0
      )
      maskCtx.globalCompositeOperation = modeOps[mode] ?? 'source-over'
      maskCtx.drawImage(
        this.pathBuffer as CanvasImageSource, 0, 0
      )
      maskCtx.setTransform(currentTransform)
    }

    ctx.save()
    ctx.setTransform(
      1, 0, 0, 1, 0, 0
    )
    ctx.globalCompositeOperation = 'destination-in'
    ctx.drawImage(
      this.maskBuffer as CanvasImageSource, 0, 0
    )
    ctx.restore()
  }

  /**
   * Fast path: clip in layer-local space (ctx already has localMat).
   * Caller must have saved native canvas state (save(true)) so restore pops the clip.
   */
  clipLocal() {
    if (!this.hasMasks || !this.isSimple) {
      return
    }
    const ctx = this.element.canvasContext

    if (!ctx) {
      return
    }

    ctx.beginPath()
    const { length } = this.masksProperties

    for (let i = 0; i < length; i++) {
      if (this.masksProperties[i]?.mode === 'n') {
        continue
      }
      const data = this.viewData[i]?.v

      if (!data) {
        continue
      }
      emitShapePath(ctx, data)
    }
    ctx.clip()
  }

  destroy() {
    this.element = null as unknown as CVShapeElement
    this.maskBuffer = null
    this.pathBuffer = null
  }

  getMaskProperty(pos: number) {
    return this.viewData[pos]
  }

  /** Kept for RenderableComponent typing; masks apply via clipLocal/applyMasks. */
  renderFrame(_num?: number) {
    // Pass through
  }

  private ensureBufferCtx(
    width: number,
    height: number,
    which: 'mask' | 'path'
  ) {
    let buffer = which === 'mask' ? this.maskBuffer : this.pathBuffer

    // eslint-disable-next-line @typescript-eslint/prefer-optional-chain -- null check required before width/height
    if (!buffer || buffer.width !== width || buffer.height !== height) {
      buffer = AssetManager.createCanvas(width, height)
      if (which === 'mask') {
        this.maskBuffer = buffer
      } else {
        this.pathBuffer = buffer
      }
    }

    return buffer.getContext('2d') as CanvasRenderingContext2D
  }

  private firstActiveMode() {
    for (const mask of this.masksProperties) {
      if (mask.mode && mask.mode !== 'n') {
        return mask.mode
      }
    }

    return 'a'
  }
}
