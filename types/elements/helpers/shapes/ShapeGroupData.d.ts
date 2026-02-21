import type { ShapeDataInterface, SVGElementInterface, Transformer } from '../../../types';
export declare class ShapeGroupData {
    _shouldRender?: boolean;
    closed?: boolean;
    gr: SVGGElement;
    it: ShapeDataInterface[];
    prevViewData: SVGElementInterface[];
    transform?: Transformer;
    constructor();
}
