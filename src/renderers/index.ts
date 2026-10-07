import type { CanvasRenderer } from '@/renderers/CanvasRenderer'
import type { SVGRenderer } from '@/renderers/SVGRenderer'

import { RendererType } from '@/utils/enums'

export type Renderer =
  | typeof SVGRenderer
  | typeof CanvasRenderer
const renderers: {
  [key in RendererType]?: Renderer
} = {}

export const registerRenderer = (key: RendererType, value: Renderer) => {
    renderers[key] = value
  },
  getRegisteredRenderer = () => {
    // Returns canvas by default for compatibility
    if (renderers.canvas) {
      return RendererType.Canvas
    }
    // Returns any renderer that is registered

    const keys = Object.keys(renderers),
      { length } = keys

    for (let i = 0; i < length; i++) {
      if (renderers[keys[i] as unknown as RendererType]) {
        return keys[i] as unknown as RendererType
      }
    }

    return RendererType.SVG
  },
  getRenderer = (type: RendererType) => {
    const Renderer = renderers[type]

    if (!Renderer) {
      throw new Error(`Unknown renderer type: ${type as string}`)
    }

    return Renderer
  }