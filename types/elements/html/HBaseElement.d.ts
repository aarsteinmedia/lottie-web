import type { ElementInterfaceIntersect, GlobalData, LottieLayer, Transformer } from '../../types';
import CVEffects from '../../elements/canvas/CVEffects';
import MaskElement from '../../elements/MaskElement';
export default class HBaseElement {
    _isFirstFrame?: boolean;
    baseElement?: SVGGElement | HTMLElement;
    data?: LottieLayer;
    finalTransform?: Transformer;
    globalData?: GlobalData;
    hidden?: boolean;
    layerElement?: SVGGElement | HTMLElement;
    maskedElement?: SVGGElement | HTMLElement;
    maskManager?: MaskElement;
    matteElement?: SVGGElement | HTMLElement;
    renderableEffectsManager?: CVEffects;
    svgElement?: SVGSVGElement;
    transformedElement?: SVGGElement | HTMLElement;
    constructor();
    addEffects(): void;
    buildElementParenting(_element: ElementInterfaceIntersect, _parentName?: number, _hierarchy?: ElementInterfaceIntersect[]): void;
    checkBlendMode(): void;
    createContainerElements(): void;
    createRenderableComponents(): void;
    destroy(): void;
    destroyBaseElement(): void;
    getBaseElement(): null | HTMLElement | SVGGElement;
    initRendererElement(): void;
    renderElement(): void;
    renderFrame(_val?: number): void;
    renderInnerContent(): void;
    renderRenderable(): void;
    renderTransform(): void;
    setBlendMode(): void;
    setMatte(): void;
}
