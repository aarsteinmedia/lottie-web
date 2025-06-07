import type { ElementInterfaceIntersect, GlobalData, LottieAsset, LottieLayer } from '@/types';
import HSolidElement from '@/elements/html/HSolidElement';
export default class HImageElement extends HSolidElement {
    assetData: null | LottieAsset;
    imageElem?: SVGImageElement;
    constructor(data: LottieLayer, globalData: GlobalData, comp: ElementInterfaceIntersect);
    createContent(): void;
}
