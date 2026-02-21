import type { CVMaskElement } from '../../elements/canvas/CVMaskElement';
import type { MaskElement } from '../../elements/MaskElement';
import type { ElementInterfaceIntersect, Shape, ViewData } from '../../types';
declare class MaskInterface {
    _data: Shape;
    _mask: ViewData;
    get maskOpacity(): number;
    get maskPath(): import("../shapes/properties/ShapeProperty").ShapeProperty | import("../shapes/properties/ShapeProperty").KeyframedShapeProperty | import("../shapes/properties/RectShapeProperty").RectShapeProperty | import("../shapes/properties/EllShapeProperty").EllShapeProperty | import("../shapes/properties/StarShapeProperty").StarShapeProperty | null;
    constructor(mask: ViewData, data: Shape);
}
export declare class MaskManagerInterface {
    _masksInterfaces: MaskInterface[];
    maskManager: MaskElement | CVMaskElement;
    constructor(maskManager: MaskElement | CVMaskElement, _elem?: ElementInterfaceIntersect);
    getInterface(name: string): MaskInterface | null | undefined;
}
export {};
