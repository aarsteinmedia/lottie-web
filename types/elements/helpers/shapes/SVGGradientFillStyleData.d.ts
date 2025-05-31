import type SVGStyleData from '../../../elements/helpers/shapes/SVGStyleData';
import type { ElementInterfaceIntersect, Shape, ShapeDataInterface, SVGElementInterface, Transformer } from '../../../types';
import type { KeyframedValueProperty, MultiDimensionalProperty, ValueProperty } from '../../../utils/Properties';
import DynamicPropertyContainer from '../../../utils/helpers/DynamicPropertyContainer';
import GradientProperty from '../../../utils/shapes/GradientProperty';
export default class SVGGradientFillStyleData extends DynamicPropertyContainer {
    a?: MultiDimensionalProperty;
    cst: SVGStopElement[];
    e?: MultiDimensionalProperty;
    g?: GradientProperty;
    gf?: SVGGradientElement;
    gr?: SVGGElement;
    h?: KeyframedValueProperty;
    it: ShapeDataInterface[];
    maskId?: string;
    ms?: SVGMaskElement;
    o?: ValueProperty;
    of?: SVGElement;
    ost: SVGStopElement[];
    prevViewData: SVGElementInterface[];
    s?: MultiDimensionalProperty;
    stops: SVGStopElement[];
    style?: SVGStyleData;
    transform?: Transformer;
    constructor(elem: ElementInterfaceIntersect, data: Shape, styleData: SVGStyleData);
    initGradientData(elem: ElementInterfaceIntersect, data: Shape, styleData: SVGStyleData): void;
    setGradientData(pathElement: SVGElement, data: Shape): void;
    setGradientOpacity(data: Shape, styleData: SVGStyleData): void;
}
