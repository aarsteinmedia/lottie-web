import type { GroupEffect } from '../../effects/EffectsManager';
import type { ElementInterfaceIntersect, GlobalData, LottieLayer, TransformCanvas, Transformer } from '../../types';
import CVEffects from '../../elements/canvas/CVEffects';
import CVMaskElement from '../../elements/canvas/CVMaskElement';
import Matrix from '../../utils/Matrix';
export default class CVBaseElement {
    _isFirstFrame?: boolean;
    buffers: (HTMLCanvasElement | OffscreenCanvas)[];
    canvasContext?: CanvasRenderingContext2D;
    comp?: ElementInterfaceIntersect;
    currentTransform?: DOMMatrix;
    data?: LottieLayer;
    finalTransform?: Transformer;
    globalData?: GlobalData;
    hidden?: boolean;
    isInRange?: boolean;
    isTransparent?: boolean;
    maskManager?: CVMaskElement;
    mHelper: Matrix;
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
    renderLocalTransform(): void;
    renderRenderable(): void;
    renderTransform(): void;
    searchEffectTransforms(): void;
    setBlendMode(): void;
    showElement(): void;
}
