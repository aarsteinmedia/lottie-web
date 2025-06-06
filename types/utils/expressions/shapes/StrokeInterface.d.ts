import type SVGStrokeStyleData from '../../../elements/helpers/shapes/SVGStrokeStyleData';
import BaseInterface from '../../../utils/expressions/shapes/BaseInterface';
export default class StrokeInterface extends BaseInterface {
    dashOb?: Record<PropertyKey, unknown>;
    prop?: SVGStrokeStyleData;
    get color(): (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Uint8ClampedArray<ArrayBuffer> | Int16Array<ArrayBuffer> | Float32Array<ArrayBuffer>);
    get dash(): Record<PropertyKey, unknown> | undefined;
    get opacity(): (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Uint8ClampedArray<ArrayBuffer> | Int16Array<ArrayBuffer> | Float32Array<ArrayBuffer>);
    get strokeWidth(): (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Uint8ClampedArray<ArrayBuffer> | Int16Array<ArrayBuffer> | Float32Array<ArrayBuffer>);
    getInterface(val: string | number): (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Uint8ClampedArray<ArrayBuffer> | Int16Array<ArrayBuffer> | Float32Array<ArrayBuffer>) | null;
}
