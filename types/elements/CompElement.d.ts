import type { CompElementInterface, ElementInterfaceIntersect, GlobalData, LottieLayer } from '@/types';
import type ValueProperty from '@/utils/properties/ValueProperty';
import RenderableDOMElement from '@/elements/helpers/RenderableDOMElement';
export default abstract class CompElement extends RenderableDOMElement {
    completeLayers?: boolean;
    currentFrame: number;
    elements: ElementInterfaceIntersect[];
    layers: LottieLayer[];
    renderedFrame?: number;
    tm?: ValueProperty;
    destroy(): void;
    destroyElements(): void;
    getElements(): ElementInterfaceIntersect[] | undefined;
    initElement(data: LottieLayer, globalData: GlobalData, comp: CompElementInterface): void;
    prepareFrame(val: number): void;
    renderInnerContent(): void;
    setElements(elems: ElementInterfaceIntersect[]): void;
}
