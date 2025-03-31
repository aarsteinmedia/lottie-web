import type { ElementInterfaceIntersect, GlobalData, LottieAsset, LottieLayer } from '../types';
import RenderableElement from '../elements/helpers/RenderableElement';
export default class FootageElement extends RenderableElement {
    assetData: null | LottieAsset;
    footageData: SVGElement;
    constructor(data: LottieLayer, globalData: GlobalData, comp: ElementInterfaceIntersect);
    getBaseElement(): SVGGElement | null;
    getFootageData(): SVGElement;
    initExpressions(): void;
    setMatte(_id: string): void;
}
