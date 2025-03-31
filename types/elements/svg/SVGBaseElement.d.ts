import RenderableDOMElement from '../../elements/helpers/RenderableDOMElement';
export default class SVGBaseElement extends RenderableDOMElement {
    _sizeChanged?: boolean;
    maskedElement?: SVGGElement;
    matteElement?: SVGGElement;
    matteMasks?: {
        [key: number]: string;
    };
    transformedElement?: SVGGElement;
    createContainerElements(): void;
    createRenderableComponents(): void;
    destroyBaseElement(): void;
    getBaseElement(): SVGGElement | null;
    getMatte(matteType?: number): string;
    initRendererElement(): void;
    renderElement(): void;
    setMatte(id: string): void;
}
