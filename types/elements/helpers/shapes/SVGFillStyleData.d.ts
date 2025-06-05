import type SVGStyleData from '../../../elements/helpers/shapes/SVGStyleData';
import type { ElementInterfaceIntersect, Shape, ShapeDataInterface, SVGElementInterface, Transformer, Vector3 } from '../../../types';
import type MultiDimensionalProperty from '../../../utils/properties/MultiDimensionalProperty';
import type ValueProperty from '../../../utils/properties/ValueProperty';
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
    constructor(elem: ElementInterfaceIntersect, data: Shape, styleObj: SVGStyleData);
}
