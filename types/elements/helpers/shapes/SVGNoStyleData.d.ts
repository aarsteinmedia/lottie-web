import type SVGShapeData from '@/elements/helpers/shapes/SVGShapeData';
import type SVGStyleData from '@/elements/helpers/shapes/SVGStyleData';
import type { ElementInterfaceUnion, ShapeDataInterface, SVGElementInterface, Transformer } from '@/types';
import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer';
export default class SVGNoStyleData extends DynamicPropertyContainer {
    gr?: SVGGElement;
    it: ShapeDataInterface[];
    prevViewData: SVGElementInterface[];
    style: SVGStyleData;
    transform?: Transformer;
    constructor(elem: ElementInterfaceUnion, _data: SVGShapeData, styleObj: SVGStyleData);
}
