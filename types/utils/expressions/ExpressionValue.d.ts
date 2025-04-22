import type LayerExpressionInterface from '../../utils/expressions/LayerInterface';
import type { ValueProperty } from '../../utils/Properties';
export default class ExpressionValue {
    key?: (pos: number) => number;
    numKeys: number;
    propertyGroup?: LayerExpressionInterface;
    value: number | number[] | Uint8ClampedArray<ArrayBuffer> | Int16Array<ArrayBuffer> | Float32Array<ArrayBuffer> | undefined;
    velocity: number;
    constructor(elementProp: ValueProperty<number[] | number>, mult: number | undefined, type: string);
    speedAtTime(_frameNum: number): void;
    valueAtTime<T extends number | number[] = number>(_a: number, _b?: number): T;
    velocityAtTime(_frameNum: number): number;
}
