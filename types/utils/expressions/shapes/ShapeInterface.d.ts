import type { ShapeData } from '../../../elements/helpers/shapes/ShapeData';
import type { ShapeGroupData } from '../../../elements/helpers/shapes/ShapeGroupData';
import type { SVGFillStyleData } from '../../../elements/helpers/shapes/SVGFillStyleData';
import type { SVGGradientFillStyleData } from '../../../elements/helpers/shapes/SVGGradientFillStyleData';
import type { SVGShapeData } from '../../../elements/helpers/shapes/SVGShapeData';
import type { SVGStrokeStyleData } from '../../../elements/helpers/shapes/SVGStrokeStyleData';
import type { SVGTransformData } from '../../../elements/helpers/shapes/SVGTransformData';
import type { Shape } from '../../../types';
import type { LayerExpressionInterface } from '../../../utils/expressions/LayerInterface';
import type { RepeaterModifier } from '../../../utils/shapes/modifiers/RepeaterModifier';
import type { RoundCornersModifier } from '../../../utils/shapes/modifiers/RoundCornersModifier';
import type { TrimModifier } from '../../../utils/shapes/modifiers/TrimModifier';
import { PropertyGroupFactory } from '../../../utils/expressions/PropertyGroupFactory';
import { ShapePathInterface } from '../../../utils/expressions/shapes/ShapePathInterface';
export declare class ShapeExpressionInterface {
    _name: string;
    arr: never[];
    interfaces: ShapePathInterface[];
    numProperties: number;
    parentGroup: LayerExpressionInterface;
    propertyGroup: PropertyGroupFactory;
    constructor(shapes: Shape[], view: ShapeGroupData, propertyGroup: LayerExpressionInterface);
    contentsInterfaceFactory(shape: Shape, view: ShapeGroupData, propertyGroup: PropertyGroupFactory): (value: string | number) => ShapePathInterface | null | undefined;
    defaultInterfaceFactory(): () => null;
    ellipseInterfaceFactory(shape: Shape, view: SVGShapeData, propertyGroup: PropertyGroupFactory): (value: string | number) => (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Float32Array<ArrayBuffer> | Int16Array<ArrayBuffer> | Uint8ClampedArray<ArrayBuffer>) | null;
    fillInterfaceFactory(shape: Shape, view: SVGFillStyleData, propertyGroup: PropertyGroupFactory): (val: string | number) => (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Float32Array<ArrayBuffer> | Int16Array<ArrayBuffer> | Uint8ClampedArray<ArrayBuffer>) | null;
    getInterface(valueFromProps?: string | number): PropertyGroupFactory;
    gradientFillInterfaceFactory(shape: Shape, view: SVGGradientFillStyleData, propertyGroup: PropertyGroupFactory): (val: string | number) => (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Float32Array<ArrayBuffer> | Int16Array<ArrayBuffer> | Uint8ClampedArray<ArrayBuffer>) | null;
    groupInterfaceFactory(shape: Shape, view: ShapeGroupData, propertyGroup: PropertyGroupFactory): (value: string | number) => import("../../../types").Transformer | ((value: string | number) => ShapePathInterface | null) | undefined;
    iterateElements(shapes: null | Shape[], view: ShapeGroupData | ShapeGroupData[], propertyGroup: PropertyGroupFactory): ShapePathInterface[];
    parentGroupWrapper(): LayerExpressionInterface;
    rectInterfaceFactory(shape: Shape, view: SVGShapeData, propertyGroup: PropertyGroupFactory): (value: string | number) => (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Float32Array<ArrayBuffer> | Int16Array<ArrayBuffer> | Uint8ClampedArray<ArrayBuffer>) | null;
    repeaterInterfaceFactory(shape: Shape, view: RepeaterModifier, propertyGroup: LayerExpressionInterface): (value: string | number) => (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Float32Array<ArrayBuffer> | Int16Array<ArrayBuffer> | Uint8ClampedArray<ArrayBuffer>) | null;
    roundedInterfaceFactory(shape: Shape, view: RoundCornersModifier, propertyGroup: PropertyGroupFactory): (value: string | number) => (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Float32Array<ArrayBuffer> | Int16Array<ArrayBuffer> | Uint8ClampedArray<ArrayBuffer>) | null;
    starInterfaceFactory(shape: Shape, view: ShapeData, propertyGroup: PropertyGroupFactory): (value: string | number) => (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Float32Array<ArrayBuffer> | Int16Array<ArrayBuffer> | Uint8ClampedArray<ArrayBuffer>) | null;
    strokeInterfaceFactory(shape: Shape, view: SVGStrokeStyleData, propertyGroup: PropertyGroupFactory): (val: string | number) => (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Float32Array<ArrayBuffer> | Int16Array<ArrayBuffer> | Uint8ClampedArray<ArrayBuffer>) | null;
    transformInterfaceFactory(shape: Shape, view: SVGTransformData | SVGFillStyleData, propertyGroup: PropertyGroupFactory): (value: string | number) => (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Float32Array<ArrayBuffer> | Int16Array<ArrayBuffer> | Uint8ClampedArray<ArrayBuffer>) | null;
    trimInterfaceFactory(shape: Shape, view: TrimModifier, propertyGroup: PropertyGroupFactory): (val: string | number) => (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Float32Array<ArrayBuffer> | Int16Array<ArrayBuffer> | Uint8ClampedArray<ArrayBuffer>) | null;
    private noOp;
}
