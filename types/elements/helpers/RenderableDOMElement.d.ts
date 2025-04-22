import type { CompElementInterface, ElementInterfaceIntersect, ElementInterfaceUnion, GlobalData, LottieLayer } from '../../types';
import RenderableElement from '../../elements/helpers/RenderableElement';
export default abstract class RenderableDOMElement extends RenderableElement {
    innerElem?: SVGGraphicsElement | HTMLElement | null;
    constructor();
    addPendingElement(_element: ElementInterfaceIntersect): void;
    createContainerElements(): void;
    createContent(): void;
    createItem(_data: LottieLayer): ElementInterfaceUnion;
    createRenderableComponents(): void;
    destroy(): void;
    destroyBaseElement(): void;
    hide(): void;
    initElement(data: LottieLayer, globalData: GlobalData, comp: CompElementInterface): void;
    initRendererElement(): void;
    prepareFrame(num: number): void;
    renderElement(): void;
    renderFrame(_frame?: number | boolean | null): void;
    renderInnerContent(): void;
    show(): void;
}
