import type { SVGStyleData } from '../../../elements/helpers/shapes/SVGStyleData';
import type { ElementInterfaceIntersect, Shape } from '../../../types';
import { SVGFillStyleData } from '../../../elements/helpers/shapes/SVGFillStyleData';
import { DashProperty } from '../../../utils/shapes/properties/DashProperty';
export declare class SVGStrokeStyleData extends SVGFillStyleData {
    d?: DashProperty;
    constructor(elem: ElementInterfaceIntersect, data: Shape, styleObj: SVGStyleData);
}
