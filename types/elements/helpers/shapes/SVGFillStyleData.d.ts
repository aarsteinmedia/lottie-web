import type { SVGStyleData } from '../../../elements/helpers/shapes/SVGStyleData';
import type { ElementInterfaceIntersect, Shape, ShapeDataInterface, SVGElementInterface, Transformer, Vector3 } from '../../../types';
import type { MultiDimensionalProperty } from '../../../utils/properties/MultiDimensionalProperty';
import type { ValueProperty } from '../../../utils/properties/ValueProperty';
import { DynamicPropertyContainer } from '../../../utils/helpers/DynamicPropertyContainer';
export declare class SVGFillStyleData extends DynamicPropertyContainer {
    c?: undefined | MultiDimensionalProperty<Vector3>;
    gr?: undefined | SVGGElement;
    it: ShapeDataInterface[];
    o?: undefined | ValueProperty;
    prevViewData: SVGElementInterface[];
    style: SVGStyleData;
    transform?: undefined | Transformer;
    w?: undefined | ValueProperty;
    constructor(elem: ElementInterfaceIntersect, data: Shape, styleObj: SVGStyleData);
}
