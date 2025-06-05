import type TrimModifier from '../../../utils/shapes/modifiers/TrimModifier';
import BaseInterface from '../../../utils/expressions/shapes/BaseInterface';
export default class TrimInterface extends BaseInterface {
    prop?: TrimModifier;
    get end(): (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Uint8ClampedArray<ArrayBuffer> | Int16Array<ArrayBuffer> | Float32Array<ArrayBuffer>);
    get offset(): (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Uint8ClampedArray<ArrayBuffer> | Int16Array<ArrayBuffer> | Float32Array<ArrayBuffer>);
    get start(): (() => {
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
