import type SVGStyleData from '../../../elements/helpers/shapes/SVGStyleData';
import type { ElementInterfaceUnion, Shape } from '../../../types';
import SVGFillStyleData from '../../../elements/helpers/shapes/SVGFillStyleData';
import DashProperty from '../../../utils/shapes/DashProperty';
export default class SVGStrokeStyleData extends SVGFillStyleData {
    d?: DashProperty;
    constructor(elem: ElementInterfaceUnion, data: Shape, styleObj: SVGStyleData);
}
