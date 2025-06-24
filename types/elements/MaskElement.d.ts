import type { ElementInterfaceIntersect, GlobalData, LottieLayer, Shape, StoredData, ViewData } from '@/types';
import type ShapePath from '@/utils/shapes/ShapePath';
export default class MaskElement {
    data: LottieLayer;
    element: ElementInterfaceIntersect;
    globalData: GlobalData;
    maskElement: SVGElement | null;
    masksProperties: Shape[];
    solidPath: string;
    storedData: StoredData[];
    viewData: ViewData[];
    constructor(data: LottieLayer, element: ElementInterfaceIntersect, globalData: GlobalData);
    createLayerSolidPath(): string;
    destroy(): void;
    drawPath(pathData: null | Shape, pathNodes: ShapePath, viewData: ViewData): void;
    getMaskelement(): SVGElement | null;
    getMaskProperty(pos: number): any;
    renderFrame(frame?: number | null): void;
}
