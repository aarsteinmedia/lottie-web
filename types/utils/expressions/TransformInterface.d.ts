import type { TransformProperty } from '../../utils/properties/TransformProperty';
export default class TransformExpressionInterface {
    transform: TransformProperty;
    get anchorPoint(): (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Float32Array<ArrayBuffer> | Int16Array<ArrayBuffer> | Uint8ClampedArray<ArrayBuffer>);
    get opacity(): (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Float32Array<ArrayBuffer> | Int16Array<ArrayBuffer> | Uint8ClampedArray<ArrayBuffer>);
    get orientation(): (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Float32Array<ArrayBuffer> | Int16Array<ArrayBuffer> | Uint8ClampedArray<ArrayBuffer>);
    get position(): Number | Float32Array<ArrayBuffer> | Int16Array<ArrayBuffer> | Uint8ClampedArray<ArrayBuffer> | {
        mult: number;
        pv: number;
        v: number;
    } | (number | Number | number[] | Float32Array<ArrayBuffer> | Int16Array<ArrayBuffer> | Uint8ClampedArray<ArrayBuffer> | {
        mult: number;
        pv: number;
        v: number;
    } | undefined)[] | undefined;
    get rotation(): (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Float32Array<ArrayBuffer> | Int16Array<ArrayBuffer> | Uint8ClampedArray<ArrayBuffer>);
    get scale(): (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Float32Array<ArrayBuffer> | Int16Array<ArrayBuffer> | Uint8ClampedArray<ArrayBuffer>);
    get skew(): (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Float32Array<ArrayBuffer> | Int16Array<ArrayBuffer> | Uint8ClampedArray<ArrayBuffer>);
    get skewAxis(): (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Float32Array<ArrayBuffer> | Int16Array<ArrayBuffer> | Uint8ClampedArray<ArrayBuffer>);
    get xPosition(): (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Float32Array<ArrayBuffer> | Int16Array<ArrayBuffer> | Uint8ClampedArray<ArrayBuffer>);
    get xRotation(): (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Float32Array<ArrayBuffer> | Int16Array<ArrayBuffer> | Uint8ClampedArray<ArrayBuffer>);
    get yPosition(): (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Float32Array<ArrayBuffer> | Int16Array<ArrayBuffer> | Uint8ClampedArray<ArrayBuffer>);
    get yRotation(): (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Float32Array<ArrayBuffer> | Int16Array<ArrayBuffer> | Uint8ClampedArray<ArrayBuffer>);
    get zPosition(): (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Float32Array<ArrayBuffer> | Int16Array<ArrayBuffer> | Uint8ClampedArray<ArrayBuffer>);
    get zRotation(): (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Float32Array<ArrayBuffer> | Int16Array<ArrayBuffer> | Uint8ClampedArray<ArrayBuffer>);
    private _px;
    private _py;
    private _pz;
    private _transformFactory;
    constructor(transform: TransformProperty);
    getInterface(name: string | number): Number | Float32Array<ArrayBuffer> | Int16Array<ArrayBuffer> | Uint8ClampedArray<ArrayBuffer> | (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Float32Array<ArrayBuffer> | Int16Array<ArrayBuffer> | Uint8ClampedArray<ArrayBuffer>) | {
        mult: number;
        pv: number;
        v: number;
    } | (number | Number | number[] | Float32Array<ArrayBuffer> | Int16Array<ArrayBuffer> | Uint8ClampedArray<ArrayBuffer> | {
        mult: number;
        pv: number;
        v: number;
    } | undefined)[] | null | undefined;
}
