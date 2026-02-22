import type { VectorProperty, Shape, ShapeDataInterface, SVGElementInterface, Transformer } from '../../../types';
import type { ShapeType } from '../../../utils/enums';
export declare class SVGStyleData {
    _mdf: boolean;
    closed: boolean;
    coOp?: undefined | number;
    d: string;
    data: Shape;
    finalTransform?: undefined | Transformer;
    gr?: undefined | SVGGElement;
    grd?: undefined | CanvasGradient;
    hd?: undefined | boolean;
    it?: undefined | ShapeDataInterface[];
    lvl: number;
    msElem: null | SVGMaskElement | SVGPathElement;
    pElem: SVGPathElement;
    prevViewData?: undefined | SVGElementInterface[];
    pt?: undefined | VectorProperty;
    style?: undefined | SVGStyleData;
    t?: undefined | number;
    transform?: undefined | Transformer;
    ty?: undefined | ShapeType;
    type?: undefined | ShapeType;
    constructor(data: Shape, level: number);
    reset(): void;
}
