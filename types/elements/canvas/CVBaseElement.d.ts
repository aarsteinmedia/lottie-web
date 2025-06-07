import type GroupEffect from '../../effects/GroupEffect';
import type { TransformCanvas } from '../../types';
import CVEffects from '../../elements/canvas/CVEffects';
import CVMaskElement from '../../elements/canvas/CVMaskElement';
import RenderableElement from '../../elements/helpers/RenderableElement';
export default abstract class CVBaseElement extends RenderableElement {
    buffers: (HTMLCanvasElement | OffscreenCanvas)[];
    canvasContext?: CanvasRenderingContext2D;
    currentTransform?: DOMMatrix;
    maskManager?: CVMaskElement;
    renderableEffectsManager?: CVEffects;
    transformCanvas?: TransformCanvas;
    transformEffects: GroupEffect[];
    clearCanvas(canvasContext?: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null): void;
    createContainerElements(): void;
    createContent(): void;
    createElements(): void;
    createRenderableComponents(): void;
    destroy(): void;
    exitLayer(): void;
    hideElement(): void;
    initRendererElement(): void;
    prepareLayer(): void;
    renderFrame(forceRender?: number): void;
    renderInnerContent(): void;
    setBlendMode(): void;
    showElement(): void;
}
