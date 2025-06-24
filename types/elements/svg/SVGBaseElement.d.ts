import RenderableDOMElement from '@/elements/helpers/RenderableDOMElement';
export default abstract class SVGBaseElement extends RenderableDOMElement {
    _sizeChanged?: boolean;
    maskedElement?: HTMLElement | SVGGElement;
    matteElement?: SVGGElement;
    matteMasks?: {
        [key: number]: string;
    };
    transformedElement?: HTMLElement | SVGGElement;
    createContainerElements(): void;
    createRenderableComponents(): void;
    destroyBaseElement(): void;
    getBaseElement(): any;
    getMatte(matteType?: number): string;
    initRendererElement(): void;
    renderElement(): void;
    setMatte(id: string): void;
}
