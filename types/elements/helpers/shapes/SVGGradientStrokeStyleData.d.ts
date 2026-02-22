import type { SVGStyleData } from '../../../elements/helpers/shapes/SVGStyleData';
import type { ElementInterfaceIntersect, Shape, Vector3 } from '../../../types';
import type { MultiDimensionalProperty } from '../../../utils/properties/MultiDimensionalProperty';
import type { ValueProperty } from '../../../utils/properties/ValueProperty';
import { SVGGradientFillStyleData } from '../../../elements/helpers/shapes/SVGGradientFillStyleData';
import { DashProperty } from '../../../utils/shapes/properties/DashProperty';
export declare class SVGGradientStrokeStyleData extends SVGGradientFillStyleData {
    c?: undefined | MultiDimensionalProperty<Vector3>;
    d: DashProperty;
    w?: undefined | ValueProperty;
    constructor(elem: ElementInterfaceIntersect, data: Shape, styleData: SVGStyleData);
}
