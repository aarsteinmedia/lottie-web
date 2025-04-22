import type { CompElementInterface, ElementInterfaceIntersect, GlobalData, LottieLayer } from '../types';
import RenderableDOMElement from '../elements/helpers/RenderableDOMElement';
import { ValueProperty } from '../utils/Properties';
export default class CompElement extends RenderableDOMElement {
    completeLayers?: boolean;
    currentFrame: number;
    elements: ElementInterfaceIntersect[];
    layers: LottieLayer[];
    renderedFrame?: number;
    tm?: ValueProperty;
    buildAllItems(): void;
    destroy(): void;
    destroyElements(): void;
    getElements(): ElementInterfaceIntersect[] | undefined;
    initElement(data: LottieLayer, globalData: GlobalData, comp: CompElementInterface): void;
    prepareFrame(val: number): void;
    renderInnerContent(): void;
    setElements(elems: ElementInterfaceIntersect[]): void;
}
