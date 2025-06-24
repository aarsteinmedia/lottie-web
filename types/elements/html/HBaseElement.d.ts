import type { ElementInterfaceIntersect } from '@/types';
import RenderableElement from '@/elements/helpers/RenderableElement';
export default class HBaseElement extends RenderableElement {
    maskedElement?: SVGGElement | HTMLElement;
    matteElement?: SVGGElement | HTMLElement;
    svgElement?: SVGSVGElement;
    transformedElement?: SVGGElement | HTMLElement;
    constructor();
    addEffects(): void;
    buildElementParenting(_element: ElementInterfaceIntersect, _parentName?: number, _hierarchy?: ElementInterfaceIntersect[]): void;
    checkBlendMode(): void;
    createContainerElements(): void;
    createRenderableComponents(): void;
    destroy(): void;
    initRendererElement(): void;
    renderElement(): void;
    renderFrame(_val?: number): void;
    renderInnerContent(): void;
    setMatte(): void;
}
