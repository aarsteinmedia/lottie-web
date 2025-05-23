import type SVGStyleData from '../../../elements/helpers/shapes/SVGStyleData';
import type { ElementInterfaceUnion, Shape, ShapeDataInterface, SVGElementInterface, Transformer, Vector3 } from '../../../types';
import type { MultiDimensionalProperty, ValueProperty } from '../../../utils/Properties';
import DynamicPropertyContainer from '../../../utils/helpers/DynamicPropertyContainer';
export default class SVGFillStyleData extends DynamicPropertyContainer {
    c?: MultiDimensionalProperty<Vector3>;
    gr?: SVGGElement;
    it: ShapeDataInterface[];
    o?: ValueProperty;
    prevViewData: SVGElementInterface[];
    style: SVGStyleData;
    transform?: Transformer;
    w?: ValueProperty;
    constructor(elem: ElementInterfaceUnion, data: Shape, styleObj: SVGStyleData);
}
