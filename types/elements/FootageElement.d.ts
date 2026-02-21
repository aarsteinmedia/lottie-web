import type { ElementInterfaceIntersect, GlobalData, LottieAsset, LottieLayer } from '../types';
import { RenderableElement } from '../elements/helpers/RenderableElement';
export declare class FootageElement extends RenderableElement {
    assetData: null | LottieAsset;
    footageData: null | SVGElement;
    constructor(data: LottieLayer, globalData: GlobalData, comp: ElementInterfaceIntersect);
    getBaseElement(): null;
    getFootageData(): SVGElement | null;
    initExpressions(): void;
    prepareFrame(): void;
    renderFrame(): void;
}
