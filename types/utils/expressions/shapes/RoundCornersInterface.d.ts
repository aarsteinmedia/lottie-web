import type RoundCornersModifier from '../../../utils/shapes/RoundCornersModifier';
import BaseInterface from '../../../utils/expressions/shapes/BaseInterface';
export default class RoundCornersInterface extends BaseInterface {
    prop?: RoundCornersModifier;
    get radius(): (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Uint8ClampedArray<ArrayBuffer> | Int16Array<ArrayBuffer> | Float32Array<ArrayBuffer>);
    getInterface(value: string | number): (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Uint8ClampedArray<ArrayBuffer> | Int16Array<ArrayBuffer> | Float32Array<ArrayBuffer>) | null;
}
