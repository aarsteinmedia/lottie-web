import type { VectorProperty, Shape, ShapeDataInterface, SVGElementInterface, Transformer } from '../../../types';
import type { ShapeType } from '../../../utils/enums';
export declare class SVGStyleData {
    _mdf: boolean;
    closed: boolean;
    coOp?: number;
    d: string;
    data: Shape;
    finalTransform?: Transformer;
    gr?: SVGGElement;
    grd?: CanvasGradient;
    hd?: boolean;
    it?: ShapeDataInterface[];
    lvl: number;
    msElem: null | SVGMaskElement | SVGPathElement;
    pElem: SVGPathElement;
    prevViewData?: SVGElementInterface[];
    pt?: VectorProperty;
    style?: SVGStyleData;
    t?: number;
    transform?: Transformer;
    ty?: ShapeType;
    type?: ShapeType;
    constructor(data: Shape, level: number);
    reset(): void;
}
