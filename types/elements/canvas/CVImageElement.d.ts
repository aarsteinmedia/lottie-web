import type { ElementInterfaceIntersect, GlobalData, LottieAsset, LottieLayer } from '../../types';
import CVBaseElement from '../../elements/canvas/CVBaseElement';
export default class CVImageElement extends CVBaseElement {
    assetData: LottieAsset | null;
    img: HTMLCanvasElement;
    initElement: (data: LottieLayer, globalData: GlobalData, comp: import("../../types").CompElementInterface) => void;
    prepareFrame: (num: number) => void;
    constructor(data: LottieLayer, globalData: GlobalData, comp: ElementInterfaceIntersect);
    createContent(): void;
    destroy(): void;
    renderInnerContent(): void;
}
