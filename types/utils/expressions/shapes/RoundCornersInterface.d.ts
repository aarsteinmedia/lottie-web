import type { RoundCornersModifier } from '../../../utils/shapes/modifiers/RoundCornersModifier';
import { BaseInterface } from '../../../utils/expressions/shapes/BaseInterface';
export declare class RoundCornersInterface extends BaseInterface {
    prop?: RoundCornersModifier;
    get radius(): (() => {
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
