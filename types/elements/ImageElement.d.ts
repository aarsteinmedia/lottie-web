import type { ElementInterfaceIntersect, GlobalData, LottieAsset, LottieLayer, SourceRect } from '../types';
import { SVGBaseElement } from '../elements/svg/SVGBaseElement';
export declare class ImageElement extends SVGBaseElement {
    assetData?: undefined | LottieAsset | null;
    layers: LottieLayer[];
    sourceRect: SourceRect | null;
    constructor(data: LottieLayer, globalData: GlobalData, comp: ElementInterfaceIntersect);
    createContent(): void;
    renderInnerContent(): void;
    sourceRectAtTime(): SourceRect | null;
}
