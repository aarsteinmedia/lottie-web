import type { AnimationData } from '../types';
import CanvasRendererOriginal from '../renderers/CanvasRenderer';
export default class CanvasRenderer extends CanvasRendererOriginal {
    configAnimation(animData: AnimationData): void;
}
