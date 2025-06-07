import type SVGStyleData from '../../../elements/helpers/shapes/SVGStyleData';
import type { ElementInterfaceIntersect, ShapeDataInterface, SVGElementInterface, Transformer } from '../../../types';
import type ValueProperty from '../../../utils/properties/ValueProperty';
import type { TransformProperty } from '../../../utils/TransformProperty';
export default class SVGTransformData {
    _isAnimated: boolean;
    elements: ElementInterfaceIntersect[];
    gr?: SVGGElement;
    it?: ShapeDataInterface[];
    prevViewData?: SVGElementInterface[];
    style?: SVGStyleData;
    transform: Transformer;
    constructor(mProps: TransformProperty, op: ValueProperty, container: SVGGElement);
}
