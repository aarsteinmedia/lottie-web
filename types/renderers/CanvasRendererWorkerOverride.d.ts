import type { AnimationData } from '../Lottie';
import CanvasRendererOriginal from '../renderers/CanvasRenderer';
export default class CanvasRenderer extends CanvasRendererOriginal {
    configAnimation(animData: AnimationData): void;
}
