import type { ShapeDataInterface, SVGElementInterface, Transformer } from '@/types';
export default class ShapeGroupData {
    _render?: boolean;
    closed?: boolean;
    gr: SVGGElement;
    it: ShapeDataInterface[];
    prevViewData: SVGElementInterface[];
    transform?: Transformer;
    constructor();
}
