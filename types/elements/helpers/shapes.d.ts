import type { KeyframedValueProperty, MultiDimensionalProperty, ValueProperty } from '../../utils/Properties';
import type { ShapeProperty } from '../../utils/shapes/ShapeProperty';
import { ShapeType } from '../../enums';
import { AnimatedProperty, ElementInterfaceIntersect, ElementInterfaceUnion, Shape, ShapeDataInterface, SVGElementInterface, Transformer, Vector3 } from '../../types';
import DynamicPropertyContainer from '../../utils/helpers/DynamicPropertyContainer';
import DashProperty from '../../utils/shapes/DashProperty';
import GradientProperty from '../../utils/shapes/GradientProperty';
import ShapeCollection from '../../utils/shapes/ShapeCollection';
import ShapePath from '../../utils/shapes/ShapePath';
import TransformProperty from '../../utils/TransformProperty';
export declare class ShapeGroupData {
    _render?: boolean;
    gr: SVGGElement;
    it: ShapeDataInterface[];
    prevViewData: SVGElementInterface[];
    transform?: Transformer;
    constructor();
}
export declare class SVGShapeData {
    _isAnimated: boolean;
    _length?: number;
    caches: string[];
    data?: SVGShapeData;
    gr?: SVGGElement;
    hd?: boolean;
    it: ShapeDataInterface[];
    localShapeCollection?: ShapeCollection;
    lStr: string;
    lvl: number;
    pathsData: ShapePath[];
    prevViewData: SVGElementInterface[];
    sh: ShapeProperty;
    shape?: ShapeProperty;
    style?: SVGStyleData;
    styles: SVGStyleData[];
    transform?: Transformer;
    transformers: Transformer[];
    ty?: ShapeType;
    constructor(transformers: Transformer[], level: number, shape: ShapeProperty);
    setAsAnimated(): void;
}
export declare class SVGTransformData {
    _isAnimated: boolean;
    elements: ElementInterfaceIntersect[];
    gr?: SVGGElement;
    it?: ShapeDataInterface[];
    prevViewData?: SVGElementInterface[];
    style?: SVGStyleData;
    transform: Transformer;
    constructor(mProps: TransformProperty, op: ValueProperty, container: SVGGElement);
}
export declare class SVGStyleData {
    _mdf: boolean;
    closed: boolean;
    d: string;
    data: Shape;
    gr?: SVGGElement;
    hd?: boolean;
    it?: ShapeDataInterface[];
    lvl: number;
    msElem: null | SVGMaskElement | SVGPathElement;
    pElem: SVGPathElement;
    prevViewData?: SVGElementInterface[];
    pt?: AnimatedProperty;
    style?: SVGStyleData;
    t?: number;
    transform?: Transformer;
    ty?: ShapeType;
    type?: ShapeType;
    constructor(data: Shape, level: number);
    reset(): void;
}
export declare class ProcessedElement {
    elem: ElementInterfaceUnion;
    pos: number;
    constructor(element: ElementInterfaceUnion, position: number);
}
export declare class SVGGradientFillStyleData extends DynamicPropertyContainer {
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
    constructor(elem: ElementInterfaceUnion, data: Shape, styleData: SVGStyleData);
    initGradientData(elem: ElementInterfaceUnion, data: Shape, styleData: SVGStyleData): void;
    setGradientData(pathElement: SVGElement, data: Shape): void;
    setGradientOpacity(data: Shape, styleData: SVGStyleData): void;
}
export declare class SVGGradientStrokeStyleData extends SVGGradientFillStyleData {
    c?: MultiDimensionalProperty<Vector3>;
    d: DashProperty;
    w?: ValueProperty;
    constructor(elem: ElementInterfaceUnion, data: Shape, styleData: SVGStyleData);
}
export declare class SVGFillStyleData extends DynamicPropertyContainer {
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
export declare class SVGStrokeStyleData extends SVGFillStyleData {
    d: DashProperty;
    constructor(elem: ElementInterfaceUnion, data: Shape, styleObj: SVGStyleData);
}
export declare class SVGNoStyleData extends DynamicPropertyContainer {
    gr?: SVGGElement;
    it: ShapeDataInterface[];
    prevViewData: SVGElementInterface[];
    style: SVGStyleData;
    transform?: Transformer;
    constructor(elem: ElementInterfaceUnion, _data: SVGShapeData, styleObj: SVGStyleData);
}
