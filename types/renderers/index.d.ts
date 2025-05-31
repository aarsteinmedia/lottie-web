import type CanvasRenderer from '@/renderers/CanvasRenderer';
import type HybridRenderer from '@/renderers/HybridRenderer';
import type SVGRenderer from '@/renderers/SVGRenderer';
import { RendererType } from '@/utils/enums';
type Renderer = typeof SVGRenderer | typeof CanvasRenderer | typeof HybridRenderer;
export declare const registerRenderer: (key: RendererType, value: Renderer) => void, getRenderer: (key: RendererType) => Renderer, getRegisteredRenderer: () => RendererType;
export {};
