import type { ElementInterfaceIntersect, GlobalData, LottieAsset, LottieLayer, SourceRect } from '../types';
import SVGBaseElement from '../elements/svg/SVGBaseElement';
export default class ImageElement extends SVGBaseElement {
    assetData?: LottieAsset | null;
    layers: LottieLayer[];
    sourceRect: SourceRect | null;
    constructor(data: LottieLayer, globalData: GlobalData, comp: ElementInterfaceIntersect);
    createContent(): void;
    sourceRectAtTime(): SourceRect | null;
}
