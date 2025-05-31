import type MaskElement from '../../elements/MaskElement';
import type { ElementInterfaceIntersect, Shape, ViewData } from '../../types';
declare class MaskInterface {
    _data: Shape;
    _mask: ViewData;
    get maskOpacity(): number;
    get maskPath(): import("../shapes/ShapeProperty").ShapeProperty | import("../shapes/ShapeProperty").KeyframedShapeProperty | import("../shapes/ShapeProperty").RectShapeProperty | import("../shapes/ShapeProperty").EllShapeProperty | import("../shapes/ShapeProperty").StarShapeProperty | null;
    constructor(mask: ViewData, data: Shape);
}
export default class MaskManagerInterface {
    _masksInterfaces: MaskInterface[];
    maskManager: MaskElement;
    constructor(maskManager: MaskElement, _elem?: ElementInterfaceIntersect);
    getInterface(name: string): MaskInterface | null;
}
export {};
