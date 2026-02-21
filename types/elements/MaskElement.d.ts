import type { ElementInterfaceIntersect, GlobalData, LottieLayer, Shape, StoredData, ViewData } from '../types';
import type { ShapePath } from '../utils/shapes/ShapePath';
export declare class MaskElement {
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
    getMaskProperty(pos: number): import("../utils/shapes/properties/ShapeProperty").ShapeProperty | import("../utils/shapes/properties/ShapeProperty").KeyframedShapeProperty | import("../utils/shapes/properties/RectShapeProperty").RectShapeProperty | import("../utils/shapes/properties/EllShapeProperty").EllShapeProperty | import("../utils/shapes/properties/StarShapeProperty").StarShapeProperty | null;
    renderFrame(frame?: number | null): void;
}
