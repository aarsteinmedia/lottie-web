import type { ElementInterfaceIntersect, GlobalData, LottieLayer } from '../../types';
import { HSolidElement } from '../../elements/html/HSolidElement';
export declare class HImageElement extends HSolidElement {
    imageElem?: SVGImageElement;
    constructor(data: LottieLayer, globalData: GlobalData, comp: ElementInterfaceIntersect);
    createContent(): void;
}
