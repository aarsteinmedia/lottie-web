import { ArrayType } from '@/utils/enums';
declare const createTypedArray: (type: ArrayType, len: number) => number[] | Float32Array<ArrayBuffer> | Int16Array<ArrayBuffer> | Uint8ClampedArray<ArrayBuffer>;
declare function createSizedArray<T = unknown>(length: number): T[];
export { createSizedArray, createTypedArray };
