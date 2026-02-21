import type { Transformer, TransformSequence } from '../../../types';
export declare class ShapeTransformManager {
    sequenceList: TransformSequence[];
    sequences: TransformSequence;
    transform_key_count: number;
    constructor();
    addTransformSequence(transforms: {
        transform: Transformer;
    }[]): Transformer;
    getNewKey(): string;
    processSequence(sequence: TransformSequence, isFirstFrame?: boolean): void;
    processSequences(isFirstFrame?: boolean): void;
}
