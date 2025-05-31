import type ShapeData from '../../../elements/helpers/shapes/ShapeData';
import type ShapeGroupData from '../../../elements/helpers/shapes/ShapeGroupData';
import type SVGFillStyleData from '../../../elements/helpers/shapes/SVGFillStyleData';
import type SVGGradientFillStyleData from '../../../elements/helpers/shapes/SVGGradientFillStyleData';
import type SVGShapeData from '../../../elements/helpers/shapes/SVGShapeData';
import type SVGStrokeStyleData from '../../../elements/helpers/shapes/SVGStrokeStyleData';
import type SVGTransformData from '../../../elements/helpers/shapes/SVGTransformData';
import type { Shape } from '../../../types';
import type LayerExpressionInterface from '../../../utils/expressions/LayerInterface';
import type RepeaterModifier from '../../../utils/shapes/RepeaterModifier';
import type TrimModifier from '../../../utils/shapes/TrimModifier';
import PropertyGroupFactory from '../../../utils/expressions/PropertyGroupFactory';
import ShapePathInterface from '../../../utils/expressions/shapes/ShapePathInterface';
export default class ShapeExpressionInterface {
    _name: string;
    arr: never[];
    interfaces: ShapePathInterface[];
    numProperties: number;
    parentGroup: LayerExpressionInterface;
    propertyGroup: PropertyGroupFactory;
    constructor(shapes: Shape[], view: ShapeGroupData, propertyGroup: LayerExpressionInterface);
    contentsInterfaceFactory(shape: Shape, view: ShapeGroupData, propertyGroup: PropertyGroupFactory): (value: string | number) => ShapePathInterface | null;
    defaultInterfaceFactory(): () => null;
    ellipseInterfaceFactory(shape: Shape, view: SVGShapeData, propertyGroup: PropertyGroupFactory): (value: string | number) => (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Uint8ClampedArray<ArrayBuffer> | Int16Array<ArrayBuffer> | Float32Array<ArrayBuffer>) | null;
    fillInterfaceFactory(shape: Shape, view: SVGFillStyleData, propertyGroup: PropertyGroupFactory): (val: string | number) => (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Uint8ClampedArray<ArrayBuffer> | Int16Array<ArrayBuffer> | Float32Array<ArrayBuffer>) | null;
    getInterface(valueFromProps: string | number): any;
    gradientFillInterfaceFactory(shape: Shape, view: SVGGradientFillStyleData, propertyGroup: PropertyGroupFactory): (val: string | number) => (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Uint8ClampedArray<ArrayBuffer> | Int16Array<ArrayBuffer> | Float32Array<ArrayBuffer>) | null;
    groupInterfaceFactory(shape: Shape, view: ShapeGroupData, propertyGroup: PropertyGroupFactory): (value: string | number) => any;
    iterateElements(shapes: null | Shape[], view: ShapeGroupData[], propertyGroup: PropertyGroupFactory): ShapePathInterface[];
    parentGroupWrapper(): LayerExpressionInterface;
    rectInterfaceFactory(shape: Shape, view: SVGShapeData, propertyGroup: PropertyGroupFactory): (value: string | number) => (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Uint8ClampedArray<ArrayBuffer> | Int16Array<ArrayBuffer> | Float32Array<ArrayBuffer>) | null;
    repeaterInterfaceFactory(shape: Shape, view: RepeaterModifier, propertyGroup: LayerExpressionInterface): {
        (value: number | string): any;
        propertyIndex: number | undefined;
        mn: string | undefined;
    };
    roundedInterfaceFactory(shape: Shape, view: any, propertyGroup: any): {
        (value: any): any;
        propertyIndex: number | undefined;
        mn: string | undefined;
    };
    starInterfaceFactory(shape: Shape, view: ShapeData, propertyGroup: PropertyGroupFactory): (value: string | number) => (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Uint8ClampedArray<ArrayBuffer> | Int16Array<ArrayBuffer> | Float32Array<ArrayBuffer>) | null;
    strokeInterfaceFactory(shape: Shape, view: SVGStrokeStyleData, propertyGroup: PropertyGroupFactory): (val: string | number) => (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Uint8ClampedArray<ArrayBuffer> | Int16Array<ArrayBuffer> | Float32Array<ArrayBuffer>) | null;
    transformInterfaceFactory(shape: Shape, view: SVGTransformData | SVGFillStyleData, propertyGroup: PropertyGroupFactory): (value: string | number) => (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Uint8ClampedArray<ArrayBuffer> | Int16Array<ArrayBuffer> | Float32Array<ArrayBuffer>) | null;
    trimInterfaceFactory(shape: Shape, view: TrimModifier, propertyGroup: PropertyGroupFactory): (val: string | number) => (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Uint8ClampedArray<ArrayBuffer> | Int16Array<ArrayBuffer> | Float32Array<ArrayBuffer>) | null;
    private noOp;
}
