import type { ElementInterfaceIntersect, GlobalData, LottieLayer } from '../../types';
import RenderableElement from '../../elements/helpers/RenderableElement';
export default abstract class RenderableDOMElement extends RenderableElement {
    innerElem?: SVGElement | null;
    constructor();
    addPendingElement(_element: ElementInterfaceIntersect): void;
    createContainerElements(): void;
    createContent(): void;
    createItem(_data: LottieLayer): void;
    createRenderableComponents(): void;
    destroy(): void;
    destroyBaseElement(): void;
    hide(): void;
    initElement(data: LottieLayer, globalData: GlobalData, comp: ElementInterfaceIntersect): void;
    initRendererElement(): void;
    prepareFrame(num: number): void;
    renderElement(): void;
    renderFrame(_frame?: number | null): void;
    renderInnerContent(): void;
    show(): void;
}
