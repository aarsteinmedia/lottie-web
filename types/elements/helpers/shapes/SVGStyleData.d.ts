import type { ShapeType } from '../../../enums';
import type { AnimatedProperty, Shape, ShapeDataInterface, SVGElementInterface, Transformer } from '../../../types';
export default class SVGStyleData {
    _mdf: boolean;
    closed: boolean;
    d: string;
    data: Shape;
    gr?: SVGGElement;
    hd?: boolean;
    it?: ShapeDataInterface[];
    lvl: number;
    msElem: null | SVGMaskElement | SVGPathElement;
    pElem: SVGPathElement;
    prevViewData?: SVGElementInterface[];
    pt?: AnimatedProperty;
    style?: SVGStyleData;
    t?: number;
    transform?: Transformer;
    ty?: ShapeType;
    type?: ShapeType;
    constructor(data: Shape, level: number);
    reset(): void;
}
