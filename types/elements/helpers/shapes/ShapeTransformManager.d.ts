export default class ShapeTransformManager {
    sequenceList: any[];
    sequences: any;
    transform_key_count: number;
    constructor();
    addTransformSequence(transforms: any[]): any;
    getNewKey(): string;
    processSequence(sequence: any, isFirstFrame?: boolean): void;
    processSequences(isFirstFrame?: boolean): void;
}
