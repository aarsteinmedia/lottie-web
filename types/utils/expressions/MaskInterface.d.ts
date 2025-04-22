import type { Shape, ViewData } from '../../types';
import MaskElement from '../../elements/MaskElement';
export declare class MaskInterface {
    _data: Shape;
    _mask: ViewData;
    constructor(mask: ViewData, data: Shape);
    maskOpacity(): number;
    maskPath(): import("../shapes/ShapeProperty").ShapeProperty | import("../shapes/ShapeProperty").KeyframedShapeProperty | import("../shapes/ShapeProperty").RectShapeProperty | import("../shapes/ShapeProperty").EllShapeProperty | import("../shapes/ShapeProperty").StarShapeProperty | null;
}
export default class MaskManager {
    private _maskManager;
    private _masksInterfaces;
    constructor(maskManager: MaskElement);
    getMaskInterface(name: string): MaskInterface | null;
}
