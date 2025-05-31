import type { BaseProperty } from '@/utils/Properties';
import { PropType } from '@/utils/enums';
export declare class ExpressionPropertyInterface {
    defaultMultidimensionalValue: {
        mult: number;
        pv: number[];
        v: number[];
    };
    defaultUnidimensionalValue: {
        mult: number;
        pv: number;
        v: number;
    };
    completeProperty(expressionValue: number | number[], property: BaseProperty, type: PropType): void;
    defaultGetter(): {
        mult: number;
        pv: number;
        v: number;
    };
    getInterface(property?: BaseProperty): (() => {
        mult: number;
        pv: number;
        v: number;
    }) | (() => Number) | (() => number[] | Uint8ClampedArray<ArrayBuffer> | Int16Array<ArrayBuffer> | Float32Array<ArrayBuffer>);
    MultidimensionalPropertyInterface(property: any): () => number[] | Uint8ClampedArray<ArrayBuffer> | Int16Array<ArrayBuffer> | Float32Array<ArrayBuffer>;
    UnidimensionalPropertyInterface(property: BaseProperty): () => Number;
}
export default function expressionPropertyFactory(property?: BaseProperty): (() => {
    mult: number;
    pv: number;
    v: number;
}) | (() => Number) | (() => number[] | Uint8ClampedArray<ArrayBuffer> | Int16Array<ArrayBuffer> | Float32Array<ArrayBuffer>);
