import type { EllShapeProperty } from '../../../utils/shapes/properties/EllShapeProperty';
import { BaseInterface } from '../../../utils/expressions/shapes/BaseInterface';
export declare class EllipseInterface extends BaseInterface {
    prop?: EllShapeProperty;
    get position(): (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Float32Array<ArrayBuffer> | Int16Array<ArrayBuffer> | Uint8ClampedArray<ArrayBuffer>);
    get size(): (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Float32Array<ArrayBuffer> | Int16Array<ArrayBuffer> | Uint8ClampedArray<ArrayBuffer>);
    getInterface(value: string | number): (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Float32Array<ArrayBuffer> | Int16Array<ArrayBuffer> | Uint8ClampedArray<ArrayBuffer>) | null;
}
