import type { CanvasRenderer } from '@/renderers/CanvasRenderer';
import type { HybridRenderer } from '@/renderers/HybridRenderer';
import type { SVGRenderer } from '@/renderers/SVGRenderer';

import { RendererType } from '@/utils/enums';

type Renderer =
  | typeof SVGRenderer
  | typeof CanvasRenderer
  | typeof HybridRenderer;
const renderers: {
  [key in RendererType]?: Renderer
} = {};

export const registerRenderer = (key: RendererType, value: Renderer) => {
  renderers[key] = value;
};
export const getRenderer = (key: RendererType) => {
  if (!renderers[key]) {
    throw new Error('Could not get renderer');
  }

  return renderers[key];
};
export const getRegisteredRenderer = () => {
  // Returns canvas by default for compatibility
  if (renderers.canvas) {
    return RendererType.Canvas;
  }
  // Returns any renderer that is registered

  const keys = Object.keys(renderers);
  const { length } = keys;

  for (let i = 0; i < length; i++) {
    if (renderers[keys[i] as RendererType]) {
      return keys[i] as RendererType;
    }
  }

  return RendererType.SVG;
};