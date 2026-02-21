import type { Vector3 } from '../../../types';
import type { MultiDimensionalProperty } from '../../../utils/properties/MultiDimensionalProperty';
import type { ValueProperty } from '../../../utils/properties/ValueProperty';
import { BaseInterface } from '../../../utils/expressions/shapes/BaseInterface';
export declare class FillInterface extends BaseInterface {
    c?: MultiDimensionalProperty<Vector3>;
    o?: ValueProperty;
    get color(): (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Float32Array<ArrayBuffer> | Int16Array<ArrayBuffer> | Uint8ClampedArray<ArrayBuffer>);
    get opacity(): (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Float32Array<ArrayBuffer> | Int16Array<ArrayBuffer> | Uint8ClampedArray<ArrayBuffer>);
    getInterface(val: string | number): (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Float32Array<ArrayBuffer> | Int16Array<ArrayBuffer> | Uint8ClampedArray<ArrayBuffer>) | null;
}
