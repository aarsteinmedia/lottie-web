import type { CompElementInterface, GlobalData, LottieLayer } from '@/types';
import RenderableElement from '@/elements/helpers/RenderableElement';
export default abstract class RenderableDOMElement extends RenderableElement {
    innerElem?: SVGGraphicsElement | HTMLElement | null;
    createContainerElements(): void;
    createContent(): void;
    createRenderableComponents(): void;
    destroy(): void;
    hide(): void;
    initElement(data: LottieLayer, globalData: GlobalData, comp: CompElementInterface): void;
    initRendererElement(): void;
    prepareFrame(num: number): void;
    renderElement(): void;
    renderFrame(_val?: number): void;
    renderInnerContent(): void;
    show(): void;
}
